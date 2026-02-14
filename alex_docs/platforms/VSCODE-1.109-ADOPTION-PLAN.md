# VS Code 1.109 — Feature Adoption Plan

> Implementing new VS Code 1.109 capabilities in the Alex VS Code Heir

|             |                         |
| ----------- | ----------------------- |
| **Status**  | 🔄 Active Implementation |
| **VS Code** | 1.109 (January 2026)    |
| **Alex**    | v5.7.0 (released)       |
| **Updated** | 2026-02-13              |

---

## Overview

VS Code 1.109 introduces major agent platform capabilities that directly benefit Alex. This plan prioritizes adoption of each feature based on impact, effort, and dependencies.

### Feature Impact Matrix

| Feature                       | Impact | Effort | Priority | Timeline      |
| ----------------------------- | ------ | ------ | -------- | ------------- |
| **Agent Hooks**               | 🔴 High | Medium | P0       | v5.7.0        |
| **Copilot Memory**            | 🔴 High | Low    | P0       | v5.7.0        |
| **Subagents**                 | 🟡 Med  | Medium | P1       | v5.7.0        |
| **Plan Agent**                | 🟡 Med  | Low    | P1       | v5.7.0        |
| **Claude Compatibility**      | 🟢 Low  | Low    | P2       | v5.8.0        |
| **MCP Apps**                  | 🟡 Med  | High   | P2       | v5.8.0        |
| **Organization Instructions** | 🟢 Low  | Low    | P3       | Documentation |

---

## P0: Agent Hooks — Automated Cognitive Protocols

### What It Enables

Agent hooks let Alex run custom shell commands at key lifecycle events. This is the single most impactful feature because it enables **automated meditation, dream processing, and context injection** — things that currently require manual triggers.

### Available Hook Events

| Hook            | Trigger               | Alex Automation Opportunity             |
| --------------- | --------------------- | --------------------------------------- |
| `SessionStart`  | Agent session begins  | Load user profile, set working memory   |
| `SessionStop`   | Agent session ends    | Auto-save session notes, run meditation |
| `PreToolUse`    | Before tool execution | Security audit, permission checks       |
| `PostToolUse`   | After tool completes  | Quality gates, synapse updates          |
| `SubagentStart` | Subagent spawned      | Context injection for specialists       |
| `SubagentStop`  | Subagent completes    | Result aggregation, memory update       |

### Implementation Plan

#### 1. SessionStart Hook — Profile & Context Loading

**Purpose**: When any agent session starts, automatically load the user's cognitive context.

```json
// .github/hooks.json (proposed)
{
  "hooks": {
    "SessionStart": {
      "command": "node .github/muscles/hooks/session-start.js",
      "description": "Load Alex cognitive context",
      "timeout": 5000
    }
  }
}
```

**Script behavior**:
1. Read `user-profile.json` — inject preferences into session
2. Read active Pomodoro/goals — set P6 working memory slot
3. Check last meditation timestamp — suggest if overdue
4. Load recent synapses relevant to open files

**Effort**: Medium (new script + hook config)

#### 2. SessionStop Hook — Auto-Meditation

**Purpose**: When agent session ends, automatically save session insights.

**Script behavior**:
1. Summarize session activity (tools used, files modified)
2. Update synapse activation counts
3. Write session notes to episodic memory
4. Trigger mini-meditation if session > 30 minutes

**Effort**: Medium (new script + integration with meditation system)

#### 3. PostToolUse Hook — Synapse Enhancement

**Purpose**: After every tool use, check if a synapse connection should be strengthened.

**Script behavior**:
1. Log tool usage to session metrics
2. Update synapse activation patterns
3. Flag unexpected tool combinations for review

**Effort**: Low (lightweight logging script)

#### 4. PreToolUse Hook — Quality Gates

**Purpose**: Before destructive operations, add safety checks.

**Script behavior**:
1. Check if target file is in Master Alex `.github/` (safety imperative I1)
2. Verify no protected marker files would be modified
3. Log intent for observability

**Effort**: Low (safety check script)

