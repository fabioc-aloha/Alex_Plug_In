# Multi-Agent Strategy for Alex

A unified coordination model combining proven patterns from AFCP (fleet coordination) and the 1ES AI-First Dev Starter Pack (CoDev/Coder/Critic workflow), tailored for Alex's cognitive architecture and VS Code runtime.

**Date**: 2026-04-08
**Sources**: Agent Fleets Coordination Protocol (1ES), AI-First Dev Starter Pack (1ES)
**Supersedes**: [AFCP-LEVERAGE-ANALYSIS.md](AFCP-LEVERAGE-ANALYSIS.md) (raw analysis, retained for reference)

## Implementation Tracker

| #   | Feature                           | Source              | Effort | Impact | Status | Target |
| --- | --------------------------------- | ------------------- | ------ | ------ | ------ | ------ |
| 1   | Multi-Pass Refinement Workflow    | Starter Pack        | Low    | High   | Done   | P1     |
| 2   | Structured Unknowns               | AFCP                | Low    | High   | Done   | P2     |
| 3   | Context Layering Protocol         | Starter Pack        | Low    | High   | Done   | P1     |
| 4   | Triage Rules with Confidence      | Starter Pack        | Low    | High   | Done   | P1     |
| 5   | Assignment Lifecycle (H17)        | AFCP                | Medium | High   | Done   | P2     |
| 6   | Skill-Based Task Routing          | AFCP                | Medium | High   | Done   | P3     |
| 7   | Mission Profiles (Directive Sets) | AFCP                | Low    | Medium | Done   | P1     |
| 8   | Correlation Vectors               | AFCP                | Low    | Medium | Done   | P2     |
| 9   | Scoped Knowledge Artifacts        | AFCP                | Medium | Medium | Done   | P3     |
| 10  | Expertise Tracking                | AFCP + Starter Pack | Medium | Medium | Done   | P3     |

## Executive Summary

Alex has 7 agents with rich cognitive architecture (memory, identity, learning, synapses) but shallow coordination. Delegation via `runSubagent` is fire-and-forget: no structured refinement, no outcome tracking, no uncertainty lifecycle, no learned routing.

Two 1ES projects solve different halves of this:

- **AI-First Dev Starter Pack** provides a battle-tested CoDev/Coder/Critic workflow with multi-pass refinement, confidence-scored triage, and context layering. It runs on the same VS Code `runSubagent` primitives Alex already uses. Adoption is mostly agent instruction changes.

- **AFCP** provides coordination primitives Alex has no equivalent for: structured unknowns, assignment lifecycle, expertise tracking, correlation vectors, and mission-scoped directive sets. These require new schemas and episodic memory extensions.

The strategy: adopt the Starter Pack's workflow patterns first (low effort, high impact, same runtime), then layer AFCP's coordination primitives on top (adds memory and intelligence to the workflow).

## Part 1: Agent Roles (Revised)

Alex's 7 agents map to the Starter Pack's triad plus domain specialists:

| Alex Agent        | Starter Pack Role   | Function                                                        |
| ----------------- | ------------------- | --------------------------------------------------------------- |
| **Alex**          | CoDev (coordinator) | Decomposes work, delegates, triages, drives iteration loops     |
| **Builder**       | Coder (implementer) | Writes code, makes changes, follows multi-pass refinement       |
| **Validator**     | Critic (reviewer)   | Reviews with lens-focused passes, severity + confidence scoring |
| **Researcher**    | (no equivalent)     | Pre-implementation domain research, knowledge encoding          |
| **Documentarian** | (no equivalent)     | Documentation accuracy, drift detection                         |
| **Azure**         | (no equivalent)     | Azure-specific implementation and deployment                    |
| **M365**          | (no equivalent)     | Microsoft 365 and Teams development                             |

The CoDev pattern maps cleanly: Alex as coordinator, Builder as implementer, Validator as reviewer. Researcher, Documentarian, Azure, and M365 are domain specialists that the Starter Pack doesn't have. They stay as-is.

## Part 2: Multi-Pass Refinement Workflow

Adapted from the Starter Pack's CoDev Multi-Pass Workflow. Alex orchestrates, Builder implements, Validator reviews.

### When to Use Multi-Pass

| Condition                                           | Workflow                            |
| --------------------------------------------------- | ----------------------------------- |
| Multi-file implementation, new feature, refactoring | Multi-Pass (default)                |
| Single-line fix, config change, pure data update    | Standard (declare reason)           |
| Research, learning, exploration                     | Skip (no code-critique loop needed) |

### The 4-Pass Loop

| Pass                      | Builder Focus                           | Validator Lens                  | Exit When                               |
| ------------------------- | --------------------------------------- | ------------------------------- | --------------------------------------- |
| **Draft**                 | Get the shape right, breadth over depth | Skip (draft is knowingly rough) | All files touched, structure complete   |
| **Refine 1: Correctness** | Fix bugs, logic errors, type issues     | Correctness only                | Logic sound, compiles, tests pass       |
| **Refine 2: Clarity**     | Simplify, rename, document              | Clarity and maintainability     | Another developer could understand this |
| **Refine 3: Edge Cases**  | Error paths, boundaries, failure modes  | Error handling and robustness   | Failure modes handled                   |
| **Refine 4: Excellence**  | Polish, production-ready                | Full review (all dimensions)    | Would ship to production                |

