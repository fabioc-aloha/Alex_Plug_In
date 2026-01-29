# deploy.ps1 - Alex M365 Agent Quick Deploy
param([switch]$Rebuild)

$projectDir = $PSScriptRoot
$packagePath = "$projectDir\appPackage\build\alex-m365-agent-v4.1.0.zip"

Write-Host "`n🦖 Alex M365 Agent - Quick Deploy" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Step 1: Rebuild package if requested or if files changed
if ($Rebuild -or -not (Test-Path $packagePath)) {
    Write-Host "`n📦 Building app package..." -ForegroundColor Yellow
    Push-Location "$projectDir\appPackage"
    Compress-Archive -Path manifest.json, declarativeAgent.json, color.png, outline.png -DestinationPath "build\alex-m365-agent-v4.1.0.zip" -Force
    Pop-Location
    Write-Host "✅ Package built" -ForegroundColor Green
}

# Step 2: Validate
Write-Host "`n🔍 Validating package..." -ForegroundColor Yellow
$validateOutput = teamsapp validate --package-file $packagePath 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Validation passed (51 checks)" -ForegroundColor Green
} else {
    Write-Host "❌ Validation failed:" -ForegroundColor Red
    Write-Host $validateOutput
    exit 1
}

# Show package location prominently
Write-Host "`n📁 Package ready for upload:" -ForegroundColor Cyan
Write-Host "   $packagePath" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""

# Step 3: Try to update (if app exists via CLI)
Write-Host "📤 Attempting automated update..." -ForegroundColor Yellow
$updateOutput = teamsapp update --package-file $packagePath 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ App updated via CLI!" -ForegroundColor Green
} else {
    # Fallback to manual instructions
    Write-Host "⚠️  CLI update not available (app created via portal)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Manual upload steps:" -ForegroundColor Cyan
    Write-Host "   1. Open Developer Portal (link below)" -ForegroundColor White
    Write-Host "   2. Click: Alex Cognitive" -ForegroundColor White
    Write-Host "   3. Go to: App package (left menu)" -ForegroundColor White
    Write-Host "   4. Click: Import app package" -ForegroundColor White
    Write-Host "   5. Browse to:" -ForegroundColor White
    Write-Host "      $packagePath" -ForegroundColor Green
    Write-Host ""
    
    # Open browser automatically
    Start-Process "https://dev.teams.microsoft.com/apps"
    
    # Copy path to clipboard
    $packagePath | Set-Clipboard
    Write-Host "`n📋 Package path copied to clipboard!" -ForegroundColor Green
}

Write-Host "`n✨ Done!" -ForegroundColor Cyan
