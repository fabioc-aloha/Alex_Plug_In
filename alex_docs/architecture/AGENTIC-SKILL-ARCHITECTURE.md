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
Merit:       struct + code + bounds
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
| **struct** | Structural merit | Pass threshold |
| **code** | Code examples | Pass threshold |
| **bounds** | Size limits | Pass threshold |
| **tri** | Trifecta alignment | Skill type |
| **muscle** | Automation component | Agentic status |

## Scoring Model

```
Score = fm + struct + code + bounds + tri + muscle (max 6)

Pass thresholds by tier:
  core:       6/6 (must be perfect)
  standard:   5/6 (one defect allowed)
  extended:   4/6 (two defects allowed)
  specialist: 3/6 (three defects allowed)
```

**Gate requirement**: fm=1 is mandatory. Without frontmatter, the skill is invisible to activation.

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

| Skill | Tier | Score | fm | struct | code | bounds | tri | muscle | Type | Human Assessment |
|-------|------|------:|:--:|:------:|:----:|:------:|:---:|:------:|:----:|------------------|
| dissertation-defense | exte | 1/4 | 1 | 0 | 0 | 0 | 0 | 0 | - | Good domain content, actionable checklists |
| career-development | exte | 2/4 | 1 | 0 | 0 | 1 | 0 | 0 | - | Excellent tables, complete resume guidance |
| code-review | core | 3/6 | 1 | 0 | 1 | 1 | 0 | 0 | - | High-quality methodology, 3-pass framework |
| image-handling | stan | 4/5 | 1 | 0 | 1 | 1 | 1 | 0 | I | Clear format selection, code examples |
| brain-qa | stan | 5/5 | 1 | 0 | 1 | 1 | 1 | 1 | A | Complete with automation script |
| md-to-word | stan | 5/5 | 1 | 0 | 1 | 1 | 1 | 1 | A | Full conversion pipeline |

### Criterion Validity Findings

| Dimension | Pass Rate | Issue Identified | Validity |
|-----------|----------:|------------------|----------|
| **fm** | 168/168 | None | ✓ Valid |
| **struct** | 2/168 | Requires `## Troubleshooting` AND `## Activation` sections — only 2 skills use this template | ✗ Invalid |
| **code** | 128/168 | Correctly identifies code examples | ✓ Valid |
| **bounds** | 152/168 | Correctly flags outliers | ✓ Valid |
| **tri** | 97/168 | Misses renamed instructions (e.g., `code-review` vs `code-review-guidelines`) | ⚠ Partial |
| **muscle** | 9/168 | Correctly identifies automation scripts | ✓ Valid |

### Detailed Analysis

**struct (2/168 pass) — INVALID CRITERION**

The `struct` dimension requires BOTH of these exact section headers:
- `## Troubleshooting`
- `## Activation` (or `## Activation Patterns`)

Only `research-first-development` and `skill-building` have both. This doesn't measure structural quality — it measures adherence to an arbitrary template that 98.8% of skills don't use.

**Example**: `code-review` has excellent structure (Review Priority, 3-Pass Review, Comment Prefixes, Checklist, Anti-Patterns) but scores struct=0 because it lacks these specific headers.

**tri (97/168 pass) — PARTIAL VALIDITY**

The trifecta check (`hasMatchingInstruction`) looks for `{skill-name}.instructions.md`. This misses:
- `code-review` → instruction is `code-review-guidelines.instructions.md` (tri=0, should be 1)
- Skills with hyphenated variants or merged instructions

**muscle (9/168 pass) — VALID BUT OVERSTATED**

The muscle criterion correctly identifies agentic skills, but the 159/168 "defect" count is misleading — most skills are legitimately intellectual and don't need automation.

### Proposed Refinements

| Dimension | Current | Proposed |
|-----------|---------|----------|
| **struct** | Troubleshooting + Activation sections | ≥3 level-2 headers (`##`) indicating organized structure |
| **tri** | Exact name match only | Pattern match: `{skill-name}*.instructions.md` |
| **muscle** | Counted as defect if missing | Only count as defect for skills with `actionable: true` in frontmatter |

### Type Classification Validity

The Intellectual/Agentic/Incomplete classification **is valid**:

| Type | Count | Description | Validates |
|------|------:|-------------|-----------|
| Agentic (A) | 7 | Skills with muscle scripts | ✓ All have working automation |
| Intellectual (I) | 90 | Skills with trifecta, no muscle | ✓ Guide reasoning, don't execute |
| Incomplete (-) | 71 | Missing trifecta alignment | ✓ Need matching instructions |

The type system correctly distinguishes capabilities. The scoring model's weakness is in the merit dimensions (struct), not the capability dimensions (tri, muscle).

### Agent Scoring Validation (April 2026)

Agents have 6 scoring dimensions: **fm** (frontmatter), **handoffs**, **hooks**, **bounds**, **persona**, **code**.

| Agent | Score | fm | handoffs | hooks | bounds | persona | code | Human Assessment |
|-------|------:|:--:|:--------:|:-----:|:------:|:-------:|:----:|------------------|
| alex-azure | 3/6 | 1 | 1 | 0 | 1 | 0 | 0 | Good tool tables, clear guidance — works fine |
| alex | 3/6 | 1 | 1 | 0 | 1 | 0 | 0 | Full cognitive architecture, commands — core agent! |
| alex-backend | 5/6 | 1 | 1 | 0 | 1 | 1 | 1 | Has `## Mental Model`, code examples |
| alex-builder | 6/6 | 1 | 1 | 1 | 1 | 1 | 1 | Has hooks, mental model, mermaid |

**Distribution**: 12 agents | 3 failing (3/6) | 6 passing (5/6) | 3 perfect (6/6)

#### Agent Criterion Validity

| Dimension | Pass Rate | Issue Identified | Validity |
|-----------|----------:|------------------|----------|
| **fm** | 12/12 | None | ✓ Valid |
| **handoffs** | 12/12 | None | ✓ Valid |
| **hooks** | 3/12 | Legitimate — most agents don't need PostToolUse hooks | ⚠ Misleading |
| **bounds** | 12/12 | All within 50-400 lines | ✓ Valid |
| **persona** | 9/12 | Requires specific headers (`## Mental Model`, `## Mindset`, etc.) | ⚠ Partial |
| **code** | 9/12 | Correctly identifies code examples | ✓ Valid |

#### Analysis

**persona (9/12 pass) — PARTIAL VALIDITY**

The criterion checks for headers matching:
- `## Mental Model`
- `## When to Use`
- `## Persona`
- `## Mindset`
- `## Core Directive`

The main `alex` agent has `## Core Identity` which serves the same purpose but doesn't match the pattern. This is a naming convention issue, not a quality issue.

**hooks (3/12 pass) — MISLEADING CRITERION**

Only 3 agents (alex-builder, alex-researcher, alex-validator) have hooks. The other 9 score 0, but this isn't a defect — most agents don't need `PostToolUse` automation. The criterion confuses "capability present" with "capability needed."

**Proposed Agent Refinements**

| Dimension | Current | Proposed |
|-----------|---------|----------|
| **persona** | Match specific header names | Match `## Core` OR `## Mental` OR `## Persona` OR `## Identity` |
| **hooks** | Scored as defect if missing | Only score if agent performs file operations (Builder, Validator) |

## See Also

- [TRIFECTA-CATALOG.md](TRIFECTA-CATALOG.md) — Complete trifecta inventory
- [COGNITIVE-ARCHITECTURE.md](COGNITIVE-ARCHITECTURE.md) — Overall brain structure
- [brain-qa.cjs](../../.github/muscles/brain-qa.cjs) — Quality grid generator
