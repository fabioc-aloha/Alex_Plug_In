# VS Code Chat Settings — Comprehensive Guide

**Last Updated**: 2026-02-15
**VS Code Version**: 1.109+
**GitHub Copilot Chat**: 0.37.6+

---

## Overview

This guide documents all available VS Code chat and GitHub Copilot settings relevant to the Alex cognitive architecture, including experimental features, hooks, and optimization opportunities.

---

## Current Configuration Status

✅ **You have 42 chat-related settings enabled** in your user settings, including many experimental/preview features. This guide explains what each does and provides optimization recommendations.

---

## Settings Categories

### 🔵 Core Settings (Essential for Alex)

These settings are **required** for Alex to function properly:

| Setting                     | Value                | Purpose                             | Status    |
| --------------------------- | -------------------- | ----------------------------------- | --------- |
| `chat.agent.enabled`        | `true`               | Enable agent mode and custom agents | ✅ Enabled |
| `chat.agentSkillsLocations` | `[".github/skills"]` | Auto-load Alex skills               | ✅ Enabled |
| `chat.useAgentsMdFile`      | `true`               | Use `.github/AGENTS.md`             | ✅ Enabled |
| `chat.useAgentSkills`       | `true`               | Enable Agent Skills standard        | ✅ Enabled |
| `chat.mcp.gallery.enabled`  | `true`               | Enable MCP tool gallery             | ✅ Enabled |

### 🟢 Recommended Settings (Significantly Improve Experience)

These settings enhance Alex's capabilities:

| Setting                                  | Value      | Purpose                           | Status    | Impact |
| ---------------------------------------- | ---------- | --------------------------------- | --------- | ------ |
| `github.copilot.chat.agent.thinkingTool` | `true`     | Deep reasoning for complex tasks  | ✅ Enabled | High   |
| `chat.agent.maxRequests`                 | `50-150`   | Allow multi-step operations       | ✅ 150     | High   |
| `github.copilot.chat.followUps`          | `"always"` | Suggest next actions              | ✅ Enabled | Medium |
| `chat.viewSessions.enabled`              | `true`     | Session history and management    | ✅ Enabled | Medium |
| `chat.commandCenter.enabled`             | `true`     | Quick access in title bar         | ✅ Enabled | Low    |
| `chat.detectParticipant.enabled`         | `true`     | Auto-route to @alex when relevant | ✅ Enabled | Medium |

### 🟡 Experimental/Preview Settings (New Features)

These settings enable cutting-edge features that may change:

#### Agent Hooks (Preview) ⚠️ **Status: Documented but may not be live in 1.109**

| Setting              | Value  | Purpose                                                 | Status                       |
| -------------------- | ------ | ------------------------------------------------------- | ---------------------------- |
| `chat.hooks.enabled` | `true` | Enable lifecycle hooks (SessionStart, PreToolUse, etc.) | ❌ Not found in your settings |

**Hook Events Available:**
- `SessionStart` — When agent session begins
- `SessionStop` — When agent session ends
- `PreToolUse` — Before any tool execution
- `PostToolUse` — After tool completes
- `PostToolUseFailure` — After tool fails
- `SubagentStart` — When subagent spawned
- `SubagentStop` — When subagent completes

**Alex Applications:**
- SessionStart: Load user profile, check meditation status
- SessionStop: Auto-meditation save
- PostToolUse: Synapse activation tracking
- PreToolUse: Safety gates for Master Alex protection

#### Copilot Memory (Preview)

| Setting                                     | Value  | Purpose                          | Status    |
| ------------------------------------------- | ------ | -------------------------------- | --------- |
| `github.copilot.chat.copilotMemory.enabled` | `true` | Cross-session memory persistence | ✅ Enabled |
| `github.copilot.chat.tools.memory.enabled`  | `true` | Enable memory tool               | ✅ Enabled |

#### Subagents & Orchestration

| Setting                                      | Value  | Purpose                        | Status    |
| -------------------------------------------- | ------ | ------------------------------ | --------- |
| `github.copilot.chat.searchSubagent.enabled` | `true` | Web search capability          | ✅ Enabled |
| `chat.customAgentInSubagent.enabled`         | `true` | Use custom agents in subagents | ✅ Enabled |

#### Request Management

