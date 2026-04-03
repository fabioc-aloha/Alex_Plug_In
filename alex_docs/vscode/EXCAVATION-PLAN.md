# Excavation Plan: Lessons from Copilot Chat for Alex

**Source Material**: VS Code 1.114 release analysis, Copilot Chat v0.43.0 codebase deep-dive, and the extension's own `.github/` customization files.

**Goal**: Extract actionable patterns to improve Alex's performance, chat control, and feature depth.

## Executive Summary

The Copilot Chat codebase reveals a mature, production-grade architecture built for scale: 73 tools with deferred loading, per-model prompt adaptation, DI-based services, embeddings-powered tool grouping, and a three-layer trajectory logging pipeline. Alex already mirrors several patterns (hooks, tools, agents, instructions) but at a lower fidelity. The biggest gains come from adopting their **token efficiency** patterns, **model-aware prompt adaptation**, and **session lifecycle management** rather than building new features from scratch.

## Part 1: Performance Improvements

### ~~P1. Token-Efficient Skill Loading (High Impact)~~ DONE

**What Copilot does**: Only 21 "core" tools are sent every turn. The remaining 52 are deferred into virtual groups that expand on demand via embeddings-based matching. An LRU strategy collapses the least-recently-used group when total tools exceed `HARD_TOOL_LIMIT`.

**Alex current state**: All 158 skills are listed in `SKILLS-CATALOG.md` and loaded via `.github/skills/*/SKILL.md` descriptions. VS Code's built-in skill matching uses these descriptions, but Alex has no explicit grouping, priority tiers, or collapse strategy.

**Plan**:
1. **Classify skills into tiers**: Core (always loaded, ~20-25 skills), Standard (loaded on keyword match), Extended (loaded only on explicit request)
2. **Add `tier` field to SKILL.md frontmatter**: `tier: core | standard | extended`
3. **Create skill group index**: Group skills by domain (data, azure, creative, code-quality, cognitive, etc.) similar to Copilot's `ToolCategory` enum
4. **Measure**: Count tokens consumed by skill descriptions in a typical session; target 40% reduction

### ~~P2. Prompt Engine: Model-Aware Adaptation (High Impact)~~ DONE

**What Copilot does**: A `PromptRegistry` selects model-specific prompt variants. Claude gets different system prompts than GPT, different edit tool preferences, different verbosity levels. The `getVerbosityForModelSync()` function adjusts prompt length by model capability.

**Alex current state**: `promptEngine.ts` has a 12-layer prompt builder. Layer 7 (`buildModelAdaptiveLayer`) detects the model tier (Opus/Sonnet/Haiku/GPT) and adds tier-specific guidance. But it's a single function, not a registry pattern. All models get the same core prompt structure.

**Plan**:
1. **Create a `PromptVariantRegistry`**: Map model families to prompt customizations
2. **Per-model prompt surfaces to customize**:
   - Communication style (verbose for Opus/GPT-5, concise for Haiku/Flash)
   - Edit tool preferences (Opus uses `replace_string` well; Gemini needs stronger hints)
   - Identity injection depth (full identity for Opus; minimal for subagent models)
   - Safety layer verbosity (full for primary models; lean for subagents)
3. **Token budget per model**: Opus (200k context) gets full 12 layers; Haiku (200k but cheaper) gets layers 1-4 + 10-11 only
4. **Validation**: Compare token usage before/after on the same 10-turn conversation

### ~~P3. Conversation Summarization (Medium Impact)~~ DONE

**What Copilot does**: `SummarizedConversationHistory` compresses older turns. `BackgroundSummarizer` runs asynchronously. Cache breakpoints enable LLM-side prompt caching.

**Alex current state**: Layer 3 of the prompt engine includes the last 4 conversation turns verbatim. No summarization, no compaction, no background processing.

**Plan**:
1. **Implement turn-limited history with summary**: Keep last 2 turns verbatim; summarize turns 3-8 into a compact paragraph
2. **Session-level summary cache**: Store per-session summary in extension global state; update after each turn
3. **Leverage context compaction**: When using Anthropic models, add the anti-narration instructions from the findings (don't discuss context limits, don't narrate memory saving)

