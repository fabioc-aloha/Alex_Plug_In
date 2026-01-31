# Master Alex Audit

> Master-specific audit extensions building on generic architecture-audit skill

## Overview

**Extends:** [architecture-audit](../architecture-audit/SKILL.md)

Master Alex-specific audit procedures that leverage knowledge of:
- Exact folder structure and file locations
- Heir relationships (VS Code extension, M365 agent)
- Safety imperatives and protection mechanisms
- Build/release workflows
- Platform-specific configurations

**NOT INHERITABLE** - Contains Master-specific paths and configurations.

## Triggers

- "master audit", "full audit"
- "heir sync check", "platform alignment"
- "pre-release master check"
- Before publishing heirs to marketplace

## Master-Specific Audit Points

### 1. Version Alignment Across Platforms

Master Alex must maintain version consistency across all platforms:

```powershell
# Canonical version sources
$versionFiles = @{
    "Master" = "platforms/vscode-extension/package.json"
    "Copilot Instructions" = ".github/copilot-instructions.md"
    "M365 Agent" = "platforms/m365-copilot/appPackage/declarativeAgent.json"
    "Changelog" = "CHANGELOG.md"
}

# Extract and compare versions
foreach ($source in $versionFiles.GetEnumerator()) {
    $content = Get-Content $source.Value -Raw
    $version = [regex]::Match($content, '(?:version["\s:]+|Version:\s*|##\s*\[?v?)(\d+\.\d+\.\d+)').Groups[1].Value
    Write-Host "$($source.Key): v$version"
}
```

**Expected State:** All show same version (currently v3.7.3)

### 2. Heir Folder Sync Status

Check that heirs have current copies of inheritable content:

```powershell
# Files that should be synced to heirs
$syncTargets = @(
    @{
        Source = ".github/copilot-instructions.md"
        Heirs = @(
            "platforms/vscode-extension/.github/copilot-instructions.md"
        )
    },
    @{
        Source = ".github/instructions/"
        Heirs = @(
            "platforms/vscode-extension/.github/instructions/"
        )
    },
    @{
        Source = ".github/prompts/"
        Heirs = @(
            "platforms/vscode-extension/.github/prompts/"
        )
    }
)

# Compare file counts and modification dates
foreach ($target in $syncTargets) {
    $sourceCount = (Get-ChildItem $target.Source -Recurse -File).Count
    foreach ($heir in $target.Heirs) {
        if (Test-Path $heir) {
            $heirCount = (Get-ChildItem $heir -Recurse -File).Count
            $diff = $sourceCount - $heirCount
            Write-Host "$($target.Source) -> $heir : $($diff) file difference"
        } else {
            Write-Host "$heir MISSING"
        }
    }
}
```

### 3. Skill Inheritance Audit

Verify inheritable skills are properly deployed to heirs:

```powershell
# Get inheritable skills from catalog
$catalog = Get-Content "alex_docs/SKILLS-CATALOG.md" -Raw
$inheritable = [regex]::Matches($catalog, '\|\s*(\w+-\w+(?:-\w+)*)\s*\|[^|]*\|[^|]*\|\s*✅\s*\|') |
    ForEach-Object { $_.Groups[1].Value }

Write-Host "Inheritable skills: $($inheritable.Count)"

# Check heir skill folders
$heirSkills = Get-ChildItem "platforms/vscode-extension/.github/skills" -Directory |
    Select-Object -ExpandProperty Name

$missing = $inheritable | Where-Object { $_ -notin $heirSkills }
if ($missing) {
    Write-Host "⚠️ Missing from heir: $($missing -join ', ')"
}
```

### 4. Safety Imperative Validation

Verify protection mechanisms are in place:

```powershell
# Critical protection files
$protectionChecks = @(
    @{
        File = ".github/config/MASTER-ALEX-PROTECTED.json"
        Check = '"protected": true'
        Purpose = "Kill switch marker"
    },
    @{
        File = ".vscode/settings.json"
        Check = '"alex.workspace.protectedMode": true'
        Purpose = "Workspace protection setting"
    },
    @{
        File = "platforms/vscode-extension/.vscodeignore"
        Check = "MASTER-ALEX-PROTECTED.json"
        Purpose = "Marker excluded from package"
    }
)

foreach ($check in $protectionChecks) {
    if (Test-Path $check.File) {
        $content = Get-Content $check.File -Raw
        $found = $content -match [regex]::Escape($check.Check)
        $status = if ($found) { "✅" } else { "❌ MISSING" }
        Write-Host "$status $($check.Purpose): $($check.File)"
    } else {
        Write-Host "❌ FILE MISSING: $($check.File)"
    }
}
```

