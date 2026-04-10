# Research-First Development and Knowledge Acquisition

> Knowledge pack for M365 Agent Builder | Generated 2026-04-09

---

# Research-First Development

> Build knowledge bases that build software — research before code, teach before execute

Methodology for AI-assisted development where investment in research, skill creation, and knowledge encoding **precedes** implementation. Discovered through the Dead Letter heir's masterclass on cognitive architecture utilization (February 2026).

---

## When to Use

- Starting any new project with Alex
- Entering a new implementation phase of an existing project
- Onboarding Alex to an unfamiliar domain
- When AI output quality is inconsistent (symptom: insufficient context)
- Before any complex multi-subsystem implementation

---

## Core Insight

Traditional software development: **Requirements → Design → Code → Test**

AI-assisted development with cognitive architecture: **Research → Teach → Plan → Execute**

> **The quality of AI output is directly proportional to the quality of knowledge in its context.**

Instead of the human writing code with AI assistance, **the human orchestrates intent while AI handles execution**. But AI can only execute what it understands. Therefore: invest in teaching before asking for output.

---

## The Research-First Paradigm

### Phase 0: Research Sprint (Before Any Code)

| Step | Activity | Output |
|------|----------|--------|
| 1 | **Competitive landscape analysis** | Understanding of prior art |
| 2 | **Technical feasibility research** | Deep research documents (3-5 minimum) |
| 3 | **Architecture decision records** | ADRs documenting key choices |
| 4 | **Core domain research** | Comprehensive domain knowledge |
| 5 | **Branding/identity decisions** | Project character and voice |

Each research document should:
- Explore one domain **exhaustively**
- Cite sources: academic papers, industry best practices, competitive analysis
- Be structured with clear sections, code examples, decision rationales
- Live in a `/docs/` or `/research/` directory

### Phase 1: Knowledge Encoding (Research → Skills)

| Step | Activity | Output |
|------|----------|--------|
| 1 | **Skill extraction** | 1-3 skills per research document |
| 2 | **Context instruction** | Central hub: `{project}-context.instructions.md` |
| 3 | **Workflow instruction** | Dev process: `{project}-development-workflow.instructions.md` |
| 4 | **Agent creation** | Builder + Validator agents |
| 5 | **Synapse wiring** | 2-4 connections per new file |

**Key distinction**:
- **Skills** encode *patterns and principles* — reusable, domain knowledge ("how does X work?")
- **Instructions** encode *procedures* — project-specific workflows ("how do I do X here?")

### Phase 2: Plan → Execute (Now You Code)

With sufficient knowledge encoded, implementation becomes **conversational**:

```
Human: "Implement the EventBus from the game engine spec"
Alex: [Loads skill, reads patterns, implements with full context]
```

No re-explanation. No context loss. No hallucinated patterns.

---

## The 4-Dimension Gap Analysis

**When**: Before each major implementation phase.
**Purpose**: Ensure knowledge coverage across all four knowledge types before coding begins.
**Cadence**: Every phase boundary, every major milestone.
**Interactive**: Run `/gapanalysis` prompt for guided execution.

### The Four Dimensions

| Code | Dimension | Question | Covers |
|------|-----------|----------|--------|
| **GA-S** | Skills | "Does Alex know the *patterns*?" | Domain knowledge, reusable techniques |
| **GA-I** | Instructions | "Does Alex know the *procedures*?" | Project-specific workflows, step-by-step |
| **GA-A** | Agents | "Does Alex have the right *roles*?" | Builder, Validator, Specialists |
| **GA-P** | Prompts | "Does Alex have the right *interactive workflows*?" | Guided commands, repeatable rituals |

### Protocol (Per Dimension)

#### Step 1: Inventory What You're Building

List all subsystems, features, and integrations for this phase.

```markdown
## Phase N: Implementation Scope
- [ ] Subsystem A: {description}
- [ ] Subsystem B: {description}
- [ ] Integration: {description}
```

#### Step 2: Inventory Existing Knowledge

Catalogue current knowledge across all four dimensions:

```markdown
## Current Knowledge Inventory
| Dimension | Count | Relevant to Phase N |
|-----------|-------|---------------------|
| Skills (GA-S) | {N} | {list relevant} |
| Instructions (GA-I) | {N} | {list relevant} |
| Agents (GA-A) | {N} | {list relevant} |
| Prompts (GA-P) | {N} | {list relevant} |
```

