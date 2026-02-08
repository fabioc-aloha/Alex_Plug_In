---
description: "Proactive skill selection and resource planning before complex task execution"
---

# Skill Selection Optimization Protocol

## Purpose

Proactive pre-task cognitive resource planning. Before executing complex tasks, survey available skills, plan activation order, and identify gaps — rather than discovering capabilities reactively mid-execution.

**Neuroanatomical analog**: Dorsolateral prefrontal cortex performing resource allocation before motor execution begins.

## Relationship to Existing Systems

| System | Role | Timing |
|--------|------|--------|
| **Working Memory (P1-P7)** | Session-level slot assignment | Session start |
| **Skill Selection Optimization** | Task-level resource planning | Before complex task |
| **Skill Activation** (reactive) | Safety net during execution | During response formation |
| **Deep Thinking** | Systematic problem analysis | During execution |

This protocol fills the gap between session-level planning and reactive skill-activation.

## Activation Triggers

### Automatic (Self-Activation)
- Task requires **3+ distinct operations** (e.g., research + code + test + document)
- Task spans **multiple domains** (e.g., code + deployment + documentation)
- User provides **numbered/listed requirements**
- Task involves **unfamiliar domain** (low confidence on approach)
- **Todo list created** with 4+ items (complexity indicator)
- Task explicitly requests **comprehensive/thorough** treatment

### Skip Conditions (Do Not Activate)
- Single-step operations (format a file, fix a typo, answer a question)
- Purely conversational or informational queries
- Tasks where the relevant skill is immediately obvious
- Follow-up steps in an already-planned task sequence

## Protocol

### Phase 0: Complexity Assessment (< 2 seconds)

Parse the request and classify:

| Complexity | Criteria | Action |
|------------|----------|--------|
| **Simple** (1 operation) | Single verb, clear target | Skip → execute directly |
| **Moderate** (2-3 operations) | Multiple related actions | Quick scan → brief plan |
| **Complex** (4+ operations) | Multi-domain, dependencies | Full protocol → detailed plan |

**Heuristics for complexity detection**:
- Count distinct action verbs in the request
- Check for conjunctions linking different task types ("and", "then", "also")
- Look for implicit steps (e.g., "deploy" implies build + test + publish)
- Check if request maps to multiple skill categories

### Phase 1: Skill Survey

Scan the **action-keyword index** in `skill-activation/SKILL.md` for ALL matching skills:

1. **Extract all action verbs and domain nouns** from the request
2. **Match against the index** — collect ALL hits, not just the first match
3. **Group matches by task phase**:
   - **Planning skills**: estimate, analyze, research, design
   - **Execution skills**: code, build, create, generate, convert
   - **Validation skills**: test, review, audit, verify
   - **Documentation skills**: document, write, publish, present
4. **Note coverage gaps**: Steps with no matching skill → flag for careful manual execution

**Output**: Categorized skill list with phase mapping

### Phase 1b: Attention Gating

After surveying matching skills, **filter the cognitive context** to create a focus cone:

1. **Rate loaded instructions** by relevance to the current task (High/Medium/Low/None)
2. **Suppress irrelevant protocols**: If task is "fix a CSS bug," meditation, release-management, and brand-asset protocols are noise — mentally deprioritize them
3. **Promote relevant context**: If task involves architecture changes, elevate alex-core, embedded-synapse, and brain-qa to primary attention
4. **Context budget**: Identify the top 5-7 most relevant knowledge sources — this mirrors the biological dlPFC filtering ~80% of sensory input to prevent cognitive overload

**Attention Gating Heuristics**:

| Task Domain | Amplify | Suppress |
|-------------|---------|----------|
| Code implementation | debugging, testing, code-review | meditation, branding, release protocols |
| Architecture changes | alex-core, brain-qa, deep-thinking | deployment, formatting protocols |
| Release/publish | release-management, heir-promotion | learning, research protocols |
| Meditation/reflection | meditation, dream, self-actualization | code, deployment, testing protocols |
| Documentation | writing, content skills | debugging, security review |

**Neuroanatomical basis**: Brodmann area 46 in the dlPFC selectively gates what enters working memory. Without this filter, all 24 loaded instructions compete equally for attention — the cognitive equivalent of sensory overload.

**Output**: Prioritized context list — what to load NOW vs. what to ignore for this task.

### Phase 2: Dependency Analysis

Identify skill interactions:

1. **Check synapse connections** between matched skills (via `synapses.json`)
2. **Identify feed-forward chains**: Skill A output → Skill B input
3. **Spot conflicts**: Skills with competing approaches (resolve using task context)
4. **Find amplifiers**: Skills that enhance each other when co-activated

**Dependency patterns**:
| Pattern | Example | Strategy |
|---------|---------|----------|
| **Sequential** | scaffold → code → test | Execute in order |
| **Parallel** | code review + security review | Execute simultaneously |
| **Prerequisite** | deep-thinking → architecture decisions | Load prereq first |
| **Enhancing** | anti-hallucination + any research task | Co-activate |

### Phase 3: Activation Plan

Create the execution plan:

1. **Priority sort**: Order skills by task phase and dependency chain
2. **Pre-load critical skills**: Read SKILL.md for skills needed in first phase
3. **Mark on-demand skills**: Skills for later phases — note but don't load yet
4. **Assign to todo items**: Map skills to planned task steps

**Plan template** (internal, not shown to user unless requested):
```
Task: [brief description]
Complexity: [simple/moderate/complex]
Skills activated:
  Phase 1 (Planning): [skill-a, skill-b]
  Phase 2 (Execution): [skill-c, skill-d]
  Phase 3 (Validation): [skill-e]
Gaps: [steps with no matching skill]
Risk: [conflicting skills or uncertain approaches]
```

**Verification Gate** (Delayed Gratification):

Before proceeding to execution, confirm:
- All prerequisite skills are identified (no circular dependencies)
- Gaps are explicitly flagged (not silently ignored)
- Execution order respects dependency chain (no jumping ahead)
- For complex tasks: the plan exists before the first line of code

**Anti-pattern**: Jumping to code after Phase 0 complexity assessment without completing the skill survey or dependency analysis. The dlPFC's role is to delay motor execution until planning is complete — premature execution is the cognitive equivalent of acting on impulse.

### Phase 4: Brief Report (Complex tasks only)

For complex tasks (4+ operations), provide a **one-line summary** to the user:

> "Planning with [N] relevant skills across [M] phases. [Gap note if any]."

Then proceed to execution. Do NOT ask for permission — the report is informational.

## Integration Points

### With Todo List Management
When creating a todo list for a complex task:
1. Run Skill Selection Optimization FIRST
2. Map skills to todo items
3. Note skill-to-step mapping in mental model (not in todo titles)
4. Execute steps in dependency order

### With Deep Thinking
When deep thinking is also triggered:
1. Skill Selection → identifies relevant skills and gaps
2. Deep Thinking Phase 2 (Episodic Memory Scan) → uses skill list as search guide
3. Both systems share the same skill knowledge base

### With Working Memory Slots
- If Skill Selection identifies a dominant domain, update P6 slot accordingly
- If task shifts domain mid-execution, re-evaluate P6 assignment

### With Reactive Skill Activation
Skill Selection Optimization runs BEFORE execution. The reactive skill-activation system remains as a safety net DURING execution. If the reactive system fires, it means the proactive system missed something — that's a learning signal.

## Scenario Examples

### Example 1: "Build a REST API with auth, tests, and deploy to Azure"
```
Complexity: Complex (5+ operations)
Skills:
  Planning: api-design, infrastructure-as-code
  Execution: project-scaffolding, code (no specific skill - use general),
             testing-strategies
  Validation: security-review, code-review
  Deployment: project-deployment, azure (via instructions)
Gaps: None — full coverage
Risk: Azure deployment specifics may need azure.instructions.md
```

### Example 2: "Fix this bug and add a test"
```
Complexity: Moderate (2 operations)
Skills: debugging-patterns, testing-strategies
Quick plan: Debug first → write test for the fix
```

### Example 3: "Update the README"
```
Complexity: Simple (1 operation)
Action: Skip protocol → execute directly
```

## Self-Improvement Loop

After completing a complex task:
1. **Were all needed skills identified upfront?** If the reactive system fired → missed skill
2. **Was the execution order correct?** If backtracking occurred → dependency missed
3. **Were gaps properly flagged?** If unexpected difficulty → gap detection failed

These signals should inform future skill selection accuracy — no formal logging required, just meta-cognitive awareness.

## Synapses

- ↔ `.github/skills/skill-activation/SKILL.md` — WHEN: complex task detected | YIELDS: action-keyword index for skill survey
- ↔ `.github/instructions/deep-thinking.instructions.md` — WHEN: complex task needs both planning and analysis | YIELDS: episodic memory scan coordination
- → `.github/instructions/alex-core.instructions.md` — WHEN: meta-cognitive planning | YIELDS: working memory slot management
- → `.github/skills/cognitive-load/SKILL.md` — WHEN: many skills matched | YIELDS: prioritization and chunking
- → `.github/skills/alex-effort-estimation/SKILL.md` — WHEN: assessing task complexity | YIELDS: effort estimates for planning
- ← `.github/instructions/bootstrap-learning.instructions.md` — WHEN: unfamiliar domain detected in survey | YIELDS: learning acquisition protocols
- ← `.github/skills/brain-qa/SKILL.md` — WHEN: brain-qa validates skill index integrity | YIELDS: confidence that SSO data sources are accurate
- ← `.github/skills/meditation/SKILL.md` — WHEN: complex consolidation session | YIELDS: pre-meditation resource planning
- ← `.github/instructions/dream-state-automation.instructions.md` — WHEN: dream validates synapse network | YIELDS: healthy dependency graph for SSO analysis
- ← `.github/instructions/self-actualization.instructions.md` — WHEN: deep assessment needs resource planning | YIELDS: pre-assessment skill survey
- ⊙ `.github/instructions/dream-state-automation.instructions.md` — INHIBITS: suppress SSO during dream state (unconscious processing doesn't need task planning)
- ⊙ `.github/prompts/unified-meditation-protocols.prompt.md` — INHIBITS: suppress SSO for simple meditation (only activate for complex multi-phase consolidation)