| Setting                             | Value     | Purpose                                  | Status      |
| ----------------------------------- | --------- | ---------------------------------------- | ----------- |
| `chat.requestQueuing.enabled`       | `true`    | Queue messages for sequential processing | ✅ Enabled   |
| `chat.requestQueuing.defaultAction` | `"queue"` | Auto-queue by default                    | ✅ Enabled   |
| `chat.agentsControl.enabled`        | `true`    | Status indicator in command center       | ❌ Not found |

#### UI Enhancements (Experimental)

| Setting                          | Value       | Purpose                          | Status     |
| -------------------------------- | ----------- | -------------------------------- | ---------- |
| `chat.unifiedAgentsBar.enabled`  | `true`      | Unified agent selection UI       | ✅ Enabled  |
| `chat.viewProgressBadge.enabled` | `true`      | Progress indicator in view badge | ✅ Enabled  |
| `chat.viewSessions.orientation`  | `"stacked"` | Session list layout              | ✅ Enabled  |
| `chat.agent.codeBlockProgress`   | `false`     | Show progress in code blocks     | ✅ Disabled |

#### Checkpoints (Experimental) ✨ **NEW**

| Setting                            | Value  | Purpose                            | Status    |
| ---------------------------------- | ------ | ---------------------------------- | --------- |
| `chat.checkpoints.showFileChanges` | `true` | Show file changes in checkpoints   | ✅ Enabled |
| `chat.restoreLastPanelSession`     | `true` | Restore last session on panel open | ✅ Enabled |

#### Instructions & Prompts

| Setting                                                  | Value                              | Purpose                              | Status    |
| -------------------------------------------------------- | ---------------------------------- | ------------------------------------ | --------- |
| `chat.instructionsFilesLocations`                        | `{ ".github/instructions": true }` | Auto-load instructions               | ✅ Enabled |
| `chat.promptFilesLocations`                              | `{ ".github/prompts": true }`      | User-invokable prompts               | ✅ Enabled |
| `chat.includeReferencedInstructions`                     | `true`                             | Include referenced instruction files | ✅ Enabled |
| `chat.useNestedAgentsMdFiles`                            | `true`                             | Support nested AGENTS.md             | ✅ Enabled |
| `github.copilot.chat.codeGeneration.useInstructionFiles` | `true`                             | Use instruction files in code gen    | ✅ Enabled |

#### Ask Questions (Experimental)

| Setting                     | Value  | Purpose                         | Status      |
| --------------------------- | ------ | ------------------------------- | ----------- |
| `chat.askQuestions.enabled` | `true` | Agent asks clarifying questions | ❌ Not found |

**Alex Benefit**: Could improve context gathering for meditation/learning protocols.

#### MCP Advanced

| Setting                           | Value              | Purpose                  | Status       |
| --------------------------------- | ------------------ | ------------------------ | ------------ |
| `chat.mcp.autostart`              | `"newAndOutdated"` | Auto-start MCP servers   | ✅ Enabled    |
| `chat.mcp.assisted.nuget.enabled` | `true`             | NuGet package assistance | ✅ Enabled    |
| `chat.mcp.serverSampling`         | `{ ... }`          | MCP server configuration | ✅ Configured |

### 🟠 Tool Auto-Approval & Safety

These settings control automatic tool execution:

| Setting                                             | Value                                      | Purpose                          | Status       | Risk   |
| --------------------------------------------------- | ------------------------------------------ | -------------------------------- | ------------ | ------ |
| `chat.tools.autoRun`                                | `true`                                     | Auto-run tools without approval  | ✅ Enabled    | Medium |
| `chat.tools.fileSystem.autoApprove`                 | `true`                                     | Auto-approve file operations     | ✅ Enabled    | Medium |
| `chat.tools.terminal.autoApprove`                   | `{ ... }`                                  | Auto-approve specific commands   | ✅ Configured | Low    |
| `chat.tools.terminal.ignoreDefaultAutoApproveRules` | `true`                                     | Ignore VS Code defaults          | ✅ Enabled    | Low    |
| `chat.tools.terminal.preventShellHistory`           | `false`                                    | Don't add to shell history       | ✅ Disabled   | N/A    |
| `chat.tools.terminal.autoReplyToPrompts`            | `true`                                     | Auto-respond to terminal prompts | ✅ Enabled    | Medium |
| `chat.tools.urls.autoApprove`                       | `{ "https://learn.microsoft.com": {...} }` | Auto-approve URL fetches         | ✅ Configured | Low    |

