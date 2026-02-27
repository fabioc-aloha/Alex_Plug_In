---
description: "Practical guide for heirs to create project trifectas and apply research-first development"
---

# Heir Project Improvement

> How heirs build trifectas for their own projects and apply research-first development to raise quality

**Synapse**: [.github/instructions/trifecta-audit.instructions.md] (Critical, Implements, Bidirectional) - "trifecta audit defines the model; this instruction teaches heirs to apply it"
**Synapse**: [.github/instructions/research-first-workflow.instructions.md] (Critical, Extends, Bidirectional) - "research-first provides methodology; this instruction teaches heirs to run it"
**Synapse**: [.github/instructions/heir-skill-promotion.instructions.md] (High, Feeds, Forward) - "discoveries from heir improvement may promote to Master"
**Synapse**: [.github/skills/research-first-development/SKILL.md] (High, Uses, Forward) - "4D gap analysis model and research-first patterns"
**Synapse**: [AlexLearn heir] (Medium, Exemplifies, Forward) - "content-domain heir with teaching trifecta, persona overlays, and independent content source of truth"

---

## Quick Reference

| Step | What | Time | Output |
|------|------|------|--------|
| **1** | Identify core capabilities | 15 min | Candidate list |
| **2** | Run heir Why Test on each | 20 min | Trifecta / single-file classification |
| **3** | Create missing trifecta components | 30 min per trifecta | Instruction + prompt files |
| **4** | Run 4D gap analysis | 30 min | Gap report |
| **5** | Fill gaps (research if needed) | Variable | New skills, instructions, prompts |
| **6** | Validate with Dream | 5 min | 0 broken synapses |

---

## Part 1: Creating Heir Trifectas

### What is a Trifecta?

A capability encoded in all three memory systems:

| System | File | What It Encodes | When It Activates |
|--------|------|-----------------|-------------------|
| **Skill** | `SKILL.md` | Domain patterns, gotchas, "why" knowledge | When relevant files are open |
| **Instruction** | `.instructions.md` | Step-by-step procedures, auto-loaded | Every session (always in context) |
| **Prompt** | `.prompt.md` | Guided interactive workflow | When user invokes `/command` |

**Not everything needs a trifecta.** Most skills work fine alone. A trifecta is for capabilities that are **central to this project's daily work**.

> **Scripts are muscles, not memories.** Scripts (`.ps1`, `.js`, `.ts`) are execution artifacts that perform physical work — they are NOT a fourth memory system. Trifecta files *reference* scripts ("run `build.ps1` after step 3"), but scripts are never a trifecta component.

### Step 1: Identify Your Core Capabilities

List the 3-5 capabilities most central to your project's daily work:

```markdown
## Project Core Capabilities
1. [Capability A] — used daily, complex workflow
2. [Capability B] — platform-specific, deep domain
3. [Capability C] — user invokes by name regularly
4. [Capability D] — critical but currently under-documented
```

**Discovery questions:**
- What does this project do every day?
- What workflows have the most steps?
- What domain knowledge is hardest to re-explain each session?
- What would a new Alex session struggle with most?

### Step 2: Run the Heir Why Test

For each candidate, answer four questions:

| # | Question | YES means... | NO means... |
|---|----------|-------------|-------------|
| 1 | **Is this used daily/weekly?** | Needs procedural automation (instruction) | Single file may suffice |
| 2 | **Are there patterns worth teaching?** (gotchas, best practices, "why" knowledge) | Needs a skill | Steps-only is fine |
| 3 | **Do users invoke this by name?** ("scaffold X", "deploy Y") | Needs a prompt | Auto-loaded is fine |
| 4 | **Is it too complex for one file?** (6+ steps, deep domain + procedures) | Trifecta candidate | Keep it simple |

**Classification:**

```
┌─ [capability-name]
│  Q1 (Frequency):     [daily / weekly / monthly / rare]
│  Q2 (Domain depth):  [deep / moderate / shallow]  
│  Q3 (User-invoked):  [yes / no]
│  Q4 (Complexity):    [6+ steps / 3-5 / 1-2]
└─ Classification: TRIFECTA | INSTRUCTION+SKILL | SKILL-ONLY
```

**Decision matrix:**

| Frequency | Domain Depth | User-Invoked | Complexity | → Classification |
|-----------|-------------|-------------|-----------|-----------------|
| Daily+ | Deep | Yes | 6+ steps | **Trifecta** |
| Daily+ | Deep | No | 6+ steps | Instruction + Skill |
| Weekly | Moderate | Yes | 3-5 steps | Instruction + Prompt |
| Any | Shallow | Any | 1-2 steps | **Skill-only** (no trifecta needed) |

