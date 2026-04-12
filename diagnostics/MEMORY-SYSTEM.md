# Memory System Diagnostic

## Overview

Alex's memory architecture ("The Brain") is organized into 4 tiers modeled on human cognitive systems, plus a cross-project sync layer. The master copy lives in `.github/` at the repository root; heirs receive filtered copies at build time.

---

## Memory Tiers

### 1. Declarative Memory (Skills) — "What + Why"

**Location**: `.github/skills/*/SKILL.md`  
**Brain analog**: Neocortex  
**Count**: 124 skills  
**Activation**: Keyword-based matching via `memory-activation/SKILL.md` index  

Each skill folder contains:
- `SKILL.md` — Domain patterns, concepts, when/why to use
- `synapses.json` — 2-5 typed connections to related skills/instructions
- Optional: `resources/` subfolder for reference material

**Skill categories observed** (representative, not exhaustive):
- Development: `vscode-extension-patterns`, `chat-participant-patterns`, `mcp-development`, `testing-strategies`
- Data: `data-analysis`, `data-visualization`, `dashboard-design`, `data-storytelling`, `chart-interpretation`
- Architecture: `brain-qa`, `architecture-audit`, `release-preflight`, `skill-building`
- AI/ML: `image-handling`, `flux-brand-finetune`, `ai-character-reference-generation`, `ai-generated-readme-banners`
- Cognitive: `meditation`, `dream-state`, `self-actualization`, `memory-activation`, `knowledge-synthesis`
- Platform: `microsoft-graph-api`, `teams-app-patterns`, `m365-agent-debugging`
- Meta: `cognitive-load`, `anti-hallucination`, `ai-writing-avoidance`, `bootstrap-learning`

---

### 2. Procedural Memory (Instructions) — "How"

**Location**: `.github/instructions/*.instructions.md`  
**Brain analog**: Basal Ganglia  
**Count**: 39+ instruction files  
**Activation**: Auto-loaded by VS Code when files matching `applyTo` globs are open  

Instructions are step-by-step procedures that activate contextually. Key examples:

| Instruction | `applyTo` Pattern | Purpose |
|------------|-------------------|---------|
| `vscode-extension-patterns` | `**/src/**/*.ts,**/extension.ts` | Extension development rules |
| `testing-strategies` | `**/*.test.*,**/*.spec.*` | Test level decisions, mocking |
| `release-management` | `**/*{CHANGELOG,package,version}*` | Release workflow, DoD |
| `security-review` | `**/*security*,**/*auth*` | OWASP, STRIDE review |
| `meditation` | `**/*dream*,**/*meditation*` | 8-phase consolidation protocol |
| `data-visualization` | `**/*chart*,**/*visual*` | Chart selection, color palette |
| `ui-ux-design` | `**/*.{html,jsx,tsx,vue,svelte,css}` | WCAG AA, 8px grid, accessibility |

---

### 3. Episodic Memory (Sessions) — "What happened"

**Location**: `.github/episodic/*.md`  
**Brain analog**: Hippocampus  
**Format**: Markdown with YAML frontmatter (date, type, summary)  
**Service**: `EpisodicMemoryService` reads/writes these files  

Episodic memory records:
- Meditation session logs
- Dream state reports
- Self-actualization assessments
- Learning session summaries
- Architecture health snapshots

---

### 4. Working Memory (Active Context)

**Location**: `copilot-instructions.md` → Active Context block  
**Brain analog**: Prefrontal Cortex  
**Scope**: Current session only  

The Active Context block contains dynamic session state:
```
Persona: Developer (90% confidence)
Objective: (set by user)
Tone: (auto — adapt to context)
Focus Trifectas: north-star, research-first-development, vscode-extension-patterns
Priorities: north-star-alignment, autonomous-partnership, heir-ecosystem-quality
Principles: KISS, DRY, Quality-First, Research-Before-Code, Plan-Before-Build
```

---

### 5. Cross-Project Memory (AI-Memory)

**Location**: `%OneDrive%/AI-Memory/`  
**Sync**: OneDrive cloud sync across workspaces  
**Files**:
- `global-knowledge.md` — Cross-project insights and patterns
- `notes.md` — Reminders and session notes
- `learning-goals.md` — Active learning objectives
- `profile.md` / `user-profile.json` — User preferences and persona

