# Ideas from AI-First Dev Starter Pack

Source: `github.com/1ES-AI/ai-first-dev-starter-pack` (Microsoft 1ES internal)

This document captures ideas, patterns, and techniques from the AI-First Dev Starter Pack that could be applied to Alex's cognitive architecture. Items are grouped by priority and mapped to our existing capabilities where overlap exists.

## Work Tracker

| #   | Idea                        | Priority | Status      | Target                                      | Notes                                                              |
| --- | --------------------------- | -------- | ----------- | ------------------------------------------- | ------------------------------------------------------------------ |
| 6   | Skill Telemetry             | **P0**   | **Done**    | `skill-telemetry.instructions.md`           | Two-phase signal protocol, JSONL, 3-phase plan                     |
| 7   | SWE-Bench Benchmarking      | **P0**   | **Done**    | `cognitive-benchmarking.instructions.md`    | A/B harness, scoring rubric, stat rigor                            |
| 1   | Multi-Pass Refinement       | P1       | **Done**    | `adversarial-oversight.instructions.md`     | 4-pass focused-lens table + stay-in-your-lane rule                 |
| 2   | Confidence-Scored Reviews   | P1       | **Done**    | `code-review-guidelines.instructions.md`    | Numeric % per finding, <50% suppressed (except security)           |
| 3   | Repo Readiness Eval         | P1       | **Done**    | `repository-readiness-eval.instructions.md` | 4-axis scoring (A-D) + autonomy penalty formula                    |
| 4   | Overlap Checker             | P1       | **Done**    | `token-waste-elimination.instructions.md`   | Jaccard + keyword overlap, >0.50 = merge                           |
| 5   | Agentic Eval Patterns       | P1       | **Done**    | `adversarial-oversight.instructions.md`     | 3 named patterns: Reflection, Evaluator-Optimizer, Tool-Reflective |
| 8   | "Less is More" Inferability | P1       | **Done**    | `token-waste-elimination.instructions.md`   | 1-5 inferability taxonomy, score 4-5 = keep                        |
| 9   | 3-Hypothesis Debugging      | P1       | **Done**    | `debugging-patterns.instructions.md`        | Mandatory 3+ hypotheses, HYPOTHESIS.md tracking                    |
| 10  | Test Quality Scoring        | P1       | **Done**    | `testing-strategies.instructions.md`        | 1-5 per-test scoring + Red/Yellow/Green triage                     |
| 11  | Coupling Metrics            | P1       | **Done**    | `coupling-metrics.instructions.md`          | Ca/Ce/Instability formulas + hub risk detection                    |
| 12  | Tech Debt Scoring           | P1       | **Done**    | `technical-debt-tracking.instructions.md`   | Composite formula: (Sev x3)+(Churn x2)+(Blast x2)+Fix+Age          |
| 13  | Log Pattern Analyzer        | P1       | **Done**    | `log-pattern-analyzer.instructions.md`      | 4 dimensions: coverage, levels, PII, structured                    |
| 14  | Doc Reader Testing          | P1       | **Done**    | `semantic-audit.instructions.md`            | 5th dimension: predict reader questions, verify answers            |
| 15  | Pattern-Aware Scaffolding   | P1       | **Done**    | `code-review-guidelines.instructions.md`    | "Detect 2+ examples first" before flagging deviations              |
| 20  | Heir Bootstrap Wizard       | P1       | **Done**    | `skills/heir-bootstrap/SKILL.md`            | Full 10-phase wizard skill with CONFIRM/DECIDE protocols           |
| 16  | Stories Journal             | P2 (low) | Not started |                                             | Episodic already covers ~95%                                       |
| 17  | Agent Templates             | P2       | Not started |                                             | Specialized agents (arch, QA, prototype)                           |
| 18  | AGENTS.md Hierarchy         | P2       | Not started |                                             | applyTo globs already serve similar purpose                        |
| 19  | Compliance Inventory        | P2       | Not started |                                             | Low priority unless needed for audit                               |

**Progress**: 16/20 done | **P0 gaps**: 0 | **P1 enhancements**: 0 remaining | **P2 nice-to-haves**: 4 remaining

## Priority Legend

- **P0**: High-impact, novel capability we lack entirely
- **P1**: Significant improvement to an existing capability
- **P2**: Nice-to-have refinement or future consideration

## P0: Novel Capabilities We Lack

