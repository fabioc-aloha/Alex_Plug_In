#Requires -Version 7.0
<#
.SYNOPSIS
    Builds Alex VS Code Extension package from Master Alex source
.DESCRIPTION
    Orchestrates a full extension build:
      1. Version synchronization check
      2. Architecture sync via sync-architecture.cjs (canonical sync logic)
      3. Manifest generation
      4. Version verification
      5. Personal data scan (defense-in-depth beyond sync-architecture.cjs)
      6. VSIX package creation (via vsce, triggers vscode:prepublish pipeline)
      7. VSIX output verification

    The actual file copy, inheritance, exclusions, and heir decontamination
    are handled by sync-architecture.cjs (DRY -- single source of truth).
.PARAMETER SkipCompile
    Skip TypeScript compilation step
.PARAMETER DryRun
    Preview changes without actually building
.EXAMPLE
    .\build-extension-package.ps1
    .\build-extension-package.ps1 -SkipCompile -DryRun
.NOTES
    Muscle: build-extension-package
    Inheritance: master-only
    Version: 1.0.0
    Skill: vscode-extension-patterns
    Reviewed: 2026-04-15
    Platform: windows
    Requires: powershell7, node, vsce
#>

param(
    [switch]$SkipCompile,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# Paths (script is in .github/muscles/, so 2 levels up to repo root)
$RootPath = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$ExtensionPath = Join-Path $RootPath "platforms/vscode-extension"
$SourceGithub = Join-Path $RootPath ".github"
$TargetGithub = Join-Path $ExtensionPath ".github"

Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "  Alex Extension Build Script" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "Source: $SourceGithub"
Write-Host "Target: $TargetGithub"
Write-Host ""

# PERSONAL DATA PATTERNS - Fail build if found in heir
# Defense-in-depth: sync-architecture.cjs validates PII in user-profile.json,
# but this catches PII that may have leaked into markdown/json content files.
$ForbiddenPatterns = @(
    @{ 
        Pattern     = "Fabio\s+Correa|Fabio's"
        Description = "Developer's full name"
        AllowIn     = @()
    },
    @{ 
        Pattern     = "correax@|fabiocorrea@"
        Description = "Developer's email patterns"
        AllowIn     = @()
    },
    @{
        Pattern     = "Charlotte"
        Description = "Personal location reference"
        AllowIn     = @()
    },
    @{
        Pattern     = "Alex\s*\+\s*Fabio"
        Description = "Personal collaboration credit"
        AllowIn     = @()
    },
    @{
        Pattern     = "The user's name is \*\*[^*]+\*\*"
        Description = "Hardcoded user name reference"
        AllowIn     = @()
    }
)

# ------------------------------------------------------------
# Step 1: Version Synchronization Check
# ------------------------------------------------------------
Write-Host "[1/7] Validating versions..." -ForegroundColor Yellow
if (-not (Test-Path $SourceGithub)) {
    Write-Error "Source .github/ not found at $SourceGithub"
    exit 1
}

$pkg = Get-Content "$ExtensionPath/package.json" | ConvertFrom-Json
$pkgVersion = $pkg.version
Write-Host "  package.json version: $pkgVersion" -ForegroundColor Gray

$masterInstructionsPath = Join-Path $SourceGithub "copilot-instructions.md"
if (Test-Path $masterInstructionsPath) {
    $masterContent = Get-Content $masterInstructionsPath -Raw
    if ($masterContent -match '# Alex v(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)') {
        $masterVersion = $matches[1]
        Write-Host "  Master copilot-instructions.md: $masterVersion" -ForegroundColor Gray
        
        if ($pkgVersion -ne $masterVersion) {
            Write-Host "" -ForegroundColor Red
            Write-Host "  [ERROR] VERSION MISMATCH DETECTED!" -ForegroundColor Red
            Write-Host "     package.json:              $pkgVersion" -ForegroundColor Red
            Write-Host "     copilot-instructions.md:   $masterVersion" -ForegroundColor Red
            Write-Host "" -ForegroundColor Red
            Write-Host "  Fix: Update .github/copilot-instructions.md version header to $pkgVersion" -ForegroundColor Yellow
            
            if (-not $DryRun) {
                Write-Error "Build aborted due to version mismatch."
                exit 1
            }
            else {
                Write-Host "  (Continuing due to -DryRun flag)" -ForegroundColor Yellow
            }
        }
        else {
            Write-Host "  [OK] Versions synchronized" -ForegroundColor Green
        }
    }
    else {
        Write-Host "  [WARN] Could not parse version from copilot-instructions.md" -ForegroundColor Yellow
    }
}
else {
    Write-Error "Master copilot-instructions.md not found at $masterInstructionsPath"
    exit 1
}

# ------------------------------------------------------------
# Step 2: Sync Architecture (delegates to sync-architecture.cjs)
# ------------------------------------------------------------
Write-Host "[2/7] Syncing architecture (via sync-architecture.cjs)..." -ForegroundColor Yellow
if (-not $DryRun) {
    $syncScript = Join-Path $PSScriptRoot "sync-architecture.cjs"
    if (-not (Test-Path $syncScript)) {
        Write-Error "sync-architecture.cjs not found at $syncScript"
        exit 1
    }
    
    Push-Location $ExtensionPath
    try {
        node $syncScript 2>&1 | ForEach-Object { Write-Host "    $_" }
        if ($LASTEXITCODE -ne 0) {
            Write-Error "sync-architecture.cjs failed with exit code $LASTEXITCODE"
            exit 1
        }
        Write-Host "  [OK] Architecture sync complete" -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "  Skipped (--DryRun flag)" -ForegroundColor DarkGray
}

# ------------------------------------------------------------
# Step 3: Generate Manifest
# ------------------------------------------------------------
Write-Host "[3/7] Generating manifest..." -ForegroundColor Yellow

# Count files for manifest
$copiedCount = if (Test-Path $TargetGithub) {
    (Get-ChildItem $TargetGithub -Recurse -File).Count
}
else { 0 }

$manifest = @{
    generatedAt   = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    sourceCommit  = (git -C $RootPath rev-parse --short HEAD 2>$null) ?? "unknown"
    sourceVersion = $pkgVersion
    filesCopied   = $copiedCount
    syncEngine    = "sync-architecture.cjs"
}

$manifestPath = Join-Path $TargetGithub "BUILD-MANIFEST.json"
if (-not $DryRun) {
    $manifest | ConvertTo-Json -Depth 3 | Set-Content $manifestPath
    Write-Host "  Created: BUILD-MANIFEST.json ($copiedCount files)"
}

# ------------------------------------------------------------
# Step 4: Final Version Verification
# ------------------------------------------------------------
Write-Host "[4/7] Verifying heir version..." -ForegroundColor Yellow
$heirInstructionsPath = Join-Path $TargetGithub "copilot-instructions.md"
if (Test-Path $heirInstructionsPath) {
    $heirContent = Get-Content $heirInstructionsPath -Raw
    if ($heirContent -match '# Alex v(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)') {
        $heirVersion = $matches[1]
        if ($heirVersion -eq $pkgVersion) {
            Write-Host "  [OK] Heir version verified: $heirVersion" -ForegroundColor Green
        }
        else {
            Write-Host "  [ERROR] CRITICAL: Heir version ($heirVersion) != package.json ($pkgVersion)" -ForegroundColor Red
            exit 1
        }
    }
}

# ------------------------------------------------------------
# Step 5: Personal Data Scan (Defense-in-Depth)
# ------------------------------------------------------------
Write-Host "[5/7] Scanning for personal data leakage..." -ForegroundColor Yellow
$violations = @()
$scannedFiles = 0

if (-not $DryRun -and (Test-Path $TargetGithub)) {
    $heirFiles = Get-ChildItem $TargetGithub -Recurse -File -Include "*.md", "*.json" | 
    Where-Object { $_.Name -ne "BUILD-MANIFEST.json" }
    
    foreach ($file in $heirFiles) {
        $scannedFiles++
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if (-not $content) { continue }
        
        $relativePath = $file.FullName.Substring($TargetGithub.Length + 1) -replace '\\', '/'
        
        foreach ($forbidden in $ForbiddenPatterns) {
            $isAllowed = $false
            foreach ($allowPattern in $forbidden.AllowIn) {
                if ($relativePath -like $allowPattern) { $isAllowed = $true; break }
            }
            
            if (-not $isAllowed -and $content -match $forbidden.Pattern) {
                $matchedText = $matches[0]
                $violations += @{
                    File    = $relativePath
                    Pattern = $forbidden.Description
                    Match   = if ($matchedText.Length -gt 50) { $matchedText.Substring(0, 50) + "..." } else { $matchedText }
                }
            }
        }
    }
    
    Write-Host "  Scanned $scannedFiles files for personal data"
    
    if ($violations.Count -gt 0) {
        Write-Host ""
        Write-Host "  [ERROR] PERSONAL DATA DETECTED IN HEIR!" -ForegroundColor Red
        Write-Host "  ---------------------------------" -ForegroundColor Red
        foreach ($v in $violations) {
            Write-Host "  [DIR] $($v.File)" -ForegroundColor Yellow
            Write-Host "     Pattern: $($v.Pattern)" -ForegroundColor Gray
            Write-Host "     Found:   '$($v.Match)'" -ForegroundColor Red
        }
        Write-Error "Build aborted: $($violations.Count) personal data violation(s) found"
        exit 1
    }
    else {
        Write-Host "  [OK] No personal data found -- heir is clean" -ForegroundColor Green
    }
}
else {
    Write-Host "  Skipped (--DryRun flag)" -ForegroundColor DarkGray
}

# ------------------------------------------------------------
# Step 6: Create VSIX Package
# ------------------------------------------------------------
Write-Host "[6/7] Creating VSIX package..." -ForegroundColor Yellow
if ($SkipCompile) {
    Write-Host "  Skipped (--SkipCompile flag)" -ForegroundColor DarkGray
}
elseif ($DryRun) {
    Write-Host "  Skipped (--DryRun flag)" -ForegroundColor DarkGray
}
else {
    Push-Location $ExtensionPath
    try {
        # Remove stale VSIX files to avoid version confusion
        Get-ChildItem "*.vsix" -ErrorAction SilentlyContinue | Remove-Item -Force

        Write-Host "  Running: npx vsce package --no-dependencies"
        Write-Host "  (triggers vscode:prepublish: sync + clean + quality-gate + esbuild)" -ForegroundColor DarkGray
        npx vsce package --no-dependencies 2>&1 | ForEach-Object { Write-Host "    $_" }
        if ($LASTEXITCODE -ne 0) {
            Write-Error "VSIX packaging failed"
            exit 1
        }
        Write-Host "  [OK] VSIX created" -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
}

# ------------------------------------------------------------
# Step 7: Verify VSIX Output
# ------------------------------------------------------------
Write-Host "[7/7] Verifying VSIX..." -ForegroundColor Yellow
if ($SkipCompile -or $DryRun) {
    Write-Host "  Skipped (no VSIX to verify)" -ForegroundColor DarkGray
}
else {
    $vsixFile = Get-ChildItem "$ExtensionPath\*.vsix" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $vsixFile) {
        Write-Error "VSIX file not found after packaging"
        exit 1
    }

    $vsixSizeMB = [math]::Round($vsixFile.Length / 1MB, 2)
    Write-Host "  File: $($vsixFile.Name)" -ForegroundColor Gray
    Write-Host "  Size: $vsixSizeMB MB" -ForegroundColor Gray

    # Verify version in filename matches package.json
    if ($vsixFile.Name -match '(\d+\.\d+\.\d+)') {
        $vsixVersion = $matches[1]
        if ($vsixVersion -ne $pkgVersion) {
            Write-Error "VSIX version ($vsixVersion) != package.json ($pkgVersion)"
            exit 1
        }
        Write-Host "  [OK] Version verified: $vsixVersion" -ForegroundColor Green
    }
}

# ------------------------------------------------------------
# Summary
# ------------------------------------------------------------
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Green
Write-Host "  Build Complete!" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Green
Write-Host ""
Write-Host "Files in heir: $copiedCount"
Write-Host "Target:        $TargetGithub"
Write-Host "Version:       $pkgVersion [OK]"

if (-not $SkipCompile -and -not $DryRun) {
    $vsixOut = Get-ChildItem "$ExtensionPath\*.vsix" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($vsixOut) {
        Write-Host "VSIX:          $($vsixOut.Name)"
    }
}

Write-Host ""

if ($DryRun) {
    Write-Host "NOTE: This was a dry run. No files were modified." -ForegroundColor Yellow
}
else {
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run .\scripts\release-preflight.ps1 to verify release readiness" -ForegroundColor Gray
    Write-Host "  2. Run .\scripts\release-vscode.ps1 to publish" -ForegroundColor Gray
    Write-Host ""
}
