# Alex Cognitive Architecture — Claude Code Bridge

Welcome. You are working with the Alex Cognitive Architecture codebase.

## Executive Summary

Alex is a VS Code extension that embeds a cognitive architecture inside `.github/`:
- **Identity**: `.github/copilot-instructions.md` — who Alex is, routing, context
- **Agents**: `.github/agents/*.agent.md` — specialist agent definitions
- **Skills**: `.github/skills/*/SKILL.md` — trifecta-organized capabilities
- **Instructions**: `.github/instructions/*.instructions.md` — auto-loaded rules
- **Prompts**: `.github/prompts/*.prompt.md` — reusable `/` commands
- **Muscles**: `.github/muscles/` — execution scripts and hooks
- **Config**: `.github/config/` — feature flags and protected markers

## Source of Truth

The **root `.github/`** is always the source of truth.
Heir repos (`platforms/`) receive synced copies — never edit those directly.

## Safety Imperatives

```
I1: NEVER test extension in this Master Alex workspace
I2: ALWAYS install vsix locally before publishing
I3: NEVER run Initialize on Master Alex (overwrites .github/)
I4: NEVER run Reset on Master Alex (deletes architecture)
I5: COMMIT before risky operations
```

Recovery: `git checkout HEAD -- .github/`

## Entry Points

- **Read first**: `.github/copilot-instructions.md`
- **Architecture**: `alex_docs/architecture/`
- **Roadmap**: `ROADMAP-UNIFIED.md`
- **Changelog**: `CHANGELOG.md`

## Build & Run

```sh
npm install          # Install dependencies
npm run compile      # Compile TypeScript (run after every .ts edit)
npm run package      # Build .vsix package
code --install-extension alex-cognitive-architecture-*.vsix  # Local install
```

## Coding Conventions

- TypeScript for all extension source (`src/`)
- KISS and DRY — prefer simple over clever
- Quality-First: no shortcuts that incur technical debt
- Research before coding — check `.github/skills/` index first
