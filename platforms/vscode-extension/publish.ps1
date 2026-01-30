# publish.ps1
# Publishes Alex Cognitive Architecture to VS Code Marketplace
#
# Usage:
#   .\publish.ps1              # Publish as pre-release (beta)
#   .\publish.ps1 -Stable      # Publish as stable release
#   .\publish.ps1 -PackageOnly # Package without publishing
#   .\publish.ps1 -SkipGit     # Skip git add/commit/push

param(
    [switch]$Stable,
    [switch]$PackageOnly,
    [switch]$SkipGit
)

$ErrorActionPreference = "Stop"

# Ensure we're in the right directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "`n🧠 Alex Cognitive Architecture - Publish Script" -ForegroundColor Cyan
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
$version = $packageJson.version
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
# STEP 1: Sync version numbers across all files
# ============================================
Write-Host "`n📝 Syncing version numbers..." -ForegroundColor Yellow

# Files to update with version
$repoRoot = Resolve-Path (Join-Path $scriptDir "..\..")

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
    # Update version badge: version-X.X.X or version-X.X.X--beta.N
    $content = $content -replace '(?<=version-)\d+\.\d+\.\d+(--beta\.\d+)?', "$version--beta.3"
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
Write-Host "`n⚠️  About to publish v$version as $releaseType" -ForegroundColor Yellow
$confirm = Read-Host "Continue? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "❌ Cancelled" -ForegroundColor Red
    exit 0
}

# Publish
Write-Host "`n🚀 Publishing to VS Code Marketplace..." -ForegroundColor Yellow
npx vsce publish @vsceArgs
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
