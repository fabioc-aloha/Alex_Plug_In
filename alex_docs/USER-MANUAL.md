# 📖 Alex User Manual

> Complete guide to using Alex Cognitive Architecture

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Daily Usage](#daily-usage)
3. [Commands Reference](#commands-reference)
4. [Memory Management](#memory-management)
5. [Knowledge Sharing](#knowledge-sharing)
6. [Maintenance](#maintenance)
7. [Upgrading](#upgrading)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Installation

1. **Install the Extension**

   ```text
   Ctrl+Shift+X → Search "Alex Cognitive Architecture" → Install
   ```

   Or from command line:

   ```bash
   code --install-extension fabioc-aloha.alex-cognitive-architecture
   ```

2. **Initialize Alex in Your Project**

   ```text
   Ctrl+Shift+P → "Alex: Initialize Architecture"
   ```

   This creates the `.github/` folder with Alex's cognitive memory files.

3. **Start Chatting**

   Open Copilot Chat and type:

   ```text
   @alex Hello!
   ```

### First Session Checklist

- [ ] Extension installed
- [ ] `Alex: Initialize Architecture` run
- [ ] Test `@alex /status` in chat
- [ ] Run `@alex /profile` to personalize (optional)

---

## Daily Usage

### Talking to Alex

Always start with `@alex` to activate Alex's cognitive framework:

```text
@alex How do I implement error handling in this API?
@alex Review this code for potential issues
@alex Help me understand this architecture
```

### Slash Commands

Quick actions via `/` commands:

| Command | What It Does |
|---------|--------------|
| `/status` | Check Alex health and version |
| `/meditate` | Consolidate knowledge from session |
| `/dream` | Run neural maintenance |
| `/learn` | Start a learning session |
| `/docs` | Open documentation |

### Learning Something New

When you learn something valuable:

```text
@alex /saveinsight React useEffect cleanup runs before the next effect, not on unmount
```

This saves the insight to your global knowledge base for use in other projects.

### Finding Past Knowledge

Search across all your projects:

```text
@alex /knowledge error handling patterns
@alex /knowledge React hooks gotchas
```

---

## Commands Reference

### Command Palette (Ctrl+Shift+P)

| Command | Description |
|---------|-------------|
| `Alex: Initialize Architecture` | First-time setup for a project |
| `Alex: Upgrade Architecture` | Update to latest version |
| `Alex: Dream (Neural Maintenance)` | Validate and repair synapses |
| `Alex: Self-Actualize (Deep Meditation)` | Comprehensive health check |
| `Alex: Open Documentation` | View the docs |
| `Alex: Sync Global Knowledge` | Sync with GitHub Gist |
| `Alex: Push Knowledge to Cloud` | Upload to GitHub |
| `Alex: Pull Knowledge from Cloud` | Download from GitHub |

### Chat Commands (@alex /command)

| Command | Purpose | Example |
|---------|---------|---------|
| `/status` | Health check | `@alex /status` |
| `/meditate` | Knowledge consolidation | `@alex /meditate I learned about DI patterns` |
| `/dream` | Neural maintenance | `@alex /dream` |
| `/selfactualize` | Deep assessment | `@alex /selfactualize` |
| `/learn` | Learning session | `@alex /learn TypeScript generics` |
| `/azure` | Azure guidance | `@alex /azure deploy function app` |
| `/m365` | M365 guidance | `@alex /m365 create teams bot` |
| `/profile` | Personalization | `@alex /profile` |
| `/knowledge` | Search global | `@alex /knowledge caching patterns` |
| `/saveinsight` | Save learning | `@alex /saveinsight [your insight]` |
| `/promote` | Promote to global | `@alex /promote .github/domain-knowledge/DK-API.md` |
| `/knowledgestatus` | Knowledge stats | `@alex /knowledgestatus` |
| `/sync` | Cloud sync | `@alex /sync` |
| `/docs` | Open documentation | `@alex /docs` |

---

## Memory Management

### Memory Types

Alex has different types of memory:

| Type | Location | Purpose |
|------|----------|---------|
| **Working** | Chat session | Current conversation (temporary) |
| **Procedural** | `.github/instructions/` | How-to processes |
| **Episodic** | `.github/prompts/` | Complex workflows |
| **Domain** | `.github/domain-knowledge/` | Project expertise |
| **Global** | `~/.alex/` | Cross-project knowledge |

### Creating Domain Knowledge

For project-specific expertise, create a file:

```text
.github/domain-knowledge/DK-YOUR-TOPIC.md
```

Template:

```markdown
# DK-YOUR-TOPIC

> Brief description

## Overview

What this knowledge covers.

## Key Concepts

### Concept 1
...

## Synapses

- [related-file.md] (Medium, References, Forward) - "relationship"
```

### Consolidating Knowledge

After a productive session:

```text
@alex /meditate I learned about [topic] today
```

Alex will guide you through consolidating insights into permanent memory.

---

## Knowledge Sharing

### Global Knowledge Base

Your `~/.alex/` folder contains knowledge that works across all projects:

```text
~/.alex/
├── global-knowledge/
│   ├── patterns/     # Reusable patterns (GK-*.md)
│   ├── insights/     # Timestamped learnings (GI-*.md)
│   └── index.json    # Searchable index
└── project-registry.json
```

### Saving Insights

When you learn something valuable:

```text
@alex /saveinsight title="Error handling pattern" insight="Always wrap async operations in try-catch with specific error types" tags="error-handling,async,typescript"
```

### Cloud Backup

Sync knowledge to GitHub Gist for backup and sharing across machines:

```text
@alex /sync     # Bidirectional sync
@alex /push     # Upload only
@alex /pull     # Download only
```

First sync creates a private Gist automatically.

---

## Maintenance

### Daily Maintenance

**Recommended workflow:**

1. Start session: `@alex Hello!` (triggers auto-check)
2. Work on your project
3. End session: `@alex /meditate` (consolidate learnings)

### Weekly Maintenance

Run neural maintenance to keep connections healthy:

```text
@alex /dream
```

Or from Command Palette:

```text
Alex: Dream (Neural Maintenance)
```

### Monthly Maintenance

Deep self-assessment:

```text
@alex /selfactualize
```

This:

- Validates all synaptic connections
- Checks version consistency
- Analyzes memory architecture balance
- Creates a session record

---

## Upgrading

### Automatic Notification

When a new version is available, Alex shows a notification:

- Click **"Run Upgrade"** to update
- Click **"View Changelog"** to see what's new

### Manual Upgrade

```text
Ctrl+Shift+P → "Alex: Upgrade Architecture"
```

### What Happens During Upgrade

1. **Backup** - All files backed up to `archive/upgrades/`
2. **Update** - System files updated automatically
3. **Preserve** - Your custom knowledge preserved
4. **Migrate** - Schema changes applied if needed

### After Upgrade

Run dream protocol to validate:

```text
@alex /dream
```

### Upgrade Tips

- ✅ Upgrades are safe - backups are automatic
- ✅ Your knowledge is preserved
- ✅ Run `/dream` after upgrading
- ❌ Don't interrupt the upgrade process

---

## Troubleshooting

### Alex Not Responding

1. Check extension is installed and enabled
2. Verify `@alex` prefix in chat
3. Try reloading VS Code: `Ctrl+Shift+P` → "Reload Window"

### "Not Initialized" Error

Run initialization:

```text
Ctrl+Shift+P → "Alex: Initialize Architecture"
```

### Broken Synapses

Run neural maintenance:

```text
@alex /dream
```

Or:

```text
Ctrl+Shift+P → "Alex: Dream (Neural Maintenance)"
```

### Cloud Sync Issues

1. Check GitHub authentication in VS Code
2. View Output panel: "Alex Unconscious Mind"
3. Try manual sync: `@alex /sync`

### Upgrade Failed

1. Check the error message
2. Look in `archive/upgrades/` for backups
3. Try `Alex: Reset Architecture` (last resort - backs up first)

### Finding Logs

- **Output Panel**: `Ctrl+Shift+U` → Select "Alex Cognitive Architecture"
- **Background Sync Logs**: Select "Alex Unconscious Mind"

### Getting Help

1. Check documentation: `@alex /docs`
2. Search knowledge: `@alex /knowledge [your issue]`
3. Run diagnostics: `@alex /status`

---

## Quick Tips

### Productivity

- 💡 Start each session with `@alex Hello!` for health check
- 💡 Save insights immediately when you learn something
- 💡 Use `/knowledge` before researching - you might already know it!
- 💡 End sessions with `/meditate` to consolidate

### Organization

- 📁 Keep domain knowledge files focused (one topic per file)
- 🏷️ Use consistent tags when saving insights
- 🔗 Add synapses to connect related knowledge

### Maintenance

- 🌙 Run `/dream` weekly for healthy connections
- 🧘 Run `/selfactualize` monthly for deep assessment
- ☁️ Sync to cloud after saving important insights

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Chat | `Ctrl+Alt+I` |
| Command Palette | `Ctrl+Shift+P` |
| Output Panel | `Ctrl+Shift+U` |
| Reload Window | `Ctrl+Shift+P` → "Reload" |

---

## Version Information

| Component | Location |
|-----------|----------|
| Extension Version | `@alex /status` |
| Architecture Version | `.github/copilot-instructions.md` |
| Documentation | `@alex /docs` |

---

*Alex User Manual - Your Complete Guide*
