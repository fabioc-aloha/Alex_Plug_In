#Requires -Version 7.0
# Brain QA (Heir) - Semantic validation for deployed Alex heir instances
# Location: .github/muscles/brain-qa-heir.ps1 (inheritable, renamed to brain-qa.ps1 in heir)
# Skill: brain-qa
#
# This is the heir-specific version. It omits master-only phases:
#   5 (Master-Heir Skill Sync), 7 (Synapse File Sync), 8 (Index Sync),
#   13 (Instructions/Prompts Sync), 26 (alex_docs/), 27 (M365 Heir),
#   28 (Codespaces Heir), 29 (GK Sync)
# Phase numbers are preserved for cross-reference consistency with master.

param(
    [ValidateSet("all", "quick", "schema", "llm")]
    [string]$Mode = "all",
    
    [int[]]$Phase,  # Run specific phases: -Phase 1,6,10
    
    [switch]$Fix,   # Auto-fix where possible
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"

# Resolve paths — heir always runs from its own workspace root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent (Split-Path -Parent $scriptDir)  # .github/muscles -> .github -> root
$ghPath = Join-Path $rootPath ".github"

if (-not (Test-Path $ghPath)) {
    Write-Host "ERROR: .github not found at $ghPath" -ForegroundColor Red
    exit 1
}

Push-Location $rootPath

$issues = @()
$warnings = @()
$fixed = @()

function Write-Phase {
    param([int]$Num, [string]$Name)
    if (-not $Quiet) { Write-Host "`n=== [Phase $Num] $Name ===" -ForegroundColor Cyan }
}

function Write-Pass { 
    param([string]$Msg)
    if (-not $Quiet) { Write-Host "  $Msg" -ForegroundColor Green }
}

function Write-Warn {
    param([string]$Msg)
    if (-not $Quiet) { Write-Host "  ⚠️ $Msg" -ForegroundColor Yellow }
    $script:warnings += $Msg
}

function Write-Fail {
    param([string]$Msg)
    if (-not $Quiet) { Write-Host "  ❌ $Msg" -ForegroundColor Red }
    $script:issues += $Msg
}

# Heir-valid phases (master-only phases omitted)
$heirPhases = @(1, 2, 3, 4, 6, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 30, 31, 32, 34)

# Define phase groups
$quickPhases = @(1, 2, 3, 4, 6)
$schemaPhases = @(2, 6, 11, 16, 17)
$llmPhases = @(10, 20, 21)

# Determine which phases to run
$runPhases = switch ($Mode) {
    "quick" { $quickPhases }
    "schema" { $schemaPhases }
    "llm" { $llmPhases }
    default { $heirPhases }
}

if ($Phase) { $runPhases = $Phase | Where-Object { $_ -in $heirPhases } }

# ============================================================
# PHASE 1: Synapse Target Validation
# ============================================================
if (1 -in $runPhases) {
    Write-Phase 1 "Synapse Target Validation"
    $uniqueBroken = @{}
    Get-ChildItem "$ghPath" -Recurse -Filter "synapses.json" | ForEach-Object {
        $json = Get-Content $_.FullName -Raw | ConvertFrom-Json
        $sourceDir = $_.DirectoryName
        foreach ($conn in $json.connections) {
            $target = $conn.target
            # Skip special URL schemes (external links, global knowledge refs, etc)
            if ($target -match '^(external:|global-knowledge://|https?://|mailto:)') { continue }
            if ($target -match "^\.github/|^[A-Z].*\.md$") {
                $fullPath = Join-Path $rootPath $target
            }
            elseif ($target -match "^\.\./") {
                $fullPath = [System.IO.Path]::GetFullPath((Join-Path $sourceDir $target))
            }
            else { 
                $fullPath = Join-Path $sourceDir $target 
            }
            if (-not (Test-Path $fullPath)) { $uniqueBroken[$target] = $true }
        }
    }
    if ($uniqueBroken.Count -eq 0) { 
        Write-Pass "All synapse targets valid" 
    }
    else { 
        foreach ($b in $uniqueBroken.Keys | Sort-Object) { Write-Fail "Broken: $b" }
    }
}

# ============================================================
# PHASE 2: Inheritance Field Validation
# ============================================================
if (2 -in $runPhases) {
    Write-Phase 2 "Inheritance Field Validation"
    $missing = @()
    Get-ChildItem "$ghPath\skills" -Directory | ForEach-Object {
        $synapse = Join-Path $_.FullName "synapses.json"
        if (Test-Path $synapse) {
            $json = Get-Content $synapse -Raw | ConvertFrom-Json
            if (-not $json.inheritance) { $missing += $_.Name }
        }
    }
    if ($missing.Count -eq 0) { 
        Write-Pass "All skills have inheritance field" 
    }
    else { 
        Write-Fail "Missing inheritance: $($missing -join ', ')"
    }
}

# ============================================================
# PHASE 3: Skill Index Coverage
# ============================================================
if (3 -in $runPhases) {
    Write-Phase 3 "Skill Index Coverage"
    $skillDirs = (Get-ChildItem "$ghPath\skills" -Directory).Name
    $indexContent = Get-Content "$ghPath\skills\skill-activation\SKILL.md" -Raw
    $notIndexed = @()
    foreach ($s in $skillDirs) {
        if ($s -ne "skill-activation" -and $indexContent -notmatch "$s \|") {
            $notIndexed += $s
        }
    }
    if ($notIndexed.Count -eq 0) { 
        Write-Pass "All $($skillDirs.Count) skills indexed" 
    }
    else { 
        Write-Fail "Not indexed: $($notIndexed -join ', ')"
    }
}

# ============================================================
# PHASE 4: Trigger Semantic Analysis
# ============================================================
if (4 -in $runPhases) {
    Write-Phase 4 "Trigger Semantic Analysis"
    $triggers = @{}
    Get-Content "$ghPath\skills\skill-activation\SKILL.md" | 
    Select-String -Pattern "^\| .+ \| .+ \|$" | 
    ForEach-Object {
        if ($_ -match "\| ⭐?\s*([a-z\-]+) \| (.+) \|") {
            $skill = $matches[1]
            $keywords = $matches[2] -split ", "
            foreach ($kw in $keywords) {
                $kw = $kw.Trim()
                if ($triggers.ContainsKey($kw)) { $triggers[$kw] += ",$skill" }
                else { $triggers[$kw] = $skill }
            }
        }
    }
    $overlaps = $triggers.GetEnumerator() | Where-Object { $_.Value -match "," }
    if ($overlaps.Count -eq 0) {
        Write-Pass "No trigger overlaps"
    }
    else {
        foreach ($o in $overlaps) {
            Write-Warn "Overlap '$($o.Key)': $($o.Value)"
        }
        Write-Pass "Review overlaps - shared triggers may be intentional"
    }
}

# Phases 5, 7, 8 skipped — master-only (Master-Heir sync comparisons)

# ============================================================
# PHASE 6: Synapse Schema Format Validation
# ============================================================
if (6 -in $runPhases) {
    Write-Phase 6 "Synapse Schema Format Validation"
    $critical = @(); $info = @()
    Get-ChildItem "$ghPath\skills" -Recurse -Filter "synapses.json" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $skill = $_.DirectoryName | Split-Path -Leaf
        # Use case-sensitive match (cmatch) for deprecated capitalized strength values only
        # Valid: critical, strong, moderate, weak (lowercase)
        # Deprecated: High, Medium, Critical, Low (capitalized)
        if ($content -cmatch '"strength":\s*"(High|Medium|Critical|Low)"') {
            $critical += $skill
        }
        if ($content -notmatch '"\$schema"') {
            $critical += $skill
        }
        if ($content -match '"synapses":\s*\[' -and $content -notmatch '"connections":\s*\[') {
            $info += $skill
        }
    }
    $critical = $critical | Select-Object -Unique
    $info = $info | Select-Object -Unique
    if ($critical.Count -eq 0) { 
        Write-Pass "Schema validation passed"
    }
    else { 
        Write-Fail "Schema issues: $($critical -join ', ')"
    }
    if ($info.Count -gt 0) { 
        Write-Warn "Legacy array name (works but prefer 'connections'): $($info -join ', ')" 
    }
}

