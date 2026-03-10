# Meditation: Synapse Activation Semantic Audit Consolidation
**Date**: March 10, 2026
**Session**: 3-session deep audit — synapse activation semantics, tools/hooks, heir sync integrity

## Context
Extensive multi-session audit of the synapse activation system discovered 15 bugs across three domains: dual synapse format handling, audit tooling gaps, and heir sync drift. All 15 bugs fixed, 241/241 tests green, 5/5 quality gates passing.

## Key Insights

### 1. Dual Systems Require Dual Scanning
The cognitive architecture has two parallel synapse declaration formats:
- **Embedded markdown**: `<!-- synapses: {...} -->` HTML comments in SKILL.md files
- **Structured JSON**: `synapses.json` files alongside SKILL.md

Both `synapseHealthTool.ts` (Phase 2) and `selfActualizationTool.ts` (Phase 1b) were only scanning JSON files. The embedded markdown format was a blindspot — any connections declared only in SKILL.md comments were invisible to health checks.

**Lesson**: When a system has two serialization formats for the same data, every consumer must handle both. A format audit is essential whenever a new consumer is added.

### 2. Bidirectional Claims Need Reciprocal Proof
23 synapses.json files claimed `"direction": "bidirectional"` without the target skill having a matching back-link. The `audit-synapses.cjs` script verified reciprocity by checking both directions for every bidirectional claim.

**Lesson**: Bidirectional relationships are a semantic promise, not a formatting flag. The flag alone is meaningless — the reciprocal link is what makes it real. By removing the flag from 40+ files, the actual bidirectional connections became visible through their back-links.

### 3. Agent-Scoped Hooks Are Declared in Frontmatter, Not hooks.json
The `hooks.json` file contains only global hooks. Agent-scoped hooks (Validator read-only enforcement, Builder compile reminder, etc.) are declared in `.agent.md` YAML frontmatter under `hooks:` key with `command:` paths. The audit initially flagged 6 hooks as orphans because it only scanned `hooks.json`.

**Lesson**: Configuration can live in multiple files. Audit scripts must discover all declaration sites, not just the "obvious" one.

### 4. Heir Exclusions Create Sync Blind Spots
Skills marked `heir:vscode` in `SKILL_EXCLUSIONS` are intentionally skipped by `sync-architecture.cjs`. When bulk changes are made to synapses.json files (like adding back-links or removing bidirectional flags), these excluded skills silently drift. Six files needed manual propagation.

**Lesson**: Any bulk operation touching files that cross the sync boundary needs a post-operation sweep of excluded items. Consider adding a "sync exclusion drift" check to the audit tooling.

### 5. Stale References Accumulate Silently After Renames
The `skill-activation` → `memory-activation` rename was completed in the skill directory itself but not in `sync-architecture.cjs` (4 references) or `architecture-health/SKILL.md` (1 reference). The sync script's validation function silently failed with "1 error" every time, but nobody noticed because the error message was buried.

**Lesson**: Skill renames need a grep sweep across all scripts, SKILLs, and documentation. Consider a rename checklist or a `grep -r "old-name"` as a post-rename verification step.

### 6. Tools Register in Multiple Files
Not all extension tools register in `tools/index.ts`. The 4 knowledge tools (`alex_knowledge_search`, `alex_knowledge_save_insight`, `alex_knowledge_promote`, `alex_knowledge_status`) register in `globalKnowledgeTools.ts`. Audit scripts that check only `tools/index.ts` miss these, producing false "unregistered tool" bugs.

**Lesson**: Tool registration discovery must be recursive across all source files, not pinned to a single registration entry point.

## Patterns Discovered

### Audit Script Development Pattern
1. **Create a specialized `.cjs` script** for the domain being audited
2. **Define "should exist" invariants** (e.g., every bidirectional claim has a back-link)
3. **Run the script** — classify findings as BUGs (semantic errors) vs WARNs (style issues)
4. **Fix all BUGs**, re-run script to verify zero findings
5. **Commit the audit script** as permanent infrastructure for regression prevention

This pattern was applied three times (synapse audit, architecture audit, tools/hooks audit) and proved effective each time.

### Synapse Reciprocity Pattern
When skill A claims a connection to skill B:
- If `direction: "forward"` → only A needs the entry (B may optionally have a back-reference)
- If `direction: "bidirectional"` → BOTH A and B must have entries pointing to each other
- The flag `"bidirectional": true` is now deprecated in favor of explicit direction field + reciprocal entries

## Artifacts
- Fixed: `platforms/vscode-extension/src/chat/tools/synapseHealthTool.ts` — Phase 2 JSON synapse scan added
- Fixed: `platforms/vscode-extension/src/chat/tools/selfActualizationTool.ts` — Phase 1b JSON synapse scan
- Fixed: `.github/skills/vscode-configuration-validation/synapses.json` — rewrote from legacy object format
- Fixed: 23 synapses.json files — added missing back-links for bidirectional claims
- Fixed: 40+ synapses.json files — removed false `"bidirectional": true` flags
- Fixed: `scripts/audit-tools-hooks.cjs` — agent-scoped hook scanning, `tool.name` fix, recursive tool search
- Fixed: `.github/muscles/sync-architecture.cjs` — `skill-activation` → `memory-activation` (4 references)
- Fixed: `.github/skills/architecture-health/SKILL.md` — stale `skill-activation` reference
- Synced: 6 `heir:vscode` excluded skill synapses.json files to heir
- Created: `scripts/audit-synapses.cjs` — permanent synapse integrity checker
- Created: `scripts/audit-architecture.cjs` — architecture consistency validator
- Created: `scripts/audit-tools-hooks.cjs` — tools, hooks, and MCP audit

## Bug Catalog (BUG 1-15)
| # | Domain | File(s) | Issue |
|---|--------|---------|-------|
| 1-9 | Synapse semantics | 198 synapses.json | Asymmetric bidirectional, false flags, format errors |
| 10 | Runtime tools | synapseHealthTool.ts | JSON synapse format blindspot |
| 11 | Synapse format | vscode-config-validation/synapses.json | Legacy object format (not array) |
| 12 | Synapse semantics | 23 synapses.json | Asymmetric bidirectional claims needing back-links |
| 13 | Audit tooling | audit-tools-hooks.cjs | Agent-scoped hooks flagged as orphans |
| 14 | Audit tooling | audit-tools-hooks.cjs | tool.id→tool.name, narrow search scope |
| 15 | Sync validation | sync-architecture.cjs | Stale skill-activation reference |

## Validation
✓ Memory File: `.github/episodic/meditation-2026-03-10-synapse-audit-consolidation.md` - created
✓ Build: clean | Tests: 241/241 | Quality Gate: 5/5 | Sync: 0 errors
✓ Session Log: 15 bugs fixed across 3 audit sessions, 240 files changed, 3 audit scripts created
