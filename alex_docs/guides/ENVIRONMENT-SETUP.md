# Alex Environment Setup

> **VS Code settings for optimal Alex functionality.**
> Source of truth: `.github/copilot-instructions.md` § VS Code Settings (1.111+)

---

## 🔴 Essential Settings (Required)

These settings are **required** for Alex architecture features to function:

```json
{
  "chat.agent.enabled": true,
  "chat.agentSkillsLocations": [".github/skills"],
  "chat.useAgentsMdFile": true,
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  },
  "chat.hooks.enabled": true,
  "chat.useCustomAgentHooks": true,
  "github.copilot.chat.copilotMemory.enabled": true,
  "chat.autopilot.enabled": true,
  "github.copilot.chat.searchSubagent.enabled": true,
  "chat.customAgentInSubagent.enabled": true,
  "chat.mcp.gallery.enabled": true,
  "chat.agentsControl.enabled": true,
  "chat.requestQueuing.enabled": true,
  "chat.plugins.enabled": true
}
```

| Setting | Purpose |
| ------- | ------- |
| `agent.enabled` | Enables agent mode (custom agents, tools) |
| `agentSkillsLocations` | Auto-loads Alex skills from `.github/skills/` |
| `useAgentsMdFile` | Enables `.github/AGENTS.md` agent registry |
| `instructionsFilesLocations` | Enables procedural memory (.instructions.md) |
| `hooks.enabled` + `useCustomAgentHooks` | Agent hooks (pre-commit, post-task) |
| `copilotMemory.enabled` | Persistent memory across sessions |
| `autopilot.enabled` | Autonomous multi-step execution |
| `searchSubagent.enabled` + `customAgentInSubagent` | Codebase search with custom agents |
| `mcp.gallery.enabled` | MCP tool gallery access |
| `agentsControl.enabled` | Agent status in command center |
| `requestQueuing.enabled` | Queue parallel requests |
| `plugins.enabled` | Extension-contributed chat tools |

---

## 🟡 Recommended Settings (Improves Experience)

```json
{
  "github.copilot.chat.models.anthropic.claude-opus-4-*.extendedThinkingEnabled": true,
  "github.copilot.chat.models.anthropic.claude-opus-4-*.thinkingBudget": 16384,
  "github.copilot.chat.agent.thinkingTool": true,
  "chat.agent.maxRequests": 50,
  "chat.experimental.detectParticipant.enabled": true,
  "github.copilot.chat.followUps": "always",
  "chat.tips.enabled": true,
  "chat.exploreAgent.defaultModel": "claude-sonnet-4",
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
  ],
  "chat.exploreAgent.defaultModel": "claude-sonnet-4"
}
```

| Setting | Benefit |
| ------- | ------- |
| `extendedThinkingEnabled` | Extended thinking for Opus 4 models (meditation, architecture) |
| `thinkingBudget: 16384` | 16K token budget for deep reasoning |
| `thinkingTool` | Deep reasoning for complex tasks |
| `maxRequests: 50` | Allows multi-step operations |
| `detectParticipant` | Auto-routes to @alex |
| `followUps: always` | Better conversational flow |
| `tips.enabled` | Context tips in chat panel |
| `exploreAgent.defaultModel` | Faster model for Explore subagent codebase research |
| `todoList: panel` | Better visibility |
| `thinking.phrases` | Alex-personality progress messages (replaces generic "Thinking...") |

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

- [vscode-extension-patterns skill](../../.github/skills/vscode-extension-patterns/SKILL.md) — Safe configuration pattern (for Alex)
