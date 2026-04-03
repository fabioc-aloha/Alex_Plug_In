# Cowork Skill Pack

> Build artifact: Curated and optimized Alex skills packaged for Microsoft 365 Copilot (Cowork) deployment.

## What This Is

This folder contains 20 custom skills translated from Master Alex's cognitive architecture into standalone M365 Copilot (Cowork) skills. Each skill is optimized for the Cowork execution environment: no VS Code references, no terminal commands, no file system access, no cross-skill dependencies.

## Folder Structure

```
platforms/cowork/
  README.md                 # This file
  build-skill-pack.ps1      # Builds the zip for user installation
  Cowork/
    custom-instructions.txt              # Identity text for Settings > Personalization
    Skills/
      executive-storytelling/SKILL.md    # Tier 2: Knowledge Work
      data-analysis/SKILL.md
      data-storytelling/SKILL.md
      research-first-development/SKILL.md
      bootstrap-learning/SKILL.md
      literature-review/SKILL.md
      stakeholder-management/SKILL.md    # Tier 3: Business Execution
      business-analysis/SKILL.md
      change-management/SKILL.md
      status-reporting/SKILL.md
      scope-management/SKILL.md
      ai-writing-avoidance/SKILL.md      # Tier 4: Communication Quality
      slide-design/SKILL.md
      creative-writing/SKILL.md
      coaching-techniques/SKILL.md       # Tier 5: Stretch
      chart-interpretation/SKILL.md
      citation-management/SKILL.md
      prompt-engineering/SKILL.md
      north-star/SKILL.md
      data-visualization/SKILL.md
```

## Building the Zip

```powershell
.\build-skill-pack.ps1
```

This produces `alex-coworker-skills.zip` containing the `Cowork/` folder. The user extracts this at their OneDrive Documents root, resulting in:

```
Documents/
  Cowork/
    Skills/
      executive-storytelling/SKILL.md
      data-analysis/SKILL.md
      ...
```

## Tier Plan

| Tier | Slots | Purpose                        | Skills                                                                                                                      |
| ---- | ----- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| 1    | 0     | Identity (Custom Instructions) | Alex identity, tone, preferences                                                                                            |
| 2    | 1-6   | Knowledge Work Methodology     | executive-storytelling, data-analysis, data-storytelling, research-first-development, bootstrap-learning, literature-review |
| 3    | 7-11  | Business Execution             | stakeholder-management, business-analysis, change-management, status-reporting, scope-management                            |
| 4    | 12-14 | Communication Quality          | ai-writing-avoidance, slide-design, creative-writing                                                                        |
| 5    | 15-20 | Stretch Candidates             | coaching-techniques, chart-interpretation, citation-management, prompt-engineering, north-star, data-visualization          |

## Translation Rules Applied

- All VS Code references stripped (applyTo, trifecta, activation patterns, terminal, git, file system paths)
- Cognitive verbs replaced with M365 action verbs
- Each skill is self-contained: no references to other skills or instructions
- YAML frontmatter limited to `name` and `description` only
- Structure follows Purpose / Steps / Output Format / Guidelines pattern
- Identity lives in Custom Instructions (0 skill slots consumed)

## Related Documentation

- [alex_docs/cowork/README.md](../../alex_docs/cowork/README.md): Full project documentation index
- [alex_docs/cowork/SKILL-DEPLOYMENT-STRATEGY.md](../../alex_docs/cowork/SKILL-DEPLOYMENT-STRATEGY.md): Tier plan rationale
- [alex_docs/cowork/INSTALLATION-GUIDE.md](../../alex_docs/cowork/INSTALLATION-GUIDE.md): End-user installation steps
- [alex_docs/cowork/ARCHITECTURE.md](../../alex_docs/cowork/ARCHITECTURE.md): Translation architecture
