---
description: "Research-first development workflow — pre-project knowledge encoding and 4-dimension gap analysis"
---

# Research-First Workflow

> Procedural memory for the Research → Teach → Plan → Execute paradigm

**Synapse**: [.github/skills/research-first-development/SKILL.md] (Critical, Implements, Bidirectional) - "skill provides patterns; instruction provides procedures"
**Synapse**: [.github/instructions/.github/instructions/skill-selection-optimization.instructions.md] (High, Feeds, Forward) - "gap analysis creates skills that SSO selects from"
**Synapse**: [.github/instructions/.github/instructions/bootstrap-learning.instructions.md] (High, Extends, Forward) - "research phase uses bootstrap learning for unknown domains"
**Synapse**: [.github/instructions/.github/instructions/heir-skill-promotion.instructions.md] (High, Integrates, Forward) - "heir projects use this workflow, then promote skills"
**Synapse**: [.github/instructions/.github/instructions/heir-project-improvement.instructions.md] (High, Extends, Forward) - "heir improvement teaches heirs to apply research-first"

---

## Quick Reference

| Phase | Gate | Output |
|-------|------|--------|
| **0: Research** | 3+ deep docs per major domain | Research documents in `/docs/` |
| **1: Encode** | All subsystems covered | Skills, Instructions, Agents, Prompts |
| **2: Gap Analysis** | All 4 dimensions ≥ 75% | Gap report + fill plan |
| **3: Execute** | GA passed | Implementation code |

---

## When to Run

| Trigger | Scope |
|---------|-------|
| New project started | Full workflow (Phase 0-3) |
| New implementation phase | Phase 2-3 (gap analysis + execute) |
| Heir starting a complex project | Full workflow (teach the heir) |
| "gap analysis" keyword | Phase 2 only |
| Running `/gapanalysis` prompt | Interactive Phase 2 |

---

## Phase 0: Research Sprint

### Procedure

1. **Identify domains**: List every technical domain the project touches
2. **Research each domain**: Create one deep research document per domain
   - Minimum 3 documents; aim for 5-10 on complex projects
   - Each doc: structured sections, code examples, decision rationales, cited sources
3. **Record decisions**: Create ADRs for every significant architectural choice
4. **Store everything**: `/docs/` or `/research/` in the project root

### Quality Gate

| Criterion | Threshold |
|-----------|-----------|
| Research docs created | ≥ 3 per project |
| Each doc has code examples | Yes |
| Each doc has decision rationale | Yes |
| Architecture decisions recorded | ≥ 1 ADR per major choice |

### Output

```
docs/
├── DOMAIN-A-RESEARCH.md
├── DOMAIN-B-RESEARCH.md
├── DOMAIN-C-RESEARCH.md
└── decisions/
    ├── ADR-001-language-choice.md
    └── ADR-002-infrastructure.md
```

---

## Phase 1: Knowledge Encoding

### 1.1 Extract Skills

For each research document:

1. Identify **reusable patterns** (not project-specific config)
2. Create 1-3 skills per doc in `.github/skills/{name}/SKILL.md`
3. Each skill gets a `synapses.json` with 2-4 connections
4. Follow [skill-building](../skills/skill-building/SKILL.md) quality gates

### 1.2 Create Instructions

For each **repeatable procedure** the project needs:

| Type | File | Example |
|------|------|---------|
| Context hub | `{project}-context.instructions.md` | Central subsystem inventory |
| Dev workflow | `{project}-development-workflow.instructions.md` | Coding conventions |
| Deployment | `{project}-deployment.instructions.md` | Infrastructure steps |
| Testing | `{project}-testing.instructions.md` | Test strategy + commands |
| CI/CD | `{project}-cicd.instructions.md` | Pipeline definitions |
| Safety | `{project}-safety.instructions.md` | Content safety layers |

### 1.3 Create Agents

Apply the **Two-Agent Pattern** (minimum for non-trivial projects):

| Agent | File | Role |
|-------|------|------|
| **Builder** | `{project}-dev.agent.md` | Constructive: "How do I create this?" |
| **Validator** | `{project}-qa.agent.md` | Adversarial: "How do I break this?" |

**Optional specialists** (add when needed):

| Agent | When |
|-------|------|
| `{project}-devops.agent.md` | Complex infrastructure |
| `{project}-security.agent.md` | Security-critical systems |
| `{project}-data.agent.md` | Data-intensive applications |

### 1.4 Create Prompts

For each **interactive workflow** users will repeat:

| Prompt | Purpose |
|--------|---------|
| `{project}-implement.prompt.md` | Guided feature implementation |
| `{project}-test.prompt.md` | Interactive test authoring |
| `{project}-deploy.prompt.md` | Deployment checklist walkthrough |
| `{project}-redteam.prompt.md` | Adversarial testing session |

### 1.5 Wire Synapse Network

**Mandatory connections:**
- Every skill → 2-4 related files
- Every instruction → project context hub
- Every agent → relevant skills + instructions

---

## Phase 2: Gap Analysis (4-Dimension)

The gap analysis ritual has **four dimensions**. Run all four before each major implementation phase.

### Dimension 1: Skill Gap Analysis (GA-S)

> "Does Alex know the *patterns* needed for this phase?"

| Step | Question |
|------|----------|
| 1 | List all subsystems/features in this phase |
| 2 | For each: "If I ask 'how does {X} work?', is there a skill?" |
| 3 | Score: `(subsystems with skills) / (total subsystems) × 100` |
| 4 | For each gap: extract skill from research doc, or bootstrap-learn |

**Threshold**: ≥ 75% coverage before coding.

**Template:**

```markdown
## GA-S: Skill Gap Analysis — Phase {N}

| Subsystem | Skill Exists? | Gap? | Action |
|-----------|:---:|:---:|--------|
| {subsystem-a} | ✅ | — | — |
| {subsystem-b} | ❌ | YES | Create from {research-doc} |
| {subsystem-c} | ⚠️ partial | YES | Extend {existing-skill} |

**Coverage**: {X}% ({covered}/{total})
**Verdict**: {PASS/FILL GAPS}
```

### Dimension 2: Instruction Gap Analysis (GA-I)

> "Does Alex know the *procedures* for this phase?"

| Step | Question |
|------|----------|
| 1 | List all repeatable workflows in this phase |
| 2 | For each: "If I ask 'how do I do {X} in this project?', is there an instruction?" |
| 3 | Score: `(covered workflows) / (total workflows) × 100` |
| 4 | For each gap: create project-specific instruction |

**Template:**

```markdown
## GA-I: Instruction Gap Analysis — Phase {N}

| Workflow | Instruction Exists? | Gap? | Action |
|----------|:---:|:---:|--------|
| Deploy to staging | ✅ | — | — |
| Run integration tests | ❌ | YES | Create {project}-testing.instructions.md |
| Prompt authoring | ⚠️ generic | YES | Add project-specific section |

**Coverage**: {X}% ({covered}/{total})
**Verdict**: {PASS/FILL GAPS}
```

### Dimension 3: Agent Gap Analysis (GA-A)

> "Does Alex have the right *roles* for this phase?"

| Step | Question |
|------|----------|
| 1 | List all distinct cognitive roles this phase needs |
| 2 | For each: "Is there an agent with this mental model?" |
| 3 | Check: Builder ✓ Validator ✓ Specialists? |
| 4 | For each gap: create agent with appropriate tools, skills, handoffs |

**Key questions for agent gap detection:**
- "Is there an adversarial thinker?" (validator/QA agent)
- "Is there a domain specialist?" (security, data, infrastructure)
- "Do agents hand off cleanly at domain boundaries?"
- "Does each agent load the right skills for its role?"

**Template:**

```markdown
## GA-A: Agent Gap Analysis — Phase {N}

| Role | Agent Exists? | Gap? | Action |
|------|:---:|:---:|--------|
| Builder (dev) | ✅ {project}-dev | — | — |
| Validator (QA) | ❌ | YES | Create {project}-qa.agent.md |
| Infrastructure | ⚠️ generic alex-azure | PARTIAL | Add project-specific handoff |

**Coverage**: {X}% ({covered}/{total})
**Verdict**: {PASS/FILL GAPS}
```

### Dimension 4: Prompt Gap Analysis (GA-P)

> "Does Alex have the right *interactive workflows* for this phase?"

| Step | Question |
|------|----------|
| 1 | List all interactive workflows users will repeat in this phase |
| 2 | For each: "Is there a `/command` prompt for this?" |
| 3 | Check: Implementation ✓ Testing ✓ Deployment ✓ Review ✓ |
| 4 | For each gap: create `.prompt.md` with guided workflow |

**Key questions for prompt gap detection:**
- "What do developers do repeatedly? Is there a guided prompt for it?"
- "What workflows require specific sequencing? Could a prompt enforce that?"
- "What tasks benefit from interactive Alex guidance vs. raw execution?"
- "Are there domain-specific review/audit workflows that need codified steps?"

**Template:**

