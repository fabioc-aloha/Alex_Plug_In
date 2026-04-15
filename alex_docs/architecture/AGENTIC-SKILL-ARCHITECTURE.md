# Agentic Skill Architecture

## Overview

Skills in Alex's cognitive architecture fall into two fundamental types based on their execution capability:

| Type | Components | Nature |
|------|------------|--------|
| **Intellectual** | Trifecta only | Reasoning, analysis, judgment — no action needed |
| **Agentic** | Trifecta + Muscle | Autonomous execution — knows AND does |

## Industry Alignment

This architecture aligns with established research and industry patterns:

### ReAct: Reasoning + Acting (Yao et al., ICLR 2023)

The seminal ReAct paper established the paradigm of **synergizing reasoning and acting** in LLMs:

> "Reasoning traces help the model induce, track, and update action plans... while actions allow it to interface with external sources."

Our Intellectual vs Agentic distinction mirrors this exactly:
- **Intellectual skills** = pure reasoning (chain-of-thought, analysis)
- **Agentic skills** = reasoning + action (tool use, execution)

**Citation**: [arXiv:2210.03629](https://arxiv.org/abs/2210.03629)

### OpenAI: Agentic AI Definition

OpenAI's governance framework defines agentic AI systems as:

> "AI systems that can pursue complex goals with limited direct supervision."

This maps directly to our `tri=1, muscle=1` classification — skills that can act autonomously.

**Citation**: [Practices for Governing Agentic AI Systems](https://openai.com/index/practices-for-governing-agentic-ai-systems/)

### Microsoft Foundry Agent Service

Microsoft's agent platform defines agents as three components:

| Component | Description | Alex Equivalent |
|-----------|-------------|-----------------|
| **Model (LLM)** | Reasoning and language | Copilot context |
| **Instructions** | Goals, constraints, behavior | `.instructions.md` |
| **Tools** | Access to data or actions | Muscle scripts |

Our trifecta (skill + instruction + prompt) + muscle architecture provides the same pattern with explicit separation of concerns.

**Citation**: [Microsoft Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/overview)

### Anthropic: Agentic Coding Evaluation

Anthropic distinguishes between models that:
- Generate text (reasoning, advice)
- Take autonomous actions (fix bugs, add functionality)

Their "agentic coding evaluation" tests "the model's ability to fix a bug or add functionality... independently write, edit, and execute code."

This validates our separation: intellectual skills advise, agentic skills execute.

**Citation**: [Claude 3.5 Sonnet Announcement](https://www.anthropic.com/news/claude-3-5-sonnet)

### Microsoft AutoGen

AutoGen's multi-agent framework emphasizes:

> "Agents have native support for LLM-driven code/function execution"

The pattern: agents that can reason AND execute. Our muscle layer provides this execution capability.

## The Quality Equation

Every skill aspires to structural merit plus capability completeness:

```
Quality = Visibility + Merit + Capability

Visibility:  fm (frontmatter with applyTo, description)
Merit:       code + bounds
Capability:  tri (trifecta) + muscle (automation)
```

## Skill Types

### Intellectual Skills (tri=1, muscle=0)

Skills that require thinking but no automated action:

- **Code Review** — evaluates code quality, security, patterns
- **Root Cause Analysis** — systematic debugging methodology
- **Security Review** — OWASP, STRIDE, threat modeling
- **Architecture Audit** — consistency, coupling, design review

These skills are complete WITHOUT a muscle. The "action" is human judgment informed by the skill's knowledge.

### Agentic Skills (tri=1, muscle=1)

Skills with autonomous execution capability:

- **md-to-word** — converts markdown to Word documents
- **brain-qa** — generates quality grid reports
- **docx-to-md** — converts Word to markdown
- **converter-qa** — validates converter outputs

These skills can ACT, not just advise.

## The Trifecta Foundation

Both skill types require trifecta alignment:

```
skill-name/
├── SKILL.md              # Domain knowledge
└── (muscle)              # Optional automation

.github/instructions/
└── skill-name.instructions.md   # Procedural guidance

.github/prompts/
└── skill-name.prompt.md         # Reusable workflow (optional)
```

The trifecta links:
- **SKILL.md** — what to know (domain expertise)
- **instruction** — how to apply it (procedural rules)
- **prompt** — when to use it (workflow template)

## The Muscle Layer

Muscles are automation components in `.github/muscles/`:

### Script Muscles (Preferred)

For cross-platform execution (Node.js):

```
.github/muscles/
├── brain-qa.cjs          # Quality grid generator
├── md-to-word.cjs        # Document converter
├── converter-qa.cjs      # Converter test harness
└── docx-to-md.cjs        # Reverse converter
```

### Pseudocode Muscles

For cross-platform challenges (platform-specific implementation):

```
.github/muscles/
├── visual-export.md      # Describes PNG export steps
└── audio-render.md       # Platform-specific TTS workflow
```

Pseudocode muscles document WHAT to do when a universal script isn't feasible.

## Quality Dimensions

| Dimension | What it measures | Required for |
|-----------|------------------|--------------|
| **fm** | Visibility to the brain | All (gate) |
| **code** | Code examples | Pass threshold |
| **bounds** | Size limits (100-500 lines) | Pass threshold |
| **tri** | Trifecta alignment | Skill type |
| **muscle** | Automation component | Agentic status |
| **inh** | Inheritance (informational) | Heir sync planning |
| **stale** | Staleness (informational) | Semantic review trigger |
| **sem** | Semantic review complete | Quality tracking |

## Scoring Model

```
Score = fm + code + bounds + tri + muscle (max 5)

Pass thresholds by tier:
  core:       5/5 (must be perfect)
  standard:   4/5 (one defect allowed)
  extended:   3/5 (two defects allowed)
  specialist: 2/5 (three defects allowed)
```

**Gate requirement**: fm=1 is mandatory. Without frontmatter, the skill is invisible to activation.

**Informational columns** (not scored):
- **inh**: Inheritance status — 1=master-only (excluded from heir sync), 0=synced
- **stale**: Staleness signal — 1=needs research refresh (external API churn), 0=stable
- **sem**: Semantic review — 1=reviewed and updated, 0=pending review

## Type Classification

| Type | tri | muscle | Icon | Meaning |
|------|:---:|:------:|:----:|---------|
| Agentic | 1 | 1 | A | Can execute autonomously |
| Intellectual | 1 | 0 | I | Requires human judgment |
| Incomplete | 0 | * | - | Missing trifecta alignment |

## Evolution Path

```
Stub Skill (new)
    ↓ add frontmatter
Visible Skill (fm=1)
    ↓ add structure, code, bounds
Quality Skill (merit complete)
    ↓ add matching instruction
Intellectual Skill (tri=1)
    ↓ add muscle (if actionable)
Agentic Skill (tri=1, muscle=1)
```

Not all skills should become agentic. Intellectual skills that guide human reasoning are complete as-is.

## Muscle Philosophy

1. **Every skill should aspire to automation** — but some legitimately have none
2. **Cross-platform possible** → Node.js script (`.cjs`/`.js`)
3. **Cross-platform challenging** → Pseudocode markdown (`.md`)
4. **Intellectual skills** → No muscle needed (the action is thinking)

## Examples

### Agentic Skill: md-to-word

```
.github/skills/md-to-word/SKILL.md          # Conversion knowledge
.github/instructions/md-to-word.instructions.md  # When to convert
.github/muscles/md-to-word.cjs              # The converter script
```

Invocation: "Convert this document to Word"
Result: Autonomous execution produces `.docx` file

### Intellectual Skill: code-review

```
.github/skills/code-review/SKILL.md         # Review methodology
.github/instructions/code-review-guidelines.instructions.md
```

Invocation: "Review this PR"
Result: Structured feedback using the skill's framework

No muscle needed — the output is analysis, not automation.

## Relationship to Modern Synapses

Static `synapses.json` files are deprecated. Modern activation uses:

| Mechanism | Where | Purpose |
|-----------|-------|---------|
| `applyTo` | Frontmatter | Pattern-based activation |
| `description` | Frontmatter | Semantic matching |
| Trifecta naming | Convention | skill → instruction linking |
| `handoffs` | Agents | Explicit routing |

## Novel Contributions

While our architecture aligns with industry research, it contributes unique elements:

| Prior Art | Our Contribution |
|-----------|------------------|
| ReAct's reasoning+acting | Explicit typing system (I/A/-) with quality scoring |
| OpenAI's agentic definition | Measurable criteria via trifecta + muscle |
| Microsoft's Model+Instructions+Tools | Trifecta separation (skill/instruction/prompt) with muscle layer |
| Tool-use patterns | Muscle philosophy: script vs pseudocode distinction |

**Key innovation**: The quality equation combines visibility, merit, and capability into a single scoring model that can be measured, tracked, and improved over time.

## Theoretical Validity

The architecture is **theoretically sound** because:

1. **Aligns with ReAct** — The reasoning/acting distinction is empirically validated
2. **Matches industry patterns** — Microsoft, OpenAI, Anthropic all use similar agent definitions
3. **Provides measurability** — Unlike abstract definitions, our model can score skill completeness
4. **Enables evolution** — Clear path from stub → visible → quality → intellectual → agentic

The concepts don't just "make sense" — they formalize established patterns into a testable framework.

## Empirical Validation

To validate the scoring model, we examined representative skills across the score distribution:

### Sample Analysis (April 2026)

| Skill | Tier | Score | fm | code | bounds | tri | muscle | Type | Human Assessment |
|-------|------|------:|:--:|:----:|:------:|:---:|:------:|:----:|------------------|
| dissertation-defense | exte | 1/3 | 1 | 0 | 0 | 0 | 0 | - | Good domain content, actionable checklists |
| career-development | exte | 2/3 | 1 | 0 | 1 | 0 | 0 | - | Excellent tables, complete resume guidance |
| code-review | core | 3/5 | 1 | 1 | 1 | 0 | 0 | - | High-quality methodology, 3-pass framework |
| image-handling | stan | 4/4 | 1 | 1 | 1 | 1 | 0 | I | Clear format selection, code examples |
| brain-qa | stan | 5/4 | 1 | 1 | 1 | 1 | 1 | A | Complete with automation script |
| md-to-word | stan | 5/4 | 1 | 1 | 1 | 1 | 1 | A | Full conversion pipeline |

### Criterion Validity Findings

| Dimension | Pass Rate | Issue Identified | Decision |
|-----------|----------:|------------------|----------|
| **fm** | 168/168 | None — mandatory gate | ✓ KEEP |
| **~~struct~~** | 2/168 | Required arbitrary `## Troubleshooting` + `## Activation` headers | ✗ REMOVED |
| **code** | 128/168 | Correctly identifies code examples | ✓ KEEP |
| **bounds** | 152/168 | 50 lines too lenient for stubs | ✓ KEEP (raised to 100-500) |
| **tri** | 97/168 | Naming mismatches can be fixed manually | ✓ KEEP (semantic review needed) |
| **muscle** | 9/168 | Correctly identifies agentic capability | ✓ KEEP |

### Implemented Changes (April 2026)

**struct — REMOVED**

The `struct` dimension required BOTH of these exact section headers:
- `## Troubleshooting`
- `## Activation` (or `## Activation Patterns`)

Only 2/168 skills used this template. Removed entirely — doesn't measure structural quality.

**bounds — RAISED TO 100-500**

Minimum raised from 50 to 100 lines. Skills under 100 lines are stubs that lack substance.

**tri — KEEP (semantic review handles mismatches)**

The exact-match criterion correctly flags missing instructions. Naming mismatches (e.g., `code-review` vs `code-review-guidelines.instructions.md`) are valid findings — the semantic review process (`stale` signal, `sem` completion) handles research and updates.

**Informational columns added:**
- **inh**: Read from `sync-architecture.cjs` SKILL_EXCLUSIONS — helps plan heir sync upgrades
- **stale**: Hardcoded set of skills with external API dependencies — signals "research needed"
- **sem**: Preserved across grid regenerations — tracks semantic review completion

### Type Classification Validity

The Intellectual/Agentic/Incomplete classification **is valid**:

| Type | Count | Description | Validates |
|------|------:|-------------|-----------|
| Agentic (A) | 7 | Skills with muscle scripts | ✓ All have working automation |
| Intellectual (I) | 90 | Skills with trifecta, no muscle | ✓ Guide reasoning, don't execute |
| Incomplete (-) | 71 | Missing trifecta alignment | ✓ Need matching instructions |

The type system correctly distinguishes capabilities. The scoring model's weakness is in the merit dimensions (struct), not the capability dimensions (tri, muscle).

### Agent Scoring Validation (April 2026)

Agents have 4 scoring dimensions: **fm** (frontmatter), **handoffs**, **bounds**, **code**.

| Agent | Score | fm | handoffs | bounds | code | Human Assessment |
|-------|------:|:--:|:--------:|:------:|:----:|------------------|
| alex-azure | 3/4 | 1 | 1 | 1 | 0 | Good tool tables, clear guidance |
| alex | 3/4 | 1 | 1 | 1 | 0 | Full cognitive architecture, commands — core agent |
| alex-backend | 4/4 | 1 | 1 | 1 | 1 | Code examples, complete structure |
| alex-builder | 4/4 | 1 | 1 | 1 | 1 | Code examples, mermaid diagrams |

**Distribution**: 12 agents | Passing: 12 | Perfect(4/4): 9

#### Agent Criterion Validity

| Dimension | Pass Rate | Issue Identified | Decision |
|-----------|----------:|------------------|----------|
| **fm** | 12/12 | None — mandatory gate | ✓ KEEP |
| **handoffs** | 12/12 | None | ✓ KEEP |
| **~~hooks~~** | 3/12 | Only 3 agents need PostToolUse automation | ✗ REMOVED |
| **bounds** | 12/12 | All within 50-400 lines | ✓ KEEP |
| **~~persona~~** | 9/12 | Naming convention issue, few agents | ✗ REMOVED (enforced via skills/instructions) |
| **code** | 9/12 | Correctly identifies code examples | ✓ KEEP |

### Implemented Changes (April 2026)

**hooks — REMOVED**

Only 3 agents (alex-builder, alex-researcher, alex-validator) need hooks. The other 9 scored defect=0, but this wasn't a quality issue — most agents don't need `PostToolUse` automation. Removed entirely.

**persona — REMOVED (enforced via skills/instructions)**

Persona is an important Alex characteristic, but with only 12 agents, manual enforcement via skills and instructions is more effective than automated header detection. The criterion had naming convention issues (`## Core Identity` didn't match pattern).

### Instruction Scoring Validation (April 2026)

Instructions have 6 scoring dimensions: **fm** (frontmatter), **spec** (specificity), **depth**, **sect** (sections), **code**, **skill** (trifecta).

| Instruction | Score | fm | spec | depth | sect | code | skill | Human Assessment |
|-------------|------:|:--:|:----:|:-----:|:----:|:----:|:-----:|------------------|
| alex-core | 3/6 | 0 | 0 | 1 | 1 | 1 | 0 | 524 lines, core architecture — CRITICAL instruction! |
| emotional-intelligence | 3/6 | 1 | 0 | 1 | 1 | 0 | 0 | Always-on behavior, `applyTo: "**"` is CORRECT |
| terminal-command-safety | 4/6 | 1 | 0 | 1 | 1 | 1 | 0 | Safety rules, `applyTo: "**"` is CORRECT |
| code-review-guidelines | 5/6 | 1 | 1 | 1 | 1 | 1 | 0 | Matching skill exists as `code-review` — naming mismatch |
| ai-character-reference-generation | 6/6 | 1 | 1 | 1 | 1 | 1 | 1 | Perfect trifecta alignment |

**Distribution**: 83 instructions | Passing: 69 | Failing: 14 | Perfect (6/6): 11

#### Instruction Criterion Validity

| Dimension | Pass Rate | Issue Identified | Validity |
|-----------|----------:|------------------|----------|
| **fm** | 69/83 | Requires `applyTo` but some use `excludeAgent` or rely on semantic matching | ⚠ Partial |
| **spec** | 69/83 | Penalizes `applyTo: "**"` but some instructions ARE always-on by design | ✗ Invalid |
| **depth** | 62/83 | Correctly identifies substantive content | ✓ Valid |
| **sect** | 72/83 | Correctly identifies structured content | ✓ Valid |
| **code** | 50/83 | Correctly identifies examples | ✓ Valid |
| **skill** | 46/83 | Assumes all instructions need trifecta; ignores naming mismatches | ⚠ Partial |

#### Analysis

**fm (69/83 pass) — PARTIAL VALIDITY**

The criterion requires BOTH `description` AND `applyTo`. But:
- `alex-core` uses `excludeAgent` (applies to all EXCEPT coding-agent) — no `applyTo`
- `ai-writing-avoidance` relies on Copilot's semantic matching — no `applyTo`

Both are important instructions that fail fm=0 despite being well-designed.

**spec (69/83 pass) — INVALID CRITERION**

Penalizes `applyTo: "**"` as "too broad," but some instructions ARE legitimately always-on:
- `emotional-intelligence` — unconscious behavior for ALL conversations
- `terminal-command-safety` — safety rules for ALL terminal operations

Scoring spec=0 for these is incorrect — they're correctly scoped.

**skill (46/83 pass) — PARTIAL VALIDITY**

Two issues:
1. **Naming mismatch**: `code-review-guidelines.instructions.md` doesn't match `code-review` skill (skill=0, should be 1)
2. **Standalone instructions**: Architecture permits instructions without matching skills:
   - `emotional-intelligence` — behavioral pattern, no skill needed
   - `terminal-command-safety` — safety rules, no skill needed
   - `adversarial-oversight` — review protocol, no skill needed

**Instruction Refinements — PENDING**

| Dimension | Current | Proposed | Status |
|-----------|---------|----------|--------|
| **fm** | Requires `applyTo` | Requires `description` AND (`applyTo` OR `excludeAgent`) | Review needed |
| **spec** | Penalizes `applyTo: "**"` | Skip specificity check; Copilot's semantic matching handles routing | Review needed |
| **skill** | Exact name match | Pattern match: `{instr-name}*.skills/` OR instruction has `standalone: true` frontmatter | Review needed |

### Prompt Scoring Validation (April 2026)

Prompts have 3 scoring dimensions: **desc** (description), **agent** (routes to agent), **>20L** (substantive content).

| Prompt | Score | desc | agent | >20L | Lines | Human Assessment |
|--------|------:|:----:|:-----:|:----:|------:|------------------|
| alex | 2/3 | 1 | 1 | 0 | 7 | Agent routing stub — works correctly |
| ai-character-reference-generation | 2/3 | 1 | 0 | 1 | 379 | Full workflow — works correctly |
| meditate | 3/3 | 1 | 1 | 1 | 36 | Agent + content — complete prompt |
| brainqa | 3/3 | 1 | 1 | 1 | 45 | Agent + content — complete prompt |

**Distribution**: 66 prompts | Passing: 66 | Failing: 0 | Perfect (3/3): 39

#### Prompt Criterion Validity

| Dimension | Pass Rate | Issue Identified | Validity |
|-----------|----------:|------------------|----------|
| **desc** | 66/66 | None | ✓ Valid |
| **agent** | 39/66 | Correctly identifies agent routing prompts | ✓ Valid |
| **>20L** | 53/66 | Correctly identifies substantive content | ✓ Valid |

#### Analysis

**All criteria valid** — Prompts have the simplest and most correct scoring model:

1. **desc** (gate) — Required for discoverability. All prompts have it.
2. **agent** — Identifies routing prompts (short stubs that switch modes)
3. **>20L** — Identifies workflow prompts (full content with steps)

The OR logic works: a prompt needs EITHER agent routing OR substantive content (or both). This correctly allows:
- **Agent routing prompts** (7-16 lines): `/azure`, `/builder`, `/validator` — just switch modes
- **Workflow prompts** (100-500+ lines): `/ai-character-reference-generation`, `/extension-audit-methodology` — full guided workflows
- **Complete prompts** (20-100 lines): `/meditate`, `/brainqa` — agent mode with embedded content

**Trifecta alignment NOT required** — Prompts are a separate entry point, orthogonal to skill-instruction trifectas. Only 6/66 prompts have matching skills+instructions (e.g., `ai-character-reference-generation`), and that's architecturally correct.

**No proposed refinements** — Prompt scoring is valid as-is.

## See Also

- [TRIFECTA-CATALOG.md](TRIFECTA-CATALOG.md) — Complete trifecta inventory
- [COGNITIVE-ARCHITECTURE.md](COGNITIVE-ARCHITECTURE.md) — Overall brain structure
- [brain-qa.cjs](../../.github/muscles/brain-qa.cjs) — Quality grid generator
