# Prompt Overhaul Plan: From Templates to Automation Scripts

**Origin**: Copilot Chat `.github/` analysis (March 31, 2026)
**Scope**: Transform Alex's 56 prompts from passive templates into self-driving procedural workflows
**Status**: Planning

## The Insight

Copilot Chat's `.github/prompts/` treats prompts as **executable automation scripts**, not templates. Their `updateGithubCopilotSDK.prompt.md` is a full CI pipeline expressed as a prompt: snapshot, upgrade, diff, compile-fix-test loops, integration tests, summary. It specifies `model: Claude Opus 4.6`, mandates TODO tracking, and runs to completion without user intervention.

Alex's 56 prompts are descriptive ("here's what to do") rather than procedural ("do this, then verify, then loop until green"). None specify a model. None enforce TODO tracking. None have compile-verify-test loops.

This is a paradigm shift: **prompts become the primary automation layer**, replacing manual multi-step workflows.

## Audit: Current State

| Metric                              | Value                               |
| ----------------------------------- | ----------------------------------- |
| Total prompts                       | 56                                  |
| Using `model:` frontmatter          | 0                                   |
| Using `applyTo:` frontmatter        | 0                                   |
| Truly procedural (loop-until-green) | 0                                   |
| Have numbered steps                 | ~32 (but descriptive, not enforced) |

## Sprint 1: Prompt Infrastructure (Foundation)

Establish the patterns and conventions before touching individual prompts.

### P1: Prompt Authoring Standard

Create an instruction file that codifies the new prompt authoring rules.

**Deliverable**: `.github/instructions/prompt-authoring-standard.instructions.md`

**Rules to encode**:
1. **Model selection in frontmatter**: `model:` field for prompts that need specific reasoning capability (Opus 4.6 for complex multi-step, Sonnet for fast single-step)
2. **TODO tracking mandate**: Procedural prompts MUST instruct the agent to create a TODO list, update it after each step, and read it before each step
3. **Verify-before-proceed gates**: After code changes, mandate compilation check. After test changes, mandate test run. Never declare done without verification
4. **Loop-until-green pattern**: For compile/test cycles, encode "repeat until zero errors" with a max iteration guard (5 cycles)
5. **Summary generation**: Every procedural prompt ends with a structured summary of what changed, what was verified, and what needs attention
6. **Prompt tiers**: Classify prompts into Procedural (self-driving), Interactive (needs user input), and Declarative (context injection only)

### P2: Priority System Documentation

Document the prompt-tsx-style priority system that `LAYER_PRIORITIES` already implements.

**Deliverable**: Update `promptEngine.ts` inline docs + add reference to `WORKING-WITH-ALEX.md`

**Priority ranges to document** (already in code, needs docs):
- Identity/safety: 1000
- User query: 900
- Active context: 850
- Recent history: 700-800
- Skills/instructions: 600-700
- Peripheral context: 300-500

### P3: Testing Instruction Hardening

Adopt the Copilot Chat testing patterns as an instruction file update.

**Deliverable**: Update `.github/instructions/testing-strategies.instructions.md`

**Rules to add**:
- Prefer explicit `Mock*`/`Test*` classes over `as any` hacks
- Never use `as any` to override private methods or assign properties on real objects
- Mock classes should be configurable for reuse across test scenarios
- Tests must be deterministic: no real servers, no network I/O

## Sprint 2: Tier 1 Prompt Conversions (High-Impact)

Convert the most-used and highest-impact prompts to procedural automation.

### C1: release.prompt.md (Currently 50 lines)

The release workflow is the #1 candidate: it's multi-step, error-prone, and already has a preflight script.

**Target pattern**: Self-driving release workflow
```
model: claude-opus-4-6
```
**Steps to encode**:
1. Read current version from `package.json`
2. Run `release-preflight.ps1`, parse output, fix any failures
3. Version bump across all 6 files (with verification read-back)
4. Write CHANGELOG entry
5. Update ROADMAP shipped table
6. Compile (`npm run compile`), loop until clean
7. Run tests (`npm test`), loop until green
8. Package VSIX
9. Summary: version, files changed, test results, VSIX path

### C2: review.prompt.md (Currently 53 lines)

Code review should be a structured 3-pass procedure, not a description.

**Target pattern**: Procedural with TODO tracking
**Steps to encode**:
1. Read target file(s)
2. Pass 1: Correctness (logic errors, edge cases, null safety)
3. Pass 2: Security (OWASP Top 10 scan, input validation, secrets)
4. Pass 3: Quality (naming, complexity, duplication, test coverage)
5. Generate findings table with severity and line references
6. Summary: pass/fail by category, blocking issues count

### C3: refactor.prompt.md (Currently 31 lines)

Refactoring must verify behavioral preservation.

**Target pattern**: Procedural with compile-test gates
**Steps to encode**:
1. Run tests before refactoring (baseline)
2. Apply refactoring changes
3. Compile, loop until clean
4. Run tests, compare against baseline (same count, same pass/fail)
5. If test failures introduced, revert and report
6. Summary: what changed, test parity confirmed

### C4: debug.prompt.md (Currently 23 lines)

Debugging should follow a systematic reproduce-isolate-fix-verify cycle.

**Target pattern**: Procedural with verification
**Steps to encode**:
1. Reproduce: confirm the error exists
2. Isolate: narrow to file/function/line
3. Hypothesize: propose root cause with evidence
4. Fix: apply minimal change
5. Verify: compile + run reproduction scenario
6. Regression: run full test suite
7. Summary: root cause, fix applied, tests verified

### C5: tdd.prompt.md (Currently 60 lines)

TDD should enforce the red-green-refactor cycle literally.

