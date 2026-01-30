# Domain Knowledge: Alex Recommended Environment

> Minimal VS Code settings for optimal Alex functionality

## 🔴 Essential Settings (Required for Alex)

These settings are **required** for Alex to function properly:

```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  },
  "chat.useAgentSkills": true,
  "chat.useNestedAgentsMdFiles": true,
  "github.copilot.chat.tools.memory.enabled": true
}
```

| Setting | Why Required |
|---------|--------------|
| `instructionsFilesLocations` | Enables Alex's procedural memory (.instructions.md) |
| `useAgentSkills` | Activates SKILL.md capabilities |
| `useNestedAgentsMdFiles` | Enables .agent.md hierarchies |
| `memory.enabled` | Persistent memory across sessions |

---

## 🟡 Recommended Settings (Improves Experience)

These settings significantly improve the Alex experience but are optional:

```json
{
  "github.copilot.chat.agent.thinkingTool": true,
  "chat.agent.maxRequests": 50,
  "chat.experimental.detectParticipant.enabled": true,
  "github.copilot.chat.followUps": "always",
  "chat.agent.todoList": {
    "position": "panel"
  }
}
```

| Setting | Benefit |
|---------|---------|
| `thinkingTool` | Deep reasoning for complex tasks |
| `maxRequests: 50` | Allows multi-step operations |
| `detectParticipant` | Auto-routes to @alex when relevant |
| `followUps: always` | Better conversational flow |
| `todoList: panel` | Better visibility during protocols |

---

## 🟢 Nice-to-Have Settings (Quality of Life)

Optional settings that reduce friction:

```json
{
  "chat.tools.autoRun": true,
  "chat.tools.fileSystem.autoApprove": true,
  "github.copilot.chat.localeOverride": "en",
  "chat.commandCenter.enabled": true
}
```

### Terminal Auto-Approve (Optional)
```json
{
  "chat.tools.terminal.autoApprove": {
    "git status": true,
    "git diff": true,
    "npm": true,
    "Get-ChildItem": true,
    "Test-Path": true
  }
}
```

---

## 🔌 MCP Servers (Optional)

If you want enhanced capabilities:

```json
{
  "servers": {
    "memory": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:/Development"]
    }
  }
}
```

---

## 🚀 Safe Setup Process

When Alex offers to configure your environment:

1. **Alex reads** your current settings first
2. **Alex shows** what will be added (never overwrites existing)
3. **You approve** each category (Essential/Recommended/Nice-to-Have)
4. **Alex merges** only approved settings
5. **Backup** is created before any changes

### User Prompt Template
```
I can help optimize your VS Code for better Alex integration.

Would you like me to:
☐ Add essential settings (required for full Alex functionality)
☐ Add recommended settings (improves experience)
☐ Add nice-to-have settings (reduces friction)

I'll show you exactly what will be added before making any changes.
Your existing settings will NOT be modified or removed.
```

---

## Synapses

- **[alex-initialization.prompt.md]** (High, Triggers, Forward) → Offer environment setup during init
- **[bootstrap-learning.instructions.md]** (Medium, Enhances, Forward) → Environment setup is part of onboarding

---

*Last Updated: 2026-01-29 (Meditation Session)*
