---
name: "Heir Cognitive System Curation Skill"
description: "Curating Alex heirs using synapses.json inheritance as source of truth"
---

# Heir Cognitive System Curation Skill

Expert in curating the initial state of Alex heirs (VS Code Extension, M365 Copilot) using the **synapses.json inheritance field as the single source of truth**.

## Core Principle

**The `inheritance` field in each skill's `synapses.json` determines whether it ships to heirs.**

No hardcoded lists. No manual tracking. The brain knows what belongs where.

## Inheritance Model

Each skill's `synapses.json` has an `inheritance` field with one of these values:

| Value | Meaning |
|-------|---------|
| `inheritable` | Ships to ALL heirs |
| `master-only` | Stays in Master Alex only |
| `universal` | Ships everywhere (core infrastructure) |
| `heir:vscode` | VS Code extension heir only |
| `heir:m365` | M365 Copilot heir only |

## Scripts

Use the pre-made scripts in `scripts/` folder:

| Script | Purpose | Usage |
|--------|---------|-------|
| `sync-master-to-heir.ps1` | Role-adapted sync based on inheritance | `.\scripts\sync-master-to-heir.ps1 -Heir vscode` |
| `validate-synapses.ps1` | Validate all synapses.json files | `.\scripts\validate-synapses.ps1` |
| `validate-skills.ps1` | Validate SKILL.md frontmatter | `.\scripts\validate-skills.ps1` |
| `build-extension-package.ps1` | Build heir package | `.\scripts\build-extension-package.ps1` |

### Quick Commands

```powershell
# Sync to VS Code heir (dry run first)
.\scripts\sync-master-to-heir.ps1 -Heir vscode -DryRun

# Sync to VS Code heir (execute)
.\scripts\sync-master-to-heir.ps1 -Heir vscode

# Validate all synapses
.\scripts\validate-synapses.ps1

# Validate skills
.\scripts\validate-skills.ps1

# Build extension
.\scripts\build-extension-package.ps1
```

## Query Commands

For ad-hoc inheritance queries:

```powershell
# Count by inheritance type
Get-ChildItem ".github/skills" -Directory | ForEach-Object {
    $synapse = Join-Path $_.FullName "synapses.json"
    if (Test-Path $synapse) {
        (Get-Content $synapse -Raw | ConvertFrom-Json).inheritance
    }
} | Group-Object | Select-Object Name, Count | Sort-Object Count -Descending

# Find master-only skills
Get-ChildItem ".github/skills" -Directory | ForEach-Object {
    $synapse = Join-Path $_.FullName "synapses.json"
    if (Test-Path $synapse) {
        $json = Get-Content $synapse -Raw | ConvertFrom-Json
        if ($json.inheritance -eq "master-only") { $_.Name }
    }
}

# Change a skill's inheritance
$skill = "skill-name"; $newValue = "inheritable"
$path = ".github/skills/$skill/synapses.json"
$json = Get-Content $path -Raw | ConvertFrom-Json
$json.inheritance = $newValue
$json | ConvertTo-Json -Depth 10 | Set-Content $path -Encoding UTF8
```

## Curation Checklist

### 1. Validate Architecture
```powershell
.\scripts\validate-synapses.ps1
.\scripts\validate-skills.ps1
```

### 2. Sync Master → Heir
```powershell
.\scripts\sync-master-to-heir.ps1 -Heir vscode -DryRun  # Preview
.\scripts\sync-master-to-heir.ps1 -Heir vscode          # Execute
```

### 3. Build Package
```powershell
.\scripts\build-extension-package.ps1
```

### 4. Config Audit

| Keep in Heirs | Remove from Heirs |
| ------------- | ----------------- |
| `cognitive-config-template.json` | Personal `cognitive-config.json` |
| `alex-manifest.json` | Personal `user-profile.json` |
| `user-profile.template.json` | Any file with actual user data |

#### PII Protection (3-Layer Defense)

**Critical**: User profiles contain PII and must NEVER leak to heirs.

| Layer | File | Rule |
|-------|------|------|
| 1 | `.gitignore` | Exclude `user-profile.json` from git |
| 2 | `.vscodeignore` | Exclude from VSIX package |
| 3 | `sync-master-to-heir.ps1` | Skip during master→heir sync |

**Template ships, data stays**: `user-profile.template.json` ships with sensible defaults. User's `user-profile.json` never leaves their machine.

### 5. Episodic Memory

**ALWAYS empty** — heir's `episodic/` folder should have no files. Users build their own memories.

## When to Change Inheritance

| Scenario | Action |
|----------|--------|
| New skill created | Set `inheritance` in synapses.json (default: `inheritable`) |
| Skill becomes Master-specific | Change to `master-only` |
| Skill should be heir-specific | Change to `heir:vscode` or `heir:m365` |
| Heirs missing a skill they need | Verify `inheritance` is not `master-only` |
| Heirs behaving differently | Check if cognitive skills have correct inheritance |

## Synapses

- [build-extension-package.ps1] (Critical, Implements, Bidirectional) - "Build script reads inheritance values"
- [release-management.instructions.md] (High, Triggers, Forward) - "Release process includes heir curation"
- [architecture-health/SKILL.md] (High, Validates, Forward) - "Health checks verify synapse integrity"
- [.github/skills/persona-detection/SKILL.md] (High, Integrates, Backward) - "Persona detection ships to heir via inheritance model"

---

*Skill Created: 2026-01-30 | Source: Beta testing feedback*
*Last Updated: 2026-02-08 | Refactored to use synapses.json inheritance as source of truth*