# ============================================================
# PHASE 9: Catalog Accuracy Validation (Heir: count-only)
# ============================================================
if (9 -in $runPhases) {
    Write-Phase 9 "Catalog Accuracy Validation"
    $actualSkills = (Get-ChildItem "$ghPath\skills" -Directory).Count
    Write-Pass "Heir has $actualSkills skills deployed"
}

# ============================================================
# PHASE 10: Core File Token Budget
# ============================================================
if (10 -in $runPhases) {
    Write-Phase 10 "Core File Token Budget"
    $budgetWarnings = @()
    $coreFile = "$ghPath\copilot-instructions.md"
    if (Test-Path $coreFile) {
        $content = Get-Content $coreFile -Raw
        $lineCount = ($content -split '\n').Count
        $charCount = $content.Length

        if ($lineCount -gt 500) {
            $budgetWarnings += "copilot-instructions.md is $lineCount lines ($charCount chars) - consider trimming"
        }

        if ($content -match '[┌┐└┘├┤┬┴┼│─═║╔╗╚╝╠╣╦╩╬]') {
            $budgetWarnings += "copilot-instructions.md contains ASCII box-drawing art (use Mermaid or tables)"
        }
    }
    if ($budgetWarnings.Count -eq 0) {
        Write-Pass "Core files within token budget"
    }
    else {
        foreach ($bw in $budgetWarnings) { Write-Warn $bw }
    }
}

