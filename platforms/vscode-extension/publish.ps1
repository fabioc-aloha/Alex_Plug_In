# publish.ps1
# Publishes Alex Cognitive Architecture to VS Code Marketplace
#
# Usage:
#   .\publish.ps1                      # Publish as pre-release (beta)
#   .\publish.ps1 -Stable              # Publish as stable release
#   .\publish.ps1 -PackageOnly         # Package without publishing
#   .\publish.ps1 -SkipGit             # Skip git add/commit/push
#   .\publish.ps1 -NoConfirm           # Skip confirmation prompt
#   .\publish.ps1 -BumpMajor           # Bump major version (X.0.0)
#   .\publish.ps1 -BumpMinor           # Bump minor version (0.X.0)
#   .\publish.ps1 -BumpPatch           # Bump patch version (0.0.X)
#   .\publish.ps1 -Version "3.8.0"     # Set specific version

param(
    [switch]$Stable,
    [switch]$PackageOnly,
    [switch]$SkipGit,
    [switch]$NoConfirm,
    [switch]$BumpMajor,
    [switch]$BumpMinor,
    [switch]$BumpPatch,
    [string]$Version
)

$ErrorActionPreference = "Stop"

# Ensure we're in the right directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "`n🚀 Alex Cognitive Architecture - Publish Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Load PAT from .env file
$envFile = Join-Path $scriptDir ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*VSCE_PAT\s*=\s*(.+)$") {
            $env:VSCE_PAT = $Matches[1].Trim()
            Write-Host "✅ Loaded PAT from .env" -ForegroundColor Green
        }
    }
}
else {
    Write-Host "❌ .env file not found at $envFile" -ForegroundColor Red
    Write-Host "   Create .env with: VSCE_PAT=your-token-here" -ForegroundColor Yellow
    exit 1
}

if (-not $env:VSCE_PAT) {
    Write-Host "❌ VSCE_PAT not found in .env file" -ForegroundColor Red
    exit 1
}

# Get version from package.json
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$currentVersion = $packageJson.version

# Parse current version
if ($currentVersion -match '^(\d+)\.(\d+)\.(\d+)') {
    $major = [int]$Matches[1]
    $minor = [int]$Matches[2]
    $patch = [int]$Matches[3]
}
else {
    Write-Host "❌ Could not parse version: $currentVersion" -ForegroundColor Red
    exit 1
}

# Handle version bumping
if ($Version) {
    # Use explicit version
    $newVersion = $Version
    Write-Host "📌 Using explicit version: $newVersion" -ForegroundColor Yellow
}
elseif ($BumpMajor) {
    $newVersion = "$($major + 1).0.0"
    Write-Host "⬆️  Bumping major: $currentVersion → $newVersion" -ForegroundColor Yellow
}
elseif ($BumpMinor) {
    $newVersion = "$major.$($minor + 1).0"
    Write-Host "⬆️  Bumping minor: $currentVersion → $newVersion" -ForegroundColor Yellow
}
elseif ($BumpPatch) {
    $newVersion = "$major.$minor.$($patch + 1)"
    Write-Host "⬆️  Bumping patch: $currentVersion → $newVersion" -ForegroundColor Yellow
}
else {
    $newVersion = $currentVersion
}

# Update package.json if version changed
if ($newVersion -ne $currentVersion) {
    $packageJson.version = $newVersion
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
    Write-Host "  ✓ Updated package.json to $newVersion" -ForegroundColor DarkGray
}

$version = $newVersion
Write-Host "📦 Version: $version" -ForegroundColor White

# Determine release type
if ($Stable) {
    $releaseType = "stable"
    $vsceArgs = @()
}
else {
    $releaseType = "pre-release"
    $vsceArgs = @("--pre-release")
}
Write-Host "🏷️  Release type: $releaseType" -ForegroundColor White

# ============================================
# STEP 0: Check for version mismatches
# ============================================
Write-Host "`n🔍 Checking version consistency..." -ForegroundColor Yellow

$repoRoot = Resolve-Path (Join-Path $scriptDir "..\..")
$mismatches = @()

