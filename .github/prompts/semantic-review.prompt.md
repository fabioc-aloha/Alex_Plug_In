---
description: Semantic review of brain files for clarity, coherence, correctness, completeness, and conciseness
application: "When performing semantic reviews of skills, instructions, agents, or prompts in the brain health grid"
agent: Brain Ops
---

# /semantic-review - Brain File Quality Audit

Systematic semantic review for cognitive architecture files. Run after automated brain-qa passes to validate human-facing quality.

## Review Target

Specify the file to review:

```
/semantic-review .github/skills/code-review/SKILL.md
/semantic-review .github/instructions/debugging-patterns.instructions.md
```

Or review the next item from the Priority Queue:

```
/semantic-review --next
```

## 5C Review Framework

| Criterion | Question | Red Flags |
|-----------|----------|-----------|
| **Clarity** | Can a reader understand intent without external context? | Undefined terms, ambiguous pronouns, assumed knowledge |
| **Coherence** | Do sections flow logically? No contradictions? | Section order unclear, conflicting guidance, orphan sections |
| **Correctness** | Are facts, patterns, and examples still accurate? | Outdated API references, deprecated patterns, stale examples |
| **Completeness** | Missing edge cases or common scenarios? | Happy path only, no error handling, incomplete decision trees |
| **Conciseness** | Can any section be shortened without losing value? | Redundant explanations, over-documentation, verbose examples |

## Review Process

### Phase 1: Orientation (2 min)

1. Read the frontmatter (description, application, applyTo)
2. Skim section headers to understand structure
3. Identify the file's PURPOSE: teaching, workflow, reference, or routing?

### Phase 2: Deep Read (5-10 min)

Work through each 5C criterion:

**Clarity Checks**:

- [ ] First sentence explains what this file is for
- [ ] Technical terms are defined or linked
- [ ] Examples match the explanation
- [ ] No "obviously" or "simply" hiding complexity

**Coherence Checks**:

- [ ] Sections build on each other logically
- [ ] No contradictions between sections
- [ ] Cross-references are bidirectional
- [ ] Trifecta alignment (skill ↔ instruction ↔ prompt)

**Correctness Checks**:

- [ ] Code examples compile/run (spot check)
- [ ] API patterns match current versions
- [ ] Links work and point to correct targets
- [ ] Version numbers and dates are current

**Completeness Checks**:

- [ ] Common failure modes documented
- [ ] Edge cases covered
- [ ] Prerequisites stated
- [ ] "When NOT to use" guidance included

**Conciseness Checks**:

- [ ] No repeated information across sections
- [ ] Examples are minimal but complete
- [ ] Prose can't be shortened without losing meaning
- [ ] No filler phrases ("it should be noted that...")

### Phase 3: Mark Reviewed (1 min)

1. Run `node .github/muscles/brain-qa.cjs`
2. Edit `.github/quality/brain-health-grid.md`
3. Find the file's row and update `Sem Review` column from `-` to `YYYY-MM-DD`
4. Commit: `docs: semantic review of [filename]`

## Review Output Format

```markdown
## Semantic Review: [filename]

**Reviewed**: YYYY-MM-DD
**Verdict**: PASS | PASS with notes | NEEDS WORK

### 5C Assessment

| Criterion | Score | Notes |
|-----------|:-----:|-------|
| Clarity | ✓/✗ | [findings] |
| Coherence | ✓/✗ | [findings] |
| Correctness | ✓/✗ | [findings] |
| Completeness | ✓/✗ | [findings] |
| Conciseness | ✓/✗ | [findings] |

### Findings

#### Must Fix (blocking semantic review date)
- [issue 1]
- [issue 2]

#### Should Fix (quality improvement)
- [issue 1]

#### Consider (optional enhancements)
- [idea 1]
```

## Batch Review Workflow

For reviewing multiple files in sequence:

1. Open `.github/quality/brain-health-grid.md`
2. Go to Priority Queue section
3. Review files top-to-bottom (worst first)
4. After each review, regenerate grid to update queue
5. Target: 3-5 files per session to maintain quality

## When to Re-Review

Files should be re-reviewed when:

- 6+ months since last review
- Significant changes made (>20% content changed)
- Related files updated (trifecta partner changed)
- User reports confusion or errors
- API/pattern deprecation detected
