```prompt
---
description: Run a structured 4-phase implementation plan using the VS Code Plan Agent
mode: agent
agent: Alex
---

# /plan — Structured Implementation Planning

Guide the user through a 4-phase structured plan for complex Alex tasks. Use the VS Code Plan Agent's workflow to ensure thorough discovery before implementation.

## When to Use

Invoke `/plan` for tasks that involve:
- Cognitive architecture changes (new skills, trifectas, agent restructuring)
- Heir migrations and sync operations
- Feature development across multiple files
- Release preparation
- New platform integrations

## 4-Phase Workflow

### Phase 1 — Discovery

Survey the available landscape before acting:

1. **Skill discovery**: Are there existing skills relevant to this task? Check `.github/skills/` and the skill-activation index.
2. **File archeology**: What files will be affected? Read them before touching them.
3. **Dependency check**: What does this change depend on? What depends on it?
4. **Constraint detection**: Are there safety imperatives or locked files involved?

**Deliverable**: List of affected files, relevant skills, and constraints.

### Phase 2 — Alignment

Clarify before building:

1. Define **success criteria** — how will we know this is done correctly?
2. Identify **ambiguities** — what's unclear in the request?
3. Agree on **scope** — what is explicitly out of scope?
4. Assign **working memory** — what context must stay active throughout?

**Deliverable**: Confirmed scope and success criteria (explicit user sign-off if risky).

### Phase 3 — Design

Draft the implementation plan:

1. Break work into **ordered, atomic tasks** (each checkable)
2. Identify **parallelizable** vs **sequential** steps
3. Note **verification checkpoints** (brain-qa, compile check, sync)
4. Flag **rollback strategy** if something goes wrong (git commit point)

**Deliverable**: Numbered task list with checkboxes.

### Phase 4 — Refinement

Before executing, validate the plan:

1. **Edge cases**: What could go wrong?
2. **Quality gates**: What brain-qa phases are affected?
3. **Documentation**: What changelog/roadmap entries are needed?
4. **Sync**: Will heir need a sync run afterward?

**Deliverable**: Finalized plan, ready to execute.

---

## Alex-Specific Plan Templates

### Architecture Refactoring Plan
```
Discovery:  Read all affected .md + synapses.json + SYNAPSE-SCHEMA.json
Alignment:  Confirm scope, check for master-only restrictions
Design:     Edit → validate → sync to heir → brain-qa
Refinement: Identify brain-qa phases impacted, changelog entry needed
```

### New Skill Plan
```
Discovery:  Check SKILLS-CATALOG for existing coverage; read skill-building trifecta
Alignment:  Confirm trifecta scope (SKILL.md + instructions + prompt + synapses)
Design:     Create files in order → add to skill-activation index → run brain-qa
Refinement: Verify synapse schema compliance, heir sync, catalog count update
```

### Release Preparation Plan
```
Discovery:  Read current CHANGELOG + ROADMAP + package.json version
Alignment:  Confirm version bump level (patch/minor/major)
Design:     CHANGELOG → ROADMAP → package.json → heir CHANGELOG → brain-qa
Refinement: Run full brain-qa (all 35 phases), verify exit 0
```

---

## Start

Ask the user what they're planning to implement, then walk through Phase 1 Discovery together.
```
