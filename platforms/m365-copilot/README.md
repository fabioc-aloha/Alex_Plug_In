# 🦖 Alex M365 Agent - Project Dino

> Alex Cognitive Architecture extended to Microsoft 365 Copilot

## Overview

This project brings Alex's cognitive capabilities to Microsoft 365 Copilot, enabling:

- **Cross-project knowledge** accessible in Teams, Outlook, Word
- **Personalized interactions** based on your user profile
- **Learning goal tracking** across all your work
- **Proactive memory** with reminders and observations

## Project Structure

```
alex-m365-agent/
├── appPackage/
│   ├── manifest.json              # M365 App manifest (v1.22)
│   ├── declarativeAgent.json      # Alex agent config (v1.6)
│   ├── alex-knowledge-plugin.json # API plugin manifest (v2.3)
│   ├── openapi.yaml               # OpenAPI spec for plugin
│   ├── instructions/
│   │   └── alex-system-prompt.md  # Alex personality & protocols
│   ├── color.png                  # 192x192 color icon (TODO)
│   └── outline.png                # 32x32 outline icon (TODO)
├── api/                           # Azure Functions (TODO)
│   ├── searchKnowledge/
│   ├── getInsights/
│   ├── getProfile/
│   ├── getNotes/
│   └── getLearningGoals/
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
- Azure subscription (for API hosting)
- Alex VS Code extension installed and configured

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Provision Local Environment

```bash
npm run provision:local
```

### 3. Start Local API (when implemented)

```bash
npm run start:api
```

### 4. Test in Teams

Use the M365 Agents Toolkit to launch the app in Teams Developer Preview.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/searchKnowledge` | Search global knowledge patterns |
| `/getInsights` | Get recent insights from meditations |
| `/getProfile` | Retrieve user profile and preferences |
| `/getNotes` | Access reminders and observations |
| `/getLearningGoals` | Get learning goals and progress |

## Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `TEAMS_APP_ID` | Auto-generated Teams app ID |
| `AZURE_FUNCTIONS_URL` | URL of deployed Azure Functions |
| `GITHUB_GIST_ID` | Gist ID for cloud sync (from VS Code) |
| `ALEX_API_KEY_REGISTRATION_ID` | API key for plugin auth |

## Development Status

- [x] Project scaffolding
- [x] Declarative agent manifest (v1.6)
- [x] API plugin manifest (v2.3)
- [x] OpenAPI specification
- [x] Alex system prompt
- [ ] Azure Functions implementation
- [ ] Icon assets
- [ ] Local testing
- [ ] Cloud deployment

## Related

- [Alex VS Code Extension](../Alex_Plug_In)
- [M365 Copilot Roadmap](../Alex_Plug_In/ROADMAP-M365-COPILOT.md)

---

🦖 *Project Dino - v4.0.0 QUADRUNIUM*
