# Commit and Deploy M365 Integration
# One-click script to commit all changes and prepare for GitHub Pages deployment

param(
    [switch]$Push,
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  M365 Integration — Git Commit Helper" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Navigate to project root
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Push-Location $projectRoot

Write-Host "📂 Project: $projectRoot" -ForegroundColor Yellow
Write-Host ""

# Check git status
Write-Host "1️⃣  Checking git status..." -ForegroundColor Cyan
$status = git status --porcelain
if (-not $status) {
    Write-Host "   ℹ️  No changes to commit" -ForegroundColor Yellow
    Pop-Location
    exit 0
}
Write-Host "   ✅ Changes detected" -ForegroundColor Green
Write-Host ""

# Show what will be committed
Write-Host "2️⃣  Files to commit:" -ForegroundColor Cyan
Write-Host ""

$filesToAdd = @(
    "docs/platforms/m365-copilot/",
    "platforms/m365-copilot/deploy-to-github-pages.ps1",
    "platforms/m365-copilot/verify-github-pages.ps1",
    "platforms/m365-copilot/M365-FULL-INTEGRATION-GUIDE.md",
    "platforms/m365-copilot/QUICK-DEPLOY.md",
    "platforms/m365-copilot/DEPLOYMENT-SUMMARY.md",
    "platforms/m365-copilot/USER-MANUAL.md",
    "platforms/m365-copilot/.github/prompts/help.prompt.md",
    "platforms/m365-copilot/M365-QA-REPORT-2026-02-16.md"
)

foreach ($file in $filesToAdd) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    }
    else {
        Write-Host "   ⚠️  $file (not found)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Commit message
$commitMessage = @"
deploy: Enable M365 Office Add-in integration via GitHub Pages

Integration improvements:
- Deploy taskpane files to GitHub Pages for web hosting
- Add deployment automation scripts (deploy + verify)
- Create comprehensive integration guide (M365-FULL-INTEGRATION-GUIDE.md)
- Update quick deploy documentation with GitHub Pages prereq
- Create user manual with Office Add-in features
- Add /help prompt for quick reference
- Include QA report with known issues

Architecture:
- Unified manifest v1.19 (Teams + Office extensions)
- GitHub Pages hosting: https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/
- OneDrive memory integration (shared across Copilot + Office)
- 29 synaptic connections to VS Code skills

Enables:
- Word: Memory-augmented templates
- Excel: Custom functions (SKILLLEVEL, GOALSTATUS, NEXTSTEP)
- PowerPoint: Trifecta slide generation
- Outlook: Smart email replies (Professional/Casual/Brief)
- M365 Copilot: Declarative agent (already working)

Next: Commit → Push → Wait 2-3 min → Verify → Upload to M365

Refs: DEPLOYMENT-SUMMARY.md, M365-FULL-INTEGRATION-GUIDE.md
"@

Write-Host "3️⃣  Commit message:" -ForegroundColor Cyan
Write-Host ""
Write-Host $commitMessage -ForegroundColor Gray
Write-Host ""

if ($WhatIf) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host "  [WHATIF] Would execute:" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  git add docs/platforms/m365-copilot/" -ForegroundColor Gray
    foreach ($file in $filesToAdd[1..($filesToAdd.Length - 1)]) {
        Write-Host "  git add $file" -ForegroundColor Gray
    }
    Write-Host "  git commit -m `"deploy: Enable M365 Office Add-in integration...`"" -ForegroundColor Gray
    if ($Push) {
        Write-Host "  git push" -ForegroundColor Gray
    }
    Write-Host ""
    Pop-Location
    exit 0
}

# Add files
Write-Host "4️⃣  Adding files to git..." -ForegroundColor Cyan
foreach ($file in $filesToAdd) {
    if (Test-Path $file) {
        git add $file
        Write-Host "   ✅ Added: $file" -ForegroundColor Green
    }
}
Write-Host ""

# Commit
Write-Host "5️⃣  Committing changes..." -ForegroundColor Cyan
git commit -m $commitMessage
Write-Host "   ✅ Committed" -ForegroundColor Green
Write-Host ""

if ($Push) {
    Write-Host "6️⃣  Pushing to GitHub..." -ForegroundColor Cyan
    git push
    Write-Host "   ✅ Pushed" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "  ✅ Deployment in progress!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Wait 2-3 minutes for GitHub Pages to update" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Verify deployment:" -ForegroundColor White
    Write-Host "   cd platforms\m365-copilot" -ForegroundColor Gray
    Write-Host "   .\verify-github-pages.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Upload to M365:" -ForegroundColor White
    Write-Host "   https://dev.teams.microsoft.com/apps" -ForegroundColor Gray
    Write-Host "   → Import app → appPackage/build/appPackage.dev.zip" -ForegroundColor Gray
    Write-Host ""
}
else {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "  ✅ Changes committed locally" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Push to GitHub:" -ForegroundColor White
    Write-Host "   git push" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   OR re-run with -Push flag:" -ForegroundColor White
    Write-Host "   .\commit-and-deploy.ps1 -Push" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. After push, verify deployment:" -ForegroundColor White
    Write-Host "   cd platforms\m365-copilot" -ForegroundColor Gray
    Write-Host "   .\verify-github-pages.ps1" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "🌐 GitHub Pages URL (after push + propagation):" -ForegroundColor Cyan
Write-Host "   https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/" -ForegroundColor White
Write-Host ""

Pop-Location
