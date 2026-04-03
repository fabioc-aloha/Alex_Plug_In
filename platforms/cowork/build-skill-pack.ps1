# build-skill-pack.ps1
# Builds the alex-coworker-skills.zip from the Cowork/ subfolder.
# Usage: .\build-skill-pack.ps1
# Output: alex-coworker-skills.zip in the same directory

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$coworkDir = Join-Path $scriptDir 'Cowork'
$outputZip = Join-Path $scriptDir 'alex-coworker-skills.zip'

# Validate source exists
if (-not (Test-Path $coworkDir)) {
    Write-Host "[FAIL] Cowork/ directory not found at: $coworkDir" -ForegroundColor Red
    exit 1
}

$skillDirs = Get-ChildItem -Path (Join-Path $coworkDir 'Skills') -Directory
$skillCount = $skillDirs.Count

if ($skillCount -eq 0) {
    Write-Host "[FAIL] No skill folders found in Cowork/Skills/" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Found $skillCount skills in Cowork/Skills/" -ForegroundColor Cyan

# Validate each skill has a SKILL.md
$missing = @()
foreach ($dir in $skillDirs) {
    $skillFile = Join-Path $dir.FullName 'SKILL.md'
    if (-not (Test-Path $skillFile)) {
        $missing += $dir.Name
    }
}

if ($missing.Count -gt 0) {
    Write-Host "[FAIL] Missing SKILL.md in: $($missing -join ', ')" -ForegroundColor Red
    exit 1
}

# Remove existing zip if present
if (Test-Path $outputZip) {
    Remove-Item $outputZip -Force
    Write-Host "[INFO] Removed existing zip" -ForegroundColor Yellow
}

# Create zip from Cowork/ directory
# The zip root will contain the Cowork/ folder so extracting at Documents root gives Documents/Cowork/Skills/...
Compress-Archive -Path $coworkDir -DestinationPath $outputZip -CompressionLevel Optimal

if (Test-Path $outputZip) {
    $zipSize = (Get-Item $outputZip).Length
    $zipSizeKB = [math]::Round($zipSize / 1024, 1)
    Write-Host ""
    Write-Host "[OK] Built: $outputZip ($zipSizeKB KB)" -ForegroundColor Green
    Write-Host "[OK] Contains $skillCount skills" -ForegroundColor Green
    Write-Host ""
    Write-Host "Skills included:" -ForegroundColor Cyan
    foreach ($dir in ($skillDirs | Sort-Object Name)) {
        Write-Host "  - $($dir.Name)"
    }
} else {
    Write-Host "[FAIL] Zip creation failed" -ForegroundColor Red
    exit 1
}
