---
name: "Brain QA"
description: "Deep semantic validation of Alex's cognitive architecture - synapses, triggers, skill index, and Master-Heir synchronization"
applyTo: "**/*synapse*,**/*skill*,**/*trigger*"
---

# Brain QA

> Deep semantic validation of Alex's cognitive architecture - synapses, triggers, skill index, and Master-Heir synchronization

## Overview

A meditative QA process for validating the health and coherence of Alex's brain architecture. This goes beyond simple synapse validation (`architecture-health`) to perform semantic analysis of trigger mappings, skill-synapse relationships, and cross-platform synchronization.

**When to use:**
- Before releases
- After adding/modifying skills
- After bulk synapse updates
- When trigger conflicts are suspected
- To verify Master-Heir parity

## Audit Phases

### Phase 1: Synapse Target Validation

Verify all synapse connections point to existing files:

```powershell
# Master Alex
$uniqueBroken = @{}
Get-ChildItem "c:\Development\Alex_Plug_In\.github" -Recurse -Filter "synapses.json" | ForEach-Object {
  $json = Get-Content $_.FullName -Raw | ConvertFrom-Json
  $sourceDir = $_.DirectoryName
  foreach ($conn in $json.connections) {
    $target = $conn.target
    # All paths resolved from workspace root
    if ($target -match "^\.github/|^alex_docs/|^platforms/|^[A-Z].*\.md$") {
      $fullPath = Join-Path "c:\Development\Alex_Plug_In" $target
    } elseif ($target -match "^\.\./") {
      # Relative paths from skill folder
      $fullPath = [System.IO.Path]::GetFullPath((Join-Path $sourceDir $target))
    } else { 
      $fullPath = Join-Path $sourceDir $target 
    }
    if (-not (Test-Path $fullPath)) { $uniqueBroken[$target] = $true }
  }
}
if ($uniqueBroken.Count -eq 0) { "All synapses valid!" } else { $uniqueBroken.Keys | Sort-Object }
```

**Expected:** All synapses valid!

### Phase 2: Inheritance Field Validation

Verify all skills have `inheritance` field in synapses.json:

```powershell
$missing = @()
Get-ChildItem ".github\skills" -Directory | ForEach-Object {
  $synapse = Join-Path $_.FullName "synapses.json"
  if (Test-Path $synapse) {
    $json = Get-Content $synapse -Raw | ConvertFrom-Json
    if (-not $json.inheritance) {
      $missing += $_.Name
    }
  }
}
if ($missing.Count -eq 0) { "All skills have inheritance!" } else { "MISSING INHERITANCE: $($missing -join ', ')" }
```

**Expected:** All skills have inheritance!
**Valid values:** `inheritable`, `master-only`, `heir:vscode`, `heir:m365`
**Required by:** SYNAPSE-SCHEMA.json (enforced since v4.2.12)

### Phase 3: Skill Index Coverage

Verify all skills are indexed in `skill-activation`:

```powershell
$skillDirs = (Get-ChildItem ".github\skills" -Directory).Name
$indexContent = Get-Content ".github\skills\skill-activation\SKILL.md" -Raw
$missing = @()
foreach ($s in $skillDirs) {
  if ($s -ne "skill-activation" -and $indexContent -notmatch "$s \|") {
    $missing += $s
  }
}
if ($missing.Count -eq 0) { "All skills indexed!" } else { "NOT INDEXED: $($missing -join ', ')" }
```

**Expected:** All skills indexed!

### Phase 4: Trigger Semantic Analysis

Find overlapping triggers (acceptable if related skills):

```powershell
$triggers = @{}
Get-Content ".github\skills\skill-activation\SKILL.md" | 
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
$triggers.GetEnumerator() | Where-Object { $_.Value -match "," } | 
  ForEach-Object { "OVERLAP '$($_.Key)': $($_.Value)" }
```

**Evaluate:** Overlaps should be semantically related skills (e.g., `self-actualize` → meditation-facilitation + self-actualization ✅)

### Phase 5: Master-Heir Skill Sync

Verify skill directories match:

