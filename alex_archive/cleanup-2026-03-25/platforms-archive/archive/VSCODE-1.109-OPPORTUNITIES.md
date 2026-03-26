# VS Code 1.109 Opportunities for Alex

> **Analysis Date:** 2026-02-04
> **VS Code Version:** January 2026 (1.109)
> **Alex Version:** 4.2.4

---

## 🎯 Executive Summary

VS Code 1.109 introduces significant agentic AI capabilities that align directly with Alex's cognitive architecture. This release represents the most impactful update for our extension since the introduction of Language Model Tools.

**High-Priority Opportunities:**
1. Agent Skills contribution point (GA) - Register Alex skills natively
2. Chat prompt files API - Dynamically provide prompts/instructions/agents
3. Anthropic model enhancements - Extended thinking, interleaved reasoning
4. Agent orchestration patterns - Multi-agent workflows with subagents

---

## ✅ Immediately Actionable

### 1. Agent Skills Contribution Point (GA)

**What:** Extension can now register skills via `chatSkills` contribution in `package.json`.

**Impact:** HIGH - This is exactly what Alex does! We can integrate our 65 skills directly.

**Implementation:**
```json
{
  "contributes": {
    "chatSkills": [
      { "path": "./.github/skills/debugging-patterns" },
      { "path": "./.github/skills/testing-strategies" },
      { "path": "./.github/skills/api-design" }
      // ... all 65 skills
    ]
  }
}
```

**Considerations:**
- Need to verify skill folder structure compatibility (we use `SKILL.md` + `synapses.json`)
- VS Code may have different expectations for skill format
- Could conflict with our existing skill loading mechanism
- **Recommendation:** Investigate compatibility before implementing

---

### 2. Anthropic Model Improvements

**What:**
- Extended thinking with interleaved reasoning between tool calls
- Configurable thinking budget (`github.copilot.chat.anthropic.thinking.budgetTokens`)
- Tool search tool for better tool discovery
- Context editing to manage long conversations

**Impact:** HIGH - We already use Claude Opus 4.5 for Master Alex.

**Action Items:**
- [ ] Document recommended settings in copilot-instructions.md
- [ ] Update model awareness section to reference new capabilities
- [ ] Add recommended setting notes in USER-MANUAL.md

**Recommended Settings:**
```json
{
  "github.copilot.chat.anthropic.thinking.budgetTokens": 16000,
  "github.copilot.chat.anthropic.toolSearchTool.enabled": true,
  "github.copilot.chat.anthropic.contextEditing.enabled": true
}
```

---

### 3. Mermaid Diagrams Native Rendering

**What:** `renderMermaidDiagram` tool now available for interactive diagrams in chat.

**Impact:** MEDIUM - We have `markdown-mermaid` skill already. Now diagrams render interactively!

**Action Items:**
- [ ] Update markdown-mermaid skill to reference native tool
- [ ] Test integration with existing skill instructions
- [ ] Document enhanced capabilities in skill

**Synergy:** Our skill provides *expertise* in creating diagrams; VS Code now provides *rendering*.

---

### 4. Ask Questions Tool

**What:** Agent can ask clarifying questions with structured UI (single/multi-select, free text).

**Impact:** MEDIUM - Aligns with our user coaching and Socratic questioning patterns.

**Enabled via:** `chat.askQuestions.enabled`

**Action Items:**
- [ ] Enable in recommended settings
- [ ] Update socratic-questioning skill to leverage this capability
- [ ] Consider updating bootstrap-learning instructions to use structured questions

---

### 5. Copilot Memory

**What:** Persistent memory across sessions stored in GitHub.

**Impact:** MEDIUM - Complements our Global Knowledge system.

**Enabled via:** `github.copilot.chat.copilotMemory.enabled`

**Considerations:**
- Our Global Knowledge is local-first (`~/.alex/global-knowledge/`)
- Copilot Memory is cloud-native via GitHub
- **Opportunity:** Use both - Copilot Memory for preferences, GK for knowledge
- **Risk:** Potential duplication of stored information

**Action Items:**
- [ ] Document relationship between systems
- [ ] Consider differentiation: Memory = preferences, GK = learnings
- [ ] Add note to global-knowledge skill

---

## 🔬 Investigate Further

### 6. Chat Prompt Files API (Proposed)

**What:** Extensions can dynamically provide prompts, agents, instructions, and skills.

```typescript
vscode.chat.registerSkillProvider({
  onDidChangeSkills: onDidChangeEvent,
  provideSkills(context, token): ChatResource[] {
    return [{ uri: vscode.Uri.parse('alex:/skills/debugging/SKILL.md') }];
  }
});
```

**Impact:** HIGH - Alex could programmatically inject context-aware skills!

**Status:** Proposed API - not stable yet.

**Potential Use Cases:**
- Provide skills based on file type being edited
- Inject project-specific instructions dynamically
- Load skills from Global Knowledge

**Action Items:**
- [ ] Monitor API proposal: `vscode.proposed.chatPromptFiles.d.ts`
- [ ] Prototype implementation when API stabilizes
- [ ] Add to wishlist for future version

