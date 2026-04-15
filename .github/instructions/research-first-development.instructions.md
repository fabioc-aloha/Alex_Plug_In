---
description: "Build knowledge bases that build software — research before code, teach before execute"
application: "When starting new projects, domains, or features requiring research foundation"
applyTo: "**/*research*,**/*knowledge-base*,**/*domain-learning*"
---

# Research-First Development

Quick-reference for research-first methodology. See [research-first-development skill](.github/skills/research-first-development/SKILL.md) for full procedures.

## Core Principle

```text
Traditional:  Requirements → Design → Code → Test
AI-Assisted:  Research → Teach → Plan → Execute
```

**The quality of AI output is directly proportional to the quality of knowledge in its context.**

## When to Use

| Trigger | Action |
|---------|--------|
| Starting new project | Full research sprint first |
| New domain/technology | 3-5 deep research docs before code |
| Inconsistent AI output | Gap analysis — missing knowledge |
| Complex multi-subsystem work | Encode before execute |

## Research Sprint (Phase 0)

| Step | Output |
|------|--------|
| 1. Competitive landscape | Understanding of prior art |
| 2. Technical feasibility | Deep research documents (3-5) |
| 3. Architecture decisions | ADRs for key choices |
| 4. Domain research | Comprehensive domain knowledge |

## 4-Dimension Gap Analysis

Run before each implementation phase:

| Code | Dimension | Question |
|------|-----------|----------|
| **GA-S** | Skills | Does Alex know the *patterns*? |
| **GA-I** | Instructions | Does Alex know the *procedures*? |
| **GA-A** | Agents | Does Alex have the right *roles*? |
| **GA-P** | Prompts | Does Alex have the *workflows*? |

### Decision Gate

| Coverage | Action |
|----------|--------|
| All 4 ≥ 75% | Proceed to coding |
| Any < 75% | Fill gaps first |
| Any < 50% | Research sprint needed |

## Knowledge Encoding

### What to Create

| Type | Purpose | Example |
|------|---------|---------|
| **Skills** | Patterns and principles | `sse-streaming/SKILL.md` |
| **Instructions** | Procedures and workflows | `release-process.instructions.md` |
| **Agents** | Cognitive roles | `{project}-dev.agent.md` |
| **Prompts** | Interactive workflows | `implement.prompt.md` |

### Two-Agent Pattern (Minimum)

| Agent | Focus | Mental Model |
|-------|-------|--------------|
| **Builder** | Implementation | Constructive — "How do I create this?" |
| **Validator** | Quality | Adversarial — "How do I break this?" |

## Research Artifacts

| Artifact | Location | Purpose |
|----------|----------|---------|
| Research docs | `research/` or `docs/` | Deep domain exploration |
| Skills | `.github/skills/` | Reusable patterns |
| Instructions | `.github/instructions/` | Project procedures |
| ADRs | `.github/decisions/` | Architecture rationale |

## Replication Checklist

- [ ] Create 3-5 deep research documents
- [ ] Create `{project}-context.instructions.md` hub
- [ ] Extract 5-10 skills from research
- [ ] Create Builder + Validator agents
- [ ] Create implementation prompts
- [ ] Run 4D gap analysis (GA-S/I/A/P)
- [ ] Validate with brain-qa before coding

## Anti-Patterns

| Bad Practice | Consequence | Instead |
|--------------|-------------|---------|
| Just start coding | AI hallucinates patterns | Research → Teach → Plan → Execute |
| Skip gap analysis | Discover gaps mid-implementation | Run all 4 dimensions at phase start |
| One mega-agent | Conflated mental models | Separate Builder and Validator |
| Research without encoding | Raw docs aren't loadable | Extract skills from every research doc |
| Skills-only analysis | Misses procedures and workflows | Run all 4 dimensions (GA-S/I/A/P) |
