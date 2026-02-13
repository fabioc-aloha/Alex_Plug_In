# Brain QA - Deep semantic validation of Alex cognitive architecture
# Location: .github/muscles/brain-qa.ps1 (inheritable)
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
# If platforms/vscode-extension exists, we're in master; otherwise we ARE the heir
$candidateHeir = Join-Path $rootPath "platforms\vscode-extension"
if (Test-Path $candidateHeir) {
    $heirBase = $candidateHeir
    $isRunningFromHeir = $false
}
else {
    $heirBase = $rootPath
    $isRunningFromHeir = $true
}

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
$syncPhases = 5, 7, 8, 13, 14, 15
$schemaPhases = 2, 6, 11, 16, 17  # Added YAML frontmatter phases
$llmPhases = 10, 20, 21  # LLM-first content validation

# Determine which phases to run
$runPhases = switch ($Mode) {
    "quick" { $quickPhases }
    "sync" { $syncPhases }
    "schema" { $schemaPhases }
    "llm" { $llmPhases }
    default { 1..21 }  # Updated to include new phases
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
# PHASE 10: Mermaid Detection in Core Files
# ============================================================
if (10 -in $runPhases) {
    Write-Phase 10 "Mermaid Detection in Core Files"
    $coreFiles = @(
        "$ghPath\copilot-instructions.md",
        "$heirBase\.github\copilot-instructions.md"
    )
    $hasMermaid = @()
    foreach ($file in $coreFiles) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            if ($content -match '```mermaid') {
                $hasMermaid += (Split-Path $file -Leaf)
            }
        }
    }
    if ($hasMermaid.Count -eq 0) { 
        Write-Pass "No mermaid in core files"
    }
    else { 
        Write-Warn "Mermaid found in: $($hasMermaid -join ', ')"
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
        
        # Check P5-P7 slots
        $copilotPath = "$heirBase\.github\copilot-instructions.md"
        if (Test-Path $copilotPath) {
            $copilot = Get-Content $copilotPath -Raw
            if ($copilot -notmatch '\*\*P5\*\*.*\*\(available\)\*') { $resetIssues += "P5 not marked available" }
            if ($copilot -notmatch '\*\*P6\*\*.*\*\(available\)\*') { $resetIssues += "P6 not marked available" }
            if ($copilot -notmatch '\*\*P7\*\*.*\*\(available\)\*') { $resetIssues += "P7 not marked available" }
            
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
    
    # Note: Mermaid is GOOD for LLMs (structured DSL) - don't warn about it
    # Emojis are meaningful semantic tokens - they're fine
    
    if ($formatWarnings.Count -eq 0) {
        Write-Pass "Content formats are LLM-friendly"
    }
    else {
        foreach ($fw in $formatWarnings) { Write-Warn $fw }
        Write-Host "  💡 Mermaid diagrams are LLM-friendly (structured syntax). ASCII art requires spatial reasoning." -ForegroundColor DarkGray
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
# SUMMARY
# ============================================================
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
