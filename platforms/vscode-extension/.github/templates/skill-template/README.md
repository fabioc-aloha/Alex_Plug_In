# Skill Scaffold Template

Use this template to create new skills with proper structure and frontmatter.

## Usage

```bash
# Copy template to new skill directory
cp -r .github/templates/skill-template .github/skills/my-new-skill

# Edit SKILL.md and synapses.json
# Replace placeholders with actual values
```

## Required Frontmatter Fields

- **name**: Display name of the skill (used by VS Code)
- **description**: Brief summary (used for skill discovery)

## Inheritance Options

Set in `synapses.json`:

- `inheritable`: Ships to all heirs (default)
- `universal`: Core infrastructure (ships everywhere)
- `master-only`: Master Alex only
- `heir:vscode`: VS Code extension only
- `heir:m365`: M365 Copilot only

## Validation

Run brain-qa to validate:

```bash
node .github/muscles/brain-qa.cjs --mode schema
```
