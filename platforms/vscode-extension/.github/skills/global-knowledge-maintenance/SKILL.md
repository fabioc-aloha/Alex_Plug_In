---
name: global-knowledge-maintenance
description: Curate and maintain Global Knowledge repository — audit index integrity, convert heir contributions to insights, and archive outdated patterns
user-invokable: true
---

# Global Knowledge Maintenance

**Domain**: Meta-cognitive repository curation, knowledge lifecycle management
**When to use**: Weekly curation, before releases, when Global Knowledge grows significantly
**Yields**: Clean index, documented heir contributions, archived legacy knowledge

---

## Purpose

Global Knowledge accumulates cross-project patterns and insights from all Alex instances (Master + Heirs). Without regular curation:
- Index drifts from disk (orphaned entries, unindexed files)
- Duplicate entries inflate counts
- Heir contributions (new skills, patterns) sit in GK without acknowledgment
- Outdated knowledge clutters the repository

This skill provides systematic curation to keep Global Knowledge valuable and actionable.

---

## When to Activate

**Scheduled Triggers**:
- Weekly maintenance review
- Before major releases (v*.0.0)
- When meditation surfaces curation needs

**Event Triggers**:
- New skills promoted from heirs to Global Knowledge
- Index count mismatch detected (brain-qa Phase 29)
- Duplicate entries found

**Manual Triggers**:
- User requests: `/curatek`, `/audit global`, `/clean knowledge`
- After bulk insight creation from projects

---

## Core Procedures

### 1. Index Integrity Audit

**Script**: `Alex-Global-Knowledge/scripts/sync-index.ps1`

**Actions**:
```powershell
cd ~/Alex-Global-Knowledge  # Or C:\Development\Alex-Global-Knowledge
.\scripts\sync-index.ps1      # Report only
.\scripts\sync-index.ps1 -Fix # Auto-fix
```

**What it does**:
- Scans all `GK-*.md` and `GI-*.md` files
- Extracts metadata from frontmatter
- Deduplicates entries by ID
- Adds missing files to index
- Removes orphaned entries (file deleted but still indexed)
- Updates `lastUpdated` timestamp

**Expected output**:
```
Index stats: 31 patterns, 240 insights = 271 total
Disk stats: 31 patterns, 240 insights = 271 total
✅ In sync
```

### 2. Heir Contribution Documentation

**Problem**: When Master Alex creates skills for heirs (like `ai-character-reference-generation`, `ai-generated-readme-banners`), the work is captured in Global Knowledge but not tracked as "Master contributed this to heirs."

**Solution**: Convert these entries to documented insights that preserve:
- What was created
- Which heir it supports
- When it happened
- Why it was needed

**Pattern**:
```markdown
# GI-heir-skill-creation-SKILL-NAME-YYYY-MM-DD.md

**Category**: heir-development
**Tags**: heir-contribution, skill-promotion, master-to-heir

## What Was Created
[Skill name, trifecta components]

## Which Heir
[VS Code Extension, M365 Copilot Agent, etc.]

## Context
[Why this skill was needed, what problem it solves]

## Archival Note
Original pattern GK-xxx.md archived after integration into Master/Heir architecture.
```

**Action**:
- Create insight documenting the contribution
- Archive or delete the original GK pattern (if fully integrated)
- Update heir's skill catalog

### 3. Curation Triage

For each Global Knowledge item, decide:

| Decision | Action | When |
|----------|--------|------|
| **Keep** | Leave in GK | Still accumulating, not yet ready for integration |
| **Promote to Master** | Create skill in Master Alex | Core capability for all projects |
| **Document as Insight** | Convert to GI-* with archival note | One-time contribution, history-worthy |
| **Archive** | Move to `scripts/archive/` | Outdated but worth keeping |
| **Delete** | Remove entirely | No longer relevant, superseded |

### 4. Count Synchronization

After curation, update counts in:

**Alex-Global-Knowledge/.github/copilot-instructions.md**:
```markdown
- **Patterns** (`patterns/`): Reusable solutions (GK-* files) — X patterns
- **Insights** (`insights/`): Timestamped learnings (GI-* files) — X insights
```

**Script**:
```powershell
$patterns = (Get-ChildItem patterns\GK-*.md).Count
$insights = (Get-ChildItem insights\GI-*.md).Count
# Update copilot-instructions.md manually with these counts
```

---

## Quality Gates

Before finishing curation:

✅ `sync-index.ps1` reports 0 orphaned, 0 unindexed  
✅ Heir contributions documented as insights (if any)  
✅ Counts in copilot-instructions.md match disk  
✅ `git status` clean (or changes committed)  

---

## Execution Checklist

- [ ] Run `sync-index.ps1` to audit
- [ ] Review unindexed files — legitimate new entries or stragglers?
- [ ] Check for heir contributions in patterns/
- [ ] Document heir work as insights if appropriate
- [ ] Delete/archive integrated patterns
- [ ] Run `sync-index.ps1 -Fix` to apply
- [ ] Update copilot-instructions.md counts
- [ ] Commit: `knowledge: curate global knowledge - <summary>`

---

## Example Session Output

```
=== GLOBAL KNOWLEDGE CURATION - 2026-02-15 ===

Index Audit:
  ❌ Duplicate: GK-domain-knowledge-ai-generated-readme-ban (x2)
  ⚠️  Unindexed: 2 patterns, 32 insights
  
Actions Taken:
  ✅ Removed duplicate entry
  ✅ Added 34 missing entries via sync-index.ps1 -Fix
  ✅ Updated copilot-instructions: 31 patterns, 240 insights
  ✅ Created GI-heir-skill-creation-ai-imagery-2026-02-15.md
  ✅ Archived GK-domain-knowledge-ai-character-reference-.md

Final State:
  Index: 271 entries (31 patterns, 240 insights)
  Disk: 271 files ✅ Match
  Commit: c3a8f21 "knowledge: curate global - fix duplicates, document heir imagery skills"
```

---

## Resources

- Script: [sync-index.ps1](../../scripts/sync-index.ps1) (in Alex-Global-Knowledge)
- Instructions: [global-knowledge-curation.instructions.md](../../instructions/global-knowledge-curation.instructions.md)
- Brain QA Phase 29: Global Knowledge Sync Validation

---

## Synapses

**Connects to**:
- `heir-skill-promotion` — When heirs create skills, they land in GK first
- `brain-qa` Phase 29 — Validates GK index integrity
- `meditation` — May surface curation needs during consolidation
- `release-process` — Pre-release curation ensures clean state

**Yields**:
- Accurate Global Knowledge index
- Documented heir contributions (preserves history)
- Clean knowledge base (no duplicates, no drift)

---

**Last Updated**: 2026-02-15  
**Trifecta Status**: ⚠️ Instructions + Muscle complete, Prompt optional  
**Inheritance**: `master-only`
