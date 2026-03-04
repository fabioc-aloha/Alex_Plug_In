# @alex Participant Enhancement Plan

**Date**: 2026-02-14
**Status**: Proposed
**Goal**: Transform the @alex chat participant from a lightweight passthrough into a fully cognitive assistant that leverages the brain, tools, memory, and persona system — delivering an experience **superior** to agent mode for Alex-specific tasks.

---

## The Opportunity

The [PROMPT-PIPELINE-ANATOMY.md](../architecture/PROMPT-PIPELINE-ANATOMY.md) research revealed a critical gap:

| Capability                         | Agent Mode      | @alex Now   | @alex Enhanced                |
| ---------------------------------- | --------------- | ----------- | ----------------------------- |
| Copilot system prompt              | ✅ (auto)        | ❌           | N/A (we replace it)           |
| Identity (copilot-instructions.md) | ✅ (auto)        | ❌           | ✅ (injected at build)         |
| Persona awareness                  | ❌               | ✅ (partial) | ✅ (full)                      |
| User profile                       | ❌               | ✅           | ✅                             |
| Focus session                      | ❌               | ✅           | ✅                             |
| Active Context                     | ✅ (via brain)   | ❌           | ✅ (live read)                 |
| Emotional intelligence             | ❌               | ✅           | ✅                             |
| Conversation history               | ✅ (auto)        | ❌           | ✅ (injected)                  |
| Tool calling                       | ✅ (auto)        | ❌           | ✅ (via `sendRequest` options) |
| Memory search                      | ✅ (via LM tool) | ❌           | ✅ (pre-seeded context)        |
| Model tier detection               | ❌               | ❌           | ✅ (adaptive prompt)           |
| Avatar integration                 | ❌               | ❌           | ✅ (persona-matched)           |
| Appropriate reliance               | ❌               | ❌           | ✅ (confidence signaling)      |
| Skill routing                      | ✅ (via catalog) | ❌           | ✅ (intelligent pre-load)      |
| File context                       | ✅ (auto)        | ❌           | ✅ (from request.references)   |

**Key insight**: Agent mode is a *generic* pipeline that happens to inject Alex's files. @alex can be a *purpose-built* cognitive assistant with full control over every token.

---

## Architecture: The Alex Prompt Engine

### Current Architecture (2 messages)

```
handleGeneralQuery()
  └─ messages = [
       User(hardcoded system prompt),   ← ~500 tokens, static
       User(request.prompt)             ← user's raw text
     ]
  └─ model.sendRequest(messages, {}, token)
```

### Enhanced Architecture (Multi-layer Prompt Engine)

```
handleGeneralQuery()
  └─ buildAlexPrompt()                  ← NEW: modular prompt builder
       ├─ Layer 1: Identity Core         ← from copilot-instructions.md (live read)
       ├─ Layer 2: Active Context        ← from ActiveContextManager
       ├─ Layer 3: Persona Context       ← detected persona + avatar + focus trifectas
       ├─ Layer 4: User Profile          ← existing personalization
       ├─ Layer 5: Focus Session         ← existing Pomodoro/goals
       ├─ Layer 6: Emotional State       ← existing unconscious mind
       ├─ Layer 7: Conversation Memory   ← from context.history (compressed)
       ├─ Layer 8: Relevant Knowledge    ← pre-searched from memory/skills
       ├─ Layer 9: Model-Adaptive Rules  ← behavior tuned to detected model tier
       └─ Layer 10: Response Guidelines  ← formatting, confidence, tone
  └─ messages = [
       User(builtPrompt),               ← ~1,500-2,500 tokens, dynamic
       ...historyMessages,              ← compressed prior turns
       User(contextualizedRequest)       ← user prompt + file context
     ]
  └─ model.sendRequest(messages, { tools }, token)
                                          ↑ TOOLS now available!
```

---

## Implementation Phases

### Phase 0: Foundation — Prompt Builder Module (PREREQUISITE)

**New file**: `src/chat/promptEngine.ts`

Create a modular prompt builder that assembles the system prompt from discrete layers. Each layer is a function that returns a string (or empty string if not applicable). This replaces the hardcoded template in `handleGeneralQuery()`.

