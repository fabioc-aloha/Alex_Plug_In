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

    # 2. Package with teamsapp (resolves variables)
    Write-Host "`n📦 Packaging agent..." -ForegroundColor Yellow
    npx teamsapp package --env $Environment
    if ($LASTEXITCODE -ne 0) { throw "Packaging failed!" }
    Write-Host "   ✅ Base package created" -ForegroundColor Green

    # 3. Fix: teamsapp doesn't include declarativeAgent.json - rebuild with all files
    $buildDir = Join-Path $m365Dir "appPackage\build"
    $appPackageDir = Join-Path $m365Dir "appPackage"
    
    # Extract the resolved manifest (has real GUID)
    $basePkg = Get-ChildItem "$buildDir\appPackage.$Environment.zip" -ErrorAction SilentlyContinue
    if ($basePkg) {
        $inspectDir = Join-Path $buildDir "inspect"
        Expand-Archive -Path $basePkg.FullName -DestinationPath $inspectDir -Force
        
        # Create final package with resolved manifest + declarativeAgent
        $finalDir = Join-Path $buildDir "final"
        New-Item -ItemType Directory -Path $finalDir -Force | Out-Null
        Copy-Item (Join-Path $inspectDir "manifest.json") $finalDir
        Copy-Item (Join-Path $appPackageDir "declarativeAgent.json") $finalDir
        Copy-Item (Join-Path $appPackageDir "color.png") $finalDir
        Copy-Item (Join-Path $appPackageDir "outline.png") $finalDir
        
        $finalPkg = Join-Path $buildDir "appPackage.final.zip"
        Compress-Archive -Path "$finalDir\*" -DestinationPath $finalPkg -Force
        Write-Host "   ✅ Final package with declarativeAgent.json" -ForegroundColor Green
    }

    # 4. Find package (prefer final, fallback to base)
    $pkg = Get-Item "$buildDir\appPackage.final.zip" -ErrorAction SilentlyContinue
    if (-not $pkg) {
        $pkg = Get-ChildItem "$buildDir\*.zip" -ErrorAction SilentlyContinue | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -First 1
    }

    if (-not $pkg) {
        throw "No package found in $buildDir"
    }
    Write-Host "   Package: $($pkg.Name) ($([math]::Round($pkg.Length/1KB, 1)) KB)" -ForegroundColor Gray

    # 5. Validate
    Write-Host "`n✅ Validating package..." -ForegroundColor Yellow
    npx teamsapp validate --package-file $pkg.FullName
    if ($LASTEXITCODE -ne 0) { 
        Write-Host "   ⚠️ Validation warnings (review output above)" -ForegroundColor Yellow
    }
    else {
        Write-Host "   ✅ Validation passed" -ForegroundColor Green
    }
    
    # Verify package contents
    $verifyDir = Join-Path $buildDir "verify"
    Expand-Archive -Path $pkg.FullName -DestinationPath $verifyDir -Force
    $verifyFiles = Get-ChildItem $verifyDir
    Write-Host "`n📋 Package contents:" -ForegroundColor Yellow
    $verifyFiles | ForEach-Object { Write-Host "   - $($_.Name) ($([math]::Round($_.Length/1KB, 1)) KB)" -ForegroundColor Gray }
    
    if (-not (Test-Path (Join-Path $verifyDir "declarativeAgent.json"))) {
        throw "❌ CRITICAL: declarativeAgent.json missing from package!"
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
    }
    catch {
        # Clipboard not available, ignore
    }
}
finally {
    Pop-Location
}
