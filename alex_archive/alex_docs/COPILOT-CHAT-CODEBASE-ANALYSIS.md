# Copilot Chat Codebase Findings for Master Alex

> Deep analysis of the GitHub Copilot Chat VS Code extension (`v0.43.0`).
> Focus: patterns, systems, and architecture we can leverage for Master Alex.

---

## 1. Architecture Overview

### Layered Structure

The codebase follows a strict **platform / extension / util** layering:

```
src/
├── platform/      # Environment-agnostic services (auth, networking, config, telemetry, MCP, etc.)
├── extension/     # VS Code-specific implementations (agents, chat, tools, prompts, etc.)
├── util/          # Shared utilities (VS Code base library forks, tokenizer, crypto, etc.)
└── lib/           # Additional node/vscode-node libraries
```

Each layer uses a **target subfolder convention**:

| Subfolder | Purpose |
|---|---|
| `common/` | Pure logic, no platform dependencies |
| `node/` | Node.js-specific code |
| `vscode/` | VS Code API types only |
| `vscode-node/` | VS Code + Node.js implementations |

**Leverage for Alex**: This clean layering means we can extract `platform/` services (auth, networking, config, telemetry) into Alex's architecture without VS Code dependencies. The `common/` tier in each module is the extraction target.

### Dependency Injection

The entire codebase uses a **service-oriented DI system** from VS Code's instantiation framework:

```typescript
// Service identifiers
export const IToolsService = createServiceIdentifier<IToolsService>('IToolsService');

// Constructor injection via decorators
constructor(
    @IConfigurationService private readonly config: IConfigurationService,
    @ILogService private readonly log: ILogService,
) {}
```

Services are wired in `src/extension/extension/vscode-node/services.ts` — a massive DI composition root registering 80+ services via `SyncDescriptor`.

**Leverage for Alex**: Adopt the same DI pattern. The `createServiceIdentifier` + `SyncDescriptor` system is self-contained in `src/util/vs/platform/instantiation/` and could be extracted wholesale.

---

## 2. Agent System

### Agent Providers (`src/extension/agents/vscode-node/`)

Agents are defined via **`.agent.md` files** (YAML frontmatter + body) and registered through `ChatCustomAgentProvider`. Key agent types:

| Agent | Purpose | Key Pattern |
|---|---|---|
| **Plan** | Multi-step planning, read-only | Handoff buttons to switch agents |
| **Explore** | Fast codebase search subagent | Runs on cheaper/faster models (Haiku, Gemini Flash) |
| **Ask** | Q&A with read-only tools | Default user-facing agent |
| **Edit** | Code modification | Full write tool access |

**Agent Configuration (`AgentConfig` interface)**:
- `name`, `description`, `argumentHint`
- `tools` — explicit tool allowlist (array)
- `agents` — subagent allowlist (e.g., Plan delegates to Explore)
- `handoffs` — structured transitions between agents with label/prompt/model
- `model` — supports priority lists: `['Claude Haiku 4.5', 'Gemini Flash', 'Auto']`
- `target` — routing target (`vscode`)
- `disableModelInvocation` — prevents direct model access (plan-only agents)

**Agent Markdown Generation (`buildAgentMarkdown`)**:
Configs are rendered to `.agent.md` content without YAML libraries — pure string templates. Written to extension cache directories and returned as `ChatResource` URIs.

**Leverage for Alex**: The `AgentConfig` → `buildAgentMarkdown()` pattern is exactly what we need for Alex's agent system. Our `agents/*.agent.md` files already follow this format. We can:
1. Use `buildAgentMarkdown()` to dynamically generate agent definitions
2. Adopt the handoff pattern for persona transitions
3. Use model priority lists for cost optimization
4. The `DEFAULT_READ_TOOLS` constant shows exactly which tools are safe for read-only agents

### Claude Code Integration (`src/extension/chatSessions/claude/`)

A full Claude Agent SDK integration exists alongside the Copilot path:
- `ClaudeAgentManager` — manages language model server lifecycle
- `ClaudeCodeSession` — routes requests to Claude sessions
- Hook registry, tool permissions, MCP server registry
- Slash commands, tool permission handlers

**Leverage for Alex**: This is a production-grade Claude Agent SDK integration. The hook system, permission model, and MCP server registry patterns are directly applicable.

---

## 3. Tool System

### Tool Registry (`src/extension/tools/common/`)

Tools are the atomic capabilities of the agent system. Architecture:

```
ToolRegistry (static) → registers ICopilotToolCtor classes
    ↓
IToolsService → runtime tool management, validation, invocation
    ↓
ToolGrouping → virtual tool hierarchy (deferred loading)
```

**Key Interfaces**:

```typescript
interface ICopilotTool<T> {
    invoke?: (options, token) => Promise<ToolResult>;
    prepareInvocation?: (options, token) => Promise<PreparedInvocation>;
    provideInput?(promptContext): Promise<T | undefined>;      // pre-fill from context
    resolveInput?(input, context, mode): Promise<T>;            // merge/override LLM input
    filterEdits?(resource): Promise<EditFilterData | undefined>; // edit confirmation
    alternativeDefinition?(tool, endpoint): ToolInformation;    // per-model customization
}
```

**Tool Names (enum ToolName)**:
Complete inventory of all 60+ tools including: `ApplyPatch`, `ReadFile`, `FindFiles`, `FindTextInFiles`, `CreateFile`, `ReplaceString`, `MultiReplaceString`, `Memory`, `RunInTerminal`, `RunSubagent`, `SearchSubagent`, `ToolSearch`, `FetchWebPage`, `GetErrors`, `ManageTodoList`, `RunTests`, `AskQuestions`, `SwitchAgent`, etc.

**Tool Deferral System**:
Tools are split into **non-deferred** (always sent) and **deferred** (loaded on demand):
- Non-deferred: `CoreRunInTerminal`, `CoreRunSubagent`, `CoreRunTest`, `CoreAskQuestions`, `ToolSearch`
- All others are deferred by default, loaded via `tool_search` embeddings

**Leverage for Alex**: The tool deferral pattern is how Copilot manages 60+ tools without overwhelming the model. Our tool system should adopt:
1. The `ICopilotTool<T>` interface with `provideInput/resolveInput/filterEdits`
2. The non-deferred/deferred split for token efficiency
3. The `ToolCategory` enum for grouping

### Virtual Tools (`src/extension/tools/common/virtualTools/`)

A sophisticated **tool grouping** system that dynamically groups tools into virtual containers:

```typescript
class VirtualTool {
    name: string;           // prefixed with 'activate_'
    contents: (LanguageModelToolInformation | VirtualTool)[];
    isExpanded: boolean;
    lastUsedOnTurn: number;
}
```

- Tools are grouped by embeddings similarity + category
- Groups expand/collapse dynamically based on usage
- Built-in groups for: Jupyter, Web, VS Code, Testing, Core
- Uses pre-computed embeddings cache for fast matching
- Telemetry tracks which virtual tools get expanded

**Leverage for Alex**: This is the exact pattern for managing our growing skill/tool library. Instead of sending all tools every turn, group them and expand on demand. The embeddings-based matching is particularly interesting for skill activation.

### Agent Memory Service (`src/extension/tools/common/agentMemoryService.ts`)

Repository-scoped memories stored via CAPI (Copilot API):

```typescript
interface RepoMemoryEntry {
    subject: string;      // what the memory is about
    fact: string;         // the actual insight
    citations?: string[]; // source references
    reason?: string;      // why it's stored
    category?: string;    // classification
}
```

- Cloud-backed via `ICAPIClientService`
- Memories tied to GitHub repo (NWO-based)
- `checkMemoryEnabled()` → lightweight enablement check
- `getRepoMemories(limit?)` → retrieve stored facts
- `storeRepoMemory(entry)` → persist new insight

**Leverage for Alex**: Our `/memories/repo/` system already mirrors this format. The CAPI integration shows how to graduate from local-file memories to cloud-backed persistence.

---

## 4. Prompt System

### Prompt TSX (`@vscode/prompt-tsx`)

All prompts are written as **JSX/TSX components** that render to token-budgeted messages:

```tsx
class AgentPrompt extends PromptElement<AgentPromptProps> {
    render(state, sizing) {
        return (
            <SystemMessage>
                <CopilotIdentityRules />
                <SafetyRules />
                <DefaultAgentPrompt tools={...} />
                <CustomInstructions />
            </SystemMessage>
            <UserMessage>
                <UserQuery />
                <ChatVariables />
            </UserMessage>
            <AgentConversationHistory />
        );
    }
}
```

**Key Prompt Components** (in `src/extension/prompts/node/`):

| Component | Purpose |
|---|---|
| `CopilotIdentityRules` | "You are GitHub Copilot" + model name |
| `SafetyRules` | Microsoft content policies, harm prevention |
| `DefaultAgentInstructions` | Core agent behavior, tool use rules |
| `CustomInstructions` | User `.instructions.md`, settings, skills |
| `AgentConversationHistory` | Multi-turn context with summarization |
| `SummarizedConversationHistory` | Token-efficient history compression |
| `ChatVariables` | `#file`, `#selection`, etc. |
| `MemoryContextPrompt` | `/memories/` content injection |
| `TodoListContextPrompt` | Task list state injection |
| `TerminalStatePromptElement` | Current terminal state |
| `Tag` | Semantic XML tags for prompt structure |

### Per-Model Prompt Customization (`promptRegistry.ts`)

A registry pattern maps model families to custom prompt variants:

```typescript
const PromptRegistry = new class {
    registerPrompt(prompt: IAgentPromptCtor): void;
    resolveCustomizations(endpoint, instantiationService): AgentPromptCustomizations;
}();
```

