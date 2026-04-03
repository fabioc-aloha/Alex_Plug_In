# Excavation Plan: Lessons from Copilot Chat for Alex

**Source Material**: VS Code 1.114 release analysis, Copilot Chat v0.43.0 codebase deep-dive, and the extension's own `.github/` customization files.

**Goal**: Extract actionable patterns to improve Alex's performance, chat control, and feature depth.

## Status

17 of 18 items **completed** across 3 sprints (March 31, 2026). One item remains open.

### Completed Items (Sprint 1-3, March 31, 2026)

| ID  | Initiative                                                                | Impact                |
| --- | ------------------------------------------------------------------------- | --------------------- |
| P1  | Token-efficient skill loading (tier frontmatter, 17 domain groups)        | High                  |
| P2  | Model-aware prompt adaptation (PromptVariantRegistry, 10 model families)  | High                  |
| P3  | Conversation summarization (2-tier: verbatim + compressed)                | Medium                |
| P4  | Context window scaling (priority-based layer truncation)                  | Low                   |
| C1  | Agent handoff pattern (model overrides per-handoff)                       | High                  |
| C2  | Enhanced follow-ups (persona-driven, session-objective, error-pattern)    | Medium                |
| C3  | Nested subagent chains (multi-hop with allowlist guards)                  | Medium                |
| C4  | Hook quality gates (H10 output secret scan, H13 breaking change detector) | Medium                |
| C5  | Steering awareness (mid-turn input)                                       | Low                   |
| F1  | Trajectory logging (200-event session trace)                              | High                  |
| F2  | Plugin install URL                                                        | Discontinued          |
| F3  | Chat Customizations editor reference                                      | Low                   |
| F5  | TS6 migration (TypeScript ~6.0.2)                                         | Medium                |
| F6  | Response stream enrichment (warning, filetree, progress)                  | Medium                |
| G1  | Workflow prompt audit (52 prompts audited)                                | Low                   |
| G2  | Instruction applyTo scoping                                               | N/A (already adopted) |
| G3  | Compilation check discipline                                              | Low                   |

### Open: F4. Simulation-Based Testing (High Impact, Long-Term)

**What Copilot does**: `.stest.ts` simulation tests run against cached LLM responses. SQLite-backed response caches enable deterministic replay. Scorecard generation and outcome validators provide measurable quality metrics.

**Alex current state**: No LLM response testing. Extension tests are unit-level (231+ tests). Behavior testing relies on manual verification.

**Plan**:

1. **Research feasibility**: Can we cache Copilot Chat API responses for replay?
2. **Start with golden-path tests**: Record 5 key scenarios (greeting, meditation, dream, code review, skill activation) and their expected behaviors
3. **Build a minimal replay harness**: Cache the prompt/response pairs; on re-run, compare against baseline
4. **Quality scorecards**: Define pass/fail criteria for each scenario (identity consistency, safety imperative compliance, skill activation accuracy)