# Check README.md badge
$readmePath = Join-Path $scriptDir "README.md"
if (Test-Path $readmePath) {
    $readmeContent = Get-Content $readmePath -Raw
    if ($readmeContent -match 'version-(\d+\.\d+\.\d+)') {
        $readmeVersion = $Matches[1]
        if ($readmeVersion -ne $version) {
            $mismatches += "README.md badge: $readmeVersion"
        }
    }
}

# Check root copilot-instructions.md
$rootCopilotInstructions = Join-Path $repoRoot ".github\copilot-instructions.md"
if (Test-Path $rootCopilotInstructions) {
    $content = Get-Content $rootCopilotInstructions -Raw
    if ($content -match '\*\*Version\*\*:\s*(\d+\.\d+\.\d+)') {
        $copilotVersion = $Matches[1]
        if ($copilotVersion -ne $version) {
            $mismatches += "copilot-instructions.md: $copilotVersion"
        }
    }
}

# Check CHANGELOG.md for latest version
$changelogPath = Join-Path $repoRoot "CHANGELOG.md"
if (Test-Path $changelogPath) {
    $changelogContent = Get-Content $changelogPath -Raw
    if ($changelogContent -match '## \[(\d+\.\d+\.\d+)\]') {
        $changelogVersion = $Matches[1]
        # Only warn if changelog is ahead (we might be about to release)
        if ([version]$changelogVersion -gt [version]$version) {
            $mismatches += "CHANGELOG.md: $changelogVersion (ahead of package.json)"
        }
    }
}

if ($mismatches.Count -gt 0) {
    Write-Host "⚠️  Version mismatches detected (will be fixed by sync):" -ForegroundColor Yellow
    foreach ($m in $mismatches) {
        Write-Host "   - $m" -ForegroundColor DarkYellow
    }
}
else {
    Write-Host "  ✓ All versions consistent" -ForegroundColor DarkGray
}

# ============================================
# STEP 0b: Check changelog sync
# ============================================
Write-Host "`n📝 Checking changelog sync..." -ForegroundColor Yellow

$rootChangelog = Join-Path $repoRoot "CHANGELOG.md"
$extChangelog = Join-Path $scriptDir "CHANGELOG.md"

if ((Test-Path $rootChangelog) -and (Test-Path $extChangelog)) {
    $rootContent = Get-Content $rootChangelog -Raw
    $extContent = Get-Content $extChangelog -Raw
    
    # Extract latest version from each
    $rootVersion = if ($rootContent -match '## \[(\d+\.\d+\.\d+)\]') { $Matches[1] } else { "0.0.0" }
    $extVersion = if ($extContent -match '## \[(\d+\.\d+\.\d+)\]') { $Matches[1] } else { "0.0.0" }
    
    if ([version]$rootVersion -gt [version]$extVersion) {
        Write-Host "⚠️  Extension CHANGELOG.md is stale!" -ForegroundColor Red
        Write-Host "   Root: $rootVersion, Extension: $extVersion" -ForegroundColor Yellow
        Write-Host "   Please sync the extension changelog before publishing." -ForegroundColor Yellow
        Write-Host "   Tip: Copy new entries from CHANGELOG.md to platforms/vscode-extension/CHANGELOG.md" -ForegroundColor DarkGray
        
        if (-not $NoConfirm) {
            $continueAnyway = Read-Host "Continue anyway? (y/N)"
            if ($continueAnyway -ne "y" -and $continueAnyway -ne "Y") {
                Write-Host "❌ Aborted - please update the changelog first" -ForegroundColor Red
                exit 1
            }
        }
    }
    else {
        Write-Host "  ✓ Changelog versions in sync (Extension: $extVersion)" -ForegroundColor DarkGray
    }
}

# ============================================
# STEP 1: Sync version numbers across all files
# ============================================
Write-Host "`n📝 Syncing version numbers..." -ForegroundColor Yellow

# Update copilot-instructions.md
$copilotInstructions = Join-Path $scriptDir ".github\copilot-instructions.md"
if (Test-Path $copilotInstructions) {
    $content = Get-Content $copilotInstructions -Raw
    # Match version pattern like "3.5.3-PENT-TRI" or just "3.5.3"
    $content = $content -replace '(?<=\*\*Version\*\*:\s*)\d+\.\d+\.\d+', $version
    Set-Content $copilotInstructions $content -NoNewline
    Write-Host "  ✓ .github/copilot-instructions.md" -ForegroundColor DarkGray
}