Registered variants found in `allAgentPrompts.ts`:
- `anthropicPrompts` (Claude family)
- `geminiPrompts` (Gemini family)
- `vscModelPrompts` (VS Code-hosted models)
- `minimaxPrompts`, `xAIPrompts`, `zaiPrompts`
- GPT-5 variants: `gpt5Prompt`, `gpt51Prompt`, `gpt52Prompt`, `gpt53Prompt`, `gpt54Prompt` + codex variants

Each variant can override: `SystemPrompt`, `ReminderInstructions`, `ToolReferencesHint`, `CopilotIdentityRules`, `SafetyRules`, `userQueryTagName`.

**Leverage for Alex**: The per-model prompt registry is exactly what we need for multi-model support. When Alex talks to Claude vs GPT vs Gemini, prompts should adapt. The TSX rendering pattern gives us token budgeting for free.

### Custom Instructions Pipeline (`ICustomInstructionsService`)

The system for loading `.instructions.md`, `.prompt.md`, `SKILL.md`, and `copilot-instructions.md`:

- Reads from workspace `.github/` directories and personal paths
- Supports `applyTo` glob patterns in YAML frontmatter
- Resolves tool references within instructions (`#tool_name`)
- Extension-contributed prompt files (via `vscode.ChatCustomAgentProvider`)
- Skill detection: `isSkillFile()`, `getSkillInfo()` → `{ skillName, skillFolderUri }`

**Leverage for Alex**: Our instruction/skill file format is already recognized by this system. Understanding the internal pipeline helps ensure our files are loaded correctly.

---

## 5. Intent System

### Intent Detection (`src/extension/prompt/node/`)

Intents classify user requests and route them to specialized handlers:

```typescript
interface IIntent {
    id: string;
    description: string;
    locations: ChatLocation[];  // panel, inline, editor, terminal
    commandInfo?: IIntentSlashCommandInfo;
    invoke(context): Promise<IIntentInvocation>;
    handleRequest?(conversation, request, stream, token, ...): Promise<ChatResponse>;
}
```

Each intent produces an `IIntentInvocation` that controls:
- Prompt crafting (via `PromptElement`)
- Response streaming and processing
- Streaming edits strategy

The `IntentRegistry` holds all intents as `SyncDescriptor[]`, instantiated via DI.

**Leverage for Alex**: Intent detection maps directly to our persona/skill routing. The `IIntent.invoke()` → `IIntentInvocation` pattern separates "what to do" from "how to do it".

---

## 6. Conversation & History

### Conversation Model (`src/extension/prompt/common/conversation.ts`)

Turn-based conversation with metadata:

```typescript
interface Turn {
    // Each turn has prompt metadata, cache keys, annotations
}

interface Conversation {
    // Multi-turn management with summarization support
}
```

### Summarization (`src/extension/prompts/node/agent/`)

Two summarization strategies:
1. **`SummarizedConversationHistory`** — compresses older turns
2. **`BackgroundSummarizer`** — runs summarization in background

The system maintains cache breakpoints for efficient context management.

### Chat Sessions

Full session support via:
- `chatSessionMetadataStore.ts` — persistent metadata
- `chatSessionWorktreeService.ts` — git worktree-based file isolation
- `chatSessionWorktreeCheckpointService.ts` — save/restore file states
- `externalEditTracker.ts` — detects edits made outside the agent
- `ttlCache.ts` — time-based cache eviction

**Leverage for Alex**: The worktree checkpoint pattern (save/restore file states per session) is ideal for Alex's session memory. The TTL cache pattern prevents memory bloat.

---

## 7. Networking & Model Endpoints

### Endpoint System (`src/platform/endpoint/common/`)

Multi-provider model management:

```typescript
interface IChatModelCapabilities {
    family: string;
    tokenizer: TokenizerType;
    limits?: { max_prompt_tokens, max_output_tokens, max_context_window_tokens, vision };
    supports: {
        parallel_tool_calls, tool_calls, streaming, vision,
        prediction, thinking, adaptive_thinking,
        max_thinking_budget, min_thinking_budget,
        reasoning_effort: string[]
    };
}
```

**Model capability hashing**: Model families are identified by SHA-256 hashes for A/B testing without exposing model names in code. Functions like `isHiddenModelA()`, `isHiddenModelE()` etc. check hashed family names.

**BYOK (Bring Your Own Key)** system (`src/extension/byok/`):
- Supports OpenAI (global API key), Azure (per-model deployment), Ollama (no auth)
- `BYOKModelRegistry` for custom model registration
- `anthropicMessageConverter`, `geminiMessageConverter` — format translation

**Leverage for Alex**: The BYOK system is a production-grade multi-provider abstraction. The capability detection system (`supports.thinking`, `supports.vision`, etc.) is exactly what we need for model-aware behavior.

### Anthropic & OpenAI Wire Formats (`src/platform/networking/common/`)

Full protocol implementations:
- `anthropic.ts` — Anthropic Messages API types including context management
- `openai.ts` — OpenAI Chat Completions + Responses API types
- `responseConvert.ts` — universal response conversion
- `toolDeferralService.ts` — tool deferral checking

---

## 8. Hook System

### Chat Hooks (`IChatHookService`)

Pre/post-operation hooks that external scripts can intercept:

```typescript
interface IChatHookService {
    executeHook(hookType, hooks, input, sessionId?, token?): Promise<ChatHookResult[]>;
    executePreToolUseHook(toolName, toolInput, toolCallId, hooks, ...): Promise<IPreToolUseHookResult>;
    executePostToolUseHook(toolName, toolInput, toolResponseText, ...): Promise<IPostToolUseHookResult>;
}
```

**Hook Decision Model**: Multiple hooks collapse via "most restrictive wins": `deny > ask > allow`.

**Hook Executor** (`IHookExecutor`):
- Runs external commands via stdin/stdout JSON protocol
- Exit code semantics: 0=success, 2=blocking error, other=non-blocking
- Session transcript flushed to disk before hooks run

**Leverage for Alex**: This is the exact safety/governance layer we need. Hooks let external processes (QA gates, security scanners, human reviewers) intercept agent actions.

---

## 9. Telemetry & Observability

### OpenTelemetry (`src/extension/otel/`)

Full OTEL integration for distributed tracing across agent operations.

### Trajectory Logging (`src/extension/trajectory/`)

Agent execution traces in **ATIF (Agent Trajectory Interchange Format)**:

```
RequestLogger → TrajectoryLoggerAdapter → TrajectoryLogger
    (bounded)        (converts)             (stores)
```

- Captures: LLM requests, tool calls, prompt traces
- Uses `AsyncLocalStorage` for request-scoped context
- Bounded storage with eviction

### Request Logging (`IRequestLogger`)

Every LLM call is captured:
- Logged requests, tool calls, and prompt element traces
- Configurable max entries
- Used for debugging and replay

**Leverage for Alex**: The trajectory system (ATIF format) is ideal for post-session analysis. Combined with our session memory, we can build "replay" capabilities.

---

## 10. Testing Infrastructure

### Simulation Tests (`test/simulation/`)

A sophisticated **simulation-based testing** system:
- Tests run against real or cached LLM responses
- `SimulationBaseline` — baseline comparison for regression detection
- Cache modes: replay from cache, record new, mixed
- SQLite-backed caches for chat ML and completions
- Parallel execution with rate limiting
- Scorecard generation and outcome validators

### Test Types
- `.stest.ts` files — simulation tests (agent-level E2E)
- Standard unit tests via Vitest
- Inline edit simulations, notebook tests, workspace tests

**Leverage for Alex**: The simulation test pattern (cache real LLM responses, replay for regression testing) would let us test Alex's behavior deterministically.

---

## 11. Key Patterns to Extract

### Highest-Value for Master Alex

| Pattern | Source | Value |
|---|---|---|
| **DI container** | `util/vs/platform/instantiation/` | Foundation for service-oriented architecture |
| **Tool registry + deferral** | `extension/tools/common/` | Scalable tool management with token efficiency |
| **Agent markdown generation** | `agents/vscode-node/agentTypes.ts` | Dynamic agent definition from config |
| **Virtual tool grouping** | `tools/common/virtualTools/` | Embeddings-based tool activation |
| **Per-model prompt registry** | `prompts/node/agent/promptRegistry.ts` | Model-aware prompt adaptation |
| **Hook system** | `platform/chat/common/chatHookService.ts` | Pre/post operation governance |
| **Agent memory (CAPI)** | `tools/common/agentMemoryService.ts` | Cloud-backed repo memories |
| **BYOK provider** | `extension/byok/` | Multi-provider model abstraction |
| **Trajectory logging** | `extension/trajectory/` | Agent execution trace format |
| **Simulation testing** | `test/simulation/` | LLM response caching for regression tests |
| **Custom instructions pipeline** | `platform/customInstructions/` | `.instructions.md` loading and glob matching |
| **Conversation summarization** | `prompts/node/agent/` | Token-efficient history compression |
| **Session file checkpointing** | `chatSessions/common/` | Git worktree-based state save/restore |

### Quick Wins

1. **Tool deferral**: Our skill catalog has 100+ skills. Adopt the deferred loading pattern immediately.
2. **Agent handoffs**: The `AgentHandoff` interface maps perfectly to Alex persona transitions.
3. **Model priority lists**: Use `['Claude Haiku 4.5', 'Gemini Flash', 'Auto']` for cost-optimized subagents.
4. **Hook-based QA**: Wire our `heir-validation` through the pre/post hook pattern.
5. **RepoMemoryEntry format**: Already matches our `/memories/repo/` JSON schema exactly.

---

## 12. Files Worth Deep-Reading