### 5. Build Artifact Verification

Ensure extension package is buildable:

```powershell
cd "platforms/vscode-extension"

# Check TypeScript compiles
npm run compile 2>&1 | Select-Object -Last 5

# Check package.json validity
$pkg = Get-Content "package.json" | ConvertFrom-Json
Write-Host "Extension: $($pkg.name) v$($pkg.version)"
Write-Host "Commands: $($pkg.contributes.commands.Count)"
Write-Host "Tools: $($pkg.contributes.'languageModelTools'.Count)"

# Verify dist exists and is recent
$dist = Get-Item "dist/extension.js" -ErrorAction SilentlyContinue
if ($dist) {
    $age = (Get-Date) - $dist.LastWriteTime
    Write-Host "dist/extension.js age: $([int]$age.TotalMinutes) minutes"
} else {
    Write-Host "⚠️ dist/extension.js not found - run 'npm run compile'"
}
```

### 6. Documentation Cross-Reference Check

Validate key documentation references:

```powershell
# Key cross-references that must exist
$requiredRefs = @(
    @{ Doc = "README.md"; MustLink = "alex_docs/USER-MANUAL.md" },
    @{ Doc = "README.md"; MustLink = "CHANGELOG.md" },
    @{ Doc = ".github/copilot-instructions.md"; MustLink = "RISKS.md" },
    @{ Doc = "RISKS.md"; MustLink = "COMEBACK-PLAN.md" }
)

foreach ($ref in $requiredRefs) {
    $content = Get-Content $ref.Doc -Raw
    $found = $content -match [regex]::Escape($ref.MustLink)
    $status = if ($found) { "✅" } else { "⚠️" }
    Write-Host "$status $($ref.Doc) -> $($ref.MustLink)"
}
```

### 7. Synapse Network Health

Validate cognitive architecture connections:

```powershell
# Run built-in synapse validation
# In VS Code: "Alex: Dream (Neural Maintenance)"

# Or manual check
$synapseFiles = Get-ChildItem ".github/skills/*/synapses.json" -Recurse
Write-Host "Synapse files found: $($synapseFiles.Count)"

# Check for broken connections
$allSkills = Get-ChildItem ".github/skills" -Directory | Select-Object -ExpandProperty Name
foreach ($file in $synapseFiles) {
    $synapses = Get-Content $file | ConvertFrom-Json
    foreach ($conn in $synapses.connections) {
        if ($conn.target -notin $allSkills) {
            Write-Host "⚠️ Broken synapse in $($file.Directory.Name): $($conn.target)"
        }
    }
}
```

### 8. alex_docs Documentation Audit

Comprehensive check of the documentation folder:

```powershell
# === alex_docs AUDIT ===
$alexDocs = "alex_docs"
$issues = @()

# 8a. Version references - should all match current version
Write-Host "`n--- Version References ---"
$currentVersion = "3.7.3"
$versionRefs = Select-String -Path "$alexDocs/*.md" -Pattern '\d+\.\d+\.\d+' -AllMatches
$wrongVersions = $versionRefs | Where-Object { $_.Matches.Value -ne $currentVersion -and $_.Matches.Value -match '^\d+\.\d+\.\d+$' }
if ($wrongVersions) {
    Write-Host "⚠️ Non-current versions found:"
    $wrongVersions | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber) - $($_.Matches.Value)" }
    $issues += "Version drift in alex_docs"
} else {
    Write-Host "✅ All version references current"
}

