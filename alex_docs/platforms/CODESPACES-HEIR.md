# GitHub Codespaces Heir — Alex Cognitive Architecture

> Cloud deployment heir — VS Code in the browser with full Alex capabilities

|              |                                           |
| ------------ | ----------------------------------------- |
| **Status**   | ✅ Production (automatic via VS Code heir) |
| **Created**  | 2026-02-14                                |
| **Target**   | GitHub Codespaces (cloud VS Code)         |
| **Location** | `platforms/codespaces/`                   |

---

## Executive Summary

GitHub Codespaces runs a full VS Code instance in the cloud. Since Alex ships as a VS Code extension, Codespaces inherits the **complete** Alex experience with zero additional configuration. This makes it a "free" heir — no translation layer, no adapted format, no sync pipeline.

### Strategic Value

| Benefit              | Description                                             |
| -------------------- | ------------------------------------------------------- |
| **Zero-effort heir** | VS Code extension works identically in Codespaces       |
| **Anywhere access**  | Full Alex from any browser — no local install required  |
| **Team onboarding**  | Pre-configured `.devcontainer.json` gives instant Alex  |
| **Ephemeral safety** | Disposable environments — experiment without risk       |
| **Education**        | Students/workshops get Alex without local machine setup |

**Alex Value-Add Score: 10/10** — Same as VS Code (it IS VS Code in the cloud)

---

## Architecture Mapping

### Why a Lightweight Platform Directory

Unlike Claude Code or M365 heirs, Codespaces needs **no source code or format translation**. The `platforms/codespaces/` directory contains only deployment tooling:

- `devcontainer.json` — template config for any target repo
- `deploy.ps1` — script to deploy the devcontainer to a target repo
- `DEPLOYMENT-CHECKLIST.md` — step-by-step validation

The actual Alex code runs as the **same VS Code extension** — same binary, same APIs.

### What Works Identically

| Feature                   | Codespaces Support | Notes                                     |
| ------------------------- | ------------------ | ----------------------------------------- |
| Extension commands        | ✅ Full             | Dream, meditate, self-actualize, etc      |
| Chat participant (@alex)  | ✅ Full             | All slash commands and tools              |
| `.github/instructions/`   | ✅ Full             | Auto-loaded procedural memory             |
| `.github/prompts/`        | ✅ Full             | Episodic workflows                        |
| `.github/skills/`         | ✅ Full             | Portable skill library                    |
| `.github/agents/`         | ✅ Full             | Specialized cognitive agents              |
| Sidebar welcome view      | ✅ Full             | Status, focus, quick actions              |
| Health dashboard          | ✅ Full             | Webview panels work in browser            |
| Persona detection         | ✅ Full             | Focus Trifectas via Active Context        |
| Global Knowledge (GK)     | ✅ Full             | GitHub repo — auto-clone via devcontainer |
| Focus sessions (Pomodoro) | ✅ Full             | Timer runs in extension host              |
| Export (M365)             | ✅ Full             | Generates export files                    |

### What Requires Attention

| Concern                  | Impact           | Mitigation                                          |
| ------------------------ | ---------------- | --------------------------------------------------- |
| **Ephemeral filesystem** | Meditation state | Commit `.github/` changes before stopping Codespace |
| **Extension install**    | First launch     | Use `devcontainer.json` to pre-install              |
| **Settings sync**        | Preferences      | Use VS Code Settings Sync or `devcontainer.json`    |
| **Performance**          | Large repos      | Machine type affects dream/meditation speed         |

---

## Setup Guide

### Method 1: devcontainer.json (Recommended)

Add to `.devcontainer/devcontainer.json` to auto-install Alex in every Codespace:

```json
{
  "name": "Alex-Enabled Development",
  "image": "mcr.microsoft.com/devcontainers/universal:2",
  "customizations": {
    "vscode": {
      "extensions": [
        "fabioc-aloha.alex-cognitive-architecture"
      ],
      "settings": {
        "chat.agent.enabled": true,
        "chat.agentSkillsLocations": [".github/skills"],
        "chat.useAgentsMdFile": true,
        "chat.mcp.gallery.enabled": true
      }
    }
  }
}
```

### Method 2: Manual Install

1. Open repository in Codespaces
2. Open Extensions sidebar → Search "Alex Cognitive Architecture"
3. Install → Extension activates automatically
4. If `.github/` exists with Alex files, architecture loads immediately