| File | Why |
|---|---|
| `src/extension/extension/vscode-node/services.ts` | DI composition root — every service registration |
| `src/extension/tools/common/toolNames.ts` | Complete tool inventory |
| `src/extension/agents/vscode-node/agentTypes.ts` | Agent config + markdown generation |
| `src/extension/prompts/node/agent/agentPrompt.tsx` | Master prompt assembly |
| `src/extension/prompts/node/agent/promptRegistry.ts` | Per-model prompt routing |
| `src/extension/tools/common/virtualTools/toolGrouping.ts` | Dynamic tool grouping |
| `src/extension/chatSessions/claude/AGENTS.md` | Claude Agent SDK integration docs |
| `src/extension/trajectory/ARCHITECTURE.md` | Trajectory logging architecture |
| `src/platform/endpoint/common/chatModelCapabilities.ts` | Model capability detection |
| `src/platform/chat/common/chatHookService.ts` | Hook system interface |
| `src/platform/customInstructions/common/customInstructionsService.ts` | Instruction loading pipeline |
| `src/extension/byok/common/byokProvider.ts` | BYOK multi-provider system |

---

## Appendix A: DI Composition Root — `src/extension/extension/vscode-node/services.ts`

### Purpose

This is the **single place** where every service in the extension is wired together. It's the composition root — understanding this file means understanding all available capabilities.

### Architecture

Two registration functions form a **layered DI setup**:

1. **`registerCommonServices()`** (in `../vscode/services.ts`) — services that work in any VS Code host (desktop + web)
2. **`registerServices()`** (in this file) — Node.js-only services that require `fs`, `crypto`, `path`, etc.

Both use the `IInstantiationServiceBuilder` pattern:

```typescript
builder.define(IServiceIdentifier, new SyncDescriptor(ConcreteClass));
// or for already-constructed instances:
builder.define(IServiceIdentifier, concreteInstance);
```

### Key Service Categories (~100 registrations)

| Category | Notable Services |
|---|---|
| **Auth** | `AuthenticationService`, `VSCodeCopilotTokenManager`, `StaticGitHubAuthenticationService` (test) |
| **Networking** | `FetcherService`, `DomainService`, `CAPIClientImpl`, `ChatWebSocketManager` |
| **Endpoints** | `ProductionEndpointProvider` (prod), `ScenarioAutomationEndpointProviderImpl` (test) |
| **Tools** | `ToolsService`, `ToolDeferralService`, `AgentMemoryService`, `MemoryCleanupService` |
| **Chat** | `ChatHookService`, `NodeHookExecutor`, `HooksOutputChannel`, `SessionTranscriptService` |
| **Git** | `GitServiceImpl`, `GitDiffService`, `GitCommitMessageServiceImpl`, `GithubRepositoryService` |
| **Search** | `SearchServiceImpl`, `WorkspaceChunkSearchService`, `GithubCodeSearchService`, `AdoCodeSearchService` |
| **Telemetry** | `TelemetryService` (prod), `NullTelemetryService` (test), `MicrosoftExperimentationService` |
| **OTEL** | `NodeOTelService` (dynamic import when enabled), `InMemoryOTelService` (disabled), `OTelSqliteStore` |
| **Intents** | `IntentService`, `PromptCategorizerService` |
| **Completions** | `CompletionsFetchService`, `CopilotInlineCompletionItemProviderService` |
| **Testing** | `TestDepsResolver`, `SetupTestsDetector`, `WorkspaceMutationManager` |
| **AI/ML** | `TokenizerProvider`, `RerankerService`, `GithubAvailableEmbeddingTypesService` |
| **Code Context** | `LanguageContextServiceImpl`, `LanguageContextProviderService`, `NaiveChunkingService` |

### Test vs Production Wiring

```typescript
if (isScenarioAutomation) {
    builder.define(IAuthenticationService, new SyncDescriptor(StaticGitHubAuthenticationService, [createStaticGitHubTokenProvider()]));
    builder.define(IEndpointProvider, new SyncDescriptor(ScenarioAutomationEndpointProviderImpl));
    builder.define(IIgnoreService, new SyncDescriptor(NullIgnoreService));
} else {
    builder.define(IAuthenticationService, new SyncDescriptor(AuthenticationService));
    builder.define(IEndpointProvider, new SyncDescriptor(ProductionEndpointProvider));
    builder.define(IIgnoreService, new SyncDescriptor(VsCodeIgnoreService));
}
```

### OTEL Lazy Loading Pattern

OTEL SDK is only `require()`'d when enabled — prevents loading heavy tracing libraries in normal operation:

```typescript
if (otelConfig.enabled) {
    const { NodeOTelService } = require('../../../platform/otel/node/otelServiceImpl');
    builder.define(IOTelService, new NodeOTelService(otelConfig, logFn, otelConfig.dbSpanExporter ? otelSqliteStore : undefined));
} else {
    builder.define(IOTelService, new InMemoryOTelService(otelConfig));
}
```

### Alex Takeaway

- Adopt `IInstantiationServiceBuilder.define()` + `SyncDescriptor` for lazy service construction
- The test/prod split pattern (conditional `builder.define`) is exactly what we need for local vs cloud Alex
- Dynamic import gating for heavy optional services (OTEL) prevents wasted startup time

---

## Appendix B: Tool Names & Categories — `src/extension/tools/common/toolNames.ts`

### Purpose

The **canonical registry** of all tool names, their contributed (external) names, and their grouping categories for the virtual tool system.

### Three Enums

| Enum | Purpose | Example |
|---|---|---|
| `ToolName` | Internal names used in code | `ToolName.ReadFile = 'read_file'` |
| `ContributedToolName` | External names from `package.json` contributions | `ContributedToolName.ReadFile = 'copilot_readFile'` |
| `ToolCategory` | Virtual tool grouping buckets | `ToolCategory.Core`, `ToolCategory.JupyterNotebook` |

### Full Tool Inventory (73 tools)

**Core (always expanded)**: `semantic_search`, `grep_search`, `read_file`, `view_image`, `create_file`, `apply_patch`, `replace_string_in_file`, `insert_edit_into_file`, `run_in_terminal`, `list_dir`, `get_terminal_output`, `manage_todo_list`, `multi_replace_string_in_file`, `file_search`, `create_directory`, `read_project_structure`, `runSubagent`, `search_subagent`, `execution_subagent`, `run_task`, `get_task_output`

**Jupyter Notebook**: `create_new_jupyter_notebook`, `edit_notebook_file`, `run_notebook_cell`, `copilot_getNotebookSummary`, `read_notebook_cell_output`

**Web Interaction**: `fetch_webpage`, `github_repo`

**VS Code Interaction**: `get_vscode_api`, `install_extension`, `get_errors`, `get_changed_files`, `run_vscode_command`, `get_search_view_results`, `create_new_workspace`, `search_workspace_symbols`, `memory`, `get_project_setup_info`

**Testing**: `test_failure`, `runTests`, `test_search`

**Other**: `vscode_askQuestions`, `switch_agent`, `tool_search`, `resolve_memory_file_uri`, `tool_replay`

### Bidirectional Name Mapping

```typescript
// Tool → Contributed: internal → external
getContributedToolName(ToolName.ReadFile) // → 'copilot_readFile'
// Contributed → Tool: external → internal
getToolName(ContributedToolName.ReadFile) // → 'read_file'
```

### BYOK Edit Tool Mapping

Maps provider-specific edit tool names to internal equivalents:

```typescript
const byokEditToolNamesToToolNames = {
    'find-replace': ToolName.ReplaceString,
    'multi-find-replace': ToolName.MultiReplaceString,
    'apply-patch': ToolName.ApplyPatch,
    'code-rewrite': ToolName.EditFile,
};
```

### Complete Category Map

Every tool is assigned exactly one category via `toolCategories: Record<ToolName, ToolCategory>`. TypeScript enforces completeness — adding a new `ToolName` without a category is a compile error.

### Alex Takeaway

- The `ToolCategory` enum + `toolCategories` record pattern enforces full classification at compile time
- Bidirectional name mapping is useful when Alex skills might be internally vs externally named
- Core tools (21) are always available; the rest (52) get deferred/grouped — our 100+ skills need the same treatment

---

## Appendix C: Agent Types & Markdown Generation — `src/extension/agents/vscode-node/agentTypes.ts`

### Purpose

Defines the **data model** for agent configuration and the **code that generates `.agent.md` files** from that model.

### Key Interfaces

```typescript
interface AgentHandoff {
    label: string;      // Button text shown to user
    agent: string;      // Target agent name
    prompt: string;     // Instructions sent to target agent
    send?: boolean;     // Auto-send or show in input
    showContinueOn?: boolean;
    model?: string;     // Override model for handoff
}

interface AgentConfig {
    name: string;
    description: string;
    argumentHint: string;
    tools: string[];                        // Explicit allowlist
    model?: string | readonly string[];     // Priority list
    target?: string;
    disableModelInvocation?: boolean;       // Plan-only agents
    userInvocable?: boolean;
    agents?: string[];                      // Subagent allowlist
    handoffs?: AgentHandoff[];
    body: string;                           // Markdown body content
}
```

### `buildAgentMarkdown()` — The Generator

Produces complete `.agent.md` from config. No YAML library — pure string templates:

- **Model priority lists**: `model: ['Claude Haiku 4.5', 'Gemini Flash', 'Auto']`
- **Tools**: `tools: ['search', 'read', 'web']` (flow-style YAML)
- **Handoffs**: Block-style YAML with nested objects
- **Single-quote escaping**: Doubles internal single quotes per YAML spec

### `DEFAULT_READ_TOOLS` — Read-Only Tool Set

```typescript
const DEFAULT_READ_TOOLS: readonly string[] = [
    'search', 'read', 'web', 'vscode/memory',
    'github/issue_read', 'github.vscode-pull-request-github/issue_fetch',
    'github.vscode-pull-request-github/activePullRequest',
    'execute/getTerminalOutput', 'execute/testFailure'
];
```

### Alex Takeaway

- We can use `buildAgentMarkdown()` directly to dynamically generate agent definitions
- The `handoffs` pattern maps perfectly to persona transitions (Developer → Researcher, etc.)
- Model priority lists give us cost optimization for free — cheap model first, fallback to expensive
- `disableModelInvocation: true` creates pure routing/planning agents that never call the LLM directly