# 8b. Deprecated terminology
Write-Host "`n--- Deprecated Terms ---"
$deprecated = @(
    @{ Term = 'DK-\*.md'; Replacement = 'skills/*/SKILL.md' },
    @{ Term = 'domain-knowledge/'; Replacement = 'skills/' },
    @{ Term = 'domain knowledge'; Replacement = 'skills' }
)
foreach ($dep in $deprecated) {
    $found = Select-String -Path "$alexDocs/*.md" -Pattern $dep.Term -SimpleMatch
    if ($found) {
        Write-Host "⚠️ '$($dep.Term)' found (use '$($dep.Replacement)'):"
        $found | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber)" }
        $issues += "Deprecated term: $($dep.Term)"
    }
}
if ($issues.Count -eq 0) { Write-Host "✅ No deprecated terms" }

# 8c. Skill count accuracy in docs
Write-Host "`n--- Skill Count Accuracy ---"
$actualSkillCount = (Get-ChildItem ".github/skills" -Directory).Count
$docSkillCounts = Select-String -Path "$alexDocs/*.md" -Pattern '(\d+)\s*skills?' -AllMatches
$wrongCounts = $docSkillCounts | Where-Object {
    $_.Matches | Where-Object { [int]$_.Groups[1].Value -ne $actualSkillCount -and [int]$_.Groups[1].Value -gt 30 }
}
if ($wrongCounts) {
    Write-Host "⚠️ Incorrect skill counts (actual: $actualSkillCount):"
    $wrongCounts | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber) - $($_.Line.Trim())" }
    $issues += "Skill count mismatch"
} else {
    Write-Host "✅ Skill counts accurate"
}

# 8d. Broken internal links
Write-Host "`n--- Internal Links ---"
$mdFiles = Get-ChildItem "$alexDocs/*.md"
$brokenLinks = @()
foreach ($file in $mdFiles) {
    $content = Get-Content $file -Raw
    $links = [regex]::Matches($content, '\[([^\]]+)\]\(([^)]+)\)') | Where-Object { $_.Groups[2].Value -notmatch '^https?://' }
    foreach ($link in $links) {
        $target = $link.Groups[2].Value -replace '#.*$', ''  # Remove anchors
        if ($target -and -not (Test-Path (Join-Path $alexDocs $target)) -and -not (Test-Path $target)) {
            $brokenLinks += "$($file.Name): $($link.Groups[2].Value)"
        }
    }
}
if ($brokenLinks) {
    Write-Host "⚠️ Broken links:"
    $brokenLinks | ForEach-Object { Write-Host "  $_" }
    $issues += "Broken internal links"
} else {
    Write-Host "✅ All internal links valid"
}

# 8e. Diagram accuracy (Mermaid node counts)
Write-Host "`n--- Diagram Checks ---"
$catalogDiagram = Select-String -Path "$alexDocs/SKILLS-CATALOG.md" -Pattern '\[[\w-]+\]' -AllMatches
$diagramNodes = ($catalogDiagram.Matches | Select-Object -ExpandProperty Value | Sort-Object -Unique).Count
Write-Host "Skill network diagram nodes: $diagramNodes (actual skills: $actualSkillCount)"
if ([Math]::Abs($diagramNodes - $actualSkillCount) -gt 2) {
    Write-Host "⚠️ Diagram may be out of sync"
    $issues += "Diagram node count mismatch"
} else {
    Write-Host "✅ Diagram appears current"
}

# Summary
Write-Host "`n--- alex_docs SUMMARY ---"
if ($issues.Count -eq 0) {
    Write-Host "✅ All checks passed" -ForegroundColor Green
} else {
    Write-Host "⚠️ Issues found: $($issues.Count)" -ForegroundColor Yellow
    $issues | ForEach-Object { Write-Host "  - $_" }
}
```

### 9. Skill Network Diagram Audit

Deep validation of the Mermaid skill network diagram in SKILLS-CATALOG.md:

```powershell
# === SKILL NETWORK DIAGRAM AUDIT ===
$catalogFile = "alex_docs/SKILLS-CATALOG.md"
$catalogContent = Get-Content $catalogFile -Raw
$issues = @()

# 9a. Extract all actual skills
$actualSkills = Get-ChildItem ".github/skills" -Directory | Select-Object -ExpandProperty Name
Write-Host "Actual skills: $($actualSkills.Count)"