### ~~P4. Context Window Scaling (Low Impact, Quick Win)~~ DONE

**What Copilot does**: The Anthropic adapter lies to the agent about context window size (reports 200k even when smaller), preventing premature context-saving behavior.

**Alex current state**: No context window awareness in prompt construction.

**Plan**:
1. **Add context budget awareness to promptEngine**: If model context is known, truncate lower-priority layers first rather than cutting arbitrarily
2. **Priority-based layer truncation**: Use the Copilot priority system (Safety: 1000, Query: 900, Instructions: 750, History: 700) to decide what to cut

## Part 2: Chat Control Improvements

### ~~C1. Agent Handoff Pattern (High Impact)~~ DONE

**What Copilot does**: `AgentHandoff` interface with `label`, `prompt`, `continueConversation`, and `model` fields. Agents declare handoffs in their config, rendered as action buttons. The model can be overridden per-handoff (e.g., hand off to a cheaper model for search).

**Alex current state**: Our 7 agents (Builder, Researcher, Validator, etc.) are defined in `.agent.md` files. The `CognitiveStateUpdateTool` handles persona/agent switching via tool call. No structured handoff buttons or model overrides per-handoff.

**Plan**:
1. **Add handoff declarations to agent.md files**: Define explicit transitions (Builder → Validator for code review, Researcher → Builder for implementation)
2. **Model per-handoff**: Use cheaper models for delegated exploration (Haiku for Explore, same model for Validator)
3. **Handoff as follow-up actions**: Use `ChatFollowup` to suggest the next agent based on completed work

### ~~C2. Enhanced Follow-Up Provider (Medium Impact)~~ DONE

**What Copilot does**: Follow-up suggestions are context-aware: based on completed work, detected patterns, and conversation state.

**Alex current state**: Basic follow-up suggestions exist but are not strongly context-aware or persona-driven.

**Plan**:
1. **Persona-driven follow-ups**: Developer persona suggests code review after implementation; Researcher suggests literature search; Validator suggests test coverage
2. **Session-objective follow-ups**: If a North Star goal is active, suggest the next step toward it
3. **Error-pattern follow-ups**: If the last 2 turns contained errors, suggest a debugging session or root-cause analysis

### ~~C3. Nested Subagent Chains (Medium Impact, New in 1.113)~~ DONE

**What Copilot does**: `chat.subagents.allowInvocationsFromSubagents` enables multi-hop delegation. Subagents can call other subagents for complex workflows.

**Alex current state**: Our agents delegate to subagents (Builder calls Explore, Researcher calls search_subagent), but the chains are single-hop only.

**Plan**:
1. **Enable nested subagents in settings**: Add `chat.subagents.allowInvocationsFromSubagents: true` to recommended workspace settings
2. **Design multi-hop workflows**: Researcher → Explore → search_subagent for deep research; Builder → Validator → Explore for verified implementation
3. **Guard against runaway chains**: Limit nesting depth via the `agents` allowlist in agent.md files (only whitelist the specific subagents each agent can call)

### ~~C4. Hook-Based Quality Gates (Medium Impact)~~ DONE

**What Copilot does**: Pre/post tool-use hooks with deny/ask/allow permission model. Multiple hooks collapse via "most restrictive wins." `additionalContext` injection lets hooks add knowledge mid-turn.

**Alex current state**: 18 hook scripts in `.github/muscles/hooks/` covering session-start, pre-tool-use, post-tool-use, stop, etc. Already using the Copilot hook system.

**Plan**:
1. **Promote deferred hooks H10 and H13**: Output secret scanning (H10) and breaking change detection (H13) as planned in v7.1.0
2. **Add `additionalContext` injection**: Hooks currently block/allow; extend to inject context (e.g., session-start hook injects project-specific conventions)
3. **Hook telemetry**: Log hook execution times and decisions for performance analysis

### ~~C5. Steering (Mid-Turn Input) Awareness (Low Impact)~~ DONE

