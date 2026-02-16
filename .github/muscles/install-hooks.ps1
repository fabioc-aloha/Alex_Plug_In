#Requires -Version 7.0
# Install Git Hooks - Set up quality gate automation
# Location: .github/muscles/install-hooks.ps1

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent (Split-Path -Parent $scriptDir)
$hooksSource = Join-Path $rootPath ".github\hooks"
$hooksTarget = Join-Path $rootPath ".git\hooks"

if (-not (Test-Path $hooksTarget)) {
    Write-Host "❌ .git/hooks directory not found. Is this a Git repository?" -ForegroundColor Red
    exit 1
}

Write-Host "Installing Git hooks..." -ForegroundColor Cyan

# Copy pre-commit hook
$preCommitSource = Join-Path $hooksSource "pre-commit"
$preCommitTarget = Join-Path $hooksTarget "pre-commit"

if (Test-Path $preCommitTarget) {
    Write-Host "  ⚠️  pre-commit hook already exists" -ForegroundColor Yellow
    $response = Read-Host "  Overwrite? (y/N)"
    if ($response -ne 'y') {
        Write-Host "  Skipped pre-commit hook" -ForegroundColor Gray
        exit 0
    }
}

Copy-Item $preCommitSource $preCommitTarget -Force

# Make executable on Unix systems
if ($IsLinux -or $IsMacOS) {
    chmod +x $preCommitTarget
}

Write-Host "✅ Git hooks installed" -ForegroundColor Green
Write-Host ""
Write-Host "Pre-commit hook will validate:" -ForegroundColor Cyan
Write-Host "  • SKILL.md YAML frontmatter" -ForegroundColor Gray
Write-Host "  • synapses.json structure" -ForegroundColor Gray
Write-Host "  • Episodic file naming" -ForegroundColor Gray
Write-Host "  • Master-only contamination" -ForegroundColor Gray
Write-Host ""
Write-Host "Test it now:" -ForegroundColor Yellow
Write-Host "  git add .github/skills/test-skill/SKILL.md" -ForegroundColor Gray
Write-Host "  git commit -m 'test'" -ForegroundColor Gray
Write-Host ""
Write-Host "To bypass (use sparingly):" -ForegroundColor Yellow
Write-Host "  git commit --no-verify" -ForegroundColor Gray