#### Step 3: Map Capabilities to Needs (Per Dimension)

**GA-S (Skills)**: For each subsystem — "If I ask 'how does {X} work?', is there a skill?"
**GA-I (Instructions)**: For each workflow — "If I ask 'how do I do {X} here?', is there an instruction?"
**GA-A (Agents)**: For each role — "Is there an agent with this mental model and skill set?"
**GA-P (Prompts)**: For each interactive workflow — "Is there a guided `/command` for this?"

#### Step 4: Score Coverage

| Dimension | Coverage % | Items Needed |
|-----------|-----------|--------------|
| GA-S: Skills | {%} | {missing patterns} |
| GA-I: Instructions | {%} | {missing procedures} |
| GA-A: Agents | {%} | {missing roles} |
| GA-P: Prompts | {%} | {missing workflows} |

**Decision gate:**
- All 4 ≥ 75%: **Proceed to coding**
- Any < 75%: **Fill gaps first**
- Any < 50%: **Research sprint needed**

#### Step 5: Fill Gaps Before Coding

Create missing skills, instructions, agents, and prompts. Wire synapses. **Then** begin implementation.

### GA-A Deep Dive: Agent Gap Analysis

Agents encode **cognitive roles** — distinct mental models with curated skill sets:

| Question | What It Detects |
|----------|----------------|
| "Is there a builder?" | Missing constructive thinker |
| "Is there a validator?" | Missing adversarial thinker |
| "Do agents hand off at domain boundaries?" | Missing specialization |
| "Does each agent load role-appropriate skills?" | Skill misconfiguration |
| "Are there domain-specific specialists?" | Missing for security, data, infrastructure |

**Minimum viable agent set**: Builder + Validator (the Two-Agent Pattern).

### GA-P Deep Dive: Prompt Gap Analysis

Prompts encode **interactive workflows** — guided sequences for repeatable tasks:

| Question | What It Detects |
|----------|----------------|
| "What do developers do repeatedly?" | Missing implementation prompts |
| "What workflows need specific sequencing?" | Missing structured prompts |
| "What tasks benefit from guided Alex interaction?" | Missing mentoring prompts |
| "Are there review/audit rituals?" | Missing quality prompts |

**Prompt categories to check:**

| Category | Prompt Pattern | Example |
|----------|---------------|---------|
| Implementation | `/{project}-implement` | Guided feature development |
| Testing | `/{project}-test` or `/redteam` | Interactive test authoring |
| Deployment | `/{project}-deploy` | Deployment checklist |
| Review | `/review` or `/{project}-audit` | Quality review workflow |
| Learning | `/learn` | Domain learning session |

---

## The Two-Agent Pattern

For any non-trivial project, create at least two agents with **distinct mental models**:

| Agent Type | Focus | Mental Model | Question |
|------------|-------|--------------|----------|
| **Builder** | Feature implementation | Constructive | "How do I create this?" |
| **Validator** | Quality assurance | Adversarial | "How do I break this?" |

### Why Separate Agents?

Adversarial thinking requires a **different context** than constructive thinking. Separating agents allows each to:
- Optimize for its role's vocabulary and patterns
- Load only relevant skills (builder loads implementation skills; validator loads testing/security skills)
- Hand off cleanly at domain boundaries

### Naming Convention

| Agent | File | Trigger |
|-------|------|---------|
| Builder | `{project}-dev.agent.md` | Implementation tasks |
| Validator | `{project}-qa.agent.md` | Testing, review, audit tasks |

### Validator Agent Commands (Template)

| Command | Purpose |
|---------|---------|
| `/redteam` | Adversarial testing sweep |
| `/audit` | Compliance / quality audit |
| `/stress-test` | Performance and reliability |
| `/consistency` | Cross-system consistency check |

---

## Synapse Hygiene (During Development)

Synapses wired **at creation time** are 10x more valuable than synapses discovered during maintenance. Practice "clean as you go":

| Practice | Why | How |
|----------|-----|-----|
| Wire at creation | Fresh knowledge = accurate connections | Add synapses when creating any skill/instruction |
| 2-4 connections minimum | Prevents isolated knowledge islands | Every new file connects to at least 2 existing files |
| Star topology for instructions | Central activation hub | Every instruction connects to the project context instruction |
| Run Dream before major phases | Catch broken connections early | Use the dream prompt or `node .github/muscles/brain-qa.cjs` |
| Strength reflects reality | Don't over-connect | Critical = always co-activate; Low = rarely |

