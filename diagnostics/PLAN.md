# Action Plan — Diagnostic Findings Resolution

**Created**: 2026-04-12
**Based on**: Diagnostic analysis v7.6.0
**Current state adjustments**: Participant mode removed (agent-only), dead code cleaned, init/upgrade polished

---

## Triage Notes

Several diagnostic findings need adjustment against the current codebase state:

- **Issue #11 (Thin commands)**: The `@alex` chat participant and all 36 slash commands have been **removed**. Alex now operates through agent mode exclusively, where `.github/` brain files (instructions, skills, prompts) are the primary value surface. This issue is **resolved by design change**.
- **Issue #1 (Empty packages/)**: The directory contains `mcp-cognitive-tools/` — it is **not empty**. Finding is **invalid**.
- **Issue #2 (No behavioral tests)**: 16 test files exist in `src/test/suite/`. The tests are lightweight but present. Finding severity downgraded from "no tests" to "test coverage is thin".
- **Issue #7 (VSIX size)**: Gate warns at 5.5 MB, fails at 7 MB. Needs verification of actual current VSIX size after dead code removal.

---

## Phase 1 — Quick Wins (Trivial Effort)

### 1A. Clarify `.github/hooks/` purpose
- **Issue**: #5 (hooks naming ambiguity)
- **Action**: Add a note to `.github/hooks/README.md` clarifying these are **git hooks**, not VS Code `chatAgentHooks`
- **Effort**: 5 minutes
- **Files**: `.github/hooks/README.md`

### 1B. Verify VSIX size post-cleanup
- **Issue**: #7 (VSIX size budget)
- **Action**: Run `npx vsce package --no-dependencies` and check actual size. After removing participant mode (8 files), emotional intelligence (820→80 lines), and 7 other dead modules, the VSIX should be smaller. Update quality gate thresholds if needed.
- **Effort**: 10 minutes
- **Files**: `scripts/quality-gate.cjs` (if threshold adjustment needed)

---

## Phase 2 — CI/CD Foundation (Medium Effort)

### 2A. Add GitHub Actions CI workflow
- **Issue**: #6 (No CI/CD pipeline)
- **Action**: Create `.github/workflows/ci.yml` that runs on push and PR:
  1. `npm ci` (install)
  2. `npm run check-types` (TypeScript type-check)
  3. `npm run lint` (ESLint)
  4. `npm run quality-gate` (8 automated gates)
- **Scope**: VS Code extension only (M365 heir has separate cycle)
- **Effort**: 1 session
- **Files**: `.github/workflows/ci.yml`
- **Prerequisite**: None — all scripts already exist and run locally
- **Note**: Do NOT add automated publish. Keep release manual and deliberate (PAT-gated, human in the loop).

---

## Phase 3 — Test Coverage Expansion (Large Effort, Incremental)

### 3A. Add unit tests for core services
- **Issue**: #2 (Thin test coverage)
- **Action**: Add focused unit tests for the 3 most critical services:
  1. `SkillManager` — keyword matching, skill discovery, activation index
  2. `CognitiveOrchestrator` — system prompt assembly, skill selection
  3. `EpisodicMemoryService` — YAML frontmatter read/write
- **Pattern**: Mock `fs-extra` and `vscode` APIs. Test pure logic paths.
- **Effort**: 2-3 sessions (one service per session)
- **Priority**: SkillManager first (most user-facing logic)

### 3B. Add command handler tests
- **Action**: Add tests for command handlers with the highest risk surface:
  1. `initialize.ts` — file deployment, manifest creation
  2. `upgrade.ts` — backup, migration, rollback
  3. `dream.ts` — brain-qa invocation, report generation
- **Effort**: 2-3 sessions
- **Priority**: After 3A since services are dependencies

---

## Phase 4 — Architecture Quality (Medium Effort)

### 4A. Audit strategy "Done" vs runtime enforcement
- **Issue**: #4 (Strategy features marked "Done" but not runtime-enforced)
- **Action**: Review `MULTI-AGENT-STRATEGY.md` and reclassify each feature:
  - **"Documented"** = exists in agent .md files and instructions only
  - **"Enforced"** = has runtime code or validated by brain-qa
  - Update the status column to reflect the distinction
- **Specific items to assess**:
  - Assignment Lifecycle (H17 hook deferred) → mark "Documented, hook deferred"
  - Correlation Vectors → mark "Documented" unless runtime tracing exists
  - Mission Profiles → verify if mode switching has runtime enforcement
- **Effort**: 1 session (audit + update document)
- **Files**: `MULTI-AGENT-STRATEGY.md`

### 4B. Token budget audit
- **Issue**: #10 (Token budget pressure)
- **Action**: Run `audit-token-waste.cjs` and review results. Focus on:
  1. Instructions that exceed the 50-line limit (with matching skill)
  2. Skills that exceed the 400-line limit
  3. Instructions with broad `applyTo: "**"` patterns that load on every request
  4. Consider converting low-frequency `applyTo: "**"` instructions to on-demand skills
- **Effort**: 1-2 sessions
- **Files**: `.github/instructions/*.md`, `.github/skills/*/SKILL.md`

---

## Phase 5 — Future Considerations (No Immediate Action)

### 5A. Semantic skill activation (Issue #3)
- **Current**: Keyword-based matching works well for known workflows. 15 intentional trigger overlaps are monitored.
- **Future**: If keyword misses become frequent after the agent-mode transition, consider adding semantic similarity as a supplemental activation layer.
- **Trigger**: User reports of missed skill activations in agent mode.

### 5B. M365 heir sync drift (Issue #8)
- **Current**: brain-qa Phase 27 monitors this. Intentional version differences are documented.
- **Action**: No change. Continue monitoring.

### 5C. Cowork platform (Issue #9)
- **Current**: Blocked by corporate tenant file read access policy.
- **Action**: No change. Monitor policy changes.

---

## Execution Order

| Priority | Phase   | Items      | Dependencies                               |
| -------- | ------- | ---------- | ------------------------------------------ |
| 1        | Phase 1 | 1A, 1B     | None                                       |
| 2        | Phase 2 | 2A         | None (scripts already exist)               |
| 3        | Phase 3 | 3A → 3B    | CI in place (Phase 2) to catch regressions |
| 4        | Phase 4 | 4A, 4B     | Independent of Phases 2-3                  |
| —        | Phase 5 | 5A, 5B, 5C | Triggered by conditions, not scheduled     |

---

## Resolved / Invalid Findings

| #   | Issue                        | Resolution                                                                                   |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | Empty `packages/`            | Invalid — contains `mcp-cognitive-tools/`                                                    |
| 9   | Cowork blocked               | External blocker, no action possible                                                         |
| 11  | Thin command implementations | Resolved — participant mode and slash commands removed; agent mode uses brain files directly |