**Target pattern**: Loop-based procedural
**Steps to encode**:
1. Write failing test (verify it fails)
2. Write minimal implementation (verify test passes)
3. Refactor (verify tests still pass)
4. Repeat for next requirement
5. Summary: tests added, coverage delta

### C6: masteraudit.prompt.md (Currently 42 lines)

Architecture audit should be a multi-phase automated sweep.

**Target pattern**: Procedural with phased execution
**Steps to encode**:
1. Run `audit-architecture.cjs`, capture output
2. Run `audit-synapses.cjs`, capture output
3. Run `audit-skill-activation-index.cjs`, capture output
4. Run `audit-tools-hooks.cjs`, capture output
5. Aggregate findings, deduplicate
6. Prioritize by severity
7. Summary: total issues, breakdown by category, top 5 actions

## Sprint 3: Tier 2 Prompt Conversions (Domain-Specific)

### C7: brainqa.prompt.md

Convert to fully automated brain-qa execution with structured output parsing.

### C8: meditate.prompt.md + dream.prompt.md

Convert to procedural flows that enforce prerequisite checks, execute the protocol, and produce structured summaries.

### C9: security-review.prompt.md

Convert to OWASP+STRIDE automated scan with severity-ranked findings table.

### C10: validate-config.prompt.md

Convert to automated manifest-vs-runtime validation with fix suggestions.

### C11: plan.prompt.md

Convert to structured planning workflow that produces tracked TODO items.

### C12: improve.prompt.md

Convert to gap-analysis-driven improvement with before/after metrics.

## Sprint 4: Compilation-First Enforcement

### E1: Builder Agent Compilation Gate

Strengthen the Builder agent's compilation-first behavior.

**Deliverable**: Update `.github/agents/alex-builder.agent.md`

**Changes**:
- Add explicit rule: "After ANY `.ts` file edit, run `npm run compile` before proceeding"
- Add rule: "Never declare task complete without zero compilation errors"
- Reference the Copilot Chat pattern: "You MUST check compilation output before running ANY script or declaring work complete"

### E2: Validator Agent Test Gate

Add explicit test verification mandate to Validator.

**Deliverable**: Update `.github/agents/alex-validator.agent.md`

**Changes**:
- Add rule: "After reviewing code changes, run `npm test` to verify no regressions"
- Add rule: "Report test count and pass/fail status in every review summary"

## Sprint 5: Remaining Prompt Conversions

Convert the remaining ~44 prompts. Group by complexity:

### Batch A: Simple declarative (no conversion needed, just add `applyTo:`)
- `brand.prompt.md`, `knowledge.prompt.md`, `learn.prompt.md`, `datastory.prompt.md`, `visualize.prompt.md`, `interpret.prompt.md`, `analyze.prompt.md`, `dashboard.prompt.md`

### Batch B: Need `model:` frontmatter + light procedural structure
- `gamma.prompt.md`, `marp.prompt.md`, `presentation.prompt.md`, `word.prompt.md`, `diagramming.prompt.md`

### Batch C: Full procedural conversion (multi-step verification workflows)
- `extension-audit-methodology.prompt.md` (482 lines, already large)
- `ui-ux-audit.prompt.md` (684 lines, already large)
- `vscode-extension-audit.prompt.md` (162 lines)
- `mcp-server.prompt.md` (191 lines)
- `chat-participant.prompt.md` (194 lines)
- `graph-api.prompt.md` (208 lines)
- `teams-app.prompt.md` (198 lines)
- `m365-agent-debug.prompt.md` (182 lines)

### Batch D: Image generation prompts (verify-after-generate pattern)
- `ai-character-reference-generation.prompt.md`
- `ai-generated-readme-banners.prompt.md`
- `character-aging-progression.prompt.md`
- `visual-memory.prompt.md`
- `image-handling.prompt.md`
- `flux-brand-finetune.prompt.md`

## Definition of Done

- [ ] All 56 prompts classified into Procedural/Interactive/Declarative tiers
- [ ] All Procedural prompts have: `model:` frontmatter, TODO tracking mandate, verify gates, loop-until-green patterns, summary generation
- [ ] All prompts have `applyTo:` where applicable
- [ ] Prompt authoring standard instruction published and referenced in copilot-instructions
- [ ] Builder agent enforces compilation-first
- [ ] Validator agent enforces test verification
- [ ] Priority system documented in WORKING-WITH-ALEX
- [ ] Testing instruction updated with Mock/Test class patterns
- [ ] At least 12 prompts converted to full procedural automation (Sprint 2+3)

## Effort Estimate

| Sprint    | Scope                                      | Effort   |
| --------- | ------------------------------------------ | -------- |
| Sprint 1  | Infrastructure (P1-P3)                     | 2d       |
| Sprint 2  | Tier 1 conversions (C1-C6)                 | 3d       |
| Sprint 3  | Tier 2 conversions (C7-C12)                | 2d       |
| Sprint 4  | Agent enforcement (E1-E2)                  | 1d       |
| Sprint 5  | Remaining prompts (Batches A-D)            | 3d       |
| **Total** | **56 prompts + 3 instructions + 2 agents** | **~11d** |

## Risk: Over-Engineering

Not every prompt needs to be a procedural automation script. Some prompts are genuinely declarative (e.g., `brand.prompt.md` just injects brand guidelines). The tier system prevents over-conversion:

- **Procedural**: Multi-step workflows with verification gates (release, review, refactor, debug, TDD, audit)
- **Interactive**: Needs user decisions mid-flow (journey, plan, learn, improve)
- **Declarative**: Pure context injection, no steps needed (brand, knowledge, interpret)

Only Procedural prompts get the full treatment. Interactive prompts get structure but preserve decision points. Declarative prompts just get frontmatter improvements.
