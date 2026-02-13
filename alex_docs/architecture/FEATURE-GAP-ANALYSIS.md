# VS Code .github/ Feature Gap Analysis

> Analysis of Alex's utilization of VS Code and GitHub Copilot customization features.

|                  |                           |
| ---------------- | ------------------------- |
| **Generated**    | 2026-02-13                |
| **VS Code Docs** | v1.109+ (Feb 2026)        |
| **Status**       | ✅ Implementation Complete |

---

## Summary

| Feature Category    | Available | Alex Uses | Coverage |
| ------------------- | --------- | --------- | -------- |
| Custom Agents       | ✅         | ✅         | 100%     |
| Agent Skills        | ✅         | ✅         | 100%     |
| Custom Instructions | ✅         | ✅         | 100%     |
| Prompt Files        | ✅         | ✅         | 100%     |
| MCP Servers         | ✅         | ✅         | 90%      |
| Hooks               | ⛔         | N/A       | —        |
| Claude Format       | ⛔         | N/A       | —        |

**Overall Assessment**: Alex is using .github/ features at **100% coverage** for all applicable VS Code GitHub Copilot features. Hooks and Claude Format are Claude Code features (not VS Code), so they don't apply.

---

## LLM-First Content Principles

Based on validation testing, these formats work best for LLM parsing:

| Format                | LLM-Friendly | Rationale                                                         |
| --------------------- | ------------ | ----------------------------------------------------------------- |
| **Mermaid diagrams**  | ✅ Excellent  | Structured DSL syntax — LLMs parse the code, not the rendering    |
| **Tables**            | ✅ Excellent  | Clear row/column relationships                                    |
| **Bullet lists**      | ✅ Good       | Sequential, structured                                            |
| **Emojis**            | ✅ Good       | Semantic tokens (🔨=build, 🔍=search) — meaningful in training data |
| **ASCII art**         | ❌ Poor       | Requires spatial/visual reasoning LLMs struggle with              |
| **Box drawing chars** | ❌ Poor       | Position-dependent interpretation                                 |

**Validated by brain-qa Phase 20** — ASCII diagrams flagged as warnings, Mermaid passes.

---

## Feature-by-Feature Analysis

### 1. Custom Agents ✅ FULLY UTILIZED

**Location**: `.github/agents/`

| Feature                     | VS Code Support | Alex Implementation                   | Status |
| --------------------------- | --------------- | ------------------------------------- | ------ |
| `.agent.md` files           | ✅               | 6 agents                              | ✅      |
| YAML frontmatter            | ✅               | All agents have it                    | ✅      |
| `name` property             | ✅               | All agents                            | ✅      |
| `description` property      | ✅               | All agents                            | ✅      |
| `tools` array               | ✅               | All agents                            | ✅      |
| `model` specification       | ✅               | Researcher, Builder, Validator, Azure | ✅      |
| `handoffs` array            | ✅               | All major agents                      | ✅      |
| `handoffs.send` auto-submit | ✅               | Used appropriately                    | ✅      |
| `handoffs.model`            | ✅               | Not used                              | 🔶      |
| `commands` slash commands   | ✅               | Main Alex agent                       | ✅      |
| `user-invokable`            | ✅               | Not explicitly set                    | 🔶      |
| `disable-model-invocation`  | ✅               | Not used                              | 🔶      |
| `agents` (subagent list)    | ✅               | Main Alex agent                       | ✅      |
| Organization-level agents   | ✅               | N/A (not org)                         | —      |

**Remaining Opportunities** (low priority):
- Consider `handoffs.model` for CPU-intensive handoffs (e.g., Opus for research)

---

### 2. Agent Skills ✅ FULLY UTILIZED

**Location**: `.github/skills/`