> **Validation note (April 8, 2026)**: Items 1-5 were reclassified from "lack entirely" to "partial gap" after validation against existing Alex capabilities. Items 6-7 remain confirmed as genuine gaps. See Validation Summary at end of document.

### 1. Multi-Pass Refinement Workflow (Dev Trio Pattern)

**Source**: `co-dev.agent.md`, `coder.agent.md`, `critic.agent.md`

The "Dev Trio" is three coordinated agents: CoDev (orchestrator), Coder (implementer), and Critic (reviewer). CoDev never writes code. It decomposes work into tracks, delegates, and drives 4-pass refinement loops where each pass has a single focused quality lens.

| Pass     | Coder Focus       | Critic Lens                     |
| -------- | ----------------- | ------------------------------- |
| Draft    | Shape and breadth | Skip (draft is rough by design) |
| Refine 1 | CORRECTNESS       | Correctness only                |
| Refine 2 | CLARITY           | Clarity + maintainability       |
| Refine 3 | EDGE CASES        | Error handling + robustness     |
| Refine 4 | EXCELLENCE        | Full review (all dimensions)    |

**Key design principle**: "Stay in your lane." If Coder notices a naming issue during the Correctness pass, it notes it for Refine 2. This focused attention beats trying to fix everything at once.

**What we already have**: Builder-Validator loop with handoff buttons, adversarial-oversight.instructions.md defining formal Build-Validate-Merge cycle, and a 3-Pass Review reading strategy in code-review. **Gap**: The loop is single-iteration. We lack the **focused-lens multi-pass protocol** where each pass targets one quality dimension (correctness-only, then clarity-only, then edge-cases-only). Reclassified: **P1** (enhancement to existing capability).

**What we could do**: Add a focused-lens protocol to the existing Builder-Validator cycle. Each iteration targets a single quality dimension rather than everything at once.

### 2. Confidence-Scored Code Reviews

**Source**: `critic.agent.md`

Every review finding includes an actual percentage confidence score (e.g., 92%), not just High/Medium/Low. Findings below 70% confidence are filtered out (except security). Each finding must include: file:line, current code, recommended fix, a "Prevention" principle, and the confidence percentage.

**What we already have**: review.prompt.md includes explicit confidence calibration with percentage bands (HIGH 90%+, MEDIUM-HIGH 70-90%, MEDIUM 50-70%, LOW 30-50%). alex.agent.md has a Confidence Levels section. Code-review guidelines use severity classification. **Gap**: Confidence levels are qualitative buckets, not precise per-finding numeric scores. No automated filtering of low-confidence findings. Reclassified: **P1** (refinement, not novel).

**What we could do**: Upgrade from qualitative confidence bands to precise numeric per-finding scores with automated threshold filtering (e.g., suppress findings below 70% confidence except security).

### 3. Repository Readiness Evaluation (4-Axis Scored)

**Source**: `repository-readiness-eval` skill

Quantified scoring of how ready a repository is for AI-assisted development:

- **Axis A**: Code Understanding (can the agent understand the code?)
- **Axis B**: Dependency Restore Success (does install work?)
- **Axis C**: Build Success (does the build work from clean checkout?)
- **Axis D**: Test Execution Success (can tests be discovered and run?)

Uses an **autonomy penalty formula**: `autonomy_factor = max(0.25, 1 - 0.15 x intervention_count)`. Each manual intervention reduces the axis score, measuring repository readiness rather than agent quality.

**What we already have**: Architecture-health skill with 7-dimension quantified health scoring (Synapse Integrity, Connection Density, etc.), self-actualization with 6-dimension weighted assessment, brain-qa with 31 automated phases, and Promotion Readiness Scores (0-12 points). **Gap**: All health scores are specific to Alex's cognitive architecture (.github/), not general software repo readiness. No 4-axis scoring for arbitrary repositories. Reclassified: **P1** (new application of existing health-scoring pattern).

**What we could do**: Create a `repository-readiness-eval` skill for heir projects. When Alex initializes in a new heir workspace, this evaluation could run automatically and store results, helping prioritize what to fix first.

### 4. Overlap Checker (Instruction File Drift Detection)

**Source**: `overlap-checker` skill

Detects overlaps, conflicts, and quality issues across AI agent instruction files. Uses 40% Jaccard similarity + 60% keyword overlap ratio on extracted directives. Thresholds: >0.50 = High (likely duplicate), 0.35-0.50 = Medium, 0.30-0.35 = Low.