# Update root copilot-instructions.md  
$rootCopilotInstructions = Join-Path $repoRoot ".github\copilot-instructions.md"
if (Test-Path $rootCopilotInstructions) {
    $content = Get-Content $rootCopilotInstructions -Raw
    $content = $content -replace '(?<=\*\*Version\*\*:\s*)\d+\.\d+\.\d+', $version
    Set-Content $rootCopilotInstructions $content -NoNewline
    Write-Host "  ✓ Root .github/copilot-instructions.md" -ForegroundColor DarkGray
}

# Update extension README.md badge
$readmePath = Join-Path $scriptDir "README.md"
if (Test-Path $readmePath) {
    $content = Get-Content $readmePath -Raw
    # Update version badge: version-X.X.X (just the version, no suffix)
    $content = $content -replace '(?<=version-)\d+\.\d+\.\d+(--[a-zA-Z0-9.]+)?', $version
    Set-Content $readmePath $content -NoNewline
    Write-Host "  ✓ README.md badge" -ForegroundColor DarkGray
}

# Update alex-manifest.json
$manifestPath = Join-Path $scriptDir ".github\config\alex-manifest.json"
if (Test-Path $manifestPath) {
    $manifest = Get-Content $manifestPath | ConvertFrom-Json
    $manifest.version = $version
    $manifest | ConvertTo-Json -Depth 10 | Set-Content $manifestPath
    Write-Host "  ✓ alex-manifest.json" -ForegroundColor DarkGray
}

Write-Host "✅ Version sync complete" -ForegroundColor Green

# ============================================
# STEP 2: Git add, commit, and push
# ============================================
if (-not $SkipGit) {
    Write-Host "`n📤 Git operations..." -ForegroundColor Yellow
    
    # Navigate to repo root for git operations
    Push-Location $repoRoot
    
    try {
        # Add all changes
        git add -A
        Write-Host "  ✓ Staged all changes" -ForegroundColor DarkGray
        
        # Check if there are changes to commit
        $status = git status --porcelain
        if ($status) {
            # Commit with version message
            $commitMsg = "Release v$version ($releaseType)"
            git commit -m $commitMsg
            Write-Host "  ✓ Committed: $commitMsg" -ForegroundColor DarkGray
            
            # Push
            git push
            Write-Host "  ✓ Pushed to remote" -ForegroundColor DarkGray
            Write-Host "✅ Git operations complete" -ForegroundColor Green
        }
        else {
            Write-Host "  ℹ No changes to commit" -ForegroundColor DarkGray
        }
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "`n⏭️  Skipping git operations (-SkipGit)" -ForegroundColor DarkGray
}

# ============================================
# STEP 3: Package / Publish
# ============================================

# Package only?
if ($PackageOnly) {
    Write-Host "`n📦 Packaging extension..." -ForegroundColor Yellow
    npx vsce package @vsceArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Packaging failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Package created: alex-cognitive-architecture-$version.vsix" -ForegroundColor Green
    exit 0
}

# Confirm before publishing
if (-not $NoConfirm) {
    Write-Host "`n⚠️  About to publish v$version as $releaseType" -ForegroundColor Yellow
    $confirm = Read-Host "Continue? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "❌ Cancelled" -ForegroundColor Red
        exit 0
    }
}
else {
    Write-Host "`n⚠️  Publishing v$version as $releaseType (auto-confirmed)" -ForegroundColor Yellow
}

# Publish
Write-Host "`n🚀 Publishing to VS Code Marketplace..." -ForegroundColor Yellow
npx vsce publish --pat $env:VSCE_PAT @vsceArgs
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Publishing failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Published successfully!" -ForegroundColor Green
Write-Host "🔗 https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture" -ForegroundColor Cyan

# Clean up generated .vsix file
$vsixFile = "alex-cognitive-architecture-$version.vsix"
if (Test-Path $vsixFile) {
    Remove-Item $vsixFile
    Write-Host "🧹 Cleaned up $vsixFile" -ForegroundColor DarkGray
}

Write-Host "`n🎉 Release complete!" -ForegroundColor Green