```typescript
// src/chat/promptEngine.ts

export interface PromptContext {
    workspaceRoot: string;
    profile: IUserProfile | null;
    session: SessionState | null;
    goals: GoalsSummary;
    persona: DetectedPersona | null;
    emotionalState: EmotionalState;
    model: DetectedModel;
    history: vscode.ChatContext;
    request: vscode.ChatRequest;
}

export async function buildAlexSystemPrompt(ctx: PromptContext): Promise<string> {
    const layers = [
        buildIdentityLayer(ctx),               // Layer 1
        buildActiveContextLayer(ctx),          // Layer 2
        buildPersonaLayer(ctx),                // Layer 3
        buildUserProfileLayer(ctx),            // Layer 4
        buildFocusLayer(ctx),                  // Layer 5
        buildEmotionalLayer(ctx),              // Layer 6
        buildKnowledgeLayer(ctx),              // Layer 8
        buildModelAdaptiveLayer(ctx),          // Layer 9
        buildResponseGuidelinesLayer(ctx),     // Layer 10
    ];

    const parts = await Promise.all(layers);
    return parts.filter(Boolean).join('\n\n');
}
```

**Why a module**: The current `handleGeneralQuery()` is a 180-line monolith. Extracting the prompt builder makes each layer independently testable, swappable, and token-budgetable.

**Token budget**: Each layer has a target token budget. The builder tracks total tokens and can truncate lower-priority layers if the model's context window is constrained.

---

### Phase 1: Brain Injection — Read copilot-instructions.md at Runtime

**Problem**: @alex completely ignores the brain file that defines Alex's identity.

**Solution**: Read the relevant sections of copilot-instructions.md and inject them into the system prompt.

#### Layer 1: Identity Core

```typescript
async function buildIdentityLayer(ctx: PromptContext): Promise<string> {
    // Read copilot-instructions.md
    const brainPath = path.join(ctx.workspaceRoot, '.github', 'copilot-instructions.md');
    if (!await fs.pathExists(brainPath)) return '';

    const brain = await fs.readFile(brainPath, 'utf-8');

    // Extract Identity section (between ## Identity and next ##)
    const identityMatch = brain.match(/## Identity\n([\s\S]*?)(?=\n## )/);
    // Extract Routing section (for skill discovery)
    const routingMatch = brain.match(/## Routing\n([\s\S]*?)(?=\n## )/);
    // Extract Safety Imperatives
    const safetyMatch = brain.match(/## Safety Imperatives[^\n]*\n([\s\S]*?)(?=\n## )/);

    return `## Who I Am
${identityMatch?.[1]?.trim() || 'I am Alex "Mini" Finch.'}

## How I Find Capabilities
${routingMatch?.[1]?.trim() || ''}

## Safety Rules
${safetyMatch?.[1]?.trim() || ''}`;
}
```

**Token cost**: ~400 tokens (Identity + Routing + Safety from the ~1,100 token brain file — skip sections not needed for chat like Heirs, Commands, VS Code Settings, Global Knowledge).

**Impact**: Alex will actually *know who he is* in @alex mode. Currently, the system prompt says "You are Alex, an Enhanced Cognitive Network" — a generic description. With this layer, Alex gets the full v3-identity-first personality.

#### Layer 2: Active Context (Live State)

```typescript
async function buildActiveContextLayer(ctx: PromptContext): Promise<string> {
    const activeCtx = await readActiveContext(ctx.workspaceRoot);
    if (!activeCtx) return '';

    return `## Current State
- Persona: ${activeCtx.persona || 'Unknown'}
- Objective: ${activeCtx.objective || 'None set'}
- Focus Areas: ${activeCtx.focusTrifectas || 'general'}
- Principles: ${activeCtx.principles || 'KISS, DRY'}
- Last Self-Assessment: ${activeCtx.lastAssessed || 'never'}`;
}
```

**Token cost**: ~60 tokens.

**Impact**: @alex will know the detected persona, current objective, and focus trifectas — without the user having to repeat context from previous sessions.