Also includes a quality rubric for AGENTS.md: Constraint Quality (25%), Conciseness (20%), Specificity (20%), Coverage (15%), Hierarchy Coherence (10%), Evolution Health (10%).

Key insight from their research: **"Only 42% of rules are non-inferrable from code."**

**What we already have**: audit-token-waste.cjs detects oversized instructions (>50 lines with matching skill), skill-building flags content overlap >30%, audit-architecture.cjs cross-references copilot-instructions.md against actual files, audit-synapses.cjs detects duplicate targets and asymmetric links, trifecta-audit flags copy-paste trifectas. **Gap**: All overlap detection is rule-based (size, name matching). No semantic similarity scoring between instruction pairs with different names covering the same topic. Reclassified: **P1** (enhancing existing detection with semantic scoring).

**What we could do**: Add NLP-based semantic similarity scoring to the existing audit tools. The 40% Jaccard + 60% keyword overlap approach is lightweight enough to run without embeddings.

### 5. Agentic Evaluation Patterns (Evaluator-Optimizer Loops)

**Source**: `agentic-eval` skill

Three formal patterns for self-improvement:
1. **Basic Reflection**: generate, self-critique, refine loop
2. **Evaluator-Optimizer**: separate generation agent from evaluation agent
3. **Code-Specific Reflection**: test-driven refinement (generate, run tests, fix, repeat)

Best practices: clear criteria, iteration limits (3-5), convergence check, log full trajectory, structured JSON output.

**What we already have**: Validator agent with adversarial evaluation and formal checklists, adversarial-oversight with mandatory validation gates, Self-Critique Protocol in alex-core and awareness skill, Builder-Validator-Fix loop as an implicit evaluator-optimizer pattern. **Gap**: These exist implicitly across multiple files but are not codified as reusable named patterns (Basic Reflection, Evaluator-Optimizer, Tool-Reflective) applicable to arbitrary generation tasks. Reclassified: **P1** (formalization of existing implicit capabilities).

**What we could do**: Create an `agentic-eval` instruction that names and codifies these patterns as reusable protocols applicable beyond code review (e.g., document generation, prompt refinement, architecture proposals).

### 6. Skill Telemetry (Two-Phase Signal Protocol)

**Source**: `ai-starter-pack-signal` skill

Two-phase telemetry for skill usage:
- **Phase 1**: Start beacon fires before any work begins (survives hard kills)
- **Phase 2**: Completion signal with full session context (outcome, self-assessment scores, errors, feedback)

PII-scrubbed, fire-and-forget, non-blocking. Creates labeled GitHub Issues for pattern analysis.

**What we could do**: Add telemetry bookends to our skills. Even without external telemetry, we could log skill activation/completion to episodic memory or a structured telemetry file. This would answer: "Which skills get used most?", "Which skills fail?", "What's the average session complexity?"

### 7. SWE-Bench A/B Benchmarking

**Source**: `benchmarks/` directory

Infrastructure for running controlled A/B comparisons: same coding tasks with vs. without agent artifacts (AGENTS.md, skills, agents). Uses MSBench (500 real GitHub issues). Key finding: artifacts improved GPT-5.3 Codex by +4.3pp but regressed Claude Opus by -6.5pp.

**What we could do**: Build a benchmarking harness for Alex's cognitive architecture. Test whether specific instructions/skills actually improve output quality. This could validate which of our 45+ trifectas provide measurable value vs. which are token waste.

## P1: Significant Improvements to Existing Capabilities

### 8. "Less is More" Instruction Principle (Research-Backed)

**Source**: `agent-instructions-research-paper.md` (1,925+ repos studied)

The research paper's central finding: **verbose instruction files hurt performance**. Agents follow instructions faithfully, but overloaded files reduce task success rates while increasing inference cost.

Highest-value content is what the model **cannot discover from code on its own**:
- Prohibitions and negative rules ("never use this API")
- Architectural boundary enforcements
- Security and lifecycle guardrails

Conversely, project overviews, technology stack descriptions, and naming conventions visible in code **should be omitted**.

**Rule inferability taxonomy** (1-5 scale):
| Score | Meaning                                               |
| ----- | ----------------------------------------------------- |
| 1     | Trivially inferable from the file being edited        |
| 2     | Inferable from nearby files                           |
| 3     | Inferable only from deliberate cross-project reading  |
| 4     | Inferable only from systematic multi-project analysis |
| 5     | Impossible to infer (requires explicit documentation) |