**⚠️ Safety Note**: Your auto-approval configuration is aggressive but appropriate for development workflows. Master Alex workspace protection is handled at the workspace level.

### 🔴 Platform-Specific Settings (macOS/Linux Only)

These settings are **not available on Windows**:

| Setting                                       | Value              | Purpose                   | Platform     |
| --------------------------------------------- | ------------------ | ------------------------- | ------------ |
| `chat.tools.terminal.sandbox.enabled`         | `true`             | Sandbox terminal commands | macOS/Linux  |
| `chat.tools.terminal.sandbox.network`         | `["*.github.com"]` | Allowed network domains   | macOS/Linux  |
| `chat.tools.terminal.sandbox.macFileSystem`   | `["/workspace"]`   | Allowed directories       | macOS        |
| `chat.tools.terminal.sandbox.linuxFileSystem` | `["/workspace"]`   | Allowed directories       | Linux        |
| `chat.tools.terminal.outputLocation`          | `"chat"`           | Where to show output      | Experimental |

### 🟣 Anthropic/Claude-Specific Settings

For Claude Opus 4.5/Sonnet 4.5 models:

| Setting                                                | Value   | Purpose                        | Status      |
| ------------------------------------------------------ | ------- | ------------------------------ | ----------- |
| `github.copilot.chat.anthropic.thinking.budgetTokens`  | `16000` | Extended thinking token budget | ❌ Not found |
| `github.copilot.chat.anthropic.toolSearchTool.enabled` | `true`  | Tool search capability         | ❌ Not found |
| `github.copilot.chat.anthropic.contextEditing.enabled` | `true`  | Context-aware editing          | ❌ Not found |
| `claude-opus-4-*.extendedThinkingEnabled`              | `true`  | Enable extended thinking       | ❌ Not found |
| `claude-opus-4-*.thinkingBudget`                       | `16384` | Thinking token cap             | ❌ Not found |

**Note**: These settings use model-specific paths that change with each model version. Check your installed Anthropic extension for exact property names.

### ⚪ Code Generation & Customization

| Setting                                           | Value                   | Purpose                 | Status       |
| ------------------------------------------------- | ----------------------- | ----------------------- | ------------ |
| `github.copilot.chat.codeGeneration.instructions` | `["Use TypeScript..."]` | Code generation rules   | ✅ Configured |
| `github.copilot.chat.localeOverride`              | `"en"`                  | Force English responses | ✅ Enabled    |

### 🟤 Organization/Enterprise Settings

| Setting                                                | Value  | Purpose                      | Status      |
| ------------------------------------------------------ | ------ | ---------------------------- | ----------- |
| `github.copilot.chat.organizationInstructions.enabled` | `true` | Enable org-wide instructions | ❌ Not found |

### 🔧 Advanced/Developer Settings

| Setting                        | Value     | Purpose            | Status    |
| ------------------------------ | --------- | ------------------ | --------- |
| `chat.agent.todoList.position` | `"panel"` | Todo list location | ✅ Enabled |

---

## Not Currently Enabled (But Available)

These settings are available but not in your current configuration:

1. **`chat.hooks.enabled`** — Enable lifecycle hooks (may not be live yet)
2. **`chat.askQuestions.enabled`** — Agent asks clarifying questions
3. **`chat.agentsControl.enabled`** — Status indicator in command center
4. **`github.copilot.chat.anthropic.*`** — Claude-specific enhancements
5. **`github.copilot.chat.organizationInstructions.enabled`** — Org-wide instructions

---

## Hooks Deep Dive

### What Are Hooks?

Hooks allow you to run custom shell commands at specific points in the agent lifecycle. They're configured via `.github/hooks.json` or similar workspace file.

### Hook Configuration Format

```json
{
  "SessionStart": [
    {
      "matcher": ".*",
      "hooks": [
        {
          "type": "command",
          "command": "node .github/muscles/hooks/session-start.js",
          "description": "Load Alex cognitive context",
          "timeout": 5000
        }
      ]
    }
  ],
  "PostToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "./lint.sh",
          "description": "Auto-lint after edits"
        }
      ]
    }
  ]
}
```

### Alex Hook Opportunities

