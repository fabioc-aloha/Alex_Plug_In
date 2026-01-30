# deploy.ps1 - Alex M365 Agent Quick Deploy
param([switch]$Rebuild)

$projectDir = $PSScriptRoot
$packagePath = "$projectDir\appPackage\build\alex-m365-agent.zip"
$envFile = "$projectDir\env\.env.dev"

Write-Host "`n🧠 Alex M365 Agent - Quick Deploy" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Step 1: Rebuild package if requested or if files changed
if ($Rebuild -or -not (Test-Path $packagePath)) {
    Write-Host "`n📦 Building app package..." -ForegroundColor Yellow
    Push-Location "$projectDir\appPackage"
    New-Item -ItemType Directory -Path "build" -Force | Out-Null
    
    # Get or generate App ID from .env.dev
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match 'TEAMS_APP_ID=([0-9a-fA-F-]{36})') {
        $appId = $matches[1]
        Write-Host "   Using existing App ID: $appId" -ForegroundColor Gray
    }
    else {
        $appId = [guid]::NewGuid().ToString()
        Write-Host "   Generated new App ID: $appId" -ForegroundColor Yellow
        # Update .env.dev with new ID
        $envContent = $envContent -replace 'TEAMS_APP_ID=.*', "TEAMS_APP_ID=$appId"
        $envContent | Set-Content $envFile -NoNewline
        Write-Host "   Saved to .env.dev" -ForegroundColor Gray
    }
    
    # Substitute in manifest
    $manifest = Get-Content manifest.json -Raw
    $manifest = $manifest -replace '\$\{\{TEAMS_APP_ID\}\}', $appId
    $manifest | Set-Content build/manifest.json
    
    # Copy other files
    Copy-Item declarativeAgent.json build/
    Copy-Item color.png build/
    Copy-Item outline.png build/
    
    # Create zip from build folder contents
    Compress-Archive -Path build/manifest.json, build/declarativeAgent.json, build/color.png, build/outline.png -DestinationPath "build\alex-m365-agent.zip" -Force
    Pop-Location
    Write-Host "✅ Package built" -ForegroundColor Green
}

# Step 2: Validate
Write-Host "`n🔍 Validating package..." -ForegroundColor Yellow
$validateOutput = teamsapp validate --package-file $packagePath 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Validation passed" -ForegroundColor Green
}
else {
    Write-Host "❌ Validation failed:" -ForegroundColor Red
    Write-Host $validateOutput
    exit 1
}

# Copy path to clipboard and prompt for manual upload
$packagePath | Set-Clipboard

Write-Host "`n📋 Package path copied to clipboard!" -ForegroundColor Green
Write-Host "`n📁 $packagePath" -ForegroundColor White
Write-Host "`n👉 Upload manually to Teams Developer Portal" -ForegroundColor Yellow
Write-Host "   https://dev.teams.microsoft.com/apps" -ForegroundColor Cyan
Write-Host "`n✨ Done!" -ForegroundColor Cyan