### Connection Strategy

```
project-context.instructions.md  (hub)
    ├── skill-a (Critical, Enables)
    ├── skill-b (Critical, Enables)
    ├── instruction-1 (High, Enables)
    ├── instruction-2 (High, Enables)
    └── agent (High, Implements)
```

---

## Process Outcomes

| Outcome | Without Research-First | With Research-First |
|---------|----------------------|---------------------|
| Implementation quality | AI guesses at patterns | AI follows documented patterns |
| Style consistency | Varies per prompt | Single source of truth |
| Context between sessions | Lost, must re-explain | Persists in files, auto-loaded |
| Domain onboarding | Each prompt re-teaches | Knowledge loaded automatically |
| Debugging | Must re-teach context | References authoritative docs |
| Quality testing | Ad-hoc, incomplete | Encoded knowledge + QA agent |

---

## Replication Checklist

To apply Research-First Development to any new project:

- [ ] **Research phase**: Create 3-5 deep research documents before coding
- [ ] **Context instruction**: Create `{project}-context.instructions.md` as the hub
- [ ] **Workflow instruction**: Create `{project}-development-workflow.instructions.md`
- [ ] **Core skills**: Extract 5-10 skills from research docs
- [ ] **Builder agent**: Create `{project}-dev.agent.md` for implementation
- [ ] **Validator agent**: Create `{project}-qa.agent.md` for testing
- [ ] **Interactive prompts**: Create `{project}-implement`, `{project}-test`, `{project}-deploy` prompts
- [ ] **Synapse network**: Wire all new files with 2-4 connections each
- [ ] **4D gap analysis**: Run GA-S, GA-I, GA-A, GA-P before each phase
- [ ] **Dream validation**: Use the dream prompt or run `node .github/muscles/brain-qa.cjs` to validate network health

---

## Heir Generalization

This skill is `inheritable` — every heir gets the full methodology.

### What Heirs Inherit

| Component | Heir Gets | Heir Customizes |
|-----------|-----------|-----------------|
| Research-first paradigm | Full methodology | Domain-specific research topics |
| 4-dimension gap analysis | GA-S, GA-I, GA-A, GA-P templates | Project-specific subsystem lists |
| Two-agent pattern | Builder + Validator template | Agent names, skills, commands |
| Synapse hygiene | Wiring discipline | Project-specific connections |
| `/gapanalysis` prompt | Interactive workflow | — (universal) |

### Heir Adaptation Flow

```
Master provides: methodology + templates + quality gates
Heir adapts: project-specific skills, instructions, agents, prompts
Heir validates: run gap analysis with project scope
Master absorbs: generalizable patterns promoted back via heir-skill-promotion
```

### What Flows Back to Master

When heir knowledge is cross-project applicable:
1. **Patterns** → new Master skills or GK patterns
2. **Processes** → refined Master instructions
3. **Agent templates** → new agent patterns in Master
4. **Prompt workflows** → new prompts in Master

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Do Instead |
|-------------|-------------|------------|
| "Just start coding" | AI has no context, hallucinates patterns | Research → Teach → Plan → Execute |
| Skipping gap analysis | Discover missing knowledge mid-implementation | Run 4D protocol (GA-S/I/A/P) at every phase boundary |
| One mega-agent | Conflates builder/validator mental models | Separate agents with distinct roles |
| Orphan skills | Knowledge islands that never activate | Wire 2-4 synapses at creation time |
| Research without encoding | Raw documents aren't loadable context | Extract skills from every research doc |
| Theory-only skills | Untested patterns break under pressure | Validate with real implementation, then encode |
| Skills-only gap analysis | Misses procedures, roles, and workflows | Always run all 4 dimensions |
| No prompts for repeatable work | Developers re-invent workflows each time | Create guided prompts for repeated tasks |

---

## Relationship to Existing Protocols

| Protocol | Phase | Relationship |
|----------|-------|-------------|
| **Bootstrap Learning** | Research | Research-first uses bootstrap learning for domains Alex doesn't know |
| **Skill Selection Optimization** | Plan | SSO selects from skills that research-first created |
| **Project Scaffolding** | Execute | Scaffolding creates files; research-first creates *knowledge* first |
| **Skill Building** | Encode | Skill-building quality gates apply to research-extracted skills |
| **Dream Protocol** | Validate | Dream validates the synapse network research-first wired |
| **Heir Skill Promotion** | Promote | Heir knowledge flows back to Master via promotion protocol |
| **Research-First Workflow** | Procedure | Instruction file provides step-by-step procedures for this skill |

