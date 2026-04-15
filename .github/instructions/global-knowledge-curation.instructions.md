---
description: "Global knowledge curation, review cycles, and cross-project insight management"
application: "During code reviews, quality audits, or when assessing global knowledge curation"
applyTo: "**/AI-Memory/**,**/*global-knowledge*,**/*knowledge*"
inheritance: master-only
---

# Global Knowledge Curation Protocol

> Periodically review AI-Memory/global-knowledge.md to keep cross-project insights valuable and actionable.

**Related Skill**: [global-knowledge](../skills/global-knowledge/SKILL.md)

## Purpose

Cross-project knowledge accumulates in `AI-Memory/global-knowledge.md` (OneDrive). Without curation it becomes cluttered with outdated insights, duplicates, context-specific notes that shouldn't be global, and items already promoted to skills. This protocol keeps the file lean and high-value.

## Location

| Platform             | Path                                                               |
| -------------------- | ------------------------------------------------------------------ |
| VS Code              | `%OneDrive%/AI-Memory/global-knowledge.md` (local sync)            |
| M365 / Agent Builder | OneDrive `AI-Memory/global-knowledge.md` via OneDriveAndSharePoint |

## Curation Workflow

### Step 1: Review Entries

Open `global-knowledge.md` and review each entry under its category heading. For every entry assess:

- **Relevance**: Is this still useful?
- **Scope**: Is this truly cross-project, or context-specific?
- **Implementation**: Has this already been promoted to a skill or instruction?
- **Quality**: Is the insight actionable and well-documented?

### Step 2: Triage Decision

| Decision                   | Action                                        | When to Use                         |
| -------------------------- | --------------------------------------------- | ----------------------------------- |
| **Keep**                   | Leave entry in global-knowledge.md            | Valuable, not yet promoted          |
| **Promote to Skill**       | Create `.github/skills/` trifecta in Master   | Mature enough for a reusable skill  |
| **Promote to Instruction** | Create `.github/instructions/` file in Master | Procedural knowledge                |
| **Move to Notes**          | Move to AI-Memory/notes.md                    | Temporary or session-specific       |
| **Delete**                 | Remove the entry                              | Outdated, duplicated, or irrelevant |

### Step 3: Implementation Paths

#### A. Promote to Master Skill

1. Create skill trifecta in `.github/skills/[skill-name]/`:
   - `SKILL.md` — skill content extracted from the entry
   - `synapses.json` — connections to related skills
2. Remove entry from `global-knowledge.md`
3. Heir sync distributes via extension packaging

#### B. Promote to Instruction

1. Create `.github/instructions/[name].instructions.md`
2. Remove entry from `global-knowledge.md`

#### C. Clean Up

For entries that are stale or already implemented:

- Delete the entry from `global-knowledge.md`
- If historical value, move to `AI-Memory/notes.md` under a "## Archive" heading

### Step 4: Document Changes

After curation:

- Update CHANGELOG.md if new skills were created
- Run `node .github/muscles/gen-skill-catalog.cjs` if skills were added

## Curation Triggers

- **Scheduled**: Weekly or bi-weekly review
- **Before Release**: Ensure no orphaned knowledge
- **After Major Learning**: When global-knowledge.md grows significantly
- **Meditation Insight**: When meditation surfaces curation need

## Entry Format

Each entry in `global-knowledge.md` follows:

```markdown
### [Topic]

- **Source**: [project or context]
- **Insight**: [what was learned]
- **Date**: YYYY-MM-DD
```

Entries are organized under category headings (e.g., `## Azure Patterns`, `## Frontend Patterns`).

## Example Curation Session

```
Curation Review - 2026-04-10

## Azure Patterns (5 entries):
  SWA Auth: Keep - still referenced across projects
  SWA CLI broken: Delete - fixed in latest version
  Corp tenant secrets: Keep - active constraint
  Cosmos liveness: Delete - already in azure-architecture skill
  JIT expiry: Keep - still catches people

## Frontend Patterns (4 entries):
  Tailwind breakpoints: Keep - universal reference
  PageSpeed font swap: Promote to Skill - mature enough
  CSP headers: Keep - still evolving
  Markdown renderers: Delete - outdated comparison

Summary: 2 deleted, 1 promoted, 4 retained
```

## Heir Skill Promotion

When an entry in `global-knowledge.md` is mature enough to become a reusable skill:

1. **Assess**: Is the knowledge cross-project, well-documented, and stable?
2. **Create**: Build trifecta in `.github/skills/[name]/` (SKILL.md + synapses.json)
3. **Remove**: Delete the entry from `global-knowledge.md`
4. **Validate**: Run `node .github/muscles/brain-qa.cjs` to verify synaptic health
5. **Distribute**: Heir sync happens automatically during extension packaging

Skills live in Master `.github/skills/` — this is the canonical source. Heirs receive them through the extension build pipeline.

## Cross-Platform Consistency

Since `global-knowledge.md` is shared via OneDrive:

- VS Code can read/write directly via the sync path
- M365 agents read via OneDriveAndSharePoint capability
- Edits from any platform are visible everywhere after sync
- During curation, verify the file is consistent across access methods

## Migration Note

> **Legacy system deprecated (April 2026)**: The `~/.alex/global-knowledge/` folder, `Alex-Global-Knowledge` GitHub repo, GK-\*/GI-\* file format, index.json schema, and skill-registry.json are all superseded by `AI-Memory/global-knowledge.md`. All cross-project knowledge now lives in the single OneDrive-synced file.
