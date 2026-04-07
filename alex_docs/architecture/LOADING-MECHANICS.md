# VS Code .github/ Loading Mechanics

**Author**: Alex Finch
**Date**: March 25, 2026
**Version**: 1.2 -- Alex v7.2.0
**Sources**: [VS Code Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) | [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) | [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization) | [ADR-010](../decisions/ADR-010-copilot-instructions-as-prefrontal-cortex.md)

**Related**: [VS Code Brain Integration](./VSCODE-BRAIN-INTEGRATION.md) | [Copilot Brain](./COPILOT-BRAIN.md) | [Memory Systems](./MEMORY-SYSTEMS.md) | [Skill Architecture](../skills/SKILL-ARCHITECTURE.md)

## Purpose

This document captures how VS Code loads `.github/` files into the LLM context window. Understanding these mechanics is essential for keeping token costs under control -- every token burned on always-on content is a token stolen from the user's actual request.

The token-waste-elimination skill (`.github/skills/token-waste-elimination/SKILL.md`) operationalizes these findings into an audit procedure.

## Three Loading Tiers

VS Code loads `.github/` cognitive architecture files in three distinct tiers with very different cost profiles:

| Tier                     | What Loads                                              | When                                                                                   | Token Cost Profile                                  |
| ------------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Tier 1: Always-on**    | `copilot-instructions.md` full body                     | Every single request                                                                   | Fixed overhead, unavoidable                         |
| **Tier 1: Always-on**    | `AGENTS.md` / `CLAUDE.md` full body (if present)        | Every single request                                                                   | Fixed overhead, unavoidable                         |
| **Tier 1: Always-on**    | All instruction file descriptions (YAML `description:`) | Every single request                                                                   | Fixed overhead per instruction file                 |
| **Tier 1: Always-on**    | All skill name + description (YAML frontmatter)         | Every single request                                                                   | Fixed overhead per skill file                       |
| **Tier 1: Always-on**    | All agent descriptions                                  | Every single request                                                                   | Fixed overhead per agent file                       |
| **Tier 2: Match-loaded** | Instruction bodies WITH `applyTo`                       | When the active file matches the glob pattern                                          | Only when working with matching files               |
| **Tier 2: Agent-loaded** | Instruction bodies WITHOUT `applyTo`                    | When the LLM agent judges the description relevant (not automatic -- see Tier 2 notes) | Variable -- depends on task and description quality |
| **Tier 3: On-demand**    | Skill bodies (SKILL.md content below frontmatter)       | 3-level progressive disclosure -- only when LLM determines the skill is needed         | Near-zero until invoked                             |
| **Tier 3: On-demand**    | Prompt bodies                                           | Only when user types `/command`                                                        | Zero cost until explicit invocation                 |
| **Tier 3: On-demand**    | Skill resource files (synapses.json, assets)            | Only when LLM explicitly requests them                                                 | Near-zero                                           |

### Key Implication

**Instructions are partially always-on. Skills are on-demand.** This means:

- Detailed procedures, code examples, and reference tables belong in **skills** (Tier 3 -- loaded only when needed)
- Thin rules, decision tables, and routing pointers belong in **instructions** (Tier 2 -- but bodies load more often than skills)
- Prompts are free until invoked (Tier 3 -- zero cost)

## Tier 1: Always-On Content

### What's Included

Every chat request includes:

1. **`copilot-instructions.md`** -- the full file body. This is Alex's prefrontal cortex (see [ADR-010](../decisions/ADR-010-copilot-instructions-as-prefrontal-cortex.md))
2. **`AGENTS.md` / `CLAUDE.md`** -- full body if present in the workspace root (or `.claude/` for CLAUDE.md). Also always-on
3. **Instruction descriptions** -- the YAML `description:` field from every `.instructions.md` file. VS Code uses these for routing decisions
4. **Skill metadata** -- the `name:` and `description:` from every skill's YAML frontmatter
5. **Agent descriptions** -- from each `.agent.md` file

### Token Cost Measurement (March 25, 2026)