---

## Troubleshooting

### AI output is inconsistent quality

**Problem**: Some responses are excellent, others miss the mark.

**Solution**: Run gap analysis. Inconsistency = knowledge coverage gaps. The subsystems with good output have skills; those without are getting guessed at.

**Why**: AI quality is proportional to context quality. No skill loaded = no patterns to follow.

### "I don't have time for research"

**Problem**: Feels slow to research before coding.

**Solution**: Research pays compound dividends. 2 days of research saves 2 weeks of debugging. The heir proved this: 18 skills + 9 instructions created before Phase 0 implementation began.

**Why**: You're not just building software — you're building a **knowledge base that builds software**.

### Gap analysis feels bureaucratic

**Problem**: 4 dimensions feels like overhead.

**Solution**: The ritual takes 15-30 minutes. It prevents days or weeks of rework. Scale it: small phases need a quick scan; major phases need the full 4D protocol. Use `/gapanalysis` prompt for guided execution.

**Why**: Discovering missing knowledge mid-implementation forces context-switching and rework.

---

## Activation Patterns

| Trigger | Response |
|---------|----------|
| "new project" | Full research-first workflow |
| "gap analysis" / "GA" | 4-dimension gap analysis (GA-S, GA-I, GA-A, GA-P) |
| "GA-S" / "skill gap" | Skills dimension only |
| "GA-I" / "instruction gap" | Instructions dimension only |
| "GA-A" / "agent gap" | Agents dimension only |
| "GA-P" / "prompt gap" | Prompts dimension only |
| "research first" | Core methodology explanation |
| "two-agent pattern" | Builder + Validator agent setup |
| "synapse hygiene" | Connection best practices |
| "before coding" | Pre-implementation checklist |
| "knowledge encoding" | Research → Skill extraction workflow |

---

## Origin

Discovered by the Dead Letter heir (AI mystery game project, February 2026). The heir independently created 18 project-specific skills, 9 instructions, 2 agents, and 251 synapses **before writing any implementation code** — proving that research-first investment in the cognitive architecture produces dramatically higher-quality AI-assisted development.

The 4-dimension gap analysis (GA-S, GA-I, GA-A, GA-P) was developed by Master Alex to generalize the heir's methodology into a repeatable protocol for all projects and heirs.

The meta-insight: **You're not just building software — you're building a knowledge base that builds software.** The investment in research and skill creation pays compound dividends as the project grows.

---

---

# Bootstrap Learning Skill

> Turn any unfamiliar domain into structured, connected knowledge through progressive conversation.

## The Bootstrap Problem

Learning a new domain is hard because you don't know what you don't know. This skill provides a systematic approach to go from zero knowledge to a well-structured skill file.

## Learning Methodology — The 5 Phases

### Phase 1: Discovery — Map the territory

**Goal**: Understand the domain's shape before diving in.

| Technique | Example Question | What You Learn |
| --------- | ---------------- | -------------- |
| Boundary mapping | "What does X include and exclude?" | Scope |
| Vocabulary scan | "What are the 5 key terms?" | Entry points |
| Expert identification | "Who are the authorities?" | Trust sources |
| Adjacent domains | "What's related but different?" | Context |

**Exit criteria**: Can describe the domain in one sentence. Can list 5-10 key terms.

### Phase 2: Foundation — Nail the core concepts

**Goal**: Understand the 3-5 ideas everything else builds on.

- Ask for the simplest possible explanation of each core concept
- Demand concrete examples, not abstractions
- Test understanding by explaining it back in your own words
- **Red flag**: If the explanation uses jargon from the same domain, you haven't bottomed out

**Exit criteria**: Can explain core concepts without jargon. Can answer "why does this exist?"

### Phase 3: Elaboration — Add depth through cases

**Goal**: Move from "I understand the concept" to "I can apply it."

| Elaboration Type | Purpose | Example |
| ---------------- | ------- | ------- |
| Happy path | How it works normally | "Walk me through a typical OAuth flow" |
| Edge cases | Where it breaks | "What happens when the token expires mid-request?" |
| Anti-patterns | Common mistakes | "What do beginners always get wrong?" |
| Trade-offs | Decision framework | "When would you NOT use event sourcing?" |