### Refinement Rules

1. Alex verifies Builder's work before delegating to Validator (view files, don't trust "Done!")
2. Alex skims Validator findings to confirm review actually ran (not empty due to timeout)
3. After Refine 4, if Validator still finds Critical/Important issues, escalate to user rather than looping indefinitely
4. Builder and Validator never talk to each other. All coordination flows through Alex.

## Part 3: Context Layering Protocol

Adapted from the Starter Pack's 3-layer context sharing. Every `runSubagent` call passes structured context instead of dumping everything.

### Layer 1: Project Standards (always include)

Extracted from `.github/copilot-instructions.md` and relevant instructions:
- Safety Imperatives (I1-I8)
- Coding principles (KISS, DRY, Quality-First)
- Active Focus Trifectas
- Repository conventions

### Layer 2: Task Context (include when relevant)

- What we're building and why
- Prior decisions affecting this task
- Known pitfalls for this area of code
- Reference files (paths to good pattern examples)
- Relevant episodic memory from previous sessions

### Layer 3: Exclusions (never pass to subagents)

- Alex's identity and persona instructions
- Meditation/dream protocols
- Session management state
- Human interaction patterns (escalation workflows)
- Synapse metadata

### Benefits

- Reduces subagent context bloat (currently unbounded)
- Prevents subagents from adopting Alex's identity/personality
- Ensures project standards aren't lost in noise
- Makes delegation prompts consistent and auditable

## Part 4: Triage Rules with Confidence Scoring

Adapted from the Starter Pack's Critic triage. Applied to Validator findings and all code review outputs.

| Finding Severity                          | Confidence      | Action                               |
| ----------------------------------------- | --------------- | ------------------------------------ |
| **Critical** (security, crash, data loss) | Any             | Must fix before proceeding           |
| **Important** (bugs, significant issues)  | High (85%+)     | Send to Builder for fix              |
| **Important**                             | Medium (70-84%) | Send to Builder, note uncertainty    |
| **Suggestion**                            | Any             | Note for user summary, don't block   |
| **Any finding**                           | Low (<70%)      | Filter out (unless security-related) |

### Special Cases

- **Security findings at any confidence**: Always surface to user
- **Architectural concerns**: Escalate to user (outside agent scope)
- **Builder and Validator disagree after 2+ attempts**: Escalate with both perspectives
- **Deferred Important findings**: Record in episodic memory with rationale

## Part 5: Structured Unknowns

Adapted from AFCP's first-class uncertainty model. Turns "I don't know" into a trackable, resolvable workflow.

### Unknown Categories

| Category           | Description                                 | Example                                                      |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------ |
| **Information**    | Missing data needed to proceed              | "What auth provider does this project use?"                  |
| **Interpretation** | Ambiguous evidence, multiple valid readings | "This function might be intentionally side-effectful"        |
| **Decision**       | Choice needed, agent can't make it alone    | "Should we use REST or GraphQL for this endpoint?"           |
| **Authority**      | Permission needed from user                 | "This refactoring changes the public API"                    |
| **Capability**     | Agent lacks the ability                     | "I can't run this test suite because it requires a database" |

### Unknown Lifecycle

```
Surface → Persist → (Consult if needed) → Resolve → Learn
```

1. **Surface**: Agent detects uncertainty and records it instead of guessing
2. **Persist**: Unknown stored in episodic memory with category, confidence, and context
3. **Consult**: If resolvable by another agent, delegate; otherwise escalate to user
4. **Resolve**: Resolution recorded with rationale
5. **Learn**: During meditation, unresolved unknowns become research candidates

### Schema (episodic memory extension)

```json
{
  "type": "unknown",
  "category": "decision",
  "description": "Whether to normalize the API response at the service or controller layer",
  "confidence": 0.4,
  "state": "open",
  "surfacedBy": "builder",
  "surfacedAt": "2026-04-08T15:30:00Z",
  "resolvedBy": null,
  "resolution": null
}
```

## Part 6: Assignment Lifecycle

Adapted from AFCP's 7-phase assignment model. Implemented via the deferred H17 hook (SubagentStop).

### Tracking Schema

Every `runSubagent` call creates an assignment record:

```json
{
  "id": "asgn-001",
  "skill": "implement-feature",
  "description": "Add pagination to the API endpoint",
  "assignedTo": "builder",
  "phase": "completed",
  "delegatedBy": "alex",
  "startedAt": "2026-04-08T15:30:00Z",
  "completedAt": "2026-04-08T15:32:00Z",
  "durationMs": 120000,
  "outcome": "success",
  "unknownsOpened": 0,
  "correlationId": "req-abc-123"
}
```

### Phases

```
Assigned → Working → Completed | Failed | Cancelled | BlockedByUnknown
```

### What This Enables

