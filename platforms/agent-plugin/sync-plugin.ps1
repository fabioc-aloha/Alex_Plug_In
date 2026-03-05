<#
.SYNOPSIS
    Syncs Master Alex .github/ content into the agent-plugin platform bundle.

.DESCRIPTION
    Copies agents, curated skills, instructions, prompts, and hooks from
    the Master Alex .github/ directory into platforms/agent-plugin/plugin/.
    This script is the agent-plugin equivalent of sync-architecture.js.

.NOTES
    Safety: This only WRITES to platforms/agent-plugin/plugin/.
    It never modifies the Master .github/ source of truth.
#>

param(
    [switch]$DryRun,
    [string]$DistroRepo = "C:\Development\AlexAgent"
)

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$masterGithub = Join-Path $repoRoot '.github'
$pluginDir = Join-Path $PSScriptRoot 'plugin'

# All plugin-ready skills — no extension runtime dependency
$curatedSkills = @(
    # Cognitive & Learning
    'bootstrap-learning'
    'knowledge-synthesis'
    'cognitive-load'
    'learning-psychology'
    'appropriate-reliance'
    'airs-appropriate-reliance'
    'meditation-facilitation'
    'socratic-questioning'
    'rubber-duck-debugging'
    'anti-hallucination'
    'awareness'
    'work-life-balance'
    'deep-work-optimization'
    'cognitive-symbiosis'
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
    'writing-publication'
    'ai-writing-avoidance'
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
    'academic-paper-drafting'
    'literature-review'
    'citation-management'
    'dissertation-defense'
    'airs-integration'
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
    'skill-activation'
    'prompt-activation'
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
)

# All plugin-ready instructions — universal, not extension-specific
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
)

# All plugin-ready prompts — universal, no extension commands required
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
)

function Write-Step {
    param([string]$Message)
    Write-Host "  → $Message" -ForegroundColor Cyan
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

Write-Host "`n[SYNC] Alex Agent Plugin Sync" -ForegroundColor Green
Write-Host "   Master: $masterGithub" -ForegroundColor DarkGray
Write-Host "   Target: $pluginDir`n" -ForegroundColor DarkGray

# 1. Agents — copy all
Write-Host "[1/4] Agents" -ForegroundColor Yellow
$agentsSrc = Join-Path $masterGithub 'agents'
$agentsDst = Join-Path $pluginDir 'agents'
Sync-Directory -Source $agentsSrc -Dest $agentsDst -Label "agents/"

# 2. Curated Skills
Write-Host "[2/4] Skills ($($curatedSkills.Count) curated)" -ForegroundColor Yellow
$skillsDst = Join-Path $pluginDir 'skills'
if (-not $DryRun) {
    if (Test-Path $skillsDst) {
        Remove-Item $skillsDst -Recurse -Force
    }
    New-Item -ItemType Directory -Path $skillsDst -Force | Out-Null
}
foreach ($skill in $curatedSkills) {
    $src = Join-Path $masterGithub "skills\$skill"
    if (Test-Path $src) {
        $dst = Join-Path $skillsDst $skill
        Sync-Directory -Source $src -Dest $dst -Label "skills/$skill"
    }
    else {
        Write-Host "  ! Skill not found: $skill" -ForegroundColor DarkYellow
    }
}

# 3. Curated Instructions
Write-Host "[3/4] Instructions ($($curatedInstructions.Count) curated)" -ForegroundColor Yellow
$instrDst = Join-Path $pluginDir 'instructions'
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

# 4. Curated Prompts
Write-Host "[4/4] Prompts ($($curatedPrompts.Count) curated)" -ForegroundColor Yellow
$promptsDst = Join-Path $pluginDir 'prompts'
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
        Write-Host "  ! Prompt not found: $prompt" -ForegroundColor DarkYellow
    }
}

# Summary
$agentCount = (Get-ChildItem (Join-Path $pluginDir 'agents') -Filter '*.agent.md' -ErrorAction SilentlyContinue).Count
$skillCount = (Get-ChildItem (Join-Path $pluginDir 'skills') -Directory -ErrorAction SilentlyContinue).Count
$instrCount = (Get-ChildItem (Join-Path $pluginDir 'instructions') -Filter '*.instructions.md' -ErrorAction SilentlyContinue).Count
$promptCount = (Get-ChildItem (Join-Path $pluginDir 'prompts') -Filter '*.prompt.md' -ErrorAction SilentlyContinue).Count

# 5. MCP bundle — self-contained single-file server
Write-Host "`n[5/5] MCP bundle" -ForegroundColor Yellow
$mcpSrc = Join-Path $repoRoot 'packages\mcp-cognitive-tools'
$mcpDst = Join-Path $pluginDir 'mcp'
if (-not $DryRun) {
    if (-not (Test-Path $mcpDst)) {
        New-Item -ItemType Directory -Path $mcpDst -Force | Out-Null
    }
    Push-Location $mcpSrc
    npx esbuild dist/index.js --bundle --platform=node --target=node18 --outfile="$mcpDst\index.js" --format=cjs --minify 2>&1 | Out-Null
    Pop-Location
    if (Test-Path (Join-Path $mcpDst 'index.js')) {
        $mcpSize = [math]::Round((Get-Item (Join-Path $mcpDst 'index.js')).Length / 1KB)
        Write-Step "Bundled MCP server (${mcpSize}KB self-contained)"
    }
    else {
        Write-Host "  ! MCP bundle failed — run 'npm install' in packages/mcp-cognitive-tools" -ForegroundColor DarkYellow
    }
}
else {
    Write-Step "[DRY RUN] Would bundle MCP server"
}

Write-Host "`n[DONE] Plugin sync complete" -ForegroundColor Green
Write-Host "   Agents:       $agentCount" -ForegroundColor DarkGray
Write-Host "   Skills:       $skillCount" -ForegroundColor DarkGray
Write-Host "   Instructions: $instrCount" -ForegroundColor DarkGray
Write-Host "   Prompts:      $promptCount`n" -ForegroundColor DarkGray

# ── Publish to AlexAgent distribution repo ──
if (Test-Path $DistroRepo) {
    Write-Host "[PUBLISH] Syncing to AlexAgent distribution repo" -ForegroundColor Green
    Write-Host "   Target: $DistroRepo" -ForegroundColor DarkGray

    $distroPlugin = Join-Path $DistroRepo "plugin"

    if ($DryRun) {
        Write-Step "[DRY RUN] Would copy plugin/ to $distroPlugin"
    } else {
        if (Test-Path $distroPlugin) {
            Remove-Item $distroPlugin -Recurse -Force
        }
        Copy-Item $pluginDir $distroPlugin -Recurse -Force

        $distroFiles = (Get-ChildItem $distroPlugin -Recurse -File).Count
        Write-Step "Copied $distroFiles files to AlexAgent repo"

        # Show changes
        Push-Location $DistroRepo
        $status = git status --short
        if ($status) {
            $changed = ($status | Measure-Object).Count
            Write-Step "$changed file(s) changed — commit and push when ready"
        } else {
            Write-Step "No changes — already in sync"
        }
        Pop-Location
    }
    Write-Host ""
} else {
    Write-Host "`n[SKIP] AlexAgent repo not found at $DistroRepo — use -DistroRepo to specify path" -ForegroundColor DarkGray
    Write-Host ""
}
