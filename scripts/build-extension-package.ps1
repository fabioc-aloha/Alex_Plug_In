# build-extension-package.ps1
# Builds Alex VS Code Extension package from Master Alex source
#
# This script copies the cognitive architecture from root .github/ to the
# extension's .github/ folder, applying appropriate exclusions for
# development-specific files.
#
# Usage: .\scripts\build-extension-package.ps1 [-SkipCompile] [-Verbose]

param(
    [switch]$SkipCompile,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# Paths
$RootPath = Split-Path $PSScriptRoot -Parent
$ExtensionPath = Join-Path $RootPath "platforms/vscode-extension"
$SourceGithub = Join-Path $RootPath ".github"
$TargetGithub = Join-Path $ExtensionPath ".github"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Alex Extension Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Source: $SourceGithub"
Write-Host "Target: $TargetGithub"
Write-Host ""

# Files/folders to EXCLUDE from heir (development-specific)
$Exclusions = @(
    # GitHub repo features (not needed in user projects)
    "ISSUE_TEMPLATE",
    "PULL_REQUEST_TEMPLATE.md",
    "FUNDING.yml",
    "dependabot.yml",
    "workflows",
    
    # Session-specific files (unique to Master Alex)
    "episodic/dream-report-*.md",
    "episodic/meditation-session-*.md",
    
    # Development config
    "config/cognitive-config.json",
    
    # Master-only protection marker (CRITICAL: never copy to heirs)
    "config/MASTER-ALEX-PROTECTED.json",
    
    # Master-only skills (not inheritable)
    "skills/meditation",
    "skills/meditation-facilitation", 
    "skills/knowledge-synthesis",
    "skills/global-knowledge",
    "skills/architecture-refinement",
    "skills/llm-model-selection",
    "skills/self-actualization",
    "skills/heir-curation",
    "skills/master-alex-audit"
)

# Skills explicitly marked as inheritable (copy these)
# Note: We copy all skills EXCEPT master-only ones listed above

function Test-ShouldExclude {
    param([string]$RelativePath)
    
    # Normalize path separators to forward slashes for consistent matching
    $normalizedPath = $RelativePath -replace '\\', '/'
    
    foreach ($pattern in $Exclusions) {
        # Handle wildcards
        if ($pattern -match '\*') {
            $regexPattern = "^" + ($pattern -replace '\*', '.*') + "$"
            if ($normalizedPath -match $regexPattern) {
                return $true
            }
        }
        # Handle exact matches and folder prefixes
        elseif ($normalizedPath -eq $pattern -or $normalizedPath.StartsWith("$pattern/")) {
            return $true
        }
    }
    return $false
}

# Step 1: Validate source and VERSION SYNCHRONIZATION
Write-Host "[1/6] Validating source and versions..." -ForegroundColor Yellow
if (-not (Test-Path $SourceGithub)) {
    Write-Error "Source .github/ not found at $SourceGithub"
    exit 1
}

# VERSION SYNCHRONIZATION CHECK (Critical for avoiding upgrade message bugs)
$pkg = Get-Content "$ExtensionPath/package.json" | ConvertFrom-Json
$pkgVersion = $pkg.version
Write-Host "  package.json version: $pkgVersion" -ForegroundColor Gray

$masterInstructionsPath = Join-Path $SourceGithub "copilot-instructions.md"
if (Test-Path $masterInstructionsPath) {
    $masterContent = Get-Content $masterInstructionsPath -Raw
    if ($masterContent -match '\*\*Version\*\*:\s*(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)') {
        $masterVersion = $matches[1]
        Write-Host "  Master copilot-instructions.md: $masterVersion" -ForegroundColor Gray
        
        if ($pkgVersion -ne $masterVersion) {
            Write-Host "" -ForegroundColor Red
            Write-Host "  ❌ VERSION MISMATCH DETECTED!" -ForegroundColor Red
            Write-Host "     package.json:              $pkgVersion" -ForegroundColor Red
            Write-Host "     copilot-instructions.md:   $masterVersion" -ForegroundColor Red
            Write-Host "" -ForegroundColor Red
            Write-Host "  Fix: Update .github/copilot-instructions.md **Version** to $pkgVersion" -ForegroundColor Yellow
            Write-Host "" -ForegroundColor Red
            
            if (-not $DryRun) {
                Write-Error "Build aborted due to version mismatch. The upgrade dialog will show incorrect 'from' version if not fixed."
                exit 1
            }
            else {
                Write-Host "  (Continuing due to -DryRun flag)" -ForegroundColor Yellow
            }
        }
        else {
            Write-Host "  ✅ Versions synchronized" -ForegroundColor Green
        }
    }
    else {
        Write-Host "  ⚠️ Could not parse version from copilot-instructions.md" -ForegroundColor Yellow
    }
}
else {
    Write-Error "Master copilot-instructions.md not found at $masterInstructionsPath"
    exit 1
}

$sourceFiles = Get-ChildItem $SourceGithub -Recurse -File
Write-Host "  Found $($sourceFiles.Count) files in source"

# Step 2: Clean target (if not dry run)
Write-Host "[2/6] Preparing target..." -ForegroundColor Yellow
if (-not $DryRun) {
    if (Test-Path $TargetGithub) {
        Write-Host "  Removing existing $TargetGithub"
        Remove-Item $TargetGithub -Recurse -Force
    }
    New-Item $TargetGithub -ItemType Directory -Force | Out-Null
}

# Step 3: Copy files with exclusions
Write-Host "[3/6] Copying files..." -ForegroundColor Yellow
$copied = 0
$excluded = 0

foreach ($file in $sourceFiles) {
    $relativePath = $file.FullName.Substring($SourceGithub.Length + 1)
    
    if (Test-ShouldExclude $relativePath) {
        $excluded++
        if ($VerbosePreference -eq 'Continue') {
            Write-Host "  SKIP: $relativePath" -ForegroundColor DarkGray
        }
        continue
    }
    
    $targetFile = Join-Path $TargetGithub $relativePath
    $targetDir = Split-Path $targetFile -Parent
    
    if (-not $DryRun) {
        if (-not (Test-Path $targetDir)) {
            New-Item $targetDir -ItemType Directory -Force | Out-Null
        }
        Copy-Item $file.FullName $targetFile -Force
    }
    
    $copied++
    if ($VerbosePreference -eq 'Continue') {
        Write-Host "  COPY: $relativePath" -ForegroundColor Green
    }
}

Write-Host "  Copied: $copied files"
Write-Host "  Excluded: $excluded files"

# Step 4: Generate manifest
Write-Host "[4/6] Generating manifest..." -ForegroundColor Yellow
$manifest = @{
    generatedAt       = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    sourceCommit      = (git -C $RootPath rev-parse --short HEAD 2>$null) ?? "unknown"
    sourceVersion     = (Get-Content "$RootPath/platforms/vscode-extension/package.json" | ConvertFrom-Json).version
    filesCopied       = $copied
    filesExcluded     = $excluded
    exclusionPatterns = $Exclusions
}

$manifestPath = Join-Path $TargetGithub "BUILD-MANIFEST.json"
if (-not $DryRun) {
    $manifest | ConvertTo-Json -Depth 3 | Set-Content $manifestPath
    Write-Host "  Created: BUILD-MANIFEST.json"
}

# Step 5: Compile extension (unless skipped)
Write-Host "[5/6] Building extension..." -ForegroundColor Yellow
if ($SkipCompile) {
    Write-Host "  Skipped (--SkipCompile flag)" -ForegroundColor DarkGray
}
elseif ($DryRun) {
    Write-Host "  Skipped (--DryRun flag)" -ForegroundColor DarkGray
}
else {
    Push-Location $ExtensionPath
    try {
        Write-Host "  Running: npm run compile"
        npm run compile 2>&1 | ForEach-Object { Write-Host "    $_" }
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Compilation failed"
            exit 1
        }
        Write-Host "  Compilation successful" -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
}

# Step 6: Final version verification
Write-Host "[6/6] Verifying final state..." -ForegroundColor Yellow
$heirInstructionsPath = Join-Path $TargetGithub "copilot-instructions.md"
if (Test-Path $heirInstructionsPath) {
    $heirContent = Get-Content $heirInstructionsPath -Raw
    if ($heirContent -match '\*\*Version\*\*:\s*(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)') {
        $heirVersion = $matches[1]
        if ($heirVersion -eq $pkgVersion) {
            Write-Host "  ✅ Heir version verified: $heirVersion" -ForegroundColor Green
        }
        else {
            Write-Host "  ❌ CRITICAL: Heir version ($heirVersion) != package.json ($pkgVersion)" -ForegroundColor Red
            Write-Host "     This should not happen - file copy may have failed!" -ForegroundColor Red
            exit 1
        }
    }
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files copied:   $copied"
Write-Host "Files excluded: $excluded"
Write-Host "Target:         $TargetGithub"
Write-Host "Version:        $pkgVersion ✓"
Write-Host ""

if ($DryRun) {
    Write-Host "NOTE: This was a dry run. No files were modified." -ForegroundColor Yellow
}
else {
    Write-Host "Next: Run .\scripts\release-preflight.ps1 to verify release readiness" -ForegroundColor Cyan
}
