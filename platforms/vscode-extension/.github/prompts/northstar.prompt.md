---
agent: Alex
description: Define or review project North Star vision
---

# /northstar

Define, review, or align with your project's North Star vision.

## Usage

- `/northstar` — Review current North Star and alignment
- `/northstar define` — Create a new North Star for this project  
- `/northstar check <decision>` — Check if a decision aligns with North Star
- `/northstar template nasa` — Generate NASA-quality North Star template
- `/northstar template product` — Generate product vision template
- `/northstar template research` — Generate research project template

## Process

### Review Mode (default)

1. Read Active Context for `North Star:` and `Guidelines:` fields
2. If found: Display current North Star and assess recent alignment
3. If missing: Prompt to define one using `/northstar define`

### Define Mode

**Step 1: User Input Phase (MANDATORY)**

Before drafting anything, ASK these questions using ask_questions tool:

**Question Set 1 — Vision**:
- What would make this project legendary? (free text)
- Who benefits most from this project? (options: End users, Developers, Enterprise, Research community, Other)
- What emotion should users feel? (options: Trust, Delight, Confidence, Relief, Empowerment)

**Question Set 2 — Quality**:
- What quality standard applies? (options: NASA-Quality Default, Product Excellence, Research Rigor, Startup Speed, Custom)
- What's your Definition of Done threshold? (options: Comprehensive (all checks), Pragmatic (core checks), Minimal (ship fast))

**Step 2: Draft North Star**

Using user answers:
1. Draft one-sentence North Star
2. Present for approval: "Does this capture your vision?"
3. Iterate if user wants changes

**Step 3: Create NORTH-STAR.md**

1. Use appropriate template based on quality answer
2. Customize DoD based on threshold
3. Break down each key word in vision statement

**Step 4: Active Context Integration**

1. Add `North Star:` and `Guidelines:` to copilot-instructions.md
2. Confirm integration complete

### Check Mode

1. Read the North Star from Active Context
2. Evaluate the proposed decision against the vision
3. Respond with:
   - ✅ **Aligned**: This serves the North Star because...
   - ⚠️ **Unclear**: Need more context to assess alignment
   - ❌ **Misaligned**: This may compromise the vision because...

### Template Mode

Generate the appropriate template from the north-star skill, customized for this project's context.

## Output

Present findings as:

```
## North Star Status

**Vision**: [The North Star statement]
**Guidelines**: [Path to detailed document]

### Alignment Assessment

[Recent work alignment analysis]

### Recommendations

[Any suggested adjustments or reminders]
```

## NASA-Quality Default (for heirs)

If no North Star exists and user requests one quickly:

```markdown
North Star: Build software that earns trust through reliability, correctness, and transparency
Guidelines: Read NORTH-STAR.md — NASA-quality standards and daily decision filters
```

This invokes the NASA Power of 10 principles as the quality baseline.
