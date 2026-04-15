---
description: "Post-Initialize wizard that tailors Alex's cognitive architecture to a specific heir project"
application: "When bootstrapping new heir projects with Alex's cognitive architecture"
applyTo: "**/*heir*,**/*bootstrap*,**/*initialize*"
---

# Heir Bootstrap Protocol

## Prerequisites

- Alex extension installed
- Initialize command completed
- Project has `.github/` folder

## Bootstrap Phases

1. **Project Type**: Identify (VS Code ext, web app, API, etc.)
2. **Stack Detection**: Languages, frameworks, tools
3. **Persona Config**: Developer/Researcher/Writer
4. **Skill Selection**: Relevant skills for project type
5. **Instruction Pruning**: Remove irrelevant instructions
6. **Memory Scope**: Configure session vs persistent
7. **Agent Setup**: Available specialized agents
8. **Quality Gates**: Pre-commit, pre-publish rules
9. **North Star**: Define project vision
10. **Validation**: Run brain-qa to confirm health

## Key Files

- `.github/config/project-persona.json`
- `.github/copilot-instructions.md`
- `.github/skills/` (pruned set)

## Anti-Patterns

- Skipping bootstrap (inherits everything)
- Not tailoring to project type
- Keeping irrelevant skills (noise)
