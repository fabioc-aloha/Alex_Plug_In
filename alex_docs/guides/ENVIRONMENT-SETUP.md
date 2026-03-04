# Alex Environment Setup

> **VS Code settings for optimal Alex functionality.**

---

## 🔴 Essential Settings (Required)

These settings are **required** for Alex to function:

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

| Setting | Purpose |
| ------- | ------- |
| `instructionsFilesLocations` | Enables procedural memory (.instructions.md) |
| `useAgentSkills` | Activates SKILL.md capabilities |
| `useNestedAgentsMdFiles` | Enables .agent.md hierarchies |
| `memory.enabled` | Persistent memory across sessions |

---

## 🟡 Recommended Settings (Improves Experience)

```json
{
  "github.copilot.chat.agent.thinkingTool": true,
  "chat.agent.maxRequests": 50,
  "chat.experimental.detectParticipant.enabled": true,
  "github.copilot.chat.followUps": "always",
  "chat.agent.todoList": {
    "position": "panel"
  },
  "chat.agent.thinking.phrases": [
    "Meditating on this...",
    "Consulting synapses...",
    "Traversing knowledge graph...",
    "Consolidating memory...",
    "Activating neural pathways...",
    "Searching episodic memory...",
    "Synthesizing knowledge...",
    "Connecting the dots...",
    "Entering focused state...",
    "Examining patterns...",
    "Following the thread...",
    "Deep in thought...",
    "Warming up neurons...",
    "Running cognitive analysis...",
    "Consulting the architecture..."
  ]
}
```

| Setting | Benefit |
| ------- | ------- |
| `thinkingTool` | Deep reasoning for complex tasks |
| `maxRequests: 50` | Allows multi-step operations |
| `detectParticipant` | Auto-routes to @alex |
| `followUps: always` | Better conversational flow |
| `todoList: panel` | Better visibility |
| `thinking.phrases` | Alex-personality progress messages (replaces generic "Thinking...") |
| `enableImages` | Render images inline in terminal via Kitty graphics protocol |

---

## 🟢 Nice-to-Have Settings (Quality of Life)

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

For enhanced capabilities:

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

## Safe Setup Process

When Alex offers to configure your environment:

1. **Alex reads** your current settings first
2. **Alex shows** what will be added (never overwrites)
3. **You approve** each category
4. **Alex merges** only approved settings
5. **Backup** created before changes

Your existing settings will NOT be modified or removed.

---

## Quick Copy-Paste

### All Essential + Recommended

```json
{
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  },
  "chat.useAgentSkills": true,
  "chat.useNestedAgentsMdFiles": true,
  "github.copilot.chat.tools.memory.enabled": true,
  "github.copilot.chat.agent.thinkingTool": true,
  "chat.agent.maxRequests": 50,
  "chat.experimental.detectParticipant.enabled": true,
  "github.copilot.chat.followUps": "always"
}
```

---

## Related

- [vscode-extension-patterns skill](../.github/skills/vscode-extension-patterns/SKILL.md) — Safe configuration pattern (for Alex)
