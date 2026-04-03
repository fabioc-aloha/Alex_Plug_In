# build-skill-pack.ps1
# Builds the alex-coworker-skills.zip and deploys to local OneDrive.
# Usage: .\build-skill-pack.ps1
# Output: alex-coworker-skills.zip in the same directory + local OneDrive sync

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
}
else {
    Write-Host "[FAIL] Zip creation failed" -ForegroundColor Red
    exit 1
}

# --- Local OneDrive deployment ---

# Detect OneDrive Documents path
$oneDriveDocs = $null
$candidates = @(
    (Join-Path $env:USERPROFILE 'OneDrive - Microsoft\Documents'),
    (Join-Path $env:USERPROFILE 'OneDrive\Documents'),
    (Join-Path $env:OneDriveCommercial 'Documents')
)
foreach ($c in $candidates) {
    if ($c -and (Test-Path $c)) {
        $oneDriveDocs = $c
        break
    }
}

if (-not $oneDriveDocs) {
    Write-Host ""
    Write-Host "[SKIP] OneDrive Documents folder not found. Zip built but not deployed locally." -ForegroundColor Yellow
    Write-Host "[INFO] To deploy manually, extract the zip at your OneDrive Documents root." -ForegroundColor Yellow
    exit 0
}

$deployTarget = Join-Path $oneDriveDocs 'Cowork'
Write-Host ""
Write-Host "[INFO] Deploying to: $deployTarget" -ForegroundColor Cyan

# Create Cowork/Skills/ if needed
$deploySkills = Join-Path $deployTarget 'Skills'
if (-not (Test-Path $deploySkills)) {
    New-Item -Path $deploySkills -ItemType Directory -Force | Out-Null
    Write-Host "[INFO] Created $deploySkills" -ForegroundColor Yellow
}

# Sync skills
$synced = 0
foreach ($dir in $skillDirs) {
    $targetDir = Join-Path $deploySkills $dir.Name
    if (-not (Test-Path $targetDir)) {
        New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
    }
    $srcFile = Join-Path $dir.FullName 'SKILL.md'
    $dstFile = Join-Path $targetDir 'SKILL.md'
    Copy-Item $srcFile $dstFile -Force
    $synced++
}

# Sync custom-instructions.txt
$ciSrc = Join-Path $coworkDir 'custom-instructions.txt'
$ciDst = Join-Path $deployTarget 'custom-instructions.txt'
if (Test-Path $ciSrc) {
    Copy-Item $ciSrc $ciDst -Force
    Write-Host "[OK] Synced custom-instructions.txt" -ForegroundColor Green
}

# Verify with hash comparison
$mismatches = 0
foreach ($dir in $skillDirs) {
    $srcFile = Join-Path $dir.FullName 'SKILL.md'
    $dstFile = Join-Path $deploySkills "$($dir.Name)\SKILL.md"
    if ((Get-FileHash $srcFile -Algorithm MD5).Hash -ne (Get-FileHash $dstFile -Algorithm MD5).Hash) {
        Write-Host "[MISMATCH] $($dir.Name)" -ForegroundColor Red
        $mismatches++
    }
}

if ($mismatches -eq 0) {
    Write-Host "[OK] Deployed $synced skills to OneDrive (all verified)" -ForegroundColor Green
}
else {
    Write-Host "[WARN] $mismatches file(s) did not match after copy" -ForegroundColor Red
}
