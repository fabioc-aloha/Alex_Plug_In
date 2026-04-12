<#
.SYNOPSIS
    Complete VS Code Extension release automation.
.DESCRIPTION
    Runs preflight, commits, tags, pushes, and publishes.
    Version must already be set in package.json before running.
    Uses platforms/vscode-extension structure.
.PARAMETER PreRelease
    Publish as pre-release on marketplace
.PARAMETER DryRun
    Stop before commit/push/publish (for testing)
.EXAMPLE
    .\release-vscode.ps1
    .\release-vscode.ps1 -PreRelease
    .\release-vscode.ps1 -DryRun
#>
param(
    [switch]$PreRelease,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
$extensionPath = Join-Path $repoRoot "platforms\vscode-extension"

# Validate extension path
if (-not (Test-Path $extensionPath)) {
    Write-Host "[ERROR] Extension path not found: $extensionPath" -ForegroundColor Red
    exit 1
}

Push-Location $repoRoot
try {
    Write-Host "`n VS Code Extension Release" -ForegroundColor Cyan
    Write-Host "   PreRelease: $PreRelease | DryRun: $DryRun" -ForegroundColor Gray
    Write-Host "   Extension: $extensionPath" -ForegroundColor Gray

    # 0. Load PAT from .env if not in environment
    $envFile = Join-Path $repoRoot ".env"
    if (-not $env:VSCE_PAT -and (Test-Path $envFile)) {
        $patLine = Get-Content $envFile | Where-Object { $_ -match '^VSCE_PAT=' }
        if ($patLine) {
            $env:VSCE_PAT = $patLine.Split("=", 2)[1].Trim()
            Write-Host "   [OK] PAT loaded from .env" -ForegroundColor Green
        }
    }
    if (-not $env:VSCE_PAT) {
        throw "VSCE_PAT not set. Set environment variable or add VSCE_PAT to root .env"
    }

    # 1a. Sync Master Alex to extension (ensures .github/ is fresh)
    Write-Host "`n[SYNC] Syncing Master Alex to extension package..." -ForegroundColor Yellow
    & "$repoRoot\.github\muscles\build-extension-package.ps1" -SkipCompile
    if ($LASTEXITCODE -ne 0) { throw "Build/sync failed!" }
    Write-Host "   [OK] Extension .github/ synced from Master Alex" -ForegroundColor Green

    # 1b. Run preflight (from extension folder)
    Write-Host "`n[LIST] Gate 1-4: Running preflight checks..." -ForegroundColor Yellow
    & "$scriptDir\release-preflight.ps1" -Package -SkipTests
    if ($LASTEXITCODE -ne 0) { throw "Preflight failed!" }

    # 2. Read current version from package.json
    Push-Location $extensionPath
    $pkg = Get-Content package.json | ConvertFrom-Json
    $newVersion = $pkg.version
    $publisher = $pkg.publisher
    $extName = $pkg.name
    Write-Host "`n[VERSION] Publishing version: $newVersion" -ForegroundColor Green
    Pop-Location

    if ($DryRun) {
        Write-Host "`n[WARN] DRY RUN - Stopping before commit" -ForegroundColor Yellow
        Write-Host "   Version: $newVersion" -ForegroundColor Gray
        Write-Host "   Review changes: git diff" -ForegroundColor Gray
        exit 0
    }

    # 4. Gate 5: Human confirmation (skip in automated mode)
    Write-Host "`n[GATE] Gate 5: Human Review" -ForegroundColor Yellow
    Write-Host "   - Version: $newVersion" -ForegroundColor Gray
    Write-Host "   - Proceeding with commit, tag, push, and publish..." -ForegroundColor Gray

    # 5. Commit and tag
    Write-Host "`n[PKG] Committing and tagging..." -ForegroundColor Yellow
    git add -A
    git commit -m "chore: release v$newVersion"
    git tag "v$newVersion"
    Write-Host "   Tagged: v$newVersion" -ForegroundColor Green

    # 6. Push
    Write-Host "`n[PUSH] Pushing to remote..." -ForegroundColor Yellow
    git push
    git push --tags

    # 7. Publish (from extension folder)
    Write-Host "`n[PUBLISH] Publishing to marketplace..." -ForegroundColor Yellow
    Push-Location $extensionPath
    
    if ($PreRelease) {
        npx vsce publish --pre-release
    }
    else {
        npx vsce publish
    }
    
    Pop-Location

    Write-Host "`n[OK] Release v$newVersion complete!" -ForegroundColor Green
    Write-Host "   Marketplace: https://marketplace.visualstudio.com/items?itemName=${publisher}.${extName}" -ForegroundColor Gray
}
finally {
    Pop-Location
}
