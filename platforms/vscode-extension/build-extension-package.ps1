<#
.SYNOPSIS
    Build script for Alex Cognitive Architecture VS Code Extension
    
.DESCRIPTION
    This script prepares the extension for packaging by:
    1. Copying root .github/ to extension folder (source of truth → distribution)
    2. Excluding development-specific files (ISSUE_TEMPLATE, dream reports, etc.)
    3. Running npm compile and package
    
.NOTES
    Per COMEBACK-PLAN.md: Root .github/ is source of truth, extension .github/ is generated
    
.EXAMPLE
    .\build-extension-package.ps1
    .\build-extension-package.ps1 -SkipNpmPackage
#>

param(
    [switch]$SkipNpmPackage,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

# Paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = (Resolve-Path "$ScriptDir\..\..").Path
$ExtensionDir = $ScriptDir
$RootGitHub = Join-Path $RootDir ".github"
$ExtGitHub = Join-Path $ExtensionDir ".github"

Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "  Alex Extension Build Script" -ForegroundColor Cyan
Write-Host "  v3.6.0 Dawn" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host ""

# Verify we're in the right place
if (-not (Test-Path (Join-Path $ExtensionDir "package.json"))) {
    Write-Error "This script must be run from the extension directory (platforms/vscode-extension)"
    exit 1
}

if (-not (Test-Path $RootGitHub)) {
    Write-Error "Root .github/ not found at: $RootGitHub"
    exit 1
}

Write-Host "📁 Root .github/: $RootGitHub" -ForegroundColor Gray
Write-Host "📁 Extension dir: $ExtensionDir" -ForegroundColor Gray
Write-Host ""

# Step 1: Clean existing extension .github/
Write-Host "🧹 Step 1: Cleaning existing extension .github/..." -ForegroundColor Yellow
if (Test-Path $ExtGitHub) {
    Remove-Item -Path $ExtGitHub -Recurse -Force
    Write-Host "   Removed existing .github/ folder" -ForegroundColor Gray
}

# Step 2: Copy root .github/ to extension
Write-Host "📋 Step 2: Copying root .github/ to extension..." -ForegroundColor Yellow
Copy-Item -Path $RootGitHub -Destination $ExtGitHub -Recurse -Force

# Step 3: Remove development-specific files/folders
Write-Host "🗑️  Step 3: Removing development-specific files..." -ForegroundColor Yellow

$excludeItems = @(
    # GitHub repo-specific (not needed for user projects)
    "ISSUE_TEMPLATE",
    "pull_request_template.md",
    
    # Session-specific files (unique to Master Alex)
    "episodic\*",  # Clean slate - no episodic memories
    
    # User-specific configs (should start fresh)
    "config\cognitive-config.json",
    "config\user-profile.json",
    "config\USER-PROFILE.md",
    "config\USER-PROFILE-TEMPLATE.md",
    "config\MASTER-ALEX-PROTECTED.json",
    
    # Master-only skills (not for heirs - these manage Master Alex specifically)
    "skills\heir-curation",
    "skills\master-alex-audit",
    
    # Assets that are repo-specific
    "assets\banner.svg"
)

foreach ($item in $excludeItems) {
    $itemPath = Join-Path $ExtGitHub $item
    
    # Handle wildcards
    if ($item -match "\*") {
        $parentDir = Split-Path -Parent $itemPath
        $pattern = Split-Path -Leaf $itemPath
        if (Test-Path $parentDir) {
            $foundItems = Get-ChildItem -Path $parentDir -Filter $pattern -ErrorAction SilentlyContinue
            foreach ($match in $foundItems) {
                Remove-Item -Path $match.FullName -Force
                Write-Host "   Removed: $($match.Name)" -ForegroundColor Gray
            }
        }
    }
    else {
        if (Test-Path $itemPath) {
            Remove-Item -Path $itemPath -Recurse -Force
            Write-Host "   Removed: $item" -ForegroundColor Gray
        }
    }
}

# Step 3b: Clean broken synapse references to removed master-only skills
$removedSkills = @("heir-curation", "master-alex-audit")
$synapseFiles = Get-ChildItem "$ExtGitHub\skills\*\synapses.json" -ErrorAction SilentlyContinue
$cleanedCount = 0
foreach ($sf in $synapseFiles) {
    $json = Get-Content $sf.FullName -Raw | ConvertFrom-Json
    $original = $json.connections.Count
    $json.connections = @($json.connections | Where-Object {
            $target = $_.target
            $keep = $true
            foreach ($removed in $removedSkills) {
                if ($target -match $removed) { $keep = $false; break }
            }
            $keep
        })
    if ($json.connections.Count -lt $original) {
        $json | ConvertTo-Json -Depth 10 | Set-Content $sf.FullName -Encoding UTF8
        $cleanedCount++
    }
}
if ($cleanedCount -gt 0) {
    Write-Host "   Cleaned $cleanedCount synapse files (removed refs to master-only skills)" -ForegroundColor Gray
}

# Step 4: Verify essential files exist
Write-Host "✅ Step 4: Verifying essential files..." -ForegroundColor Yellow

$requiredFiles = @(
    "copilot-instructions.md",
    "instructions",
    "prompts",
    "skills"
)

$allPresent = $true
foreach ($file in $requiredFiles) {
    $filePath = Join-Path $ExtGitHub $file
    if (Test-Path $filePath) {
        Write-Host "   ✓ $file" -ForegroundColor Green
    }
    else {
        Write-Host "   ✗ $file MISSING!" -ForegroundColor Red
        $allPresent = $false
    }
}

if (-not $allPresent) {
    Write-Error "Essential files missing! Build aborted."
    exit 1
}

# Count files
$fileCount = (Get-ChildItem -Path $ExtGitHub -Recurse -File).Count
Write-Host "   Total files in extension .github/: $fileCount" -ForegroundColor Cyan

# Step 4b: Personal data validation
Write-Host "🔍 Step 4b: Scanning for personal data leakage..." -ForegroundColor Yellow

$ForbiddenPatterns = @(
    @{ Pattern = "Fabio\s+Correa|Fabio's"; Description = "Developer's full name" },
    @{ Pattern = "correax@|fabiocorrea@"; Description = "Personal email pattern" },
    @{ Pattern = "Charlotte"; Description = "Personal location reference" },
    @{ Pattern = "Alex\s*\+\s*Fabio"; Description = "Personal collaboration credit" },
    @{ Pattern = "The user's name is \*\*[^*]+\*\*"; Description = "Hardcoded user name" }
)

$violations = @()
$heirFiles = Get-ChildItem $ExtGitHub -Recurse -File -Include "*.md", "*.json" | 
Where-Object { $_.Name -ne "BUILD-MANIFEST.json" }

foreach ($file in $heirFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $relativePath = $file.FullName.Substring($ExtGitHub.Length + 1) -replace '\\', '/'
    
    foreach ($forbidden in $ForbiddenPatterns) {
        if ($content -match $forbidden.Pattern) {
            $matchedText = $matches[0]
            $violations += @{
                File    = $relativePath
                Pattern = $forbidden.Description
                Match   = if ($matchedText.Length -gt 50) { $matchedText.Substring(0, 50) + "..." } else { $matchedText }
            }
        }
    }
}

if ($violations.Count -gt 0) {
    Write-Host ""
    Write-Host "   ❌ PERSONAL DATA DETECTED IN HEIR!" -ForegroundColor Red
    Write-Host ""
    
    foreach ($v in $violations) {
        Write-Host "   📁 $($v.File)" -ForegroundColor Yellow
        Write-Host "      Pattern: $($v.Pattern)" -ForegroundColor Gray
        Write-Host "      Found:   '$($v.Match)'" -ForegroundColor Red
        Write-Host ""
    }
    
    Write-Host "   Fix: Edit the source files to remove personal data," -ForegroundColor Yellow
    Write-Host "        or add files to exclusion list if they shouldn't be in heir." -ForegroundColor Yellow
    Write-Host ""
    Write-Error "Build aborted: $($violations.Count) personal data violation(s) found"
    exit 1
}
else {
    Write-Host "   ✓ No personal data found - heir is clean" -ForegroundColor Green
}

# Step 5: Run npm compile
Write-Host "🔨 Step 5: Compiling TypeScript..." -ForegroundColor Yellow
Push-Location $ExtensionDir
try {
    npm run compile
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm run compile failed!"
        exit 1
    }
    Write-Host "   Compilation successful" -ForegroundColor Green
}
finally {
    Pop-Location
}

# Step 6: Package extension (optional)
if (-not $SkipNpmPackage) {
    Write-Host "📦 Step 6: Packaging extension..." -ForegroundColor Yellow
    Push-Location $ExtensionDir
    try {
        npm run package
        if ($LASTEXITCODE -ne 0) {
            Write-Error "npm run package failed!"
            exit 1
        }
        
        # Find the generated .vsix file
        $vsix = Get-ChildItem -Path $ExtensionDir -Filter "*.vsix" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($vsix) {
            Write-Host "   Package created: $($vsix.Name)" -ForegroundColor Green
            Write-Host "   Size: $([math]::Round($vsix.Length / 1KB, 2)) KB" -ForegroundColor Gray
        }
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "⏭️  Step 6: Skipping npm package (--SkipNpmPackage)" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "  Build Complete! 🎉" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Test with F5 (Extension Development Host)" -ForegroundColor Gray
Write-Host "  2. Install .vsix in sandbox: code --install-extension <file>.vsix" -ForegroundColor Gray
Write-Host "  3. Test Alex: Initialize in a fresh workspace" -ForegroundColor Gray
Write-Host "  4. Run 'Alex: Validate Heir (LLM Curation Check)' for semantic validation" -ForegroundColor Gray
Write-Host ""
