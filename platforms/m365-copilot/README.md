# 🧠 Alex M365 Copilot Agent

![Alex Cognitive Architecture](https://raw.githubusercontent.com/fabioc-aloha/Alex_Plug_In/main/platforms/vscode-extension/assets/banner.png)

[![Version](https://img.shields.io/badge/version-3.5.1-0078d4)](https://github.com/fabioc-aloha/Alex_Plug_In)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md)
[![M365](https://img.shields.io/badge/M365-Copilot-7c3aed)](https://copilot.microsoft.com/)
[![Schema](https://img.shields.io/badge/schema-v1.2-green)](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/)

> Alex Cognitive Architecture extended to Microsoft 365 Copilot 🧠

---

## 🎯 Overview

This project brings Alex's cognitive capabilities to Microsoft 365 Copilot using **pure M365 native capabilities** - no external APIs or Azure services required!

Alex M365 is a **declarative agent** that uses M365 Copilot foundation models with custom instructions and OneDrive-based memory.

### What Alex Can Do (v1.2 Schema)

| Capability | Description |
|------------|-------------|
| 📖 **OneDrive** | READ your Alex-Memory files (profile, notes, knowledge) |
| 🔍 **WebSearch** | Research topics online |
| 🎨 **GraphicArt** | Generate images and diagrams |
| 🐍 **CodeInterpreter** | Run Python code for calculations |

> **Note**: Email, Teams, and People capabilities require schema v1.5+ (not yet stable)

### Memory Workflow

- **For reminders**: Alex generates content → you paste into notes.md
- **For observations**: Alex generates content → you paste into notes.md
- **For knowledge**: Alex generates DK-*.md files → you create in OneDrive
- **For profile updates**: Alex generates content → you paste into profile.md

Your data stays under your control!

## Project Structure

```text
m365-copilot/
├── appPackage/
│   ├── manifest.json              # M365 App manifest (v1.19)
│   ├── declarativeAgent.json      # Alex agent config (v1.6 schema)
│   ├── color.png                  # 192x192 color icon (geometric logo)
│   └── outline.png                # 32x32 outline icon (white on transparent)
├── env/
│   ├── .env.dev
│   └── .env.local
├── teamsapp.yml                   # M365 Agents Toolkit config
└── package.json
```

## Prerequisites

- [Microsoft 365 Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension) VS Code extension
- M365 tenant with Copilot license
- **No Azure subscription required!** ✨

## Getting Started

### 1. Package the Agent

```bash
npm install
npx teamsapp package --env dev
```

### 2. Validate the Package

```bash
npx teamsapp validate --package-file appPackage/build/appPackage.dev.zip
```

### 3. Deploy to M365

```bash
npx teamsapp provision --env dev
```

Or sideload manually:

1. Open Teams → Apps → Manage your apps
2. Upload a custom app → Select `appPackage.dev.zip`

### 4. Set Up OneDrive Memory

1. Create folder in OneDrive root: **Alex-Memory**
2. Create files: `profile.md`, `notes.md`
3. **Share folder WITH Copilot**: Right-click → Share → Copy link → Paste in chat
4. Click "Allow" when prompted

## M365 Capabilities (v1.2 Schema)

| Capability | What Alex Does With It |
|------------|------------------------|
| `OneDriveAndSharePoint` | Read your memory files |
| `WebSearch` | Research topics online |
| `GraphicArt` | Generate images |
| `CodeInterpreter` | Run Python code |

## Conversation Starters

- 🧠 **Meet Alex** - "Hey Alex! Tell me about yourself"
- 📝 **Set up memory** - "Help me set up my OneDrive memory"
- 🧠 **Meditate** - "Let's meditate - consolidate what I learned"
- 💭 **Dream** - "Dream - review my memory and suggest updates"
- 🎯 **Self-actualize** - "Self-actualize - how am I doing on my goals?"

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Deployment Checklist](./DEPLOYMENT-CHECKLIST.md) | Step-by-step deployment guide |
| [Schema Compatibility](./docs/SCHEMA-COMPATIBILITY.md) | v1.2 vs v1.5 vs v1.6 capabilities |
| [Manifest Reference](./docs/MANIFEST-REFERENCE.md) | M365 app manifest documentation |

## 🔗 Related

| Platform | Description |
|----------|-------------|
| [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture) | Alex for VS Code + GitHub Copilot |
| [Project Repository](https://github.com/fabioc-aloha/Alex_Plug_In) | Full source code and documentation |

---

## 📝 License

Apache 2.0 - See [LICENSE.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md) for details.

---

**Alex M365** - v3.5.1 🔥 Phoenix - Pure M365 Edition

© 2026 CorreaX • AI That Learns How to Learn
