<#
.SYNOPSIS
    Deploy Alex Cognitive Architecture to a GitHub Codespaces-enabled repository

.DESCRIPTION
    This script prepares a target repository for Alex in GitHub Codespaces by:
    1. Creating .devcontainer/devcontainer.json with Alex extension + settings
    2. Configuring Global Knowledge auto-clone via postCreateCommand
    3. Optionally initializing the Alex architecture (.github/) if not present

    After running, any Codespace opened from the target repo will have Alex
    pre-installed with full cognitive capabilities.

.PARAMETER TargetRepo
    Path to the target repository. Defaults to current directory.

.PARAMETER GitHubUser
    GitHub username for Global Knowledge repo clone. Defaults to git config user.

.PARAMETER SkipGK
    Skip Global Knowledge auto-clone configuration.

.PARAMETER Force
    Overwrite existing devcontainer.json without prompting.

.EXAMPLE
    .\deploy.ps1
    .\deploy.ps1 -TargetRepo "C:\Projects\my-app" -GitHubUser "fabioc-aloha"
    .\deploy.ps1 -SkipGK -Force
#>

param(
    [string]$TargetRepo = (Get-Location).Path,
    [string]$GitHubUser = "",
    [switch]$SkipGK,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$templatePath = Join-Path $scriptDir "devcontainer.json"

Write-Host "`n☁️  Alex Codespaces — Deploy Script" -ForegroundColor Cyan
Write-Host "------------------------------------" -ForegroundColor Cyan

# --- Validate target ---
if (-not (Test-Path (Join-Path $TargetRepo ".git"))) {
    Write-Host "❌ Not a git repository: $TargetRepo" -ForegroundColor Red
    exit 1
}
Write-Host "📁 Target: $TargetRepo" -ForegroundColor Gray

# --- Resolve GitHub user ---
if (-not $GitHubUser) {
    $GitHubUser = git -C $TargetRepo config user.name 2>$null
    if (-not $GitHubUser) {
        $GitHubUser = $env:GITHUB_USER
    }
}
if ($GitHubUser) {
    Write-Host "👤 GitHub user: $GitHubUser" -ForegroundColor Gray
}
else {
    Write-Host '⚠️  No GitHub user detected — GK postCreateCommand will use ${localEnv:GITHUB_USER}' -ForegroundColor Yellow
}

# --- Create .devcontainer directory ---
$devcontainerDir = Join-Path $TargetRepo ".devcontainer"
$devcontainerFile = Join-Path $devcontainerDir "devcontainer.json"

if ((Test-Path $devcontainerFile) -and -not $Force) {
    Write-Host "`n⚠️  .devcontainer/devcontainer.json already exists." -ForegroundColor Yellow
    $response = Read-Host "   Overwrite? (y/N)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host "   Skipped — keeping existing devcontainer.json" -ForegroundColor Gray
    }
    else {
        $Force = $true
    }
}

if (-not (Test-Path $devcontainerFile) -or $Force) {
    New-Item -ItemType Directory -Path $devcontainerDir -Force | Out-Null

    # Read template and substitute GitHub user
    $template = Get-Content $templatePath -Raw

    if ($SkipGK) {
        # Remove postCreateCommand entirely
        $config = $template | ConvertFrom-Json
        $config.PSObject.Properties.Remove('postCreateCommand')
        $json = $config | ConvertTo-Json -Depth 10
    }
    else {
        if ($GitHubUser) {
            $json = $template -replace '\$\{localEnv:GITHUB_USER\}', $GitHubUser
        }
        else {
            $json = $template
        }
    }

    $json | Set-Content $devcontainerFile -Encoding UTF8
    Write-Host "✅ Created .devcontainer/devcontainer.json" -ForegroundColor Green
}

# --- Check if Alex architecture exists ---
$alexGitHub = Join-Path $TargetRepo ".github"
$alexConfig = Join-Path $alexGitHub "config"
$hasAlex = (Test-Path (Join-Path $alexGitHub "instructions")) -or (Test-Path (Join-Path $alexGitHub "skills"))

if (-not $hasAlex) {
    Write-Host "`nℹ️  No Alex architecture found in target repo." -ForegroundColor Yellow
    Write-Host "   Run 'Alex: Initialize Architecture' in VS Code to set up .github/" -ForegroundColor Yellow
    Write-Host "   Or open in Codespaces — the extension will prompt you on first launch." -ForegroundColor Gray
}
else {
    Write-Host "✅ Alex architecture detected in .github/" -ForegroundColor Green
}

# --- Summary ---
Write-Host "`n📋 Deployment Summary" -ForegroundColor Cyan
Write-Host "   Devcontainer:  $devcontainerFile" -ForegroundColor White
Write-Host "   Extension:     fabioc-aloha.alex-cognitive-architecture" -ForegroundColor White
Write-Host "   Copilot:       GitHub.copilot + GitHub.copilot-chat" -ForegroundColor White
if (-not $SkipGK) {
    Write-Host "   Global Knowledge: auto-clone on Codespace creation" -ForegroundColor White
}
Write-Host "   Alex .github/: $(if ($hasAlex) { 'Present' } else { 'Not yet initialized' })" -ForegroundColor White

Write-Host "`n👉 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Commit .devcontainer/devcontainer.json" -ForegroundColor White
Write-Host "   2. Push to GitHub" -ForegroundColor White
Write-Host "   3. Open repo in Codespaces → Alex is ready!" -ForegroundColor White

Write-Host "`n✨ Done!" -ForegroundColor Cyan