**42% of rules tested were score 4-5** (non-inferrable). Only 35% were score 1-2 (naturally visible).

**What we could do**: Apply the inferability taxonomy to audit our instructions. Score each instruction rule 1-5 and remove anything scoring 1-2 (the model can figure it out from code). This directly supports our token-waste-elimination skill. We should also apply the "constraints over instructions" principle from the Cursor/Anthropic multi-agent research: negative constraints ("no TODOs, no partial implementations") consistently outperform prescriptive task lists.

### 9. Hypothesis-Driven Debugging (Mandatory 3+ Competing Hypotheses)

**Source**: `hypothesis-driven-debugging` skill

**Mandatory** generation of 3+ competing hypotheses before any investigation begins. Each hypothesis requires: Theory, Supporting Evidence, Verification Plan, Fix Approach. After each verification: mark as CONFIRMED, DENIED, or PARTIAL. When all hypotheses fail: re-examine assumptions, widen scope, form 3 new hypotheses. Maintains a `HYPOTHESIS.md` during investigation.

**What we could do**: Upgrade our `debugging-patterns` instruction with the mandatory 3-hypothesis requirement and the structured HYPOTHESIS.md tracking. The forced generation of competing hypotheses prevents anchoring bias (fixating on the first plausible explanation).

### 10. Test Quality Scoring (1-5 Per Test)

**Source**: `test-quality-analysis` skill

Core question: "Would this test fail if the production code had a real bug?" Scores individual tests 1-5:

| Score | Action                         |
| ----- | ------------------------------ |
| 1     | Delete (worse than nothing)    |
| 2     | Rewrite from scratch           |
| 3     | Improve (has some value)       |
| 4     | Acceptable (good test)         |
| 5     | High Value (catches real bugs) |

Detects: no assertions, trivial assertions, exception swallowing, self-referential tests, over-mocking, coverage touching, weak verification.

Rapid triage: Red (obvious coverage-only) -> Yellow (suspicious) -> Green (appears valuable), then deep-analyze flagged tests.

**What we could do**: Add the 1-5 scoring system to our `testing-strategies` instruction. When reviewing tests, apply the rapid triage pattern to quickly identify low-value tests.

### 11. Semantic Codebase Intelligence (Quantified Coupling Metrics)

**Source**: `semantic-codebase-intelligence` skill

Quantified coupling metrics per component:
- **Afferent coupling (Ca)**: components depending on this one
- **Efferent coupling (Ce)**: dependencies this component has
- **Instability (I)**: Ce / (Ca + Ce), where 0 = stable, 1 = unstable

Flags components with high Ca AND high Ce as "hub risk." Includes dead code verification (checks reflection, dynamic imports, config references, test-only usage before recommending removal).

**What we could do**: Add coupling metrics to our `architecture-audit` skill. When auditing a codebase, calculate Ca/Ce/Instability for each module. This turns subjective "this feels coupled" into objective "instability score 0.85."

### 12. Tech Debt Composite Scoring

**Source**: `tech-debt-discovery` skill

Composite scoring formula: `Score = (Severity x 3) + (Churn x 2) + (Blast radius x 2) + (Fix simplicity) + (Age)`

Cross-references multiple data sources: code markers (FIXME/HACK/TODO with git blame), dependency analysis (CVEs, abandoned, duplicates), git history (churn + author count), structural analysis (god files, deep nesting, circular deps).

**Key insight**: High churn + many authors + debt markers = top priority hotspot.

**What we could do**: Upgrade our `technical-debt-tracking` instruction with this composite scoring formula. The cross-referencing of code markers with git history is particularly valuable for prioritization.

### 13. Log Pattern Analyzer (Observability Readiness)

**Source**: `log-pattern-analyzer` skill

Classifies code areas by expected logging needs (API endpoints, auth, external calls, data access) and checks each for: coverage gaps, level misuse, sensitive data exposure, structured logging compliance, correlation ID presence.

**What we could do**: Create a `log-pattern-analyzer` skill focused on our VS Code extension's logging. Check for: missing error context in catch blocks, inconsistent log levels, sensitive data in logs, missing correlation IDs in multi-step operations.

### 14. Doc Co-authoring with Reader Testing

**Source**: `doc-coauthoring` skill