```powershell
$masterSkills = (Get-ChildItem ".github\skills" -Directory).Name | Sort-Object
$heirSkills = (Get-ChildItem "platforms\vscode-extension\.github\skills" -Directory).Name | Sort-Object
"Master: $($masterSkills.Count) skills"
"Heir: $($heirSkills.Count) skills"
Compare-Object $masterSkills $heirSkills
```

**Expected:** Same count, no differences

### Phase 6: Synapse Schema Format Validation

Verify all synapses use current schema format:

```powershell
$critical = @(); $info = @()
Get-ChildItem ".github\skills" -Recurse -Filter "synapses.json" | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  $skill = $_.DirectoryName | Split-Path -Leaf
  # CRITICAL: String strengths (must fix)
  if ($content -match '"strength":\s*"(strong|moderate|High|Medium|Critical|Low)"') {
    $critical += $skill
  }
  # CRITICAL: Missing $schema (must fix)
  if ($content -notmatch '"\$schema"') {
    $critical += $skill
  }
  # INFO: Legacy array name (both supported, `connections` preferred)
  if ($content -match '"synapses":\s*\[' -and $content -notmatch '"connections":\s*\[') {
    $info += $skill
  }
}
$critical = $critical | Select-Object -Unique
$info = $info | Select-Object -Unique
if ($critical.Count -eq 0) { "Phase 6: Schema validation passed!" } else { "CRITICAL: $($critical -join ', ')" }
if ($info.Count -gt 0) { "INFO (legacy array, works but prefer 'connections'): $($info -join ', ')" }
```

**Expected:** Phase 6: Schema validation passed!

### Phase 7: Synapse File Sync

Verify synapses.json files are synchronized:

```powershell
$diffs = @()
Get-ChildItem ".github\skills" -Directory | ForEach-Object {
  $skill = $_.Name
  $masterSyn = Join-Path $_.FullName "synapses.json"
  $heirSyn = "platforms\vscode-extension\.github\skills\$skill\synapses.json"
  if ((Test-Path $masterSyn) -and (Test-Path $heirSyn)) {
    $masterHash = (Get-FileHash $masterSyn).Hash
    $heirHash = (Get-FileHash $heirSyn).Hash
    if ($masterHash -ne $heirHash) { $diffs += $skill }
  }
}
if ($diffs.Count -eq 0) { "All synapses in sync!" } else { "OUT OF SYNC: $($diffs -join ', ')" }
```

**Expected:** All synapses in sync!

### Phase 8: Skill-Activation Index Sync

```powershell
$masterHash = (Get-FileHash ".github\skills\skill-activation\SKILL.md").Hash
$heirHash = (Get-FileHash "platforms\vscode-extension\.github\skills\skill-activation\SKILL.md").Hash
if ($masterHash -eq $heirHash) { "Index in sync!" } else { "INDEX OUT OF SYNC" }
```

**Expected:** Index in sync!

### Phase 9: Catalog Accuracy Validation

Verify SKILLS-CATALOG.md reflects actual skill inventory:

```powershell
# Check skill count matches
$actualSkills = (Get-ChildItem ".github\skills" -Directory).Count
$catalogContent = Get-Content "alex_docs\skills\SKILLS-CATALOG.md" -Raw

# Extract count from catalog (matches "## Skill Count: 73" format)
if ($catalogContent -match '## Skill Count:\s*(\d+)') {
  $catalogCount = [int]$matches[1]
  if ($actualSkills -eq $catalogCount) { 
    "Catalog count accurate: $actualSkills skills" 
  } else { 
    "COUNT MISMATCH: Catalog says $catalogCount, actual is $actualSkills" 
  }
} else {
  "WARNING: Could not parse skill count from catalog"
}

# Check each skill appears in Subgraph Index
$skillDirs = (Get-ChildItem ".github\skills" -Directory).Name
$missing = @()
foreach ($skill in $skillDirs) {
  if ($catalogContent -notmatch $skill) {
    $missing += $skill
  }
}
if ($missing.Count -eq 0) { 
  "All skills in catalog!" 
} else { 
  "MISSING FROM CATALOG: $($missing -join ', ')" 
}
```

**Expected:** 
- Catalog count accurate: 74 skills
- All skills in catalog!

