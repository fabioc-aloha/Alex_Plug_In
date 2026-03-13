---
description: Create a new skill from real-world experience
agent: Alex
---

# /skill-building - Create a New Skill


Build a high-quality skill from validated experience — not theory.

## Readiness Check

Before creating a skill, confirm:
1. You've shipped or completed real work in this domain
2. The pattern has been used 3+ times or a significant gotcha was discovered
3. No existing skill covers this domain (check `.github/skills/`)

## Workflow

1. **Define scope**: What problem does this skill solve? (1 sentence)
2. **List gotchas**: What are the 3-5 key things that trip people up?
3. **Determine inheritance**: Should this skill sync to heirs?
   - `inheritable` (default) — syncs to all heirs
   - `master-only` — stays in Master Alex (release tooling, master audits)
   - `heir:m365` — targets M365 heir only (Teams/M365-specific)
   - `heir:vscode` — heir maintains its own version
4. **Create SKILL.md**: Domain knowledge with tables, thresholds, examples
5. **Add synapses.json**: 2-5 connections to related skills
6. **Assess trifecta need**: Does it need an instruction and/or prompt?
   - If non-inheritable, add matching `inheritance:` frontmatter to siblings
7. **Register**: Add to memory-activation index

## Start

What domain knowledge would you like to capture? Describe the experience that prompted this.
