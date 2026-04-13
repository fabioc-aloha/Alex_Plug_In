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

    # 1. Run preflight (read-only validation — build script already created the VSIX)
    Write-Host "`n[LIST] Running preflight checks..." -ForegroundColor Yellow
    & "$scriptDir\release-preflight.ps1"
    if ($LASTEXITCODE -ne 0) { throw "Preflight failed!" }

    # 2. Read current version and find pre-built VSIX
    Push-Location $extensionPath
    $pkg = Get-Content package.json | ConvertFrom-Json
    $newVersion = $pkg.version
    $publisher = $pkg.publisher
    $extName = $pkg.name
    Write-Host "`n[VERSION] Publishing version: $newVersion" -ForegroundColor Green

    $vsix = Get-ChildItem "*.vsix" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $vsix) {
        Pop-Location
        throw "No .vsix file found in $extensionPath. Run build-extension-package.ps1 first."
    }
    Write-Host "   VSIX: $($vsix.Name)" -ForegroundColor Gray
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

    # 7. Publish pre-built VSIX (from extension folder)
    Write-Host "`n[PUBLISH] Publishing to marketplace..." -ForegroundColor Yellow
    Push-Location $extensionPath
    
    $vsixPath = (Get-ChildItem "*.vsix" | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
    if (-not $vsixPath) {
        Pop-Location
        throw "VSIX file disappeared. Re-run build-extension-package.ps1."
    }
    Write-Host "   Using: $vsixPath" -ForegroundColor Gray

    if ($PreRelease) {
        npx vsce publish --pre-release --no-dependencies --packagePath $vsixPath
    }
    else {
        npx vsce publish --no-dependencies --packagePath $vsixPath
    }
    
    Pop-Location

    Write-Host "`n[OK] Release v$newVersion complete!" -ForegroundColor Green
    Write-Host "   Marketplace: https://marketplace.visualstudio.com/items?itemName=${publisher}.${extName}" -ForegroundColor Gray
}
finally {
    Pop-Location
}
