# deploy-to-developer-portal.ps1
# Automated deployment of Alex M365 Agent to Developer Portal

param(
    [string]$PackagePath,
    [string]$AppId = "e29bc39c-1f78-4732-ba00-a6cea76db5b1"
)

# Default package path relative to script location
if (-not $PackagePath) {
    $PackagePath = Join-Path $PSScriptRoot "appPackage\build\appPackage.local.zip"
}

Write-Host "Alex M365 Agent Deployment Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Step 1: Verify package exists
if (-not (Test-Path $PackagePath)) {
    Write-Error "Package not found: $PackagePath"
    exit 1
}
Write-Host "✅ Package found: $PackagePath" -ForegroundColor Green

# Step 2: Get access token for Microsoft Graph
Write-Host "`n📝 Getting access token..." -ForegroundColor Yellow
$token = az account get-access-token --resource "https://graph.microsoft.com" --query accessToken -o tsv 2>$null

if (-not $token) {
    Write-Error "Failed to get access token. Run 'az login' first."
    exit 1
}
Write-Host "✅ Access token acquired" -ForegroundColor Green

# Step 3: Read package as base64
Write-Host "`n📦 Encoding package..." -ForegroundColor Yellow
$packageBytes = [System.IO.File]::ReadAllBytes($PackagePath)
$packageBase64 = [Convert]::ToBase64String($packageBytes)
Write-Host "✅ Package encoded ($($packageBytes.Length) bytes)" -ForegroundColor Green

# Step 4: Check if app exists in catalog
Write-Host "`n🔍 Checking app catalog..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $existingApp = Invoke-RestMethod -Uri "https://graph.microsoft.com/v1.0/appCatalogs/teamsApps?`$filter=externalId eq '$AppId'" -Headers $headers -Method Get
    
    if ($existingApp.value.Count -gt 0) {
        $teamsAppId = $existingApp.value[0].id
        Write-Host "✅ Found existing app in catalog: $teamsAppId" -ForegroundColor Green
        
        # Step 5a: Update existing app
        Write-Host "`n🔄 Updating app package..." -ForegroundColor Yellow
        $updateUri = "https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/$teamsAppId/appDefinitions"
        
        # Create multipart form data
        $boundary = [System.Guid]::NewGuid().ToString()
        $bodyLines = @(
            "--$boundary"
            "Content-Disposition: form-data; name=`"file`"; filename=`"appPackage.zip`""
            "Content-Type: application/zip"
            ""
            [System.Text.Encoding]::UTF8.GetString($packageBytes)
            "--$boundary--"
        ) -join "`r`n"
        
        $updateHeaders = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "multipart/form-data; boundary=$boundary"
        }
        
        $result = Invoke-RestMethod -Uri $updateUri -Headers $updateHeaders -Method Post -Body $bodyLines
        Write-Host "✅ App updated successfully!" -ForegroundColor Green
        Write-Host "   Version: $($result.version)" -ForegroundColor Cyan
    }
    else {
        # Step 5b: Submit new app
        Write-Host "📤 App not in catalog, submitting new..." -ForegroundColor Yellow
        Write-Host "⚠️  For new apps, use Developer Portal manual upload first" -ForegroundColor Yellow
        Write-Host "   URL: https://dev.teams.microsoft.com/apps/$AppId" -ForegroundColor Cyan
    }
}
catch {
    $errorMessage = $_.Exception.Message
    if ($errorMessage -match "403|Forbidden") {
        Write-Host "`n⚠️  Graph API access denied - using alternative method..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Option 1: Use Developer Portal (manual)" -ForegroundColor Cyan
        Write-Host "   1. Open: https://dev.teams.microsoft.com/apps" -ForegroundColor White
        Write-Host "   2. Find: Alex Cognitive (or import new)" -ForegroundColor White
        Write-Host "   3. App package → Import app package" -ForegroundColor White
        Write-Host "   4. Upload: $PackagePath" -ForegroundColor White
        Write-Host ""
        Write-Host "🌐 Opening Developer Portal..." -ForegroundColor Yellow
        Start-Process "https://dev.teams.microsoft.com/apps"
        Write-Host ""
        Write-Host "Option 2: Install Teams Toolkit CLI" -ForegroundColor Cyan
        Write-Host "   npm install -g @microsoft/teamsapp-cli" -ForegroundColor White
        Write-Host "   teamsapp auth login m365" -ForegroundColor White
        Write-Host "   teamsapp publish --manifest-path $PackagePath" -ForegroundColor White
    }
    else {
        Write-Error "API Error: $errorMessage"
    }
}

Write-Host "`n✨ Deployment script complete!" -ForegroundColor Cyan