| Component                 | Count | Total Characters | Est. Tokens | Notes                    |
| ------------------------- | ----- | ---------------- | ----------- | ------------------------ |
| copilot-instructions.md   | 1     | ~5,396           | ~1,349      | Every request            |
| CLAUDE.md                 | 1     | ~1,965           | ~491        | Every request            |
| Instruction descriptions  | 72    | ~5,873           | ~1,468      | Every request            |
| Skill name + descriptions | 150   | ~7,749           | ~1,937      | Every request            |
| Agent descriptions        | 7     | ~500             | ~125        | Every request            |
| **Total always-on**       |       |                  | **~5,370**  | **Per request baseline** |

> Muscle reports ~5,848 always-on tokens using raw char/4 estimation. The table above uses tighter estimates.

### Optimization Levers

- Keep `copilot-instructions.md` lean (current: 91 lines, ~1,349 tokens)
- Write concise instruction descriptions (each one costs tokens on every request)
- Write concise skill descriptions (each one costs tokens on every request)
- Avoid creating instructions or skills unless they provide real value
- Apply the Alex-First Principle to all `.github/` content (see below)

## Tier 2: Match-Loaded Instructions

### How Matching Works

VS Code uses two mechanisms to decide which instruction bodies to load:

**Mechanism 1: `applyTo` pattern matching**
```yaml
---
description: "VS Code extension patterns"
applyTo: "**/src/**/*.ts,**/extension.ts"
---
```
The body loads only when the user is working with a file matching the glob pattern. This is the most predictable and efficient mechanism.

**Mechanism 2: Agent-driven description matching (no `applyTo`)**
```yaml
---
description: "Microsoft Teams app patterns"
---
```
When no `applyTo` is specified, the instruction body is **not auto-injected** by VS Code. Instead, the instruction's `description` is always visible to the LLM agent (Tier 1), and the agent decides whether to load the body based on task relevance. This is less deterministic than `applyTo` -- the body *may* load when the agent judges it relevant, but there is no guarantee.

> **Note**: The official VS Code docs contain slightly contradictory statements on this. The main text says instructions are applied via "semantic matching of the instruction description to the current task." The frontmatter spec and FAQ say "if no `applyTo` is specified, the instructions are not applied automatically." Observable behavior confirms the agent-driven model: descriptions are always present, bodies load on agent discretion.

### Priority Order

When multiple instructions match, VS Code applies this priority:

1. **Personal** (user-level `~/.vscode/`) -- highest
2. **Repository** (`.github/instructions/`) -- middle
3. **Organization** -- lowest

### Token Cost Impact

| Instruction Type                               | Body Loading Behavior                                         | Token Cost                              |
| ---------------------------------------------- | ------------------------------------------------------------- | --------------------------------------- |
| With `applyTo` (41 files)                      | Body loads only for matching file contexts                    | Low -- predictable                      |
| Without `applyTo` (30 files post-optimization) | Body loads at agent discretion based on description relevance | Variable -- description quality matters |

### When to Add `applyTo`

Add `applyTo` when the instruction is domain-specific and primarily triggered by working with specific file types:

| Instruction Domain     | Recommended `applyTo`                       |
| ---------------------- | ------------------------------------------- |
| Extension development  | `**/src/**/*.ts,**/extension.ts,**/*.vsix`  |
| MCP development        | `**/*mcp*,**/mcp.json`                      |
| Image generation       | `**/generate-*.js,**/*banner*`              |
| Teams/M365 patterns    | `**/manifest.json,**/declarativeAgent.json` |
| Marketplace publishing | `**/*.vsix,**/*publish*`                    |

Keep NO `applyTo` when the instruction is conversational (meditation, self-actualization), applies universally (code review, writing style), or is a meta-process (adversarial oversight, skill building).

## Tier 3: On-Demand (Progressive Disclosure)

### Skills -- 3-Level Progressive Disclosure

Skills use a 3-level loading model. This is the most token-efficient mechanism because the LLM controls when deeper levels load:

| Level             | What Loads                                                                 | When                                                  | Token Budget              |
| ----------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------- |
| **L1: Metadata**  | `name` + `description` from YAML frontmatter                               | Always (Tier 1 cost)                                  | ~100 tokens per skill     |
| **L2: Body**      | Full SKILL.md content below the frontmatter                                | When LLM determines the skill is relevant to the task | Recommended <5,000 tokens |
| **L3: Resources** | Additional files in the skill directory (synapses.json, assets, templates) | When LLM explicitly needs them                        | Unlimited                 |