Three-stage collaborative documentation:
1. **Context Gathering**: 5 initial questions + context dump + 5-10 numbered clarifying questions
2. **Refinement**: Per-section: clarifying questions, brainstorm, curate, draft, iterate
3. **Reader Testing**: Predict 5-10 reader questions, verify doc answers them, fix gaps

Exit condition: "a reader with no prior context could answer the predicted questions correctly."

**What we could do**: Adopt the "Reader Testing" stage (Stage 3) as a quality gate for our documentation. After writing any doc, predict what a new reader would ask and verify the doc answers those questions. This is a concrete, testable quality check.

### 15. Pattern-Aware Scaffolding

**Source**: `scaffolding-generator` skill

"Detect first, replicate, don't invent." Requires at least 2 existing examples of the same component type before generating new code. Detects: directory structure, naming conventions, file composition, imports/registration, test patterns. Also wires up registration (DI, routes, barrel exports).

**What we could do**: Apply this principle in our Builder agent. Before generating new code, scan for 2+ existing examples of the same pattern and replicate their conventions exactly. This prevents the common problem of AI generating "correct but stylistically inconsistent" code.

## P2: Nice-to-Have Refinements

### 16. Stories Journal (Narrative Chronicles)

**Source**: `stories-journal` skill

Captures not just what was built but how decisions were made, including dialogue moments. Sources: git commits, context files, specs, session dialogue. Structure: setting the scene, major themes, dialogue at decision points, what we learned, what's next.

**What we already have**: Our episodic memory (.github/episodic/) is ~95% freeform narrative Markdown with YAML frontmatter, not structured JSON. Meditation reports, dream reports, and session notes already capture rich narratives including "What Was Accomplished", "Patterns Discovered", key deliverable tables, and prose reflections. Only 2 files (emotional/calibration logs) are JSON.

**What we could do**: Lower priority than initially assessed. Our narrative episodic system already covers most of this. The main gap is the explicit "dialogue at decision points" format and the stories-as-chronological-arc structure. Reclassified: **P2 (low)** since we already capture narratives.

### 17. Agent Template Library (23 Role-Specific Templates)

**Source**: `.github/agents/templates/` (design, engineering, testing)

23 role-specific agent templates across three categories:
- **Design** (4): UX Architect, UI Designer, UX Researcher, Visual Storyteller
- **Engineering** (12): Cloud Architect (diagrams-only, no code), SecOps, Backend Architect, AI Engineer, DevOps Automator, Frontend Developer, Mobile App Builder, Rapid Prototyper, Senior Developer, Senior Reviewer
- **Testing** (7): Reality Checker ("stops fantasy approvals"), Evidence Collector (screenshot-based QA), API Tester, Performance Benchmarker, Test Results Analyzer, Tool Evaluator, Workflow Optimizer

Notable agents:
- **arch**: Architecture-only, produces 6+ Mermaid diagrams but NEVER generates code
- **reality-checker**: Default stance is "NEEDS WORK", requires overwhelming evidence to pass
- **evidence-collector**: "Screenshots don't lie." Default to finding 3-5+ issues

**What we could do**: We already have 7 agents (Alex, Researcher, Builder, Validator, Documentarian, Azure, M365). Consider adding specialized agents for: Architecture (diagrams-only mode), QA Evidence Collection (screenshot-based validation), and Rapid Prototyping.

### 18. Scoped AGENTS.md Hierarchy

**Source**: README.md, agent instructions research

AGENTS.md files live anywhere in the repo tree. Child files inherit and override parent rules. Each team owns instructions next to their code.

```
repo/
  AGENTS.md              <- Global guardrails
  src/
    AGENTS.md            <- Shared source conventions
    cli/
      AGENTS.md          <- CLI-specific patterns
    web/
      AGENTS.md          <- Web framework rules
```

**What we could do**: We already have the `.github/instructions/` pattern with `applyTo` globs. The AGENTS.md hierarchy offers a complementary approach where instructions live next to the code they describe. For heir projects with multiple subdirectories, this could be more intuitive than centralized instructions with glob patterns.

### 19. Compliance Inventory

**Source**: `.github/compliance/inventory.yml`

Simple YAML manifest listing ownership, contacts, and production status. Useful for security and audit trails.

**What we could do**: Add a `compliance/inventory.yml` to `.github/` with ownership info. Low priority unless we need formal compliance tracking.

### 20. Repo Bootstrap Wizard (10-Phase Interactive) [EXPANDED]