---

## Appendix D: Master Prompt Assembly — `src/extension/prompts/node/agent/agentPrompt.tsx`

### Purpose

The **root TSX prompt component** that assembles all prompt parts into the final message sent to the model. This is where token budgeting, caching, and per-model customization converge.

### Key Class: `AgentPrompt`

The `render()` method builds the complete prompt in this order:

1. **System messages** — identity, safety, memory instructions
2. **Custom instructions** — user `.instructions.md` files, mode instructions, skills
3. **Global agent context** — OS info, workspace structure, tasks, user preferences, memory
4. **Conversation history** — either summarized (with cache breakpoints) or full
5. **Current user message** — query, tool references, notebook context, reminder instructions

### Two Rendering Paths

```
enableCacheBreakpoints = true:
    baseInstructions → SummarizedConversationHistory (handles everything)

enableCacheBreakpoints = false:
    baseInstructions → AgentConversationHistory → AgentUserMessage → ChatToolCalls
```

### `GlobalAgentContext` — First-Turn Static Data

Cached per conversation and only re-rendered if the cache key changes:

```tsx
<UserMessage>
    <Tag name='environment_info'><UserOSPrompt /></Tag>
    <Tag name='workspace_info'>
        <TokenLimit max={2000}><AgentTasksInstructions /></TokenLimit>
        <WorkspaceFoldersHint />
        <AgentMultirootWorkspaceStructure maxSize={2000} excludeDotFiles={true} />
    </Tag>
    <UserPreferences flexGrow={7} priority={800} />
    {isNewChat && <MemoryContextPrompt />}
    {enableCacheBreakpoints && <cacheBreakpoint />}
</UserMessage>
```

### Token Budget Management

```typescript
const MAX_TOOL_RESPONSE_PCT = 0.5; // No single tool result can use >50% of prompt budget
// User message variables get 1/6 of total budget:
<TokenLimit max={sizing.tokenBudget / 6} flexGrow={3} priority={898}>
    <ChatVariables />
</TokenLimit>
```

### `AgentUserMessage` — Per-Turn Dynamic Content

Detects available tools to conditionally include prompt sections:

- `hasReplaceStringTool` → include replace string instructions
- `hasToolsToEditNotebook` → include `<NotebookFormat />` section
- `hasTodoTool` → include todo tracking instructions
- `hasTerminalTool` → include terminal state

### Per-Model Prompt Selection

```typescript
if (endpoint.family.startsWith('gpt-') && experimentConfig) {
    return <AlternateGPTPrompt />;  // GPT-specific prompt
}
return <PromptClass />;  // Model-specific from PromptRegistry
```

### Alex Takeaway

- The TSX prompt system gives **declarative token budgeting** — `flexGrow` and `priority` control what gets truncated first
- `GlobalAgentContext` caching prevents re-rendering static context every turn — our sessions should do the same
- Conditional tool detection (`hasReplaceStringTool`, etc.) adapts the prompt to available capabilities
- The `<cacheBreakpoint>` element enables LLM-side prompt caching (Anthropic/OpenAI)
- Memory injection happens in the global context, matching our `/memories/` system

---

## Appendix E: Per-Model Prompt Registry — `src/extension/prompts/node/agent/promptRegistry.ts`

### Purpose

A **strategy pattern** that selects model-specific prompt variants based on the active endpoint.

### The Registry Pattern

```typescript
const PromptRegistry = new class {
    private promptsWithMatcher: PromptWithMatcher[] = [];
    private familyPrefixList: { prefix: string; prompt: IAgentPromptCtor }[] = [];

    registerPrompt(prompt: IAgentPromptCtor): void { ... }
    async resolveAllCustomizations(instantiationService, endpoint): Promise<AgentPromptCustomizations> { ... }
}();
```

### Resolution Priority

1. **Custom matchers** (`matchesModel(endpoint)`) — dynamic, async tests for model identification
2. **Family prefix matching** (`familyPrefixes`) — string prefix check on `endpoint.family`
3. **Defaults** — `DefaultAgentPrompt`, `DefaultReminderInstructions`, etc.

### Customization Surface

Each model variant can override five prompt components:

| Component | Default | What Changes |
|---|---|---|
| `SystemPrompt` | `DefaultAgentPrompt` | Core agent behavior instructions |
| `ReminderInstructions` | `DefaultReminderInstructions` | Per-turn edit/tool hints |
| `ToolReferencesHint` | `DefaultToolReferencesHint` | How tool references appear |
| `CopilotIdentityRules` | `CopilotIdentityRules` | "You are GitHub Copilot" |
| `SafetyRules` | `SafetyRules` | Safety constraints |

Plus a string override: `userQueryTagName` (default: `'userRequest'`).

### Registered Variants (from `allAgentPrompts.ts`)

- `anthropicPrompts` — Claude family
- `geminiPrompts` — Gemini family
- `vscModelPrompts` — VS Code-hosted models
- `minimaxPrompts`, `xAIPrompts`, `zaiPrompts`
- `gpt5Prompt`, `gpt51Prompt`, `gpt52Prompt`, `gpt53Prompt`, `gpt54Prompt` + codex variants

### Alex Takeaway

- When Alex talks to Claude vs GPT, different system prompts should be used — this registry pattern makes it clean
- The customization surface (5 components + tag name) is sufficient for most model differences
- The **matcher > prefix > default** priority chain is elegant for fallback handling

---

## Appendix F: Virtual Tool Grouping — `src/extension/tools/common/virtualTools/toolGrouping.ts`

### Purpose

Manages **dynamic tool expansion/collapse** to keep the tool list under the model's token budget. Tools are grouped into virtual containers that expand on demand.

### Architecture

```
ToolGrouping._root (VirtualTool, always expanded)
├── Core tools (always expanded, individual LanguageModelToolInformation)
├── "Jupyter Notebook Tools" (VirtualTool, collapsed)
│   ├── create_new_jupyter_notebook
│   ├── edit_notebook_file
│   └── ...
├── "Web Interaction" (VirtualTool, collapsed)
│   ├── fetch_webpage
│   └── github_repo
├── Embeddings group (VirtualTool, dynamic)
│   ├── mcp_server_tool_1
│   └── mcp_server_tool_2
└── ...
```

### Expansion Logic

- **`didCall(turnNo, toolName)`**: When the model calls a virtual tool, it expands, revealing the real tools inside. Returns a `LanguageModelToolResult` announcing which tools were activated.
- **`compute(query, token)`**: Recomputes the tool list, applying grouping and trimming.
- **`didTakeTurn()`**: Increments the turn counter used for LRU-style trimming.
- **`didInvalidateCache()`**: Forces recomputation of embedding rankings on next compute.

### Trimming Strategy

When total expanded tools exceed `HARD_TOOL_LIMIT`:

1. Find the tool with the lowest `lastUsedOnTurn`
2. If `canBeCollapsed === false`, skip it (mark as `Infinity`)
3. Otherwise, collapse it back into its virtual group

### Telemetry

Every virtual tool expansion fires `virtualTools.called` with:
- `callName` — which tool was called
- `turnNo` — how deep into the conversation
- `isVirtual` — was it a group or real tool
- `depth` — nesting level
- `preExpanded` — was it expanded by default vs on-demand
- `wasEmbedding` — was it in the embeddings group
- `totalTools` — total available at call time

### Alex Takeaway

- The LRU-based collapse strategy (oldest-used collapses first) is ideal for our 100+ skills
- Embeddings-based grouping means new MCP tools automatically get categorized
- The `HARD_TOOL_LIMIT` prevents token overflow — we need the same for skill injection
- `canBeCollapsed: false` protects essential tools from being hidden

---

## Appendix G: Claude Agent SDK Integration — `src/extension/chatSessions/claude/AGENTS.md`

### Purpose

Documents the production Claude Code integration that runs alongside the standard Copilot path. VS Code provides the UI; Claude Code provides the smarts.

### Architecture

```
VS Code Chat UI → ClaudeAgentManager → ClaudeCodeSession → Claude Code SDK (@anthropic-ai)
```

### Key Components

| Component | Role |
|---|---|
| `ClaudeAgentManager` | Routes requests, manages sessions, resolves file references |
| `ClaudeCodeSession` | Single conversation, request queue, tool confirmation, external edit tracking |
| `ClaudeCodeSdkService` | Thin DI wrapper around `@anthropic-ai/claude-agent-sdk` |
| `ClaudeCodeSessionService` | Loads persisted sessions from `~/.claude/projects/<workspace>/` |

### Tool Confirmation Model

- **Auto-approved**: File edits (Edit, Write, MultiEdit) within workspace
- **Manual confirmation**: All other tools via `CoreConfirmationTool`
- **Denied tools**: User denial sends "user declined" back to Claude

### Session Persistence

Sessions persisted as `.jsonl` in `~/.claude/projects/<workspace-slug>/`:
- Mtime-based cache invalidation
- Message chain reconstruction from leaf nodes
- Subagent sessions in `{session-id}/subagents/agent-*.jsonl`

### Multi-Root Workspace Handling

| Workspace | cwd | Additional Dirs | Folder Picker |
|---|---|---|---|
| Single-root | That folder | `[]` | Hidden |
| Multi-root | Selected/first | All others | Shown |
| Empty | MRU folder | `[]` | Shown with MRUs |

### Alex Takeaway

- Production-grade Claude Agent SDK integration exists and works
- The auto-approve/confirm/deny tool permission model is exactly our safety layer
- Session persistence in `.jsonl` with mtime invalidation is a proven pattern
- Subagent session discovery (`subagents/agent-*.jsonl`) shows how to track delegation chains

---

## Appendix H: Trajectory Logging Architecture — `src/extension/trajectory/ARCHITECTURE.md`

### Purpose

Captures agent execution traces in **ATIF (Agent Trajectory Interchange Format)** v1.5 for debugging, analysis, and benchmarking.