**This phase validates:**
- Skill count matches actual folder count
- All skills appear in Subgraph Index table
- No orphaned skills missing from documentation

### Phase 10: Mermaid Detection in Core Files

Core cognitive files (copilot-instructions.md) should use tables, not mermaid diagrams. LLMs parse tables more efficiently than visual diagrams.

```powershell
$coreFiles = @(
  ".github\copilot-instructions.md",
  "platforms\vscode-extension\.github\copilot-instructions.md"
)
$hasMermaid = @()
foreach ($file in $coreFiles) {
  if (Test-Path $file) {
    $content = Get-Content $file -Raw
    if ($content -match '```mermaid') {
      $hasMermaid += $file
    }
  }
}
if ($hasMermaid.Count -eq 0) { 
  "Phase 10: No mermaid in core files!" 
} else { 
  "MERMAID FOUND: $($hasMermaid -join ', ')" 
}
```

**Expected:** Phase 10: No mermaid in core files!

**Rationale:** Mermaid is for human documentation (alex_docs/), not LLM consumption. Tables compress better into context and parse faster.

### Phase 11: Boilerplate Skill Descriptions

Detect skills with low-quality placeholder descriptions:

```powershell
$boilerplate = @()
Get-ChildItem ".github\skills" -Directory | ForEach-Object {
  $skill = $_.Name
  $skillMd = Join-Path $_.FullName "SKILL.md"
  if (Test-Path $skillMd) {
    $content = Get-Content $skillMd -Raw
    # Match "Skill for alex X skill" pattern
    if ($content -match 'description:\s*"Skill for alex .+ skill"') {
      $boilerplate += $skill
    }
  }
}
if ($boilerplate.Count -eq 0) { 
  "Phase 11: No boilerplate descriptions!" 
} else { 
  "BOILERPLATE ($($boilerplate.Count)): $($boilerplate -join ', ')" 
}
```

**Expected:** Phase 11: No boilerplate descriptions!

**Action:** Replace placeholder descriptions with meaningful summaries of skill capabilities.

### Phase 12: Heir Reset Validation (Pre-Publish)

Verify the heir is properly generalized before packaging:

```powershell
$heirBase = "platforms\vscode-extension"
$issues = @()

# Check 1: user-profile.json has empty name
$profile = Get-Content "$heirBase\.github\config\user-profile.json" | ConvertFrom-Json
if ($profile.name -ne "") { $issues += "user-profile.json has non-empty name: '$($profile.name)'" }
if ($profile.nickname -ne "") { $issues += "user-profile.json has non-empty nickname: '$($profile.nickname)'" }

# Check 2: P5-P7 slots show *(available)*
$copilot = Get-Content "$heirBase\.github\copilot-instructions.md" -Raw
if ($copilot -notmatch '\*\*P5\*\*.*\*\(available\)\*') { $issues += "P5 slot not marked as (available)" }
if ($copilot -notmatch '\*\*P6\*\*.*\*\(available\)\*') { $issues += "P6 slot not marked as (available)" }
if ($copilot -notmatch '\*\*P7\*\*.*\*\(available\)\*') { $issues += "P7 slot not marked as (available)" }

# Check 3: No hardcoded user names
$names = Select-String -Path "$heirBase\.github\copilot-instructions.md" -Pattern "Fabio|Correa|Calefato|Cardoso" -AllMatches
if ($names.Count -gt 0) { $issues += "Found hardcoded names in copilot-instructions.md" }

# Check 4: No broken links in heir copilot-instructions
$brokenLinks = Select-String -Path "$heirBase\.github\copilot-instructions.md" -Pattern "\.\./RISKS\.md|alex_docs/research/" -AllMatches
if ($brokenLinks.Count -gt 0) { $issues += "Found Master-only links in heir copilot-instructions.md" }

