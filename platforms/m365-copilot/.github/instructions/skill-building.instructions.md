---
description: "Step-by-step skill creation, assessment, and completion procedure"
---

# Skill Building Procedure

Templates, quality checklists, depth rubric, staleness patterns → see `skill-building` skill.

## Phase 0: Activation Check (Before Creating Anything)

1. Search `.github/skills/` for existing coverage (name, description, body, `activationContexts`)
2. Diagnose: existing + activates → **stop** | exists but doesn't activate → **add keywords** | partial coverage → **expand** | no coverage → **proceed**

## Phase 1: Create SKILL.md

1. Folder: `.github/skills/{skill-name}/`
2. Frontmatter: `name`, `description`, `applyTo` globs
3. Content: domain knowledge with tables, thresholds, anti-patterns
4. `synapses.json`: 2-5 connections
5. **Depth litmus**: Would an LLM produce equally useful content without this skill? Must be *no*.

For API/platform skills: add staleness warning with refresh triggers and validation date.

## Phase 2: Register

5. Add action keywords to `memory-activation/SKILL.md`
6. Update bidirectional synapses in connected skills

## Phase 3: Trifecta Decision

| Skill type | .instructions.md? | .prompt.md? |
|------------|:------------------:|:-----------:|
| Reference knowledge only | No | No |
| Multi-step process | **Yes** | Maybe |
| Interactive workflow | Maybe | **Yes** |
| Automated by extension | No | No |

## Phase 4: Build Components

- **.instructions.md**: numbered steps, decision points, `applyTo` if file-pattern-triggered, reference SKILL.md
- **.prompt.md**: guided conversation, register as slash command, add to memory-activation prompt index
- **CRITICAL**: files start with `---` or `{` — never wrap in code fences

## Phase 5: Muscle Decision

Repeated terminal commands or file transformations → create `.github/muscles/{verb}-{noun}.{ps1|js}`. One-time or judgment-based → skip.

## Phase 6: Declare Inheritance

Default: `inheritable` (syncs to all heirs). Only declare if non-default.

| Type | Meaning |
|------|---------|
| `master-only` | Master Alex only |
| `heir:vscode` | Heir maintains own version |
| `heir:m365` | M365 heir only |

**Trifecta consistency**: if skill is excluded, its instruction + prompt must have matching `inheritance:` frontmatter.

## Phase 7: Finalize

- Update SKILLS-CATALOG.md, TRIFECTA-CATALOG.md
- Run sync-architecture
- Compile, package, install VSIX
