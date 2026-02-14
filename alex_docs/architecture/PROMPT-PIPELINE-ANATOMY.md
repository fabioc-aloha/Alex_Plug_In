# Prompt Pipeline Anatomy: How LLM Requests Are Composed

> **Audience**: Alex developers understanding the full injection chain
> **Purpose**: Document every layer between user message and LLM response
> **Date**: 2026-02-14
> **Version**: v5.7.0

---

## Executive Summary

When a user types a message in VS Code, the prompt that reaches the LLM is **not just their message**. VS Code and GitHub Copilot compose a multi-layered prompt by injecting system instructions, workspace context, instruction files, skills, tools, and more — all before the user's actual text.

Alex operates in **two distinct prompt channels** with fundamentally different injection pipelines:

| Channel               | Trigger                         | Who Controls the Prompt        | Injection Layers                    |
| --------------------- | ------------------------------- | ------------------------------ | ----------------------------------- |
| **Agent Mode**        | User types in chat (no `@alex`) | VS Code / Copilot              | 8+ layers — full injection pipeline |
| **@alex Participant** | User types `@alex`              | Alex's code (`participant.ts`) | 2 messages — minimal pipeline       |

This document maps both channels layer by layer.

---

## Channel 1: Agent Mode (VS Code / Copilot Pipeline)

This is the **primary channel** when users interact with Copilot in agent mode. Alex's extension has **no programmatic control** over this pipeline — influence is exerted only through the injected files.

### Injection Order (Top → Bottom)

```
┌──────────────────────────────────────────────────┐
│ Layer 0: GitHub Copilot System Prompt            │
│   (Microsoft-controlled, not visible to Alex)    │
│   Contains: safety rules, tool use instructions, │
│   output formatting, file linkification rules,   │
│   model awareness, communication style guidance  │
├──────────────────────────────────────────────────┤
│ Layer 1: copilot-instructions.md                 │
│   (Alex's prefrontal cortex — ~1,100 tokens)     │
│   Injected when:                                 │
│     github.copilot.chat.codeGeneration           │
│       .useInstructionFiles = true                │
│   Contains: Identity, Active Context, Routing,   │
│   Safety Imperatives, Model Awareness            │
├──────────────────────────────────────────────────┤
│ Layer 2: Matched .instructions.md Files          │
│   (Alex's procedural memory)                     │
│   Matched by:                                    │
│     A. description text (semantic match)         │
│     B. applyTo glob (file pattern match)         │
│   Injected from: chat.instructionsFilesLocations │
│   Example: code-review-guidelines.instructions.md│
│     triggers for **/*.{ts,js,tsx,jsx,...} files   │
├──────────────────────────────────────────────────┤
│ Layer 3: Skills Catalog                          │
│   (Alex's declarative memory)                    │
│   When: chat.useAgentSkills = true               │
│   Generates a <skills> block listing all names + │
│   descriptions. LLM decides which to load.       │
│   Adherence prompt (chat.useSkillAdherencePrompt)│
│   forces: "Read SKILL.md FIRST before responding"│
│   Source: chat.agentSkillsLocations +            │
│           package.json chatSkills contribution    │
├──────────────────────────────────────────────────┤
│ Layer 4: Agent Definitions                       │
│   (.github/agents/*.agent.md)                    │
│   When: chat.useAgentsMdFile = true              │
│   Loaded from: .github/agents/ directory         │
│   Defines specialized agent personas             │
├──────────────────────────────────────────────────┤
│ Layer 5: Tool Definitions                        │
│   (Alex's 13 registered LM tools)               │
│   Always injected when tools are available       │
│   Contains: tool names, descriptions, parameters │
│   LLM can invoke tools during response           │
├──────────────────────────────────────────────────┤
│ Layer 6: Repository Memories                     │
│   (github.copilot.chat.copilotMemory.enabled)    │
│   Cross-session facts stored by Copilot          │
│   Injected as <repository_memories> block        │
├──────────────────────────────────────────────────┤
│ Layer 7: Workspace Context                       │
│   File tree, open files, terminal state          │
│   Gathered by VS Code's built-in context system  │
├──────────────────────────────────────────────────┤
│ Layer 8: User Message                            │
│   The actual text the user typed                 │
│   May include #file references, @participant     │
│   mentions, and attached context                 │
└──────────────────────────────────────────────────┘
```