# 9b. Extract diagram nodes (format: ABBREV[skill-name])
$nodePattern = '(\w+)\[([\w-]+)\]'
$diagramNodes = [regex]::Matches($catalogContent, $nodePattern)
$nodeMap = @{}
foreach ($match in $diagramNodes) {
    $abbrev = $match.Groups[1].Value
    $skillName = $match.Groups[2].Value
    $nodeMap[$skillName] = $abbrev
}
Write-Host "Diagram nodes: $($nodeMap.Count)"

# 9c. Skills missing from diagram
$missingFromDiagram = $actualSkills | Where-Object { $_ -notin $nodeMap.Keys }
if ($missingFromDiagram) {
    Write-Host "`n⚠️ Skills MISSING from diagram:"
    $missingFromDiagram | ForEach-Object { Write-Host "  - $_" }
    $issues += "Missing from diagram: $($missingFromDiagram -join ', ')"
} else {
    Write-Host "✅ All skills have diagram nodes"
}

# 9d. Phantom nodes (in diagram but not actual skills)
$phantomNodes = $nodeMap.Keys | Where-Object { $_ -notin $actualSkills }
if ($phantomNodes) {
    Write-Host "`n⚠️ PHANTOM nodes (skill doesn't exist):"
    $phantomNodes | ForEach-Object { Write-Host "  - $_ ($($nodeMap[$_]))" }
    $issues += "Phantom nodes: $($phantomNodes -join ', ')"
} else {
    Write-Host "✅ No phantom nodes"
}

# 9e. Check class assignments match inheritance
# Extract class definitions
$masterClass = [regex]::Match($catalogContent, 'class\s+([\w,]+)\s+master').Groups[1].Value -split ','
$inheritableClass = [regex]::Match($catalogContent, 'class\s+([\w,]+)\s+inheritable').Groups[1].Value -split ','
$vscodeClass = [regex]::Match($catalogContent, 'class\s+([\w,]+)\s+vscode').Groups[1].Value -split ','
$m365Class = [regex]::Match($catalogContent, 'class\s+([\w,]+)\s+m365').Groups[1].Value -split ','

Write-Host "`nClass assignments:"
Write-Host "  Master: $($masterClass.Count) nodes"
Write-Host "  Inheritable: $($inheritableClass.Count) nodes"
Write-Host "  VS Code: $($vscodeClass.Count) nodes"
Write-Host "  M365: $($m365Class.Count) nodes"

# 9f. Verify master-only skills are in master class
$masterOnlySkills = @(
    'meditation', 'meditation-facilitation', 'knowledge-synthesis', 'global-knowledge',
    'architecture-refinement', 'llm-model-selection', 'self-actualization', 'heir-curation',
    'master-alex-audit'
)
$masterAbbrevs = $masterOnlySkills | ForEach-Object { $nodeMap[$_] } | Where-Object { $_ }
$missingMasterClass = $masterAbbrevs | Where-Object { $_ -notin $masterClass }
if ($missingMasterClass) {
    Write-Host "`n⚠️ Master-only skills not in master class:"
    $missingMasterClass | ForEach-Object { Write-Host "  - $_" }
    $issues += "Master class mismatch"
}

# 9g. Check for orphan nodes (no connections)
$connectionPattern = '(\w+)\s*(?:-->|<-->|-.->)\s*'
$connectedNodes = [regex]::Matches($catalogContent, $connectionPattern) |
    ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
$allAbbrevs = $nodeMap.Values | Sort-Object -Unique
$orphans = $allAbbrevs | Where-Object { $_ -notin $connectedNodes -and $_ -ne 'BT' }  # BT is temp, may be orphan
if ($orphans) {
    Write-Host "`n⚠️ Orphan nodes (no connections):"
    $orphans | ForEach-Object {
        $skill = ($nodeMap.GetEnumerator() | Where-Object { $_.Value -eq $_ }).Key
        Write-Host "  - $_ ($skill)"
    }
    $issues += "Orphan nodes: $($orphans -join ', ')"
} else {
    Write-Host "✅ All nodes connected"
}