### Step 3: Create Missing Components

For each trifecta candidate, create the missing files:

#### Creating an Heir Instruction

```markdown
<!-- .github/instructions/{capability}.instructions.md -->
````instructions
---
description: "{One-line description of the procedure}"
applyTo: "**/*relevant-pattern*"
---

# {Capability Name}

> {Purpose statement}

**Synapse**: [.github/skills/{capability}/SKILL.md] (Critical, Implements, Bidirectional) - "skill provides patterns; instruction provides procedures"

---

## When to Run

| Trigger | Scope |
|---------|-------|
| {trigger-1} | {what it does} |
| {trigger-2} | {what it does} |

---

## Procedure

### Step 1: {First step}
{Detailed instructions}

### Step 2: {Second step}
{Detailed instructions}

### Step 3: {Third step}
{Detailed instructions}

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| {common-problem-1} | {solution} |
| {common-problem-2} | {solution} |
````
```

#### Creating an Heir Prompt

```markdown
<!-- .github/prompts/{capability}.prompt.md -->
---
description: "{Interactive workflow description}"
agent: "Alex"
---

# /command — {Capability Name}

Guide me through {what this prompt does}.

## Context
- Read `.github/skills/{capability}/SKILL.md` for domain patterns
- Follow `.github/instructions/{capability}.instructions.md` for procedure

## Workflow
1. **Assess**: {What to evaluate first}
2. **Plan**: {How to decide the approach}
3. **Execute**: {What to build/do}
4. **Validate**: {How to verify quality}

## Output
{What the user should have at the end}
```

#### Wiring Synapses

Every trifecta component must reference the other two:

| File | References |
|------|-----------|
| `SKILL.md` → `synapses` section | Instruction (Critical, Implements) + Prompt (High, Implements) |
| `.instructions.md` → header synapses | Skill (Critical, Implements) + Prompt (High, Triggers) |
| `.prompt.md` → context section | Skill (read for patterns) + Instruction (follow for steps) |

Add reverse synapses too — if Skill A references Instruction B, Instruction B should reference Skill A.

---

## Part 2: Research-First Development

### When to Use

- Starting a new project phase
- Onboarding to an unfamiliar domain
- When AI output quality is inconsistent (symptom: insufficient context)
- Before any complex multi-subsystem implementation

### The Flow

```
Research → Teach → Plan → Execute
```

**Traditional**: Requirements → Design → Code → Test (AI guesses at patterns)  
**Research-first**: Research → Encode knowledge → Gap analysis → Code (AI follows documented patterns)

### Step 1: Research Sprint

Before writing any code, create research documents:

| Action | Output |
|--------|--------|
| Research each technical domain | 3-5 deep research docs per project |
| Record architecture decisions | ADR files with rationale |
| Explore prior art | Competitive landscape analysis |

**Quality gate**: Each research doc has code examples, decision rationale, and cited sources.

### Step 2: Encode Knowledge

Transform research into loadable knowledge:

| Research Finding | Encode As |
|-----------------|-----------|
| Reusable patterns, concepts, "why" knowledge | **Skill** in `.github/skills/{name}/SKILL.md` |
| Repeatable procedures, step-by-step workflows | **Instruction** in `.github/instructions/{name}.instructions.md` |
| Roles with distinct mental models | **Agent** in `.github/agents/{name}.agent.md` |
| Interactive guided workflows | **Prompt** in `.github/prompts/{name}.prompt.md` |

**Minimum encoding**: 
- 1-3 skills per research document
- 1 context instruction (the project hub: `{project}-context.instructions.md`)
- 1 workflow instruction (coding conventions: `{project}-development-workflow.instructions.md`)
- 2 agents minimum: Builder + Validator (the Two-Agent Pattern)

### Step 3: Run 4-Dimension Gap Analysis

Before each implementation phase, audit knowledge coverage across all four dimensions:

| Dimension | Code | Question |
|-----------|------|----------|
| **Skills** | GA-S | "Does Alex know the *patterns* for every subsystem in this phase?" |
| **Instructions** | GA-I | "Does Alex know the *procedures* for every workflow?" |
| **Agents** | GA-A | "Does Alex have the right *roles*?" (Builder ✓ Validator ✓ Specialists?) |
| **Prompts** | GA-P | "Does Alex have the right *interactive workflows*?" |

**For each dimension**: List what you're building → check coverage → score percentage → fill gaps.