# ============================================================
# PHASE 11: Boilerplate Skill Descriptions
# ============================================================
if (11 -in $runPhases) {
    Write-Phase 11 "Boilerplate Skill Descriptions"
    $boilerplate = @()
    Get-ChildItem "$ghPath\skills" -Directory | ForEach-Object {
        $skillMd = Join-Path $_.FullName "SKILL.md"
        if (Test-Path $skillMd) {
            $content = Get-Content $skillMd -Raw
            if ($content -match 'description:\s*"Skill for alex .+ skill"') {
                $boilerplate += $_.Name
            }
        }
    }
    if ($boilerplate.Count -eq 0) { 
        Write-Pass "No boilerplate descriptions"
    }
    else { 
        Write-Warn "Boilerplate ($($boilerplate.Count)): $($boilerplate -join ', ')"
    }
}

# ============================================================
# PHASE 12: Reset Validation (Self-Check)
# ============================================================
if (12 -in $runPhases) {
    Write-Phase 12 "Reset Validation (Self-Check)"
    $resetIssues = @()
    
    # Check user-profile.json should NOT exist (PII protection - created at runtime from template)
    $profilePath = "$ghPath\config\user-profile.json"
    if (Test-Path $profilePath) {
        $userProfile = Get-Content $profilePath | ConvertFrom-Json
        if ($userProfile.name -ne "") { $resetIssues += "user-profile.json has non-empty name (PII leak)" }
        if ($userProfile.nickname -ne "") { $resetIssues += "user-profile.json has non-empty nickname (PII leak)" }
    }
    # Verify template exists (used to create profile at runtime)
    $templatePath = "$ghPath\config\user-profile.template.json"
    if (-not (Test-Path $templatePath)) { $resetIssues += "user-profile.template.json missing" }
    
    # Check Active Context section in copilot-instructions.md (v2 format)
    $copilotPath = "$ghPath\copilot-instructions.md"
    if (Test-Path $copilotPath) {
        $copilot = Get-Content $copilotPath -Raw
        
        # v3 Identity + Active Context: verify sections exist and values are valid
        if ($copilot -notmatch '## Identity') { $resetIssues += "Missing Identity section (v3 format)" }
        if ($copilot -notmatch '## Active Context') { $resetIssues += "Missing Active Context section" }
        if ($copilot -match 'Focus Trifectas:\s*master-heir-management') { $resetIssues += "Focus Trifectas has master-only values" }
        
        # Check for hardcoded names
        if ($copilot -match "Fabio|Correa|Calefato|Cardoso") { 
            $resetIssues += "Found hardcoded names in copilot-instructions.md" 
        }
    }
    
    if ($resetIssues.Count -eq 0) { 
        Write-Pass "Architecture properly reset for deployment"
    }
    else {
        foreach ($ri in $resetIssues) { Write-Fail $ri }
    }
}

# Phase 13 skipped — master-only (Instructions/Prompts sync comparison)

# ============================================================
# PHASE 14: Agents Structure Validation
# ============================================================
if (14 -in $runPhases) {
    Write-Phase 14 "Agents Structure Validation"
    $agentIssues = @()
    $agents = Get-ChildItem "$ghPath\agents\*.md" -ErrorAction SilentlyContinue
    if ($agents.Count -eq 0) { 
        $agentIssues += "No agents found" 
    }
    else {
        foreach ($agent in $agents) {
            $content = Get-Content $agent.FullName -Raw
            if ($content -notmatch '^---') { $agentIssues += "$($agent.Name): Missing YAML frontmatter" }
            if ($content -notmatch 'name:') { $agentIssues += "$($agent.Name): Missing name field" }
        }
    }
    
    if ($agentIssues.Count -eq 0) { 
        Write-Pass "Agents valid ($($agents.Count) agents)"
    }
    else {
        foreach ($ai in $agentIssues) { Write-Fail $ai }
    }
}

# ============================================================
# PHASE 15: Config Files Validation
# ============================================================
if (15 -in $runPhases) {
    Write-Phase 15 "Config Files Validation"
    $required = @("user-profile.template.json", "cognitive-config-template.json")
    $masterOnlyCfg = @("MASTER-ALEX-PROTECTED.json", "cognitive-config.json", "user-profile.json")
    $configIssues = @()
    
    # Check required configs exist
    foreach ($cfg in $required) {
        $path = "$ghPath\config\$cfg"
        if (-not (Test-Path $path)) { 
            $configIssues += "Missing: $cfg" 
        }
        elseif ($cfg -match '\.json$') {
            try { Get-Content $path -Raw | ConvertFrom-Json | Out-Null }
            catch { $configIssues += "Invalid JSON: $cfg" }
        }
    }
    
    # Verify Master-only files NOT present (they shouldn't be in heir package)
    foreach ($cfg in $masterOnlyCfg) {
        $path = "$ghPath\config\$cfg"
        if (Test-Path $path) { $configIssues += "Master-only file leaked: $cfg" }
    }
    
    if ($configIssues.Count -eq 0) { 
        Write-Pass "Config files valid"
    }
    else {
        foreach ($ci in $configIssues) { Write-Fail $ci }
    }
}

