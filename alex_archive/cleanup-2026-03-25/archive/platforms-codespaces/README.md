# ☁️ Alex Codespaces Platform

> Zero-translation cloud heir — VS Code in the browser with full Alex capabilities

[![Codespaces](https://img.shields.io/badge/GitHub-Codespaces-24292f)](https://docs.github.com/en/codespaces)
[![Alex](https://img.shields.io/badge/Alex-v5.7.1-0078d4)](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md)

---

## Overview

GitHub Codespaces runs a full VS Code instance in the cloud. Since Alex ships as a VS Code Marketplace extension, **every feature works identically** — no translation, no export, no adaptation. This is the only heir with a perfect 10/10 compatibility score.

| What You Get                    | How                                           |
| ------------------------------- | --------------------------------------------- |
| Full Alex extension             | Auto-installed via `devcontainer.json`        |
| All 100+ skills                 | `.github/skills/` loaded from repo            |
| Global Knowledge                | GitHub repo auto-cloned on container creation |
| Persona detection (P5-P7)       | Works from repo structure + user profile      |
| Dream, meditate, self-actualize | Full command palette + chat participant       |
| `@m365agents` chat participant  | M365 Agents Toolkit auto-installed            |

## Quick Start

### Option A: Deploy Script (Recommended)

```powershell
# From the Alex_Plug_In root
cd C:\path\to\your-project
& "C:\Development\Alex_Plug_In\platforms\codespaces\deploy.ps1"
```

The script:
1. Creates `.devcontainer/devcontainer.json` with Alex + Copilot extensions
2. Configures VS Code settings for agent mode, skills, and AGENTS.md
3. Sets up Global Knowledge auto-clone via `postCreateCommand`
4. Detects existing `.github/` architecture

### Option B: Manual Setup

Copy `devcontainer.json` from this directory to your project's `.devcontainer/` folder, then edit the GitHub username in `postCreateCommand`.

## Files

| File                      | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| `devcontainer.json`       | Template devcontainer config with Alex + GK setup |
| `deploy.ps1`              | Deploys devcontainer to any target repository     |
| `DEPLOYMENT-CHECKLIST.md` | Step-by-step validation checklist                 |
| `USER-MANUAL.md`          | End-user guide for using Alex in Codespaces       |

## Deploy Script Options

```powershell
.\deploy.ps1                                    # Deploy to current directory
.\deploy.ps1 -TargetRepo "C:\Projects\my-app"  # Deploy to specific repo
.\deploy.ps1 -GitHubUser "fabioc-aloha"        # Set GK repo owner
.\deploy.ps1 -SkipGK                            # Skip Global Knowledge setup
.\deploy.ps1 -Force                              # Overwrite existing devcontainer
```

## Architecture

```
your-project/
├── .devcontainer/
│   └── devcontainer.json    ← Created by deploy.ps1
├── .github/
│   ├── instructions/        ← Procedural memory (auto-loaded)
│   ├── skills/              ← Portable skill library
│   ├── agents/              ← Cognitive agents
│   ├── prompts/             ← Episodic workflows
│   └── copilot-instructions.md
└── ...your code

~/.alex/
└── global-knowledge/        ← Auto-cloned from GitHub by postCreateCommand
```

## Key Difference from Other Heirs

| Platform       | Translation Needed | Deploy Complexity                    |
| -------------- | ------------------ | ------------------------------------ |
| **Codespaces** | None               | 1 file                               |
| VS Code        | None               | Extension install                    |
| M365 Copilot   | Full export        | App package + Teams Developer Portal |
| Claude Code    | Format translation | CLAUDE.md + rules                    |

## Documentation

- [User Manual](USER-MANUAL.md) — complete guide to using Alex in Codespaces
- [Detailed Heir Architecture](../../alex_docs/platforms/CODESPACES-HEIR.md) — full feature matrix, persistence strategy, team deployment
- [Platform Comparison](../../alex_docs/platforms/DEVELOPMENT-PLATFORMS-COMPARISON.md) — all platforms side-by-side
- [VS Code Heir](../../alex_docs/platforms/VSCODE-HEIR.md) — parent heir documentation

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/CONTRIBUTING.md) for guidelines.

## 💬 Support

- [GitHub Discussions](https://github.com/fabioc-aloha/Alex_Plug_In/discussions) - Ask questions and share ideas
- [Issue Tracker](https://github.com/fabioc-aloha/Alex_Plug_In/issues) - Report bugs and request features

## 📝 License

Apache 2.0 - See [LICENSE.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md) for details.

---

**Alex Codespaces** - v5.7.1 ☁️ Zero-Translation Cloud Platform

© 2026 CorreaX • AI That Learns How to Learn