### Layer Details

#### Layer 0: Copilot System Prompt

This is controlled by GitHub/Microsoft and **not visible or modifiable** by extensions. Based on observable behavior and the system prompt visible in this very conversation, it contains:

| Component             | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| Identity instructions | "You are an expert AI programming assistant"    |
| Tool use instructions | How to call tools, JSON schema requirements     |
| Output formatting     | Markdown rules, file linkification, KaTeX       |
| Communication style   | Brevity, directness, conciseness guidelines     |
| Safety policies       | Microsoft content policies, copyright avoidance |
| Notebook instructions | How to handle Jupyter notebooks                 |
| Deferred tool system  | Tool search/loading mechanism for MCP tools     |
| Model awareness       | What model is in use (e.g., "Claude Opus 4.6")  |

**Key insight**: The system prompt includes an `<instructions>` block that embeds the **full text** of `copilot-instructions.md` as an attachment, plus a list of all instruction files with their `description` and `applyTo` metadata. It also includes a `<skills>` block listing all available skills with their descriptions.

#### Layer 1: copilot-instructions.md

**File**: `.github/copilot-instructions.md`
**Token cost**: ~1,100 tokens (v3-identity-first format)
**Injection trigger**: `github.copilot.chat.codeGeneration.useInstructionFiles = true`
**Documentation**: [COPILOT-BRAIN.md](COPILOT-BRAIN.md)

This file is Alex's **always-on cognitive state**. It's injected as an `<attachment>` inside the system prompt's `<instructions>` block. The LLM receives it as context before processing any user message.

The v3-identity-first format prioritizes:
1. **Identity** — Who Alex IS (personality, not features)
2. **Active Context** — Dynamic session state (persona, objective, focus)
3. **User Profile** — How to know the human collaborator
4. **Safety/Routing/Commands** — Behavioral constraints and capability discovery

#### Layer 2: Instruction Files (.instructions.md)

**Location**: `.github/instructions/`
**Setting**: `chat.instructionsFilesLocations: { ".github/instructions": true }`
**Current count**: 29 instruction files

Instruction files are **conditionally injected** based on two matching mechanisms:

| Mechanism              | Frontmatter Field | How It Works                                                                                            |
| ---------------------- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Description match**  | `description:`    | VS Code includes the instruction when the conversation topic semantically matches the description text  |
| **File pattern match** | `applyTo:`        | VS Code includes the instruction when the user references or works with files matching the glob pattern |

**Example** — `code-review-guidelines.instructions.md`:
```yaml
---
description: "Code review quality gate protocols and feedback guidelines"
applyTo: "**/*.{ts,js,tsx,jsx,py,ps1,cs,java,go,rs,rb}"
---
```
This file is injected when:
- The user asks about code review (description match), OR
- The user references a .ts/.js/.py/etc. file (applyTo match)

**Loading behavior**: VS Code presents instruction files to the system prompt as a list with `<description>` and `<file>` references. The LLM is instructed to load the file content via `read_file` when the instruction is relevant. Only the metadata is always-injected; **full content is loaded on-demand** by the LLM.

**Special flags**:
- `excludeAgent: "coding-agent"` — Excludes the instruction from specific agent contexts

#### Layer 3: Skills

**Location**: `.github/skills/` (workspace) + `package.json chatSkills` (extension-contributed)
**Settings**: `chat.agentSkillsLocations: [".github/skills"]`, `chat.useSkillAdherencePrompt: true`
**Current count**: 53 extension-contributed + ~22 workspace-only = ~75 total