### Method 3: Codespace Template (Future)

A pre-built Codespace template with Alex pre-configured for workshops and onboarding.

---

## Persistence Strategy

> **Critical**: Codespaces are ephemeral. If a Codespace is deleted, uncommitted changes are lost.

### What Persists Automatically

| Item               | Storage           | Survives Deletion? |
| ------------------ | ----------------- | ------------------ |
| `.github/` in repo | Git (committed)   | ✅ Yes              |
| Extension settings | Settings Sync     | ✅ If sync enabled  |
| Extension state    | Codespace storage | ❌ No               |
| Global Knowledge   | GitHub repo clone | ✅ If auto-cloned   |
| Meditation state   | `.github/config/` | ✅ If committed     |

### Recommended Workflow

```
1. Start Codespace → Alex auto-activates
2. Work normally — all Alex features available
3. Before stopping:
   a. Commit any .github/ changes (meditation state, profile updates)
   b. Global Knowledge insights: use /saveinsight to persist to GK repo
4. Stop Codespace → extension state lost, but repo data preserved
```

### Global Knowledge in Codespaces

Global Knowledge (GK) is a **GitHub repository** (`Alex-Global-Knowledge`). Since Codespaces has native GitHub access, GK works fully — just clone it on container creation:

```json
{
  "postCreateCommand": "git clone https://github.com/YOUR_USER/Alex-Global-Knowledge.git ~/.alex/global-knowledge 2>/dev/null || true"
}
```

With this one-liner in `devcontainer.json`:
- All patterns and insights are available immediately
- `/saveinsight` writes to the GK clone — push to persist
- `/knowledge` search works across all cross-project learnings
- Team members sharing the same GK repo get shared knowledge automatically

---

## Team Deployment

### For Team Leads

1. Add `.devcontainer/devcontainer.json` with Alex extension to the repo
2. Commit `.github/` with standard Alex architecture
3. Team members open Codespaces → get Alex automatically
4. Share Global Knowledge repo name for cross-project learnings

### For Workshops / Education

1. Create a template repository with Alex pre-configured
2. Students click "Use this template" → "Open in Codespace"
3. Full Alex experience in 60 seconds, no local setup

---

## Comparison with Local VS Code

| Dimension             | Local VS Code     | Codespaces                               |
| --------------------- | ----------------- | ---------------------------------------- |
| **Performance**       | Native speed      | Depends on machine type                  |
| **Persistence**       | Always persists   | Ephemeral — must commit                  |
| **Global Knowledge**  | `~/.alex/` native | GitHub repo — auto-clone in devcontainer |
| **Extension updates** | Auto-updates      | Per-Codespace                            |
| **Offline access**    | ✅ Yes             | ❌ No                                     |
| **Team sharing**      | Manual sync       | Instant via repo + devcontainer          |
| **Cost**              | Free              | GitHub billing (free tier available)     |

---

## Heir Relationship

```
Master Alex (.github/)
    │
    ├── VS Code Extension (platforms/vscode-extension/)
    │       │
    │       └── Codespaces (platforms/codespaces/) ← deploy tooling only
    │                      Same extension, cloud runtime
    │
    ├── M365 Copilot (platforms/m365-copilot/) — requires export
    └── ...other heirs require adaptation
```

Codespaces is unique among heirs: it's the **only platform that requires zero code translation**. The platform directory exists solely for deployment scripts — the runtime is the VS Code extension itself.

---

## References

| Resource             | Link                                                                       |
| -------------------- | -------------------------------------------------------------------------- |
| **User Manual**      | [USER-MANUAL.md](../../platforms/codespaces/USER-MANUAL.md)                |
| GitHub Codespaces    | <https://docs.github.com/en/codespaces>                                    |
| devcontainer.json    | <https://containers.dev/implementors/json_reference/>                      |
| VS Code Heir         | [VSCODE-HEIR.md](VSCODE-HEIR.md)                                           |
| Platform Comparison  | [DEVELOPMENT-PLATFORMS-COMPARISON.md](DEVELOPMENT-PLATFORMS-COMPARISON.md) |
| Master-Heir Overview | [MASTER-HEIR-ARCHITECTURE.md](MASTER-HEIR-ARCHITECTURE.md)                 |