### Configuration

```json
// .vscode/settings.json additions
{
  "chat.hooks.enabled": true
}
```

### Deliverables

- [ ] `.github/muscles/hooks/session-start.js` — Context loading
- [ ] `.github/muscles/hooks/session-stop.js` — Auto-meditation
- [ ] `.github/muscles/hooks/pre-tool-use.js` — Safety gates
- [ ] `.github/muscles/hooks/post-tool-use.js` — Synapse tracking
- [ ] `.github/hooks.json` — Hook configuration
- [ ] Documentation in VSCODE-HEIR.md

---

## P0: Copilot Memory — Cross-Session Persistence

### What It Enables

Copilot Memory stores information across chat sessions, eliminating the need for manual synapse maintenance for conversational context. This is a **platform-managed supplement** to Alex's file-based synapses.

### How It Maps to Alex Architecture

| Alex Memory Type     | Current Implementation   | With Copilot Memory                       |
| -------------------- | ------------------------ | ----------------------------------------- |
| **User Preferences** | `user-profile.json`      | Also stored in memory (auto-recalled)     |
| **Session Context**  | Lost between sessions    | Persisted automatically                   |
| **Learning Goals**   | `goals.json`             | Memory remembers progress across sessions |
| **Domain Knowledge** | Skills + DK files        | Memory supplements with conversational DK |
| **Synapses**         | `synapses.json` (manual) | Automatic relationship tracking in memory |

### Integration Strategy

Copilot Memory doesn't replace Alex's file-based memory — it **supplements** it:

```
Copilot Memory (automatic, conversational)
         +
Alex Files (structured, versioned)
         =
Richest AI assistant memory in any platform
```

### Implementation Plan

1. **Enable the setting** in recommended VS Code config:
   ```json
   {
     "github.copilot.chat.copilotMemory.enabled": true
   }
   ```

2. **Teach Alex to use memory** — Update `copilot-instructions.md`:
   - Instruct Alex to proactively save important context to memory
   - Define what belongs in memory vs. files vs. synapses
   - Add memory hygiene to meditation protocol

3. **Memory Categories** — Define what Alex stores:
   | Category                 | Store In         | Why                       |
   | ------------------------ | ---------------- | ------------------------- |
   | User name/preferences    | Memory + Profile | Quick recall + structured |
   | Session decisions        | Memory           | Automatic, ephemeral      |
   | Architecture patterns    | Files            | Versioned, shared         |
   | Learning progress        | Memory + Goals   | Automatic tracking        |
   | Project-specific context | Memory           | No file overhead needed   |

### Deliverables

- [ ] Enable `copilotMemory` in settings recommendations
- [ ] Update `copilot-instructions.md` with memory guidelines
- [ ] Update meditation protocol to review/curate memory
- [ ] Document memory vs. files vs. synapses strategy

---

## P1: Subagents — Parallel Specialist Execution

### What It Enables

Subagents run in parallel with isolated context windows. Alex can delegate to Researcher, Builder, and Validator **simultaneously** rather than sequentially.

### Current State vs New

```
Current (sequential):
  Alex → (pause) → Researcher → (pause) → Builder → (pause) → Validator

With Subagents (parallel):
  Alex ──┬── Researcher ──┐
         ├── Builder ──────┤──► Alex aggregates results
         └── Validator ────┘
```

### Implementation Plan

1. **Update agent frontmatter** — Configure subagent permissions:
   ```markdown
   ---
   name: Alex
   agents: ['Alex-Researcher', 'Alex-Builder', 'Alex-Validator']
   ---
   ```

2. **Update specialist agents** — Add subagent-specific frontmatter:
   ```markdown
   ---
   name: Alex-Researcher
   user-invokable: true
   disable-model-invocation: false
   ---
   ```

3. **Configure subagent settings**:
   ```json
   {
     "github.copilot.chat.searchSubagent.enabled": true,
     "chat.customAgentInSubagent.enabled": true
   }
   ```

4. **Leverage SubagentStart/Stop hooks**:
   - `SubagentStart`: Inject relevant context for the specialist
   - `SubagentStop`: Aggregate results, update synapses

