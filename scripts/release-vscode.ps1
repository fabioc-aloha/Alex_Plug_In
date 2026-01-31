<#
.SYNOPSIS
    Complete VS Code Extension release automation.
.DESCRIPTION
    Runs preflight, bumps version, updates CHANGELOG, commits, tags, pushes, and publishes.
    Uses platforms/vscode-extension structure.
.PARAMETER BumpType
    Version bump type: patch, minor, or major
.PARAMETER PreRelease
    Publish as pre-release on marketplace
.PARAMETER DryRun
    Stop before commit/push/publish (for testing)
.EXAMPLE
    .\release-vscode.ps1 -BumpType patch
    .\release-vscode.ps1 -BumpType minor -PreRelease
    .\release-vscode.ps1 -BumpType major -DryRun
#>
param(
    [Parameter(Mandatory)]
    [ValidateSet("patch", "minor", "major")]
    [string]$BumpType,
    
    [switch]$PreRelease,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
$extensionPath = Join-Path $repoRoot "platforms\vscode-extension"

# Validate extension path
if (-not (Test-Path $extensionPath)) {
    Write-Host "❌ Extension path not found: $extensionPath" -ForegroundColor Red
    exit 1
}

Push-Location $repoRoot
try {
    Write-Host "`n🚀 VS Code Extension Release" -ForegroundColor Cyan
    Write-Host "   Bump: $BumpType | PreRelease: $PreRelease | DryRun: $DryRun" -ForegroundColor Gray
    Write-Host "   Extension: $extensionPath" -ForegroundColor Gray

    # 0. Load PAT from .env if not in environment
    $envFile = Join-Path $extensionPath ".env"
    if (-not $env:VSCE_PAT -and (Test-Path $envFile)) {
        $patLine = Get-Content $envFile | Where-Object { $_ -match '^VSCE_PAT=' }
        if ($patLine) {
            $env:VSCE_PAT = $patLine.Split("=", 2)[1].Trim()
            Write-Host "   ✅ PAT loaded from .env" -ForegroundColor Green
        }
    }
    if (-not $env:VSCE_PAT) {
        throw "VSCE_PAT not set. Set environment variable or add to platforms/vscode-extension/.env"
    }

    # 1. Run preflight (from extension folder)
    Write-Host "`n📋 Gate 1-4: Running preflight checks..." -ForegroundColor Yellow
    & "$scriptDir\release-preflight.ps1" -Package -SkipTests
    if ($LASTEXITCODE -ne 0) { throw "Preflight failed!" }

    # 2. Bump version (in extension folder)
    Push-Location $extensionPath
    Write-Host "`n📈 Bumping version ($BumpType)..." -ForegroundColor Yellow
    npm version $BumpType --no-git-tag-version
    $newVersion = (Get-Content package.json | ConvertFrom-Json).version
    Write-Host "   New version: $newVersion" -ForegroundColor Green
    
    # 2b. Update heir copilot-instructions.md version
    $heirInstructions = Join-Path $extensionPath ".github\copilot-instructions.md"
    if (Test-Path $heirInstructions) {
        $content = Get-Content $heirInstructions -Raw
        $content = $content -replace '(\*\*Version\*\*:\s*)\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?', "`$1$newVersion"
        Set-Content $heirInstructions $content -NoNewline
        Write-Host "   Updated heir copilot-instructions.md" -ForegroundColor Green
    }
    Pop-Location

    # 3. Update CHANGELOG (in repo root)
    Write-Host "`n📝 Updating CHANGELOG..." -ForegroundColor Yellow
    $date = Get-Date -Format "yyyy-MM-dd"
    $changelog = Get-Content CHANGELOG.md -Raw
    $newEntry = "## [$newVersion] - $date`n`n### Added`n`n### Changed`n`n### Fixed`n`n---`n`n"
    $changelog = $changelog -replace '(# Changelog\s*\n[^\n]*\n[^\n]*\n---\s*\n)', "`$1`n$newEntry"
    Set-Content CHANGELOG.md $changelog -NoNewline
    Write-Host "   Added entry for $newVersion" -ForegroundColor Green

    if ($DryRun) {
        Write-Host "`n⚠️ DRY RUN - Stopping before commit" -ForegroundColor Yellow
        Write-Host "   Review changes: git diff" -ForegroundColor Gray
        Write-Host "   Reset if needed: git checkout -- ." -ForegroundColor Gray
        exit 0
    }

    # 4. Gate 5: Human confirmation
    Write-Host "`n🔍 Gate 5: Human Review" -ForegroundColor Yellow
    Write-Host "   - CHANGELOG entry for $newVersion added (edit it now if needed)" -ForegroundColor Gray
    Write-Host "   - Version bumped to $newVersion" -ForegroundColor Gray
    $confirm = Read-Host "`n   Proceed with commit, tag, push, and publish? (y/N)"
    if ($confirm -ne 'y' -and $confirm -ne 'Y') {
        Write-Host "`n❌ Aborted by user" -ForegroundColor Red
        exit 1
    }

    # 5. Commit and tag
    Write-Host "`n📦 Committing and tagging..." -ForegroundColor Yellow
    git add -A
    git commit -m "chore: release v$newVersion"
    git tag "v$newVersion"
    Write-Host "   Tagged: v$newVersion" -ForegroundColor Green

    # 6. Push
    Write-Host "`n⬆️ Pushing to remote..." -ForegroundColor Yellow
    git push
    git push --tags

    # 7. Publish (from extension folder)
    Write-Host "`n🎯 Publishing to marketplace..." -ForegroundColor Yellow
    Push-Location $extensionPath
    
    if ($PreRelease) {
        npx vsce publish --pre-release
    } else {
        npx vsce publish
    }
    
    Pop-Location

    Write-Host "`n✅ Release v$newVersion complete!" -ForegroundColor Green
    Write-Host "   Marketplace: https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture" -ForegroundColor Gray
}
finally {
    Pop-Location
}
