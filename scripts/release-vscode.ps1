<#
.SYNOPSIS
    Complete VS Code Extension release automation.
.DESCRIPTION
    Runs preflight, bumps version, updates CHANGELOG, commits, tags, pushes, and publishes.
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

Push-Location $repoRoot
try {
    Write-Host "`n🚀 VS Code Extension Release" -ForegroundColor Cyan
    Write-Host "   Bump: $BumpType | PreRelease: $PreRelease | DryRun: $DryRun" -ForegroundColor Gray

    # 1. Run preflight
    Write-Host "`n📋 Gate 1-4: Running preflight checks..." -ForegroundColor Yellow
    & "$scriptDir\release-preflight.ps1" -Package
    if ($LASTEXITCODE -ne 0) { throw "Preflight failed!" }

    # 2. Bump version
    Write-Host "`n📈 Bumping version ($BumpType)..." -ForegroundColor Yellow
    npm version $BumpType --no-git-tag-version
    $newVersion = (Get-Content package.json | ConvertFrom-Json).version
    Write-Host "   New version: $newVersion" -ForegroundColor Green

    # 3. Update CHANGELOG
    Write-Host "`n📝 Updating CHANGELOG..." -ForegroundColor Yellow
    $date = Get-Date -Format "yyyy-MM-dd"
    $changelog = Get-Content CHANGELOG.md -Raw
    $newEntry = "## [$newVersion] - $date`n`n### Added`n`n### Changed`n`n### Fixed`n`n"
    $changelog = $changelog -replace '(# Changelog\s*\n)', "`$1`n$newEntry"
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

    # 7. Publish
    Write-Host "`n🎯 Publishing to marketplace..." -ForegroundColor Yellow
    if (-not $env:VSCE_PAT) {
        $envFile = Join-Path $repoRoot ".env"
        if (Test-Path $envFile) {
            $patLine = Get-Content $envFile | Where-Object { $_ -match '^VSCE_PAT=' }
            if ($patLine) {
                $env:VSCE_PAT = $patLine.Split("=", 2)[1]
            }
        }
        if (-not $env:VSCE_PAT) {
            throw "VSCE_PAT not set. Set environment variable or add to .env file."
        }
    }

    if ($PreRelease) {
        vsce publish --pre-release
    } else {
        vsce publish
    }

    Write-Host "`n✅ Release v$newVersion complete!" -ForegroundColor Green
    Write-Host "   Marketplace: https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture" -ForegroundColor Gray
}
finally {
    Pop-Location
}
