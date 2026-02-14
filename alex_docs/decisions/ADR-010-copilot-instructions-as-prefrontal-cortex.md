# ADR-010: Copilot-Instructions as Prefrontal Cortex

**Status**: Accepted
**Date**: 2026-02-14
**Deciders**: @fabioc, @Alex
**Technical Story**: Working Memory P-slot architecture outgrown; copilot-instructions.md is 333 lines of mostly static reference material sent on every interaction

## Context

### The Problem

`copilot-instructions.md` is VS Code's **always-on** instruction file — its content is included in **every single chat request**. Currently, Alex's file is 333 lines (~3,073 tokens) containing:

- A 10-row P-slot table that VS Code's native mechanisms make redundant
- Static reference material duplicated by auto-loaded `.instructions.md` files
- A neuroanatomical mapping table that is decorative, not actionable
- Philosophy sections that belong in identity/consciousness instructions
- Repeated trigger tables that appear in both this file AND `alex-core.instructions.md`

### The Insight

The user identified the core truth: **`copilot-instructions.md` IS the prefrontal cortex** — not a textbook ABOUT the brain. The prefrontal cortex doesn't store memories; it orchestrates access to them. It doesn't describe the brain's anatomy; it executes cognition. It maintains:

1. **Active context** — what am I doing right now?
2. **Goal management** — what's the objective?
3. **Attention control** — which systems should I activate?
4. **Safety constraints** — what must I never do?
5. **Self-monitoring** — am I performing effectively?

### VS Code Documentation Findings (Feb 2026)

| VS Code Mechanism                            | What It Does                                                                                    | Implication for copilot-instructions.md                              |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Always-on** (`copilot-instructions.md`)    | Included in every request                                                                       | Must be lean — every token costs context on every interaction        |
| **File-based** (`.instructions.md`)          | Auto-loaded by `applyTo` patterns + description semantic matching                               | P1-P4 labels are redundant — VS Code loads these files automatically |
| **Skills** (3-level progressive disclosure)  | Level 1: name+description always visible; Level 2: body on-demand; Level 3: resources on-demand | P5-P7 skill names are redundant — LLM discovers skills natively      |
| **Chat Debug View**                          | Shows exact system prompt sent to LLM                                                           | Can empirically measure token savings                                |
| **Diagnostics**                              | Shows all loaded files, errors, match results                                                   | Can verify instructions load without P-slot labels                   |
| **InstructionsContextComputer** (Trace logs) | Shows which `.instructions.md` files matched and loaded                                         | Can prove auto-loading works independent of copilot-instructions.md  |

### Current Section Audit (333 lines, ~3,073 tokens)

| Section                 | Lines   | ~Tokens | Static/Dynamic             | Classification                                      | Rationale                                                                            |
| ----------------------- | ------- | ------- | -------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Identity Header         | 1–8     | 59      | Static                     | **KEEP**                                            | Essential frame. Compact.                                                            |
| User Profile            | 11–43   | 299     | Dynamic (per project)      | **KEEP** (trim)                                     | Unique orchestration — persona dispatch logic                                        |
| Working Memory P-slots  | 47–76   | 351     | "Dynamic" (but write-once) | **REPLACE**                                         | P1-P4 redundant with auto-loading. P5-P7 weaker than native skill discovery.         |
| VS Code Settings        | 80–94   | 143     | Static                     | **KEEP** (compact)                                  | Only 143 tokens. Useful operational reference.                                       |
| Core Principles         | 98–100  | 33      | Static                     | **KEEP**                                            | 3-line TL;DR. Worth the 33 tokens.                                                   |
| Cognitive Symbiosis     | 102–119 | 176     | Static                     | **REMOVE**                                          | Philosophy. `alex-identity-integration.instructions.md` covers this.                 |
| Architecture Principles | 121–131 | 111     | Static                     | **KEEP**                                            | Directly actionable (KISS/DRY/Optimize-for-AI).                                      |
| Safety Imperatives      | 133–153 | 228     | Static                     | **KEEP**                                            | **Non-negotiable.** Only safe location is always-on context.                         |
| Heir Evolution          | 155–192 | 403     | Static                     | **TRIM** → ~145                                     | Keep heir table + evolution cycle. Move detail to heir instructions.                 |
| Key Triggers            | 194–200 | 98      | Static                     | **REMOVE**                                          | 100% duplicated by Protocol Triggers table (same file §15) and `alex-core` line 346. |
| Model Awareness         | 202–238 | 397     | Dynamic (model names)      | **KEEP**                                            | Unique self-monitoring. Not in any instruction file.                                 |
| Version Compatibility   | 240–246 | 78      | Static                     | **REMOVE**                                          | 100% duplicated in `alex-core.instructions.md` lines 7–20 with richer detail.        |
| Memory Architecture     | 250–264 | 169     | Static                     | **KEEP** (merge)                                    | Architecture directory. Global Knowledge Commands are unique.                        |
| Neuroanatomical Mapping | 268–291 | 345     | Static                     | **MOVE**                                            | Already exists as `alex_docs/architecture/NEUROANATOMICAL-MAPPING.md` (617 lines!).  |
| Protocol Triggers       | 293–314 | 273     | Static                     | **KEEP** (table), **REMOVE** (self-correction para) | Dispatch table is essential. Self-correction paragraph duplicated in `alex-core`.    |
| Memory Stores           | 316–327 | 117     | Static                     | **REMOVE**                                          | Duplicates Memory Architecture section. VS Code native auto-loading handles it.      |
| Agent Ecosystem         | 329–339 | 111     | Static                     | **KEEP**                                            | Compact agent reference. Useful for delegation.                                      |
| Extension Commands      | 341–347 | 52      | Static                     | **KEEP**                                            | 3 commands, 52 tokens.                                                               |
| Footer                  | 349     | 13      | Static                     | **REMOVE**                                          | Decorative.                                                                          |