# ============================================================
# PHASE 16: Skill YAML Frontmatter Compliance (VS Code Spec)
# ============================================================
if (16 -in $runPhases) {
    Write-Phase 16 "Skill YAML Frontmatter Compliance"
    $frontmatterIssues = @()
    Get-ChildItem "$ghPath\skills" -Directory | ForEach-Object {
        $skillMd = Join-Path $_.FullName "SKILL.md"
        if (Test-Path $skillMd) {
            $content = Get-Content $skillMd -Raw
            $skill = $_.Name
            
            if ($content -notmatch '^---\s*\n') {
                $frontmatterIssues += "${skill} - Missing YAML frontmatter"
            }
            else {
                if ($content -match '^---\s*\n([\s\S]*?)\n---') {
                    $fm = $matches[1]
                    if ($fm -notmatch 'name:\s*[''"]?[\w\-]+') {
                        $frontmatterIssues += "${skill} - Missing 'name' in frontmatter"
                    }
                    if ($fm -notmatch 'description:\s*[''"]?.+') {
                        $frontmatterIssues += "${skill} - Missing 'description' in frontmatter"
                    }
                }
            }
        }
    }
    if ($frontmatterIssues.Count -eq 0) {
        Write-Pass "All skills have valid YAML frontmatter"
    }
    else {
        foreach ($fi in $frontmatterIssues) { Write-Fail $fi }
    }
}

# ============================================================
# PHASE 17: Internal Skills User-Invokable Check
# ============================================================
if (17 -in $runPhases) {
    Write-Phase 17 "Internal Skills User-Invokable Check"
    $internalSkills = @("skill-activation", "prompt-activation")
    $visibilityIssues = @()
    
    foreach ($skill in $internalSkills) {
        $skillMd = "$ghPath\skills\$skill\SKILL.md"
        if (Test-Path $skillMd) {
            $content = Get-Content $skillMd -Raw
            if ($content -notmatch 'user-invokable:\s*false') {
                $visibilityIssues += "$skill should have user-invokable: false"
            }
        }
    }
    if ($visibilityIssues.Count -eq 0) {
        Write-Pass "Internal skills properly hidden"
    }
    else {
        foreach ($vi in $visibilityIssues) { Write-Warn $vi }
    }
}

# ============================================================
# PHASE 18: Agent Handoffs Completeness
# ============================================================
if (18 -in $runPhases) {
    Write-Phase 18 "Agent Handoffs Completeness"
    $handoffIssues = @()
    $agents = Get-ChildItem "$ghPath\agents\*.md" -ErrorAction SilentlyContinue
    
    foreach ($agent in $agents) {
        $content = Get-Content $agent.FullName -Raw
        if ($agent.Name -eq "alex.agent.md") {
            if ($content -notmatch 'handoffs:') {
                $handoffIssues += "alex.agent.md - Missing handoffs section"
            }
        }
        else {
            if ($content -match 'handoffs:' -and $content -notmatch 'agent:\s*Alex') {
                $handoffIssues += "$($agent.Name) - No return-to-Alex handoff"
            }
        }
        if ($content -match 'handoffs:') {
            if ($content -notmatch 'label:') { $handoffIssues += "$($agent.Name) - Handoff missing 'label'" }
            if ($content -notmatch 'agent:') { $handoffIssues += "$($agent.Name) - Handoff missing 'agent'" }
        }
    }
    if ($handoffIssues.Count -eq 0) {
        Write-Pass "Agent handoffs valid"
    }
    else {
        foreach ($hi in $handoffIssues) { Write-Warn $hi }
    }
}

# ============================================================
# PHASE 19: Instruction ApplyTo Pattern Coverage
# ============================================================
if (19 -in $runPhases) {
    Write-Phase 19 "Instruction ApplyTo Pattern Coverage"
    $applyToIssues = @()
    $instructions = Get-ChildItem "$ghPath\instructions\*.md" -ErrorAction SilentlyContinue
    
    $shouldHaveApplyTo = @{
        "dream-state-automation.instructions.md"  = "*dream*|*maintenance*|*synapse*"
        "embedded-synapse.instructions.md"        = "*synapse*|*connection*|*pattern*"
        "empirical-validation.instructions.md"    = "*research*|*validation*"
        "lucid-dream-integration.instructions.md" = "*lucid*|*hybrid*"
        "protocol-triggers.instructions.md"       = "*trigger*|*protocol*"
    }
    
    foreach ($instr in $instructions) {
        $content = Get-Content $instr.FullName -Raw
        if ($shouldHaveApplyTo.ContainsKey($instr.Name)) {
            if ($content -notmatch 'applyTo:') {
                $applyToIssues += "$($instr.Name) - Missing applyTo pattern"
            }
        }
    }
    if ($applyToIssues.Count -eq 0) {
        Write-Pass "Instruction applyTo patterns present"
    }
    else {
        foreach ($ai in $applyToIssues) { Write-Warn $ai }
    }
}

