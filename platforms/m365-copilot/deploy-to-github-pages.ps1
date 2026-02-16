# Deploy M365 Office Add-in to GitHub Pages
# This script copies taskpane files and assets to docs/ folder for web hosting

param(
    [switch]$WhatIf,
    [switch]$Commit
)

$ErrorActionPreference = "Stop"

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  M365 Office Add-in → GitHub Pages" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Paths
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$sourceTaskpane = Join-Path $PSScriptRoot "taskpane"
$sourceIcons = Join-Path $PSScriptRoot "appPackage"
$destTaskpane = Join-Path $projectRoot "docs\platforms\m365-copilot\taskpane"
$destIcons = Join-Path $projectRoot "docs\platforms\m365-copilot\appPackage"

Write-Host "📂 Source: platforms/m365-copilot/" -ForegroundColor Yellow
Write-Host "📂 Destination: docs/platforms/m365-copilot/" -ForegroundColor Yellow
Write-Host ""

# Create directories
Write-Host "1️⃣  Creating directory structure..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $destTaskpane -Force | Out-Null
New-Item -ItemType Directory -Path $destIcons -Force | Out-Null
Write-Host "   ✅ Directories ready" -ForegroundColor Green
Write-Host ""

# Copy taskpane files
Write-Host "2️⃣  Copying taskpane files..." -ForegroundColor Cyan
$taskpaneFiles = Get-ChildItem -Path $sourceTaskpane -File
foreach ($file in $taskpaneFiles) {
    $destPath = Join-Path $destTaskpane $file.Name
    if ($WhatIf) {
        Write-Host "   [WHATIF] Would copy: $($file.Name)" -ForegroundColor Gray
    }
    else {
        Copy-Item -Path $file.FullName -Destination $destPath -Force
        Write-Host "   ✅ $($file.Name)" -ForegroundColor Green
    }
}
Write-Host ""

# Copy icons
Write-Host "3️⃣  Copying icons and assets..." -ForegroundColor Cyan
$iconFiles = Get-ChildItem -Path $sourceIcons -Include "*.png", "*.svg" -File
foreach ($file in $iconFiles) {
    $destPath = Join-Path $destIcons $file.Name
    if ($WhatIf) {
        Write-Host "   [WHATIF] Would copy: $($file.Name)" -ForegroundColor Gray
    }
    else {
        Copy-Item -Path $file.FullName -Destination $destPath -Force
        Write-Host "   ✅ $($file.Name)" -ForegroundColor Green
    }
}
Write-Host ""

# Verify deployment
Write-Host "4️⃣  Verifying deployment..." -ForegroundColor Cyan
$requiredFiles = @(
    "taskpane\taskpane.html",
    "taskpane\taskpane.js",
    "taskpane\office-operations.js",
    "taskpane\custom-functions.js",
    "taskpane\action-panel.js",
    "taskpane\functions.json",
    "appPackage\color.png",
    "appPackage\outline.png"
)

$allPresent = $true
foreach ($file in $requiredFiles) {
    $fullPath = Join-Path (Join-Path $projectRoot "docs\platforms\m365-copilot") $file
    if (Test-Path $fullPath) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    }
    else {
        Write-Host "   ❌ Missing: $file" -ForegroundColor Red
        $allPresent = $false
    }
}
Write-Host ""

if ($allPresent) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "  ✅ Deployment successful!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Commit and push to GitHub:" -ForegroundColor White
    Write-Host "   git add docs/platforms/m365-copilot/" -ForegroundColor Gray
    Write-Host "   git commit -m 'deploy: Office Add-in taskpane to GitHub Pages'" -ForegroundColor Gray
    Write-Host "   git push" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Wait 2-3 minutes for GitHub Pages to update" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Verify hosting:" -ForegroundColor White
    Write-Host "   https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/taskpane/taskpane.html" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Upload package to M365:" -ForegroundColor White
    Write-Host "   https://dev.teams.microsoft.com/apps" -ForegroundColor Gray
    Write-Host "   → Import app → appPackage/build/appPackage.dev.zip" -ForegroundColor Gray
    Write-Host ""
    
    if ($Commit) {
        Write-Host "5. Auto-committing (Commit flag enabled)..." -ForegroundColor Cyan
        Push-Location $projectRoot
        git add docs/platforms/m365-copilot/
        git commit -m "deploy: Office Add-in taskpane to GitHub Pages"
        Write-Host "   ✅ Auto-committed" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Run 'git push' to deploy to GitHub Pages" -ForegroundColor Yellow
        Pop-Location
    }
}
else {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host "  ❌ Deployment incomplete - missing files" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🌐 GitHub Pages URL:" -ForegroundColor Cyan
Write-Host "   https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/taskpane/taskpane.html" -ForegroundColor White
Write-Host ""