if ($issues.Count -eq 0) { 
  "Phase 12: Heir properly reset for publication!" 
} else { 
  "HEIR NOT RESET:`n  - $($issues -join '`n  - ')" 
}
```

**Expected:** Phase 12: Heir properly reset for publication!

**Rationale:** Before packaging, the heir must be generalized:
- Empty user profile (users populate on first use)
- P5-P7 domain slots available (not Master-specific roles)
- No hardcoded names or Master-only file references

### Phase 13: Instructions/Prompts Sync

Verify procedural and episodic memory files are synced (excluding Master-only):

```powershell
$masterOnly = @("brand-asset-management.instructions.md")  # Intentionally Master-only
$mi = (Get-ChildItem ".github\instructions\*.md").Name | Where-Object { $_ -notin $masterOnly } | Sort-Object
$hi = (Get-ChildItem "platforms\vscode-extension\.github\instructions\*.md").Name | Sort-Object
$diff = Compare-Object $mi $hi
$mp = (Get-ChildItem ".github\prompts\*.md").Name | Sort-Object
$hp = (Get-ChildItem "platforms\vscode-extension\.github\prompts\*.md").Name | Sort-Object
$diffP = Compare-Object $mp $hp
if ($diff.Count -eq 0 -and $diffP.Count -eq 0) { 
  "Phase 13: Instructions/Prompts in sync!" 
} else { 
  $missing = @()
  $diff | Where-Object { $_.SideIndicator -eq "<=" } | ForEach-Object { $missing += "instructions/$($_.InputObject)" }
  $diffP | Where-Object { $_.SideIndicator -eq "<=" } | ForEach-Object { $missing += "prompts/$($_.InputObject)" }
  "MISSING FROM HEIR: $($missing -join ', ')"
}
```

**Expected:** Phase 13: Instructions/Prompts in sync!

**Master-only files (excluded from sync):**
- `brand-asset-management.instructions.md` - Master branding procedures

### Phase 14: Agents Structure Validation

Verify agent files exist and have valid structure:

```powershell
$issues = @()
$agents = Get-ChildItem ".github\agents\*.md" -ErrorAction SilentlyContinue
if ($agents.Count -eq 0) { 
  $issues += "No agents found" 
} else {
  foreach ($agent in $agents) {
    $content = Get-Content $agent.FullName -Raw
    if ($content -notmatch '^---') { $issues += "$($agent.Name): Missing YAML frontmatter" }
    if ($content -notmatch 'name:') { $issues += "$($agent.Name): Missing name field" }
  }
}
# Compare Master-Heir
$ma = (Get-ChildItem ".github\agents\*.md" -EA SilentlyContinue).Name | Sort-Object
$ha = (Get-ChildItem "platforms\vscode-extension\.github\agents\*.md" -EA SilentlyContinue).Name | Sort-Object
$diffA = Compare-Object $ma $ha -EA SilentlyContinue
if ($diffA) { $issues += "Agent count mismatch: Master=$($ma.Count), Heir=$($ha.Count)" }

if ($issues.Count -eq 0) { 
  "Phase 14: Agents valid ($($agents.Count) agents)" 
} else { 
  "AGENT ISSUES: $($issues -join ', ')" 
}
```

**Expected:** Phase 14: Agents valid (3 agents)

### Phase 15: Config Files Validation

Verify required config files exist with valid JSON:

```powershell
$required = @("user-profile.json", "USER-PROFILE.md")  # Required in heir
$masterOnly = @("MASTER-ALEX-PROTECTED.json", "cognitive-config.json")  # Master-only
$issues = @()

# Check heir has required configs
foreach ($cfg in $required) {
  $path = "platforms\vscode-extension\.github\config\$cfg"
  if (-not (Test-Path $path)) { $issues += "Missing: $cfg" }
  elseif ($cfg -match '\.json$') {
    try { Get-Content $path -Raw | ConvertFrom-Json | Out-Null }
    catch { $issues += "Invalid JSON: $cfg" }
  }
}

# Verify Master-only files NOT in heir
foreach ($cfg in $masterOnly) {
  $path = "platforms\vscode-extension\.github\config\$cfg"
  if (Test-Path $path) { $issues += "Master-only file leaked to heir: $cfg" }
}