# ============================================================
# PHASE 20: LLM-First Content Format Validation
# ============================================================
if (20 -in $runPhases) {
    Write-Phase 20 "LLM-First Content Format Validation"
    $formatWarnings = @()
    
    $coreFiles = @(
        "$ghPath\copilot-instructions.md"
        "$ghPath\agents\*.md"
    )
    
    foreach ($pattern in $coreFiles) {
        Get-ChildItem $pattern -ErrorAction SilentlyContinue | ForEach-Object {
            $content = Get-Content $_.FullName -Raw
            $file = $_.Name
            
            if ($content -match '[┌┐└┘├┤┬┴┼│─═║╔╗╚╝╠╣╦╩╬]') {
                $formatWarnings += "${file} - Contains box-drawing ASCII art (Mermaid or tables preferred)"
            }
            
            if (($content -split '\n' | Where-Object { $_ -match '^\s*[│↓↑←→]' }).Count -gt 5) {
                $formatWarnings += "${file} - Heavy use of ASCII arrows (structured format preferred)"
            }
        }
    }
    
    if ($formatWarnings.Count -eq 0) {
        Write-Pass "Content formats are LLM-friendly"
    }
    else {
        foreach ($fw in $formatWarnings) { Write-Warn $fw }
        Write-Host "  💡 Use Mermaid or tables instead of ASCII art." -ForegroundColor DarkGray
    }
}

# ============================================================
# PHASE 21: Emoji Semantic Consistency
# ============================================================
if (21 -in $runPhases) {
    Write-Phase 21 "Emoji Semantic Consistency"
    $emojiCount = 0
    Get-ChildItem "$ghPath\agents\*.md" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $emojis = @("🔨", "🔍", "📚", "🧠", "✅", "❌", "⚠️", "☁️", "🔷", "⭐")
        foreach ($e in $emojis) {
            $emojiCount += ([regex]::Matches($content, [regex]::Escape($e))).Count
        }
    }
    Write-Pass "Semantic emojis in agents: $emojiCount"
}

# ============================================================
# PHASE 22: Episodic Archive Health
# ============================================================
if (22 -in $runPhases) {
    Write-Phase 22 "Episodic Archive Health"
    $episodicPath = Join-Path $ghPath "episodic"
    if (Test-Path $episodicPath) {
        $allEpisodic = Get-ChildItem "$episodicPath\*.md" -ErrorAction SilentlyContinue
        $dreamReports = $allEpisodic | Where-Object { $_.Name -match '^dream-report-' }
        $meditations = $allEpisodic | Where-Object { $_.Name -match '^meditation-' }
        $selfActualizations = $allEpisodic | Where-Object { $_.Name -match '^self-actualization-' }

        Write-Pass "Episodic files: $($allEpisodic.Count) total ($($dreamReports.Count) dreams, $($meditations.Count) meditations, $($selfActualizations.Count) self-actualizations)"

        $legacyPrompts = $allEpisodic | Where-Object { $_.Name -match '\.prompt\.md$' }
        if ($legacyPrompts.Count -gt 0) {
            Write-Warn "Episodic has $($legacyPrompts.Count) legacy .prompt.md files"
        }

        $undated = $allEpisodic | Where-Object { $_.Name -notmatch '\d{4}-\d{2}-\d{2}' -and $_.Name -ne '.markdownlint.json' }
        if ($undated.Count -gt 0) {
            Write-Warn "Episodic has $($undated.Count) undated files"
        }
    }
    else {
        Write-Pass "No episodic/ folder (normal for fresh installs)"
    }
}

# ============================================================
# PHASE 23: .github/ Assets Validation
# ============================================================
if (23 -in $runPhases) {
    Write-Phase 23 ".github/ Assets Validation"
    $assetsPath = Join-Path $ghPath "assets"
    if (Test-Path $assetsPath) {
        $svgFiles = Get-ChildItem "$assetsPath\*.svg" -ErrorAction SilentlyContinue
        $pngFiles = Get-ChildItem "$assetsPath\*.png" -ErrorAction SilentlyContinue
        $totalAssets = (Get-ChildItem $assetsPath -File).Count

        $hasBanner = (Test-Path (Join-Path $assetsPath "banner.svg")) -or (Test-Path (Join-Path $assetsPath "banner.png"))
        if (-not $hasBanner) {
            Write-Fail "Missing banner asset (banner.svg or banner.png)"
        }
        else { Write-Pass "Banner asset present" }

        Write-Pass "Assets: $totalAssets files ($($svgFiles.Count) SVG, $($pngFiles.Count) PNG)"
    }
    else {
        Write-Warn ".github/assets/ not found"
    }
}