# Summary
Write-Host "`n--- DIAGRAM AUDIT SUMMARY ---"
if ($issues.Count -eq 0) {
    Write-Host "✅ Diagram is accurate" -ForegroundColor Green
} else {
    Write-Host "⚠️ Diagram issues: $($issues.Count)" -ForegroundColor Yellow
    $issues | ForEach-Object { Write-Host "  - $_" }
}
```

**Quick diagram check command:**

```powershell
# One-liner to compare skill count vs diagram nodes
$skills = (Get-ChildItem ".github/skills" -Directory).Count
$nodes = ([regex]::Matches((Get-Content "alex_docs/SKILLS-CATALOG.md" -Raw), '\w+\[[\w-]+\]') | Select-Object -ExpandProperty Value | Sort-Object -Unique).Count
Write-Host "Skills: $skills | Diagram nodes: $nodes | $(if($skills -eq $nodes){'✅ MATCH'}else{'⚠️ MISMATCH'})"
```

**Key files to audit:**

| File | Key Checks |
|------|------------|
| `SKILLS-CATALOG.md` | Skill count, network diagram, inheritance table |
| `COGNITIVE-ARCHITECTURE.md` | Version, component counts |
| `USER-MANUAL.md` | Command list, feature descriptions |
| `PROJECT-STRUCTURE.md` | Folder structure accuracy |
| `MEMORY-SYSTEMS.md` | Memory type descriptions |

## Consistency Reference (What Must Match)

### Version Numbers
These locations must all show the same version:

| Location | File | Pattern |
|----------|------|---------|
| Package.json | `platforms/vscode-extension/package.json` | `"version": "X.Y.Z"` |
| Copilot Instructions | `.github/copilot-instructions.md` | `**Version**: X.Y.Z` |
| M365 Agent | `platforms/m365-copilot/appPackage/declarativeAgent.json` | `"version": "X.Y.Z"` |
| Changelog | `CHANGELOG.md` | `## [X.Y.Z]` (latest) |
| Quick Reference | `alex_docs/QUICK-REFERENCE.md` | Version table |

**Note:** Historical files (`UPGRADE-MIGRATION-PLAN.md`, `VSCODE-EXTENSIONS-ANALYSIS.md`) may have old versions - that's OK if they're documenting history.

### Skill Count
These locations must show the actual skill count:

| Location | File | Pattern |
|----------|------|---------|
| Copilot Instructions | `.github/copilot-instructions.md` | In stats section |
| Skills Catalog | `alex_docs/SKILLS-CATALOG.md` | `## Skill Count: N` |
| Cognitive Architecture | `alex_docs/COGNITIVE-ARCHITECTURE.md` | Skills mention |
| Quick Reference | `alex_docs/QUICK-REFERENCE.md` | Skills summary |
| Network Diagram | `alex_docs/SKILLS-CATALOG.md` | Mermaid nodes |

**Current:** 47 skills (check with `(Get-ChildItem ".github/skills" -Directory).Count`)

### MCP Tool Count
| Location | File | Pattern |
|----------|------|---------|
| Package.json | `platforms/vscode-extension/package.json` | `contributes.languageModelTools` |
| User Manual | `alex_docs/USER-MANUAL.md` | Tools section |
| Copilot Instructions | `.github/copilot-instructions.md` | Stats |

**Current:** 11 tools

### Command Count
| Location | File | Pattern |
|----------|------|---------|
| Package.json | `platforms/vscode-extension/package.json` | `contributes.commands` |
| User Manual | `alex_docs/USER-MANUAL.md` | Commands section |

**Current:** Check with `(Get-Content "platforms/vscode-extension/package.json" | ConvertFrom-Json).contributes.commands.Count`

### Identity/Name Consistency
| Term | Correct Form | Incorrect Forms |
|------|--------------|-----------------|
| Product name | Alex Cognitive Architecture | Alex Extension, Alex Plugin |
| Short name | Alex | ALEX, alex (in headings) |
| Extension ID | `fabioc-aloha.alex-cognitive-architecture` | Any variation |
| Publisher | fabioc-aloha | fabioc, aloha |

### Deprecated Terms (Never Use)
| Deprecated | Replacement | Reason |
|------------|-------------|--------|
| `DK-*.md` | `skills/*/SKILL.md` | Format migration 2026-01 |
| `domain-knowledge/` | `skills/` | Folder rename |
| `domain knowledge files` | `skills` | Terminology update |

**Exception:** Historical documentation (migration guides, upgrade plans) may reference deprecated terms when explaining the migration.