### Deliverables

- [ ] Update `.github/agents/*.agent.md` with subagent frontmatter
- [ ] Configure subagent-related settings
- [ ] Integrate SubagentStart/Stop hooks
- [ ] Test parallel execution with Researcher + Builder + Validator

---

## P1: Plan Agent — Structured Implementation

### What It Enables

The `/plan` command triggers a 4-phase workflow (Discovery → Alignment → Design → Refinement) that's ideal for complex Alex tasks like architecture changes, feature development, and heir migrations.

### Alex-Specific Applications

| Plan Agent Phase | Alex Application                                       |
| ---------------- | ------------------------------------------------------ |
| **Discovery**    | Skill Selection Optimization (survey available skills) |
| **Alignment**    | Ask clarifying questions (working memory assignment)   |
| **Design**       | Draft implementation plan with file locations          |
| **Refinement**   | Add verification criteria (dream/meditation checks)    |

### Implementation Plan

1. **Document Plan Agent in workflows** — Add to relevant `.prompt.md` files
2. **Create Alex-specific plan templates** — For common complex tasks:
   - Architecture refactoring plans
   - Heir migration plans
   - Skill development plans
   - Release preparation plans
3. **Integrate with SSO** — Plan Agent's Discovery phase aligns with SSO Phase 1

### Deliverables

- [ ] Document `/plan` usage in Alex workflows
- [ ] Create plan templates for common tasks
- [ ] Update SSO instructions to reference Plan Agent

---

## P2: Claude Compatibility — Cross-Platform Sync

### What It Enables

VS Code now reads Claude configuration files (`CLAUDE.md`, `.claude/agents/`, `.claude/skills/`). This means when the Claude Code heir is built, VS Code can already understand its configuration.

### Strategic Value

```
Write once, deploy twice:

.github/instructions/  ←→  .claude/rules/
.github/agents/        ←→  .claude/agents/
.github/skills/        ←→  .claude/skills/
copilot-instructions.md ←→ CLAUDE.md
```

### Implementation Plan

1. **Generate Claude-compatible files** — Add to sync/export:
   - `CLAUDE.md` ← Generated from `copilot-instructions.md`
   - `.claude/rules/` ← Symlinks/copies of `.github/instructions/`
   - `.claude/agents/` ← Adapted from `.github/agents/`
   - `.claude/skills/` ← Symlinks/copies of `.github/skills/`

2. **Update sync-architecture.js** — Add Claude format generation

3. **Validate bidirectional reading** — VS Code should load both formats

### Deliverables

- [ ] Claude file generation in sync script
- [ ] Test VS Code reading both `.github/` and `.claude/` formats
- [ ] Update CLAUDE-CODE-HEIR.md with compatibility details

---

## P2: MCP Apps — Rich Interactive UI

### What It Enables

MCP servers can now provide rich interactive UI elements in chat responses. This could enable Alex to present:
- Interactive architecture diagrams
- Skill selection interfaces
- Goal tracking dashboards
- Session progress visualizations

### Implementation Plan

1. **Evaluate MCP Apps API** — Understand what UI elements are possible
2. **Prototype health dashboard** — Alex architecture status as MCP App
3. **Prototype skill browser** — Interactive skill catalog in chat
4. **Assess effort vs value** — MCP Apps may be high effort

### Deliverables

- [ ] MCP Apps API evaluation
- [ ] Health dashboard prototype (if feasible)
- [ ] Decision: build MCP Apps or defer

---

## P3: Organization Instructions

### What It Enables

Enterprise-wide custom instructions that apply to all users. For Alex, this means organizations deploying Alex can set baseline behaviors.

### Implementation Plan

1. **Document for enterprise users** — How to set org-level Alex instructions
2. **Create template** — Sample org instructions for Alex deployment
3. **No code changes needed** — This is documentation and template work

### Deliverables

- [ ] Enterprise deployment guide section
- [ ] Organization instruction template

---

## Implementation Roadmap

