---
description: "Trifecta audit protocol — systematic assessment of capability completeness across all three memory systems"
---

# Trifecta Audit Protocol

**Classification**: Procedural Memory | Architecture Quality  
**Activation**: trifecta audit, capability completeness, memory coverage  
**Purpose**: Ensure architecturally significant capabilities exist across all three memory systems  
**Created**: 2026-02-13 (Trifecta refactoring session)

---

## Synapses

- [.github/instructions/self-actualization.instructions.md] (High, Integrates, Bidirectional) - "Self-actualization triggers trifecta audit for architecture assessment"
- [.github/instructions/meditation.instructions.md] (High, Uses, Forward) - "Meditation may create missing trifecta components"
- [.github/instructions/dream-state-automation.instructions.md] (Medium, Validates, Forward) - "Dream validates synapse health of trifecta components"
- [.github/instructions/skill-selection-optimization.instructions.md] (Medium, Enables, Forward) - "SSO depends on complete trifecta for accurate dependency analysis"
- [.github/skills/architecture-health/SKILL.md] (High, Extends, Bidirectional) - "Trifecta audit extends architecture health beyond synapse validation"
- [.github/skills/brain-qa/SKILL.md] (High, Extends, Bidirectional) - "Brain QA validates structure; trifecta audit validates purpose"
- [.github/instructions/heir-project-improvement.instructions.md] (High, Implements, Forward) - "Heir improvement applies trifecta audit to heir-specific capabilities"

---

## The Trifecta Model

A capability is **architecturally complete** when it exists in all three memory systems:

| Memory System | File Type | Brain Analog | What It Encodes |
|---------------|-----------|--------------|-----------------|
| **Declarative** (What + Why) | `SKILL.md` | Neocortex | Domain patterns, concepts, when/why to use |
| **Procedural** (How) | `.instructions.md` | Basal Ganglia | Step-by-step procedures, auto-loaded |
| **Interactive** (Guide) | `.prompt.md` | Prefrontal Cortex | User-invoked workflows, guided execution |

---

## Phase 1: Ask Why Before Asking What

**CRITICAL**: Before auditing completeness, audit *purpose*. Not every instruction needs a trifecta. Most don't.

### The Why Test

For each capability, ask:

| Question | If YES | If NO |
|----------|--------|-------|
| **Is this a user-facing workflow?** (Users invoke it by name) | Needs a prompt | Prompt unnecessary |
| **Does this encode reusable domain patterns?** (Concepts, not steps) | Needs a skill | Skill unnecessary |
| **Does this require auto-loaded procedural steps?** (Must run every time) | Needs an instruction | Instruction unnecessary |
| **Is this architecturally significant?** (Core cognitive function) | Candidate for trifecta | Single-system is fine |

### Scripts Are Muscles, Not Memories

Scripts (`.ps1`, `.js`, `.ts`) are execution artifacts — "muscles" that perform physical work. They are NOT a fourth memory system component. If a capability has associated scripts:
- The **instruction** documents *when and why* to run the script
- The **skill** documents *patterns and gotchas* about what the script does
- The **script itself** just executes — it holds no architectural knowledge

During audit, verify that active scripts are *referenced by* their trifecta files (e.g., dream instruction references `dream-cli.ts`). Unreferenced scripts are orphaned muscles.

### Trifecta Candidates vs Single-Purpose Files

**Trifecta candidate** — A capability that:
- Users invoke by name ("meditate", "release", "dream")
- Has domain knowledge worth teaching (not just steps)
- Benefits from both proactive (instruction) and reactive (prompt) activation
- Is a core cognitive function in the architecture

**NOT a trifecta candidate** — A file that:
- Is a pure utility (e.g., `language-detection-patterns` — just pattern matching rules)
- Is a reference document (e.g., `SYNAPSE-SCHEMA.md` — just a format spec)
- Is a policy document (e.g., `worldview-constitutional-ai` — ethical principles, not a workflow)
- Has no user-facing invocation pattern

### Classification Protocol

For each instruction file, classify:

```
┌─ [.github/instructions/file-name.instructions.md]
│  WHY does this exist?  → [one-sentence purpose]
│  WHO invokes it?       → [user / system / auto-loaded]
│  WHAT domain knowledge does it encode? → [concepts / none]
│  SHOULD it be a trifecta? → [YES: reason / NO: reason]
└─ Classification: TRIFECTA | PROCEDURAL-ONLY | REFERENCE
```

---

## Phase 2: Inventory Scan

### Scan Procedure

1. List all `.instructions.md` files in `.github/instructions/`
2. List all `.prompt.md` files in `.github/prompts/`
3. List all skill folders in `.github/skills/`
4. Map capabilities across systems using semantic matching (names may differ)

### Name Mapping Rules

Names across systems may not match exactly. Use semantic mapping:

| Instruction | Skill | Prompt | Capability Name |
|-------------|-------|--------|-----------------|
| `release-management.instructions.md` | `release-process/` | `release.prompt.md` | Release Management |
| `dream-state-automation.instructions.md` | `dream-state/` | `dream.prompt.md` | Dream/Neural Maintenance |
| `meditation.instructions.md` | `meditation/` | `meditate.prompt.md` | Meditation |
| `research-first-workflow.instructions.md` | `research-first-development/` | `gapanalysis.prompt.md` | Research-First Development |