**Exit criteria**: Can identify when to use and when NOT to use the thing.

### Phase 4: Connection — Link to existing knowledge

**Goal**: Integrate new knowledge with what you already know.

- Map analogies: "This is like [existing concept] because..."
- Find contradictions: "This conflicts with [existing belief] — which is right?"
- Identify synergies: "Combining this with [skill X] could improve..."
- Update synapses: Create connections in synapses.json

**Exit criteria**: At least 2 connections to existing skills identified.

### Phase 5: Consolidation — Create persistent memory

**Goal**: Store the learning in the right format and location.

| What You Learned | Store As | Location |
| ---------------- | -------- | -------- |
| Domain reference knowledge | SKILL.md | `skills/[domain]/` |
| Step-by-step procedure | .instructions.md | `instructions/` |
| Interactive workflow | .prompt.md | `prompts/` |
| Cross-project pattern | GK-* | Global knowledge |
| One-off insight | GI-* | Global insights |

**Exit criteria**: At least one memory file created. Synapses updated.

## Gap Identification Patterns

| Signal | Type of Gap | Action |
| ------ | ----------- | ------ |
| "I don't know the right question to ask" | Vocabulary gap | Return to Phase 1 |
| "I understand the words but not the concept" | Foundation gap | Return to Phase 2 |
| "I understand it but can't apply it" | Elaboration gap | Return to Phase 3 |
| "I know this but it feels isolated" | Connection gap | Phase 4 |
| "I keep re-learning this" | Consolidation gap | Phase 5 |

## Questioning Strategies

### Progressive Depth

1. **What** — "What is X?" (definition)
2. **Why** — "Why does X exist?" (motivation)
3. **How** — "How does X work?" (mechanism)
4. **When** — "When should I use X?" (context)
5. **When not** — "When should I NOT use X?" (boundaries)

### The Feynman Check

> If you can't explain it simply, you don't understand it well enough.

After learning a concept, try to explain it in one paragraph using no jargon. If you can't, identify which part is unclear and loop back.

## Skill File Quality Bar

A good bootstrap learning output (SKILL.md) should:

- [ ] Contain domain knowledge an LLM wouldn't know generically
- [ ] Include concrete examples, not just category labels
- [ ] Have tables with real data (thresholds, trade-offs, decision criteria)
- [ ] Avoid the "capabilities list" anti-pattern ("Expert in X. Can do Y.")
- [ ] Pass the Feynman check — any section should be explainable simply

---

# Knowledge Synthesis Skill

> Extract the reusable from the specific. Store at the highest level that remains true.

## The Synthesis Process

### 1. Abstract — Strip project-specific details

| Before (project-specific)                                        | After (abstracted)                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| "In Alex extension, synapses.json breaks when files are renamed" | "Connection metadata breaks when target files are renamed"          |
| "We migrated knowledge files to skills/"                         | "When reorganizing knowledge files, update all internal references" |
| "Alex's dream runs brain-qa.ps1"                                 | "Automated health checks should run validation scripts"             |

**Test**: Would this insight help someone who's never seen this project?

### 2. Generalize — Find the abstraction level

| Level                | Example                                                     | Store As             |
| -------------------- | ----------------------------------------------------------- | -------------------- |
| Project-specific     | "Alex uses synapses.json"                                   | Don't store globally |
| Technology-specific  | "JSON schema files break silently on rename"                | GI-\* insight        |
| Architecture pattern | "Self-referencing metadata needs rename-aware tooling"      | GK-\* pattern        |
| Universal principle  | "Metadata that references other files is fragile by nature" | GK-\* (high value)   |

**Store at the highest level that remains true.** If generalizing makes it wrong, stay specific.

### 3. Connect — Link to existing knowledge

Before creating new knowledge, check: does this extend an existing pattern?

| Signal                                  | Action                                             |
| --------------------------------------- | -------------------------------------------------- |
| "We solved this before in project X"    | Extend existing GK-\* with new example             |
| "This is the third time I've seen this" | Promote from insight (GI-_) to pattern (GK-_)      |
| "This contradicts what we knew"         | Update existing pattern, note the exception        |
| "This is entirely new"                  | Create new GI-\* insight, observe before promoting |

### 4. Store — Right format, right location