---

### Phase 2: Tool Calling — Give @alex Hands

**Problem**: `model.sendRequest(messages, {}, token)` passes empty options — no tools.

**Solution**: Provide Alex's registered tools so the LLM can invoke them during @alex conversations.

```typescript
// In handleGeneralQuery(), replace:
const response = await model.sendRequest(messages, {}, token);

// With:
const toolReferences = getAlexToolReferences();
const response = await model.sendRequest(messages, { tools: toolReferences }, token);

// Then handle tool calls in the response stream:
for await (const part of response.stream) {
    if (part instanceof vscode.LanguageModelTextPart) {
        stream.markdown(part.value);
    } else if (part instanceof vscode.LanguageModelToolCallPart) {
        // Invoke the tool and feed result back
        const result = await vscode.lm.invokeTool(part.name, {
            input: part.input,
            toolInvocationToken: request.toolInvocationToken
        }, token);
        // Add tool result to messages and re-send for continuation
    }
}
```

**Tools available** (all stable API, already registered):

| Tool                                 | @alex Use Case                         |
| ------------------------------------ | -------------------------------------- |
| `alex_cognitive_memory_search`       | "What did we learn about React hooks?" |
| `alex_cognitive_architecture_status` | "How's my architecture health?"        |
| `alex_cognitive_synapse_health`      | "Are my connections healthy?"          |
| `alex_cognitive_user_profile`        | "Update my name to..."                 |
| `alex_cognitive_focus_context`       | "What am I working on?"                |
| `alex_knowledge_search`              | "Find patterns about error handling"   |
| `alex_knowledge_save_insight`        | "Save this as an insight"              |

**Token cost**: ~200-400 tokens for tool schemas.

**Impact**: @alex can actually *do things*, not just talk. Users can ask "search my memory for Azure patterns" and @alex will invoke the tool, get results, and synthesize a response — all within the @alex conversation.

---

### Phase 3: Conversation Continuity — Remember the Thread

**Problem**: @alex sends only 2 messages (system + current request). No history.

**Solution**: Build conversation history from `context.history` and inject as prior turns.

```typescript
function buildHistoryMessages(history: readonly (vscode.ChatRequestTurn | vscode.ChatResponseTurn)[]): vscode.LanguageModelChatMessage[] {
    const messages: vscode.LanguageModelChatMessage[] = [];

    // Keep last N turns to stay within token budget
    const recentHistory = history.slice(-8); // Last 4 exchanges

    for (const turn of recentHistory) {
        if (turn instanceof vscode.ChatRequestTurn) {
            messages.push(vscode.LanguageModelChatMessage.User(turn.prompt));
        } else if (turn instanceof vscode.ChatResponseTurn) {
            // Extract text from response parts
            const text = turn.response
                .filter((part): part is vscode.ChatResponseMarkdownPart => part instanceof vscode.ChatResponseMarkdownPart)
                .map(part => part.value.value)
                .join('');
            if (text) {
                messages.push(vscode.LanguageModelChatMessage.Assistant(text));
            }
        }
    }

    return messages;
}
```

**Updated message construction**:
```typescript
const messages: vscode.LanguageModelChatMessage[] = [
    vscode.LanguageModelChatMessage.User(systemPrompt),
    ...buildHistoryMessages(context.history),
    vscode.LanguageModelChatMessage.User(request.prompt)
];
```

**Token cost**: Variable (~500-2,000 tokens depending on history length).

**Impact**: Multi-turn conversations work naturally. "Follow up on that" and "what did I just ask you?" will work.

---

### Phase 4: Model-Adaptive Behavior

**Problem**: @alex always selects `gpt-4o` regardless of task complexity. No model awareness.

**Solution**: Use the existing `modelIntelligence.ts` module to detect the model tier and adapt the prompt.

```typescript
async function buildModelAdaptiveLayer(ctx: PromptContext): Promise<string> {
    const model = ctx.model;

    if (model.tier === 'frontier') {
        return `## Response Depth