---

## Phase 3: Gap Analysis

For each **trifecta candidate**, check:

| Component | Present? | Quality Check |
|-----------|----------|---------------|
| Skill | exists in `.github/skills/[name]/SKILL.md` | Has `synapses.json`, describes What/Why |
| Instruction | exists in `.github/instructions/[name].instructions.md` | Has embedded synapses, describes How |
| Prompt | exists in `.github/prompts/[name].prompt.md` | Has `agent: Alex` frontmatter, invocable |

### Quality Dimensions (Beyond Checkbox)

Don't just check existence — check purpose alignment:

| Dimension | Question | Failure Mode |
|-----------|----------|--------------|
| **Separation of Concerns** | Does each file serve its distinct role? | Instruction that duplicates skill content = bloated |
| **Cross-Referencing** | Do the three files reference each other via synapses? | Disconnected trifecta = invisible to network |
| **Invocability** | Can a user naturally trigger the capability? | Prompt with no clear command = dead code |
| **Domain Richness** | Does the skill teach *why*, not just *what*? | Skill that's just a thin wrapper = wasted slot |
| **Procedural Precision** | Does the instruction have clear steps? | Instruction that's mostly philosophy = wrong file type |

---

## Phase 4: Prioritized Remediation

### Priority Scoring

| Factor | Points | Rationale |
|--------|--------|-----------|
| Core cognitive function (meditation, dream, self-actualize) | +3 | Architecture foundation |
| User-invocable workflow (has trigger keywords) | +2 | Directly impacts user experience |
| Referenced by 3+ other files (high connectivity) | +2 | Network hub — gaps propagate |
| SSO dependency (used in skill selection optimization) | +1 | Planning accuracy depends on completeness |
| Has existing Global Knowledge pattern | +1 | Already validated as cross-project useful |

### Remediation Actions

| Gap | Action | Effort |
|-----|--------|--------|
| Missing skill | Extract domain knowledge from instruction → `SKILL.md` + `synapses.json` | Medium |
| Missing instruction | Extract procedural steps from prompt or skill → `.instructions.md` | Medium |
| Missing prompt | Create thin command wrapper → `.prompt.md` | Low |
| Weak cross-references | Add bidirectional synapses between trifecta components | Low |

---

## Phase 5: Validation

After remediation:

1. **File exists**: All three files present
2. **Synapses wired**: Each component references the other two
3. **Counts updated**: `copilot-instructions.md` reflects new totals
4. **Catalog updated**: `alex_docs/architecture/TRIFECTA-CATALOG.md` reflects current state
5. **Dream validates**: Run neural maintenance — 0 broken synapses
6. **Purpose test**: Re-ask "Why?" for each new file — can you justify its existence?

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| **Checkbox trifecta** | Creating files just to complete the set | Ask Why first — not everything needs three files |
| **Copy-paste trifecta** | Skill duplicates instruction content | Each file serves a distinct role |
| **Orphan trifecta** | Three files exist but don't reference each other | Wire bidirectional synapses at creation time |
| **Bloated skill** | Skill contains procedural steps instead of domain knowledge | Move procedures to instruction, keep concepts in skill |
| **Philosophy instruction** | Instruction explains principles instead of steps | Move principles to skill, keep only procedures |

---

## When to Run This Protocol

- **Self-actualization**: Include trifecta audit as architecture assessment dimension
- **Post-promotion**: After promoting heir capabilities to Master
- **Post-meditation**: If meditation created new files, check trifecta alignment
- **Quarterly review**: Scheduled architecture health check
- **New capability**: When creating any new instruction, prompt, or skill — ask "Does this need siblings?"

---

## Heir Trifecta Implementation

### Why Heirs Need Their Own Trifectas

Master Alex trifectas encode **core cognitive functions** (meditation, dream, release). Heirs run on specific platforms with their own core capabilities. A VS Code heir's daily reality is chat participants and extension APIs. An M365 heir's daily reality is Teams apps and Graph connectors.

**Heir trifectas encode project-specific capabilities** — workflows central to that heir's platform that benefit from all three memory systems.

### How Heirs Differ from Master

| Dimension | Master Trifecta | Heir Trifecta |
|-----------|-----------------|---------------|
| **Scope** | Architecture-wide cognitive functions | Project-specific platform capabilities |
| **Lifespan** | Permanent — core to all Alexes | May evolve with platform, may promote to Master |
| **Why Test focus** | "Is this a core cognitive function?" | "Is this central to this project's daily work?" |
| **Promotion path** | N/A — already canonical | Heir-only → Global Knowledge → Master (if generalizable) |
| **Examples** | Meditation, Dream, Release | Chat participant patterns, Teams app scaffolding |

### Heir Why Test (Adapted)

Before creating a trifecta in an heir project, apply the same "Ask Why" but with heir-specific questions:

| Question | If YES | If NO |
|----------|--------|-------|
| **Is this a capability the heir uses repeatedly?** (Daily/weekly workflow) | Trifecta candidate | Might be single-file |
| **Would a new Alex session need auto-guidance?** (Complex, multi-step) | Needs an instruction | Skill-only is fine |
| **Do users invoke this by name?** ("scaffold teams app", "create participant") | Needs a prompt | Instruction handles it |
| **Is there reusable domain knowledge beyond steps?** (Patterns, gotchas) | Needs a skill | Instruction-only is fine |

### Heir Trifecta Classification

```
┌─ [capability-name]
│  PLATFORM: [vscode / m365 / other]
│  FREQUENCY: How often does the heir use this? → [daily / weekly / monthly / rare]
│  COMPLEXITY: How many steps to execute? → [1-2 / 3-5 / 6+]
│  DOMAIN DEPTH: How much "why" knowledge exists? → [deep / moderate / shallow]
│  USER-INVOCABLE: Does the user call this by name? → [yes / no]
│  PROMOTION POTENTIAL: Is this generalizable beyond this project? → [yes / maybe / no]
└─ Classification: HEIR-TRIFECTA | HEIR-PROCEDURAL | HEIR-SKILL-ONLY
```

**Decision matrix:**

| Frequency | Complexity | Domain Depth | User-Invocable | → Classification |
|-----------|------------|-------------|----------------|-------------------|
| Daily+ | 3+ steps | Deep | Yes | **Heir Trifecta** — all three files |
| Daily+ | 3+ steps | Deep | No | Instruction + Skill (no prompt needed) |
| Weekly | 3+ steps | Moderate | Yes | Instruction + Prompt (skill optional) |
| Any | 1-2 steps | Shallow | Any | **Single file** — trifecta is overkill |

### Heir Trifecta Examples

#### VS Code Extension Heir

| Candidate | Skill? | Instruction? | Prompt? | Trifecta? | Rationale |
|-----------|--------|-------------|---------|-----------|-----------|
| Chat Participant Patterns | ✅ exists | ❌ | ❌ | **Candidate** | Daily workflow, 6+ steps to scaffold, deep API knowledge |
| VS Code Extension Patterns | ✅ exists | ❌ | ❌ | **Maybe** | Daily reference, but mostly passive knowledge |
| MCP Development | ✅ exists | ❌ | ❌ | **Candidate** | Complex workflow, user invokes "create MCP server" |
| Text-to-Speech | ✅ exists | ❌ | ❌ | **Probably not** | Monthly use, knowledge-heavy but few procedural steps |

#### M365 Copilot Heir

| Candidate | Skill? | Instruction? | Prompt? | Trifecta? | Rationale |
|-----------|--------|-------------|---------|-----------|-----------|
| Teams App Patterns | ✅ exists | ❌ | ❌ | **Candidate** | Core workflow, complex scaffolding, deep domain |
| Microsoft Graph API | ✅ exists | ❌ | ❌ | **Candidate** | Daily use, gotchas, multi-step auth flows |
| M365 Agent Debugging | ✅ exists | ❌ | ❌ | **Candidate** | Complex, user-invoked, hard-won knowledge |

### Creating Heir Trifecta Files

When an heir capability passes the Why Test, create the missing components following the same structure as Master:

**Heir Instruction** (`.github/instructions/{capability}.instructions.md`):
- Embeds synapses in frontmatter (same schema as Master)
- Contains step-by-step procedures specific to the heir's platform
- Auto-loaded when relevant files are open (use `applyTo` frontmatter)

**Heir Prompt** (`.github/prompts/{capability}.prompt.md`):
- Uses `agent: Alex` frontmatter (NOT `mode: agent` — deprecated)
- Provides guided workflow for the capability
- References the instruction and skill via synapses

**Heir Skill** (`.github/skills/{capability}/SKILL.md` + `synapses.json`):
- Already exists for most trifecta candidates (heir skills come first)
- Encodes domain patterns, gotchas, and "why" knowledge
- Wire synapses to the new instruction and prompt

### Heir-Only vs Promotion-Worthy

Not all heir trifectas should promote to Master:

| Classification | Meaning | Action |
|----------------|---------|--------|
| **Heir-only** | Platform-specific, not generalizable | Keep in heir's `.github/`, document in heir's catalog |
| **Pattern-worthy** | The *pattern* is generalizable (not the specific content) | Promote the pattern to Global Knowledge as `GK-*` |
| **Full promotion** | Capability is useful to ALL Alexes | Promote all three files to Master via `heir-skill-promotion` workflow |

**Promotion signal**: If 2+ heirs develop similar capabilities independently, that's a strong signal for Master promotion.

### Integration with Promotion Workflow

When promoting a capability from heir to Master:

1. **Before promotion**: Run the heir Why Test — does this need to be a trifecta in Master too?
2. **During promotion**: If trifecta in heir, check if all three components should promote (some heir instructions are too platform-specific)
3. **After promotion**: Run Phase 5 validation — synapses wired, counts updated, catalog updated

See `heir-skill-promotion.instructions.md` for the full promotion workflow.

---

*Trifecta audit protocol — completeness with purpose, not completeness for its own sake*