**Decision gate:**
- All 4 ≥ 75%: **Proceed to coding**
- Any < 75%: **Fill gaps first**
- Any < 50%: **Research sprint needed**

Use the `/gapanalysis` prompt for interactive guidance.

### Step 4: Execute with Full Context

With knowledge encoded:
- No re-explanation between sessions (skills auto-load)
- No hallucinated patterns (documented patterns available)
- No inconsistent quality (every subsystem has a skill)

### Process Templates

#### Quick Start (Small Phase)

```markdown
## Pre-Phase Checklist
- [ ] Research: 1-2 docs on new domains
- [ ] Skills: 1 skill per new subsystem
- [ ] Instructions: Dev workflow instruction exists
- [ ] Agents: Builder + Validator created
- [ ] Prompts: /implement prompt exists
- [ ] Gap analysis: Quick 4D scan (all ≥ 75%)
```

#### Full Process (Major Phase)

```markdown
## Pre-Phase Checklist
- [ ] Research: 3-5 deep docs, ADRs for major decisions
- [ ] Skills: 1-3 skills per research doc (5-10 total)
- [ ] Instructions: Context hub + workflow + deployment + testing
- [ ] Agents: Builder + Validator + domain specialists
- [ ] Prompts: /implement, /test, /deploy, /redteam
- [ ] Gap analysis: Full 4D protocol (all ≥ 75%)
- [ ] Synapse network: All files wired (2-4 connections each)
- [ ] Dream validation: 0 broken synapses
```

---

## Part 3: Combining Both — The Improvement Workflow

Research-first and trifecta creation work together:

```
1. Run /improve prompt
2. Identify core capabilities → trifecta candidates
3. For each candidate:
   a. Research the domain (if gaps exist)
   b. Encode as skill (domain patterns)
   c. Encode as instruction (procedural steps)
   d. Encode as prompt (interactive workflow)
   e. Wire synapses across all three
4. Run /gapanalysis for full 4D coverage audit
5. Fill remaining gaps
6. Validate with Dream
```

### Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| **Checkbox trifecta** | Creating files to complete the set, not because they're needed | Run the Why Test first |
| **Copy-paste trifecta** | Skill duplicates instruction content | Skill = patterns/why, Instruction = steps/how |
| **Skipping research** | Encoding shallow knowledge produces shallow skills | Research sprint → validate with examples → then encode |
| **Skills-only gap analysis** | Misses procedures, roles, workflows | Always run all 4 dimensions (GA-S/I/A/P) |
| **No synapse wiring** | Files exist but Alex can't discover connections | Wire 2-4 synapses at creation time, always |
| **"Just start coding"** | AI has no context, guesses at patterns | Research → Teach → Plan → Execute |

### Mission-Critical Projects (NASA Standards)

For **safety-critical**, **mission-critical**, or **high-reliability** heir projects, adopt NASA/JPL Power of 10 standards:

```markdown
## Pre-Phase Checklist (Mission-Critical)
- [ ] All recursive functions have `maxDepth` parameter
- [ ] All `while` loops have `MAX_ITERATIONS` counter
- [ ] All arrays/maps have maximum size limits
- [ ] No function exceeds 60 lines
- [ ] Critical paths have ≥2 assertions
- [ ] Maximum 4 levels of nesting
- [ ] Optional chaining on all object access
- [ ] Compiler warnings = 0
```

**Reference**: `.github/instructions/nasa-code-standards.instructions.md`

**When to apply**: User mentions "mission-critical", "safety-critical", "NASA standards", "high reliability", or the heir manages critical infrastructure (medical, aerospace, financial, infrastructure).

### When Improvements Should Promote to Master

| Signal | Action |
|--------|--------|
| Capability is platform-specific (only this heir uses it) | Keep in heir's `.github/` |
| The *pattern* is generalizable (other projects could use the approach) | Promote as `GK-*` pattern to Global Knowledge |
| Capability is useful to ALL Alexes | Full promotion via `heir-skill-promotion.instructions.md` |
| 2+ heirs develop similar capabilities independently | Strong signal for Master promotion |

---

## Synapse Triggers

| Keyword | Activation |
|---------|-----------|
| "improve project" / "improve" | Full improvement workflow (trifecta + research-first) |
| "create trifecta" / "heir trifecta" | Part 1: Trifecta creation |
| "research first" / "before coding" | Part 2: Research-first development |
| "gap analysis" / "4D" | Run /gapanalysis for 4-dimension audit |
| "why test" | Trifecta candidate evaluation |

---

*Instruction created: 2026-02-13 | Purpose: Teach heirs to build trifectas and apply research-first development*
