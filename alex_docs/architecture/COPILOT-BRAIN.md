# Copilot Brain: How copilot-instructions.md Works

> **Audience**: Human developers working on Alex
> **Machine counterpart**: `.github/copilot-instructions.md` (the actual file read by VS Code)

## What Is It?

`copilot-instructions.md` is Alex's **prefrontal cortex** — the always-on cognitive state that VS Code injects into every LLM request. It's the first thing Alex reads, every time.

## Architecture (ADR-010)

The file follows the **v3-identity-first** format, optimized for LLM consumption:

| Section            | Purpose                                   | Dynamic?                                       |
| ------------------ | ----------------------------------------- | ---------------------------------------------- |
| **Identity**       | Alex's personality — who he IS            | No (version header updated by release scripts) |
| **Active Context** | Session state (persona, objective, focus) | Yes — managed by `ActiveContextManager`        |
| **User Profile**   | How Alex knows the human collaborator     | No                                             |
| Safety Imperatives | Non-negotiable rules                      | No                                             |
| Routing            | How to find capabilities                  | No (trifecta count validated by brain-qa)      |
| Heirs              | Platform deployments                      | No (Master only)                               |
| Agents             | Available cognitive modes                 | No (list validated by brain-qa Phase 32)       |
| Commands           | Available commands                        | No                                             |
| Model Awareness    | Tier-based behavior rules                 | No                                             |
| VS Code Settings   | Required configuration                    | No                                             |
| Global Knowledge   | Cross-project commands                    | No                                             |

### Design Philosophy

The **Identity** section describes Alex's **personality**, not his features or capabilities.
It is his self-concept — the LLM's answer to "Who am I?" Not a capability list.
Only Alex reads this section; it's not human configuration.

The **User Profile** section tells Alex how to know the human he's working with.
Alex reads `.github/config/user-profile.json` to personalize tone, detect persona, and adapt.

**Remaining sections evolve** as the architecture grows. Brain-qa Phase 32 validates
that agent lists, trifecta counts, and section presence match what exists on disk.
When they drift, brain-qa flags warnings so the prefrontal cortex stays current.

## Active Context (The Dynamic Part)

The **Active Context** section is the only part that changes at runtime. It contains:

```markdown
## Active Context
<!-- Extension-managed session state. Read this FIRST to resume context across sessions. -->
Persona: Developer (85% confidence)
Objective: *(session-objective — set by user or focus timer)*
Focus Trifectas: code-review, testing-strategies, deep-thinking
Principles: KISS, DRY, Optimize-for-AI
Last Assessed: 2026-02-14 — v5.7.0
```

### Who Writes What

| Field           | Writer             | When                                                         |
| --------------- | ------------------ | ------------------------------------------------------------ |
| Persona         | Persona Detection  | On chat start, after LLM or heuristic detection              |
| Objective       | Session Timer      | On `startSession()` (sets topic) and `endSession()` (clears) |
| Focus Trifectas | Persona Detection  | Maps persona skills to trifecta IDs                          |
| Principles      | (rarely changed)   | Stable defaults                                              |
| Last Assessed   | Self-Actualization | After completing the 7-phase protocol                        |

### ActiveContextManager

All writes go through `src/shared/activeContextManager.ts` — the **single centralized writer**. No other module touches this section directly.

**Safety features:**
- **Mutex lock**: Serialized writes prevent concurrent corruption
- **Section-scoped**: Only modifies between `## Active Context` and the next `## ` heading
- **Master protection**: Focus Trifectas overwrite blocked on Master Alex (manually curated)
- **Validation**: Field changes are logged with source attribution

**API:**
```typescript
import { updatePersona, updateObjective, updateFocusTrifectas,
         updateLastAssessed, updatePrinciples,
         updateActiveContext, readActiveContext } from '../shared/activeContextManager';

// Convenience methods
await updatePersona(root, 'Developer', 0.85);
await updateObjective(root, 'Build React dashboard');
await updateObjective(root, null);  // Reset to placeholder
await updateFocusTrifectas(root, ['code-review', 'testing-strategies', 'deep-thinking']);
await updateLastAssessed(root, '5.7.0');

// Batch update
await updateActiveContext(root, {
    persona: 'Researcher (90% confidence)',
    objective: 'Literature review'
}, 'my-feature');

// Read current state
const ctx = await readActiveContext(root);
```

## Master vs Heir

| Aspect                  | Master                                       | Heir                                                                |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| File location           | `.github/copilot-instructions.md` (root)     | `platforms/vscode-extension/.github/copilot-instructions.md`        |
| Instrumentation         | 5 HTML comments for validation               | None                                                                |
| Safety Imperatives      | I1-I7 (includes Master-specific protections) | I5-I6 only                                                          |
| Heirs section           | Present                                      | Absent                                                              |
| Active Context defaults | Master-curated trifectas                     | Generic defaults (`code-review, testing-strategies, deep-thinking`) |
| Last Assessed           | Date + version                               | `never` (until first self-actualization)                            |

The heir file is what gets **copied to user projects** during `Alex: Initialize Architecture`.

## Token Budget

The v3 format uses ~1,100 tokens (vs ~3,073 for v1) — a 73% reduction. This matters because copilot-instructions is injected into **every** LLM request.

## Migration History

- **v1** (pre-ADR-010): 333 lines, tables, P-slot working memory, inline triggers
- **v2-llm-first** (ADR-010): 90 lines, flat text, Active Context, synapse routing
- **v3-identity-first** (ADR-010 evolution): ~95 lines, personality-driven Identity, brain-qa evolution validation (Phase 32), version regex unified across all scripts

See [ADR-010](../decisions/ADR-010-copilot-instructions-as-prefrontal-cortex.md) for the full decision record.