### File Path Consistency
| Logical Location | Actual Path |
|------------------|-------------|
| Master copilot instructions | `.github/copilot-instructions.md` |
| Skills folder | `.github/skills/` |
| Instructions folder | `.github/instructions/` |
| Prompts folder | `.github/prompts/` |
| VS Code extension | `platforms/vscode-extension/` |
| M365 agent | `platforms/m365-copilot/` |
| Documentation | `alex_docs/` |
| Protection marker | `.github/config/MASTER-ALEX-PROTECTED.json` |

### Diagram Node Abbreviations
The skill network diagram uses these abbreviations:

| Abbrev | Skill |
|--------|-------|
| BL | bootstrap-learning |
| LP | learning-psychology |
| CL | cognitive-load |
| AR | appropriate-reliance |
| AH | architecture-health |
| AAU | architecture-audit |
| MAA | master-alex-audit |
| HC | heir-curation |
| MED | meditation |
| SA | self-actualization |
| ... | (see SKILLS-CATALOG.md for full list) |

## Master Audit Report Template

```markdown
# Master Alex Audit Report
**Date:** {{DATE}}
**Version:** {{VERSION}}
**Auditor:** Alex + {{USER}}

## Summary
| Check | Status | Notes |
|-------|--------|-------|
| Version Alignment | ✅/⚠️/❌ | |
| Heir Sync | ✅/⚠️/❌ | |
| Skill Inheritance | ✅/⚠️/❌ | |
| Safety Imperatives | ✅/⚠️/❌ | |
| Build Artifacts | ✅/⚠️/❌ | |
| Documentation Refs | ✅/⚠️/❌ | |
| Synapse Health | ✅/⚠️/❌ | |
| alex_docs Audit | ✅/⚠️/❌ | |

## Detailed Findings

### Critical Issues (Must Fix)
-

### Warnings (Should Fix)
-

### Observations (Nice to Have)
-

## Actions Taken
1.
2.

## Next Steps
-
```

## Quick Master Audit Commands

Copy-paste ready audit sequence:

```powershell
# === MASTER ALEX QUICK AUDIT ===
cd "C:\Development\Alex_Plug_In"

# 1. Git status
Write-Host "`n=== GIT STATUS ===" -ForegroundColor Cyan
git status --short

# 2. Version check
Write-Host "`n=== VERSION CHECK ===" -ForegroundColor Cyan
$pkgVersion = (Get-Content "platforms/vscode-extension/package.json" | ConvertFrom-Json).version
$copilotVersion = [regex]::Match((Get-Content ".github/copilot-instructions.md" -Raw), '\*\*Version\*\*:\s*(\d+\.\d+\.\d+)').Groups[1].Value
Write-Host "Package: v$pkgVersion"
Write-Host "Copilot: v$copilotVersion"
if ($pkgVersion -eq $copilotVersion) { Write-Host "✅ Versions match" -ForegroundColor Green }
else { Write-Host "❌ Version mismatch!" -ForegroundColor Red }

# 3. Protection check
Write-Host "`n=== PROTECTION CHECK ===" -ForegroundColor Cyan
$protected = Test-Path ".github/config/MASTER-ALEX-PROTECTED.json"
Write-Host "Kill switch marker: $(if($protected){'✅'}else{'❌'})"

# 4. Skill count
Write-Host "`n=== SKILL COUNT ===" -ForegroundColor Cyan
$skillCount = (Get-ChildItem ".github/skills" -Directory).Count
Write-Host "Skills: $skillCount"

# 5. Build freshness
Write-Host "`n=== BUILD STATUS ===" -ForegroundColor Cyan
$dist = Get-Item "platforms/vscode-extension/dist/extension.js" -ErrorAction SilentlyContinue
if ($dist) {
    $age = [int]((Get-Date) - $dist.LastWriteTime).TotalHours
    Write-Host "Build age: $age hours"
} else {
    Write-Host "⚠️ No build found"
}

Write-Host "`n=== AUDIT COMPLETE ===" -ForegroundColor Green
```

## Synapses

See [synapses.json](synapses.json) for connections to:
- `architecture-audit` (extends) - Generic audit foundation
- `release-preflight` - Pre-release verification
- `heir-curation` - Heir management
- `architecture-health` - Structural integrity
- `vscode-extension-patterns` - Extension-specific knowledge
