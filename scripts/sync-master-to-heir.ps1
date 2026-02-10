<# 
.SYNOPSIS
    Role-adapted Master→Heir sync script for Alex cognitive architecture.

.DESCRIPTION
    Syncs files from Master Alex to heirs based on inheritance roles defined
    in synapses.json files. This enables intelligent, automatic sync without
    hard-coded exclusion lists.

    Inheritance Roles:
    - "inheritable" or "all-heirs": Copy to all heirs
    - "master-only": Never copy to heirs
    - "heir:vscode": Copy only to VS Code extension
    - "heir:m365": Copy only to M365 agent

.EXAMPLE
    .\sync-master-to-heir.ps1 -Heir vscode
    
.EXAMPLE
    .\sync-master-to-heir.ps1 -Heir m365 -DryRun
#>

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("vscode", "m365")]
    [string]$Heir,
    
    [switch]$DryRun,
    [switch]$ShowDetails
)

$ErrorActionPreference = "Stop"

# Paths based on heir
$RootPath = Split-Path $PSScriptRoot -Parent
$SourceGithub = Join-Path $RootPath ".github"

$HeirPaths = @{
    "vscode" = Join-Path $RootPath "platforms/vscode-extension/.github"
    "m365"   = Join-Path $RootPath "platforms/m365-copilot/.github"
}
$TargetGithub = $HeirPaths[$Heir]

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Role-Adapted Master→Heir Sync" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Source: $SourceGithub"
Write-Host "Target: $TargetGithub"
Write-Host "Heir:   $Heir"
if ($DryRun) { Write-Host "Mode:   DRY RUN" -ForegroundColor Yellow }
Write-Host ""

# Results tracking
$stats = @{
    Synced              = 0
    Skipped             = 0
    SkippedMasterOnly   = 0
    SkippedHeirSpecific = 0
    Errors              = 0
}

# Hard-coded exclusions (repo-specific, not skill-related)
$AlwaysExclude = @(
    "ISSUE_TEMPLATE",
    "PULL_REQUEST_TEMPLATE.md",
    "FUNDING.yml",
    "dependabot.yml",
    "workflows",
    "config/MASTER-ALEX-PROTECTED.json",
    "config/cognitive-config.json",
    "config/user-profile.json",
    "config/USER-PROFILE.md",
    "config/USER-PROFILE-TEMPLATE.md",
    "episodic"
)

function Get-SkillInheritance {
    param([string]$SkillPath)
    
    $synapsePath = Join-Path $SkillPath "synapses.json"
    if (-not (Test-Path $synapsePath)) {
        # Default: inheritable if no synapses.json
        return "inheritable"
    }
    
    try {
        $synapse = Get-Content $synapsePath -Raw | ConvertFrom-Json
        if ($synapse.inheritance) {
            return $synapse.inheritance
        }
        return "inheritable"
    }
    catch {
        Write-Warning "Failed to parse $synapsePath"
        return "inheritable"
    }
}

function Test-ShouldSync {
    param(
        [string]$RelativePath,
        [string]$FullPath
    )
    
    $normalizedPath = $RelativePath -replace '\\', '/'
    
    # Check hard-coded exclusions
    foreach ($pattern in $AlwaysExclude) {
        if ($normalizedPath -eq $pattern -or $normalizedPath.StartsWith("$pattern/")) {
            return @{ Sync = $false; Reason = "hard-excluded" }
        }
    }
    
    # Check skill-specific inheritance
    if ($normalizedPath -match "^skills/([^/]+)") {
        $skillName = $Matches[1]
        $skillFolder = Join-Path $SourceGithub "skills/$skillName"
        
        if (Test-Path $skillFolder) {
            $inheritance = Get-SkillInheritance -SkillPath $skillFolder
            
            switch ($inheritance) {
                "master-only" {
                    return @{ Sync = $false; Reason = "master-only" }
                }
                "heir:vscode" {
                    if ($Heir -ne "vscode") {
                        return @{ Sync = $false; Reason = "heir-specific" }
                    }
                }
                "heir:m365" {
                    if ($Heir -ne "m365") {
                        return @{ Sync = $false; Reason = "heir-specific" }
                    }
                }
                default {
                    # "inheritable" or "all-heirs" — sync to all
                }
            }
        }
    }
    
    return @{ Sync = $true; Reason = "inheritable" }
}

# Process all files
Write-Host "Analyzing files..." -ForegroundColor Yellow

$allFiles = Get-ChildItem -Path $SourceGithub -Recurse -File
$totalFiles = $allFiles.Count

