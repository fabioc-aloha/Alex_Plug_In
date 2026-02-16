#Requires -Version 7.0
# Brain QA - Deep semantic validation of Alex cognitive architecture
# Location: .github/muscles/brain-qa.ps1 (master-only)
# Skill: brain-qa

param(
    [ValidateSet("all", "quick", "sync", "schema", "llm")]
    [string]$Mode = "all",
    
    [int[]]$Phase,  # Run specific phases: -Phase 1,5,7
    
    [switch]$Fix,   # Auto-fix where possible
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"

# Resolve paths
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent (Split-Path -Parent $scriptDir)  # .github/scripts -> .github -> root
$ghPath = Join-Path $rootPath ".github"
$heirBase = Join-Path $rootPath "platforms\vscode-extension"

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

# Define phase groups
$quickPhases = 1..6
$syncPhases = 5, 7, 8, 13, 14, 15, 27, 28, 33  # Added Phase 33: Pre-Sync Master Validation
$schemaPhases = 2, 6, 11, 16, 17  # YAML frontmatter phases
$llmPhases = 10, 20, 21  # LLM-first content validation
$ghFolderPhases = 22..25  # .github/ subfolder coverage (episodic, assets, templates, root files)
$fullAuditPhases = 26..33  # alex_docs, heirs, GK, scripts, version consistency, pre-sync validation

# Determine which phases to run
$runPhases = switch ($Mode) {
    "quick" { $quickPhases }
    "sync" { $syncPhases }
    "schema" { $schemaPhases }
    "llm" { $llmPhases }
    default { 1..33 }  # All phases including pre-sync validation
}

if ($Phase) { $runPhases = $Phase }

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

# ============================================================
# PHASE 5: Master-Heir Skill Sync
# ============================================================
if (5 -in $runPhases) {
    Write-Phase 5 "Master-Heir Skill Sync"
    if (Test-Path "$heirBase\.github\skills") {
        $masterSkills = (Get-ChildItem "$ghPath\skills" -Directory).Name | Sort-Object
        $heirSkills = (Get-ChildItem "$heirBase\.github\skills" -Directory).Name | Sort-Object
        Write-Pass "Master: $($masterSkills.Count) skills | Heir: $($heirSkills.Count) skills"
        $diff = Compare-Object $masterSkills $heirSkills -ErrorAction SilentlyContinue
        if ($diff) {
            $missingInHeir = ($diff | Where-Object { $_.SideIndicator -eq "<=" }).InputObject
            $extraInHeir = ($diff | Where-Object { $_.SideIndicator -eq "=>" }).InputObject
            if ($missingInHeir) { Write-Warn "Missing in heir: $($missingInHeir -join ', ')" }
            if ($extraInHeir) { Write-Warn "Extra in heir: $($extraInHeir -join ', ')" }
        }
        else {
            Write-Pass "Skill directories match"
        }
    }
    else {
        Write-Warn "Heir folder not found - skipping sync check"
    }
}

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
# PHASE 7: Synapse File Sync
# ============================================================
if (7 -in $runPhases) {
    Write-Phase 7 "Synapse File Sync"
    if (Test-Path "$heirBase\.github\skills") {
        # Empirically detect master-only skills: present in master but absent from heir
        $masterOnlySkills = @()
        Get-ChildItem "$ghPath\skills" -Directory | ForEach-Object {
            if (-not (Test-Path "$heirBase\.github\skills\$($_.Name)")) {
                $masterOnlySkills += $_.Name
            }
        }
        
        $diffs = @()
        Get-ChildItem "$ghPath\skills" -Directory | ForEach-Object {
            $skill = $_.Name
            $masterSyn = Join-Path $_.FullName "synapses.json"
            $heirSyn = "$heirBase\.github\skills\$skill\synapses.json"
            if ((Test-Path $masterSyn) -and (Test-Path $heirSyn)) {
                $masterHash = (Get-FileHash $masterSyn).Hash
                $heirHash = (Get-FileHash $heirSyn).Hash
                if ($masterHash -ne $heirHash) {
                    # Check if diff is only due to master-only ref removal
                    $masterJson = Get-Content $masterSyn -Raw | ConvertFrom-Json
                    $heirJson = Get-Content $heirSyn -Raw | ConvertFrom-Json
                    $filteredConns = @($masterJson.connections | Where-Object {
                            $target = $_.target
                            -not ($masterOnlySkills | Where-Object { $target -match $_ })
                        })
                    if ($filteredConns.Count -ne $heirJson.connections.Count) {
                        $diffs += $skill
                    }
                }
            }
        }
        if ($diffs.Count -eq 0) { 
            Write-Pass "All synapses in sync"
        }
        else { 
            Write-Fail "Out of sync: $($diffs -join ', ')"
            if ($Fix) {
                foreach ($skill in $diffs) {
                    Copy-Item "$ghPath\skills\$skill\synapses.json" "$heirBase\.github\skills\$skill\synapses.json" -Force
                    $fixed += "Synced $skill/synapses.json"
                }
            }
        }
    }
    else {
        Write-Warn "Heir folder not found - skipping sync check"
    }
}

# ============================================================
# PHASE 8: Skill-Activation Index Sync
# ============================================================
if (8 -in $runPhases) {
    Write-Phase 8 "Skill-Activation Index Sync"
    if (Test-Path "$heirBase\.github\skills\skill-activation\SKILL.md") {
        $masterHash = (Get-FileHash "$ghPath\skills\skill-activation\SKILL.md").Hash
        $heirHash = (Get-FileHash "$heirBase\.github\skills\skill-activation\SKILL.md").Hash
        if ($masterHash -eq $heirHash) { 
            Write-Pass "Index in sync"
        }
        else { 
            Write-Fail "Index out of sync"
            if ($Fix) {
                Copy-Item "$ghPath\skills\skill-activation\SKILL.md" "$heirBase\.github\skills\skill-activation\SKILL.md" -Force
                $fixed += "Synced skill-activation/SKILL.md"
            }
        }
    }
    else {
        Write-Warn "Heir skill-activation not found"
    }
}

# ============================================================
# PHASE 9: Catalog Accuracy Validation
# ============================================================
if (9 -in $runPhases) {
    Write-Phase 9 "Catalog Accuracy Validation"
    $actualSkills = (Get-ChildItem "$ghPath\skills" -Directory).Count
    $catalogPath = "$rootPath\alex_docs\skills\SKILLS-CATALOG.md"
    if (Test-Path $catalogPath) {
        $catalogContent = Get-Content $catalogPath -Raw
        if ($catalogContent -match '## Skill Count:\s*(\d+)') {
            $catalogCount = [int]$matches[1]
            if ($actualSkills -eq $catalogCount) { 
                Write-Pass "Catalog count accurate: $actualSkills skills"
            }
            else { 
                Write-Fail "Count mismatch: Catalog says $catalogCount, actual is $actualSkills"
            }
        }
        else {
            Write-Warn "Could not parse skill count from catalog"
        }
    }
    else {
        Write-Warn "SKILLS-CATALOG.md not found"
    }
}

# ============================================================
# PHASE 10: Core File Token Budget
# ============================================================
if (10 -in $runPhases) {
    Write-Phase 10 "Core File Token Budget"
    # copilot-instructions.md is auto-loaded into EVERY chat session.
    # Large content wastes context window tokens. Keep it lean.
    $budgetWarnings = @()
    $coreFiles = @(
        "$ghPath\copilot-instructions.md",
        "$heirBase\.github\copilot-instructions.md"
    )
    foreach ($file in $coreFiles) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            $lineCount = ($content -split '\n').Count
            $charCount = $content.Length
            $label = Split-Path $file -Leaf
            $parent = Split-Path (Split-Path $file -Parent) -Leaf
            $id = "$parent/$label"

            # Warn if over ~500 lines (rough token budget for always-loaded file)
            if ($lineCount -gt 500) {
                $budgetWarnings += "$id is $lineCount lines ($charCount chars) - consider trimming (auto-loaded every session)"
            }

            # ASCII art is bad for LLMs (requires spatial reasoning)
            if ($content -match '[┌┐└┘├┤┬┴┼│─═║╔╗╚╝╠╣╦╩╬]') {
                $budgetWarnings += "$id contains ASCII box-drawing art (use Mermaid or tables instead)"
            }
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
# PHASE 12: Heir Reset Validation (Pre-Publish)
# ============================================================
if (12 -in $runPhases) {
    Write-Phase 12 "Heir Reset Validation (Pre-Publish)"
    if (Test-Path "$heirBase\.github") {
        $resetIssues = @()
        
        # Check user-profile.json should NOT exist (PII protection - created at runtime from template)
        $profilePath = "$heirBase\.github\config\user-profile.json"
        if (Test-Path $profilePath) {
            $userProfile = Get-Content $profilePath | ConvertFrom-Json
            if ($userProfile.name -ne "") { $resetIssues += "user-profile.json has non-empty name (PII leak)" }
            if ($userProfile.nickname -ne "") { $resetIssues += "user-profile.json has non-empty nickname (PII leak)" }
        }
        # Verify template exists (used to create profile at runtime)
        $templatePath = "$heirBase\.github\config\user-profile.template.json"
        if (-not (Test-Path $templatePath)) { $resetIssues += "user-profile.template.json missing (needed for runtime profile creation)" }
        
        # Check Active Context section in copilot-instructions.md (v2 format)
        $copilotPath = "$heirBase\.github\copilot-instructions.md"
        if (Test-Path $copilotPath) {
            $copilot = Get-Content $copilotPath -Raw
            
            # v3 Identity + Active Context: verify sections exist and have default heir values
            if ($copilot -notmatch '## Identity') { $resetIssues += "Missing Identity section (v3 format)" }
            if ($copilot -notmatch '## Active Context') { $resetIssues += "Missing Active Context section" }
            if ($copilot -match 'Focus Trifectas:\s*master-heir-management') { $resetIssues += "Focus Trifectas has master-only values" }
            if ($copilot -match 'Last Assessed:\s*\d{4}-') { $resetIssues += "Last Assessed should be 'never' in heir" }
            
            # Check for hardcoded names
            if ($copilot -match "Fabio|Correa|Calefato|Cardoso") { 
                $resetIssues += "Found hardcoded names in copilot-instructions.md" 
            }
        }
        
        if ($resetIssues.Count -eq 0) { 
            Write-Pass "Heir properly reset for publication"
        }
        else {
            foreach ($ri in $resetIssues) { Write-Fail $ri }
        }
    }
    else {
        Write-Warn "Heir .github not found"
    }
}

# ============================================================
# PHASE 13: Instructions/Prompts Sync
# ============================================================
if (13 -in $runPhases) {
    Write-Phase 13 "Instructions/Prompts Sync"
    $masterOnly = @("brand-asset-management.instructions.md")
    if (Test-Path "$heirBase\.github\instructions") {
        $mi = (Get-ChildItem "$ghPath\instructions\*.md").Name | Where-Object { $_ -notin $masterOnly } | Sort-Object
        $hi = (Get-ChildItem "$heirBase\.github\instructions\*.md").Name | Sort-Object
        $diffI = Compare-Object $mi $hi -ErrorAction SilentlyContinue
        
        $mp = (Get-ChildItem "$ghPath\prompts\*.md").Name | Sort-Object
        $hp = (Get-ChildItem "$heirBase\.github\prompts\*.md").Name | Sort-Object
        $diffP = Compare-Object $mp $hp -ErrorAction SilentlyContinue
        
        $missing = @()
        if ($diffI) { $diffI | Where-Object { $_.SideIndicator -eq "<=" } | ForEach-Object { $missing += "instructions/$($_.InputObject)" } }
        if ($diffP) { $diffP | Where-Object { $_.SideIndicator -eq "<=" } | ForEach-Object { $missing += "prompts/$($_.InputObject)" } }
        
        if ($missing.Count -eq 0) { 
            Write-Pass "Instructions/Prompts in sync"
        }
        else {
            Write-Fail "Missing from heir: $($missing -join ', ')"
            
            if ($Fix) {
                foreach ($m in $missing) {
                    $src = "$ghPath\$m"
                    $dst = "$heirBase\.github\$m"
                    Copy-Item $src $dst -Force
                    $fixed += "Synced $m"
                }
            }
        }
    }
    else {
        Write-Warn "Heir instructions folder not found"
    }
}

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
    
    # Compare Master-Heir
    if (Test-Path "$heirBase\.github\agents") {
        $ma = (Get-ChildItem "$ghPath\agents\*.md" -EA SilentlyContinue).Name | Sort-Object
        $ha = (Get-ChildItem "$heirBase\.github\agents\*.md" -EA SilentlyContinue).Name | Sort-Object
        $diffA = Compare-Object $ma $ha -EA SilentlyContinue
        if ($diffA) { $agentIssues += "Agent count mismatch: Master=$($ma.Count), Heir=$($ha.Count)" }
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
    
    # Check heir has required configs
    foreach ($cfg in $required) {
        $path = "$heirBase\.github\config\$cfg"
        if (-not (Test-Path $path)) { 
            $configIssues += "Missing: $cfg" 
        }
        elseif ($cfg -match '\.json$') {
            try { Get-Content $path -Raw | ConvertFrom-Json | Out-Null }
            catch { $configIssues += "Invalid JSON: $cfg" }
        }
    }
    
    # Verify Master-only files NOT in heir
    foreach ($cfg in $masterOnlyCfg) {
        $path = "$heirBase\.github\config\$cfg"
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
            
            # Check for YAML frontmatter
            if ($content -notmatch '^---\s*\n') {
                $frontmatterIssues += "${skill} - Missing YAML frontmatter"
            }
            else {
                # Extract frontmatter
                if ($content -match '^---\s*\n([\s\S]*?)\n---') {
                    $fm = $matches[1]
                    # Required: name
                    if ($fm -notmatch 'name:\s*[''"]?[\w\-]+') {
                        $frontmatterIssues += "${skill} - Missing 'name' in frontmatter"
                    }
                    # Required: description
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
    # These skills are internal metacognition - should have user-invokable: false
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
        # Main orchestrator (alex.agent.md) should have handoffs
        if ($agent.Name -eq "alex.agent.md") {
            if ($content -notmatch 'handoffs:') {
                $handoffIssues += "alex.agent.md - Missing handoffs section"
            }
        }
        # All non-main agents should have a return-to-Alex handoff
        else {
            if ($content -match 'handoffs:' -and $content -notmatch 'agent:\s*Alex') {
                $handoffIssues += "$($agent.Name) - No return-to-Alex handoff"
            }
        }
        # Check handoff syntax
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
    
    # These instructions should have file-type specific applyTo patterns
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
    
    # Check core files for ASCII art diagrams (worse for LLMs than Mermaid)
    $coreFiles = @(
        "$ghPath\copilot-instructions.md"
        "$ghPath\agents\*.md"
    )
    
    foreach ($pattern in $coreFiles) {
        Get-ChildItem $pattern -ErrorAction SilentlyContinue | ForEach-Object {
            $content = Get-Content $_.FullName -Raw
            $file = $_.Name
            
            # ASCII box drawing characters (indicate ASCII art diagrams)
            # These are harder for LLMs to parse than structured formats
            if ($content -match '[┌┐└┘├┤┬┴┼│─═║╔╗╚╝╠╣╦╩╬]') {
                $formatWarnings += "${file} - Contains box-drawing ASCII art (Mermaid or tables preferred for LLM parsing)"
            }
            
            # Arrow-heavy ASCII (spatial reasoning required)
            if (($content -split '\n' | Where-Object { $_ -match '^\s*[│↓↑←→]' }).Count -gt 5) {
                $formatWarnings += "${file} - Heavy use of ASCII arrows (structured format preferred)"
            }
        }
    }
    
    # Mermaid is LLM-friendly (structured DSL) - only a token-budget concern
    # in always-loaded files (checked in Phase 10). Emojis are semantic tokens.
    
    if ($formatWarnings.Count -eq 0) {
        Write-Pass "Content formats are LLM-friendly"
    }
    else {
        foreach ($fw in $formatWarnings) { Write-Warn $fw }
        Write-Host "  💡 Use Mermaid or tables instead of ASCII art — LLMs parse structured syntax better." -ForegroundColor DarkGray
    }
}

# ============================================================
# PHASE 21: Emoji Semantic Consistency
# ============================================================
if (21 -in $runPhases) {
    Write-Phase 21 "Emoji Semantic Consistency"
    # Just report emoji usage stats - emojis are semantic tokens, good for LLMs
    $emojiCount = 0
    Get-ChildItem "$ghPath\agents\*.md" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        # Count common semantic emojis used in the codebase
        $emojis = @("🔨", "🔍", "📚", "🧠", "✅", "❌", "⚠️", "☁️", "🔷", "⭐")
        foreach ($e in $emojis) {
            $emojiCount += ([regex]::Matches($content, [regex]::Escape($e))).Count
        }
    }
    Write-Pass "Semantic emojis in agents: $emojiCount (emojis are meaningful tokens for LLMs)"
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
        $sessions = $allEpisodic | Where-Object { $_.Name -match '^session-' }

        Write-Pass "Episodic files: $($allEpisodic.Count) total ($($dreamReports.Count) dreams, $($meditations.Count) meditations, $($selfActualizations.Count) self-actualizations)"

        # CRITICAL: Detect legacy .prompt.md files (MUST be migrated/archived)
        $legacyPrompts = $allEpisodic | Where-Object { $_.Name -match '\.prompt\.md$' }
        if ($legacyPrompts.Count -gt 0) {
            Write-Fail "Episodic has $($legacyPrompts.Count) legacy .prompt.md files - archive to archive/upgrades/"
            foreach ($lp in $legacyPrompts) { 
                Write-Fail "  Legacy format: $($lp.Name)"
                if ($Fix) {
                    $archivePath = Join-Path $rootPath "archive\upgrades"
                    if (-not (Test-Path $archivePath)) { New-Item -ItemType Directory -Path $archivePath -Force | Out-Null }
                    Move-Item $lp.FullName $archivePath -Force
                    $script:fixed += "Archived legacy file: $($lp.Name)"
                    Write-Pass "  → Archived to archive/upgrades/$($lp.Name)"
                }
            }
        }

        # Detect undated episodic files (no YYYY-MM-DD pattern)
        $undated = $allEpisodic | Where-Object { $_.Name -notmatch '\d{4}-\d{2}-\d{2}' -and $_.Name -ne '.markdownlint.json' }
        if ($undated.Count -gt 0) {
            Write-Warn "Episodic has $($undated.Count) undated files (may need archival review)"
            foreach ($ud in $undated) { Write-Warn "  Undated: $($ud.Name)" }
        }

        # Validate current naming conventions
        $invalidNames = $allEpisodic | Where-Object { 
            $_.Name -ne '.markdownlint.json' -and
            $_.Name -notmatch '^(dream-report-|dream-|meditation-|self-actualization-|session-|chronicle-)' 
        }
        if ($invalidNames.Count -gt 0) {
            Write-Fail "Episodic has $($invalidNames.Count) files with non-standard naming"
            foreach ($in in $invalidNames) { Write-Fail "  Invalid name: $($in.Name)" }
        }
    }
    else {
        Write-Pass "No episodic/ folder (normal for heirs)"
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

        # Banner must exist (used in README, marketplace)
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
        $expectedTemplates = @("bug_report.md", "feature_request.md")
        $missingTemplates = @()
        foreach ($t in $expectedTemplates) {
            if (-not (Test-Path (Join-Path $issueTemplatePath $t))) { $missingTemplates += $t }
        }
        if ($missingTemplates.Count -gt 0) {
            foreach ($mt in $missingTemplates) { Write-Warn "Missing issue template: $mt" }
        }
        else { Write-Pass "Issue templates present ($($templates.Count) templates)" }
    }
    else {
        Write-Warn "ISSUE_TEMPLATE/ not found"
    }

    if (Test-Path $prTemplatePath) {
        Write-Pass "PR template present"
    }
    else {
        Write-Warn "pull_request_template.md not found"
    }
}

# ============================================================
# PHASE 25: .github/ Root Files Completeness
# ============================================================
if (25 -in $runPhases) {
    Write-Phase 25 ".github/ Root Files Completeness"
    $expectedRootFiles = @(
        "copilot-instructions.md",
        "README.md"
    )
    $missingRoot = @()
    foreach ($rf in $expectedRootFiles) {
        if (-not (Test-Path (Join-Path $ghPath $rf))) { $missingRoot += $rf }
    }
    if ($missingRoot.Count -gt 0) {
        foreach ($mr in $missingRoot) { Write-Fail "Missing .github/ root file: $mr" }
    }
    else { Write-Pass "All .github/ root files present ($($expectedRootFiles.Count) files)" }

    # Verify all expected subdirs exist
    $expectedDirs = @("agents", "config", "episodic", "instructions", "muscles", "prompts", "skills", "assets", "ISSUE_TEMPLATE")
    $missingDirs = @()
    foreach ($d in $expectedDirs) {
        if (-not (Test-Path (Join-Path $ghPath $d))) { $missingDirs += $d }
    }
    if ($missingDirs.Count -gt 0) {
        foreach ($md in $missingDirs) { Write-Warn "Missing .github/ subfolder: $md" }
    }
    else { Write-Pass "All .github/ subfolders present ($($expectedDirs.Count) folders)" }
}

# ============================================================
# PHASE 26: alex_docs/ Architecture Docs Freshness
# ============================================================
if (26 -in $runPhases) {
    Write-Phase 26 "alex_docs/ Architecture Docs Freshness"
    $docsPath = Join-Path $rootPath "alex_docs"
    if (Test-Path $docsPath) {
        $archPath = Join-Path $docsPath "architecture"
        $expectedArchDocs = @(
            "TRIFECTA-CATALOG.md", "COGNITIVE-ARCHITECTURE.md", "MEMORY-SYSTEMS.md",
            "NEUROANATOMICAL-MAPPING.md", "AGENT-CATALOG.md", "SEMANTIC-SKILL-GRAPH.md"
        )
        $missingDocs = @()
        foreach ($doc in $expectedArchDocs) {
            $fp = Join-Path $archPath $doc
            if (-not (Test-Path $fp)) { $missingDocs += $doc }
        }
        if ($missingDocs.Count -gt 0) {
            foreach ($md in $missingDocs) { Write-Fail "Missing architecture doc: $md" }
        }

        # Check for stale version references in architecture docs
        $staleVersions = @()
        Get-ChildItem "$archPath\*.md" -ErrorAction SilentlyContinue | ForEach-Object {
            $content = Get-Content $_.FullName -Raw
            if ($content -match 'Alex v[23]\.\d+\.\d+') {
                $staleVersions += "$($_.Name) references pre-v5 Alex version"
            }
        }
        if ($staleVersions.Count -gt 0) {
            foreach ($sv in $staleVersions) { Write-Warn $sv }
        }

        # Check skill catalog accuracy
        $catalogPath = Join-Path $docsPath "skills\SKILLS-CATALOG.md"
        if (Test-Path $catalogPath) {
            $catalogContent = Get-Content $catalogPath -Raw
            $masterSkillCount = (Get-ChildItem "$ghPath\skills\*\SKILL.md").Count
            if ($catalogContent -match 'Total.*?(\d+)\s*skills') {
                $catalogCount = [int]$Matches[1]
                if ($catalogCount -ne $masterSkillCount) {
                    Write-Warn "SKILLS-CATALOG.md says $catalogCount skills, actual: $masterSkillCount"
                }
                else { Write-Pass "SKILLS-CATALOG.md count matches ($masterSkillCount)" }
            }
        }

        if ($missingDocs.Count -eq 0 -and $staleVersions.Count -eq 0) {
            Write-Pass "Architecture docs present and version-current"
        }
    }
    else {
        Write-Warn "alex_docs/ folder not found (expected in master)"
    }
}

# PHASE 27: M365 Heir Health
# ============================================================
if (27 -in $runPhases) {
    Write-Phase 27 "M365 Heir Health"
    $m365Path = Join-Path $rootPath "platforms\m365-copilot"
    if (Test-Path $m365Path) {
        # Version alignment
        $m365PkgPath = Join-Path $m365Path "package.json"
        $vscPkgPath = Join-Path $rootPath "platforms\vscode-extension\package.json"
        if ((Test-Path $m365PkgPath) -and (Test-Path $vscPkgPath)) {
            $m365Pkg = Get-Content $m365PkgPath -Raw | ConvertFrom-Json
            $vscPkg = Get-Content $vscPkgPath -Raw | ConvertFrom-Json
            if ($m365Pkg.version -ne $vscPkg.version) {
                Write-Warn "M365 heir version ($($m365Pkg.version)) != VS Code heir ($($vscPkg.version))"
            }
            else { Write-Pass "M365 heir version aligned ($($m365Pkg.version))" }
        }

        # Check essential M365 files exist
        $m365Required = @("teamsapp.yml", "appPackage\declarativeAgent.json", "README.md")
        $m365Missing = @()
        foreach ($f in $m365Required) {
            if (-not (Test-Path (Join-Path $m365Path $f))) { $m365Missing += $f }
        }
        if ($m365Missing.Count -gt 0) {
            foreach ($mf in $m365Missing) { Write-Fail "M365 heir missing: $mf" }
        }
        else { Write-Pass "M365 heir essential files present" }

        # Badge vs package.json version check
        $m365Readme = Join-Path $m365Path "README.md"
        if (Test-Path $m365Readme) {
            $readmeContent = Get-Content $m365Readme -Raw
            if ($readmeContent -match 'badge/version-([0-9.]+)-') {
                $badgeVer = $Matches[1]
                if ($badgeVer -ne $m365Pkg.version) {
                    Write-Warn "M365 README badge ($badgeVer) != package.json ($($m365Pkg.version))"
                }
            }
        }
    }
    else {
        Write-Pass "M365 heir not present (skipped)"
    }
}

# ============================================================
# PHASE 28: Codespaces Heir Health
# ============================================================
if (28 -in $runPhases) {
    Write-Phase 28 "Codespaces Heir Health"
    $csPath = Join-Path $rootPath "platforms\codespaces"
    if (Test-Path $csPath) {
        $csRequired = @("devcontainer.json", "README.md")
        $csMissing = @()
        foreach ($f in $csRequired) {
            if (-not (Test-Path (Join-Path $csPath $f))) { $csMissing += $f }
        }
        if ($csMissing.Count -gt 0) {
            foreach ($cf in $csMissing) { Write-Fail "Codespaces heir missing: $cf" }
        }
        else { Write-Pass "Codespaces heir essential files present" }
    }
    else {
        Write-Pass "Codespaces heir not present (skipped)"
    }
}

# ============================================================
# PHASE 29: Global Knowledge Sync Validation
# ============================================================
if (29 -in $runPhases) {
    Write-Phase 29 "Global Knowledge Sync Validation"
    $gkPath = Join-Path (Split-Path $rootPath -Parent) "Alex-Global-Knowledge"
    if (Test-Path $gkPath) {
        # Index vs actual file count
        $indexPath = Join-Path $gkPath "index.json"
        if (Test-Path $indexPath) {
            $index = Get-Content $indexPath -Raw | ConvertFrom-Json
            $indexPatterns = ($index.entries | Where-Object { $_.type -eq "pattern" }).Count
            $indexInsights = ($index.entries | Where-Object { $_.type -eq "insight" }).Count
            $actualPatterns = (Get-ChildItem (Join-Path $gkPath "patterns\GK-*.md") -ErrorAction SilentlyContinue).Count
            $actualInsights = (Get-ChildItem (Join-Path $gkPath "insights\GI-*.md") -ErrorAction SilentlyContinue).Count

            if ($indexPatterns -ne $actualPatterns) {
                Write-Warn "GK index patterns ($indexPatterns) != actual files ($actualPatterns)"
            }
            if ($indexInsights -ne $actualInsights) {
                Write-Warn "GK index insights ($indexInsights) != actual files ($actualInsights)"
            }
            if ($indexPatterns -eq $actualPatterns -and $indexInsights -eq $actualInsights) {
                Write-Pass "GK index matches disk: $actualPatterns patterns, $actualInsights insights"
            }
        }
        else { Write-Warn "Global Knowledge index.json not found" }

        # Check GK copilot-instructions counts match reality
        $gkCopilot = Join-Path $gkPath ".github\copilot-instructions.md"
        if (Test-Path $gkCopilot) {
            $gkContent = Get-Content $gkCopilot -Raw
            if ($gkContent -match '(\d+)\s*patterns') {
                $docPatterns = [int]$Matches[1]
                if ($docPatterns -ne $actualPatterns) {
                    Write-Warn "GK copilot-instructions says $docPatterns patterns, actual: $actualPatterns"
                }
            }
            if ($gkContent -match '(\d+)\s*insights') {
                $docInsights = [int]$Matches[1]
                if ($docInsights -ne $actualInsights) {
                    Write-Warn "GK copilot-instructions says $docInsights insights, actual: $actualInsights"
                }
            }
        }
    }
    else {
        Write-Pass "Global Knowledge repo not found (skipped)"
    }
}

# ============================================================
# PHASE 30: Release Scripts & Muscles Integrity
# ============================================================
if (30 -in $runPhases) {
    Write-Phase 30 "Release Scripts & Muscles Integrity"
    # Check that muscles referenced in trifecta catalog exist
    $musclesPath = Join-Path $ghPath "muscles"
    $expectedMuscles = @(
        "audit-master-alex.ps1", "brain-qa.ps1", "brain-qa-heir.ps1",
        "build-extension-package.ps1",
        "dream-cli.ts", "fix-fence-bug.ps1", "gamma-generator.js", "normalize-paths.ps1",
        "pptxgen-cli.ts", "sync-architecture.js", "validate-skills.ps1", "validate-synapses.ps1"
    )
    $missingMuscles = @()
    foreach ($m in $expectedMuscles) {
        if (-not (Test-Path (Join-Path $musclesPath $m))) { $missingMuscles += $m }
    }
    if ($missingMuscles.Count -gt 0) {
        foreach ($mm in $missingMuscles) { Write-Fail "Missing muscle: $mm" }
    }
    else { Write-Pass "All trifecta-referenced muscles present ($($expectedMuscles.Count))" }

    # Check release scripts
    $scriptsPath = Join-Path $rootPath "scripts"
    if (Test-Path $scriptsPath) {
        $releaseScripts = @("release-vscode.ps1", "release-preflight.ps1")
        $missingRelease = @()
        foreach ($rs in $releaseScripts) {
            if (-not (Test-Path (Join-Path $scriptsPath $rs))) { $missingRelease += $rs }
        }
        if ($missingRelease.Count -gt 0) {
            foreach ($mr in $missingRelease) { Write-Warn "Missing release script: $mr" }
        }
        else { Write-Pass "Release scripts present" }
    }
}

# ============================================================
# PHASE 31: ROADMAP & Root Doc Version Consistency
# ============================================================
if (31 -in $runPhases) {
    Write-Phase 31 "ROADMAP & Root Doc Version Consistency"
    $vscPkgPath = Join-Path $rootPath "platforms\vscode-extension\package.json"
    $currentVersion = "unknown"
    if (Test-Path $vscPkgPath) {
        $currentVersion = (Get-Content $vscPkgPath -Raw | ConvertFrom-Json).version
    }

    # Check ROADMAP references current version
    $roadmapPath = Join-Path $rootPath "ROADMAP-UNIFIED.md"
    if (Test-Path $roadmapPath) {
        $rmContent = Get-Content $roadmapPath -Raw
        if ($rmContent -match 'Current Master Version.*?(\d+\.\d+\.\d+)') {
            $rmVersion = $Matches[1]
            if ($rmVersion -ne $currentVersion) {
                Write-Warn "ROADMAP says master version $rmVersion, package.json says $currentVersion"
            }
            else { Write-Pass "ROADMAP master version matches ($currentVersion)" }
        }
    }

    # Check cognitive-config.json version
    $configPath = Join-Path $ghPath "config\cognitive-config.json"
    if (Test-Path $configPath) {
        $config = Get-Content $configPath -Raw | ConvertFrom-Json
        if ($config.version -ne $currentVersion) {
            Write-Warn "cognitive-config.json version ($($config.version)) != $currentVersion"
        }
        else { Write-Pass "cognitive-config.json version matches ($currentVersion)" }
    }

    # Check copilot-instructions.md version header (v3 format: # Alex v5.7.0)
    $ciPath = Join-Path $ghPath "copilot-instructions.md"
    if (Test-Path $ciPath) {
        $ciContent = Get-Content $ciPath -Raw
        if ($ciContent -match '# Alex v(\d+\.\d+\.\d+)') {
            $ciVersion = $Matches[1]
            if ($ciVersion -ne $currentVersion) {
                Write-Warn "copilot-instructions.md version ($ciVersion) != $currentVersion"
            }
            else { Write-Pass "copilot-instructions.md version matches ($currentVersion)" }
        }
    }

    # Check root CHANGELOG has entry for current version
    $clPath = Join-Path $rootPath "CHANGELOG.md"
    if (Test-Path $clPath) {
        $clContent = Get-Content $clPath -Raw
        if ($clContent -notmatch "\[$currentVersion\]") {
            Write-Warn "CHANGELOG.md missing entry for $currentVersion"
        }
        else { Write-Pass "CHANGELOG.md has entry for $currentVersion" }
    }

    # Check heir CHANGELOG has entry for current version
    $heirClPath = Join-Path $rootPath "platforms\vscode-extension\CHANGELOG.md"
    if (Test-Path $heirClPath) {
        $heirClContent = Get-Content $heirClPath -Raw
        if ($heirClContent -notmatch "\[$currentVersion\]") {
            Write-Warn "Heir CHANGELOG.md missing entry for $currentVersion"
        }
        else { Write-Pass "Heir CHANGELOG.md has entry for $currentVersion" }
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
# PHASE 33: Pre-Sync Master Validation (Prevent Heir Contamination)
# ============================================================
if (33 -in $runPhases) {
    Write-Phase 33 "Pre-Sync Master Validation"
    
    # This phase validates master BEFORE syncing to heir
    # Prevents contamination from spreading downstream
    
    # 1. All skills must have YAML frontmatter (already checked in Phase 16, but critical for sync)
    $missingFM = @()
    Get-ChildItem "$ghPath\skills" -Directory | ForEach-Object {
        $skillMd = Join-Path $_.FullName "SKILL.md"
        if ((Test-Path $skillMd) -and ((Get-Content $skillMd -Raw) -notmatch '^---\s*\n')) {
            $missingFM += $_.Name
        }
    }
    if ($missingFM.Count -gt 0) {
        Write-Fail "Master has $($missingFM.Count) skills without YAML frontmatter - will break heir"
        $missingFM | ForEach-Object { Write-Fail "  Missing frontmatter: $_" }
    }
    else {
        Write-Pass "All master skills have YAML frontmatter"
    }
    
    # 2. No legacy .prompt.md files in episodic (they'll sync to heir as broken references)
    $episodicPath = Join-Path $ghPath "episodic"
    if (Test-Path $episodicPath) {
        $legacyPrompts = Get-ChildItem "$episodicPath\*.prompt.md" -ErrorAction SilentlyContinue
        if ($legacyPrompts.Count -gt 0) {
            Write-Fail "Master episodic has $($legacyPrompts.Count) legacy .prompt.md files - archive before sync"
            $legacyPrompts | ForEach-Object { Write-Fail "  Legacy: $($_.Name)" }
        }
        else {
            Write-Pass "No legacy .prompt.md files in episodic"
        }
    }
    
    # 3. No PII in master user-profile.json (protection layer before sync exclusion)
    $profilePath = Join-Path $ghPath "config\user-profile.json"
    if (Test-Path $profilePath) {
        $profile = Get-Content $profilePath -Raw | ConvertFrom-Json
        $hasPII = $false
        if ($profile.name -and $profile.name.Trim() -ne '') {
            Write-Warn "Master user-profile.json contains name: '$($profile.name)' (will be excluded from heir)"
            $hasPII = $true
        }
        if ($profile.contact -and $profile.contact.email) {
            Write-Warn "Master user-profile.json contains email (will be excluded from heir)"
            $hasPII = $true
        }
        if (-not $hasPII) {
            Write-Pass "Master user-profile.json is PII-free"
        }
    }
    
    # 4. Synapse references to non-existent files (will become broken in heir)
    $brokenRefs = @()
    Get-ChildItem "$ghPath\skills" -Directory | ForEach-Object {
        $synPath = Join-Path $_.FullName "synapses.json"
        if (Test-Path $synPath) {
            $syn = Get-Content $synPath -Raw | ConvertFrom-Json
            foreach ($conn in $syn.connections) {
                $target = $conn.target
                # Skip URIs
                if ($target -match '^(external:|global-knowledge://|https?://)') { continue }
                
                # Resolve path
                $fullPath = if ($target -match "^\.github/") {
                    Join-Path $rootPath $target
                }
                elseif ($target -match "^\.\./") {
                    [System.IO.Path]::GetFullPath((Join-Path $_.FullName $target))
                }
                else {
                    Join-Path $_.FullName $target
                }
                
                if (-not (Test-Path $fullPath)) {
                    $brokenRefs += "$($_.Name): $target"
                }
            }
        }
    }
    if ($brokenRefs.Count -gt 0) {
        Write-Fail "Master has $($brokenRefs.Count) broken synapse references - fix before sync"
        $brokenRefs | Select-Object -First 10 | ForEach-Object { Write-Fail "  $_" }
        if ($brokenRefs.Count -gt 10) { Write-Fail "  ... and $($brokenRefs.Count - 10) more" }
    }
    else {
        Write-Pass "All master synapse references are valid"
    }
    
    # 5. Master-only files should not be referenced by inheritable skills
    $contaminated = @()
    Get-ChildItem "$ghPath\skills" -Directory | ForEach-Object {
        $synPath = Join-Path $_.FullName "synapses.json"
        if (Test-Path $synPath) {
            $syn = Get-Content $synPath -Raw | ConvertFrom-Json
            # Only check inheritable skills
            if ($syn.inheritance -in @('inheritable', 'universal')) {
                foreach ($conn in $syn.connections) {
                    $target = $conn.target
                    # Check for master-only paths
                    if ($target -match '(ROADMAP-UNIFIED|alex_docs/|platforms/|MASTER-ALEX-PROTECTED|episodic/)') {
                        $contaminated += "$($_.Name): references master-only path '$target'"
                    }
                }
            }
        }
    }
    if ($contaminated.Count -gt 0) {
        Write-Fail "Inheritable skills reference master-only paths - will break in heir"
        $contaminated | ForEach-Object { Write-Fail "  $_" }
    }
    else {
        Write-Pass "No inheritable skills reference master-only paths"
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " BRAIN QA SUMMARY" -ForegroundColor Cyan
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
    Write-Host "`n✅ All phases passed!" -ForegroundColor Green
}

Pop-Location

# Exit code
if ($issues.Count -gt 0) { exit 1 }
exit 0