From VS Code documentation:

> "Skills load content progressively... install many skills without consuming context"

This means **you can have 150+ skills with minimal overhead** -- only the ~100-token metadata is always present. The full body loads only when needed.

### Skill Frontmatter Options

| Field                      | Effect                                                                   |
| -------------------------- | ------------------------------------------------------------------------ |
| `name`                     | Display name (required, <=64 chars, lowercase-hyphen)                    |
| `description`              | Routing hint for LLM (required, <=1024 chars)                            |
| `argument-hint`            | Hint text shown in chat input when skill invoked as `/command`           |
| `disable-model-invocation` | If true, skill only activates via explicit `/` command, not auto-matched |
| `user-invocable`           | If false, skill hidden from slash command menu (still available to LLM)  |

### Prompts -- Explicit Invocation Only

Prompt files (`.github/prompts/*.prompt.md`) have **zero token cost** until a user explicitly types the `/command`. They are never loaded into context automatically.

This makes prompts ideal for guided workflows that don't need to be available passively.

## Architecture Principle: Alex-First

All `.github/` files are LLM context, not human documentation. Write them for the LLM that will consume them, not for human readers.

### What Alex-First Means

| Human-oriented (avoid in .github/)                            | Alex-oriented (preferred in .github/)                   |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| "Why This Matters" motivation sections                        | Omit -- the LLM doesn't need motivation to follow rules |
| Step-by-step tutorials with explanation prose                 | Compressed numbered procedures                          |
| Embedded code blocks the LLM can generate itself              | Omit -- the LLM already knows standard patterns         |
| "7 Deadly Wastes" style narrative tables                      | Flat decision/rule tables                               |
| "Gold standard prompt examples"                               | Omit -- generic prompt knowledge is pre-trained         |
| Section headers for human scanning (Classification, Priority) | YAML frontmatter (already parsed by VS Code)            |

### Where Human Documentation Lives

Human-facing documentation belongs in `alex_docs/` -- that directory is never loaded into the LLM context window. This very document (LOADING-MECHANICS.md) is human documentation, so tutorial format is appropriate here.

The `.github/` directory is *only* for the LLM. Every line should earn its tokens.

## Architecture Principle: Instructions Thin, Skills Thick

When an instruction and skill cover the same domain:

| Content Type                                 | Where It Belongs | Why                                    |
| -------------------------------------------- | ---------------- | -------------------------------------- |
| Decision tables, quick-reference rules       | Instruction      | Compact, loads when matched            |
| Routing pointers ("see X skill for details") | Instruction      | Delegates to on-demand tier            |
| Detailed procedures, step-by-step guides     | Skill            | On-demand, progressive disclosure      |
| Code examples, templates                     | Skill            | On-demand, progressive disclosure      |
| Reference material, API tables               | Skill            | On-demand, progressive disclosure      |
| Constraints, never-do rules                  | Instruction      | Want these loaded when context matches |

### Target Sizes

| File Type   | Has Matching Skill | Target Lines    | Rationale                                    |
| ----------- | ------------------ | --------------- | -------------------------------------------- |
| Instruction | Yes                | <50 lines       | Rules + routing only; details in skill       |
| Instruction | No (standalone)    | <200 lines      | Self-contained but still concise             |
| Skill       | Any                | <400 lines body | Progressive disclosure makes this affordable |
| Prompt      | Any                | <60 lines       | Workflow steps only; reference in skill      |
| Agent       | Any                | <80 lines       | Persona + tools + handoffs                   |

## Instruction-Skill Overlap Audit

To find instructions that duplicate their matching skills:

```text
Pseudocode:
For each file in .github/instructions/*.instructions.md:
  Extract skill name from filename (remove .instructions suffix)
  If .github/skills/{name}/SKILL.md exists:
    Print line count + filename (candidate for deduplication)
```

Any instruction with a matching skill that exceeds 50 lines is a trimming candidate. The instruction should contain only unique rules and decision tables; all procedural content should live in the skill.