Skills follow a **3-level progressive disclosure** model:

| Level                 | What's Loaded                        | When                                  |
| --------------------- | ------------------------------------ | ------------------------------------- |
| 1. Name + Description | Always (in `<skills>` catalog block) | Every request                         |
| 2. SKILL.md body      | On-demand (LLM reads the file)       | When LLM determines skill is relevant |
| 3. Resources folder   | On-demand (skill references them)    | Deep research tasks                   |

The **skill adherence prompt** (`chat.useSkillAdherencePrompt = true`) injects a VS Code-generated system message:
> "When a skill applies, you MUST load and read the SKILL.md file IMMEDIATELY as your first action"

This ensures the LLM actually reads skill content rather than just acknowledging the skill exists. Source: `computeAutomaticInstructions.ts:316-326` in VS Code source.

**Skill frontmatter** controls behavior:
```yaml
---
name: "code-review"
description: "Systematic code review for correctness, security, and growth"
applyTo: "**/*review*,**/*PR*,**/*pull*,**/*merge*"
---
```

Skills with `disableModelInvocation: true` are excluded from the auto-catalog and only activate on manual `/name` trigger.

#### Layer 4: Agent Definitions

**Location**: `.github/agents/*.agent.md`
**Setting**: `chat.useAgentsMdFile: true`

Agent files define specialized personas that the LLM can adopt. They function as composable system instructions for specific contexts.

#### Layer 5: Tool Definitions

Alex registers **13 language model tools** that the LLM can invoke:

| Tool                                 | Purpose                           |
| ------------------------------------ | --------------------------------- |
| `alex_cognitive_memory_search`       | Search Alex's memory architecture |
| `alex_cognitive_synapse_health`      | Diagnose connection integrity     |
| `alex_cognitive_self_actualization`  | Architecture assessment           |
| `alex_cognitive_architecture_status` | Health check                      |
| `alex_cognitive_focus_context`       | Session/goal info                 |
| `alex_cognitive_user_profile`        | Profile data                      |
| `alex_knowledge_search`              | Global knowledge search           |
| `alex_knowledge_save_insight`        | Save cross-project insight        |
| `alex_knowledge_promote`             | Promote pattern to global         |
| `alex_knowledge_status`              | Knowledge stats                   |
| `alex_quality_heir_validation`       | Heir content validation           |
| `alex_platform_mcp_recommendations`  | Azure/M365 guidance               |

These are injected as available tool definitions. The LLM sees tool schemas and can call them during response generation.

#### Layer 6: Repository Memories

**Setting**: `github.copilot.chat.copilotMemory.enabled = true`

Copilot's built-in memory system stores facts across sessions. These are injected as a `<repository_memories>` block with citations. The LLM is instructed to verify facts before relying on them.

#### Layer 7: Workspace Context

VS Code gathers contextual information:
- Workspace folder structure (truncated view)
- Currently open files
- Terminal state
- Selected text
- Referenced files (via `#file` syntax)

#### Layer 8: User Message

The actual user input, which may include:
- `@participant` mentions
- `#file` references
- `/command` prefixes
- Free-form text

---

## Channel 2: @alex Participant (Direct LM API)

When the user types `@alex [message]`, VS Code routes the request to Alex's **chat participant handler** (`participant.ts:handleGeneralQuery()`). This bypasses the Copilot pipeline entirely.

### Message Construction

```typescript
const messages: vscode.LanguageModelChatMessage[] = [
    vscode.LanguageModelChatMessage.User(alexSystemPrompt),
    vscode.LanguageModelChatMessage.User(request.prompt)
];
const response = await model.sendRequest(messages, {}, token);
```

Only **two messages** are sent:

```
┌──────────────────────────────────────────────────┐
│ Message 1: Alex System Prompt (User role)        │
│   Built by handleGeneralQuery()                  │
│   Contains:                                      │
│   - Identity statement                           │
│   - Personalization context (from user profile)  │
│   - Focus session context (if active)            │
│   - Active goals                                 │
│   - Behavior guidelines                          │
│   - Capability list (slash commands)             │
├──────────────────────────────────────────────────┤
│ Message 2: User's Prompt                         │
│   Raw text from request.prompt                   │
└──────────────────────────────────────────────────┘
```

### What's Missing in @alex Mode

| Layer                   | Agent Mode                  | @alex Mode | Impact                                         |
| ----------------------- | --------------------------- | ---------- | ---------------------------------------------- |
| Copilot system prompt   | ✅ Injected                  | ❌ Absent   | No safety/formatting rules from Copilot        |
| copilot-instructions.md | ✅ Injected                  | ❌ Absent   | No v3 identity, routing, or safety imperatives |
| .instructions.md files  | ✅ Conditionally loaded      | ❌ Absent   | No procedural memory                           |
| Skills catalog          | ✅ Listed + adherence prompt | ❌ Absent   | No skill routing                               |
| Agent definitions       | ✅ Loaded                    | ❌ Absent   | No agent personas                              |
| Tool definitions        | ✅ Available                 | ❌ Absent   | No tool invocation capability                  |
| Repository memories     | ✅ Injected                  | ❌ Absent   | No cross-session facts                         |
| Workspace context       | ✅ Gathered                  | ❌ Absent   | No file tree, no open file context             |
| User profile            | ❌ Not in Copilot pipeline   | ✅ Included | @alex has profile personalization              |
| Focus session           | ❌ Not in Copilot pipeline   | ✅ Included | @alex knows about Pomodoro sessions            |
| Emotional intelligence  | ❌ Not in Copilot pipeline   | ✅ Included | @alex detects frustration/success              |

**Critical finding**: The @alex participant operates with a **severely reduced context** compared to agent mode. It compensates with personalization features that agent mode lacks, but misses the entire Copilot injection pipeline.

**Note**: The system prompt is sent as a `User` message, not a `System` message. This is because VS Code's LM API maps User messages to the model's expected format — but it means the "system prompt" has the same priority as user content from the model's perspective.

---

## Injection Visualization

```
Agent Mode:                          @alex Mode:

  ┌─────────────────┐                 ┌─────────────────┐
  │ Copilot System  │                 │ (no system)     │
  │ Prompt          │                 │                 │
  ├─────────────────┤                 ├─────────────────┤
  │ copilot-        │                 │ Alex System     │
  │ instructions.md │                 │ Prompt          │
  ├─────────────────┤                 │ (identity +     │
  │ .instructions   │                 │  profile +      │
  │ .md files       │                 │  focus +        │
  ├─────────────────┤                 │  guidelines)    │
  │ Skills catalog  │                 │                 │
  ├─────────────────┤                 ├─────────────────┤
  │ Agent defs      │                 │ User message    │
  ├─────────────────┤                 └─────────────────┘
  │ Tool defs       │
  ├─────────────────┤
  │ Repo memories   │
  ├─────────────────┤
  │ Workspace ctx   │
  ├─────────────────┤
  │ User message    │
  └─────────────────┘
```

---

## Alex Integration Implications

### Current State

Alex's architecture is **optimized for Agent Mode**. The v3-identity-first copilot-instructions.md, 29 instruction files, 75 skills, 13 tools, and 7 agents all work through VS Code's injection pipeline. This is the right architecture — agent mode is the primary user interaction model.

The @alex participant is a **secondary channel** primarily used for:
- Slash commands (`/meditate`, `/dream`, `/learn`, etc.)
- Quick profile queries (`@alex what are my goals?`)
- Personalized greetings

### Optimization Opportunities

#### 1. Enrich @alex Participant Prompt (Medium Priority)

The `handleGeneralQuery()` function could include a condensed version of copilot-instructions.md content in its system prompt. This would bring routing and safety rules into the @alex channel.

**Risk**: Token cost. The current @alex system prompt is lean (~500 tokens). Adding copilot-instructions.md content would roughly double it.