```markdown
## GA-P: Prompt Gap Analysis — Phase {N}

| Workflow | Prompt Exists? | Gap? | Action |
|----------|:---:|:---:|--------|
| Feature implementation | ✅ /implement | — | — |
| Red team testing | ❌ | YES | Create {project}-redteam.prompt.md |
| Deployment walkthrough | ❌ | YES | Create {project}-deploy.prompt.md |

**Coverage**: {X}% ({covered}/{total})
**Verdict**: {PASS/FILL GAPS}
```

### Combined Gap Report

After running all 4 dimensions, produce combined report:

```markdown
## Gap Analysis Report — Phase {N}

| Dimension | Coverage | Verdict |
|-----------|:---:|---------|
| GA-S (Skills) | {X}% | {PASS/FILL} |
| GA-I (Instructions) | {X}% | {PASS/FILL} |
| GA-A (Agents) | {X}% | {PASS/FILL} |
| GA-P (Prompts) | {X}% | {PASS/FILL} |

**Overall**: {READY / GAPS TO FILL}
**Estimated fill time**: {N hours/days}
```

**Decision gate:**
- All 4 ≥ 75%: **Proceed to Phase 3**
- Any dimension < 75%: **Fill gaps first**
- Any dimension < 50%: **Stop — research sprint needed**

---

## Phase 3: Execute

With knowledge base complete, implementation becomes conversational:

1. Load project context instruction (hub)
2. SSO protocol selects relevant skills
3. Agent provides role-appropriate guidance
4. Prompts enforce workflow discipline
5. No re-explanation, no context loss, no hallucination

---

## Heir Generalization

### What Heirs Inherit

This workflow is `inheritable` — all heirs get the skill (`research-first-development`) and can run gap analysis independently.

### Heir-Specific Adaptations

| Master Process | Heir Adaptation |
|----------------|-----------------|
| Phase 0 Research Sprint | Heir runs research within its project scope |
| Phase 1 Knowledge Encoding | Heir creates project-specific skills/instructions |
| Phase 2 Gap Analysis | Same 4-dimension protocol; heir runs `/gapanalysis` |
| Phase 3 Execute | Same conversational implementation |

### Heir → Master Promotion

When heir knowledge is **generalizable** (cross-project applicability):
1. Heir signals readiness (quality gate ≥ 12 from heir-skill-promotion)
2. Master reviews for generalizability
3. Promote to Master's `.github/skills/` and Global Knowledge
4. Update indexes and catalogs

---

## Specialized Process Templates

### Development Process

```markdown
## Dev Gap Analysis Checklist
- [ ] GA-S: Core domain skills exist for all subsystems
- [ ] GA-I: Coding conventions, PR workflow, branching strategy documented
- [ ] GA-A: Builder agent has all implementation skills loaded
- [ ] GA-P: /implement prompt guides feature development workflow
```

### Testing Process

```markdown
## Test Gap Analysis Checklist
- [ ] GA-S: Testing strategies skill covers project-specific patterns
- [ ] GA-I: Test workflow instruction defines pyramid, mocks, fixtures
- [ ] GA-A: Validator agent has adversarial testing skills loaded
- [ ] GA-P: /test and /redteam prompts guide testing sessions
```

### Deployment Process

```markdown
## Deploy Gap Analysis Checklist
- [ ] GA-S: Infrastructure skills (IaC, networking, auth patterns)
- [ ] GA-I: Deployment instruction has step-by-step with validation
- [ ] GA-A: DevOps agent (or Azure agent) has deployment skills
- [ ] GA-P: /deploy prompt walks through deployment checklist
```

### QA Process

```markdown
## QA Gap Analysis Checklist
- [ ] GA-S: Content safety, accessibility, performance skills
- [ ] GA-I: Quality gates instruction defines release-blocking thresholds
- [ ] GA-A: QA agent has adversarial testing + audit commands
- [ ] GA-P: /audit, /redteam, /accessibility prompts exist
```

---

## Synapse Triggers

| Keyword | Activation |
|---------|-----------|
| "new project" | Full Phase 0-3 workflow |
| "gap analysis" / "GA" | Phase 2 (4-dimension) |
| "GA-S" / "skill gap" | Dimension 1 only |
| "GA-I" / "instruction gap" | Dimension 2 only |
| "GA-A" / "agent gap" | Dimension 3 only |
| "GA-P" / "prompt gap" | Dimension 4 only |
| "before coding" / "pre-implementation" | Phase 2 decision gate |
| "research sprint" | Phase 0 |
| "knowledge encoding" | Phase 1 |

---

*Instruction created: 2026-02-13 | Origin: Dead Letter heir promotion*
*Covers: research-first methodology, 4-dimension gap analysis (GA-S, GA-I, GA-A, GA-P)*