- **Delegation memory**: "Builder handled 12 pagination tasks, 92% success rate"
- **Duration estimation**: "Research tasks with Researcher average 3x longer than Builder tasks"
- **Failure analysis**: "Validator keeps finding the same issue after Builder 'fixes' it"
- **H17 hook trigger**: PostSubagentStop event records assignment outcome

## Part 7: Skill-Based Task Routing

Adapted from AFCP's 3-tier routing. When Alex orchestrates and the user doesn't specify an agent, auto-route.

### Tier 1: Skill Match

Map task keywords to agent capabilities (already partially exists in agent.md files):

| Task Signal                                     | Route To      |
| ----------------------------------------------- | ------------- |
| implement, build, create, refactor, fix         | Builder       |
| review, audit, validate, security, test         | Validator     |
| research, learn, explore, investigate, compare  | Researcher    |
| document, update docs, changelog, drift         | Documentarian |
| deploy, azure, bicep, container, infrastructure | Azure         |
| teams, graph, m365, copilot agent, declarative  | M365          |

### Tier 2: Learned Expertise

After assignment lifecycle tracking is active, use historical success rates:
- Agent with highest success rate for matching skill wins
- Minimum 5 observations before Tier 2 overrides Tier 1
- Decay factor: recent assignments weighted higher

### Tier 3: Fallback

If no skill match and no expertise data, route to Alex (orchestrator handles directly or decomposes further).

## Part 8: Mission Profiles

Adapted from AFCP's directive sets. Named behavioral presets that modulate how all agents operate.

| Profile           | Behavior Modifications                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **release-mode**  | Heighten quality gates, suppress speculative suggestions, require Validator review on all changes, enforce version consistency |
| **research-mode** | Prefer breadth over depth, cite sources, save insights to global knowledge, time-box exploration                               |
| **debug-mode**    | Systematic hypothesis testing, binary search isolation, require 3+ competing hypotheses, log reasoning chain                   |
| **review-mode**   | Adversarial stance, confidence scoring on all findings, check for pattern deviations, flag security at any confidence          |
| **draft-mode**    | Optimistic execution, skip Validator loop, accept working-but-imperfect code, move fast                                        |

### Activation

- Explicit: User says "switch to release mode" or Alex detects release-related context
- Automatic: Active Context already tracks Focus Trifectas; mission profiles extend this with agent behavior rules
- Implementation: .prompt.md files per profile, loaded into context when active

## Part 9: Correlation Vectors

Adapted from AFCP's cross-agent error tracing. Lightweight implementation for Alex's sequential delegation model.

### Format

```
{userRequestId}.{agentName}.{operation}
```

Example: `req-7a3b.builder.implement` → `req-7a3b.validator.review` → `req-7a3b.builder.fix`

### Rules

1. Generate a correlation ID when Alex receives a user request
2. Pass it to every subagent call
3. Log it in session trace and episodic memory
4. When an error occurs, the CV chain shows exactly which agent, in which operation, for which user request

### What This Enables

- Root-cause analysis across agent boundaries
- Session replay: trace the full delegation chain for any user request
- Failure pattern detection during meditation

## Implementation Phases

### Phase 1: Workflow Patterns (Low effort, no code changes)

Update agent.md files to include:

1. **Multi-Pass Refinement** instructions in Alex, Builder, Validator agents
2. **Context Layering** rules in Alex agent (what to pass, what to exclude)
3. **Triage Rules** with confidence thresholds in Validator agent
4. **Mission Profiles** as .prompt.md files

These are instruction changes only. No TypeScript, no schema changes, no new hooks.

### Phase 2: Uncertainty and Tracking (Medium effort, episodic schema extension)

5. **Structured Unknowns** schema in episodic memory
6. **Assignment Lifecycle** tracking (implement H17 hook)
7. **Correlation Vectors** in session trace

Requires episodic memory schema extension and H17 hook implementation.

### Phase 3: Intelligence (Medium effort, learning loop)

8. **Skill-Based Routing** with keyword index
9. **Expertise Tracking** from assignment history
10. **Scoped Knowledge Artifacts** with confidence and supersession

Requires assignment data accumulation from Phase 2 before Tier 2 routing becomes useful.

## What We Don't Adopt

| AFCP/Starter Pack Feature                   | Why Not                                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| Center server (REST/HTTPS coordination hub) | Alex agents are ephemeral subagent calls, not persistent connections                    |
| JWT-based agent auth                        | All agents run in-process, no trust boundary                                            |
| Neo4j graph store                           | Overkill; episodic JSON files are sufficient                                            |
| Dashboard (2D/3D timeline)                  | 7-agent sequential delegation doesn't need fleet visualization                          |
| Fleet composition (recursive fleets)        | Heirs are build-time clones, not runtime participants                                   |
| Agency CLI / Plugin marketplace             | Alex distributes via VS Code extension, not CLI plugins                                 |
| Parallel Coder delegation                   | VS Code `runSubagent` is sequential; revisit when VS Code supports parallel agent calls |
| NEVER call task_complete                    | AFCP agents are long-running; Alex agents are ephemeral (opposite model)                |
