---
description: "Interactive project improvement — identify trifecta candidates and run research-first gap analysis"
agent: "Alex"
---

# /improve — Heir Project Improvement

> **Avatar**: Call `alex_cognitive_state_update` with `state: "planning"`. This updates the welcome sidebar avatar.

Guide me through improving this project's cognitive architecture using trifecta creation and research-first development.

## Context

- Read `.github/instructions/heir-project-improvement.instructions.md` for the full procedure
- Read `.github/instructions/trifecta-audit.instructions.md` § "Heir Trifecta Implementation" for trifecta model
- Read `.github/skills/research-first-development/SKILL.md` for 4D gap analysis patterns

## Workflow

### Phase 1: Trifecta Audit (15-20 min)

1. **Inventory**: Scan `.github/skills/`, `.github/instructions/`, `.github/prompts/` — count what exists
2. **Identify core capabilities**: Ask "What are the 3-5 things this project does every day?"
3. **Run heir Why Test** on each candidate:
   - Frequency (daily/weekly)?
   - Domain depth (deep gotchas)?
   - User-invocable (named command)?
   - Complexity (6+ steps)?
4. **Classify**: TRIFECTA | INSTRUCTION+SKILL | SKILL-ONLY
5. **Report** findings as a table

### Phase 2: Trifecta Creation (30 min per trifecta)

For each trifecta candidate:

1. **Check what exists**: Skill? Instruction? Prompt?
2. **Create missing instruction** if needed (procedural steps, auto-loaded)
3. **Create missing prompt** if needed (interactive `/command`)
4. **Wire synapses** — each component references the other two + related files
5. **Validate purpose** — can you justify why each file exists?

### Phase 3: Research-First Gap Analysis (30 min)

Run the 4-dimension gap analysis:

1. **GA-S (Skills)**: For each subsystem — "Is there a skill that teaches the patterns?"
2. **GA-I (Instructions)**: For each workflow — "Is there a procedure for this?"
3. **GA-A (Agents)**: "Do we have Builder + Validator agents?" + specialists?
4. **GA-P (Prompts)**: For each repeatable task — "Is there a `/command`?"
5. **Score** each dimension (target: all ≥ 75%)
6. **Fill gaps** — create missing files, research if needed

### Phase 4: Validation (5 min)

1. Run Dream (Neural Maintenance) — 0 broken synapses
2. Verify counts updated in `copilot-instructions.md`
3. Verify new trifectas are justified (pass the Why Test)

## Output

Provide a summary report:

```markdown
## Project Improvement Report

### Trifecta Audit
| Capability | Classification | Components | Status |
|-----------|---------------|------------|--------|
| {name} | Trifecta | S+I+P | ✅ Complete / 🔧 Created |

### Gap Analysis (4D)
| Dimension | Coverage | Verdict |
|-----------|:---:|---------|
| GA-S (Skills) | X% | PASS/FILL |
| GA-I (Instructions) | X% | PASS/FILL |
| GA-A (Agents) | X% | PASS/FILL |
| GA-P (Prompts) | X% | PASS/FILL |

### Files Created
- {list new files}

### Promotion Candidates
- {capabilities worth promoting to Master or Global Knowledge}

> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: null` to restore default avatar.

```
