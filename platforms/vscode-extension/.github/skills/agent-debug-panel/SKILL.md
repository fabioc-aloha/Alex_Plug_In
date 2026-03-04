---
name: "agent-debug-panel"
description: "Debug skill/hook/agent loading issues using VS Code's Agent Debug Panel"
applyTo: "**/*debug*,**/*agent*,**/*skill*,**/*hook*,**/*instruction*"
---

# Agent Debug Panel

> When a skill doesn't load or a hook doesn't fire, stop guessing — open the panel.

## Quick Start

1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: **`Developer: Open Agent Debug Panel`**
3. Start a chat with `@alex` or any agent
4. Watch real-time events flow through the panel

## What the Panel Shows

| Tab / Section | What You See | Debug Use |
| ------------- | ------------ | --------- |
| **System Prompt Assembly** | Full prompt sent to LLM including instructions, skills, context | Verify your instruction/skill was included |
| **Tool Calls** | Every tool invocation with arguments and results | Trace why a tool wasn't called or failed |
| **Participant Resolution** | Which chat participant handled the request | Confirm `@alex` routed correctly |
| **Skill Loading** | Which SKILL.md files were loaded and why | Debug "why didn't my skill activate?" |
| **Instruction Matching** | Which .instructions.md files matched via `applyTo` | Verify glob patterns work for your files |
| **Hook Execution** | Pre/post tool-use hook firing order and results | Debug hook failures or ordering issues |
| **Agent Selection** | Which .agent.md was selected and why | Verify agent routing logic |

## Common Debugging Scenarios

### "My skill isn't being used"

1. Open Debug Panel → check **Skill Loading** section
2. Look for your skill name in the loaded list
3. If missing: check `applyTo` glob in SKILL.md frontmatter
4. If present but unused: the LLM chose not to use it — check skill description relevance

**Common causes:**
- `applyTo` glob doesn't match the active file
- Skill description doesn't match user's intent
- Another skill with higher relevance took priority
- Missing `chat.agentSkillsLocations` setting

### "My instruction isn't applying"

1. Open Debug Panel → check **Instruction Matching**
2. Verify the `.instructions.md` file appears in matched list
3. If missing: check `applyTo` pattern in YAML frontmatter

**Common causes:**
- `applyTo` glob doesn't match current file type
- File is in wrong directory (must be in `.github/instructions/`)
- YAML frontmatter syntax error (missing `---` delimiters)
- `chat.instructionsFilesLocations` not set to `{".github/instructions": true}`

### "My hook didn't fire"

1. Open Debug Panel → check **Hook Execution**
2. Look for your hook event (`preToolUse`, `postToolUse`)
3. Check if hook script returned an error

**Common causes:**
- `chat.hooks.enabled` not set to `true`
- Hook script has syntax error (test with `node --check script.js`)
- Hook JSON references wrong file path
- Hook `events` array doesn't include the trigger event

### "My agent isn't appearing"

1. Open Debug Panel → check **Agent Selection**
2. Verify `.agent.md` file is in `.github/agents/`
3. Check that `chat.useAgentsMdFile` is `true`

**Common causes:**
- File not named `*.agent.md`
- Not in `.github/agents/` directory
- `chat.useAgentsMdFile` or `chat.useNestedAgentsMdFiles` not enabled
- YAML frontmatter has syntax errors

### "System prompt is missing context"

1. Open Debug Panel → check **System Prompt Assembly**
2. Search for expected text from your instruction/skill
3. If missing: check the loading sections above

**Useful**: Copy the full system prompt to verify exactly what the LLM sees. Compare against what you expected.

## Settings Checklist

Run these checks before opening the debug panel:

| Setting | Required Value | Purpose |
| ------- | -------------- | ------- |
| `chat.agentSkillsLocations` | `[".github/skills"]` | Skills discovery |
| `chat.instructionsFilesLocations` | `{".github/instructions": true}` | Instructions loading |
| `chat.useAgentsMdFile` | `true` | Agent file detection |
| `chat.hooks.enabled` | `true` | Hook execution |
| `chat.plugins.enabled` | `true` | Plugin loading |
| `chat.useSkillAdherencePrompt` | `true` | Forces LLM to read SKILL.md |

## Workflow: Systematic Debug

```
1. Reproduce the issue in chat
2. Open Debug Panel (Developer: Open Agent Debug Panel)
3. Check loading → matching → execution → output
4. Identify the break point
5. Fix the root cause (glob, setting, syntax)
6. Reproduce again to verify
```

## Tips

- **Leave the panel open** during development — it updates in real-time
- **Filter by event type** when debugging specific issues
- **Compare working vs. non-working** — open two chats side-by-side
- **Check settings first** — 80% of "not loading" issues are missing settings
- The panel shows the **exact same data** VS Code uses internally — no guessing
