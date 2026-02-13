# Cursor Heir — Alex Cognitive Architecture

> Potential heir deployment for Cursor AI IDE

|                 |                                      |
| --------------- | ------------------------------------ |
| **Status**      | 📋 Research Complete                  |
| **Target**      | Cursor IDE                           |
| **Location**    | `platforms/cursor/` (planned)        |
| **Feasibility** | ✅ High — similar `.github/` patterns |

---

## Executive Summary

Cursor is an AI-native IDE built on VS Code that has emerged as a serious VS Code competitor. It supports custom rules, AGENTS.md files, and Agent Skills — making it a viable target for Alex deployment.

### Platform Capabilities

| Capability       | Cursor Implementation       | Alex Mapping               |
| ---------------- | --------------------------- | -------------------------- |
| **Custom Rules** | `.cursor/rules/*.md`        | `.instructions.md` → rules |
| **Agents**       | `AGENTS.md` in project root | `.agent.md` files          |
| **Agent Skills** | Import from repos           | `.github/skills/`          |
| **Team Rules**   | Dashboard (enterprise)      | N/A                        |
| **Remote Rules** | GitHub sync                 | Similar to VS Code         |

---

## Architecture Mapping

### Source → Target Transformation

| Master Alex (VS Code)       | Cursor Heir                                | Transformation               |
| --------------------------- | ------------------------------------------ | ---------------------------- |
| `copilot-instructions.md`   | `.cursor/rules/alex-core.md` (alwaysApply) | Direct port                  |
| `.github/instructions/*.md` | `.cursor/rules/*.md`                       | Add `globs` frontmatter      |
| `.github/agents/*.agent.md` | `AGENTS.md`                                | Consolidate into single file |
| `.github/skills/`           | Remote import or local copy                | Verify format compatibility  |
| `synapses.json`             | ❌ No equivalent                            | Manual curation              |

### Cursor Rules System

#### Rule Types

| Type                    | Frontmatter                | Use Case                |
| ----------------------- | -------------------------- | ----------------------- |
| **Always Apply**        | `alwaysApply: true`        | Core Alex personality   |
| **Apply Intelligently** | (no frontmatter)           | Model decides relevance |
| **Apply to Files**      | `globs: ["*.ts"]`          | File-specific rules     |
| **Apply Manually**      | Listed in `.cursor/rules/` | On-demand               |

#### Frontmatter Schema

```yaml
---
description: Brief description of the rule (max 120 chars)
globs:
  - "**/*.ts"
  - "**/*.tsx"
alwaysApply: false  # or omit for intelligent application
---
```

---

## Proposed Directory Structure

```
platforms/cursor/
├── README.md
├── SYNC-STATUS.md
│
└── .cursor/
    └── rules/
        ├── alex-core.md              # alwaysApply: true
        ├── code-review.md            # globs: ["**/*.ts", "**/*.js"]
        ├── release-management.md     # Model decides
        ├── dependency-management.md  # globs: ["**/package.json"]
        └── brand-assets.md           # globs: ["**/assets/**"]
```

### AGENTS.md Structure

```markdown
# Alex Cognitive Architecture Agents

## Alex
Main cognitive agent for learning partnership.
- **Capabilities**: Code review, learning, meditation protocols
- **Model**: Claude Opus 4.5 (when available)

## Alex-Researcher
Deep domain exploration specialist.
- **Focus**: Understanding before implementation
- **Tools**: Read, search, codebase analysis

## Alex-Builder
Implementation specialist.
- **Focus**: Constructive development
- **Tools**: Read, write, edit, terminal

## Alex-Validator
Adversarial quality assurance.
- **Focus**: Breaking things to make them stronger
- **Tools**: Read, search, problems, test
```

---

## What Transfers

### ✅ Transfers Directly

- Core personality and identity
- Procedural instructions (with frontmatter changes)
- Agent definitions (consolidated format)
- Agent Skills (verify compatibility)
- Model awareness concepts

### ⚠️ Requires Adaptation

| Feature      | VS Code                | Cursor             | Adaptation          |
| ------------ | ---------------------- | ------------------ | ------------------- |
| Instructions | `applyTo` glob         | `globs` array      | Rename frontmatter  |
| Agents       | Individual files       | Single `AGENTS.md` | Consolidate         |
| Skills       | Auto-load via settings | Import or copy     | Verify format       |
| Commands     | Extension API          | Chat only          | Remove command refs |

### ❌ Cannot Transfer

- Synapse network (Alex-specific)
- Extension commands (VS Code API)
- Language Model Tools (VS Code API)
- Chat participant `@alex` (VS Code API)

---

## Migration Strategy

### Phase 1: Core Rules

1. Port `copilot-instructions.md` → `.cursor/rules/alex-core.md`
2. Add `alwaysApply: true` frontmatter
3. Test basic personality in Cursor

### Phase 2: Procedural Rules

1. Convert `.instructions.md` files to `.cursor/rules/`
2. Map `applyTo` patterns to `globs` arrays
3. Test file-specific activation

### Phase 3: Agents

1. Create consolidated `AGENTS.md`
2. Define agent personas with capabilities
3. Test agent switching in Cursor

### Phase 4: Skills (Research Required)

1. Verify Cursor Agent Skills format compatibility
2. Test import from GitHub
3. Adapt frontmatter if needed

---

## Feature Comparison

| Feature               | VS Code             | Cursor           | Winner                |
| --------------------- | ------------------- | ---------------- | --------------------- |
| **Custom Rules**      | `.instructions.md`  | `.cursor/rules/` | Tie                   |
| **Agents**            | `.agent.md` files   | `AGENTS.md`      | VS Code (flexibility) |
| **Skills**            | 100+ skills, native | Import supported | VS Code (quantity)    |
| **API Access**        | Full VS Code API    | Limited          | VS Code               |
| **Team Rules**        | N/A                 | Dashboard        | Cursor                |
| **Background Agents** | Coming              | Limited          | VS Code               |

---

## Strengths for Alex

| Strength                  | Benefit                   |
| ------------------------- | ------------------------- |
| **VS Code foundation**    | Most patterns transfer    |
| **AGENTS.md support**     | Agent ecosystem works     |
| **Agent Skills import**   | Skills could transfer     |
| **Enterprise team rules** | Organizational deployment |
| **Growing market share**  | User base expansion       |

---

## Limitations

| Limitation              | Impact                        |
| ----------------------- | ----------------------------- |
| **No VS Code API**      | Lose 11 LM tools, 28 commands |
| **No synapse network**  | Lose neural connectivity      |
| **Consolidated agents** | Less flexible than VS Code    |
| **Limited automation**  | No lifecycle hooks            |

---

## Feasibility Assessment

| Dimension     | Score | Notes                                  |
| ------------- | ----- | -------------------------------------- |
| **Technical** | 8/10  | Strong pattern compatibility           |
| **Effort**    | 6/10  | Moderate — format conversions needed   |
| **Value**     | 7/10  | Good market, less features             |
| **Risk**      | Low   | Cursor is stable, patterns are similar |

### Recommendation

**VIABLE HEIR** — Create when there's user demand. The VS Code foundation makes this a relatively straightforward port, but the VS Code heir will always be more capable due to API access.

---

## Research Sources

- [Cursor Rules Documentation](https://cursor.com/docs/context/rules)
- [Agent Skills Import](https://cursor.com/docs/context/agent-skills)
- [AGENTS.md Support](https://cursor.com/docs/agents)

---

*Cursor Heir — Bringing Alex to the AI-native IDE space*
