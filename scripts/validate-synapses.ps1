<# 
.SYNOPSIS
    Validates synapse files for Alex cognitive architecture.

.DESCRIPTION
    Checks all synapses.json files for:
    - Valid JSON syntax
    - Required fields (skill/skillId, inheritance, connections)
    - schemaVersion presence
    - Valid connection targets (files exist)

.EXAMPLE
    .\validate-synapses.ps1
    
.EXAMPLE
    .\validate-synapses.ps1 -SkillsPath ".\.github\skills" -Strict
#>

param(
    [string]$SkillsPath = ".\.github\skills",
    [switch]$Strict,
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"

# Results tracking
$results = @{
    Total              = 0
    Valid              = 0
    InvalidJSON        = @()
    MissingSchema      = @()
    MissingSkillId     = @()
    MissingInheritance = @()
    MissingConnections = @()
    BrokenTargets      = @()
}

# Get all synapses.json files
$synapseFiles = Get-ChildItem -Path $SkillsPath -Recurse -Filter "synapses.json"

foreach ($file in $synapseFiles) {
    $results.Total++
    $skillName = $file.Directory.Name
    
    # Try to parse JSON
    try {
        $content = Get-Content $file.FullName -Raw | ConvertFrom-Json
    }
    catch {
        $results.InvalidJSON += $skillName
        if (-not $Quiet) {
            Write-Warning "Invalid JSON in: $skillName/synapses.json"
        }
        continue
    }
    
    $isValid = $true
    
    # Check required fields
    if (-not ($content.skill -or $content.skillId)) {
        $results.MissingSkillId += $skillName
        $isValid = $false
    }
    
    if (-not $content.schemaVersion) {
        $results.MissingSchema += $skillName
        # Not a failure, just a warning
    }
    
    if (-not $content.inheritance) {
        $results.MissingInheritance += $skillName
        $isValid = $false
    }
    
    if (-not $content.connections -or $content.connections.Count -eq 0) {
        $results.MissingConnections += $skillName
        $isValid = $false
    }
    
    # Validate connection targets exist (if strict mode)
    if ($Strict -and $content.connections) {
        foreach ($conn in $content.connections) {
            if ($conn.target) {
                $targetPath = Join-Path (Get-Location) $conn.target
                if (-not (Test-Path $targetPath)) {
                    $results.BrokenTargets += "$skillName -> $($conn.target)"
                    $isValid = $false
                }
            }
        }
    }
    
    if ($isValid) {
        $results.Valid++
    }
}

# Output results
if (-not $Quiet) {
    Write-Host "`n===== Synapse Validation Report =====" -ForegroundColor Cyan
    Write-Host "Total synapse files: $($results.Total)"
    Write-Host "Valid: $($results.Valid)" -ForegroundColor $(if ($results.Valid -eq $results.Total) { "Green" } else { "Yellow" })
    
    if ($results.InvalidJSON.Count -gt 0) {
        Write-Host "`nInvalid JSON ($($results.InvalidJSON.Count)):" -ForegroundColor Red
        $results.InvalidJSON | ForEach-Object { Write-Host "  - $_" }
    }
    
    if ($results.MissingSkillId.Count -gt 0) {
        Write-Host "`nMissing skill/skillId ($($results.MissingSkillId.Count)):" -ForegroundColor Red
        $results.MissingSkillId | ForEach-Object { Write-Host "  - $_" }
    }
    
    if ($results.MissingInheritance.Count -gt 0) {
        Write-Host "`nMissing inheritance ($($results.MissingInheritance.Count)):" -ForegroundColor Red
        $results.MissingInheritance | ForEach-Object { Write-Host "  - $_" }
    }
    
    if ($results.MissingConnections.Count -gt 0) {
        Write-Host "`nMissing/empty connections ($($results.MissingConnections.Count)):" -ForegroundColor Yellow
        $results.MissingConnections | ForEach-Object { Write-Host "  - $_" }
    }
    
    if ($results.MissingSchema.Count -gt 0) {
        Write-Host "`nMissing schemaVersion ($($results.MissingSchema.Count)):" -ForegroundColor Yellow
        $results.MissingSchema | ForEach-Object { Write-Host "  - $_" }
    }
    
    if ($Strict -and $results.BrokenTargets.Count -gt 0) {
        Write-Host "`nBroken targets ($($results.BrokenTargets.Count)):" -ForegroundColor Red
        $results.BrokenTargets | ForEach-Object { Write-Host "  - $_" }
    }
}

# Exit with error if issues found
$criticalErrors = $results.InvalidJSON.Count + $results.MissingSkillId.Count + $results.MissingInheritance.Count
if ($Strict) {
    $criticalErrors += $results.BrokenTargets.Count
}

if ($criticalErrors -gt 0) {
    if (-not $Quiet) {
        Write-Host "`n❌ Synapse validation failed with $criticalErrors critical error(s)" -ForegroundColor Red
    }
    exit 1
}
else {
    if (-not $Quiet) {
        Write-Host "`n✅ All synapse files valid" -ForegroundColor Green
    }
    exit 0
}