**What Copilot does**: When a user sends a message while the agent is working, it routes through `_handleRequestSteering` with `mode: 'immediate'`. Both the steering and original request run concurrently.

**Alex current state**: No mid-turn awareness. User has to wait or cancel.

**Plan**:
1. **Research VS Code API**: Check if `ChatRequestHandler` receives steering events in the token
2. **If available**: Handle gracefully rather than ignoring. Acknowledge the redirection.
3. **If not available**: Document as a Future Watch item

## Part 3: New Feature Opportunities

### ~~F1. Trajectory Logging for Session Analysis (High Impact)~~ DONE

**What Copilot does**: Three-layer pipeline (RequestLogger → TrajectoryLoggerAdapter → TrajectoryLogger) captures all LLM requests, tool calls, and prompt traces in ATIF v1.5 format. Exportable for debugging and replay.

**Alex current state**: `agentActivity.ts` tracks basic agent start/complete/error with a 20-item history. No structured trace format, no tool call logging, no export capability.

**Plan**:
1. **Extend `agentActivity.ts` into a session trace service**: Log tool calls, model requests, agent delegations, and hook decisions per session
2. **Use the existing session-tool-log.json**: Already mentioned in the roadmap for frecency ranking; extend it to full trajectory format
3. **Session replay for meditation**: During `/meditate`, read the session trace to identify patterns (most-used tools, common errors, agent delegation chains)
4. **Export format**: Align with ATIF v1.5 for compatibility with VS Code's debug analysis tools

### ~~F2. One-Click Plugin Install URL~~ DISCONTINUED

Agent Plugin heir discontinued 2026-04-03. VS Code extension is the sole distribution channel.

### ~~F3. Chat Customizations Editor Reference (Low Impact, Quick Win)~~ DONE

**What Copilot does**: Centralized UI (`Chat: Open Chat Customizations`) for managing all instructions, skills, agents, prompts. Users can create from scratch or use AI to generate.

**Alex current state**: Alex's customizations are managed via files in `.github/`. Users discover them through documentation.

**Plan**:
1. **Update WORKING-WITH-ALEX.md**: Document the Chat Customizations editor as the preferred way to browse and manage Alex's instructions/skills/agents
2. **Add Welcome View link**: Button in the Welcome View that opens the Customizations editor
3. **Validate**: Ensure all Alex customization files surface correctly in the editor

### F4. Simulation-Based Testing (High Impact, Long-Term)

**What Copilot does**: `.stest.ts` simulation tests run against cached LLM responses. SQLite-backed response caches enable deterministic replay. Scorecard generation and outcome validators provide measurable quality metrics.

**Alex current state**: No LLM response testing. Extension tests are unit-level (231+ tests). Behavior testing relies on manual verification.

**Plan**:
1. **Research feasibility**: Can we cache Copilot Chat API responses for replay?
2. **Start with golden-path tests**: Record 5 key scenarios (greeting, meditation, dream, code review, skill activation) and their expected behaviors
3. **Build a minimal replay harness**: Cache the prompt/response pairs; on re-run, compare against baseline
4. **Quality scorecards**: Define pass/fail criteria for each scenario (identity consistency, safety imperative compliance, skill activation accuracy)

### ~~F5. TS6 Migration (Medium Impact, Maintenance)~~ DONE

**What VS Code 1.114 requires**: TypeScript 6.0 is now the built-in language service. Several tsconfig settings are deprecated.

**Alex current state**: `tsconfig.json` uses `moduleResolution: "node"` (deprecated) and `typescript: "^5.4.5"` (pre-6.0).

**Plan**:
1. **Phase 1**: Update tsconfig to eliminate deprecation warnings
   - Change `moduleResolution` from `"node"` to `"nodenext"`
   - Add `"types": ["node"]`
   - Verify compilation with no behavior change
2. **Phase 2**: Upgrade `typescript` devDependency to `^6.0.0`
   - Run full test suite
   - Fix any new strict-mode catches
3. **Phase 3**: Evaluate TS 7.0 native preview readiness (Go compiler, parallel type checking)

### ~~F6. Response Stream Enrichment (Medium Impact)~~ DONE

