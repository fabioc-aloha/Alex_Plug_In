---
name: project-scaffolding
description: First impressions matter. Set projects up for success.
tier: standard
applyTo: '**/*scaffold*,**/*init*,**/*new*,**/*create*,**/README*'
---

# Project Scaffolding Skill

> First impressions matter. Set projects up for success.

## Essential Files

| File | Purpose |
| ---- | ------- |
| `README.md` | Hero banner + overview + quick start |
| `CONTRIBUTING.md` | How to contribute |
| `LICENSE.md` | Legal terms |
| `CHANGELOG.md` | Version history |
| `.gitignore` | Ignored files |
| `.editorconfig` | Consistent formatting |

## README Structure

```markdown
<!-- Hero SVG banner -->
# Project Name

> One-line description

## Features
- Feature 1
- Feature 2

## Quick Start
[3 commands max]

## Documentation
[Links]

## License
[Badge + link]
```

## Hero Banner Pattern

- Width: 800-1200px
- Height: 200-400px
- Include: Logo, tagline, 3-5 key features
- Format: SVG (scalable), PNG fallback
- Dark/light mode variants

## Documentation Folder

```text
docs/
├── README.md           # Index
├── QUICK-START.md      # 5-min guide
├── ARCHITECTURE.md     # System design
├── API.md              # Reference
└── CONTRIBUTING.md     # Dev guide
```

## Planning Files

| File | When |
| ---- | ---- |
| `ROADMAP.md` | Multi-phase projects |
| `TODO.md` | Simple task tracking |
| `DECISIONS.md` | Architecture decisions |
| `RISKS.md` | Known risks |

## Config Files by Stack

| Stack | Essential Configs |
| ----- | ----------------- |
| Node.js | `package.json`, `tsconfig.json`, `.nvmrc` |
| Python | `pyproject.toml`, `requirements.txt` |
| VS Code | `.vscode/settings.json`, `launch.json` |
| GitHub | `.github/workflows/`, `CODEOWNERS` |

## Quality Gates

- [ ] README has hero banner
- [ ] Quick start works in < 5 min
- [ ] License specified
- [ ] Contributing guide exists
- [ ] .gitignore appropriate for stack

---

## Anti-Patterns

| ❌ Don't | ✅ Do | Why |
|----------|-------|-----|
| Empty README | Minimum: name, description, quick start | First impression determines adoption |
| 10+ steps in Quick Start | 3 commands max | Users abandon complex onboarding |
| No license file | Always include LICENSE.md | Legal ambiguity blocks enterprise use |
| Hardcoded paths in docs | Use relative paths, env vars | Breaks for other contributors |
| Stale screenshots | Update visuals with releases | Outdated UI erodes trust |
| Nested folder labyrinths | Max 3 levels deep in docs/ | Deep nesting loses readers |
| Copy-paste from other projects | Customize for your project | Generic docs signal low quality |

---

## Troubleshooting

### Problem: "Quick Start doesn't work"

**Symptom**: User follows steps but encounters errors

**Causes**:
- Missing prerequisites (Node version, Python, etc.)
- Platform-specific commands (Windows vs Unix)
- Outdated dependencies

**Fix**: Add prerequisites section, test on fresh environment, use cross-platform commands

### Problem: "Can't find documentation"

**Symptom**: Users ask questions already answered in docs

**Causes**:
- Docs not linked from README
- Poor naming (ARCHITECTURE.md vs HOW-IT-WORKS.md)
- No search/index

**Fix**: Add TOC in README, use descriptive filenames, cross-link related docs

### Problem: "Contributing guide is intimidating"

**Symptom**: Few contributions despite interest

**Causes**:
- Too many requirements upfront
- No "good first issue" labels
- Complex local setup

**Fix**: Start with simple fixes, provide dev container, label beginner issues