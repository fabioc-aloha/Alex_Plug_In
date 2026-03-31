<#
.SYNOPSIS
    Quick publish for Alex Cognitive Architecture extension.
.DESCRIPTION
    Simplified publish script for quick marketplace updates.
    For full release workflow (version bump, changelog, git), use: scripts/release-vscode.ps1
.PARAMETER Stable
    Publish as stable (default: pre-release)
.PARAMETER PackageOnly
    Just create .vsix without publishing
.PARAMETER SkipConfirm
    Skip confirmation prompt
.EXAMPLE
    .\publish.ps1                   # Pre-release publish
    .\publish.ps1 -Stable           # Stable publish  
    .\publish.ps1 -PackageOnly      # Package only
#>
param(
    [switch]$Stable,
    [switch]$PackageOnly,
    [switch]$SkipConfirm
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Push-Location $scriptDir
try {
    Write-Host "`n----------------------------------------" -ForegroundColor Cyan
    Write-Host "  Alex Cognitive Architecture -- Quick Publish" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Cyan

    # Load PAT
    $envFile = Join-Path $scriptDir ".env"
    if (-not $env:VSCE_PAT) {
        if (Test-Path $envFile) {
            $patLine = Get-Content $envFile | Where-Object { $_ -match '^VSCE_PAT=' }
            if ($patLine) {
                $env:VSCE_PAT = $patLine.Split("=", 2)[1].Trim()
                Write-Host "   [OK] PAT loaded from .env" -ForegroundColor Green
            }
        }
    }
    
    if (-not $env:VSCE_PAT -and -not $PackageOnly) {
        Write-Host "[ERROR] VSCE_PAT not set. Add to .env or set environment variable." -ForegroundColor Red
        exit 1
    }

    # Get version info
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $version = $pkg.version
    $publisher = $pkg.publisher
    $name = $pkg.name
    $releaseType = if ($Stable) { "stable" } else { "pre-release" }

    Write-Host "`n[PKG] Extension: $publisher.$name" -ForegroundColor White
    Write-Host "   Version:   $version" -ForegroundColor White
    Write-Host "   Type:      $releaseType" -ForegroundColor White

    # Confirm (skip by default for LLM-friendly non-interactive use)
    if (-not $SkipConfirm -and -not $PackageOnly -and [Environment]::UserInteractive -and [Console]::IsInputRedirected -eq $false) {
        Write-Host "`n[WARN] About to publish v$version as $releaseType" -ForegroundColor Yellow
        Write-Host "   For full release workflow (bump, changelog, git), use:" -ForegroundColor Gray
        Write-Host "   ..\..\scripts\release-vscode.ps1 -BumpType patch" -ForegroundColor Gray
        $confirm = Read-Host "`nContinue? (y/N)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Host "Cancelled." -ForegroundColor Yellow
            exit 0
        }
    }
    else {
        Write-Host "[INFO] Publishing v$version as $releaseType (non-interactive)" -ForegroundColor Cyan
    }

    # Package
    Write-Host "`n[BUILD] Packaging..." -ForegroundColor Yellow
    npx vsce package
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Package failed" -ForegroundColor Red
        exit 1
    }

    $vsixFile = Get-ChildItem "*.vsix" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    Write-Host "   [OK] Created: $($vsixFile.Name)" -ForegroundColor Green

    if ($PackageOnly) {
        Write-Host "`n[PKG] Package ready: $($vsixFile.FullName)" -ForegroundColor Cyan
        exit 0
    }

    # Publish
    Write-Host "`n[PUBLISH] Publishing to VS Code Marketplace..." -ForegroundColor Yellow
    $vsceArgs = @("publish")
    if (-not $Stable) {
        $vsceArgs += "--pre-release"
    }
    
    & npx vsce @vsceArgs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Publish failed" -ForegroundColor Red
        exit 1
    }

    Write-Host "`n[OK] Published successfully!" -ForegroundColor Green
    Write-Host "   https://marketplace.visualstudio.com/items?itemName=$publisher.$name" -ForegroundColor Gray
}
finally {
    Pop-Location
}