| Feature                            | VS Code Support | Alex Implementation    | Status |
| ---------------------------------- | --------------- | ---------------------- | ------ |
| `SKILL.md` files                   | ✅               | All skills             | ✅      |
| YAML frontmatter                   | ✅               | All skills have it     | ✅      |
| `name` property                    | Required        | All skills             | ✅      |
| `description` property             | Required        | All skills             | ✅      |
| `argument-hint`                    | Optional        | Not used               | 🔶      |
| `user-invokable`                   | Optional        | Internal skills hidden | ✅      |
| `disable-model-invocation`         | Optional        | Not used               | 🔶      |
| Resource files (scripts, examples) | ✅               | Some skills have them  | ✅      |
| Progressive loading                | Automatic       | Working                | ✅      |
| Slash command invocation           | ✅               | Working                | ✅      |

**Internal Skills Hidden** (user-invokable: false):
- `skill-activation` — Metacognitive skill discovery
- `prompt-activation` — Episodic memory retrieval
- `awareness` — Self-correction patterns
- `anti-hallucination` — Confabulation prevention
- `cognitive-load` — Chunking and scaffolding
- `frustration-recognition` — User empathy
- `proactive-assistance` — Anticipate needs

**Remaining Opportunities** (low priority):
- Add `argument-hint` to skills that accept parameters

---

### 3. Custom Instructions ✅ FULLY UTILIZED

**Location**: `.github/instructions/`

| Feature                   | VS Code Support | Alex Implementation    | Status |
| ------------------------- | --------------- | ---------------------- | ------ |
| `copilot-instructions.md` | ✅               | Root file exists       | ✅      |
| `*.instructions.md` files | ✅               | 28 instruction files   | ✅      |
| YAML frontmatter          | Optional        | Most files have it     | ✅      |
| `applyTo` glob patterns   | ✅               | File-type instructions | ✅      |
| `excludeAgent`            | ✅               | Safety instructions    | ✅      |
| Path-specific activation  | ✅               | Via `applyTo`          | ✅      |
| Auto-loading              | ✅               | Working                | ✅      |

**Instructions with `applyTo` Patterns**:
| Instruction               | Pattern                                         |
| ------------------------- | ----------------------------------------------- |
| `code-review-guidelines`  | `**/*.{ts,js,tsx,jsx,py,ps1,cs,java,go,rs,rb}`  |
| `release-management`      | `**/*{CHANGELOG,package,version}*,**/*.vsix`    |
| `brand-asset-management`  | `**/assets/**,**/*.svg,**/*.png,**/*.ico`       |
| `dependency-management`   | `**/*package*.json,**/requirements*.txt`        |
| `technical-debt-tracking` | `**/*TODO*,**/*FIXME*,**/*debt*`                |
| `dream-state-automation`  | `**/*dream*,**/*maintenance*,**/*synapse*`      |
| `embedded-synapse`        | `**/*synapse*,**/*connection*,**/*pattern*`     |
| `protocol-triggers`       | `**/*trigger*,**/*protocol*,**/*consolidation*` |

**Instructions with `excludeAgent: coding-agent`**:
- `alex-core.instructions.md` — Core architecture, memory safety
- `heir-skill-promotion.instructions.md` — Kill switch awareness

---

### 4. Prompt Files ✅ FULLY UTILIZED

**Location**: `.github/prompts/`

| Feature                    | VS Code Support | Alex Implementation | Status |
| -------------------------- | --------------- | ------------------- | ------ |
| `*.prompt.md` files        | ✅               | 17 prompt files     | ✅      |
| Slash command registration | ✅               | Working             | ✅      |
| YAML frontmatter           | ✅               | All prompts have it | ✅      |
| `description`              | ✅               | All prompts         | ✅      |
| Variable templates         | ✅               | Some prompts        | ✅      |
| `agent` reference          | ✅               | Not used            | 🔶      |
| `tools` override           | ✅               | Not used            | 🔶      |

**Recommendations**:
- Consider adding `agent: Researcher` to `/gapanalysis` prompt
- Consider `tools` array in prompts for restricted workflows

---

### 5. MCP Servers ✅ MOSTLY UTILIZED