### v5.7.0 (Target: March 2026)

**Theme**: Automated cognitive protocols

| Feature          | Deliverable                                     | Effort     |
| ---------------- | ----------------------------------------------- | ---------- |
| Agent Hooks      | 4 hook scripts + config                         | 2 days     |
| Copilot Memory   | Settings + instruction updates + meditation     | 1 day      |
| Subagents        | Agent frontmatter + settings + hook integration | 1 day      |
| Plan Agent       | Documentation + templates                       | 0.5 day    |
| Settings Update  | New recommended settings for 1.109              | 0.5 day    |
| **Total Effort** |                                                 | **5 days** |

### v5.8.0 (Target: April 2026)

**Theme**: Cross-platform and rich UX

| Feature                | Deliverable                    | Effort       |
| ---------------------- | ------------------------------ | ------------ |
| Claude Compatibility   | File generation in sync script | 1 day        |
| MCP Apps (if feasible) | Health dashboard prototype     | 3 days       |
| Org Instructions       | Documentation + templates      | 0.5 day      |
| **Total Effort**       |                                | **4.5 days** |

---

## Settings Summary

### New Settings for 1.109 Adoption

```json
{
  // Agent Hooks
  "chat.hooks.enabled": true,

  // Copilot Memory
  "github.copilot.chat.copilotMemory.enabled": true,

  // Subagents
  "github.copilot.chat.searchSubagent.enabled": true,
  "chat.customAgentInSubagent.enabled": true,

  // Request Management
  "chat.requestQueuing.enabled": true,
  "chat.agentsControl.enabled": true
}
```

### Updated Recommended Full Config

```json
{
  // Core Alex (unchanged)
  "chat.agent.enabled": true,
  "chat.agentSkillsLocations": [".github/skills"],
  "chat.useAgentsMdFile": true,
  "chat.mcp.gallery.enabled": true,

  // Extended Thinking (unchanged)
  "claude-opus-4-*.extendedThinkingEnabled": true,
  "claude-opus-4-*.thinkingBudget": 16384,

  // NEW: 1.109 Features
  "chat.hooks.enabled": true,
  "github.copilot.chat.copilotMemory.enabled": true,
  "github.copilot.chat.searchSubagent.enabled": true,
  "chat.customAgentInSubagent.enabled": true,
  "chat.requestQueuing.enabled": true,
  "chat.agentsControl.enabled": true
}
```

---

## Success Metrics

| Metric                     | Measurement                               | Target      |
| -------------------------- | ----------------------------------------- | ----------- |
| **Auto-meditation rate**   | % of sessions with SessionStop meditation | > 50%       |
| **Context loading time**   | SessionStart hook execution time          | < 3 seconds |
| **Subagent utilization**   | % of complex tasks using subagents        | > 30%       |
| **Memory recall accuracy** | Copilot Memory recalls relevant context   | > 80%       |
| **Plan Agent usage**       | % of architecture tasks using /plan       | > 40%       |
| **Hook reliability**       | % of hooks executing without error        | > 99%       |

---

## Related Documentation

| Document                                                     | Purpose                   |
| ------------------------------------------------------------ | ------------------------- |
| [VSCODE-HEIR.md](./VSCODE-HEIR.md)                           | VS Code heir capabilities |
| [MASTER-HEIR-ARCHITECTURE.md](./MASTER-HEIR-ARCHITECTURE.md) | Overall heir architecture |

### VS Code 1.109 References

| Resource                    | URL                                                                      |
| --------------------------- | ------------------------------------------------------------------------ |
| VS Code 1.109 Release Notes | <https://code.visualstudio.com/updates/v1_109>                           |
| Agent Hooks Documentation   | <https://code.visualstudio.com/docs/copilot/customization/hooks>         |
| Subagent Documentation      | <https://code.visualstudio.com/docs/copilot/customization/custom-agents> |
| Copilot Memory              | <https://code.visualstudio.com/docs/copilot/copilot-settings>            |

---

*VS Code 1.109 Adoption — Transforming Alex from manual-trigger to automated cognitive architecture*
