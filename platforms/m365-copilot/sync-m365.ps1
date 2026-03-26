<#
.SYNOPSIS
    Syncs Master Alex .github/ content into the M365 Copilot heir .github/.

.DESCRIPTION
    Copies curated skills, instructions, and prompts from the Master Alex
    .github/ directory into platforms/m365-copilot/.github/. Preserves
    M365-specific skills already in the heir that don't exist in Master.

.NOTES
    Safety: This only WRITES to platforms/m365-copilot/.github/.
    It never modifies the Master .github/ source of truth.
    M365-specific skills (excel-integration, outlook-integration, etc.)
    are preserved and not overwritten.
#>

param(
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$masterGithub = Join-Path $repoRoot '.github'
$heirGithub = Join-Path $PSScriptRoot '.github'

# M365-specific skills that exist only in this heir (not in Master)
$m365OnlySkills = @(
    'excel-integration'
    'office-document-integration'
    'outlook-integration'
    'powerpoint-integration'
    'word-integration'
)

# All plugin-ready skills from Master -- same set as agent-plugin
$curatedSkills = @(
    # Cognitive & Learning
    'bootstrap-learning'
    'knowledge-synthesis'
    'cognitive-load'
    'learning-psychology'
    'appropriate-reliance'
    'airs-appropriate-reliance'
    'socratic-questioning'
    'rubber-duck-debugging'
    'cognitive-load'
    'anti-hallucination'
    'dialog-engineering'
    'awareness'
    'work-life-balance'
    'deep-work-optimization'
    'cognitive-symbiosis'
    'memory-activation'
    # Empathy & Coaching
    'frustration-recognition'
    'coaching-techniques'
    'proactive-assistance'
    # Engineering Fundamentals
    'research-first-development'
    'testing-strategies'
    'code-review'
    'refactoring-patterns'
    'debugging-patterns'
    'git-workflow'
    'project-scaffolding'
    'vscode-environment'
    'api-design'
    # Operations & Reliability
    'north-star'
    'incident-response'
    'scope-management'
    'status-reporting'
    'project-management'
    'root-cause-analysis'
    'error-recovery-patterns'
    'post-mortem'
    'project-deployment'
    'change-management'
    # Security & Privacy
    'security-review'
    'pii-privacy-regulations'
    'privacy-responsible-ai'
    'distribution-security'
    # Documentation & Communication
    'markdown-mermaid'
    'documentation-quality-assurance'
    'doc-hygiene'
    'academic-research'
    'practitioner-research'
    'research-project-scaffold'
    'grant-writing'
    'creative-writing'
    'lint-clean-markdown'
    'ascii-art-alignment'
    'localization'
    'api-documentation'
    'cross-cultural-collaboration'
    'executive-storytelling'
    'slide-design'
    # Academic Research
    'literature-review'
    'citation-management'
    'dissertation-defense'
    # Visual Design (no-dependency subset)
    'svg-graphics'
    'graphic-design'
    # Business & Analysis
    'business-analysis'
    'alex-effort-estimation'
    # Architecture & Design (no-dependency subset)
    'architecture-audit'
    'architecture-refinement'
    'llm-model-selection'
    'skill-building'
    'skill-development'
    'muscle-memory-recognition'
    # AI & Machine Learning (no-dependency subset)
    'prompt-engineering'
    'mcp-development'
    'rag-architecture'
    'ai-agent-design'
    # Other
    'ui-ux-design'
    'enterprise-integration'
    'database-design'
    'multi-agent-orchestration'
    'observability-monitoring'
    'performance-profiling'
    'presentation-tool-selection'
    # M365-relevant additions
    'visual-memory'
)

# Curated instructions -- universal, not extension-specific
$curatedInstructions = @(
    'code-review-guidelines.instructions.md'
    'research-first-workflow.instructions.md'
    'testing-strategies.instructions.md'
    'nasa-code-standards.instructions.md'
    'architecture-decision-records.instructions.md'
    'dependency-management.instructions.md'
    'technical-debt-tracking.instructions.md'
    'semantic-audit.instructions.md'
    'empirical-validation.instructions.md'
    'knowledge-synthesis.instructions.md'
    'north-star.instructions.md'
    'skill-selection-optimization.instructions.md'
    'deep-thinking.instructions.md'
    'bootstrap-learning.instructions.md'
    'markdown-mermaid.instructions.md'
    'ui-ux-design.instructions.md'
    'mcp-development.instructions.md'
    'skill-building.instructions.md'
    'adversarial-oversight.instructions.md'
    'worldview-constitutional-ai.instructions.md'
    'worldview-integration.instructions.md'
    'worldview-moral-psychology.instructions.md'
    # M365-specific
    'visual-memory.instructions.md'
)

# M365-specific prompts that exist only in this heir (not in Master)
$m365OnlyPrompts = @(
    'help.prompt.md'
)

# Curated prompts -- universal, no extension commands required
$curatedPrompts = @(
    'plan.prompt.md'
    'review.prompt.md'
    'improve.prompt.md'
    'learn.prompt.md'
    'gapanalysis.prompt.md'
    'northstar.prompt.md'
    'tdd.prompt.md'
    'cross-domain-transfer.prompt.md'
    'mcp-server.prompt.md'
    'ui-ux-audit.prompt.md'
    'presentation.prompt.md'
    # M365-specific (synced from Master if they exist there too)
    'visual-memory.prompt.md'
)

function Write-Step {
    param([string]$Message)
    Write-Host "  -> $Message" -ForegroundColor Cyan
}

function Sync-Directory {
    param(
        [string]$Source,
        [string]$Dest,
        [string]$Label
    )

    if ($DryRun) {
        Write-Step "[DRY RUN] Would sync $Label from $Source"
        return
    }

    if (Test-Path $Dest) {
        Remove-Item $Dest -Recurse -Force
    }
    Copy-Item $Source $Dest -Recurse -Force
    Write-Step "Synced $Label"
}

function Sync-File {
    param(
        [string]$Source,
        [string]$Dest,
        [string]$Label
    )

    if ($DryRun) {
        Write-Step "[DRY RUN] Would sync $Label"
        return
    }

    $destDir = Split-Path $Dest -Parent
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    Copy-Item $Source $Dest -Force
    Write-Step "Synced $Label"
}

Write-Host ""
Write-Host "[SYNC] Alex M365 Copilot Heir Sync" -ForegroundColor Green
Write-Host "   Master: $masterGithub" -ForegroundColor DarkGray
Write-Host "   Target: $heirGithub" -ForegroundColor DarkGray
Write-Host ""

# 1. Curated Skills from Master
Write-Host "[1/3] Skills ($($curatedSkills.Count) from Master + $($m365OnlySkills.Count) M365-specific)" -ForegroundColor Yellow
$skillsDst = Join-Path $heirGithub 'skills'

# Back up M365-only skills
$m365Backup = @{}
foreach ($m365Skill in $m365OnlySkills) {
    $m365Path = Join-Path $skillsDst $m365Skill
    if (Test-Path $m365Path) {
        $backupPath = Join-Path $env:TEMP "alex-m365-skill-$m365Skill"
        if (-not $DryRun) {
            if (Test-Path $backupPath) { Remove-Item $backupPath -Recurse -Force }
            Copy-Item $m365Path $backupPath -Recurse -Force
        }
        $m365Backup[$m365Skill] = $backupPath
        Write-Step "Backed up M365-specific: skills/$m365Skill"
    }
}

# Clean and rebuild skills directory
if (-not $DryRun) {
    if (Test-Path $skillsDst) {
        Remove-Item $skillsDst -Recurse -Force
    }
    New-Item -ItemType Directory -Path $skillsDst -Force | Out-Null
}

# Sync from Master
foreach ($skill in $curatedSkills) {
    $src = Join-Path $masterGithub "skills\$skill"
    if (Test-Path $src) {
        $dst = Join-Path $skillsDst $skill
        Sync-Directory -Source $src -Dest $dst -Label "skills/$skill"
    }
    else {
        Write-Host "  ! Skill not found in Master: $skill" -ForegroundColor DarkYellow
    }
}

# Restore M365-only skills
foreach ($m365Skill in $m365Backup.Keys) {
    $restorePath = Join-Path $skillsDst $m365Skill
    if (-not $DryRun) {
        Copy-Item $m365Backup[$m365Skill] $restorePath -Recurse -Force
        Remove-Item $m365Backup[$m365Skill] -Recurse -Force
    }
    Write-Step "Restored M365-specific: skills/$m365Skill"
}

# 2. Curated Instructions
Write-Host "[2/3] Instructions ($($curatedInstructions.Count) curated)" -ForegroundColor Yellow
$instrDst = Join-Path $heirGithub 'instructions'
if (-not $DryRun) {
    if (Test-Path $instrDst) {
        Remove-Item $instrDst -Recurse -Force
    }
    New-Item -ItemType Directory -Path $instrDst -Force | Out-Null
}
foreach ($instr in $curatedInstructions) {
    $src = Join-Path $masterGithub "instructions\$instr"
    if (Test-Path $src) {
        $dst = Join-Path $instrDst $instr
        Sync-File -Source $src -Dest $dst -Label "instructions/$instr"
    }
    else {
        Write-Host "  ! Instruction not found: $instr" -ForegroundColor DarkYellow
    }
}

# 3. Curated Prompts
Write-Host "[3/3] Prompts ($($curatedPrompts.Count) from Master + $($m365OnlyPrompts.Count) M365-specific)" -ForegroundColor Yellow
$promptsDst = Join-Path $heirGithub 'prompts'

# Back up M365-only prompts
$m365PromptBackup = @{}
foreach ($m365Prompt in $m365OnlyPrompts) {
    $m365Path = Join-Path $promptsDst $m365Prompt
    if (Test-Path $m365Path) {
        $backupPath = Join-Path $env:TEMP "alex-m365-prompt-$m365Prompt"
        if (-not $DryRun) {
            if (Test-Path $backupPath) { Remove-Item $backupPath -Force }
            Copy-Item $m365Path $backupPath -Force
        }
        $m365PromptBackup[$m365Prompt] = $backupPath
        Write-Step "Backed up M365-specific: prompts/$m365Prompt"
    }
}

if (-not $DryRun) {
    if (Test-Path $promptsDst) {
        Remove-Item $promptsDst -Recurse -Force
    }
    New-Item -ItemType Directory -Path $promptsDst -Force | Out-Null
}
foreach ($prompt in $curatedPrompts) {
    $src = Join-Path $masterGithub "prompts\$prompt"
    if (Test-Path $src) {
        $dst = Join-Path $promptsDst $prompt
        Sync-File -Source $src -Dest $dst -Label "prompts/$prompt"
    }
    else {
        Write-Host "  ! Prompt not found in Master: $prompt" -ForegroundColor DarkYellow
    }
}

# Restore M365-only prompts
foreach ($m365Prompt in $m365PromptBackup.Keys) {
    $restorePath = Join-Path $promptsDst $m365Prompt
    if (-not $DryRun) {
        Copy-Item $m365PromptBackup[$m365Prompt] $restorePath -Force
        Remove-Item $m365PromptBackup[$m365Prompt] -Force
    }
    Write-Step "Restored M365-specific: prompts/$m365Prompt"
}

# Summary
$skillCount = (Get-ChildItem (Join-Path $heirGithub 'skills') -Directory -ErrorAction SilentlyContinue).Count
$instrCount = (Get-ChildItem (Join-Path $heirGithub 'instructions') -Filter '*.instructions.md' -ErrorAction SilentlyContinue).Count
$promptCount = (Get-ChildItem (Join-Path $heirGithub 'prompts') -Filter '*.prompt.md' -ErrorAction SilentlyContinue).Count

Write-Host ""
Write-Host "[DONE] M365 heir sync complete" -ForegroundColor Green
Write-Host "   Skills:       $skillCount ($($m365OnlySkills.Count) M365-specific preserved)" -ForegroundColor DarkGray
Write-Host "   Instructions: $instrCount" -ForegroundColor DarkGray
Write-Host "   Prompts:      $promptCount" -ForegroundColor DarkGray
Write-Host ""
