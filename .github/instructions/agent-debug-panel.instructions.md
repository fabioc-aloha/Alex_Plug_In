---
description: "Debug skill/hook/agent loading issues using VS Code's Agent Debug Panel"
application: "When diagnosing why skills don't activate or hooks don't fire"
applyTo: "**/*debug*,**/*agent*,**/*skill*,**/*hook*"
---

# Agent Debug Panel

## Quick Access

**Open**: `Ctrl+Shift+P` → `Developer: Open Agent Debug Panel`

## Debugging Checklist

| Issue | Panel Section | What to Check |
|-------|---------------|---------------|
| Skill not used | Skill Loading | Is skill in loaded list? Check `applyTo` glob |
| Instruction missing | Instruction Matching | Does glob match current file? |
| Hook not firing | Hook Execution | Is `chat.hooks.enabled` true? |
| Agent not found | Agent Selection | Is file in `.github/agents/`? |

## Required Settings

```json
{
  "chat.agentSkillsLocations": [".github/skills"],
  "chat.instructionsFilesLocations": { ".github/instructions": true },
  "chat.useAgentsMdFile": true,
  "chat.hooks.enabled": true
}
```

See `.github/skills/agent-debug-panel/SKILL.md` for full procedures.