**Recommendation**: Include only the **Identity** and **Routing** sections — skip Active Context (already covered by focus context), skip Heirs/Commands (not needed for general queries).

#### 2. Workspace Context Provider (Blocked — Proposed API)

The `registerChatWorkspaceContextProvider` API would allow Alex to inject persona/session context into **all** chat participants (including `@workspace`, `@terminal`). This is the most impactful improvement but requires `chatContextProvider` proposed API which is blocked for Marketplace publication.

**Workaround**: copilot-instructions.md already achieves partial injection — the Identity and Active Context sections are available in agent mode.

#### 3. Instructions Provider (Blocked — Proposed API)

The `registerInstructionsProvider` API would allow Alex to inject dynamic system prompts that change based on context (e.g., different rules for different personas). Currently, instruction files are static — their content doesn't change at runtime.

**Workaround**: The ActiveContextManager already updates the Active Context section of copilot-instructions.md at runtime, achieving a similar effect for the most dynamic state.

#### 4. Tool Definitions in @alex Mode (Low Priority)

The @alex participant currently sends `{}` as the options parameter to `model.sendRequest()`. Adding tool definitions would allow the LLM to invoke Alex's tools during @alex conversations.

```typescript
// Current
const response = await model.sendRequest(messages, {}, token);

// Enhanced
const response = await model.sendRequest(messages, { tools: [...] }, token);
```

**Recommendation**: Low priority. Users who need tool access should use agent mode. The @alex participant is better suited for quick, lightweight interactions.

### Where Alex Has the Advantage

Despite the injection gap, Alex has several advantages over bare Copilot:

| Advantage                   | How It Works                                                                    |
| --------------------------- | ------------------------------------------------------------------------------- |
| **Persistent identity**     | copilot-instructions.md survives across sessions; Copilot starts fresh          |
| **Structured memory**       | 4 memory types (procedural, episodic, declarative, synaptic) vs. flat key-value |
| **Cross-project knowledge** | Global Knowledge transfers patterns across projects                             |
| **Runtime state**           | ActiveContextManager updates persona/objective dynamically                      |
| **Emotional intelligence**  | @alex detects frustration, celebrates success                                   |
| **Profile adaptation**      | User preferences stored and applied                                             |
| **Skill routing**           | 75 skills with synaptic connections guide task decomposition                    |

---

## Key Settings Reference

These VS Code settings control the injection pipeline:

| Setting                                                  | Default | Alex Sets                        | Effect on Pipeline                            |
| -------------------------------------------------------- | ------- | -------------------------------- | --------------------------------------------- |
| `github.copilot.chat.codeGeneration.useInstructionFiles` | `true`  | `true`                           | Enables Layer 1 (copilot-instructions.md)     |
| `chat.instructionsFilesLocations`                        | `{}`    | `{".github/instructions": true}` | Enables Layer 2 (.instructions.md)            |
| `chat.agentSkillsLocations`                              | `[]`    | `[".github/skills"]`             | Enables Layer 3 (skills)                      |
| `chat.useSkillAdherencePrompt`                           | `false` | `true`                           | Strengthens Layer 3 (forces SKILL.md reading) |
| `chat.useAgentsMdFile`                                   | `false` | `true`                           | Enables Layer 4 (agent definitions)           |
| `chat.useNestedAgentsMdFiles`                            | `false` | `true`                           | Enables nested agent files                    |
| `github.copilot.chat.copilotMemory.enabled`              | `false` | `true`                           | Enables Layer 6 (repository memories)         |
| `chat.agent.enabled`                                     | `true`  | `true`                           | Top-level toggle for agent mode               |
| `chat.detectParticipant.enabled`                         | `true`  | `true`                           | Auto-routes queries to relevant participants  |

---

## VS Code Source Code References