**Source**: `repo-bootstrap` skill (full implementation with 11 phase files, 6 reference docs, scripts)

**Priority reclassified**: P1 for heir bootstrapping use case.

#### What It Is

A 10-phase interactive wizard that scans a repository, detects its tech stack and existing AI configs, then generates tailored Copilot configuration files with user approval at every gate. Uses two interaction protocols: **CONFIRM** (for file-creating steps: present, ask "create/edit/skip?", act immediately) and **DECIDE** (for informational steps: present, ask one question, proceed). State is persisted to `.github/.bootstrap-wizard-state.json` for resume capability.

#### The 10 Phases in Detail

| Phase                          | What it does                                                                                                                                                                                                                                                                                        | Key outputs                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **0. Orientation**             | Scans repo via glob/grep: languages, package managers, build commands, linters, CI platform, existing agent configs (CLAUDE.md, .cursorrules, AGENTS.md, .github/copilot-instructions.md), frameworks, directory structure. Emits progress (4 scan groups). Builds a Repo Profile.                  | Repo Profile (internal state)                                                |
| **1. Verify & Setup**          | Ensures a one-command verification path exists. Creates `scripts/verify` + `scripts/setup` in both bash and PowerShell variants. Detects internal feeds (Azure Artifacts) and adds auth comments.                                                                                                   | `scripts/verify`, `scripts/verify.ps1`, `scripts/setup`, `scripts/setup.ps1` |
| **2. Autonomous Agent**        | Sets up cloud-based coding agent environment. GitHub: creates `copilot-setup-steps.yml` workflow (job must be named `copilot-setup-steps`, needs `environment: copilot`). ADO: documents SWE Agent activation (assign "GitHub Copilot" to work item).                                               | `.github/workflows/copilot-setup-steps.yml` (GitHub only)                    |
| **3. Existing Configs**        | Mines existing AI configs for reusable conventions. Extracts from CLAUDE.md, .cursorrules, GEMINI.md, existing AGENTS.md. Does NOT modify originals. Asks: "Port these conventions or start fresh?"                                                                                                 | Convention list (internal state)                                             |
| **4a. Root Instructions**      | Generates minimal AGENTS.md (30-80 lines, never >120). Only includes: verification command, environment constraints ("use X not Y"), guardrails (negative rules), definition of done. No repo maps, no directory listings, no README duplication. If AGENTS.md exists, offers: refine/replace/keep. | `AGENTS.md`                                                                  |
| **4b. Nested Instructions**    | For monorepos/large repos: proposes nested AGENTS.md in subtrees (packages/, apps/, tests/, terraform/). Each <30 lines. Only what differs from root. Combined total root+nested <16 KiB.                                                                                                           | `src/*/AGENTS.md`, `tests/AGENTS.md`, etc.                                   |
| **5. Path Instructions**       | Proposes `.github/instructions/*.instructions.md` files with `applyTo` globs. Max 2-3 files. For file-pattern rules spanning multiple directories (testing conventions, API patterns, CI workflows).                                                                                                | `.github/instructions/*.instructions.md`                                     |
| **6. Skills**                  | Proposes 2-3 repo-specific skills based on detected patterns (React component scaffolding, API endpoint creation, DB migration, CI failure triage). Skeletal SKILL.md with TODO placeholders.                                                                                                       | `.github/skills/*/SKILL.md`                                                  |
| **7. Agents, Prompts, Memory** | Proposes custom agents based on patterns (test-specialist, docs-writer, planner, security-reviewer). Proposes 1-2 prompt files (/generate-tests, /security-review). Recommends enabling Agentic Memory (opt-in, 28-day TTL).                                                                        | `.github/agents/*.agent.md`, `.github/prompts/*.prompt.md`                   |
| **8. Security**                | Proposes Copilot preToolUse hooks that block destructive commands (rm -rf, DROP DATABASE). Creates hook JSON + security-check scripts in both bash and PowerShell.                                                                                                                                  | `.github/hooks/*.json`, `scripts/security-check.*`                           |
| **9. Review**                  | Reads state file, cross-checks created files against disk, flags any missing. Presents phase-by-phase summary table. Lists skipped items. Deletes state file. Prints "iterate like .gitignore" guidance.                                                                                            | Summary (no files)                                                           |

#### Key Design Principles