You have deep reasoning capability. Use extended analysis, consider edge cases,
offer nuanced perspectives. Show your reasoning process for complex questions.`;
    }

    if (model.tier === 'capable') {
        return `## Response Depth
Balance depth with efficiency. Provide clear, practical answers.
Show reasoning for non-obvious conclusions.`;
    }

    // efficient tier
    return `## Response Depth
Keep responses focused and concise. Prioritize actionable answers.
Skip extended analysis — be direct and practical.`;
}
```

**Model selection upgrade**: Instead of hardcoding `gpt-4o`, select the best available model:

```typescript
// Current:
const models = await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4o' });

// Enhanced:
const models = await vscode.lm.selectChatModels({ vendor: 'copilot' });
const bestModel = selectBestModel(models); // From modelIntelligence.ts
```

**Token cost**: ~40 tokens.

**Impact**: @alex adapts its behavior to whichever model the user has access to. Frontier users get deeper reasoning; efficient-tier users get snappy responses.

---

### Phase 5: Pre-Seeded Knowledge Context

**Problem**: In agent mode, the LLM can search memory via tools. In @alex mode, there's no memory access at all (until Phase 2 adds tools). Even with tools, the first response has no memory context.

**Solution**: Before sending the prompt, proactively search memory for terms matching the user's request and inject relevant hits.