# ============================================================
# PHASE 24: Issue & PR Templates
# ============================================================
if (24 -in $runPhases) {
    Write-Phase 24 "Issue & PR Templates"
    $issueTemplatePath = Join-Path $ghPath "ISSUE_TEMPLATE"
    $prTemplatePath = Join-Path $ghPath "pull_request_template.md"

    if (Test-Path $issueTemplatePath) {
        $templates = Get-ChildItem "$issueTemplatePath\*.md" -ErrorAction SilentlyContinue
        Write-Pass "Issue templates present ($($templates.Count) templates)"
    }
    else {
        Write-Pass "No ISSUE_TEMPLATE/ (normal for heir deployments)"
    }

    if (Test-Path $prTemplatePath) {
        Write-Pass "PR template present"
    }
    else {
        Write-Pass "No PR template (normal for heir deployments)"
    }
}

# ============================================================
# PHASE 25: .github/ Root Files Completeness
# ============================================================
if (25 -in $runPhases) {
    Write-Phase 25 ".github/ Root Files Completeness"
    $expectedRootFiles = @(
        "copilot-instructions.md"
    )
    $missingRoot = @()
    foreach ($rf in $expectedRootFiles) {
        if (-not (Test-Path (Join-Path $ghPath $rf))) { $missingRoot += $rf }
    }
    if ($missingRoot.Count -gt 0) {
        foreach ($mr in $missingRoot) { Write-Fail "Missing .github/ root file: $mr" }
    }
    else { Write-Pass "All .github/ root files present ($($expectedRootFiles.Count) files)" }

    # Verify expected subdirs exist
    $expectedDirs = @("agents", "config", "episodic", "instructions", "muscles", "prompts", "skills", "assets")
    $missingDirs = @()
    foreach ($d in $expectedDirs) {
        if (-not (Test-Path (Join-Path $ghPath $d))) { $missingDirs += $d }
    }
    if ($missingDirs.Count -gt 0) {
        foreach ($md in $missingDirs) { Write-Warn "Missing .github/ subfolder: $md" }
    }
    else { Write-Pass "All .github/ subfolders present ($($expectedDirs.Count) folders)" }
}

# Phases 26-29 skipped — master-only (alex_docs, M365/Codespaces heirs, GK sync)

# ============================================================
# PHASE 30: Muscles Integrity
# ============================================================
if (30 -in $runPhases) {
    Write-Phase 30 "Muscles Integrity"
    $musclesPath = Join-Path $ghPath "muscles"
    $expectedMuscles = @(
        "brain-qa.ps1", "dream-cli.ts", "fix-fence-bug.ps1",
        "gamma-generator.js", "normalize-paths.ps1",
        "pptxgen-cli.ts", "validate-skills.ps1", "validate-synapses.ps1"
    )
    $missingMuscles = @()
    foreach ($m in $expectedMuscles) {
        if (-not (Test-Path (Join-Path $musclesPath $m))) { $missingMuscles += $m }
    }
    if ($missingMuscles.Count -gt 0) {
        foreach ($mm in $missingMuscles) { Write-Fail "Missing muscle: $mm" }
    }
    else { Write-Pass "All heir muscles present ($($expectedMuscles.Count))" }
}

# ============================================================
# PHASE 31: Version Consistency
# ============================================================
if (31 -in $runPhases) {
    Write-Phase 31 "Version Consistency"
    $configPath = Join-Path $ghPath "config\cognitive-config.json"
    $ciPath = Join-Path $ghPath "copilot-instructions.md"
    $currentVersion = "unknown"
    
    if (Test-Path $configPath) {
        $currentVersion = (Get-Content $configPath -Raw | ConvertFrom-Json).version
        Write-Pass "Version from cognitive-config.json: $currentVersion"
    }
    elseif (Test-Path $ciPath) {
        $ciContent = Get-Content $ciPath -Raw
        if ($ciContent -match '# Alex v(\d+\.\d+\.\d+)') {
            $currentVersion = $Matches[1]
            Write-Pass "Version from copilot-instructions.md: $currentVersion"
        }
        else { Write-Warn "Could not determine version" }
    }
    else { Write-Warn "No version source found" }

    # Cross-check copilot-instructions.md version if we got it from config
    if ($currentVersion -ne "unknown" -and (Test-Path $ciPath)) {
        $ciContent = Get-Content $ciPath -Raw
        if ($ciContent -match '# Alex v(\d+\.\d+\.\d+)') {
            $ciVersion = $Matches[1]
            if ($ciVersion -ne $currentVersion) {
                Write-Warn "copilot-instructions.md version ($ciVersion) != cognitive-config.json ($currentVersion)"
            }
            else { Write-Pass "Version consistent across config files" }
        }
    }
}

