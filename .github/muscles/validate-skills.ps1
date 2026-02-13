<# 
.SYNOPSIS
    Validates Alex skills for VS Code 1.109 Agent Skills compliance.

.DESCRIPTION
    Checks all SKILL.md files in .github/skills/ for required frontmatter:
    - name (required for dropdown display)
    - description (required for tooltip)
    - applyTo (recommended for activation)

.EXAMPLE
    .\validate-skills.ps1
    
.EXAMPLE
    .\validate-skills.ps1 -Fix
#>

param(
    [switch]$Fix,
    [string]$SkillsPath = ".\.github\skills"
)

$ErrorActionPreference = "Stop"

# Results tracking
$results = @{
    Total = 0
    Valid = 0
    MissingName = @()
    MissingDescription = @()
    MissingApplyTo = @()
    NoFrontmatter = @()
}

# Get all skill directories
$skillDirs = Get-ChildItem -Path $SkillsPath -Directory | Where-Object { $_.Name -ne ".markdownlint.json" }

foreach ($dir in $skillDirs) {
    $skillFile = Join-Path $dir.FullName "SKILL.md"
    
    if (-not (Test-Path $skillFile)) {
        Write-Warning "No SKILL.md in: $($dir.Name)"
        continue
    }
    
    $results.Total++
    $content = Get-Content $skillFile -Raw
    
    # Check for YAML frontmatter
    $hasFrontmatter = $content -match "^---\s*\r?\n([\s\S]*?)\r?\n---"
    
    if (-not $hasFrontmatter) {
        $results.NoFrontmatter += $dir.Name
        $results.MissingName += $dir.Name
        $results.MissingDescription += $dir.Name
        $results.MissingApplyTo += $dir.Name
        continue
    }
    
    $frontmatter = $Matches[1]
    
    # Check required fields (multiline-safe patterns)
    $hasName = $frontmatter -match '(?m)^name:\s*[''"]?.+[''"]?\s*$'
    $hasDescription = $frontmatter -match '(?m)^description:\s*[''"]?.+[''"]?\s*$'
    $hasApplyTo = $frontmatter -match '(?m)^applyTo:\s*[''"]?.+[''"]?\s*$'
    
    if (-not $hasName) { $results.MissingName += $dir.Name }
    if (-not $hasDescription) { $results.MissingDescription += $dir.Name }
    if (-not $hasApplyTo) { $results.MissingApplyTo += $dir.Name }
    
    if ($hasName -and $hasDescription) {
        $results.Valid++
    }
}

# Output results
Write-Host "`n===== Skill Validation Report =====" -ForegroundColor Cyan
Write-Host "Total skills: $($results.Total)"
Write-Host "Valid (name + description): $($results.Valid)" -ForegroundColor $(if ($results.Valid -eq $results.Total) { "Green" } else { "Yellow" })

if ($results.NoFrontmatter.Count -gt 0) {
    Write-Host "`nNo frontmatter ($($results.NoFrontmatter.Count)):" -ForegroundColor Red
    $results.NoFrontmatter | ForEach-Object { Write-Host "  - $_" }
}

if ($results.MissingName.Count -gt 0) {
    Write-Host "`nMissing 'name' ($($results.MissingName.Count)):" -ForegroundColor Yellow
    $results.MissingName | ForEach-Object { Write-Host "  - $_" }
}

if ($results.MissingDescription.Count -gt 0) {
    Write-Host "`nMissing 'description' ($($results.MissingDescription.Count)):" -ForegroundColor Yellow
    $results.MissingDescription | ForEach-Object { Write-Host "  - $_" }
}

if ($results.MissingApplyTo.Count -gt 0) {
    Write-Host "`nMissing 'applyTo' ($($results.MissingApplyTo.Count)):" -ForegroundColor Gray
    $results.MissingApplyTo | ForEach-Object { Write-Host "  - $_" }
}

# Summary
$complianceRate = if ($results.Total -gt 0) { [math]::Round(($results.Valid / $results.Total) * 100, 1) } else { 0 }
Write-Host "`n===== Summary =====" -ForegroundColor Cyan
Write-Host "Compliance rate: $complianceRate%" -ForegroundColor $(if ($complianceRate -eq 100) { "Green" } elseif ($complianceRate -ge 80) { "Yellow" } else { "Red" })

# Return exit code for CI
if ($results.Valid -lt $results.Total) {
    exit 1
} else {
    Write-Host "`nAll skills are VS Code 1.109 compliant!" -ForegroundColor Green
    exit 0
}