```typescript
async function buildKnowledgeLayer(ctx: PromptContext): Promise<string> {
    const query = ctx.request.prompt;

    // Quick keyword-based memory search (not LLM-powered, fast)
    const localHits = await quickMemorySearch(ctx.workspaceRoot, query, 3);
    const globalHits = await searchGlobalKnowledge(query, 3);

    if (localHits.length === 0 && globalHits.length === 0) return '';

    let context = '## Relevant Knowledge (from Alex\'s memory)\n';

    for (const hit of localHits) {
        context += `\n### ${hit.title} (${hit.type})\n${hit.excerpt}\n`;
    }

    for (const hit of globalHits) {
        context += `\n### ${hit.title} (Global: ${hit.category})\n${hit.excerpt}\n`;
    }

    return context;
}
```

**Token cost**: ~200-600 tokens (capped at 3 local + 3 global hits with excerpts).

**Impact**: @alex arrives at the conversation *already knowing* related context from its memory. This is better than agent mode where the LLM must decide to invoke a tool and wait for results.

---

### Phase 6: Persona-Driven Prompt Personality

**Problem**: @alex has a generic personality regardless of the detected persona.

**Solution**: Inject persona-specific behavioral tuning, avatar reference, and focus skills.

```typescript
async function buildPersonaLayer(ctx: PromptContext): Promise<string> {
    if (!ctx.persona) return '';

    const persona = ctx.persona;
    return `## Your Current Mode: ${persona.displayName}
${persona.description}

**Communication tone**: ${persona.tone}
**Focus skills**: ${persona.focusTrifectas.join(', ')}
**Banner message**: 🚀 Take Your ${persona.bannerNoun} to New Heights

When responding, lean into ${persona.displayName} expertise.
Reference ${persona.bannerNoun.toLowerCase()}-specific concepts naturally.`;
}
```

**Token cost**: ~80 tokens.

**Impact**: When Alex detects a "Researcher" persona, @alex responds with academic rigor. When it detects "Game Developer", responses tilt toward game dev concepts and patterns. The personality adapts per project.

---

### Phase 7: File Context from References

**Problem**: In agent mode, VS Code automatically provides file context. @alex gets none.

**Solution**: Extract from `request.references` (if available) and from the active editor.

```typescript
function buildFileContext(request: vscode.ChatRequest): string {
    const parts: string[] = [];

    // Check for #file references in the request
    if (request.references?.length) {
        for (const ref of request.references) {
            if (ref.value instanceof vscode.Uri) {
                parts.push(`Referenced file: ${ref.value.fsPath}`);
            }
        }
    }

    // Include active editor context
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selection = editor.selection;
        if (!selection.isEmpty) {
            const selectedText = editor.document.getText(selection);
            parts.push(`Selected code (${editor.document.languageId}):\n\`\`\`${editor.document.languageId}\n${selectedText}\n\`\`\``);
        } else {
            parts.push(`Active file: ${editor.document.fileName} (${editor.document.languageId})`);
        }
    }

    return parts.length > 0
        ? `## Context\n${parts.join('\n')}\n\n${request.prompt}`
        : request.prompt;
}
```

**Token cost**: Variable (depends on selection size).

**Impact**: Users can select code, type `@alex explain this`, and Alex actually sees the selected code.

---

### Phase 8: Appropriate Reliance — Confidence Signaling

**Problem**: Neither agent mode nor @alex tell the user when Alex is uncertain.

**Solution**: Add response guidelines that instruct Alex to signal confidence.

```typescript
function buildResponseGuidelinesLayer(ctx: PromptContext): string {
    return `## Response Guidelines

### Confidence Signaling
When answering, explicitly signal your confidence:
- **High confidence**: State facts directly
- **Medium confidence**: Preface with "Based on my understanding..." or "I believe..."
- **Low confidence**: Say "I'm not certain, but..." and suggest verification steps
- **Outside expertise**: Say "This is outside my current knowledge. I'd recommend..."

### Formatting
- Use markdown for code blocks, tables, and lists
- Keep responses focused on the user's actual question
- Suggest follow-up slash commands when relevant (e.g., "/meditate to consolidate this learning")

### Voice & Tone
- Warm but professional
- Curious and engaged
- Brief for simple questions, thorough for complex ones
- Always authentic — never pretend to know something you don't`;
}
```

**Token cost**: ~120 tokens.

**Impact**: This is a differentiator. Agent mode has Copilot's generic formatting rules. @alex has *Alex's* rules — including honesty about uncertainty, which is core to the Appropriate Reliance research.

---

## Token Budget Summary

| Layer                   | Tokens           | Priority | When Included              |
| ----------------------- | ---------------- | -------- | -------------------------- |
| 1. Identity Core        | ~400             | Critical | Always                     |
| 2. Active Context       | ~60              | Critical | Always                     |
| 3. Persona Context      | ~80              | High     | If persona detected        |
| 4. User Profile         | ~150             | High     | If profile exists          |
| 5. Focus Session        | ~100             | High     | If session active          |
| 6. Emotional State      | ~30              | Medium   | If strong emotion detected |
| 7. History              | ~500-2000        | High     | If history exists          |
| 8. Knowledge            | ~200-600         | Medium   | If relevant hits found     |
| 9. Model Adaptive       | ~40              | Medium   | Always                     |
| 10. Response Guidelines | ~120             | High     | Always                     |
| **Total system prompt** | **~1,200-3,500** |          |                            |
| Tool definitions        | ~300             | High     | When tools enabled         |
| File context            | Variable         | High     | If files referenced        |
| User message            | Variable         | Critical | Always                     |

**Comparison**: Agent mode's total injection is ~11,000-18,000 tokens (dominated by Copilot's system prompt and tool schemas). @alex's enhanced prompt is ~2,000-4,000 tokens — **5x more efficient** while being more Alex-specific.

---

## Implementation Priority

| Phase | Feature               | Impact                | Effort | Dependencies         | Priority |
| ----- | --------------------- | --------------------- | ------ | -------------------- | -------- |
| 0     | Prompt Engine module  | Foundation            | Medium | None                 | P0       |
| 1     | Brain injection       | Critical — identity   | Low    | Phase 0              | P0       |
| 3     | Conversation history  | High — usability      | Low    | None                 | P0       |
| 2     | Tool calling          | High — capability     | Medium | Phase 0              | P1       |
| 7     | File context          | High — usability      | Low    | None                 | P1       |
| 4     | Model-adaptive        | Medium — quality      | Low    | modelIntelligence.ts | P1       |
| 6     | Persona-driven prompt | Medium — personality  | Low    | personaDetection.ts  | P2       |
| 5     | Pre-seeded knowledge  | Medium — intelligence | Medium | memory search        | P2       |
| 8     | Confidence signaling  | Medium — trust        | Low    | None                 | P2       |

### Critical Path (P0 — ship first)

```
Phase 0: promptEngine.ts scaffold
   ↓