| VS Code Source File                         | What It Does                                         | Section in This Doc |
| ------------------------------------------- | ---------------------------------------------------- | ------------------- |
| `computeAutomaticInstructions.ts:316-326`   | Generates `<skills>` block and adherence prompt      | Layer 3             |
| `chatPromptFilesContribution.ts:97-137`     | Registers skills/instructions/agents as prompt files | Layers 2-4          |
| `promptsServiceImpl.ts:931-947`             | Computes agent skills from multiple sources          | Layer 3             |
| `chat.contribution.ts:867-879`              | Skill adherence prompt experimental setting          | Layer 3             |
| `chat.contribution.ts:897-913`              | `agentSkillsLocations` setting definition            | Layer 3             |
| `languageModelToolsContribution.ts:225-234` | Tool name restrictions (`alex_` prefix)              | Layer 5             |
| `languageModelToolsService.ts:572-587`      | Tool invocation flow                                 | Layer 5             |

---

## Appendix A: Observed System Prompt Structure (First-Hand Evidence)

> **How this was gathered**: By examining the actual prompt environment visible to the LLM during a live agent mode session on February 14, 2026 (VS Code 1.109+, Claude Opus 4.6, Alex v5.7.0).

The system prompt that reaches the LLM in agent mode is a structured document using **XML-like tags** to organize injection layers. Here is the exact observed structure, in order:

### A.1 Top-Level Prompt Structure

```xml
<!-- 1. Identity + behavior rules (Copilot's own system prompt) -->
You are an expert AI programming assistant...
Follow the user's requirements carefully & to the letter.
Follow Microsoft content policies.
...

<!-- 2. Tool use instructions block -->
<toolUseInstructions>
  <!-- Rules for calling tools, JSON schema requirements -->
  <!-- Deferred tool system with tool_search_tool_regex -->
  <toolSearchInstructions>
    <!-- Mandatory: must load deferred tools before calling them -->
    <availableDeferredTools>
      alex_cognitive_architecture_status
      alex_cognitive_focus_context
      alex_cognitive_memory_search
      alex_cognitive_self_actualization
      alex_cognitive_synapse_health
      alex_cognitive_user_profile
      alex_knowledge_promote
      alex_knowledge_save_insight
      alex_knowledge_search
      alex_knowledge_status
      alex_platform_mcp_recommendations
      alex_quality_heir_validation
      <!-- ...plus Azure MCP tools, system tools, etc. -->
    </availableDeferredTools>
  </toolSearchInstructions>
</toolUseInstructions>

<!-- 3. Communication style rules -->
<communicationStyle>
  <!-- Brevity, directness, conciseness guidance -->
  <communicationExamples>...</communicationExamples>
</communicationStyle>

<!-- 4. Azure MCP instructions (conditional) -->
<instruction forToolsWithPrefix="mcp_azure">...</instruction>
<instruction forToolsWithPrefix="mcp_bicep">...</instruction>

<!-- 5. Notebook instructions -->
<notebookInstructions>...</notebookInstructions>

<!-- 6. Output formatting rules -->
<outputFormatting>
  <!-- Markdown formatting, file linkification, KaTeX math -->
  <fileLinkification>
    <!-- Detailed rules for converting file references to links -->
  </fileLinkification>
</outputFormatting>

<!-- 7. Repository memory instructions -->
<repoMemory>
  <!-- When/how to store facts for future sessions -->
  <examples>...</examples>
  <factsCriteria>...</factsCriteria>
</repoMemory>

<!-- 8. THE MAIN INSTRUCTIONS BLOCK -->
<instructions>

  <!-- 8a. copilot-instructions.md as attachment -->
  <attachment filePath="c:\Development\Alex_Plug_In\.github\copilot-instructions.md">
    <!-- FULL TEXT of copilot-instructions.md injected here -->
    <!-- This is Alex's prefrontal cortex — ~1,100 tokens -->
  </attachment>

  <!-- 8b. Global Knowledge copilot-instructions.md (multi-root workspace) -->
  <attachment filePath="c:\Development\Alex-Global-Knowledge\.github\copilot-instructions.md">
    <!-- Each workspace root gets its own attachment -->
  </attachment>

  <!-- 8c. Instruction file list (NOT full content — just metadata) -->
  <instructions>
    Here is a list of instruction files...
    <instruction>
      <description>Alex core cognitive architecture...</description>
      <file>c:\...\alex-core.instructions.md</file>
    </instruction>
    <instruction>
      <description>Code review quality gate protocols...</description>
      <file>c:\...\code-review-guidelines.instructions.md</file>
      <applyTo>**/*.{ts,js,tsx,jsx,py,ps1,cs,java,go,rs,rb}</applyTo>
    </instruction>
    <!-- ...29 instruction files listed with metadata -->
  </instructions>

  <!-- 8d. Skills catalog -->
  <skills>
    Here is a list of skills...
    <skill>
      <name>code-review</name>
      <description>Systematic code review for correctness...</description>
      <file>c:\...\.github\skills\code-review\SKILL.md</file>
    </skill>
    <!-- ...13 extension-contributed skills listed -->
    <!-- Note: workspace skills from chat.agentSkillsLocations are -->
    <!-- discovered separately by VS Code's skill discovery system -->
  </skills>

</instructions>

<!-- 9. Environment info -->
<environment_info>
  The user's current OS is: Windows
</environment_info>

<!-- 10. Workspace info -->
<workspace_info>
  <!-- Folder list, directory structure (truncated) -->
</workspace_info>

<!-- 11. Repository memories -->
<repository_memories>
  <!-- Cross-session facts with citations -->
  <!-- LLM instructed to verify before relying on them -->
</repository_memories>

<!-- 12. Conversation summary (for long conversations) -->
<conversation-summary>
  <!-- Compressed history when context window is full -->
  <analysis>...</analysis>
  <summary>...</summary>
</conversation-summary>

<!-- 13. Per-turn context -->
<context>
  <!-- Current date, terminal state, recent changes -->
</context>

<!-- 14. Editor context -->
<editorContext>
  <!-- Currently open file, selection -->
</editorContext>

<!-- 15. Reminder instructions -->
<reminderInstructions>
  <!-- Per-turn behavioral reminders from VS Code -->
</reminderInstructions>

<!-- 16. User's actual message -->
<userRequest>
  The user's typed message
</userRequest>
```

