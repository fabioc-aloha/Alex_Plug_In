# Skill Building Procedure

Step-by-step process for creating, assessing, and completing skills.

## Prerequisites

- Real-world experience with the domain (not theory)
- Pattern used 3+ times or gotcha encountered
- Checked skill catalog — skill doesn't already exist

## Phase 1: Create the SKILL.md

1. **Create folder**: `.github/skills/{skill-name}/`
2. **Write frontmatter**: `name`, `description`, `applyTo` glob patterns
3. **Write content**: Domain knowledge with tables, thresholds, examples, anti-patterns
4. **Add synapses.json**: 2-5 meaningful connections to related skills

### Depth Check (Mandatory)

Before proceeding, assess the SKILL.md against the depth rubric:

| Check | Pass Criteria |
|-------|--------------|
| Opening line | NOT "Expert in..." or "Capabilities:" — should state a specific insight |
| Tables | Contain real data (thresholds, trade-offs), not just category labels |
| Sections | Domain-specific knowledge modules, not "When to Use" / "Input/Output" |
| Examples | Concrete and specific, not abstract descriptions |
| Litmus test | Would an LLM produce equally useful content without this skill? Must be **no** |

If any check fails, rewrite the section before continuing.

## Phase 2: Register the Skill

5. **Add to skill-activation index**: `.github/skills/skill-activation/SKILL.md` — add action keywords
6. **Update synapses.json** in connected skills (bidirectional links)

## Phase 3: Assess Trifecta Need

7. **Ask**: Does this skill describe a multi-step workflow with decision points?
   - **Yes** → Create `.instructions.md` (Phase 4)
   - **No** → Skip to Phase 5

8. **Ask**: Would users benefit from a guided interactive conversation?
   - **Yes** → Create `.prompt.md` (Phase 4)
   - **No** → Skip to Phase 5

### Decision Matrix

| Skill Type | Needs .instructions.md? | Needs .prompt.md? |
|-----------|:-:|:-:|
| Reference knowledge (tables, patterns) | No | No |
| Multi-step process (build, deploy, review) | **Yes** | Maybe |
| Interactive workflow (learning, meditation) | Maybe | **Yes** |
| Automated by extension code | No | No |
| Internal metacognitive (auto-trigger) | No | No |

## Phase 4: Build Trifecta Components

### If creating .instructions.md:

9. **Create file**: `.github/instructions/{skill-name}.instructions.md`
10. **Write numbered steps** with decision points and checkpoints
11. **Reference the SKILL.md** for domain knowledge ("see {skill} skill for details")
12. **Add applyTo** if the instruction should auto-load for specific file patterns

### If creating .prompt.md:

13. **Create file**: `.github/prompts/{name}.prompt.md`
14. **Write guided conversation flow** with user interaction points
15. **Register as slash command** if user-invocable
16. **Add to prompt-activation index** in `.github/skills/prompt-activation/SKILL.md`

## Phase 5: Assess Muscle Need

17. **Ask**: Are there terminal commands that would be run repeatedly for this skill?
    - **Yes** → Create script in `.github/muscles/` (Phase 6)
    - **No** → Done

### Muscle Decision Signals

| Signal | Create Muscle | Example |
|--------|:-:|---------|
| Same commands run repeatedly | **Yes** | Validation scripts |
| File transformation pattern | **Yes** | Sync/transform scripts |
| Requires human judgment | **No** | Code review |
| One-time operation | **No** | Not worth automating |

## Phase 6: Build Muscle (if needed)

18. **Create script**: `.github/muscles/{verb}-{noun}.ps1` or `.js`
19. **Reference from .instructions.md**: "Step N: Run `muscles/{script}`"
20. **Test in sandbox**: Never test in Master Alex workspace

## Phase 7: Finalize

21. **Update catalogs**: SKILLS-CATALOG.md, TRIFECTA-CATALOG.md (if trifecta built)
22. **Run sync-architecture**: Ensure heir gets the new files
23. **Rebuild and install**: Compile, package, install VSIX

## Quick Reference: What You Need

| Scenario | Create |
|----------|--------|
| New domain expertise | SKILL.md only |
| New repeatable process | SKILL.md + .instructions.md |
| New interactive workflow | SKILL.md + .instructions.md + .prompt.md |
| New automated check | SKILL.md + .instructions.md + muscle script |
