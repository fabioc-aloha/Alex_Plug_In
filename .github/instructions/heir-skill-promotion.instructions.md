# Heir Skill Promotion Protocol

> How skills evolve from heir projects to Master Alex

**Synapse**: [bootstrap-learning.instructions.md] (0.8, procedural, bidirectional) - "heir develops expertise"

---

## When to Use

- Heir completes a real-world project with domain expertise
- Knowledge is generalizable beyond the specific project
- Skill doesn't already exist in Master Alex

---

## The Promotion Workflow

### 1. Let Heirs Experiment First
- Heirs learn by **doing**, not reading specs
- Real projects create battle-tested knowledge
- Edge cases discovered through actual use

### 2. Ship Before Documenting
> A skill written after successful delivery is worth 10x one written from theory.

**Wait for:**
- Project completion or major milestone
- Real-world validation (published, deployed, shipped)
- Gotchas and fixes discovered

### 3. Heir Creates the Skill
Ask the heir:
```
Look at `.github/skills/markdown-mermaid/SKILL.md` as a reference.
Create a similar skill for [domain] in `.github/skills/[skill-name]/`.
Include the gotchas you discovered.
```

### 4. Master Reviews
- Is it generalizable beyond this project?
- Are the patterns reusable?
- Does it overlap with existing skills?

### 5. Promote to Master
**Option A**: Copy skill folder from heir to Master's `.github/skills/`

**Option B**: Use `alex_promote_knowledge` tool if it's a DK file

### 6. Update Master's Catalog
- Add to `copilot-instructions.md` skill list
- Regenerate `SKILL-CATALOG-GENERATED.md`

---

## Anti-Patterns

| ❌ Don't | ✅ Do Instead |
|----------|---------------|
| Write skill before project starts | Let real work inform the skill |
| Copy half-baked learnings | Wait for validated knowledge |
| Duplicate existing skills | Extend or merge with existing |
| Skip the review step | Master validates before absorption |

---

## Example: AlexCook → rich-document-pdf

1. ✅ Heir built cookbook with MD/emoji/SVG → PDF pipeline
2. ⏳ Heir finalizing scripts for Amazon KDP publication
3. 🔜 After ship: heir creates `.github/skills/rich-document-pdf/SKILL.md`
4. 🔜 Master reviews and promotes

---

*Skills are earned through doing, not declared by planning.*