foreach ($file in $allFiles) {
    $relativePath = $file.FullName.Substring($SourceGithub.Length + 1)
    $targetPath = Join-Path $TargetGithub $relativePath
    
    $result = Test-ShouldSync -RelativePath $relativePath -FullPath $file.FullName
    
    if ($result.Sync) {
        if ($ShowDetails) {
            Write-Host "  ✅ $relativePath" -ForegroundColor Green
        }
        
        if (-not $DryRun) {
            $targetDir = Split-Path $targetPath -Parent
            if (-not (Test-Path $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
            Copy-Item -Path $file.FullName -Destination $targetPath -Force
        }
        $stats.Synced++
    }
    else {
        if ($ShowDetails) {
            Write-Host "  ⏭️ $relativePath ($($result.Reason))" -ForegroundColor Gray
        }
        
        switch ($result.Reason) {
            "master-only" { $stats.SkippedMasterOnly++ }
            "heir-specific" { $stats.SkippedHeirSpecific++ }
            default { $stats.Skipped++ }
        }
    }
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sync Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total files:        $totalFiles"
Write-Host "Synced:             $($stats.Synced)" -ForegroundColor Green
Write-Host "Skipped (excluded): $($stats.Skipped)" -ForegroundColor Gray
Write-Host "Skipped (master):   $($stats.SkippedMasterOnly)" -ForegroundColor Yellow
Write-Host "Skipped (heir):     $($stats.SkippedHeirSpecific)" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host ""
    Write-Host "DRY RUN - No files were modified" -ForegroundColor Yellow
}
else {
    # Post-process: Reset heir copilot-instructions.md for publication
    $heirCopilotPath = Join-Path $TargetGithub "copilot-instructions.md"
    if (Test-Path $heirCopilotPath) {
        Write-Host ""
        Write-Host "Resetting heir copilot-instructions.md..." -ForegroundColor Yellow
        
        $content = Get-Content $heirCopilotPath -Raw
        $originalContent = $content
        
        # Reset P5-P7 slots to available
        $content = $content -replace '\| \*\*P5\*\* \| [^|]+ \| Domain \| [^|]+ \|', '| **P5** | *(available)* | Domain | Assigned based on project detection |'
        $content = $content -replace '\| \*\*P6\*\* \| [^|]+ \| Domain \| [^|]+ \|', '| **P6** | *(available)* | Domain | Assigned based on session goals |'
        $content = $content -replace '\| \*\*P7\*\* \| [^|]+ \| Domain \| [^|]+ \|', '| **P7** | *(available)* | Domain | Assigned based on task context |'
        
        # Remove Master Alex default line
        $content = $content -replace '- \*\*Master Alex default\*\*: [^\r\n]+\r?\n', ''
        
        # Reset Last Assessed
        $content = $content -replace '\*\*Last Assessed\*\*: [^\r\n]+', '**Last Assessed**: *(awaiting first session)*'
        
        if ($content -ne $originalContent) {
            Set-Content -Path $heirCopilotPath -Value $content -NoNewline
            Write-Host "  ✅ Reset P5-P7 slots and Last Assessed" -ForegroundColor Green
        }
        else {
            Write-Host "  ⏭️ Already reset" -ForegroundColor Gray
        }
    }
    
    # Post-process: Reset heir user-profile.json to starter template
    $heirProfilePath = Join-Path $TargetGithub "config/user-profile.json"
    if (Test-Path $heirProfilePath) {
        Write-Host ""
        Write-Host "Resetting heir user-profile.json..." -ForegroundColor Yellow
        
        $starterProfile = @{
            name                 = ""
            nickname             = ""
            pronouns             = ""
            formality            = "balanced"
            detailLevel          = "balanced"
            explanationStyle     = "mixed"
            humor                = $true
            encouragement        = $true
            questionFrequency    = "moderate"
            proactiveSuggestions = $true
            primaryTechnologies  = @()
            learningGoals        = @()
            expertiseAreas       = @()
            currentProjects      = @()
            projectPersona       = $null
            learningStyle        = @{
                type        = "mixed"
                preferences = @()
            }
            workStyle            = @{
                planning     = ""
                diagrams     = ""
                mermaidStyle = "GitHub-compatible"
            }
            modelPreferences     = @{
                default             = "claude-opus-4-5"
                alertOnHeavyLifting = $true
                heavyLiftingTasks   = @(
                    "Meditation/consolidation sessions",
                    "Self-actualization assessments",
                    "Complex multi-file architecture refactoring",
                    "Bootstrap learning (new skill acquisition)"
                )
                routineTasks        = @(
                    "Code edits, debugging, simple refactors",
                    "Documentation updates",
                    "File searches and context gathering"
                )
            }
        }
        
        $starterProfile | ConvertTo-Json -Depth 4 | Set-Content -Path $heirProfilePath
        Write-Host "  ✅ Reset to starter template" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "✅ Sync complete!" -ForegroundColor Green
}