| Hook            | Alex Use Case                               | Benefit                 |
| --------------- | ------------------------------------------- | ----------------------- |
| `SessionStart`  | Load user profile, check meditation status  | Context awareness       |
| `SessionStop`   | Auto-save session notes, suggest meditation | Knowledge consolidation |
| `PreToolUse`    | Validate Master Alex workspace protection   | Safety                  |
| `PostToolUse`   | Log synapse activations, update metrics     | Self-improvement        |
| `SubagentStart` | Inject specialized context                  | Better handoffs         |
| `SubagentStop`  | Validate output quality                     | Quality gates           |

### Hook Status

⚠️ **Important**: While documented in VS Code materials and Alex adoption plans, hooks may still be in preview/experimental stage. Test before relying on them.

---

## Performance Considerations

### High Request Limit Impact

Your `chat.agent.maxRequests: 150` is **3x the default (50)**. This allows:
- Deep meditation sessions (30+ tool invocations)
- Complex brain QA workflows (31 phases)
- Multi-file refactoring operations

**Tradeoff**: Higher token consumption, longer sessions.

### Auto-Run Risk Assessment

Your configuration has extensive auto-approval:
- `chat.tools.autoRun: true`
- `chat.tools.fileSystem.autoApprove: true`
- Terminal commands auto-approved

**Mitigation**: Workspace-level protection for Master Alex (`alex.workspace.protectedMode: true`).

---

## Recommendations

### ✅ What's Optimized

Your configuration is excellent for Alex workflows:
- All core settings enabled ✅
- Experimental features aggressively adopted ✅
- High request limits for complex protocols ✅
- Memory & subagents enabled ✅

### ⚡ Potential Additions

Consider adding these if they become available:

```jsonc
{
  // If hooks go live
  "chat.hooks.enabled": true,

  // If ask questions stabilizes
  "chat.askQuestions.enabled": true,

  // Anthropic-specific (check your extension version for exact paths)
  "github.copilot.chat.anthropic.thinking.budgetTokens": 16000,
  "github.copilot.chat.anthropic.toolSearchTool.enabled": true,

  // Agent control indicator
  "chat.agentsControl.enabled": true,

  // Org instructions (if you work in enterprise)
  "github.copilot.chat.organizationInstructions.enabled": true
}
```

### 🔍 Verify Experimental Status

Some settings in your config may be:
- Preview features that could change
- Deprecated in favor of new names
- Platform-specific (some only work on macOS/Linux)

**Action**: Check VS Code release notes for 1.109+ to confirm current status of experimental flags.

---

## Quick Reference: Settings by Use Case

### For Meditation/Deep Thinking

```jsonc
{
  "github.copilot.chat.agent.thinkingTool": true,
  "chat.agent.maxRequests": 150,
  "github.copilot.chat.copilotMemory.enabled": true,
  "chat.hooks.enabled": true  // If available
}
```

### For Multi-Agent Workflows

```jsonc
{
  "chat.customAgentInSubagent.enabled": true,
  "github.copilot.chat.searchSubagent.enabled": true,
  "chat.requestQueuing.enabled": true
}
```

### For Skill/Instruction Development

```jsonc
{
  "chat.agentSkillsLocations": [".github/skills"],
  "chat.instructionsFilesLocations": { ".github/instructions": true },
  "chat.promptFilesLocations": { ".github/prompts": true },
  "chat.useAgentSkills": true,
  "chat.includeReferencedInstructions": true
}
```

### For Safety in Master Alex Workspace

```jsonc
{
  // Workspace-level (.vscode/settings.json in Alex_Plug_In)
  "alex.workspace.protectedMode": true,
  "alex.workspace.autoProtectMasterAlex": true
}
```

---

## Resources

- [VS Code Copilot Extensibility Overview](https://code.visualstudio.com/docs/copilot/copilot-extensibility-overview)
- [VS Code Chat Tools Documentation](https://code.visualstudio.com/docs/copilot/chat/chat-tools)
- [MCP Servers Guide](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
- [Agent Skills Standard](https://agentskills.io/)
- [Alex VSCODE-HEIR.md](./VSCODE-HEIR.md) — Platform-specific documentation
- [Alex VSCODE-1.109-ADOPTION-PLAN.md](../platforms/VSCODE-1.109-ADOPTION-PLAN.md) — Feature adoption roadmap

---

## Version History

| Version | Date       | Changes                                                                     |
| ------- | ---------- | --------------------------------------------------------------------------- |
| 1.0.0   | 2026-02-15 | Initial comprehensive guide based on VS Code 1.109+ and user settings audit |