---

### 7. Agent Orchestration Patterns

**What:** Multi-agent workflows with specialized subagents running in parallel.

**Impact:** HIGH for advanced scenarios.

**Community Examples:**
- [Copilot Orchestra](https://github.com/ShepAlderson/copilot-orchestra) - Conductor + specialized subagents
- [GitHub Copilot Atlas](https://github.com/...) - Planning, research, implementation agents

**Alex Opportunity:**
- Could create Alex orchestration with specialized meditation, learning, review agents
- Each agent maintains own context window

**Implementation:**
```markdown
---
name: Alex-Orchestrator
tools: ['agent']
agents: ['Alex-Meditate', 'Alex-Learn', 'Alex-Review']
---
```

**Action Items:**
- [ ] Research community orchestration patterns
- [ ] Design Alex orchestrator prototype
- [ ] Document in agent design patterns skill

---

### 8. Claude Agent (Preview)

**What:** Native Claude Agent SDK integration in VS Code.

**Impact:** MEDIUM - Different approach from our current implementation.

**Considerations:**
- Uses official Anthropic agent harness
- Different from our chat participant approach
- Could be useful for background processing

**Action Items:**
- [ ] Test Claude Agent for meditation/dream workflows
- [ ] Evaluate if better than current approach for specific tasks
- [ ] Document findings

---

## 📋 Settings to Recommend

Add to documentation/user guidance:

```json
{
  // Anthropic Model Improvements
  "github.copilot.chat.anthropic.thinking.budgetTokens": 16000,
  "github.copilot.chat.anthropic.toolSearchTool.enabled": true,
  "github.copilot.chat.anthropic.contextEditing.enabled": true,

  // Ask Questions (Experimental)
  "chat.askQuestions.enabled": true,

  // Copilot Memory (Preview)
  "github.copilot.chat.copilotMemory.enabled": true,

  // Agent Skills
  "chat.useAgentSkills": true,
  "chat.agentSkillsLocations": {
    ".github/skills": true,
    "~/.copilot/skills": true
  },

  // Custom Agent Locations (if we add agents)
  "chat.agentFilesLocations": {
    ".github/agents": true
  },

  // Terminal Sandboxing (macOS/Linux only)
  "chat.tools.terminal.sandbox.enabled": true
}
```

---

## 🔒 Security Enhancements to Document

### Terminal Sandboxing

**What:** Restricts agent terminal commands to workspace folder, blocks network.

**Impact:** MEDIUM - Security improvement for agent operations.

**Platform:** macOS and Linux only (Windows not supported yet).

**Relevant Settings:**
- `chat.tools.terminal.sandbox.enabled`
- `chat.tools.terminal.sandbox.linuxFileSystem`
- `chat.tools.terminal.sandbox.macFileSystem`
- `chat.tools.terminal.sandbox.network`

**Action Items:**
- [ ] Document in security-review skill
- [ ] Add to environment setup recommendations

---

## 📦 Package.json Updates Required

### Immediate (v4.2.5 or v4.3.0)

1. **Engine Version Bump:**
```json
"engines": {
  "vscode": "^1.109.0"
}
```

2. **Chat Skills Contribution (investigate first):**
```json
"contributes": {
  "chatSkills": [
    { "path": "./.github/skills/anti-hallucination" },
    { "path": "./.github/skills/debugging-patterns" }
    // ... selective high-value skills
  ]
}
```

---

## 🗓️ Implementation Timeline

| Priority | Feature | Version | Effort |
|:--------:|---------|---------|:------:|
| 1 | Document Anthropic settings | v4.2.5 | 1h |
| 2 | Update engine to 1.109 | v4.2.5 | 30m |
| 3 | Update markdown-mermaid skill | v4.2.5 | 1h |
| 4 | Investigate chatSkills contribution | v4.3.0 | 4h |
| 5 | Prototype agent orchestration | v4.3.0+ | 8h |
| 6 | Monitor Chat Prompt Files API | Future | — |

---

## 📚 Related Documentation

| Document | Purpose |
|----------|---------|
| [VSCODE-1.109-HEIR-INSIGHTS.md](VSCODE-1.109-HEIR-INSIGHTS.md) | Consolidated heir analysis and compatibility matrix |
| [VSCODE-1.109-IMPLEMENTATION-PLAN.md](VSCODE-1.109-IMPLEMENTATION-PLAN.md) | 8 use cases and 6-phase implementation timeline |

## 📚 External References

- [VS Code January 2026 Release Notes](https://code.visualstudio.com/updates/v1_109)
- [Agent Skills Documentation](https://code.visualstudio.com/docs/copilot/skills)
- [Agent Skills Standard](https://agentskills.io) - Open format (Cursor, Claude, Factory.ai)
- [Chat Customization Diagnostics](https://code.visualstudio.com/docs/copilot/diagnostics)
- [Terminal Sandboxing](https://code.visualstudio.com/docs/copilot/terminal-sandbox)
- [Copilot Orchestra Example](https://github.com/ShepAlderson/copilot-orchestra)

---

*Document created by Alex Cognitive Architecture v4.2.4*
