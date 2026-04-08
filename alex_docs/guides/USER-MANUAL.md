# 📖 Alex User Manual

> Complete guide to using Alex Cognitive Architecture

**Related**: [Quick Reference](./QUICK-REFERENCE.md) · [Use Cases](./USE-CASES.md) · [Working with Alex](../WORKING-WITH-ALEX.md)

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Use Cases](#use-cases)
3. [Daily Usage](#daily-usage)
4. [Commands Reference](#commands-reference)
5. [Memory Management](#memory-management)
6. [Knowledge Sharing](#knowledge-sharing)
7. [Maintenance](#maintenance)
8. [Upgrading](#upgrading)
9. [Troubleshooting](#troubleshooting)

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

   ```bash
   node .github/muscles/sync-architecture.cjs
   # Or if the extension is installed: Ctrl+Shift+P → "Alex: Initialize Architecture"
   ```

   This creates the `.github/` folder with Alex's cognitive memory files.

3. **Start Chatting**

   Open Copilot Chat and type:

   ```text
   @alex Hello!
   ```

### First Session Checklist

- [ ] Extension installed (or `.github/` copied manually)
- [ ] Architecture initialized
- [ ] Test Alex in chat: "Hello!"
- [ ] Personalize with profile prompt (optional)

### Recommended Settings (VS Code 1.111+)

See [Environment Setup](ENVIRONMENT-SETUP.md) for the complete tiered settings reference (Essential / Recommended / Nice-to-Have).

**Quick Setup:** See [Environment Setup](ENVIRONMENT-SETUP.md) for recommended VS Code settings.
- **Background Agents**: Run long tasks (like Dream) without blocking your work

---

## Use Cases

Alex adapts to your domain. While VS Code is traditionally for code, Alex works equally well for any text-based knowledge work.

### 💻 Software Development

Build applications, debug code, design architectures, and accumulate engineering patterns.

```text
@alex Help me optimize this database query
@alex What patterns do we use for error handling?
@alex Remember: this API requires pagination for results > 100
```

### 📚 Writing & Publishing

Books, articles, essays, technical writing—Alex supports narrative structure, consistency, and revision.

```text
@alex Let's strengthen the argument in chapter 3
@alex Help me maintain consistent voice across chapters
@alex What structure works best for this essay?
```

### 🎓 Academic Research

Thesis, dissertations, research papers, literature reviews, and grant proposals.

```text
@alex Help me synthesize these conflicting findings
@alex Let's identify gaps in the methodology
@alex What do we know about this theoretical framework?
```

### 📊 Project & Change Management

ADKAR change management, PMI project management, BRDs, business cases, and strategic planning.

```text
@alex Let's assess ADKAR readiness for this initiative
@alex Help me decompose the WBS for phase 2
@alex What risks should we address in the project charter?
```

### 🎭 Creative Arts

Screenwriting, poetry, journalism—dramatic structure, imagery, and storytelling craft.

```text
@alex Let's tighten this dialogue for subtext
@alex Help me strengthen the imagery in stanza three
@alex What's the human angle in this data story?
```

### 📝 Professional Writing

Business proposals, legal documents, technical documentation, and executive communications.

```text
@alex Let's make this proposal more compelling
@alex Help me ensure this policy covers edge cases
@alex What's missing from this executive summary?
```

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

**Table 1:** *Essential Slash Commands*

| Command        | What It Does                          |
| -------------- | ------------------------------------- |
| `/status`      | Check Alex health and version         |
| `/meditate`    | Consolidate knowledge from session    |
| `/dream`       | Run neural maintenance                |
| `/session`     | Start a focused learning session      |
| `/learn`       | Start a learning conversation         |
| `/model`       | Model intelligence dashboard          |
| `/calendar`    | View upcoming calendar events (Graph) |
| `/context`     | Full work context (Graph)             |
| `/checkskills` | Discover new skills from GK           |
| `/docs`        | Open documentation                    |

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

### Core Operations

**Table 2:** *Alex Operations (available via prompts, scripts, or extension Command Palette)*

| Operation                           | Description                    |
| ----------------------------------- | ------------------------------ |
| Initialize Architecture             | First-time setup for a project |
| Upgrade Architecture                | Update to latest version       |
| Dream (Neural Maintenance)          | Validate and repair synapses   |
| Self-Actualize (Deep Meditation)    | Comprehensive health check     |
| Skill & Knowledge Review            | Review staleness-prone skills  |
| Inherit Skill from Global Knowledge | Pull skills from GK repository |
| Open Documentation                  | View the docs                  |
| Sync Global Knowledge               | Sync with GitHub               |
| Push Knowledge to Cloud             | Upload to GitHub               |
| Pull Knowledge from Cloud           | Download from GitHub           |

### Chat Commands (@alex /command)

**Table 3:** *Complete Chat Commands Reference*

| Command            | Purpose                 | Example                                             |
| ------------------ | ----------------------- | --------------------------------------------------- |
| `/status`          | Health check            | `@alex /status`                                     |
| `/meditate`        | Knowledge consolidation | `@alex /meditate I learned about DI patterns`       |
| `/dream`           | Neural maintenance      | `@alex /dream`                                      |
| `/selfactualize`   | Deep assessment         | `@alex /selfactualize`                              |
| `/learn`           | Learning session        | `@alex /learn TypeScript generics`                  |
| `/model`           | Model intelligence      | `@alex /model` or `@alex /model <task>`             |
| `/azure`           | Azure guidance          | `@alex /azure deploy function app`                  |
| `/m365`            | M365 guidance           | `@alex /m365 create teams bot`                      |
| `/calendar`        | Calendar events (Graph) | `@alex /calendar` or `@alex /calendar 7`            |
| `/mail`            | Recent emails (Graph)   | `@alex /mail` or `@alex /mail unread`               |
| `/context`         | Full work context       | `@alex /context`                                    |
| `/people`          | People search (Graph)   | `@alex /people John Smith`                          |
| `/profile`         | Personalization         | `@alex /profile`                                    |
| `/knowledge`       | Search global           | `@alex /knowledge caching patterns`                 |
| `/saveinsight`     | Save learning           | `@alex /saveinsight [your insight]`                 |
| `/promote`         | Promote to global       | `@alex /promote .github/skills/api-design/SKILL.md` |
| `/knowledgestatus` | Knowledge stats         | `@alex /knowledgestatus`                            |
| `/sync`            | Cloud sync              | `@alex /sync`                                       |
| `/docs`            | Open documentation      | `@alex /docs`                                       |

**Skill Discovery** (conversational — no `/` prefix needed):

| Phrase       | Purpose               | Example                                     |
| ------------ | --------------------- | ------------------------------------------- |
| check skills | Discover new skills   | `@alex check what new skills are available` |
| pull skill   | Install skill from GK | `@alex pull the api-design skill`           |

---

## Memory Management

### Memory Types

Alex has different types of memory:

**Table 4:** *Alex Memory Types and Locations*

| Type           | Location                | Purpose                          |
| -------------- | ----------------------- | -------------------------------- |
| **Working**    | Chat session            | Current conversation (temporary) |
| **Procedural** | `.github/instructions/` | How-to processes                 |
| **Episodic**   | `.github/prompts/`      | Complex workflows                |
| **Skills**     | `.github/skills/`       | Domain expertise                 |
| **Global**     | `~/.alex/`              | Cross-project knowledge          |

### Creating Domain Knowledge

For project-specific expertise, create a skill folder:

```text
.github/skills/your-topic/SKILL.md
```

Template:

```markdown
# Your Topic Skill

> Brief description

## Overview

What this skill covers.

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

### Health Dashboard

For a comprehensive view of Alex's cognitive architecture, open the Health Dashboard:

```text
Ctrl+Shift+P → "Alex: Health Dashboard"
```

The dashboard displays:

- **Health Overview** - Overall status with synapse health indicator
- **Synapse Network** - Visual representation of connections (healthy/broken)
- **Memory Architecture** - File breakdown by category (instructions, prompts, domain knowledge)
- **Global Knowledge** - Patterns and insights counts
- **Active Goals** - Current learning goals with progress
- **Session Status** - Current session timer (if active)
- **Cloud Sync** - Sync status and last sync time

### Project Audit

Run a comprehensive 22-point audit to check project health:

```text
Ctrl+Shift+P → "Alex: Run Project Audit"
```

Or ask Alex directly:

```text
@alex run full audit
@alex run security audit
@alex run dependency audit
```

**Audit Categories:**

| Priority | Audits                                                    |
| -------- | --------------------------------------------------------- |
| 🔴 High   | Security, Dependencies, Code Quality                      |
| 🟡 Medium | UI, Bundle Size, Git, Changelog, Tests, API Compatibility |
| 🟢 Low    | Accessibility, Localization, Assets, Configuration        |

**Audit Triggers:**
- "full audit" / "master audit" - All 22 checks
- "security audit" - Secrets, CSP, input sanitization
- "dependency audit" - npm vulnerabilities, outdated packages
- "ui audit" - Dead buttons, WebView issues
- "test coverage" - Missing tests, coverage gaps
- "accessibility audit" - ARIA, keyboard navigation
- "bundle size" - Extension size analysis

### Daily Maintenance

**Recommended workflow:**

1. Start session: `@alex Hello!` (triggers auto-check)
2. Work on your project
3. End session: `@alex /meditate` (consolidate learnings)

### Weekly Maintenance

Run neural maintenance to keep connections healthy:

```bash
node .github/muscles/brain-qa.cjs
# Or use the dream prompt in agent mode
```

### Monthly Maintenance

Deep self-assessment:

Use the selfactualize prompt in agent mode.

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

```bash
node .github/muscles/sync-architecture.cjs
# Or if extension installed: Ctrl+Shift+P → "Alex: Upgrade Architecture"
```

### What Happens During Upgrade

1. **Backup** - All files backed up to `archive/upgrades/`
2. **Update** - System files updated automatically
3. **Migrate** - Schema changes applied automatically
4. **Validate** - Dream protocol runs to verify health
5. **Clean up** - Temporary files removed

### After Upgrade

The upgrade validates automatically with Dream protocol. You can verify with:

```text
@alex /status
```

### Upgrade Tips

- ✅ Upgrades are fully automated - just click "Run Upgrade"
- ✅ Backups are created automatically
- ✅ Your knowledge is always preserved
- ✅ Schema migrations happen automatically
- ❌ Don't interrupt the upgrade process

---

## Troubleshooting

### Alex Not Responding

1. Check extension is installed and enabled
2. Verify `@alex` prefix in chat
3. Try reloading VS Code: `Ctrl+Shift+P` → "Reload Window"

### "Not Initialized" Error

Run initialization:

```bash
node .github/muscles/sync-architecture.cjs
```

### Broken Synapses

Run neural maintenance:

```bash
node .github/muscles/brain-qa.cjs
```

### Cloud Sync Issues

1. Check GitHub authentication in VS Code
2. View Output panel: "Alex Unconscious Mind"
3. Try manual sync: `@alex /sync`

### Upgrade Failed

1. Check the error message
2. Look in `archive/upgrades/` for backups
3. Try `Alex: Reset Architecture` via extension (last resort - backs up first)

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

**Table 5:** *Useful Keyboard Shortcuts*

| Action                 | Shortcut                  |
| ---------------------- | ------------------------- |
| Start Learning Session | `Ctrl+Alt+P`              |
| Pause/Resume Session   | `Ctrl+Alt+Space`          |
| Search Knowledge       | `Ctrl+Shift+K`            |
| Run Dream Protocol     | `Ctrl+Alt+D`              |
| Self-Actualize         | `Ctrl+Alt+S`              |
| Sync Knowledge         | `Ctrl+Alt+K`              |
| Open Documentation     | `Ctrl+Alt+H`              |
| Open Chat              | `Ctrl+Alt+I`              |
| Command Palette        | `Ctrl+Shift+P`            |
| Output Panel           | `Ctrl+Shift+U`            |
| Reload Window          | `Ctrl+Shift+P` → "Reload" |

---

## Version Information

**Table 6:** *Version Information Locations*

| Component            | Location                          |
| -------------------- | --------------------------------- |
| Extension Version    | `@alex /status`                   |
| Architecture Version | `.github/copilot-instructions.md` |
| Documentation        | `@alex /docs`                     |

---

*Alex User Manual - Your Complete Guide*