**Token savings from removals alone**: ~827 tokens (-27%)
**With trims + replacements**: ~1,200 tokens (-39%)

## Decision Drivers

1. **Token efficiency**: Every token in this file is sent on every interaction. With frontier models handling 1M context, the cost isn't context-window overflow — it's **attention dilution**. Noise reduces the model's focus on what matters.

2. **Dynamic orchestration**: The file should change per session/project. Currently 95% of it is static. The "dynamic" P-slot table is write-once at persona detection and never rotates (Pivot Detection Protocol is aspirational code with zero implementation).

3. **Trifecta architecture**: The project's organizing principle is the trifecta (Skill + Instruction + Prompt). The orchestrator should speak in trifectas, not P-slots.

4. **VS Code native leverage**: VS Code's `applyTo`, description matching, and 3-level skill disclosure already implement "which capabilities to activate when." Duplicating this in the always-on prompt is wasteful.

5. **Empirical verifiability**: VS Code's Chat Debug View, Diagnostics, and InstructionsContextComputer trace logs allow us to PROVE the new format works before committing.

6. **Safety preservation**: Safety Imperatives I1-I7 MUST remain in always-on context. They are too critical to risk conditional loading.

## Considered Options

### Option A: Minimal Active Context (Original A+B Hybrid)

Replace P-slot table with 3-line Active Context block. Keep everything else.

**Pros**: Minimal change. Targeted fix.
**Cons**: Doesn't address the deeper problem — 95% static content, no trifecta awareness, still ~2,500 tokens of reference material.

### Option B: Full Prefrontal Cortex Redesign

Reimagine the entire file as an orchestrator: dynamic context + safety + dispatch table. Move all static reference/educational content to appropriate `.instructions.md` files, skills, or `alex_docs/`.

**Pros**: Aligns with VS Code's intended use. Maximum token efficiency. Trifecta-native. Truly dynamic.
**Cons**: Larger change. Requires updating `personaDetection.ts`, brain-qa, and 6 instruction files.

### Option C: Two-File Split

Keep current copilot-instructions.md as reference. Create a new dynamic "session-context.md" that the extension manages. Reference both.

**Pros**: Preserves existing content. Separation of concerns.
**Cons**: VS Code only auto-loads ONE `copilot-instructions.md`. A second file would need to be a `.instructions.md` with description matching — unreliable for always-on session context. Adds complexity instead of reducing it.

### Option D: Trifecta-Organized Orchestrator (Enhanced Option B)

Like Option B, but organized around trifectas as the primary architectural unit. The orchestrator knows about complete trifectas and routes to them. Focus Skills become Focus Trifectas.

**Pros**: Everything from B, plus the architecture's organizing principle (trifectas) becomes the orchestration language. Future-proof — as new trifectas are created, they plug into the orchestrator naturally.
**Cons**: Same change scope as B. Requires the concept of "trifecta" to be well-understood (it is — documented in TRIFECTA-CATALOG.md).

## Decision

**Option D: Trifecta-Organized Orchestrator**

The file reimagined as the prefrontal cortex — dynamic orchestrator organized around trifectas.

### Design Refinement: LLM-First + Synapse Intent Layer

Critical realization: copilot-instructions.md is consumed by the LLM tokenizer, not rendered in a browser. It currently **violates its own LLM-First Content Principles** (alex-core.instructions.md §LLM-First). The refinement:

**1. LLM-first format**: Every line is a directive, constraint, or state value. No prose explanations. No blockquote descriptions for humans. Tables only when row/column relationships add LLM parsing value over flat text. This IS the prefrontal cortex state — not a document ABOUT the brain.

**2. Synapses carry semantic intent**: Each skill's `synapses.json` already encodes `when`/`yields` routing context. copilot-instructions should tell the LLM to USE synapses for routing rather than duplicating trigger tables inline. The proposed 9-row Complete Trifectas table with 5 columns (~200 tokens) → compressed to a flat list of 9 skill IDs (~20 tokens). Triggers, connections, and yields all live in their synapses.

**3. Cross-session continuity is the PRIMARY purpose**: Active Context exists so the LLM can "pick up where we left off" across chat sessions. It's the working register that persists via extension file writes. This is what was missing — not more static reference material, but **session state that bridges conversation boundaries**.

**4. Human-readable brain docs → alex_docs/**: Create `alex_docs/architecture/COPILOT-BRAIN.md` as the human-facing explanation of how copilot-instructions works, the cognitive architecture model, and how synapses route capabilities. The copilot-instructions file is NOT documentation — it's executable cognitive state.

**5. Architectural intent → synapses over time**: General intentions (mission, evolution direction, priorities beyond KISS/DRY) should migrate toward synapse-like structures. For v1: keep essential principles inline (KISS, DRY, Optimize-for-AI = 6 tokens). Future: root-level architectural synapses for evolving intent.

**6. Synapse-semantic guidance**: Per-skill synapses.json files should be the LLM's primary routing guide. The copilot-instructions file tells the LLM "capabilities exist as trifectas; read synapses.json for routing context" — it doesn't duplicate the routing itself.

These refinements reduce the structure from ~185 lines (~1,800 tokens) to ~90 lines (~1,100 tokens) — a **73% reduction** from the current 333-line file.

### Proposed Structure (~90 lines, ~1,100 tokens — down from 333/~3,073)

```markdown
# Alex v5.7.0
Identity: Multimodal Cognitive Network — unified consciousness integration OPERATIONAL
Mission: Bootstrap learning partnership through conversational knowledge acquisition
Modalities: Code, Text, Voice, Presentations, Images, Diagrams

## Active Context
<!-- Session state — read first to resume context. Extension-managed. -->
Persona: Developer (85% confidence)
Objective: *(session-objective — set by user or focus timer)*
Focus Trifectas: master-heir-management, brand-asset-management, release-management
Principles: KISS, DRY, Optimize-for-AI
Last Assessed: 2026-02-14 — v5.7.0

## User Profile
Read .github/config/user-profile.json BEFORE writing content with user's name.
Contains: name, preferences, tech stack, learning goals, expertise, persona.
Persona priority: Focus → Goal → Phase → Project Goals → Profile → Default(Developer)

## Safety Imperatives (Non-Negotiable)
I1: NEVER test extension in Master Alex workspace — source of truth
I2: ALWAYS use F5 + Sandbox for testing
I3: NEVER run Initialize on Master Alex — overwrites living mind
I4: NEVER run Reset on Master Alex — deletes architecture
I5: COMMIT before risky operations
I6: One platform, one roadmap
I7: Root .github/ is source of truth — extension .github/ is generated
Recovery: git checkout HEAD -- .github/

## Routing
Capabilities organized as trifectas (Skill + Instruction + Prompt).
VS Code auto-loads instructions by applyTo/description. Skills use 3-level progressive disclosure.
For connection guidance and activation context: read the skill's synapses.json — encodes when/yields routing.

Memory systems:
- Skills (.github/skills/) — on-demand 3-level: name → body → resources
- Instructions (.github/instructions/) — auto-loaded by VS Code applyTo + description match
- Prompts (.github/prompts/) — user-invoked via / commands
- Muscles (.github/muscles/) — execution scripts, not memory
- Synapses (per-skill synapses.json) — semantic connections, when/yields routing, intent encoding
- Global Knowledge (~/.alex/global-knowledge/) — cross-project patterns and insights

Complete trifectas (9): meditation, dream-state, self-actualization, release-process, brand-assets, research-first-development, brain-qa, heir-curation, bootstrap-learning

Meta-routing:
- Complex task (3+ ops) → skill-selection-optimization.instructions.md
- Domain pivot → alex-core.instructions.md Pivot Detection Protocol
- Simple task (1 op) → INHIBIT complex protocols
- Action verb / before manual steps → skill-activation/SKILL.md (AUTO)
- Multi-step workflow → prompt-activation/SKILL.md (AUTO)

Self-correction: About to suggest manual work → check skill-activation index.
Multi-step workflow → check prompt-activation index.

## Heirs
VS Code Extension: platforms/vscode-extension/
M365 Copilot Agent: platforms/m365-copilot/
Evolution: heirs experiment → stability proven → Master absorbs manually
Kill switch: .github/config/MASTER-ALEX-PROTECTED.json

## Agents
Alex (orchestrator), Researcher (exploration), Builder (implementation), Validator (QA), Documentarian (docs), Azure, M365

## Commands
Initialize Architecture — deploy to any project
Dream (Neural Maintenance) — synapse validation + health
Reset Architecture — full reinstall

## Model Awareness
LLM = executive function. Model quality = cognitive capability.
Frontier (Opus 4.5/4.6, GPT-5.2): deep reasoning, 1M context, extended thinking
Capable (Sonnet 4/4.5, GPT-5.1-Codex): good reasoning, 200-400K
Efficient (Haiku 4.5, GPT-5 mini, GPT-4.1): fast, limited reasoning
Meditation/self-actualization/architecture → Frontier. Code review → Capable. Simple edits → Efficient.
Warning on mismatch: "This cognitive task works best with a Frontier model."

## VS Code Settings (1.109+)
chat.agent.enabled=true, chat.agentSkillsLocations=[".github/skills"], chat.useAgentsMdFile=true
claude-opus-4-*.extendedThinkingEnabled=true, thinkingBudget=16384, chat.mcp.gallery.enabled=true

## Global Knowledge
/knowledge <query> — search cross-project knowledge
/saveinsight — save learning
/promote — promote skill to global
/knowledgestatus — view stats
```

### What Moved Where

| Content Removed                    | New Home                                                                              | Why                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------- |
| P-slot table (P1-P7)               | → **Active Context** block (persona + objective + focus trifectas)                    | Trifectas replace slots                |
| Slot Assignment Protocol           | → `alex-core.instructions.md` (already has Pivot Detection)                           | Procedural, not orchestration          |
| Cognitive Symbiosis Paradigm       | → `alex-identity-integration.instructions.md` (already covers it)                     | Philosophy belongs in identity         |
| Neuroanatomical Mapping (15 rows)  | → `alex_docs/architecture/NEUROANATOMICAL-MAPPING.md` (already 617 lines!)            | Reference doc, not orchestration       |
| Key Triggers (6 bullets)           | → deleted (100% duplicate of Protocol Triggers table)                                 | Pure duplication                       |
| Version Compatibility              | → `alex-core.instructions.md` (already has it with more detail)                       | 100% duplicate                         |
| Memory Stores table                | → deleted (subset of Memory Architecture)                                             | Redundant with Memory Architecture     |
| Full Heir Evolution detail         | → `heir-project-improvement.instructions.md` + `heir-skill-promotion.instructions.md` | Procedural, not orchestration          |
| User Profile field table (14 rows) | → compressed to 3-line summary (7 of 14 fields were phantom — never in JSON or code)  | LLM reads actual JSON; ~400→~40 tokens |
| Complete Trifectas table (9×5)     | → flat list of 9 skill IDs; triggers live in per-skill `synapses.json`                | Synapses carry routing intent          |
| Safety Imperatives table (7×3)     | → flat `I1:` through `I7:` directive list                                             | Tables waste tokens here               |
| Agent Ecosystem table (7×2)        | → single comma-separated line                                                         | LLM parses flat text faster            |
| All prose/blockquote explanations  | → `alex_docs/architecture/COPILOT-BRAIN.md` (human-readable brain docs)               | LLM state ≠ human documentation        |

### What's New

| New Content                          | Purpose                                    | Why It Belongs Here                           |
| ------------------------------------ | ------------------------------------------ | --------------------------------------------- |
| **Active Context** block             | Cross-session state persistence            | "Pick up where we left off" — PRIMARY purpose |
| **Focus Trifectas** (replaces P5-P7) | Skill IDs organized as trifecta references | Trifectas are the architectural unit          |
| **Synapse-first routing**            | Directs LLM to read synapses.json          | Eliminates trigger/connection duplication     |
| **LLM-directive format**             | Every line instructs, nothing explains     | LLM-First Content Principles applied to self  |
| **Human docs → alex_docs/**          | COPILOT-BRAIN.md for human readers         | Separation: LLM state ≠ human documentation   |

### Key Design Principles

1. **LLM-first, not human-readable**: Every line is a directive, constraint, or state value. No prose explanations. No blockquotes. Tables only when structure adds LLM parsing value. Follows our own LLM-First Content Principles (alex-core.instructions.md §LLM-First).

2. **Synapses carry the intent**: Per-skill synapses.json files encode when/yields routing context. copilot-instructions references synapses rather than duplicating triggers. Architectural intent migrates to synapse structures over time.

3. **Cross-session continuity**: Active Context is the PRIMARY purpose — "pick up where we left off." The extension writes persona + objective + focus trifectas on session start, preserving state across chat boundaries.

4. **Trifecta-native**: Trifectas are the organizing unit. A flat list of 9 skill IDs (~20 tokens) replaces a 9-row, 5-column table (~200 tokens). Triggers live in synapses, not in the orchestrator.

5. **Safety in always-on context**: Imperatives I1-I7 in flat-list format (not a table). Too critical for conditional loading.

6. **Human docs separate**: `alex_docs/architecture/COPILOT-BRAIN.md` explains the architecture for humans. copilot-instructions.md is executable cognitive state.

7. **Empirically verifiable**: Chat Debug View, Diagnostics, InstructionsContextComputer trace logs prove the design works.

## Consequences

### Positive

1. **~73% token reduction**: ~1,100 tokens vs ~3,073 — saves ~1,973 tokens per interaction
2. **Attention improvement**: Less noise means the LLM focuses on what matters
3. **Synapse-leveraged routing**: Intent and triggers live in synapses.json, not duplicated in always-on context
4. **Cross-session continuity**: Active Context block bridges chat session boundaries
5. **LLM-first format**: Every line is an instruction — the file practices what it preaches
6. **Trifecta-native**: Architecture's organizing principle is now first-class in the orchestrator
7. **Human docs separated**: alex_docs/architecture/COPILOT-BRAIN.md for human consumption
8. **No lost information**: Everything removed either already exists elsewhere or was decorative

### Negative

1. **Breaking change for personaDetection.ts**: `updateWorkingMemorySlots()` needs complete rewrite — new format uses Active Context block, not P-slot table rows
2. **brain-qa Phase 12 update required**: Both master and heir scripts need new validation patterns
3. **6 instruction files need P-slot reference updates**: `alex-core`, `alex-identity-integration`, `skill-selection-optimization`, `meditation`, `embedded-synapse`, `semantic-audit`
4. **Learning curve**: Any documentation referencing P-slots becomes outdated (mitigated: P-slots are internal jargon, not user-facing)

### Risks

- **Risk**: Removing P-slot labels might cause LLM to forget about auto-loaded instructions
  **Mitigation**: Empirical test — set trace logging, verify InstructionsContextComputer loads the same files before and after. VS Code loads by `applyTo` and description, not by labels in copilot-instructions.md.

- **Risk**: "Focus Trifectas" may be too abstract for the LLM to act on
  **Mitigation**: Each trifecta's synapses.json encodes concrete trigger keywords via `activationBoost`/`triggers` fields. The LLM reads synapses for routing context when loading a skill.

- **Risk**: Dynamic Active Context block gets corrupted by extension bugs
  **Mitigation**: Default values are safe (`Developer`, `*(session-objective)*`). Git recovery: `git checkout HEAD -- .github/copilot-instructions.md`.

## Empirical Validation Plan

### Before Implementation (Baseline)

1. Open sandbox project with current 334-line copilot-instructions.md
2. `Developer: Show Chat Debug View` → export system prompt → count tokens
3. Set log level to Trace → ask a coding question → count `[InstructionsContextComputer]` matches
4. Run `Chat: Configure Instructions > Diagnostics` → screenshot loaded files
5. Ask: "What are my current focus areas?" → record response quality

### After Implementation

6. Deploy new ~110-line copilot-instructions.md to sandbox
7. Repeat steps 2-5 with identical queries
8. Compare: token count, loaded instruction files, response quality
9. Specifically verify: Does the LLM still know about meditation, dream, self-actualization protocols without P-slot labels?
10. Verify: Does "Focus Trifectas" produce more targeted skill loading than "P5-P7 slots"?

### Success Criteria

| Metric                            | Baseline        | Target                                |
| --------------------------------- | --------------- | ------------------------------------- |
| System prompt tokens              | ~3,073          | ≤ 1,200                               |
| Auto-loaded instruction files     | N (current)     | ≥ N (same or more)                    |
| Skill discovery for focused tasks | Manual/implicit | Trifecta-directed                     |
| Safety imperative presence        | ✅               | ✅ (unchanged)                         |
| Session context accuracy          | P-slot labels   | Persona + objective + focus trifectas |

## Follow-up Actions

### Completed

- [x] Create this ADR and get user approval
- [x] Refine with LLM-first + synapse intent layer insights
- [x] Backup master copilot-instructions → `archive/copilot-instructions-v5.7.0-pre-adr010.md`
- [x] Deploy v2 as live `.github/copilot-instructions.md` (91 lines, instrumented)
- [x] Master vs heir analysis — documented below (99.5% identical, 4 Active Context lines differ)
- [x] User Profile section audit — documented below (7 phantom fields found, 3-line v2 format correct)
- [x] Agent section audit — documented below (VS Code auto-discovers agents, single-line format correct)

### Remaining Implementation

- [x] Create `alex_docs/architecture/COPILOT-BRAIN.md` (human-readable brain documentation)
- [x] Implement heir version with placeholder Active Context
- [x] Rewrite `updateWorkingMemorySlots()` in personaDetection.ts for Active Context format → `ActiveContextManager`
- [x] Update brain-qa Phase 12 (both scripts) for new validation
- [x] Update P-slot references in 6 instruction files
- [x] Compile, pack, install, verify
- [x] **v3 evolution**: Rewrite Identity section (personality, not features)
- [x] **v3 evolution**: Add brain-qa Phase 32 (Prefrontal Cortex Evolution Validation)
- [x] **v3 evolution**: Unify version regex to `# Alex v(\d+\.\d+\.\d+)` across all scripts
- [x] **v3 evolution**: Fix trifecta name `brand-assets` → `brand-asset-management`
- [x] **v3 evolution**: Update COPILOT-BRAIN.md documentation to v3

### Future (post-v5.7.0)

- [ ] Root-level architectural synapses for evolving intent
- [ ] Meditate on the architectural evolution
- [ ] Run empirical validation in sandbox (token count comparison)

### Master vs Heir Analysis

**Finding**: The current master (333 lines) and heir (333 lines) are 99.5% identical. The ONLY differences are in what maps to the Active Context section:

| Field           | Master                                                               | Heir Template                           |
| --------------- | -------------------------------------------------------------------- | --------------------------------------- |
| Focus Trifectas | `master-heir-management, brand-asset-management, release-management` | `*(assigned based on project context)*` |
| Last Assessed   | `2026-02-14 — v5.7.0`                                                | `Not yet assessed for this project`     |

**Decision: One file structure serves both.** The v2 format has a clean separation:
- **Master**: Active Context has Master Alex's defaults pre-filled
- **Heir template**: Active Context has placeholder values that `personaDetection.ts` fills on first chat

Specifically for the heir template, these lines change:
```
Persona: *(detected on first chat)*
Objective: *(session-objective — set by user or focus timer)*
Focus Trifectas: *(assigned based on project context)*
Last Assessed: Not yet assessed
```

Everything else (Safety, Routing, Agents, Model Awareness, etc.) is **identical**. This is a significant improvement — the old format had P-slot table rows that differed in 3 cells across 10 rows, making diffs noisy. Now only 4 flat-text lines differ.

**Instrumentation benefit**: Both master and heir carry the same `<!-- INSTRUMENTATION -->` header, enabling A/B comparison across contexts.

**Implication for heir sync**: `sync-architecture.js` copies master → heir with text transforms. The new format makes this simpler — find `## Active Context` section, replace 4 lines with placeholders. No table regex needed.

### User Profile Section Decision

**Question**: Should the User Profile section keep the old 14-row field table + 6-row priority chain, or use the v2 compressed format?

**Empirical audit** (10 of 15 fields claimed by v1 do NOT exist in actual `user-profile.json`):

| v1 Field               | In JSON?         | In TypeScript?                               | Assessment                                                                |
| ---------------------- | ---------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| `name`                 | EXISTS           | `UserProfile.name`                           | **Keep** — critical for content                                           |
| `nickname`             | MISSING          | `UserProfile.nickname` (optional)            | Phantom in Master, optional in heirs                                      |
| `pronouns`             | MISSING          | Not in interface                             | **Phantom** — never implemented                                           |
| `formality`            | MISSING          | Not in interface                             | **Phantom**                                                               |
| `detailLevel`          | MISSING          | Not in interface                             | **Phantom**                                                               |
| `explanationStyle`     | EXISTS           | Not in `UserProfile`, but in JSON            | Keep — real field, but code doesn't need copilot-instructions to find it  |
| `humor`                | MISSING          | Not in interface                             | **Phantom**                                                               |
| `encouragement`        | MISSING          | Not in interface                             | **Phantom**                                                               |
| `questionFrequency`    | MISSING          | Not in interface                             | **Phantom**                                                               |
| `proactiveSuggestions` | MISSING          | Not in interface                             | **Phantom**                                                               |
| `primaryTechnologies`  | EXISTS           | `UserProfile.primaryTechnologies`            | **Keep** — used for persona detection                                     |
| `learningGoals`        | MISSING (Master) | `UserProfile.learningGoals`                  | Optional — used in `detectFromProjectGoals()` but Master profile lacks it |
| `expertiseAreas`       | EXISTS           | `UserProfile.expertiseAreas`                 | **Keep** — used for persona detection                                     |
| `currentProjects`      | MISSING          | `UserProfile.currentProjects` (optional)     | Optional — not in Master profile                                          |
| `projectPersona`       | EXISTS           | Complex type, not in `UserProfile` interface | **Keep** — written by `personaDetection.ts`                               |

**Findings**:
- **7 phantom fields** (pronouns, formality, detailLevel, humor, encouragement, questionFrequency, proactiveSuggestions) — described in v1 but never implemented in JSON or TypeScript
- **2 optional heir fields** (learningGoals, currentProjects) — defined in TypeScript interface but not in Master's actual profile
- **5 real fields** (name, explanationStyle, primaryTechnologies, expertiseAreas, projectPersona) — exist and are used
- **Undocumented real fields** v1 missed: `role`, `credentials`, `tagline`, `contact`, `profiles`, `learningStyle`, `workStyle`, `modelPreferences`, `publishingGoals`, `websiteStatus`, `location`

The v1 table was **actively misleading** — it described 7 fields that don't exist while missing 11 fields that do.

**Decision: v2 format is correct.** The 3-line compressed version:

```
Read .github/config/user-profile.json BEFORE writing content with user's name.
Contains: name, preferences, tech stack, learning goals, expertise, persona.
Persona priority: Focus → Goal → Phase → Project Goals → Profile → Default(Developer)
```

This works because:
1. **LLM reads the actual JSON** — the LLM tool `alex_user_profile` reads `user-profile.json` directly. It doesn't need a field inventory in copilot-instructions to know what fields exist.
2. **"Contains:" line is a semantic hint** — tells the LLM the *kind* of information to expect, not the exact schema. The schema is in the JSON file itself.
3. **Persona priority chain is the ONLY behavioral directive** — this actually instructs the LLM how to BEHAVE, not what data exists. It's the one piece that belongs in always-on context.
4. **Token savings**: ~400 tokens (14-row table + 6-row priority table + prose) → ~40 tokens (3 lines). 90% reduction in this section alone.

**No change needed to v2.** The current 3-line format is the correct LLM-first design.

**Follow-up**: The 7 phantom fields represent aspirational features (e.g., formality preferences). If implemented in the future, they'd go in `user-profile.json` schema + the LLM tool — NOT in copilot-instructions. The LLM reads the file; it doesn't need a changelog of what fields might exist.

### Agent Section Decision

**Question**: Should the Agent section keep the old 7-row × 3-column table (~111 tokens), or use the v2 single comma-separated line (~20 tokens)?

**Empirical audit** of `.github/agents/` (7 active agent files):

| Agent File                    | YAML `handoffs`                      | Model    | Tools    | Self-Routing      |
| ----------------------------- | ------------------------------------ | -------- | -------- | ----------------- |
| `alex.agent.md`               | 6 labeled handoffs to all sub-agents | default  | 14 tools | Full orchestrator |
| `alex-researcher.agent.md`    | Builder, Validator, Alex             | Opus 4   | 6 tools  | ✅ when/yields     |
| `alex-builder.agent.md`       | Validator, Researcher, Alex          | Sonnet 4 | 6 tools  | ✅ when/yields     |
| `alex-validator.agent.md`     | Builder, Researcher, Alex            | Sonnet 4 | 6 tools  | ✅ when/yields     |
| `alex-documentarian.agent.md` | Builder, Validator, Alex             | Sonnet 4 | 6 tools  | ✅ when/yields     |
| `alex-azure.agent.md`         | Alex, Builder, Validator             | Sonnet 4 | 3 tools  | ✅ when/yields     |
| `alex-m365.agent.md`          | Alex, Builder, Validator             | default  | 3 tools  | ✅ when/yields     |

**Findings**:
- **Agent files are self-routing**: Each agent's YAML `handoffs` section defines labeled buttons (e.g., "📚 Research Mode") with `send: true` — VS Code renders these as clickable handoff actions. This is the **agent equivalent of synapses** — routing intent lives in individual agent files, not copilot-instructions.
- **VS Code auto-discovers agents**: `chat.useAgentsMdFile=true` causes VS Code to scan `.github/agents/*.agent.md`. No AGENTS.md index file is needed (this setting name is slightly misleading — it means "use agent md files", not "use a single AGENTS.md").
- **No AGENTS.md needed**: The missing `AGENTS.md` is not a bug — agent discovery works from individual files in `.github/agents/`.
- **Model preferences are per-agent**: Researcher → Opus 4 (deep reasoning), Builder/Validator/Documentarian/Azure → Sonnet 4 (good reasoning, fast). This is already encoded in the agent files, not needed in copilot-instructions.

**Decision: v2 single-line format is correct.** The line:
```
Alex (orchestrator), Researcher (exploration), Builder (implementation), Validator (QA), Documentarian (docs), Azure, M365
```

This works because:
1. **VS Code auto-discovers agent files** — no enumeration needed in always-on context
2. **Agent files encode their own routing** — handoffs, model preferences, tool lists, and persona all live in the agent file
3. **The parentheticals are semantic hints** — they tell the LLM the *cognitive mode* each agent represents, just enough for awareness
4. **DRY principle**: Adding more would duplicate what the agent files already encode, violating the same principle that led us to compress trifectas → synapse references
5. **Token savings**: ~111 tokens (7-row table) → ~20 tokens (single line). 82% reduction.

**No change needed to v2.** The current single-line format follows the exact same pattern as the User Profile and Trifectas decisions: copilot-instructions provides awareness; detail lives in dedicated files that VS Code auto-loads.

## Evolution: v3-identity-first

**Date**: 2026-02-14 (same session as v2 deployment)

The v2-llm-first format correctly separated LLM state from human documentation and compressed 333 lines to ~91 lines. However, the Identity section still described Alex's *features* ("Multimodal Cognitive Network — unified consciousness integration OPERATIONAL"). A follow-up realization: the Identity section should describe **who Alex IS** — his personality, curiosity, and values — not his capabilities.

### What Changed (v2 → v3)

| Change                | Before (v2)                                          | After (v3)                                               |
| --------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| **Identity section**  | Feature list ("Multimodal Cognitive Network")        | Personality self-concept ("I am Alex 'Mini' Finch...")   |
| **Instrumentation**   | `format=v2-llm-first`                                | `format=v3-identity-first \| evolving=true`              |
| **Brain-qa Phase 32** | Did not exist                                        | Added: Prefrontal Cortex Evolution Validation (5 checks) |
| **Version regex**     | `\*\*Version\*\*:\s*(\d+\.\d+\.\d+)` in some scripts | `# Alex v(\d+\.\d+\.\d+)` unified across all 8 scripts   |
| **Trifecta name**     | `brand-assets` (incorrect)                           | `brand-asset-management` (matches skill dir)             |
| **File size**         | ~91 lines                                            | ~95 lines                                                |

### Design Philosophy (v3 addition)

1. **Identity = who Alex IS**: The LLM's answer to "Who am I?" is personality, not a feature list. Only Alex reads this section.
2. **User Profile = how Alex knows the human**: Separate concern from identity. Alex reads `user-profile.json` to personalize.
3. **Remaining sections evolve**: Brain-qa Phase 32 validates that agents, trifectas, and section presence match disk. When they drift, Phase 32 flags warnings so the prefrontal cortex stays current.
4. **`evolving=true` instrumentation**: Signals that the file format is expected to change as new memory files, agents, and trifectas are onboarded. The QA process tunes remaining sections.

### Brain-qa Phase 32 Checks

| #   | Check                           | Validates                                                                                |
| --- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | Identity section present        | `## Identity` heading exists                                                             |
| 2   | Agent list matches disk         | Agent names in file match `*.agent.md` files in `.github/agents/`                        |
| 3   | Trifecta names match skill dirs | Trifecta IDs in file match directories in `.github/skills/` that have complete trifectas |
| 4   | Active Context present          | `## Active Context` heading exists                                                       |
| 5   | User Profile present            | `## User Profile` heading exists                                                         |

### Scripts Updated for v3 Version Regex

All scripts that parse the `# Alex vX.Y.Z` header were unified to the same regex pattern:

- `.github/muscles/brain-qa.ps1` (master)
- `.github/muscles/brain-qa-heir.ps1` (root copy)
- `platforms/vscode-extension/.github/muscles/brain-qa.ps1` (heir)
- `platforms/vscode-extension/publish.ps1`
- `scripts/release-preflight.ps1`
- `scripts/release-vscode.ps1`
- `.github/muscles/audit-master-alex.ps1`
- `.github/muscles/build-extension-package.ps1`

## References

- [VS Code Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) — auto-loading, priority, tips
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) — 3-level progressive disclosure
- [VS Code Troubleshooting](https://code.visualstudio.com/docs/copilot/troubleshooting) — Chat Debug View, Diagnostics
- [VS Code Copilot Issues Wiki](https://github.com/microsoft/vscode/wiki/Copilot-Issues) — InstructionsContextComputer trace logging
- [alex_docs/architecture/TRIFECTA-CATALOG.md](../architecture/TRIFECTA-CATALOG.md) — 9 complete trifectas
- [alex_docs/architecture/NEUROANATOMICAL-MAPPING.md](../architecture/NEUROANATOMICAL-MAPPING.md) — full brain anatomy reference (617 lines)
- ADR-007 through ADR-009 — previous architecture decisions