**What Copilot does**: Rich stream API: `button()`, `progress()`, `thinkingProgress()`, `warning()`, `confirmation()`, `questionCarousel()`, `filetree()`, `hookProgress()`.

**Alex current state**: Uses `markdown()` for output, `progress()` for long operations, `button()` for follow-up actions. Does not use `thinkingProgress()`, `warning()`, `confirmation()`, or `filetree()`.

**Plan**:
1. **`thinkingProgress()`**: Use during deep-thinking skill and meditation to show Alex's reasoning process as a collapsible "thinking" block
2. **`warning()`**: Use for safety alerts from hooks (I1-I8 violations) instead of inline markdown warnings
3. **`confirmation()`**: Use before destructive operations (architecture reset, file deletion) as a blocking dialog
4. **`filetree()`**: Use in architecture status and health reports to display the cognitive structure visually
5. **`hookProgress()`**: Surface hook execution status (safety gate passed, memory scan complete) as structured progress rather than log messages

## Part 4: Patterns from the Copilot Chat Team's Own .github/

### ~~G1. Prompt Files as Reusable Workflows~~ DONE

**What they do**: `updateCopilotCLIToolMapping.prompt.md` and `updateGithubCopilotSDK.prompt.md` are complete, multi-step workflow definitions. The SDK update prompt includes: snapshot types → npm install → compare diffs → compile → fix → test → repeat → integration test → summarize. With explicit "create a TODO markdown file" instructions.

**Alex current state**: Our `.github/prompts/` has 56 prompt files. Some are workflow-oriented but many are single-step.

**Plan**:
1. **Audit existing prompts for workflow completeness**: Ensure multi-step prompts include TODO tracking, compile/test gates, and summary requirements
2. **Create release workflow prompt**: Inspired by the SDK update pattern: version bump → changelog → preflight → package → test → publish → verify
3. **Create migration workflow prompt**: For TS6 migration: snapshot → upgrade → compile → fix → test → compare

### ~~G2. Instruction File Scoping with `applyTo`~~ N/A (already adopted)

**What they do**: `prompt-tsx.instructions.md` uses `applyTo: '**/*.tsx'` and `vitest-unit-tests.instructions.md` uses `applyTo: '**/*.spec.ts'`. Clean, focused scope.

**Alex current state**: Our instructions use `applyTo` patterns extensively (77 instructions, many with globs). This is already well-adopted.

**Plan**: No action needed. Alex is already following this pattern well. Continue using it.

### ~~G3. Compilation Validation Discipline~~ DONE

**What they do**: `copilot-instructions.md` has a bold rule: "You MUST check compilation output before running ANY script or declaring work complete!" with explicit watch task monitoring.

**Alex current state**: Our instructions emphasize quality gates and testing but don't have an explicit "always check compilation" rule.

**Plan**:
1. **Add compilation-check discipline to `code-review-guidelines.instructions.md`**: "Verify compilation succeeds before marking any code task complete"
2. **Reference in Builder agent**: Builder should always verify compilation as a post-implementation step

## Priority Matrix

| ID  | Initiative                      | Impact | Effort | Priority           | Status |
| --- | ------------------------------- | ------ | ------ | ------------------ | ------ |
| P1  | Token-efficient skill loading   | High   | 2d     | **P0**             | Done   |
| P2  | Model-aware prompt adaptation   | High   | 3d     | **P0**             | Done   |
| F5  | TS6 migration                   | Medium | 1d     | **P2**             | Done   |
| F6  | Response stream enrichment      | Medium | 2d     | **P1**             | Done   |
| C1  | Agent handoff pattern           | High   | 2d     | **P1**             | Done   |
| C3  | Nested subagent chains          | Medium | 1d     | **P1**             | Done   |
| F1  | Trajectory logging              | High   | 3d     | **P1**             | Done   |
| P3  | Conversation summarization      | Medium | 2d     | **P2**             | Done   |
| C2  | Enhanced follow-ups             | Medium | 1d     | **P2**             | Done   |
| C4  | Hook quality gates (H10, H13)   | Medium | 2d     | **P2**             | Done   |
| F2  | Plugin install URL              | Medium | 0.5d   | **P2** (quick win) | Done   |
| F3  | Chat Customizations editor docs | Low    | 0.5d   | **P3** (quick win) | Done   |
| G1  | Workflow prompt audit           | Low    | 1d     | **P3**             | Done   |
| G3  | Compilation check discipline    | Low    | 0.5d   | **P3** (quick win) | Done   |
| P4  | Context window scaling          | Low    | 1d     | **P3**             | Done   |
| C5  | Steering awareness              | Low    | 1d     | **P3**             | Done   |
| G2  | Instruction applyTo scoping     | Low    | 0d     | N/A                | Done   |
| F4  | Simulation testing              | High   | 5d+    | **P3** (long-term) |        |