# ============================================================
# PHASE 32: Prefrontal Cortex Evolution Validation
# ============================================================
if (32 -in $runPhases) {
    Write-Phase 32 "Prefrontal Cortex Evolution Validation"
    $ciPath = Join-Path $ghPath "copilot-instructions.md"
    if (Test-Path $ciPath) {
        $ciContent = Get-Content $ciPath -Raw

        # 1. Identity section must exist (v3 format)
        if ($ciContent -notmatch '## Identity') {
            Write-Fail "copilot-instructions.md missing ## Identity section"
        }
        else { Write-Pass "Identity section present" }

        # 2. Agents listed must match actual agent files on disk
        $diskAgents = @()
        $agentFiles = Get-ChildItem "$ghPath\agents\*.agent.md" -ErrorAction SilentlyContinue
        if ($agentFiles) {
            $diskAgents = $agentFiles | ForEach-Object { 
                $_.BaseName -replace '\.agent$', '' -replace '^alex-?', ''
            } | Where-Object { $_ -ne '' } | Sort-Object
            $diskAgents = @('Alex') + $diskAgents
        }

        # Use multiline mode to grab the first content line after ## Agents + optional comment
        if ($ciContent -match '(?m)^## Agents\r?\n(?:<!--[^>]+-->\r?\n)?(.+)$') {
            $agentLine = $Matches[1].Trim()
            $listedAgents = ($agentLine -split ',') | ForEach-Object { ($_ -split '\(')[0].Trim() } | Sort-Object
            
            $diskAgentNames = $diskAgents | Sort-Object
            $missing = $diskAgentNames | Where-Object { $_ -notin $listedAgents }
            $extra = $listedAgents | Where-Object { $_ -notin $diskAgentNames }
            
            if ($missing.Count -gt 0) { Write-Warn "Agents on disk but NOT in copilot-instructions: $($missing -join ', ')" }
            if ($extra.Count -gt 0) { Write-Warn "Agents in copilot-instructions but NOT on disk: $($extra -join ', ')" }
            if ($missing.Count -eq 0 -and $extra.Count -eq 0) {
                Write-Pass "Agent list matches disk ($($diskAgentNames.Count) agents)"
            }
        }
        else { Write-Warn "Could not parse Agents section from copilot-instructions.md" }

        # 3. Listed trifectas must have corresponding skill directories
        if ($ciContent -match 'Complete trifectas \((\d+)\):\s*(.+)') {
            $listedCount = [int]$Matches[1]
            $listedNames = ($Matches[2] -split ',') | ForEach-Object { $_.Trim() }
            $missingSkills = @()
            foreach ($name in $listedNames) {
                $skillDir = Join-Path "$ghPath\skills" $name
                if (-not (Test-Path $skillDir)) { $missingSkills += $name }
            }

            if ($listedCount -ne $listedNames.Count) {
                Write-Warn "Trifecta count ($listedCount) doesn't match listed names ($($listedNames.Count))"
            }
            elseif ($missingSkills.Count -gt 0) {
                Write-Warn "Listed trifectas missing skill directories: $($missingSkills -join ', ')"
            }
            else {
                Write-Pass "All $listedCount listed trifectas have skill directories"
            }
        }
        else { Write-Warn "Could not parse trifecta list from copilot-instructions.md" }

        # 4. Active Context section must exist
        if ($ciContent -notmatch '## Active Context') {
            Write-Fail "copilot-instructions.md missing ## Active Context section"
        }
        else { Write-Pass "Active Context section present" }

        # 5. User Profile section must exist
        if ($ciContent -notmatch '## User Profile') {
            Write-Fail "copilot-instructions.md missing ## User Profile section"
        }
        else { Write-Pass "User Profile section present" }
    }
    else {
        Write-Fail "copilot-instructions.md not found"
    }
}