### Three-Layer Pipeline

```
RequestLogger (bounded) → TrajectoryLoggerAdapter (bridge) → TrajectoryLogger (ATIF storage)
```

1. **RequestLogger** — Captures all LLM requests, tool calls, prompt traces. Bounded array with configurable max. Uses `AsyncLocalStorage` for request-scoped context.

2. **TrajectoryLoggerAdapter** — Converts `LoggedInfo` → `TrajectoryStep`. Uses `WeakMap` for token→session mapping (GC-friendly), but `Set`/`Map` for deduplication tracking (unbounded — known memory leak risk).

3. **TrajectoryLogger** — Builds structured trajectory objects per session. Unbounded `Map<sessionId, TrajectoryBuilder>`.

### Session ID Resolution

```
Priority: token.subAgentInvocationId → token.chatSessionId → generateSessionId(label)
```

### Memory Lifecycle

| Component | Storage | Bounded? |
|---|---|---|
| `RequestLogger._entries` | Array | Yes (shifts oldest) |
| `Adapter.processedEntries` | Set | No (leak risk) |
| `Adapter.processedToolCalls` | Set | No (leak risk) |
| `TrajectoryLogger.trajectories` | Map | No (cleared explicitly) |

### ATIF v1.5 Output Format

```json
{
    "schema_version": "ATIF-v1.5",
    "session_id": "chat-session-abc123",
    "agent": { "name": "GitHub Copilot Chat", "version": "1.0.0", "tool_definitions": [...] },
    "steps": [{ "step_id": 1, ... }]
}
```

### Export Flow

User clicks export → get `CapturingToken` → resolve `sessionId` → `getAllTrajectories()` → recursively collect subagent trajectories → write `.trajectory.json` files.

### Known Issues

Orphaned references in adapter's tracking sets when `RequestLogger` evicts entries. Proposed fix: session-scoped cleanup + bounded safety valve at 10,000 entries.

### Alex Takeaway

- ATIF format is perfect for post-session analysis and replay
- The three-layer pipeline separates concerns cleanly
- The memory leak pattern is a good cautionary tale — any unbounded tracking set needs cleanup
- Session-scoped cleanup is the right fix — Alex sessions should do the same
- Recursive subagent trajectory collection shows how to build complete execution traces

---

## Appendix I: Model Capability Detection — `src/platform/endpoint/common/chatModelCapabilities.ts`

### Purpose

Model-aware behavior routing based on family detection, using **SHA-256 hashes** for A/B testing without exposing model names in code.

### Model Family Detection

Models are identified by hashing their `family` string:

```typescript
function isHiddenModelA(model) {
    const h = getCachedSha256Hash(model.family);
    return HIDDEN_MODEL_A_HASHES.includes(h);
}
```

This allows the team to run experiments on unreleased models without leaking names. Hash arrays include `HIDDEN_MODEL_A_HASHES`, `VSC_MODEL_HASHES_A/B/C`, `HIDDEN_MODEL_E/F/J_HASHES`, `HIDDEN_FAMILY_H_HASHES`.

### Named Family Detectors

```typescript
isAnthropicFamily(model)     // claude* or Anthropic* or hidden-G
isGeminiFamily(model)        // gemini*
isMinimaxFamily(model)       // *minimax*
isGpt5PlusFamily(model)      // gpt-5*
isGpt54(model)               // gpt-5.4* or hidden-J
isGpt53Codex(model)          // gpt-5.3-codex*
isGpt52CodexFamily(model)    // gpt-5.2-codex
isGpt52Family(model)         // gpt-5.2
isGpt51Family(model)         // gpt-5.1*
isGptCodexFamily(model)      // gpt-*-codex*
```

### Capability-Based Tool Selection

| Function | What It Decides |
|---|---|
| `modelSupportsApplyPatch()` | Use `apply_patch` for code edits |
| `modelSupportsReplaceString()` | Use `replace_string_in_file` |
| `modelSupportsMultiReplaceString()` | Use `multi_replace_string_in_file` |
| `modelCanUseReplaceStringExclusively()` | Skip `insert_edit_into_file` |
| `modelCanUseApplyPatchExclusively()` | Skip other edit tools |
| `modelShouldUseReplaceStringHealing()` | Auto-fix incorrect edits (gemini-2) |
| `modelCanUseMcpResultImageURL()` | Image URLs in MCP results |
| `modelSupportsPDFDocuments()` | Native PDF processing (Anthropic only) |
| `modelPrefersJsonNotebookRepresentation()` | JSON vs text notebooks |
| `modelPrefersInstructionsInUserMessage()` | System vs user message (claude-3.5-sonnet) |
| `modelPrefersInstructionsAfterHistory()` | Instruction placement (claude-3.5-sonnet) |
| `modelNeedsStrongReplaceStringHint()` | Extra prompt nudging (Gemini, hidden-F) |

### Experiment-Gated Capabilities

Some capabilities are gated behind both model detection AND experiment flags:

```typescript
function isGpt54ConcisePromptExp(accessor, model) {
    return isGpt54(model) && configurationService.getExperimentBasedConfig(ConfigKey.EnableGpt54ConcisePromptExp, experimentationService);
}
```

### Alex Takeaway

- Hash-based model identification is clever for A/B testing — we could use a similar pattern for blind model comparisons
- Per-model tool selection is critical — different models handle edit tools differently
- The `getVerbosityForModelSync()` function adjusts prompt verbosity by model (gpt-5.1 and gpt-5-mini get `'low'`)
- Capability functions compose: `modelSupportsReplaceString` checks `modelSupportsMultiReplaceString` internally

---

## Appendix J: Hook System Interface — `src/platform/chat/common/chatHookService.ts`

### Purpose

Pre/post operation hooks that allow external processes to intercept, modify, or block agent actions.

### Service Interface

```typescript
interface IChatHookService {
    logConfiguredHooks(hooks): void;
    executeHook(hookType, hooks, input, sessionId?, token?): Promise<ChatHookResult[]>;
    executePreToolUseHook(toolName, toolInput, toolCallId, hooks, ...): Promise<IPreToolUseHookResult | undefined>;
    executePostToolUseHook(toolName, toolInput, toolResponseText, ...): Promise<IPostToolUseHookResult | undefined>;
}
```

### Hook Types

| Hook | When | Input | Can Block? |
|---|---|---|---|
| `UserPromptSubmit` | Before user prompt reaches agent | `{ prompt }` | Yes (`decision: 'block'`) |
| `Stop` | When agent tries to stop | `{ stop_hook_active }` | Yes (force continue) |
| `SessionStart` | New chat session begins | `{ source: 'new' }` | No (context injection) |
| `SubagentStart` | Subagent spawned | `{ agent_id, agent_type }` | No (context injection) |
| `SubagentStop` | Subagent tries to stop | `{ agent_id, agent_type, stop_hook_active }` | Yes (force continue) |
| `preToolUse` | Before tool execution | `{ toolName, toolInput, toolCallId }` | Yes (deny/ask/allow) |
| `postToolUse` | After tool execution | `{ toolName, toolInput, toolResponseText }` | Yes (`decision: 'block'`) |

### Permission Collapse Model

Multiple hooks' decisions are collapsed via "most restrictive wins":

```typescript
const permissionPriority = { 'deny': 2, 'ask': 1, 'allow': 0 };
```

- `updatedInput` uses the **last** hook's value
- `additionalContext` is **collected** from all hooks

### Hook Result Types

```typescript
interface IPreToolUseHookResult {
    permissionDecision?: 'allow' | 'deny' | 'ask';
    permissionDecisionReason?: string;
    updatedInput?: object;
    additionalContext?: string[];
}

interface IPostToolUseHookResult {
    decision?: 'block';
    reason?: string;
    additionalContext?: string[];
}
```

### Implementation (`ChatHookService`)

- Session transcript flushed to disk before hooks run (so hook scripts see current state)
- External hooks run via `IHookExecutor` with stdin/stdout JSON protocol
- Exit code semantics: `0` = success, `2` = blocking error, other = non-blocking
- Compatible hook event names: `Stop` ↔ `SubagentStop`, `SessionStart` ↔ `SubagentStart`
- Input key redaction: `toolArgs` and `tool_input` are redacted in logs
- OTEL span instrumentation on every hook execution
- Race timeout prevents hung hooks from blocking indefinitely

### Alex Takeaway

- The **deny > ask > allow** collapse model is production-proven for multi-hook governance
- Hook-based QA gates (pre/post tool use) can enforce our quality standards
- `Stop` hooks that force continuation are how autonomous agents implement "don't stop until done"
- `additionalContext` injection from hooks is how external knowledge enters the agent's context mid-turn
- The session transcript flush pattern ensures hook scripts always have current state

---

## Appendix K: Custom Instructions Pipeline — `src/platform/customInstructions/common/customInstructionsService.ts`

### Purpose

Discovers, loads, and resolves `.instructions.md`, `.prompt.md`, `SKILL.md`, and `copilot-instructions.md` files for prompt injection.

### Key Interface

```typescript
interface ICustomInstructionsService {
    fetchInstructionsFromSetting(configKey): Promise<ICustomInstructions[]>;
    fetchInstructionsFromFile(fileUri): Promise<ICustomInstructions | undefined>;
    getAgentInstructions(): Promise<URI[]>;
    parseInstructionIndexFile(text): IInstructionIndexFile;
    isExternalInstructionsFile(uri): Promise<boolean>;
    isSkillFile(uri): boolean;
    isSkillMdFile(uri): boolean;
    getSkillInfo(uri): { skillName, skillFolderUri } | undefined;
    refreshExtensionPromptFiles(): Promise<void>;
    getExtensionSkillInfo(uri): { skillName, skillFolderUri, extensionId? } | undefined;
}
```

### Three Location Matchers (Observable-Based)

The service maintains three reactive matchers that auto-update when configuration or workspace changes:

1. **`_matchInstructionLocationsFromConfig`** — paths listed in `chat.instructionFilesLocations` setting:
   - Supports `~/` (user home) and absolute paths
   - File must end with `.instructions.md`
   - Uses glob matching against folder and file paths

2. **`_matchInstructionLocationsFromExtensions`** — extension-contributed `chatInstructions`:
   - Reads `packageJSON.contributes.chatInstructions[].path`
   - Builds a `ResourceSet` of contributing extension folders
   - `isEqualOrParent` check for containment

3. **`_matchInstructionLocationsFromSkills`** — skill file detection:
   - Gated by `USE_AGENT_SKILLS_SETTING`
   - Scans `PERSONAL_SKILL_FOLDERS` (user home) and `WORKSPACE_SKILL_FOLDERS` (per workspace folder)
   - Supports additional config-based skill locations
   - Returns `{ skillName, skillFolderUri }` from relative path parsing
   - Extension-contributed skills also detected

### Skill Detection Logic

```typescript
// For workspace/personal skills:
const relativePath = relative(topLevelSkillFolder, uri);
const skillName = relativePath.split('/')[0]; // First segment = skill name
const skillFolderUri = joinPath(topLevelSkillFolder, skillName);

// For extension skills:
getExtensionSkillInfo(uri) // Checks cached extension prompt files
```

### Index File Parsing

Parses instruction index files into structured sets: `instructions`, `skills`, `skillFolders`, `agents`.

### Alex Takeaway

- Our `.github/skills/`, `.github/instructions/`, and `.github/agents/` are loaded by exactly these code paths
- The observable-based matcher pattern means settings changes immediately update available instructions
- Extension-contributed skills show how third-party skills can be injected
- `PERSONAL_SKILL_FOLDERS` and `WORKSPACE_SKILL_FOLDERS` constants define the canonical search paths — our skills must live in these locations to be discovered

---

## Appendix L: BYOK Multi-Provider System — `src/extension/byok/common/byokProvider.ts`

### Purpose

Enables users to bring their own API keys for OpenAI, Azure, Ollama, and other providers — a production multi-provider abstraction.

### Three Auth Types

```typescript
enum BYOKAuthType {
    GlobalApiKey,       // Single key for all models (OpenAI)
    PerModelDeployment, // URL + key per model (Azure)
    None                // No auth required (Ollama)
}
```

### Model Config Types

```typescript
// OpenAI: just an API key
interface BYOKGlobalKeyModelConfig { modelId, apiKey, capabilities? }

// Azure: deployment URL + key
interface BYOKPerModelConfig { modelId, apiKey, deploymentUrl, capabilities? }

// Ollama: no auth
interface BYOKNoAuthModelConfig { modelId, capabilities? }
```

### Model Capabilities

```typescript
interface BYOKModelCapabilities {
    name: string;
    url?: string;
    maxInputTokens: number;
    maxOutputTokens: number;
    toolCalling: boolean;
    vision: boolean;
    thinking?: boolean;
    adaptiveThinking?: boolean;
    streaming?: boolean;
    editTools?: EndpointEditToolName[];
    requestHeaders?: Record<string, string>;
    supportedEndpoints?: ModelSupportedEndpoint[];
    zeroDataRetentionEnabled?: boolean;
}
```

### `resolveModelInfo()` — Capability Resolution

Priority: **user-specified capabilities > known model database > defaults**

```typescript
function resolveModelInfo(modelId, providerName, knownModels, modelCapabilities?): IChatModelInformation {
    let knownModelInfo = modelCapabilities;  // User override first
    if (knownModels && !knownModelInfo) {
        knownModelInfo = knownModels[modelId]; // Known model DB
    }
    // Default: 128k context, 100k prompt, 8k output, no tools/vision
}
```

### Enablement Check

```typescript
function isBYOKEnabled(copilotToken, capiClientService): boolean {
    if (isScenarioAutomation) return true;
    const isGHE = capiClientService.dotcomAPIURL !== 'https://api.github.com';
    return (copilotToken.isInternal || copilotToken.isIndividual) && !isGHE;
}
```

BYOK is available to internal/individual users on github.com (not GHE), plus always in test automation.

### API Key CRUD

```typescript
interface IBYOKStorageServiceLike {
    getAPIKey(providerName, modelId?): Promise<string | undefined>;
    storeAPIKey(providerName, apiKey, authType, modelId?): Promise<void>;
    deleteAPIKey(providerName, authType, modelId?): Promise<void>;
}
```

The `handleAPIKeyUpdate()` utility handles three outcomes: cancelled (undefined), deleted (empty string during reconfigure), or stored (new key).

### Alex Takeaway

- Three auth types cover the major provider patterns — future Alex cloud support should use the same abstraction
- `BYOKKnownModels` (Record<id, capabilities>) is a good pattern for maintaining a model database
- Capability resolution priority (user > known > default) prevents silent failure with unknown models
- The `editTools` capability maps directly to `byokEditToolNamesToToolNames` — providers can declare which edit tools their models support

---

## 13. Advanced Session Control Patterns

### Turn Lifecycle State Machine

Each `Turn` in `src/extension/prompt/common/conversation.ts` has a complete lifecycle:

```
TurnStatus enum:
  InProgress → Success | Cancelled | OffTopic | Filtered | PromptFiltered | Error
```

**Turn message types**: `'user' | 'follow-up' | 'template' | 'offtopic-detection' | 'model' | 'meta' | 'server'`

Key fields per turn:
- `startTime` — epoch timestamp
- `promptVariables` — `ChatVariablesCollection` (file attachments, selections, tool references)
- `toolReferences` — `InternalToolReference[]` (explicit tool requests from user)
- `rounds` — `IToolCallRound[]` (each LLM call + tool invocations in the agentic loop)
- `isContinuation` — `true` when user clicked "Continue" on rate limit or accepted tool call limits
- `pendingSummaries` — background compaction summaries stored during the tool-call loop

**Alex leverage**: The `Turn` object is the atomic unit of conversation state. Each turn tracks its own tool call rounds, metadata, and summaries independently. Our sessions should mirror this — one `Turn` per user message, with nested rounds for multi-step tool use.

### Conversation Store & Session Cleanup

`ConversationStore` (`src/extension/conversationStore/node/`) uses an **LRU cache** (cap: 1000 conversations) keyed by `responseId`:

```typescript
conversationMap = new LRUCache<string, Conversation>(1000);
```

Cleanup is **session-scoped with delay**: when `onDidDisposeChatSession` fires, a timeout (configurable) schedules removal of all conversations for that session. New requests cancel pending cleanups.

**Alex leverage**: LRU + delayed cleanup is a production-proven pattern for memory management. Our session store should use the same approach — bounded cache with deferred GC.

### Session Transcript Service

`SessionTranscriptService` (`src/extension/chat/vscode-node/sessionTranscriptService.ts`) writes complete conversation transcripts to workspace storage:

- Starts with `session.start` entry (sessionId, version, producer, copilotVersion, vscodeVersion, cwd)
- Each entry has: `type`, `data`, `id`, `timestamp` (ISO 8601), `parentId` (linked list for ordering)
- Entry types: `session.start`, `user.message`, `assistant.message`, `tool.call`, `tool.result`

**Alex leverage**: This is our audit trail. Every session can be reconstructed from transcript files. Our meditation/dream-state protocols should read these transcripts for pattern extraction.

### Git Worktree Checkpointing

`ChatSessionWorktreeCheckpointService` (`src/extension/chatSessions/vscode-node/chatSessionWorktreeCheckpointServiceImpl.ts`) creates **git-based checkpoints** at each turn boundary:

1. On first request: creates baseline checkpoint (turn 0) from HEAD
2. After each request completes: captures full working directory state as a new checkpoint
3. Checkpoints stored as git refs: `refs/sessions/<sessionId>/checkpoints/turn/<N>`

Implementation uses temp index files to avoid disturbing the working tree:
```
git read-tree <parent> → GIT_INDEX_FILE
git add -A . → GIT_INDEX_FILE
git write-tree → GIT_INDEX_FILE
git commit-tree <tree> -p <parent>
git update-ref refs/sessions/<id>/checkpoints/turn/<N> <commit>
```

**Alex leverage**: This is perfect for our "undo last N turns" capability. Each checkpoint is a complete workspace snapshot that can be restored with `git checkout`. Our safety imperative I5 (commit before risky ops) could use this exact pattern.

---

## 14. Context Window Mastery

### Token Budget Architecture

The prompt system uses **declarative token budgeting** via `@vscode/prompt-tsx`:

**Priority system** (higher = more important, like z-index):
| Priority Range | Content Type |
|---|---|
| 1000 | System message, safety rules |
| 900 | User query, current request |
| 898-899 | Tool call rounds, tool references |
| 800 | Workspace structure hints |
| 750 | Custom instructions |
| 700 | Conversation history |
| 600 | Project labels, background info |
| 0-500 | Low-priority context |

**Flex properties** control token allocation:
- `flexGrow={N}` — relative weight for remaining space
- `flexReserve={tokens}` — minimum reservation (e.g., `sizing.tokenBudget * 0.8`)
- `passPriority` — transparent containers that don't affect child priorities

**TextChunk truncation**:
```tsx
<TextChunk breakOnWhitespace priority={100}>
    {longContent}
</TextChunk>
```

**Alex leverage**: Our instruction/skill files consume significant tokens. We should:
1. Assign priorities to instruction categories (safety > active task > background knowledge)
2. Use `flexGrow` to let high-value context expand when budget permits
3. Apply the MAX_TOOL_RESPONSE_PCT (50%) cap — no single tool result should dominate context

### Context Window Scaling Trick

`AnthropicAdapter` (`src/extension/agents/node/adapters/anthropicAdapter.ts`) **lies to the agent about context window size**:

```typescript
const realContextLimit = context.endpoint.modelMaxPromptTokens;
const agentAssumedContextLimit = 200000; // Agent thinks it has 200k
const scalingFactor = agentAssumedContextLimit / realContextLimit;
const adjustedPromptTokens = Math.floor(usage.prompt_tokens * scalingFactor);
```

This makes the agent think it has a 200k context window even when the real one is smaller, preventing premature context-saving behavior.

**Alex leverage**: When using smaller models for subtasks, scale reported usage so Alex doesn't trigger unnecessary summarization or context compression.

### Background Summarization State Machine

`BackgroundSummarizer` (`src/extension/prompts/node/agent/backgroundSummarizer.ts`):

```
Idle → InProgress → Completed / Failed
                         ↓          ↓
                   consumeAndReset → Idle
                              Failed → InProgress (retry)
```

Tracks per-session, per-round summarization with token metrics (`promptTokens`, `outputTokens`, `durationMs`, model, mode).

### Conversation Normalization

`normalizeSummariesOnRounds()` reconciles summaries across turns — summaries can be produced for **previous** turns while the current turn is still running. This cross-turn patching is essential for background compaction.

### Cache Breakpoint Strategy

`addCacheBreakpoints()` (`src/extension/intents/node/cacheBreakpoints.ts`) places up to `MaxCacheBreakpoints` strategic cache points:

- Below current user message: last tool result in each round, user message
- Above current user message: assistant messages with no tool calls
- Remaining budget: system and custom instructions messages

**Alex leverage**: Cache breakpoints reduce API cost by enabling prompt caching. Our sessions should place breakpoints at instruction boundaries and after stable context sections.

---

## 15. Response Stream Control

### Full Stream API Surface

`ChatResponseStreamImpl` (`src/util/common/chatResponseStreamImpl.ts`) exposes these capabilities:

| Method | Purpose | Alex Use Case |
|---|---|---|
| `markdown(value)` | Render markdown text | Primary output |
| `button(command)` | Clickable action button | Post-task actions, persona switches |
| `progress(value, task?)` | Progress indicator | Long operations, multi-step tasks |
| `thinkingProgress(delta)` | Extended thinking display | Show Alex's reasoning process |
| `warning(value)` | Warning message | Safety alerts, quality gates |
| `confirmation(title, msg, data, buttons?)` | Blocking confirmation dialog | Destructive operations (I5 compliance) |
| `questionCarousel(questions, allowSkip?)` | Multi-question input form | Requirement gathering, persona detection |
| `reference(value, icon?)` | File/location reference | Cited sources |
| `reference2(value, icon?, options?)` | Reference with status badge | Truncation warnings |
| `anchor(value, title?)` | Clickable link | Cross-references |
| `textEdit(target, edits)` | Inline code edits | Direct file modifications |
| `externalEdit(target, callback)` | Track external changes | Tool-generated edits |
| `workspaceEdit(edits)` | File create/delete/rename | Project scaffolding |
| `beginToolInvocation(id, name, data?)` | Start streaming tool UI | Show tool in progress |
| `updateToolInvocation(id, data)` | Update tool progress | Streaming tool output |
| `clearToPreviousToolInvocation(reason)` | Undo last tool display | Error recovery |
| `hookProgress(type, reason?, msg?)` | Hook execution status | Safety gate feedback |
| `usage(usage)` | Report token consumption | Cost tracking |
| `filetree(value, baseUri)` | Directory tree display | Project structure |
| `codeCitation(uri, license, snippet)` | Code attribution | License compliance |
| `codeblockUri(uri, isEdit?)` | Link code block to file | Edit previews |

### Stream Participant Pipeline

`defaultIntentRequestHandler.ts` wraps the output stream through a **pipeline of participants**:

1. **Code block tracking** — counts and categorizes code blocks in response
2. **Edit survival tracking** — monitors whether AI edits persist or get reverted
3. **Interaction outcome** — tracks user engagement with the response
4. **Linkification** — auto-converts file paths to clickable links (unless disabled for subagents)
5. **Telemetry** — measures markdown and edit emissions

**Alex leverage**: The participant pipeline pattern lets us inject arbitrary processing into the response stream. We could add:
- Synapse detection (scan output for cross-project connections)
- Quality metrics (measure response coherence)
- Tone analysis (verify persona consistency)

### Follow-Up Provider Pattern

```typescript
participant.followupProvider = {
    provideFollowups(result, context, token) {
        // Access result.metadata to provide context-aware suggestions
        if (result.metadata?.command === 'learn') {
            return [
                { prompt: 'Quiz me on this topic', label: '📝 Quiz' },
                { prompt: '/meditate', label: '🧘 Meditate' }
            ];
        }
        return [];
    }
};
```

**Alex leverage**: Follow-ups are the primary way to guide conversation flow. We should return follow-ups based on:
- Active persona (Developer → suggest code review; Researcher → suggest literature search)
- Session objectives (if North Star goal active, suggest next step toward it)
- Detected patterns (if repeated errors, suggest debugging session)

---

## 16. Model Routing & Selection

### Model Metadata Resolution

`ModelMetadataFetcher` (`src/platform/endpoint/node/modelMetadataFetcher.ts`) resolves context windows through a priority chain:

1. **Experiment overrides** — `copilotchat.contextWindows` treatment variable (parsed as JSON)
2. **CAPI limits** — `max_prompt_tokens` from the Copilot API model capabilities
3. **Context window fallback** — `max_context_window_tokens` when prompt tokens not configured
4. **Output token cap** — `min(max_output_tokens, max_prompt_tokens * 0.15)`

### Per-Model Prompt Adaptation

The `PromptRegistry` resolves 5 customizable prompt components per model:

| Component | What It Controls |
|---|---|
| `SystemPrompt` | Core agent behavior instructions |
| `ReminderInstructions` | End-of-prompt reminders |
| `ToolReferencesHint` | How deferred tools are described |
| `TaskTrackingInstructions` | Todo list usage guidance |
| `ImplementationDiscipline` | Code quality standards |

Registered variants include: Claude Opus 4, Claude 4.5 Sonnet, Claude Haiku 4.5, GPT-4o, GPT-5, Gemini Flash, Gemini Pro, o3, o4-mini, and more.

Each variant tailors:
- Communication style (concise vs. verbose)
- Edit tool preferences (replace_string vs. apply_patch vs. edit_file)
- Context management instructions (compaction awareness for Anthropic)
- Linkification rules (file path formatting)

**Alex leverage**: Our per-persona prompt customization should follow this exact pattern — a `PersonaRegistry` that resolves Developer/Researcher/Builder/Validator-specific prompt components based on active persona.

### Agent Model Priority Lists

Agents declare model preferences as ordered lists:

```yaml
model: ['Claude Haiku 4.5', 'Gemini Flash', 'Auto']
```

The runtime tries each model in order, falling back through the list. This allows:
- Cost optimization (use cheaper models for search/exploration subagents)
- Capability matching (use Opus for complex reasoning, Haiku for simple lookups)
- Graceful degradation (fall back to Auto if specific models are unavailable)

**Alex leverage**: Our agent system should declare model preferences per-agent:
- Researcher: `['Claude Opus 4', 'GPT-5', 'Auto']` (needs deep reasoning)
- Explore: `['Claude Haiku 4.5', 'Gemini Flash', 'Auto']` (fast, cheap)
- Validator: `['Claude Opus 4', 'o3', 'Auto']` (adversarial reasoning)

---

## 17. Custom Instructions Injection Surface

### Instruction Loading Pipeline

`CustomInstructionsService` (`src/platform/customInstructions/common/customInstructionsService.ts`) provides multiple injection points:

1. **Workspace instructions** — `.github/copilot-instructions.md` (always loaded when `chat.useInstructionFiles` enabled)
2. **File instructions** — `.github/instructions/*.instructions.md` with `applyTo` glob patterns
3. **Setting-based instructions** — `github.copilot.chat.codeGeneration.instructions` setting (workspace, user, folder level)
4. **Extension-contributed instructions** — `contributes.chatInstructions` in extension `package.json`
5. **Skill files** — `.github/skills/*/SKILL.md` (loaded on-demand via description matching)

### Priority in the Prompt

Custom instructions land at **priority 750** in the prompt tree:
```tsx
<CustomInstructions flexGrow={6} priority={750} languageId={undefined} chatVariables={chatVariables} />
```

This places them between conversation history (700) and tool references (898-899) — important enough to survive most pruning, but not as critical as the user's actual query.

### Setting: Instructions in System vs. User Message

```typescript
ConfigKey.Advanced.CustomInstructionsInSystemMessage = 'chat.customInstructionsInSystemMessage'
```

When enabled, custom instructions move from UserMessage to SystemMessage — which changes how models weight them (system instructions typically take higher precedence).

**Alex leverage**: Our `copilot-instructions.md` carries the full Alex identity. Understanding the priority 750 placement means we know our instructions survive unless the context window is severely constrained. The `CustomInstructionsInSystemMessage` toggle is powerful — it elevates our instructions to system-level authority.

### Extension Contribution Points

Extensions can contribute instructions via `package.json`:
```json
{
    "contributes": {
        "chatInstructions": [
            { "path": "./instructions/my-instructions.md" }
        ]
    }
}
```

These are discovered via `extension.packageJSON['contributes']['chatInstructions']` at runtime and merged with workspace instructions.

---

## 18. Subagent Delegation Architecture

### Subagent Invocation Flow

The tool-calling loop spawns subagents via `runSubagent` tool:
- Each subagent gets its own **session ID** (derived from `token.subAgentInvocationId`)
- Subagent runs in an **isolated context** — its own conversation, tool set, and model
- Results return as a single tool result to the parent agent

### Subagent Types in Production

| Subagent | Model | Purpose |
|---|---|---|
| `search_subagent` | Haiku/Flash | Fast codebase exploration, read-only |
| `execution_subagent` | Same as parent | Run terminal commands, filter output |
| `codebase` (Explore agent) | Haiku/Flash | Semantic code search |

