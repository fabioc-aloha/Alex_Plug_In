<#
.SYNOPSIS
    M365 Copilot Agent packaging and validation.
.DESCRIPTION
    Packages the M365 agent, validates it, and provides next steps for manual upload.
.PARAMETER Validate
    Only validate, don't provide upload instructions
.PARAMETER Environment
    Teams Toolkit environment (default: local)
.EXAMPLE
    .\release-m365.ps1
    .\release-m365.ps1 -Validate
    .\release-m365.ps1 -Environment dev
#>
param(
    [switch]$Validate,
    [string]$Environment = "local"
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
$m365Dir = Join-Path $repoRoot "platforms\m365-copilot"

if (-not (Test-Path $m365Dir)) {
    throw "M365 Copilot directory not found: $m365Dir"
}

Push-Location $m365Dir
try {
    Write-Host "`n🚀 M365 Copilot Agent Release" -ForegroundColor Cyan
    Write-Host "   Environment: $Environment" -ForegroundColor Gray

    # 1. Check dependencies
    Write-Host "`n📋 Checking dependencies..." -ForegroundColor Yellow
    $teamsapp = Get-Command teamsapp -ErrorAction SilentlyContinue
    if (-not $teamsapp) {
        Write-Host "   Installing @microsoft/teamsapp-cli..." -ForegroundColor Gray
        npm install -g @microsoft/teamsapp-cli
    }
    Write-Host "   ✅ teamsapp CLI available" -ForegroundColor Green

    # 2. Package
    Write-Host "`n📦 Packaging agent..." -ForegroundColor Yellow
    npx teamsapp package --env $Environment
    if ($LASTEXITCODE -ne 0) { throw "Packaging failed!" }
    Write-Host "   ✅ Package created" -ForegroundColor Green

    # 3. Find package
    $buildDir = Join-Path $m365Dir "appPackage\build"
    $pkg = Get-ChildItem "$buildDir\*.zip" -ErrorAction SilentlyContinue | 
           Sort-Object LastWriteTime -Descending | 
           Select-Object -First 1

    if (-not $pkg) {
        throw "No package found in $buildDir"
    }
    Write-Host "   Package: $($pkg.Name)" -ForegroundColor Gray

    # 4. Validate
    Write-Host "`n✅ Validating package..." -ForegroundColor Yellow
    npx teamsapp validate --package-file $pkg.FullName
    if ($LASTEXITCODE -ne 0) { 
        Write-Host "   ⚠️ Validation warnings (review output above)" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ Validation passed" -ForegroundColor Green
    }

    if ($Validate) {
        Write-Host "`n⚠️ Validation only - stopping here" -ForegroundColor Yellow
        exit 0
    }

    # 5. Next steps
    Write-Host "`n📋 Next Steps (Manual):" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   1. Open Developer Portal:" -ForegroundColor White
    Write-Host "      https://dev.teams.microsoft.com/apps" -ForegroundColor Blue
    Write-Host ""
    Write-Host "   2. Upload package:" -ForegroundColor White
    Write-Host "      $($pkg.FullName)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   3. Test in Teams/M365 Copilot:" -ForegroundColor White
    Write-Host "      - Open Teams → Apps → Upload a custom app" -ForegroundColor Gray
    Write-Host "      - Or use M365 Copilot → Your agents" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   4. Submit for approval (if publishing to org):" -ForegroundColor White
    Write-Host "      Developer Portal → Your app → Publish → Submit" -ForegroundColor Gray
    Write-Host ""

    # Copy path to clipboard if possible
    try {
        $pkg.FullName | Set-Clipboard
        Write-Host "   📋 Package path copied to clipboard" -ForegroundColor Green
    } catch {
        # Clipboard not available, ignore
    }
}
finally {
    Pop-Location
}