if ($issues.Count -eq 0) { 
  "Phase 15: Config files valid!" 
} else { 
  "CONFIG ISSUES: $($issues -join ', ')" 
}
```

**Expected:** Phase 15: Config files valid!

## Repair Actions

### Fix Broken Synapses

1. **Typos in target paths:** Update to correct skill/file name
2. **Missing prefixes:** Add `.github/instructions/` or `.github/prompts/` prefixes
3. **Aspirational references:** Remove connections to planned-but-not-created skills
4. **Heir-specific content:** Remove project-specific references from Master

### Normalize Legacy Synapse Format

For heir-created skills with legacy format (string strengths, old field names):

```powershell
# Run upgrade command in VS Code - it normalizes all synapses automatically
# Or manually normalize a single synapse file:

$strengthMap = @{ "critical" = 1.0; "strong" = 0.9; "high" = 0.9; "moderate" = 0.7; "medium" = 0.7; "low" = 0.5 }
$file = ".github/skills/my-skill/synapses.json"
$json = Get-Content $file -Raw | ConvertFrom-Json

# Rename arrays
if ($json.synapses) { $json | Add-Member -NotePropertyName connections -NotePropertyValue $json.synapses; $json.PSObject.Properties.Remove('synapses') }
if ($json.activationKeywords) { $json | Add-Member -NotePropertyName activationContexts -NotePropertyValue $json.activationKeywords; $json.PSObject.Properties.Remove('activationKeywords') }

# Convert string strengths to numeric
foreach ($conn in $json.connections) { 
  if ($conn.strength -is [string]) { 
    $conn.strength = $strengthMap[$conn.strength.ToLower()] 
  } 
}

$json | ConvertTo-Json -Depth 10 | Set-Content $file
```

**Preferred:** Use 'Alex: Upgrade' command which normalizes all heir-created skill synapses automatically.

### Sync Master → Heir

```powershell
# Sync all synapses.json
Get-ChildItem ".github\skills" -Directory | ForEach-Object {
  $skill = $_.Name
  $src = Join-Path $_.FullName "synapses.json"
  $dst = "platforms\vscode-extension\.github\skills\$skill\synapses.json"
  if ((Test-Path $src) -and (Test-Path $dst)) {
    Copy-Item $src $dst -Force
    "Synced: $skill"
  }
}
```

## Common Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| Path typo | Target like `architecture` instead of `architecture-audit` | Update to correct skill name |
| Missing prefix | Relative path `bootstrap-learning.instructions.md` | Add `.github/instructions/` prefix |
| Heir leak | Project-specific skill in Master | Remove or generalize |
| Stale sync | Hash mismatch between Master and Heir | Copy Master → Heir |
| Unindexed skill | Skill exists but not in skill-activation | Add to index table |
| Legacy format | String strengths like `"strong"` instead of `0.9` | Run 'Alex: Upgrade' or normalize manually |
| Missing $schema | Synapse file has no schema reference | Add `"$schema": "../SYNAPSE-SCHEMA.json"` |
| Catalog count mismatch | SKILLS-CATALOG.md count differs from actual | Update catalog count |
| Missing from catalog | Skill not in Subgraph Index table | Add skill to appropriate category |
| Master-only links in heir | `../RISKS.md` or `alex_docs/research/` in heir copilot-instructions | Replace with inline text or remove |
| Absolute skill paths | `.github/skills/X/SKILL.md` in skill files | Use relative `../X/SKILL.md` |
| Heir synapse Master paths | Synapse targets like `ROADMAP-UNIFIED.md` in heir | Remove Master-only targets or adjust paths |
| Hardcoded names in heir | User name "Fabio" in heir copilot-instructions | Replace with generic text |
| Non-empty heir slots | P5-P7 show specific domains instead of `*(available)*` | Clear to `*(available)*` before publish |
| Missing instruction sync | Instruction file in Master not in heir | Copy to heir (unless Master-only) |

## Integration with Dream Protocol

Brain QA can be triggered as part of `dream` maintenance:

1. Run standard dream (synapse validation)
2. If issues found → run Brain QA for deeper analysis
3. Repair and re-validate

## Triggers

- "brain qa", "brain audit"
- "validate brain", "check brain health"
- "synapse audit", "deep synapse check"
- "trigger audit", "skill index check"
- "master heir sync", "heir sync validation"
- "catalog validation", "verify catalog", "catalog accuracy"
- "instruction sync", "prompts sync", "memory sync"
- "agent validation", "config validation"

---

*A meditative practice for maintaining cognitive architecture integrity.*