| Feature                    | VS Code Support | Alex Implementation | Status |
| -------------------------- | --------------- | ------------------- | ------ |
| Azure MCP                  | ✅               | Configured          | ✅      |
| M365 MCP                   | ✅               | Configured          | ✅      |
| Bicep MCP                  | ✅               | Configured          | ✅      |
| GitKraken MCP              | ✅               | Available           | ✅      |
| Custom MCP servers         | ✅               | Not implemented     | 🔶      |
| Agent `mcp-servers` config | ✅               | Not used            | 🔶      |

**Recommendations**:
- Consider MCP server configuration in agent frontmatter for specialized agents
- Explore custom MCP server for Alex-specific tools

---

### 6. Hooks ⛔ NOT APPLICABLE

**Research Finding**: Hooks are a **Claude Code feature**, not a VS Code GitHub Copilot feature.

> **VS Code GitHub Copilot does NOT support hooks**. The hook system is specific to Claude Code (Anthropic's CLI/IDE tooling).

**Claude Code Hook Events** (for reference only):

| Hook Event         | Purpose                              | Platform    |
| ------------------ | ------------------------------------ | ----------- |
| SessionStart       | Run when session begins/resumes      | Claude Code |
| UserPromptSubmit   | Run before prompt processing         | Claude Code |
| PreToolUse         | Run before tool execution            | Claude Code |
| PostToolUse        | Run after tool completes             | Claude Code |
| PostToolUseFailure | Run after tool fails                 | Claude Code |
| Stop               | Run when agent finishes              | Claude Code |
| SubagentStart/Stop | Run on subagent spawn/completion     | Claude Code |
| Notification       | Run on permission/idle notifications | Claude Code |

**Claude Code Hook Configuration** (not applicable to VS Code):
```json
{
  "hooks": {
    "PreToolUse": [{ "matcher": "Bash", "hooks": [{ "type": "command", "command": "./validate.sh" }] }],
    "PostToolUse": [{ "matcher": "Write|Edit", "hooks": [{ "type": "command", "command": "./lint.sh" }] }]
  }
}
```

**Conclusion**: Alex targets **VS Code GitHub Copilot**, which uses different extensibility:
- **Language Model Tools** — Custom tools invoked by agent mode
- **MCP Servers** — Model Context Protocol tools
- **Chat Participants** — @-mentioned assistants
- **Language Model API** — Direct LLM access in extensions

If Alex were ported to Claude Code, hooks would provide automation capabilities.

---

### 7. Claude Format ⛔ NOT APPLICABLE

**Research Finding**: `.claude/` directory structure is specific to **Claude Code**, not VS Code GitHub Copilot.

> **VS Code uses `.github/`** for Copilot customization. **Claude Code uses `.claude/`** for its memory and configuration.

**Claude Code Memory Architecture** (for reference only):

| Location                    | Purpose                          | Scope      |
| --------------------------- | -------------------------------- | ---------- |
| `CLAUDE.md` (root)          | Project instructions             | Team       |
| `.claude/CLAUDE.md`         | Alternative project instructions | Team       |
| `.claude/rules/*.md`        | Modular topic-specific rules     | Team       |
| `CLAUDE.local.md`           | Personal project preferences     | Individual |
| `~/.claude/CLAUDE.md`       | User-level preferences           | User       |
| `~/.claude/rules/*.md`      | User-level rules                 | User       |
| `~/.claude/projects/<proj>` | Auto-memory per project          | User       |

**Claude Code Rule Example** (paths frontmatter):
```yaml
---
paths:
  - "src/**/*.ts"
  - "lib/**/*.ts"
---
# TypeScript Rules
- Use strict typing
- Prefer interfaces over types
```

**VS Code vs Claude Code Comparison**:

| Feature        | VS Code (`.github/`)          | Claude Code (`.claude/`)     |
| -------------- | ----------------------------- | ---------------------------- |
| Instructions   | `copilot-instructions.md`     | `CLAUDE.md`                  |
| Per-file rules | `applyTo` in frontmatter      | `paths` in rules frontmatter |
| Agents         | `.github/agents/*.agent.md`   | `.claude/agents/*.md`        |
| Skills         | `.github/skills/*/SKILL.md`   | Not directly analogous       |
| Prompts        | `.github/prompts/*.prompt.md` | Not directly analogous       |
| MCP support    | Yes (settings.json)           | Yes (settings.json)          |
| Hooks          | No                            | Yes (comprehensive)          |
| Auto-memory    | No                            | Yes (per-project learning)   |

**Conclusion**: Alex is correctly built for **VS Code GitHub Copilot**. The `.github/` architecture is the appropriate choice. Creating `.claude/` files would only be relevant if:
1. Alex were ported to Claude Code CLI
2. Users wanted cross-platform compatibility
3. A future VS Code integration bridged both formats

**Current Status**: Not applicable — Alex uses VS Code's native `.github/` structure.

---

## Priority Action Items

### ✅ Completed (2026-02-13)

1. **~~Add YAML frontmatter to all skills~~** ✅
   - All skills now have `name` and `description`
   - 16 skills updated in this session

2. **~~Audit instruction files for `applyTo` patterns~~** ✅
   - 8 instruction files now have file-type specific patterns
   - Files target: code files, dependencies, assets, release artifacts

3. **~~Add `excludeAgent` for sensitive instructions~~** ✅
   - `alex-core.instructions.md` excludes `coding-agent`
   - `heir-skill-promotion.instructions.md` excludes `coding-agent`

4. **~~Add `agents` property to main Alex agent~~** ✅
   - `agents: ['Researcher', 'Builder', 'Validator', 'Azure', 'M365']`

5. **~~Mark internal skills with `user-invokable: false`~~** ✅
   - 7 metacognitive skills hidden from user invocation

### Low Priority (Future Opportunities)

6. **~~Explore hooks for cognitive automation~~** ⛔ **NOT APPLICABLE**
   - Research confirmed: Hooks are Claude Code feature, not VS Code
   - VS Code uses Language Model Tools, MCP Servers, Chat Participants
   - Would only apply if Alex were ported to Claude Code

7. **~~Consider Claude format for multi-tool compatibility~~** ⛔ **NOT APPLICABLE**
   - Research confirmed: `.claude/` is Claude Code structure
   - VS Code correctly uses `.github/` structure
   - Would only apply for cross-platform Claude Code compatibility

---

## Compliance Checklist

Use this for regular audits:

- [x] All agents have YAML frontmatter with `name`, `description`, `tools`
- [x] All skills have YAML frontmatter with `name`, `description`
- [x] Internal skills have `user-invokable: false`
- [x] Instructions with file-type specificity have `applyTo` patterns
- [x] Sensitive instructions have `excludeAgent: coding-agent`
- [x] Major agents have explicit `handoffs` defined
- [x] Model-specific agents specify `model` property
- [x] Main agent has explicit `agents` subagent list

**Last Validated**: 2026-02-13 via `brain-qa.ps1 -Phase 16,17,18,19`

---

## Could Alex Live in Claude Code?

A feature-by-feature analysis of porting Alex from VS Code GitHub Copilot to Claude Code.

### Platform Comparison Matrix

| Alex Feature            | VS Code Implementation                   | Claude Code Equivalent       | Portability             |
| ----------------------- | ---------------------------------------- | ---------------------------- | ----------------------- |
| **Core Instructions**   | `copilot-instructions.md`                | `CLAUDE.md`                  | ✅ Direct mapping        |
| **Custom Agents**       | `.github/agents/*.agent.md`              | `.claude/agents/*.md`        | ✅ Similar structure     |
| **Skills**              | `.github/skills/*/SKILL.md`              | `.claude/skills/*.md`        | 🔶 Different schema      |
| **Prompt Files**        | `.github/prompts/*.prompt.md`            | No direct equivalent         | ⚠️ Would need adaptation |
| **Instruction Files**   | `.github/instructions/*.instructions.md` | `.claude/rules/*.md`         | 🔶 Different frontmatter |
| **Synapses (Brain)**    | `synapses.json` per skill                | No equivalent                | ❌ Custom concept        |
| **MCP Servers**         | VS Code settings.json                    | Claude Code settings.json    | ✅ Same MCP protocol     |
| **File-specific Rules** | `applyTo` glob patterns                  | `paths` frontmatter          | ✅ Similar concept       |
| **Handoffs**            | Agent `handoffs` array                   | Task tool + subagents        | 🔶 Different model       |
| **Extension Commands**  | VS Code extension API                    | CLI commands, `/` slash cmds | ⚠️ Platform-specific     |
| **Hooks**               | Not supported                            | Full lifecycle hooks         | ✅ Gain capability       |
| **Auto-Memory**         | Not supported                            | Per-project learning         | ✅ Gain capability       |
| **IDE Integration**     | Full VS Code API access                  | Terminal + file tools        | ⚠️ Less IDE integration  |

### Feature Mapping: What Alex Uses Today

| Alex Component   | Count            | Claude Code Migration Path                           |
| ---------------- | ---------------- | ---------------------------------------------------- |
| **Agents**       | 6                | `.claude/agents/*.md` with frontmatter               |
| **Skills**       | 109              | `.claude/skills/*.md` — would need schema adaptation |
| **Instructions** | 28               | `.claude/rules/*.md` with `paths` frontmatter        |
| **Prompts**      | 17               | Could become skills or inline in CLAUDE.md           |
| **Synapses**     | ~200 connections | No native equivalent — would lose connection mapping |
| **Muscles**      | 13 scripts       | Hooks could trigger them automatically               |

### What Alex Would GAIN in Claude Code

| Capability                | Description                                       | Alex Benefit                                          |
| ------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| **Lifecycle Hooks**       | SessionStart, PreToolUse, PostToolUse, Stop       | Auto-meditation, synapse validation, post-edit checks |
| **Auto-Memory**           | Claude learns and saves patterns per project      | Native episodic memory without custom synapses        |
| **Agent Teams**           | Multi-agent collaboration with TeammateIdle hooks | Researcher → Builder → Validator pipeline             |
| **Background Hooks**      | Async tasks during responses                      | Run tests while coding continues                      |
| **Permission Hooks**      | PermissionRequest automation                      | Auto-approve safe operations                          |
| **Task Completion Gates** | TaskCompleted hooks                               | Enforce quality gates before marking done             |

### What Alex Would LOSE in Claude Code

| Capability                   | Description                                 | Impact                                 |
| ---------------------------- | ------------------------------------------- | -------------------------------------- |
| **VS Code Extension API**    | Full IDE integration, commands, UI          | ⚠️ High — lose extension commands       |
| **Copilot Chat Integration** | @Alex in VS Code sidebar                    | ⚠️ High — different UX                  |
| **Skill Discovery UI**       | `/skill` command list, progressive loading  | 🔶 Medium — less discoverability        |
| **Synapse Network**          | Custom connection mapping between knowledge | ❌ Critical — core architecture feature |
| **Agent Handoffs**           | Explicit inter-agent routing                | 🔶 Medium — subagents work differently  |
| **Model Selection**          | Per-agent model override                    | ✅ Available in Claude Code agents      |

### Migration Complexity Assessment

| Difficulty       | Components                             | Effort                                |
| ---------------- | -------------------------------------- | ------------------------------------- |
| **Easy**         | copilot-instructions.md → CLAUDE.md    | < 1 hour                              |
| **Easy**         | Instructions → Rules with paths        | ~2 hours                              |
| **Medium**       | Agents → Claude agents format          | ~4 hours                              |
| **Medium**       | Skills → Claude skills (subset)        | ~1 day                                |
| **Hard**         | Prompts → Skills or CLAUDE.md sections | ~1 day                                |
| **Very Hard**    | Synapse network                        | No direct path — rethink architecture |
| **Not Portable** | Extension commands, VS Code APIs       | Would need new approaches             |

### Verdict: Should Alex Move to Claude Code?

| Factor              | VS Code                  | Claude Code                       | Winner      |
| ------------------- | ------------------------ | --------------------------------- | ----------- |
| **Memory/Learning** | Manual synapses          | Auto-memory                       | Claude Code |
| **Automation**      | None                     | Rich hooks                        | Claude Code |
| **IDE Integration** | Excellent                | Terminal-focused                  | VS Code     |
| **Discoverability** | Chat sidebar, @ mentions | CLI commands                      | VS Code     |
| **Portability**     | VS Code only             | Terminal, VS Code, JetBrains, Web | Claude Code |
| **Synapse Network** | Full support             | Not supported                     | VS Code     |
| **User Experience** | Visual, integrated       | Developer-focused                 | VS Code     |

### Recommendation

**Hybrid Approach**: Don't choose one platform — support both.

1. **Keep Master Alex in VS Code** — Primary development environment with full IDE integration
2. **Create Claude Code Heir** — Port core instructions and rules to `.claude/` format
3. **Share via Git** — Both formats can coexist in same repo
4. **Use Hooks in Claude** — Gain automation capabilities when using Claude Code
5. **Maintain Synapse Network** — Keep in VS Code; Claude Code would use auto-memory instead

**Coexistence Structure**:
```
project/
├── .github/           # VS Code GitHub Copilot
│   ├── agents/
│   ├── skills/
│   ├── instructions/
│   └── prompts/
├── .claude/           # Claude Code
│   ├── CLAUDE.md      # (generated from copilot-instructions.md)
│   ├── agents/
│   ├── rules/
│   └── settings.json  # Hooks configuration
└── CLAUDE.md          # Root project instructions
```

---

## Related Documentation

- [VS Code Custom Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [VS Code Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [GitHub Copilot Customization](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [Agent Catalog](AGENT-CATALOG.md)

---

## Research Notes (2026-02-13)

### VS Code GitHub Copilot Extensibility

Research confirmed VS Code's AI extensibility options (Feb 2026):

1. **Language Model Tools** — Extend agent mode with specialized capabilities
2. **MCP Servers** — Model Context Protocol for external service integration
3. **Chat Participants** — @-mentioned assistants with full conversation control
4. **Language Model API** — Direct programmatic LLM access in extensions

**No hooks support** — VS Code doesn't have pre-chat, post-chat, pre-edit, post-edit hooks.

### Claude Code Hooks (Not VS Code)

Claude Code (Anthropic's CLI tool) has comprehensive hooks:
- `SessionStart`, `SessionEnd` — Session lifecycle
- `UserPromptSubmit` — Pre-prompt processing
- `PreToolUse`, `PostToolUse`, `PostToolUseFailure` — Tool execution lifecycle
- `Stop`, `SubagentStart`, `SubagentStop` — Agent completion
- `Notification`, `PermissionRequest` — UI events
- Hooks defined in `.claude/settings.json` or `~/.claude/settings.json`

### Claude Code Memory (Not VS Code)

Claude Code uses different memory architecture:
- `CLAUDE.md` — Project instructions (like `copilot-instructions.md`)
- `.claude/rules/*.md` — Modular rules with `paths` frontmatter
- Auto-memory at `~/.claude/projects/<proj>/memory/`
- Maximum 200 lines loaded from `MEMORY.md` entrypoint

**Sources**:
- https://code.visualstudio.com/api/extension-guides/ai/ai-extensibility-overview
- https://code.visualstudio.com/api/extension-guides/ai/chat
- https://code.visualstudio.com/api/extension-guides/ai/tools
- https://code.claude.com/docs/en/hooks
- https://code.claude.com/docs/en/memory

---

*Feature Gap Analysis — Alex Cognitive Architecture, February 2026*
