---
name: doc-hygiene
description: Documentation hygiene — anti-drift rules, count elimination, and living document maintenance
---

# Documentation Hygiene

> Prevent documentation drift through structural rules — not manual vigilance.

## The Count Problem

Hardcoded counts (e.g., "109 skills", "28 instructions", "6 agents") in prose become stale within days during active development. Every count is a future bug.

### Rules

| Rule | Do | Don't |
|------|----|-------|
| **No counts in prose** | "See the skills catalog for the current list" | "Alex has 109 skills" |
| **Counts in tables OK** | Tables with `| Count | Value |` format are scannable and updatable | Counts buried in paragraphs |
| **Single source of truth** | One canonical location per metric | Same count in 5 files |
| **Link, don't copy** | "See [SKILLS-CATALOG.md]" | Duplicate the catalog inline |
| **Timestamp proximity** | Counts near a "Last Updated" date are acceptable | Undated counts |

### Canonical Sources

The filesystem is always the source of truth. Derive counts from directories, not from prose.

| Metric | Canonical Source | Why |
|--------|-----------------|-----|
| Skill count | `.github/skills/` directory count (or generated catalog if present) | Filesystem is truth |
| Instruction count | `.github/instructions/` directory listing | Filesystem is truth |
| Prompt count | `.github/prompts/` directory listing | Filesystem is truth |
| Agent count | `.github/agents/` directory listing | Filesystem is truth |
| Muscle count | `.github/muscles/` directory listing | Filesystem is truth |
| Command count | `package.json` `contributes.commands` (if applicable) | Code is truth |
| Synapse count | Brain QA validation output | Validated at runtime |

### Acceptable Count Locations

Counts are **tolerated** (not encouraged) in these specific locations because they serve as dashboards:

| File | Purpose | Update Cadence |
|------|---------|----------------|
| `copilot-instructions.md` Memory Stores table | AI working context | Per release |
| `README.md` architecture tree | User-facing overview | Per release |

All other files should use **descriptive references** instead of counts.

## Document Freshness

### Staleness Indicators

| Signal | Action |
|--------|--------|
| Count doesn't match filesystem | Fix count or replace with reference |
| "Last Updated" older than 30 days on living doc | Review for accuracy |
| Version number doesn't match current release | Update or archive |
| References to removed/renamed files | Fix or remove reference |

### Living vs Historical Documents

| Type | Examples | Count Policy |
|------|----------|-------------|
| **Living** | README, copilot-instructions, ROADMAP, USER-MANUAL | Minimize counts; keep current |
| **Historical** | Research papers, competitive analyses, archived docs | Counts are snapshots — leave as-is |
| **Generated** | SKILLS-CATALOG, TRIFECTA-CATALOG | Counts are output of audit — OK |

## Docs-as-Architecture

Documentation in a cognitive architecture IS architecture. Apply the same engineering rigor to docs that you would to code:

| Code Concept | Docs Equivalent |
|-------------|-----------------|
| Broken import | Broken cross-reference link |
| Stale dependency | Stale count or version number |
| Orphan module | File not linked from any index |
| Circular dependency | Two files claiming to be source of truth |
| Dead code | Archived content still linked from living docs |

**Principle**: If a doc change would break another doc's accuracy, it's a breaking change. Treat it as such.

## Link Integrity

### Rules

| Rule | Enforcement |
|------|-------------|
| Every markdown link in living docs must resolve | Grep + verify during audit |
| Every important file in a folder should be linked from its `README.md` | Orphan check |
| Moving a file requires updating ALL references in the same commit | Grep for filename in all .md files before moving |
| Archived docs removed from active indexes | Don't link to `archive/` from living docs |
| Use relative paths within doc trees | `./architecture/FILE.md` not absolute paths |

### Orphan Detection

A file is orphaned if it exists in a doc folder but is not referenced by any index or parent document. Orphans are either:
- **Forgotten knowledge** → add to appropriate index
- **Stale artifacts** → archive or delete