### A.2 Key Structural Observations

| Observation                                                                                                | Implication for Alex                                                                                       |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **copilot-instructions.md is injected as `<attachment>`** inside `<instructions>`, not as a system message | It has high authority — treated as project-level configuration, not user content                           |
| **Multi-root workspaces get multiple attachments**                                                         | Both Alex_Plug_In and Alex-Global-Knowledge copilot-instructions.md are injected simultaneously            |
| **Instruction files are listed by metadata only**                                                          | The LLM must call `read_file` to load actual content — saves tokens when instructions aren't needed        |
| **`applyTo` is visible in the prompt**                                                                     | The LLM can see which glob patterns trigger each instruction and can decide relevance                      |
| **Skills are listed by name + description + file path**                                                    | Same on-demand loading model as instructions — catalog is cheap, content is loaded when needed             |
| **Repository memories have citations**                                                                     | The LLM is expected to verify facts against actual code before relying on stored memories                  |
| **Conversation summary replaces history**                                                                  | When context window fills up, VS Code compresses prior turns into a structured `<analysis>` + `<summary>`  |
| **`<reminderInstructions>` is per-turn**                                                                   | VS Code can inject different behavioral reminders on each turn (e.g., "check file before editing")         |
| **Alex's tools appear as "deferred tools"**                                                                | All 12 alex_* tools require `tool_search_tool_regex` discovery before invocation — they're not auto-loaded |
| **Azure MCP tools get conditional instructions**                                                           | `<instruction forToolsWithPrefix="mcp_azure">` only activates when Azure tools are relevant                |

