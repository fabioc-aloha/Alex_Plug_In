# Heir Project Setup

Configure Alex for your specific project ("heir project"). Alex inherits cognitive architecture to your workspace and learns project-specific patterns.

## What is an Heir Project?

An "heir project" inherits Alex's cognitive architecture:

- **Skills** — Domain knowledge adapted to your stack
- **Instructions** — Behavior patterns for your workflow
- **Prompts** — Reusable templates for common tasks
- **Synapses** — Learned connections relevant to your domain

## Quick Setup

### Option 1: Auto-Initialize (Recommended)

In Copilot Chat:

```
@alex initialize this workspace
```

Alex will:
1. Detect your project type (Node, Python, .NET, etc.)
2. Create `.github/copilot-instructions.md`
3. Deploy relevant skills and instructions
4. Configure persona for your workflow

### Option 2: Manual Setup

Create the following structure in your project root:

```
your-project/
├── .github/
│   ├── copilot-instructions.md    # Project-specific guidance
│   ├── instructions/              # Behavior rules
│   ├── skills/                    # Domain knowledge
│   └── prompts/                   # Reusable templates
```

## The copilot-instructions.md File

This is the most important file for heir projects. It tells Alex about your project.

### Template

```markdown
# [Project Name]

## Identity

<!-- Brief description of what this project does -->
This project is a [type] that [purpose].

## Tech Stack

- **Language**: TypeScript 5.x
- **Framework**: React 19
- **Backend**: FastAPI
- **Database**: PostgreSQL

## Conventions

- Use functional components with hooks
- Prefer composition over inheritance
- Test files use `.test.ts` extension
- Follow Google TypeScript Style Guide

## Key Files

- `src/index.ts` — Entry point
- `src/api/` — API client code
- `src/components/` — React components

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm test` | Run tests |
| `npm run build` | Production build |
```

### Active Context

Add an Active Context section for session-aware behavior:

```markdown
## Active Context

Persona: Developer
Objective: Implement user authentication
Tone: Technical, concise
Focus Trifectas: api-design, security-review, testing-strategies
```

## Inheriting Skills

### Auto-Inheritance

When you initialize, Alex deploys skills based on your detected project type:

| Project Type | Skills Inherited |
|--------------|------------------|
| Node/TypeScript | `vscode-extension-patterns`, `testing-strategies`, `api-design` |
| Python | `debugging-patterns`, `database-design`, `api-design` |
| React | `ui-ux-design`, `testing-strategies`, `accessibility` |
| Documentation | `markdown-mermaid`, `lint-clean-markdown`, `data-storytelling` |

### Manual Skill Selection

To add specific skills:

```
@alex Add the security-review skill to this project
```

Or create `.github/skills/security-review/SKILL.md` manually.

### Checking Inherited Skills

```
@alex What skills are active in this heir project?
```

## Creating Project-Specific Instructions

Instructions tell Alex how to behave in specific contexts.

### Create an Instruction

In `.github/instructions/`:

```markdown
---
description: "Project-specific coding standards"
applyTo: "**/*.ts"
---

# TypeScript Standards

## Rules

1. Always use strict mode
2. Prefer interfaces over types for object shapes
3. Export constants from dedicated files
4. Use barrel exports (index.ts)

## Examples

✅ Good:
\`\`\`typescript
export interface UserProfile {
  id: string;
  name: string;
}
\`\`\`

❌ Bad:
\`\`\`typescript
export type UserProfile = {
  id: string;
  name: string;
}
\`\`\`
```

### Instruction applyTo Patterns

| Pattern | Matches |
|---------|---------|
| `**/*.ts` | All TypeScript files |
| `src/**/*.tsx` | React components in src/ |
| `**/*test*` | All test files |
| `**/api/**` | API-related files |

## Creating Project Prompts

Prompts are reusable templates for common tasks.

### Create a Prompt

In `.github/prompts/`:

```markdown
---
mode: "agent"
description: "Create a new React component"
---

# New Component

Create a React functional component with:

1. TypeScript interface for props
2. Styled using our design system
3. Unit test file
4. Storybook story

## Component: {{COMPONENT_NAME}}

Location: `src/components/{{COMPONENT_NAME}}/`
```

### Using Prompts

```
@alex Run the new-component prompt for UserAvatar
```

## Synchronizing with Master Alex

Your heir project can receive updates from Master Alex:

### Pull Updates

```
@alex sync architecture
```

This will:
1. Check for new skills in Master
2. Update inherited instructions
3. Merge new prompts
4. Report what changed

### Push Insights

If your heir project discovers something valuable:

```
@alex propose skill from this session
```

Alex will prepare the insight for promotion to Master.

## Heir Bootstrap Wizard

For comprehensive setup, run the bootstrap wizard:

```
@alex bootstrap this heir
```

The wizard guides you through 10 phases:

1. **Project Analysis** — Detect stack and structure
2. **Persona Selection** — Developer/Researcher/Writer
3. **Skill Deployment** — Choose relevant skills
4. **Instruction Customization** — Project-specific rules
5. **Prompt Templates** — Common task shortcuts
6. **Memory Configuration** — Synapse scope settings
7. **Agent Assignment** — Default agent for project
8. **Quality Gates** — Pre-commit hooks, linting
9. **Integration** — CI/CD, testing frameworks
10. **Validation** — Verify setup works

## Troubleshooting

### Skills Not Activating

Check that:
1. Skill files have correct frontmatter
2. `applyTo` patterns match your files
3. Skill tier is appropriate (standard vs advanced)

```
@alex debug skill activation for security-review
```

### Instructions Ignored

Verify:
1. File is in `.github/instructions/`
2. Frontmatter is valid YAML
3. `applyTo` pattern matches current file

### Sync Conflicts

If heir differs from Master:

```
@alex show sync drift
```

Then:

```
@alex resolve sync conflicts
```

---

*Every project can have Alex as a partner. Heir projects just get the full experience.*