## Recommended Execution Order

### Sprint 1: Token Efficiency and Model Adaptation (P0) -- COMPLETED 2026-03-31

Focus: Make Alex consume fewer tokens and adapt better to the model it's talking to.

1. ~~**P1**: Classify skills into tiers, add `tier` frontmatter, create group index~~
   - Added `tier: core | standard | extended` to all 158 SKILL.md files (21 core, 85 standard, 52 extended)
   - Created `scripts/add-skill-tiers.cjs` for batch classification
   - Generated `alex_docs/skills/SKILL-GROUPS.md` with 17 domain groups via `scripts/gen-skill-group-index.cjs`
2. ~~**P2**: Build `PromptVariantRegistry`, implement per-model customizations in promptEngine.ts~~
   - Created `promptVariantRegistry.ts` with 10 model family variants (claude-opus/sonnet/haiku, gpt-frontier/capable/efficient, gemini-pro/flash, o-series, unknown)
   - Each variant defines: communicationStyle, identityDepth, safetyVerbosity, editToolHints, layerBudget, maxHistoryTurns
   - Wired into `promptEngine.ts`: main builder respects variant `layerBudget` (skips layers for efficient models), history layer uses `maxHistoryTurns`
   - Replaced old 3-way if/else in `buildModelAdaptiveLayer` with registry lookup
3. ~~**F5**: Migrate tsconfig for TS6 (while touching the build system)~~
   - Upgraded TypeScript from `^5.4.5` to `~6.0.2`
   - Changed `moduleResolution` from `"node"` to `"node10"` + `ignoreDeprecations: "6.0"` (full `"nodenext"` deferred: requires `.js` import extensions across all files)
   - Added `"types": ["node"]` for TS6 default change
   - Clean compilation, 231 tests passing

### Sprint 2: Chat Control and Stream Quality (P1) -- COMPLETED 2026-03-31

Focus: Make Alex's responses richer and agent delegation more powerful.

4. ~~**F6**: Add `thinkingProgress`, `warning`, `confirmation`, `filetree` to response streams~~
   - Created `streamEnrichment.ts` with `streamWarning()` (proposed API fallback to markdown), `streamConfirmation()`, `streamCognitiveTree()` (stable `filetree()`), `streamProgress()`, `streamSafetyAlert()`
   - Runtime feature detection: uses `warning()` if available (VS Code 1.113+), otherwise renders as markdown blockquote
   - Wired into `coreHandlers.ts`: model warnings use `streamWarning()` instead of raw markdown; `/status` shows architecture filetree; `/dream` shows cognitive tree being scanned
   - Wired into `workflowHandlers.ts`: self-actualization model warnings use `streamWarning()`
   - `thinkingProgress()` and `confirmation()` deferred: proposed API only, not in stable `@types/vscode`
5. ~~**C1**: Add handoff declarations to agent.md files with model overrides~~
   - All 7 agents now have enriched handoffs with `model: GPT-4o` on research/documentation delegations (cost-effective routing)
   - Added Documentarian handoff to Builder, Validator, Researcher, Azure, and M365 agents (was missing)
   - Builder's `agents` allowlist expanded to include Documentarian
   - Validator's `agents` allowlist expanded to include Builder (was Documentarian only)
   - Documentarian's `agents` allowlist set to Builder + Validator (was Researcher)