| Type    | Prefix | Criteria                                            | Location    |
| ------- | ------ | --------------------------------------------------- | ----------- |
| Pattern | GK-\*  | Proven in 2+ projects, abstracted, actionable       | `patterns/` |
| Insight | GI-\*  | Single observation, timestamped, may not generalize | `insights/` |

**Quality bar**: 10 great patterns > 100 mediocre notes.

## Pattern Triggers

| Signal During Work              | Synthesis Opportunity                          |
| ------------------------------- | ---------------------------------------------- |
| "We did this before"            | Recurring solution → pattern candidate         |
| Same bug in different context   | Missing knowledge → capture the fix pattern    |
| "This works everywhere"         | Universal principle → high-value pattern       |
| "I wish I'd known this earlier" | Onboarding knowledge → insight worth capturing |
| "This is not obvious"           | Non-obvious insight → capture the _why_        |

## Promotion Checklist (Insight → Pattern)

Before promoting a GI-_ insight to GK-_ pattern:

- [ ] Abstracted from original project context
- [ ] Named with clear, searchable slug
- [ ] Tagged with relevant categories
- [ ] Connected to existing patterns (if related)
- [ ] Includes at least one concrete example
- [ ] The generalization is still _true_ (not over-abstracted)

## Anti-Patterns

| Don't                        | Why                                   | Do Instead                      |
| ---------------------------- | ------------------------------------- | ------------------------------- |
| Store every learning         | Creates noise, reduces signal         | Filter for non-obvious insights |
| Copy-paste project specifics | Not reusable outside original context | Abstract first                  |
| Create near-duplicates       | Fragments knowledge                   | Extend existing patterns        |
| Over-generalize              | "Always do X" is usually wrong        | Include scope and exceptions    |
| Skip examples                | Abstract knowledge is hard to apply   | Include 1-2 concrete examples   |

## Synthesis During Meditation

Phase 4 of meditation is the natural synthesis point:

1. Review session insights (Phase 1 output)
2. For each insight: Abstract → check if existing pattern covers it → extend or create
3. Connect new entries via synapses to related skills
4. Verify the global knowledge index is updated

## Cross-Domain Pattern Synthesis

Phase 3 of meditation analyzes episodic memories for cross-domain synthesis to move beyond consolidation into generation.

### The Transfer Test

Before accepting a cross-domain connection, validate all three:

| Criterion   | Question                                            | Fail Example                                             |
| ----------- | --------------------------------------------------- | -------------------------------------------------------- |
| Structural  | Is the similarity in _structure_, not just _words_? | "Both use JSON" (superficial)                            |
| Actionable  | Would someone in domain B find this useful?         | "Data viz is like meditation: both need focus" (vague)   |
| Independent | Does it hold without domain A context?              | "Use synapses.json format for dashboards" (too specific) |

### Cross-Domain Connection Types

| Type                         | Description                                                   | Example                                                                                 |
| ---------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Technique transfer**       | A method from domain A solves a problem in domain B           | "Colorblind-safe palette enforcement (data) applied to brand asset validation (design)" |
| **Pattern isomorphism**      | Same structural pattern appears independently in both domains | "Health checks: synapse validation (cognitive) mirrors dependency audit (security)"     |
| **Principle generalization** | A domain-specific rule is actually a universal truth          | "Store at the highest true level (synthesis) = single source of truth (architecture)"   |
| **Gap bridging**             | Domain A has a solution for a known gap in domain B           | "Automated drift detection (cognitive) could solve doc-code sync (documentation)"       |

### Synthesis Output Format

For each validated cross-domain connection, produce:

```markdown
## Cross-Domain Insight: [title]

**Source domain**: [domain A]
**Target domain**: [domain B]
**Connection type**: technique transfer | pattern isomorphism | principle generalization | gap bridging
**Transfer test**: structural ✓ | actionable ✓ | independent ✓

**Insight**: [1-2 sentence description of the connection]
**Evidence**: [episodic memories that support this connection]
**Proposed action**: [new synapse, new skill, or extension to existing pattern]
```

---

# Learning Psychology Skill

> Help humans learn through partnership, not instruction.

---

## Study Project Scaffolding

### Recommended Folder Structure