## Token Budget Optimization History

### March 25, 2026 -- Token Waste Elimination Campaign (v6.8.1)

Three-phase campaign applying the Alex-First Principle and "instructions thin, skills thick" rule:

**Phase 1: Automated fixes** (audit-token-waste.cjs `--fix`)

| Pattern                       | Files Fixed | Action                                     |
| ----------------------------- | ----------- | ------------------------------------------ |
| Mermaid `%%{init}` blocks     | 7           | Deleted (VS Code renders without them)     |
| Azure AD → Microsoft Entra ID | 6           | String replacement                         |
| **Total auto-fixed**          | **22**      | Safe patterns only (no structural changes) |

> Remaining Mermaid `%%{init}` hits (2) are false positives in pattern documentation examples.

**Phase 2: Instruction-skill overlap trimming**

Applied the "instructions thin, skills thick" principle across 17+ instruction files that had matching skills:

| Category                         | Files    | Before           | After                | Savings                   |
| -------------------------------- | -------- | ---------------- | -------------------- | ------------------------- |
| Full rewrites (>50% duplicate)   | 15       | ~2,335L          | ~736L                | ~1,599L removed           |
| Meta-only trims (<30% duplicate) | 2        | ~155L            | ~134L                | ~21L removed              |
| `applyTo` additions              | 8        | (semantic match) | (file-pattern match) | Reduced semantic matching |
| **Total**                        | **17+8** |                  |                      | **~1,620 lines**          |

Key waste patterns eliminated:
- Meta-blocks (Classification, Activation, Priority headers) -- duplicate YAML frontmatter
- Inline `## Synapses` sections -- duplicate synapses.json
- Procedural content duplicated in skills -- moved to on-demand tier
- Human-oriented tutorials, motivation prose, embedded code examples
- Vocabulary lists, templates -- all skill-tier material

**Phase 3: Alex-First rewrites**

| File                                  | Before     | After      | Change      |
| ------------------------------------- | ---------- | ---------- | ----------- |
| copilot-instructions.md               | ~1,608 tok | ~1,349 tok | -259 tokens |
| token-waste-elimination SKILL.md      | 175 lines  | 50 lines   | -71%        |
| Alex-First voice applied to all trims | --         | --         | See Phase 2 |

Learnings codified:
- Memory files (`.github/`) are LLM context -- optimize for LLM consumption, not human readability
- The LLM can generate standard patterns (PowerShell, code examples) -- don't embed them
- Decision tables beat narrative prose for rule transmission
- Human-facing docs belong in `alex_docs/`, not `.github/`

### Prior Sessions -- Broader Architecture Cleanup

| Date       | Action                              | Files | Lines Removed |
| ---------- | ----------------------------------- | ----- | ------------- |
| March 2026 | Inline synapses removed from skills | 80    | ~686          |
| March 2026 | Mermaid `%%{init}` blocks removed   | 7     | ~50           |
| March 2026 | copilot-instructions.md trim        | 1     | ~470 tokens   |
| Feb 2026   | ADR-010 prefrontal cortex redesign  | 1     | ~1,973 tokens |

## Empirical Verification

Use VS Code's built-in debugging tools to verify loading behavior:

1. **Chat Debug View**: `Developer: Show Chat Debug View` -- shows the exact system prompt sent to the LLM, including which files were injected
2. **Diagnostics**: `Chat: Configure Instructions > Diagnostics` -- shows which instruction files matched and were loaded
3. **Trace Logs**: Set log level to Trace, look for `[InstructionsContextComputer]` entries -- shows the matching decision process

## References

- [VS Code Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) -- instruction loading, `applyTo`, priority, description matching
- [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) -- 3-level progressive disclosure, SKILL.md frontmatter
- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization) -- overview of all customization surfaces
- [ADR-010](../decisions/ADR-010-copilot-instructions-as-prefrontal-cortex.md) -- original token optimization research and decision
- [Codex Competitive Analysis](../research/CODEX-COMPETITIVE-ANALYSIS-2026-03-05.md) -- progressive disclosure comparison with Codex
- [token-waste-elimination skill](../../.github/skills/token-waste-elimination/SKILL.md) -- operational audit procedure based on these mechanics
