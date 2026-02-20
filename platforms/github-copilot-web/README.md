# 🌐 Alex — GitHub Copilot Web Heir

> Alex's identity and skills, available anywhere GitHub Copilot reads the repo.

---

## What This Is

A `.github/`-only heir. No TypeScript. No extension. No compute cost.

GitHub Copilot automatically reads `.github/copilot-instructions.md` in repository chat on `github.com/copilot`, `github.dev`, and inside pull requests. This heir tunes that file — plus instructions and prompts — so Alex behaves consistently in the web context.

**What works in this context**:

| Capability | Mechanism |
| ---------- | --------- |
| Alex identity + routing | `copilot-instructions.md` loaded automatically |
| Domain instructions | `.github/instructions/` loaded by applyTo patterns |
| Prompt templates | `.github/prompts/` available as reusable patterns |
| Skills (knowledge) | `.github/skills/` readable as context files |

**What doesn't work** (no extension installed):
- `@alex` chat participant
- Slash commands (`/meditate`, `/dream`, `/plan`, etc.)
- VS Code tools (file access, terminal, lm tools)
- Agent hooks, Copilot Memory API

---

## Differences from VS Code Heir

| Aspect | VS Code Heir | GitHub Copilot Web |
| ------ | ------------ | ------------------ |
| Delivery | `.vsix` extension on Marketplace | `.github/` files in repo |
| Commands | 24 slash commands + 8 LM tools | None (pure chat) |
| Memory | SecretStorage + file memory | File memory only |
| Personas | Full detection (code, profile, workspace) | Repo structure only |
| Upgrade path | Marketplace publish | Commit to repo |

---

## Deployment

This heir is synced from Master Alex during release. To deploy:

1. Ensure `sync-architecture.js` includes `github-copilot-web` in the heirs list
2. Run `npm run sync-architecture` from the VS Code extension root
3. Commit the `.github/` output in any target repo

The deployed repo's `github.com/copilot` chat will load Alex's identity automatically.

---

## Status

| Item | Status |
| ---- | ------ |
| copilot-instructions.md (web-tuned) | ✅ |
| Instructions subset | ✅ |
| Prompts subset | ✅ |
| Skills subset | ✅ |
| sync-architecture.js integration | 📋 Planned |

---

*Part of the Alex Cognitive Architecture — Master: `c:\Development\Alex_Plug_In`*
