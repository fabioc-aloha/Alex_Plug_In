# Verify GitHub Pages Deployment
# Checks if all required Office Add-in files are accessible via HTTPS

param(
    [switch]$OpenBrowser,
    [int]$TimeoutSeconds = 10
)

$ErrorActionPreference = "Stop"

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  GitHub Pages Deployment Verification" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot"

$urlsToCheck = @(
    @{ Url = "$baseUrl/taskpane/taskpane.html"; Name = "Task Pane HTML"; Critical = $true },
    @{ Url = "$baseUrl/taskpane/taskpane.js"; Name = "Task Pane JS"; Critical = $true },
    @{ Url = "$baseUrl/taskpane/office-operations.js"; Name = "Office Operations"; Critical = $true },
    @{ Url = "$baseUrl/taskpane/custom-functions.js"; Name = "Custom Functions"; Critical = $true },
    @{ Url = "$baseUrl/taskpane/action-panel.js"; Name = "Action Panel"; Critical = $true },
    @{ Url = "$baseUrl/taskpane/functions.json"; Name = "Functions Metadata"; Critical = $true },
    @{ Url = "$baseUrl/appPackage/color.png"; Name = "Color Icon"; Critical = $true },
    @{ Url = "$baseUrl/appPackage/outline.png"; Name = "Outline Icon"; Critical = $true },
    @{ Url = "$baseUrl/index.html"; Name = "Landing Page"; Critical = $false }
)

$results = @()
$allCriticalPass = $true

Write-Host " Checking $($urlsToCheck.Count) URLs..." -ForegroundColor Yellow
Write-Host ""

foreach ($item in $urlsToCheck) {
    $url = $item.Url
    $name = $item.Name
    $critical = $item.Critical
    
    Write-Host "Testing: $name" -ForegroundColor Cyan
    Write-Host "   URL: $url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec $TimeoutSeconds -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "   [OK] Status: $($response.StatusCode) OK" -ForegroundColor Green
            $results += [PSCustomObject]@{
                Name = $name
                Status = "[OK] PASS"
                StatusCode = $response.StatusCode
                Critical = $critical
            }
        } else {
            Write-Host "   [WARN]  Status: $($response.StatusCode)" -ForegroundColor Yellow
            $results += [PSCustomObject]@{
                Name = $name
                Status = "[WARN] WARN"
                StatusCode = $response.StatusCode
                Critical = $critical
            }
            if ($critical) { $allCriticalPass = $false }
        }
        
        # Check content type for HTML/JS files
        if ($url -match '\.(html|js)$') {
            $contentType = $response.Headers['Content-Type']
            if ($contentType -match 'text/(html|javascript)') {
                Write-Host "   [OK] Content-Type: $contentType" -ForegroundColor Green
            } else {
                Write-Host "   [WARN]  Content-Type: $contentType (unexpected)" -ForegroundColor Yellow
            }
        }
        
    } catch {
        Write-Host "   [ERROR] FAILED: $($_.Exception.Message)" -ForegroundColor Red
        $results += [PSCustomObject]@{
            Name = $name
            Status = "[ERROR] FAIL"
            StatusCode = "N/A"
            Critical = $critical
        }
        if ($critical) { $allCriticalPass = $false }
    }
    
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  Results Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$results | Format-Table -Property Name, Status, StatusCode, Critical -AutoSize

if ($allCriticalPass) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "  [OK] All critical files accessible!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "[LIST] Ready for Office Add-in deployment:" -ForegroundColor Yellow
    Write-Host "   1. Upload appPackage/build/appPackage.dev.zip to M365" -ForegroundColor White
    Write-Host "   2. Open Word/Excel/PowerPoint/Outlook" -ForegroundColor White
    Write-Host "   3. Home tab -> Alex button -> Task pane loads!" -ForegroundColor White
    Write-Host ""
    
    if ($OpenBrowser) {
        Write-Host "🌐 Opening landing page in browser..." -ForegroundColor Cyan
        Start-Process "$baseUrl/index.html"
    }
} else {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host "  [ERROR] Deployment verification failed" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host ""
    Write-Host "[FIX] Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Run: .\deploy-to-github-pages.ps1 -Commit" -ForegroundColor White
    Write-Host "   2. git push" -ForegroundColor White
    Write-Host "   3. Wait 2-3 minutes for GitHub Pages to update" -ForegroundColor White
    Write-Host "   4. Re-run this verification script" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "🌐 GitHub Pages Base URL:" -ForegroundColor Cyan
Write-Host "   $baseUrl" -ForegroundColor White
Write-Host ""
Write-Host "[FILE] Task Pane URL (used in manifest):" -ForegroundColor Cyan
Write-Host "   $baseUrl/taskpane/taskpane.html" -ForegroundColor White
Write-Host ""