# ============================================================
# PHASE 34: Brain Self-Containment Check
# Verifies all references inside .github/ resolve within .github/
# Catches: escaped synapse targets, escaped markdown links, ..// typos,
# hardcoded absolute paths in non-ephemeral files
# ============================================================
if (34 -in $runPhases) {
    Write-Phase 34 "Brain Self-Containment Check"

    # Known-OK exceptions — files that intentionally reference outside .github/
    $scExceptions = @(
        'episodic',   # Session records cleared on heir deployment; past-session paths are harmless
        'SUPPORT.md'  # GitHub Community Health File — links to repo-root docs by design
    )

    # Helper: returns $null if target stays inside $ghPath, otherwise returns the escaped value
    function Test-SelfContained {
        param([string]$sourceFile, [string]$target)
        if (-not $target -or $target.Trim() -eq '') { return $null }
        if ($target -match '^(https?://|#|mailto:|external:|global-knowledge://)') { return $null }
        if ($target -match '^\.github/') { return $null }   # explicit .github/ prefix is always OK
        if ($target -notmatch '[/\\]' -and $target -notmatch '\.') { return $null }  # bare skill name
        if ($target -match '^[a-zA-Z]:\\|^/') { return $target }  # absolute path — always bad
        # Relative path — resolve and verify it stays inside .github/
        $baseDir = Split-Path $sourceFile -Parent
        $resolved = [System.IO.Path]::GetFullPath((Join-Path $baseDir $target))
        if ($resolved.StartsWith($ghPath, [System.StringComparison]::OrdinalIgnoreCase)) { return $null }
        return $target
    }

    function Test-KnownScException {
        param([string]$shortPath)
        foreach ($exc in $scExceptions) { if ($shortPath -match [regex]::Escape($exc)) { return $true } }
        return $false
    }

    $scIssues = @()

    # 1. Synapse targets — must all resolve within .github/
    Get-ChildItem "$ghPath" -Recurse -Filter "synapses.json" | ForEach-Object {
        $f = $_
        try {
            $j = Get-Content $f.FullName -Raw | ConvertFrom-Json
            foreach ($conn in $j.connections) {
                $escaped = Test-SelfContained -sourceFile $f.FullName -target $conn.target
                if ($null -ne $escaped) {
                    $short = $f.FullName -replace [regex]::Escape($ghPath + "\"), ""
                    if (-not (Test-KnownScException $short)) {
                        $scIssues += "[synapse] $short -> $escaped"
                    }
                }
            }
        }
        catch { $scIssues += "[parse-error] $($f.Name): $($_.Exception.Message)" }
    }

    # 2. Markdown link targets (code fences stripped to avoid false positives)
    $linkRx = [regex]'\[([^\]]*)\]\(([^)]+)\)'
    Get-ChildItem "$ghPath" -Recurse -Include "*.md" | ForEach-Object {
        $f = $_
        $short = $f.FullName -replace [regex]::Escape($ghPath + "\"), ""
        if (Test-KnownScException $short) { return }
        $content = Get-Content $f.FullName -Raw -ErrorAction SilentlyContinue
        if (-not $content) { return }
        # Strip code fences and inline code to avoid scanning example links
        $stripped = $content -replace '(?ms)```[^`]*```', ''
        $stripped = $stripped -replace '(?m)`[^`]+`', ''
        foreach ($m in $linkRx.Matches($stripped)) {
            $href = $m.Groups[2].Value
            if ($href -match '^(https?://|#|mailto:)') { continue }
            $escaped = Test-SelfContained -sourceFile $f.FullName -target $href
            if ($null -ne $escaped) { $scIssues += "[md-link] $short -> $escaped" }
        }
        # 3. Double-slash typo ..// — always a bug, never intentional
        if ($content -match '\.\.//') {
            $badLines = ($content -split "`n" | Select-String '\.\.//' |
                ForEach-Object { $_.LineNumber }) -join ', '
            $scIssues += "[..// typo] $short (lines: $badLines)"
        }
    }

    $synapseCount = (Get-ChildItem "$ghPath" -Recurse -Filter "synapses.json").Count
    $mdCount = (Get-ChildItem "$ghPath" -Recurse -Include "*.md").Count
    if ($scIssues.Count -eq 0) {
        Write-Pass "Brain is fully self-contained ($synapseCount synapse files, $mdCount markdown files scanned)"
    }
    else {
        foreach ($i in $scIssues) { Write-Fail $i }
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " BRAIN QA (HEIR) SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($fixed.Count -gt 0) {
    Write-Host "`nFIXED ($($fixed.Count)):" -ForegroundColor Green
    $fixed | ForEach-Object { Write-Host "  ✅ $_" -ForegroundColor Green }
}

if ($warnings.Count -gt 0) {
    Write-Host "`nWARNINGS ($($warnings.Count)):" -ForegroundColor Yellow
    $warnings | ForEach-Object { Write-Host "  ⚠️ $_" -ForegroundColor Yellow }
}

if ($issues.Count -gt 0) {
    Write-Host "`nISSUES ($($issues.Count)):" -ForegroundColor Red
    $issues | ForEach-Object { Write-Host "  ❌ $_" -ForegroundColor Red }
}

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "`n✅ All heir phases passed!" -ForegroundColor Green
}

Pop-Location

# Exit code
if ($issues.Count -gt 0) { exit 1 }
exit 0