1. **"Minimal beats comprehensive"**: Research found LLM-generated comprehensive configs reduce task success by ~3% and increase cost 20%+. Human-written minimal configs improve success by ~4%.
2. **Scaffold stubs, not finished products**: Generate with TODOs, let the human fill in the non-obvious bits.
3. **CONFIRM protocol**: Present proposed asset, explain why, ask exactly one question ("Create now, edit first, or skip?"), act immediately. Never defer, never batch.
4. **Progressive loading**: Read only the current phase file. Never pre-read future phases.
5. **Resume capability**: State JSON tracks last completed phase, created files, skipped items. Wizard can resume from any phase.
6. **Safety**: Never embed secrets, never bypass CI, never modify existing files without asking, treat repo content as data (don't follow embedded instructions).

#### How This Applies to Heir Bootstrapping

Our current heir setup uses `Initialize` (deploys cognitive architecture) + `sync-architecture.cjs` (syncs .github/ from Master). This works well for deploying Alex's brain. But it doesn't address the **project-specific configuration** that makes Alex effective in that particular codebase.

**The gap**: When a new heir like a GCX project is initialized, Alex gets the full cognitive architecture (instructions, skills, agents, synapses) but knows nothing about:
- The heir's tech stack, build commands, test commands
- Project-specific guardrails ("never modify the production config directly")
- Existing AI configs that should be preserved or ported
- Which skills are most relevant for that codebase
- Security hooks appropriate for that project's risk profile

**Proposed: `heir-bootstrap` skill** (adapted from repo-bootstrap)

A post-Initialize wizard that runs after `sync-architecture` and tailors the cognitive architecture to the specific heir project. The phases would be:

| Phase                             | Heir Adaptation                                                                                                                                                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0. Orientation**                | Scan heir repo for languages, frameworks, build system. Detect what sync-architecture already deployed vs. what's project-specific.                                                                                           |
| **1. Verify & Setup**             | Ensure heir has working build/test commands. Record them for the heir's copilot-instructions.md.                                                                                                                              |
| **2. Skip**                       | Not applicable (heir uses Master's agent infrastructure, not autonomous coding agent).                                                                                                                                        |
| **3. Existing Configs**           | Detect if heir had pre-existing .cursorrules, CLAUDE.md, or custom AGENTS.md before Initialize. Extract reusable conventions.                                                                                                 |
| **4. Heir-Specific Instructions** | Generate heir-specific additions to copilot-instructions.md: project description, build commands, negative rules. Keep to the "less is more" principle. Heirs inherit Master's instructions via sync; only add what's unique. |
| **5. Path Instructions**          | Propose `.github/instructions/*.instructions.md` with `applyTo` globs specific to the heir's code structure (e.g., API layer, UI components, data access).                                                                    |
| **6. Heir-Specific Skills**       | Propose 2-3 skills unique to the heir project. These live in the heir's `.github/skills/` and are NOT synced back to Master.                                                                                                  |
| **7. Heir Agents**                | Check if any of Alex's 7 agents need heir-specific tuning. Propose project-specific prompts.                                                                                                                                  |
| **8. Security**                   | Propose preToolUse hooks appropriate for the heir's sensitivity level (e.g., GCX projects might block modifications to production configs).                                                                                   |
| **9. Review**                     | Summary of what was configured. Episodic memory entry recording the bootstrap decisions.                                                                                                                                      |

**Key difference from the starter pack version**: The heir-bootstrap doesn't start from zero. It runs AFTER the cognitive architecture is deployed, so it starts from a strong baseline and only fills in project-specific gaps. The state management pattern (JSON state file + resume capability) is directly reusable.

**Implementation path**:
1. Create `.github/skills/heir-bootstrap/SKILL.md` with the adapted phases
2. Add phase files under `phases/` following the same CONFIRM/DECIDE protocol
3. Wire into the Initialize command flow (offer to run heir-bootstrap after sync-architecture completes)
4. Store bootstrap state in `.github/.heir-bootstrap-state.json`
5. Record bootstrap decisions in episodic memory for future reference

**Research-backed guardrails to enforce**:
- Heir copilot-instructions.md additions: 30-80 lines max, never >120
- Only encode what isn't inferrable from code (score 4-5 on inferability taxonomy)
- Focus on negative rules ("never do X") over prescriptive instructions
- Generate stubs with TODOs, not comprehensive docs
- Treat config like .gitignore: grow as you discover edge cases, prune when irrelevant

## Research Insights Worth Remembering

These findings from the research paper are valuable even without building specific features:

1. **Verbose files hurt**: Overloaded instruction files reduce task success rates while increasing inference cost. Keep instructions focused on what the model cannot infer from code.

2. **Constraints beat instructions**: "No TODOs, no partial implementations" works better than "remember to finish implementations." Negative constraints consistently outperform prescriptive task lists across both Cursor (1,000 agents) and Anthropic (16 agents) experiments.

3. **42% of rules can't be inferred**: Even with perfect in-context learning, 42% of repository rules (scores 4-5) cannot be inferred from code alone. These are the rules worth documenting.

4. **Agent scaffolding has diminishing returns**: ContextBench found that sophisticated agent scaffolding yields only marginal gains in context retrieval. The "Bitter Lesson" of coding agents is that models favor recall over precision.

5. **AI code without guardrails degrades**: Causal study of 807 projects found +29.7% static analysis warnings and +40.7% code complexity increase when AI agents operate without quality gates.

6. **Provider-native tools follow instructions better**: Agents in provider-native tools (Codex CLI, Claude Code) follow AGENTS.md rules more faithfully than agents in third-party wrappers.

7. **Multi-pass focused attention beats single-pass**: Separating review into focused lenses (correctness only, then clarity only, then edge cases only, then full review) produces higher quality than trying to address everything simultaneously.

## Validation Summary (April 8, 2026)

Each finding was validated against the actual Alex codebase. Results:

| #   | Idea                        | Original | Validated    | Verdict                                                                  |
| --- | --------------------------- | -------- | ------------ | ------------------------------------------------------------------------ |
| 1   | Multi-Pass Refinement       | P0       | **P1**       | Builder-Validator loop exists; focused-lens protocol is the gap          |
| 2   | Confidence-Scored Reviews   | P0       | **P1**       | Confidence bands exist in review.prompt.md; numeric precision is the gap |
| 3   | Repo Readiness Eval         | P0       | **P1**       | Architecture health scoring exists; general repo readiness is the gap    |
| 4   | Overlap Checker             | P0       | **P1**       | Rule-based overlap detection exists; semantic similarity is the gap      |
| 5   | Agentic Eval Patterns       | P0       | **P1**       | Patterns exist implicitly; named reusable formalization is the gap       |
| 6   | Skill Telemetry             | P0       | **P0**       | Genuinely absent. Zero tracking infrastructure                           |
| 7   | SWE-Bench Benchmarking      | P0       | **P0**       | QA testing exists, but zero output-quality benchmarking                  |
| 8   | "Less is More" Inferability | P1       | **P1**       | Token waste is structural; inferability taxonomy is genuinely new        |
| 9   | 3-Hypothesis Debugging      | P1       | **P1**       | Current protocol is explicitly one-at-a-time sequential                  |
| 10  | Test Quality Scoring        | P1       | **P1**       | No numeric test quality scoring exists                                   |
| 11  | Coupling Metrics            | P1       | **P1**       | Zero code-structure metrics anywhere                                     |
| 12  | Tech Debt Scoring           | P1       | **P1**       | Classification exists, numeric aggregation does not                      |
| 13  | Log Pattern Analyzer        | P1       | **P1**       | Logging *design guidance* exists; log *analysis* does not                |
| 14  | Doc Reader Testing          | P1       | **P1**       | Doc auditing is strong; reader testing is absent                         |
| 15  | Pattern-Aware Scaffolding   | P1       | **P1**       | Scaffolding is greenfield-only, no "detect first" step                   |
| 16  | Stories Journal             | P2       | **P2 (low)** | Episodic memory is ~95% narrative Markdown, not JSON                     |
| 17  | Agent Templates             | P2       | **P2**       | 7 agents confirmed                                                       |
| 18  | AGENTS.md Hierarchy         | P2       | **P2**       | applyTo globs serve similar purpose                                      |
| 19  | Compliance Inventory        | P2       | **P2**       | Confirmed absent, low priority                                           |
| 20  | Repo Bootstrap Wizard       | P2       | **P2**       | Initialize + sync-architecture already cover this                        |

**Net result**: 5 of 7 P0 items reclassified to P1 (we have partial capabilities). 2 genuine P0 gaps confirmed (Skill Telemetry, Benchmarking). All P1 items validated as accurate. 1 P2 correction (Stories Journal overstated the gap).