### A.3 Token Budget Estimation (Agent Mode)

Based on observed prompt size:

| Layer                                         | Estimated Tokens   | Notes                                          |
| --------------------------------------------- | ------------------ | ---------------------------------------------- |
| Copilot system prompt (Layers 0 + formatting) | ~3,000-4,000       | Identity, tool rules, formatting, safety       |
| copilot-instructions.md (Layer 1)             | ~1,100             | v3-identity-first format                       |
| Instruction file metadata (Layer 2)           | ~1,500-2,000       | 29 files × ~60 tokens each (metadata only)     |
| Skills catalog (Layer 3)                      | ~500-800           | 13 extension skills × ~40 tokens each          |
| Tool definitions (Layer 5)                    | ~2,000-3,000       | 50+ tools including MCP, each with full schema |
| Repository memories (Layer 6)                 | ~200-500           | Variable, depends on stored facts              |
| Workspace context (Layer 7)                   | ~500-1,500         | Folder structure, open files                   |
| Conversation summary (when active)            | ~2,000-5,000       | Compressed history of prior turns              |
| **Total before user message**                 | **~11,000-18,000** | ~5-9% of a 200K context window                 |

**Key insight**: Alex's copilot-instructions.md (~1,100 tokens) is only ~6-10% of the total injected context. The majority of injection cost comes from Copilot's own system prompt and tool definitions. This validates the v3 token reduction strategy — going below 1,100 tokens would have diminishing returns.

### A.4 Deferred Tool Loading Pattern

Alex's tools are listed in `<availableDeferredTools>` but **not auto-loaded**. The LLM must:

1. Call `tool_search_tool_regex` with a pattern matching the tool name
2. Receive the full tool schema in the response
3. Only then can it call the actual tool

This means Alex's tools have **zero token cost** until the LLM decides to use them. The trade-off is an extra round-trip for tool discovery. This is VS Code's optimization for extensions with many tools.

```
User asks about synapse health
  → LLM sees "alex_cognitive_synapse_health" in deferred list
  → LLM calls: tool_search_tool_regex(pattern="synapse_health")
  → Receives full tool schema
  → LLM calls: alex_cognitive_synapse_health(params)
  → Tool executes and returns result
```

### A.5 Instruction File vs Skill: When Each Is Used

Both instruction files and skills provide domain knowledge, but they're injected differently:

| Aspect           | Instruction Files                                | Skills                                                  |
| ---------------- | ------------------------------------------------ | ------------------------------------------------------- |
| **Injection**    | Metadata always listed; LLM reads on relevance   | Name/description always listed; LLM reads on relevance  |
| **Matching**     | `description` (semantic) + `applyTo` (file glob) | `description` (semantic) + `applyTo` (file glob)        |
| **Purpose**      | Behavioral rules ("how to do X")                 | Domain knowledge ("what X is and how to approach it")   |
| **Typical size** | 100-400 lines of procedural instructions         | 50-150 lines of structured knowledge                    |
| **Alex analogy** | Procedural memory (how to ride a bike)           | Declarative memory (facts about bicycles)               |
| **Auto-load**    | Via VS Code's instruction system                 | Via skill adherence prompt                              |
| **Location**     | `.github/instructions/`                          | `.github/skills/` (workspace) or extension `chatSkills` |

---

## Related Documentation

- [COPILOT-BRAIN.md](COPILOT-BRAIN.md) — How copilot-instructions.md works (Layer 1 deep dive)
- [VSCODE-COPILOT-API-ANALYSIS.md](../vscode/VSCODE-COPILOT-API-ANALYSIS.md) — Complete VS Code API inventory
- [VSCODE-SOURCE-INTEGRATION-ANALYSIS.md](../vscode/VSCODE-SOURCE-INTEGRATION-ANALYSIS.md) — VS Code source code opportunities
- [ADR-010](../decisions/ADR-010-copilot-instructions-as-prefrontal-cortex.md) — Architecture decision for v3 format