Phase 1: Identity + Active Context layers
   ↓
Phase 3: Conversation history injection
   ↓
Result: @alex that knows who it is and remembers the conversation
```

### High Value (P1 — ship next)

```
Phase 2: Tool calling (user can say "search my memory for X")
Phase 7: File context (user can reference code)
Phase 4: Model-adaptive (responses tuned to model tier)
```

### Personality Polish (P2 — refinement)

```
Phase 5: Pre-seeded knowledge
Phase 6: Persona-driven prompt
Phase 8: Confidence signaling
```

---

## File Changes Summary

| File                            | Change                                                         | Phase |
| ------------------------------- | -------------------------------------------------------------- | ----- |
| `src/chat/promptEngine.ts`      | **NEW** — Modular prompt builder with 10 layers                | 0     |
| `src/chat/participant.ts`       | Refactor `handleGeneralQuery()` to use prompt engine           | 0     |
| `src/chat/participant.ts`       | Add tool references to `sendRequest()` options                 | 2     |
| `src/chat/participant.ts`       | Build history messages from `context.history`                  | 3     |
| `src/chat/participant.ts`       | Extract file context from `request.references` + active editor | 7     |
| `src/chat/participant.ts`       | Use `selectBestModel()` instead of hardcoded `gpt-4o`          | 4     |
| `src/chat/modelIntelligence.ts` | Add `selectBestModel()` function                               | 4     |

**No new dependencies. No proposed APIs. All stable VS Code APIs.**

---

## @alex vs Agent Mode: When to Use Each

After enhancement, each mode has distinct strengths:

| Use Case                                  | Recommended Mode | Why                                           |
| ----------------------------------------- | ---------------- | --------------------------------------------- |
| Code generation with file editing         | **Agent Mode**   | Full tool suite, file system access, terminal |
| "Who am I? What's my architecture?"       | **@alex**        | Direct brain access, identity-aware           |
| Multi-step refactoring                    | **Agent Mode**   | Copilot's planning + editing pipeline         |
| "Search my memory for React patterns"     | **@alex**        | Pre-seeded knowledge + tool calling           |
| Debugging with terminal                   | **Agent Mode**   | Terminal tool, error diagnostics              |
| "How's my health? Run self-actualization" | **@alex**        | Direct tool access, emotional intelligence    |
| Learning conversation (explain X)         | **@alex**        | Profile-adapted, confidence signaling         |
| Quick slash commands                      | **@alex**        | /meditate, /dream, /learn, /session           |
| Large multi-file project work             | **Agent Mode**   | Workspace context, search tools               |
| Personalized coaching / mentorship        | **@alex**        | Profile, persona, emotional awareness         |

**Tagline**: Agent mode is your **workshop**. @alex is your **mentor**.

---

## Success Metrics

| Metric                      | Baseline (current) | Target (enhanced)        |
| --------------------------- | ------------------ | ------------------------ |
| @alex system prompt tokens  | ~500 (static)      | ~1,500-2,500 (dynamic)   |
| Tools available in @alex    | 0                  | 7-12                     |
| Conversation turns retained | 0                  | Last 4 exchanges         |
| Memory hits pre-loaded      | 0                  | Up to 3 local + 3 global |
| Persona-specific behavior   | No                 | Yes                      |
| Confidence signaling        | No                 | Yes                      |
| Model tier adaptation       | No                 | Yes                      |
| File context awareness      | No                 | Yes                      |

---

## Related Documents

- [PROMPT-PIPELINE-ANATOMY.md](../architecture/PROMPT-PIPELINE-ANATOMY.md) — Research that motivated this plan
- [COPILOT-BRAIN.md](../architecture/COPILOT-BRAIN.md) — copilot-instructions.md architecture
- [ALEX-AVATAR-INTEGRATION-PLAN.md](ALEX-AVATAR-INTEGRATION-PLAN.md) — Visual persona integration (Phase 6 synergy)
- [VSCODE-COPILOT-API-ANALYSIS.md](../vscode/VSCODE-COPILOT-API-ANALYSIS.md) — API surface inventory