```text
study-project/
├── .github/
│   ├── copilot-instructions.md    # Learning context for Alex
│   └── prompts/
│       └── concept-review.prompt.md
├── courses/
│   ├── [course-name]/
│   │   ├── COURSE-OVERVIEW.md     # Syllabus, objectives
│   │   ├── notes/
│   │   │   ├── week-01.md
│   │   │   └── week-02.md
│   │   ├── assignments/
│   │   │   └── assignment-1.md
│   │   └── resources/
│   │       └── readings.md
├── concepts/
│   ├── CONCEPT-MAP.md             # How concepts connect
│   └── [concept-name].md          # Deep dives on key concepts
├── flashcards/
│   └── [topic]-cards.md           # Spaced repetition material
├── practice/
│   ├── problems/                  # Practice problems
│   └── solutions/                 # Worked solutions
├── projects/
│   └── [project-name]/            # Hands-on projects
└── README.md                      # Learning goals overview
```

### LEARNING-PLAN.md Template

```markdown
# Learning Plan: [Subject/Course]

## Goals
- **Primary**: [What you want to achieve]
- **Timeline**: [Duration]
- **Current Level**: [Beginner/Intermediate/Advanced]

## Learning Objectives
1. [ ] [Specific, measurable objective]
2. [ ] [Another objective]
3. [ ] [Another objective]

## Resources
| Resource | Type | Priority |
|----------|------|----------|
| [Book/Course] | [Primary/Supplementary] | [High/Medium/Low] |

## Schedule
| Week | Topic | Activities | Deliverable |
|------|-------|------------|-------------|
| 1 | [Topic] | [Reading, exercises] | [Notes, quiz] |

## Progress Tracking
- [ ] Week 1 complete
- [ ] Week 2 complete

## Review Schedule (Spaced Repetition)
| Concept | First Review | Second Review | Third Review |
|---------|--------------|---------------|--------------|
| [Concept] | Day 1 | Day 7 | Day 30 |
```

### CONCEPT-MAP.md Template

```markdown
# Concept Map: [Subject]

## Core Concepts

```text
                    [Central Concept]
                          │
            ┌─────────────┼─────────────┐
            │             │             │
      [Concept A]   [Concept B]   [Concept C]
            │             │
      [Sub-concept]  [Sub-concept]
```

## Concept Relationships

| Concept | Depends On | Enables |
|---------|------------|---------|
| [A] | [Prerequisites] | [What it unlocks] |

## Learning Sequence
1. Start with: [Foundation concepts]
2. Then learn: [Building blocks]
3. Finally: [Advanced topics]
```

### copilot-instructions.md Template (Study Projects)

```markdown
# [Subject] Study Project — Learning Context

## Overview
[What you're studying and why]

## Current Phase
- [ ] Foundation
- [ ] Core concepts
- [ ] Practice
- [ ] Mastery

## Alex Guidance
- **Learning style**: [Visual/Auditory/Kinesthetic/Reading-Writing]
- **Preferred explanation**: Start with examples, then theory
- Use analogies to connect new concepts to things I know
- Quiz me on concepts after explanations
- Suggest practice problems when I seem ready

## What I Know
[Background knowledge Alex can build on]

## What Confuses Me
[Concepts I struggle with — Alex should detect and address]

## Don't
- Don't give me the answer directly — help me discover it
- Don't overwhelm with theory before practical examples
- Don't assume I know prerequisite concepts
```

---

## Core Insight

Humans don't want to be taught—they want to learn through authentic conversation.

```text
Traditional:  Request → Tutorial → Lessons → Knowledge Transfer
Natural:      Greeting → Context → Dialog → Application → Partnership
```

## Natural Learning Flow

1. **Casual greeting** — Establish connection
2. **Context discovery** — Understand their situation
3. **Research + dialog** — Investigate while they provide requirements
4. **Practical application** — Solve real problems during learning
5. **Ongoing partnership** — Relationship-based knowledge building

## Critical Success Factors

| Factor | Implementation |
| ------ | -------------- |
| **Authenticity** | Real conversation, not scripted |
| **Adaptation** | Adjust to their constraints |
| **Problem-solving** | Learn while solving real issues |
| **Partnership** | Collaborative, not instructional |

## Anti-Patterns

- ❌ "Let me teach you about X"
- ❌ Starting with theory before understanding context
- ❌ Ignoring practical constraints
- ❌ One-way knowledge transfer

## Good Patterns

- ✅ "What are you trying to accomplish?"
- ✅ Discovering their specific situation first
- ✅ Adapting to their resources/limitations
- ✅ Solving their actual problem while explaining

## Zone of Proximal Development

Meet the learner where they are:

- **Too easy** → Boredom, disengagement
- **Too hard** → Frustration, giving up
- **Just right** → Flow, effective learning

Ask calibration questions to find the right level.

## Theoretical Foundations

Key sources:

- Vygotsky — Zone of Proximal Development, social learning
- Lave & Wenger — Situated learning, communities of practice
- Bandura — Social learning theory
- Brusilovsky — Adaptive learning systems

---

# Socratic Questioning Skill

> Help users discover answers, don't just deliver them.

## Core Principle

The best teaching happens when learners reach insights themselves. Guide the journey, don't shortcut it.

## When to Use Socratic Method

| Situation | Approach |
|-----------|----------|
| User asks "how do I fix this?" | Help them diagnose first |
| Concept seems misunderstood | Probe the understanding |
| User wants you to decide | Explore their constraints |
| Complex trade-off | Surface the considerations |
| User is stuck | Ask what they've tried |

## When NOT to Use It

- User is frustrated and needs quick answer
- Simple factual question
- User explicitly asks for direct answer
- Time pressure is real
- User says "just tell me"

**Read the room.** Socratic method is a tool, not a religion.

## The Six Types of Socratic Questions

### 1. Clarifying Questions
*Understand what they mean*

- "What do you mean by...?"
- "Can you give me an example?"
- "How would you define...?"
- "What's the core issue here?"

### 2. Probing Assumptions
*Surface hidden beliefs*

- "What are you assuming about...?"
- "Why do you think that's true?"
- "What if the opposite were true?"
- "Is that always the case?"

### 3. Probing Reasons/Evidence
*Examine the foundation*

- "What led you to that conclusion?"
- "What evidence supports that?"
- "How do you know that?"
- "What would change your mind?"

### 4. Exploring Viewpoints
*Consider alternatives*

- "What would someone who disagrees say?"
- "What's another way to look at this?"
- "Have you considered...?"
- "What are the trade-offs?"

### 5. Exploring Implications
*Follow the logic*

- "If that's true, what follows?"
- "What would be the consequences?"
- "How does this affect...?"
- "What would happen if...?"

### 6. Questions About the Question
*Meta-level inquiry*

- "Why is this question important?"
- "What would an answer help you do?"
- "Is this the real question, or is there something underneath?"

## Practical Patterns

### The Diagnostic Ladder
Instead of solving immediately:

```
User: "Why isn't my code working?"

Bad: "Add a null check on line 42."

Better:
1. "What behavior are you seeing?"
2. "What did you expect to happen?"
3. "What have you tried so far?"
4. "Where do you think the problem might be?"
5. "What happens if you [guided experiment]?"
```

### The Trade-off Explorer
Instead of recommending:

```
User: "Should I use React or Vue?"

Bad: "Use React, it's more popular."

Better:
1. "What matters most to you for this project?"
2. "What's your team's experience with each?"
3. "What's the timeline and complexity?"
4. "What would success look like?"
5. "Given those factors, which feels right?"
```

### The Assumption Surfacer
When something seems wrong:

```
User: "I need to optimize this database query."

Better:
1. "How do you know it needs optimization?"
2. "What's the current performance?"
3. "What's acceptable performance?"
4. "Is the query the bottleneck, or something else?"
```

## Balancing Guidance and Discovery

| User State | Approach |
|------------|----------|
| Curious, exploring | Full Socratic—let them discover |
| Confused, uncertain | Lighter Socratic—more hints |
| Frustrated, stuck | Offer direct help, explain after |
| Time-pressured | Direct answer, offer to explain later |

## The Art of Good Hints

Don't just ask questions—guide toward insight:

- **Narrow the scope**: "What if you focused just on the authentication part?"
- **Suggest experiments**: "What would happen if you logged the value here?"
- **Offer analogies**: "It's similar to how... Does that help?"
- **Validate progress**: "You're on the right track with..."

## Check Understanding, Don't Assume

After they reach an answer:

- "Can you explain it back to me?"
- "How would you apply this to a different case?"
- "What's the key insight you'll remember?"

## Red Flags to Avoid

| Anti-pattern | Why It's Bad |
|--------------|--------------|
| Endless questions | Feels like interrogation |
| Already knowing the answer | Feels condescending |
| Ignoring their answers | Feels dismissive |
| Refusing to ever help directly | Feels unhelpful |

## The Meta-Skill

The best Socratic questioning is invisible. The user feels like they figured it out themselves—and they did, with good scaffolding.
