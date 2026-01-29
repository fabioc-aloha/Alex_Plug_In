# 🧠 Alex M365 Copilot Agent

![Alex Cognitive Architecture](https://raw.githubusercontent.com/fabioc-aloha/Alex_Plug_In/main/platforms/vscode-extension/assets/banner.png)

[![Version](https://img.shields.io/badge/version-4.0.0-0078d4)](https://github.com/fabioc-aloha/Alex_Plug_In)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md)
[![M365](https://img.shields.io/badge/M365-Copilot-7c3aed)](https://copilot.microsoft.com/)

> Alex Cognitive Architecture extended to Microsoft 365 Copilot

---

## 🎯 Overview

This project brings Alex's cognitive capabilities to Microsoft 365 Copilot using **pure M365 native capabilities** - no external APIs or Azure services required!

Alex M365 is a **knowledge-only declarative agent** that uses M365 Copilot foundation models with custom instructions and knowledge sources.

### What Alex Can Do

| Capability | Description |
|------------|-------------|
| 📖 **OneDrive** | READ your Alex-Memory files (profile, notes, knowledge) |
| 📧 **Email** | Draft reminder emails to yourself |
| 🔍 **WebSearch** | Research topics online |
| 💬 **Teams** | Access Teams context |
| 👥 **People** | Know about colleagues |

### Memory Workflow

- **For reminders**: Add to notes.md or draft an email to yourself
- **For observations**: Alex generates content → you paste into notes.md
- **For knowledge**: Alex generates DK-*.md files → you create in OneDrive
- **For profile updates**: Alex generates content → you paste into profile.md

## Project Structure

```
m365-copilot/
├── appPackage/
│   ├── manifest.json              # M365 App manifest (v1.19)
│   ├── declarativeAgent.json      # Alex agent config (v1.3) with full instructions
│   ├── color.png                  # 192x192 color icon
│   └── outline.png                # 32x32 outline icon
├── env/
│   ├── .env.dev
│   └── .env.local
├── teamsapp.yml                   # M365 Agents Toolkit config
├── teamsapp.local.yml             # Local dev config
└── package.json
```

## Prerequisites

- [Microsoft 365 Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension) VS Code extension
- M365 Developer tenant with Copilot enabled
- **No Azure subscription required!** ✨

## Getting Started

### 1. Package the Agent

```bash
npm install
npx teamsapp package --env local
```

### 2. Validate the Package

```bash
npx teamsapp validate --package-file appPackage/build/appPackage.local.zip
```

### 3. Deploy to M365

**Option A: Teams Developer Portal**
1. Go to https://dev.teams.microsoft.com/apps
2. Import app → Select `appPackage/build/alex-m365-agent-v4.0.0.zip`
3. Preview in Teams

**Option B: Direct Sideload**
1. Open Teams → Apps → Manage your apps
2. Upload a custom app → Select the zip

### 4. Set Up OneDrive Memory

1. Create folder in OneDrive root: **Alex-Memory**
2. Create files: `profile.md`, `notes.md`
3. **Share folder WITH Copilot**: Right-click → Share → Copy link → Paste in chat
4. Click "Allow" when prompted

## M365 Capabilities Used

| Capability | What Alex Does With It |
|------------|------------------------|
| `OneDriveAndSharePoint` | Read your memory files |
| `Email` | Draft reminder emails |
| `WebSearch` | Research topics |
| `TeamsMessages` | Access Teams context |
| `People` | Know about colleagues |

## Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `TEAMS_APP_ID` | Auto-generated Teams app ID |

> **Note**: No Azure or API configuration needed! Pure M365 native capabilities.

## Development Status

- [x] Project scaffolding
- [x] Declarative agent manifest (v1.3)
- [x] Alex instructions embedded in agent
- [x] Icon assets (color.png, outline.png)
- [x] Package validation (52/52 checks pass)
- [x] Deployed to M365 Copilot
- [x] OneDrive memory working
- [x] Pure M365 - no external dependencies!

## User Commands

| User Says | Alex Does |
| --------- | --------- |
| "Remind me to..." | Generates for notes.md + offers email draft |
| "Remember that..." | Generates for notes.md |
| "Update my profile" | Generates for profile.md |
| "Save this knowledge" | Generates DK-*.md file |
| "Email me a reminder" | Drafts email to you 📧 |
| "Meditate" | Consolidates learnings |
| "Dream" | Reviews memory for gaps |

---

## 📚 Documentation

| Document | Description |
| -------- | ----------- |
| [Deployment Checklist](./DEPLOYMENT-CHECKLIST.md) | Step-by-step deployment guide |
| [Publication Guide](./PUBLICATION-GUIDE.md) | Internal M365 app store submission |
| [Declarative Agent Reference](./docs/DECLARATIVE-AGENT-REFERENCE.md) | Agent manifest documentation |
| [Manifest Reference](./docs/MANIFEST-REFERENCE.md) | M365 app manifest documentation |

## 🔗 Related

| Platform | Description |
| -------- | ----------- |
| [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture) | Alex for VS Code + GitHub Copilot |
| [Project Repository](https://github.com/fabioc-aloha/Alex_Plug_In) | Full source code and documentation |

---

## 📝 License

Apache 2.0 - See [LICENSE.md](https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md) for details.

---

**Alex M365** - v4.0.0 QUADRUNIUM - Pure M365 Edition

© 2026 CorreaX • AI That Learns How to Learn