6. ~~**C3**: Enable and test nested subagent chains~~
   - Added `chat.subagents.allowInvocationsFromSubagents: true` to `.vscode/settings.json`
   - Multi-hop chains enabled: Researcher -> Explore -> search_subagent; Builder -> Validator -> Explore
   - Guard: `agents` allowlists in each agent.md file prevent unbounded recursion
7. ~~**F1**: Extend `agentActivity.ts` into session trace service~~
   - Created `sessionTrace.ts`: bounded 200-event in-memory trace inspired by Copilot Chat's 3-layer trajectory architecture
   - Event types: `model-request`, `model-response`, `tool-call`, `tool-result`, `agent-handoff`, `stream-enrichment`, `error`
   - Convenience methods: `modelRequest()`, `toolCall()`, `handoff()`, `getSummary()`, `formatSummaryMarkdown()`
   - Wired into `participant.ts`: model requests and tool calls (success/failure) are traced
   - `/status` command now shows session trace summary table when events exist

### Sprint 3: Quality and Polish (P2-P3) -- COMPLETED 2026-03-31

Focus: Close quality gaps, improve documentation, quick wins.

8. ~~**P3**: Implement conversation summarization in prompt engine~~
   - Refactored `buildConversationHistoryLayer` in `promptEngine.ts` to use a 2-tier strategy
   - Last 4 turns (2 exchanges) kept verbatim for immediate context
   - Older turns (3-N) compressed into a summary paragraph: `"[Earlier: 3 questions, 3 responses. Topics: ...]"`
   - Extracted helpers: `extractResponseText()`, `compressTurn()`, `summarizeOlderTurns()`
   - Token budget reduced from ~600 tokens (8 verbatim turns) to ~300 tokens (summary + 4 verbatim)
9. ~~**C2**: Persona-driven follow-ups~~
   - Enhanced `alexFollowupProvider` with content-based follow-up selection for `general` command
   - Pattern detection on `coverageTopic`: code/debug -> verify/review; architecture -> status/trade-offs; learning -> deeper/learn session
   - Replaces generic "profile/learn" suggestions with contextually relevant next actions
10. ~~**C4**: Promote hooks H10 (output secret scan) and H13 (breaking change detector)~~
    - Created `output-secret-scan.cjs` (H10): PostToolUse hook scanning for 11 secret patterns (AWS, Azure, GitHub, npm, Bearer, private keys, connection strings)
    - Created `breaking-change-detector.cjs` (H13): PreToolUse hook detecting edits to 7 critical files (extension.ts, package.json, shared types, copilot-instructions.md) and exported symbol modifications
    - Both hooks use `additionalContext` injection (warn, don't block) as per the Copilot hook API
    - Registered in `.github/hooks.json`: H10 in PostToolUse array, H13 in PreToolUse array
    - Tested both: clean pass with no secrets, detection with AWS keys, detection with extension.ts edits
11. ~~**F2**: Add plugin install URL to docs~~
    - Added "Quick Install" section to `WORKING-WITH-ALEX.md` with marketplace search and CLI install commands
12. ~~**F3**: Reference Chat Customizations editor in user docs~~
    - Added `Chat: Open Chat Customizations` to the Getting Help section in `WORKING-WITH-ALEX.md`
    - Explains it as the easiest way to browse, create, and manage Alex's trifectas visually
13. ~~**G1**: Audit workflow prompts for completeness~~
    - Audited 52 prompts: identified 21 multi-step prompts lacking TODO tracking or compile gates
    - Enhanced `/release` prompt with full 6-phase workflow: Brain QA -> version bump (6 files) -> compile+test -> package -> publish -> post-release
    - Added explicit quality gates: "Do NOT proceed until clean"
14. ~~**G3**: Add compilation check discipline to instructions~~
    - Added "Compilation Check Discipline" rule to `code-review-guidelines.instructions.md` (applied to all code files via `applyTo`)
    - Added "Principle 5: Compilation Check Discipline" to Builder agent (`alex-builder.agent.md`)
    - Rule: always verify `npx tsc --noEmit` and test suite before declaring work complete