This layer enables knowledge transfer between different Alex workspaces and platforms (VS Code, M365 Copilot, Agent Builder).

---

## The Trifecta Model

A capability is **architecturally complete** when it exists in all three memory systems:

| Memory System | File Type | Brain Analog | What It Encodes |
|---------------|-----------|-------------|-----------------|
| Declarative | `SKILL.md` | Neocortex | Domain patterns, concepts, when/why |
| Procedural | `.instructions.md` | Basal Ganglia | Step-by-step procedures, auto-loaded |
| Interactive | `.prompt.md` | Prefrontal Cortex | User-invoked workflows, guided execution |

**Complete trifectas (45)**: meditation, dream-state, self-actualization, release-process, brand-asset-management, research-first-development, brain-qa, architecture-audit, bootstrap-learning, vscode-extension-patterns, testing-strategies, north-star, code-review, debugging-patterns, and 31 more.

**Not everything needs a trifecta.** The trifecta audit protocol distinguishes between capabilities that warrant all three files and those that work fine with a single file.

---

## Synapse Network

Synapses are typed connections between memory files, stored in two formats:

1. **`synapses.json`** — JSON files alongside `SKILL.md` in skill folders
2. **Embedded synapses** — Markdown notation inside instruction/prompt files

**Synapse format**:
```
[target-file.md] (Strength, Type, Direction) - "Activation condition"
```

**Strength levels**: Critical > High > Medium > Low  
**Types**: Triggers, Enables, Validates, Enhances, Coordinates, Implements, etc.  
**Directions**: Forward, Bidirectional, Input, Output  

**LLM-Optimized format** (v4.2.7+) adds `when` and `yields` fields:
```json
{
  "target": ".github/skills/svg-graphics/SKILL.md",
  "type": "input-source",
  "strength": 0.85,
  "when": "converting FROM svg format",
  "yields": "SVG creation patterns, viewBox, dark mode CSS"
}
```

---

## Skill Activation Flow

```
User sends message to @alex
  → CognitiveOrchestrator receives request
  → SkillManager scans message for keywords
  → Matches against memory-activation/SKILL.md index
  → Returns relevant SKILL.md content
  → CognitiveOrchestrator assembles system prompt:
      Active Context + matched skills + applicable instructions + session history
  → System prompt sent to LLM with user message
```

**Activation is keyword-based**, using the action-keyword index in `memory-activation/SKILL.md`. This is a string-matching approach, not semantic similarity.

---

## Master-Heir Sync

At build time (`sync-architecture.cjs`):

1. Reads master `.github/` directory
2. Filters out `inheritance: master-only` files
3. Copies remaining files to heir `.github/` directories
4. Validates expected counts match actual counts
5. Reports any sync drift

**Inheritance types**:
- `inheritable` (default) — syncs to all heirs
- `master-only` — stays in master only
- `heir:vscode` — heir maintains own version
- `heir:m365` — M365 heir only

---

## Health Validation

### brain-qa.cjs (33-phase automated audit)

The `brain-qa.cjs` muscle runs a comprehensive validation:
- Phase 1-13: Structural integrity (synapse targets, inheritance, skill sync)
- Phase 14-26: Semantic & documentation (frontmatter, formatting, organization)
- Phase 27-29: Cross-repo integration (heir health, global knowledge)
- Phase 30-33: Architecture evolution (muscles, roadmap, prefrontal cortex)

### Dream Protocol

Automated neural maintenance:
- Scans all memory files for synapse integrity
- Repairs broken connections using consolidation mappings
- Generates health reports in `.github/episodic/`
- Brand compliance scan for deprecated colors
- AI-Memory sync check

---

## Token Budget Considerations

The entire cognitive architecture loads into LLM context on every interaction:
- `copilot-instructions.md` is the primary token consumer
- Phase 10 of brain-qa checks if it exceeds 16K tokens
- 124 skills are selectively loaded (keyword activation), not all at once
- Instruction files are selectively loaded (only when `applyTo` patterns match open files)
- The token-waste-elimination instruction enforces size thresholds:
  - Instructions with matching skills: max 50 lines
  - Standalone instructions: max 200 lines
  - Prompts: max 60 lines
  - Skills: max 400 lines