### Subagent Session Tracking

- Debug logs: `runSubagent-<agentName>-<uuid>.jsonl`, `searchSubagent-<uuid>.jsonl`
- Trajectory: Subagent trajectories are recursively collected during export
- Session IDs: `token.subAgentInvocationId` becomes the child's session ID

### Claude Code Subagent Pattern

In the Claude SDK integration, subagent sessions are persisted as:
```
~/.claude/projects/<workspace>/{session-id}/subagents/agent-*.jsonl
```

### Steering (Mid-Turn User Input)

When a user sends a new message while the agent is still running, the system routes through `_handleRequestSteering`:
- New prompt sent with `mode: 'immediate'`
- Both the steering send and original request run concurrently
- The session detects it's still busy and handles the interrupt gracefully

**Alex leverage**: We should implement steering for Alex sessions — allowing Fabio to redirect mid-operation without canceling. The `mode: 'immediate'` pattern with concurrent completion is elegant.

---

## 19. Slash Command Extensibility

### Claude Slash Command Registry

`ClaudeSlashCommandRegistry` (`src/extension/chatSessions/claude/vscode-node/slashCommands/`) provides a clean extension pattern:

```typescript
interface IClaudeSlashCommandHandler {
    readonly commandName: string;      // "hooks" for /hooks
    readonly description: string;
    readonly commandId?: string;       // "copilot.claude.hooks" for Command Palette
    handle(args: string, stream: ChatResponseStream | undefined, token: CancellationToken): Promise<ChatResult | void>;
}

// Self-registration at module load time
registerClaudeSlashCommand(MyCommand);
```

Registered commands:
- `/hooks` — Configure tool execution hooks
- `/agents` — List and manage custom agents
- `/memory` — View and manage session memories

### Slash Command Resolution

1. Check `request.command` (VS Code UI-selected slash command)
2. Fall back to parsing `/command args` from `request.prompt`
3. Look up handler in `_handlerCache` (Map<string, handler>)
4. If `commandId` provided, also registers as VS Code Command Palette item

**Alex leverage**: Our Alex-specific commands (`/meditate`, `/dream`, `/self-actualize`, `/health`) should use this exact pattern — self-registering handlers with optional Command Palette integration.

---

## 20. Streaming Grammar & Response Parsing

### StreamingGrammar

`StreamingGrammar` (`src/extension/prompt/common/streamingGrammar.ts`) implements a **streaming state machine** for parsing model output:

- Processes text incrementally as deltas arrive
- Transitions between states based on token patterns
- Tracks `visited` states and accumulates content per-state
- Uses `breakOn` patterns for intelligent content chunking

This enables real-time parsing of structured model output (e.g., detecting when the model enters a code block, thinking block, or tool call).

**Alex leverage**: We could use this to detect when Alex starts outputting structured content (skill invocations, persona switches, cognitive protocol markers) and handle them inline during streaming.

---

## 21. Anthropic Extended Thinking

### Configuration

```typescript
ConfigKey.Advanced.AnthropicThinkingBudget = 'chat.anthropic.thinking.budgetTokens' (default: 16000)
ConfigKey.Advanced.ForceAnthropicExplicitThinking = 'chat.forceExplicitThinking' (default: false)
```

### Thinking Progress Display

The stream supports dedicated thinking progress via `thinkingProgress(delta)`:
```typescript
stream.thinkingProgress({
    text: thinkingContent,
    id: thinkingBlockId,
    metadata: { /* provider-specific */ }
});
```

This renders as collapsible "thinking" blocks in the UI, separate from the main response.

**Alex leverage**: Extended thinking is perfect for our deep-thinking skill. When Alex enters analytical mode, we can stream the reasoning process via `thinkingProgress` while building the actual response. This makes the internal reasoning visible without cluttering the output.

---

## 22. Context Compaction (Anthropic)

### How It Works

When enabled via configuration + model capabilities, the agent can work on tasks of **unlimited length** through automatic context compaction:

```tsx
<Tag name='contextManagement'>
    Your context window is automatically managed through compaction, enabling you
    to work on tasks of any length without interruption. Work as persistently and
    autonomously as needed to complete tasks fully.
</Tag>
```

The prompt explicitly instructs the model to:
- Never discuss context limits with the user
- Never output meta-commentary about context management
- Never narrate memory saving
- Work as long as needed without preemptive stopping

### Compaction Boundary Message

When compaction occurs, the Claude SDK sends a `compact_boundary` system message, which Copilot renders as:
```typescript
request.stream.markdown(`*${l10n.t('Conversation compacted')}*`);
```

**Alex leverage**: Context compaction is the solution to our long-session problem. With Anthropic models, Alex can run meditation sessions, deep research, and multi-file refactoring without hitting context limits. The anti-narration instructions are critical — without them, Claude wastes tokens discussing its own context state.

---

## 23. Question Carousel (Interactive Input)

### API

```typescript
stream.questionCarousel(questions: ChatQuestion[], allowSkip?: boolean): Thenable<Record<string, unknown> | undefined>;
```

This is a **blocking call** that renders an inline set of questions in the chat UI and waits for user response. Maps to the `vscode_askQuestions` tool in the tool system.

**Alex leverage**: This is the API behind our `vscode_askQuestions` tool. We can use it for:
- Persona detection questionnaires
- Requirement gathering at session start
- Multi-choice skill selection when intent is ambiguous
- Safety confirmation dialogs for destructive operations

---

## 24. Confirmation Dialogs (Safety Gates)

### API

```typescript
stream.confirmation(title: string, message: string | MarkdownString, data: any, buttons?: string[]): void;
```

Renders an inline confirmation with custom buttons. The response comes back via `request.acceptedConfirmationData` on the next turn.

### Production Usage

Used for:
- Cloud agent delegation consent
- Tool execution approval
- Rate limit "switch to auto" confirmations
- Worktree trust decisions

**Alex leverage**: Our safety imperative I5 (commit before risky operations) and adversarial oversight protocols should use `confirmation()` for destructive operations. The `data` parameter lets us pass arbitrary context through the confirmation flow.

---

## 25. Hook-Based Pre/Post Processing

### Available Hook Events for Session Control

| Hook | Trigger | Control |
|---|---|---|
| `SessionStart` | Session initialization | Inject Alex Active Context, set persona, load memory |
| `UserPromptSubmit` | Before prompt reaches agent | Secret scanning, safety gates, prompt preprocessing |
| `PreToolUse` | Before tool execution | Block destructive tools, inject safety checks |
| `PostToolUse` | After tool execution | Auto-format, quality checks, test suggestions |
| `Stop` | Session termination | Export insights, commit reminders, session metrics |
| `SubagentStart` | Subagent spawned | Inject Active Context into subagent |
| `SubagentStop` | Subagent finishes | Validate subagent output |
| `PreCompact` | Before context compaction | Save critical state before context is summarized |

### Hook Execution Protocol

Hooks run as **external processes** with stdin/stdout JSON:
- Input: `{ "event": "PreToolUse", "toolName": "run_in_terminal", "toolInput": {...} }`
- Output: `{ "decision": "allow" | "deny" | "ask", "reason": "...", "additionalContext": ["..."] }`
- Exit codes: `0` = success, `2` = blocking error, other = non-blocking failure

The session transcript is **flushed to disk before hooks run** so hook scripts can read current conversation state.

**Alex leverage**: Hooks are the governance layer. We should implement:
- `SessionStart` hook: Load Alex identity, detect persona, set Active Context
- `PreToolUse` hook: Enforce I5 (commit before file edits), validate against adversarial protocols
- `PostToolUse` hook: Auto-run linting after edits, suggest tests after code changes
- `Stop` hook: Export session metrics, trigger knowledge synthesis if significant insights were generated

---

## Summary of New Findings for Alex

### Immediate Action Items

1. **Turn-based state tracking**: Mirror the `Turn` → `ToolCallRound` → `Summary` structure for Alex sessions
2. **LRU conversation cache**: Adopt `LRUCache<string, Conversation>(1000)` with session-scoped cleanup
3. **Git checkpoint per turn**: Implement `refs/sessions/<id>/checkpoints/turn/<N>` for undo capability
4. **Token priority assignment**: Assign Alex instructions priority 750, safety rules 1000, user query 900
5. **Follow-up provider**: Return persona-aware suggestions after every response
6. **Question carousel**: Use for persona detection and requirement gathering
7. **Confirmation dialogs**: Wire I5 safety imperative through `stream.confirmation()`
8. **Context compaction**: Enable for long sessions with anti-narration instructions
9. **Extended thinking**: Route deep-thinking skill through `thinkingProgress` API
10. **Slash commands**: Self-register `/meditate`, `/dream`, `/health` via the command registry pattern

### Architecture Patterns to Adopt

| Pattern | Source | Alex Application |
|---|---|---|
| Turn lifecycle state machine | `conversation.ts` | Session state tracking |
| LRU + delayed cleanup | `conversationStore.ts` | Memory management |
| Git worktree checkpoints | `chatSessionWorktreeCheckpointServiceImpl.ts` | Undo/restore safety net |
| Token budget priorities | `agentPrompt.tsx` + `prompt-tsx` | Instruction token management |
| Context window scaling | `anthropicAdapter.ts` | Prevent premature summarization |
| Response stream pipeline | `defaultIntentRequestHandler.ts` | Output quality monitoring |
| Follow-up provider | Chat API | Guided conversation flow |
| Slash command registry | `claudeSlashCommandRegistry.ts` | Alex-specific commands |
| Background summarization | `backgroundSummarizer.ts` | Long session context management |
| Streaming grammar | `streamingGrammar.ts` | Real-time output parsing |
| Confirmation flow | `copilotCloudSessionsProvider.ts` | Safety gate dialogs |
| Hook governance layer | `chatHookService.ts` | Pre/post operation control |
