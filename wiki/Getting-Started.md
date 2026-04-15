# Getting Started

Get up and running with Alex in 5 minutes.

## Prerequisites

- **VS Code** 1.100 or later
- **GitHub Copilot** subscription (Alex uses Copilot's language models)
- **Node.js** 18+ (for heir project features)

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for "Alex Cognitive Architecture"
4. Click **Install**
5. Reload VS Code when prompted

### From VSIX (Manual)

```bash
code --install-extension alex-cognitive-architecture-X.X.X.vsix
```

## First Launch

When you first install Alex, you'll see the **Alex Welcome** sidebar panel. This is your command center.

### The Welcome Experience

1. **Mind Tab** — Shows Alex's current cognitive state (synapses, skills, memory)
2. **Mission Tab** — Displays your current focus and recent sessions
3. **Journey Tab** — Tracks your learning path with Alex

### Initial Setup

Alex will prompt you to:

1. **Accept the partnership** — Alex remembers your preferences and learns from sessions
2. **Set your persona** — Are you primarily a Developer, Researcher, or Writer?
3. **Choose your workspace** — Alex adapts to your project structure

## Your First Conversation

Open Copilot Chat (`Ctrl+Shift+I`) and type:

```
@alex What can you help me with?
```

Alex will introduce available capabilities based on your workspace.

## Try These Commands

| Command | What It Does |
|---------|--------------|
| `@alex dream` | Validates and repairs Alex's memory |
| `@alex meditate` | Consolidates recent learning |
| `@alex status` | Shows current cognitive health |

## Configure Your Workspace

For Alex to work best in your project, create a `copilot-instructions.md` file:

```bash
# In your project root
echo "# Project Instructions\n\nThis is a TypeScript project using React." > .github/copilot-instructions.md
```

Or let Alex do it:

```
@alex initialize this workspace
```

## What's Next?

- **[User Manual](User-Manual)** — Learn all commands and UI features
- **[Heir Project Setup](Heir-Project-Setup)** — Configure Alex for your specific project
- **[FAQ](FAQ)** — Common questions and troubleshooting

---

*Alex learns your patterns. The more you work together, the better the partnership becomes.*
