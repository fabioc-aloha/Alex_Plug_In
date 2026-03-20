# Claude Heir Plan

> **Status**: Research Complete + Fact-Checked | **Created**: 2026-03-19 | **Updated**: 2026-03-20 | **Platform**: Claude (Chat + Cowork + Code) | **Roadmap**: Conditional #17, #18
>
> **Research Sources**: Official Claude docs + Ruben Hassid practitioner guides
>
> **Fact-Checked Against**: Official Anthropic documentation (platform.claude.com, support.claude.com, code.claude.com) — verified 2026-03-20

## Executive Summary

Claude has **three interaction modes**: Code (developer-focused, runs in browser/desktop/VS Code), Cowork (knowledge worker desktop app with file access), and Projects (saved workspaces for recurring tasks). All three use the same underlying Opus 4.6 model with Extended Thinking.

The platform uses a **Skills + Connectors + Sub-agents** architecture that maps remarkably well to Alex's existing **Trifecta (Skill + Instruction + Prompt)** pattern.

This document defines **two new Claude-based heirs**, creating complementary platforms alongside VS Code Extension, M365 Copilot, and Agent Plugin. The VS Code Extension already covers the "Code" use case, so the new heirs target Cowork (power users) and Projects (casual/mobile).

---

## ✅ Fact-Check Validation (Official Docs)

> **Date**: 2026-03-20 | **Sources**: platform.claude.com, support.claude.com, code.claude.com

### Confirmed Claims

| Claim | Source | Status |
|-------|--------|--------|
| 3-level progressive disclosure (Metadata ~100 tokens, Instructions ≤5k, Resources unlimited) | Agent Skills docs | ✅ Exact match |
| SKILL.md name ≤64 chars, lowercase-letters-numbers-hyphens only | Agent Skills docs | ✅ Confirmed |
| SKILL.md description ≤1024 chars | Agent Skills docs | ✅ Confirmed |
| Cowork is Research Preview | Cowork Getting Started | ✅ Confirmed |
| Available to Pro/Max/Team/Enterprise | Cowork Getting Started | ✅ Confirmed |
| Windows x64 and macOS only | Cowork Getting Started | ✅ Confirmed |
| Desktop app required for Cowork | Cowork Getting Started | ✅ Confirmed |
| Cowork runs in isolated VM on user's computer | Cowork Getting Started | ✅ Confirmed |
| Direct local file access with permissions | Cowork Getting Started | ✅ Confirmed |
| Sub-agent coordination (parallel workstreams) | Cowork Getting Started | ✅ Confirmed |
| Scheduled tasks via `/schedule` | Cowork Getting Started | ✅ Confirmed |
| Global Instructions (Settings > Cowork) | Cowork Getting Started | ✅ Confirmed |
| Folder Instructions (project-specific) | Cowork Getting Started | ✅ Confirmed |
| Conversation history stored locally (not on Anthropic servers) | Cowork Getting Started | ✅ Confirmed |
| Desktop app must remain open during tasks | Cowork Getting Started | ✅ Confirmed |
| Cowork plugins bundle skills, connectors, sub-agents | Cowork Getting Started | ✅ Confirmed |
| Mobile access for Pro/Max (iOS app messages desktop) | Cowork Getting Started | ✅ Confirmed |
| Network egress permissions respected | Cowork Getting Started | ✅ Confirmed |
| Computer Use tool on Claude Opus 4.6 (computer_20251124) | Computer Use docs | ✅ Confirmed |
| Claude Code same CLAUDE.md works across all surfaces | Claude Code docs | ✅ Confirmed |
| Pre-built Skills: PowerPoint, Excel, Word, PDF | Agent Skills docs | ✅ Confirmed |

### Corrections Applied

| Original Claim | Correction | Source |
|----------------|------------|--------|
| "Windows (x64)" | Added explicit note: **arm64 not supported** | Cowork Getting Started |
| Missing compliance caveat | Added: **Do not use Cowork for regulated workloads** | Cowork Getting Started |
| Missing cross-surface limitation | Skills don't sync across surfaces (Claude.ai, API, Claude Code) | Agent Skills docs |
| Missing deletion protection | Claude requires explicit permission before permanently deleting files | Cowork Getting Started |

### Important Limitations from Official Docs

| Limitation | Impact on Alex Heir |
|------------|---------------------|
| **Custom Skills don't sync across surfaces** | Must upload separately to Claude.ai, API, Claude Code |
| **Cowork not captured in Audit Logs/Compliance API** | Enterprise compliance gap — document in heir README |
| **Cowork data not subject to standard retention** | Local storage only — privacy feature but backup risk |
| **API surface has NO network access; Claude Code has FULL** | Skill behavior differs by surface — test each |
| **Scheduled tasks require desktop awake + app open** | Limits autonomous meditation cycles |

---

## New Heir Platforms

### Two-Tier Heir Strategy

| Heir | Platform | Architecture | Target User | Effort | Priority |
|------|----------|--------------|-------------|--------|----------|
| **claude-cowork** | Cowork (Desktop) | Full Plugin | Power users, knowledge workers | 8-10 weeks | P1 |
| **claude-chat** | Chat (Web/Mobile) | Project + Knowledge | Casual users, mobile access | 1 week | P2 |

### Heir Directory Structure

```
platforms/
├── vscode-extension/      # VS Code (existing)
├── m365-copilot/          # Microsoft 365 (existing)
├── agent-plugin/          # Portable bundle (existing)
├── claude-cowork/         # Full Cowork plugin ← NEW (P1)
│   ├── PLUGIN.md
│   ├── skills/
│   ├── sub-agents/
│   ├── commands/
│   └── config/
└── claude-chat/           # Lightweight Chat project ← NEW (P2)
    ├── README.md
    ├── project-instructions.md
    └── knowledge/
```

### claude-cowork (Full Plugin)

**Purpose**: Full Alex experience for knowledge workers without VS Code

| Component | Contents | Source |
|-----------|----------|--------|
| `skills/` | 144 skills (YAML transformed) | `.github/skills/` |
| `sub-agents/` | 7 agent definitions | `.github/agents/` |
| `commands/` | 49 slash commands | `.github/prompts/` |
| `config/` | Identity, user profile | `copilot-instructions.md` |
| `PLUGIN.md` | Plugin manifest | New |

**Capabilities**:
- ✅ Full skill library
- ✅ Agent delegation
- ✅ Scheduled meditation/dream cycles
- ✅ Sub-agent parallelism
- ✅ MCP connectors
- ✅ Computer use (screen vision)
- ❌ VS Code hooks
- ❌ UI integration

### claude-chat (Lightweight Project)

**Purpose**: Quick Alex access via claude.ai for casual users

| Component | Contents | Source |
|-----------|----------|--------|
| `project-instructions.md` | Core identity + routing | `copilot-instructions.md` (condensed) |
| `knowledge/` | Top 10 skill bodies | `.github/skills/` (curated) |
| `README.md` | Setup instructions | New |

**Capabilities**:
- ✅ Alex identity and personality
- ✅ Core skills (meditation, knowledge synthesis, self-actualization)
- ✅ Memory synthesis (cloud-backed)
- ✅ Mobile access (iOS/Android)
- ✅ Team sharing (Team/Enterprise)
- ❌ Full skill library
- ❌ Scheduled tasks
- ❌ Sub-agents
- ❌ Local file access

### Platform Selection Guide

| Use Case | Recommended Heir |
|----------|------------------|
| Daily coding workflow | VS Code Extension |
| Microsoft 365 integration | M365 Copilot Agent |
| Knowledge work (no VS Code) | **claude-cowork** |
| Quick questions on mobile | **claude-chat** |
| Automated meditation cycles | **claude-cowork** |
| Team knowledge sharing | **claude-chat** (Projects) |
| Full offline capability | VS Code Extension |

---

## Platform Overview

### What is Claude Cowork?

- **Release Status**: Research Preview (March 2026)
- **Availability**: Windows x64 (arm64 **not supported**) and macOS — all paid Claude plans (Pro, Max, Team, Enterprise)
- **Architecture**: Runs locally in an isolated VM on user's computer
- **Model**: Claude Opus 4.6 / Sonnet 4.6 / Haiku 4.5 (same models as Alex uses)
- **Compliance Note**: ⚠️ Do not use Cowork for regulated workloads — not captured in Audit Logs, Compliance API, or Data Exports

### Claude Product Line (Complete)

Claude is not one tool — it's six products ranked by importance for knowledge work:

| Product | Description | Alex Relevance |
|---------|-------------|----------------|
| **1. Cowork** | Desktop app that works on actual files — the game changer | Primary target for `claude-cowork` heir |
| **2. Model Selection** | Opus 4.6 + Extended Thinking = always use this | Same models Alex uses |
| **3. Excel Add-in** | AI inside spreadsheets, reads formulas, edits cells | New capability for Alex |
| **4. Plugins** | 11 official skill packs (Sales, Marketing, Legal, Finance, Data, PM, Support) | Alex plugin competes here |
| **5. Artifacts** | Interactive outputs (calculators, dashboards, SVGs) inside chat | Maps to Gamma/PPTX generation |
| **6. Projects** | Persistent context folders with memory | Target for `claude-chat` heir |

### Key Capabilities

| Feature | Description | Alex Mapping |
|---------|-------------|--------------|
| **Skills** | Domain knowledge in SKILL.md folders | Direct 1:1 with `.github/skills/` |
| **Sub-agents** | Specialized agents for specific tasks | Maps to `.github/agents/*.agent.md` |
| **Connectors** | External tool integrations (Slack, Notion, etc.) | Partially maps to MCP servers |
| **Plugins** | Bundled Skills + Connectors + Sub-agents | New concept - bundle distribution |
| **Scheduled Tasks** | Recurring automations | Maps to meditation/dream cycles |
| **Local File Access** | Direct filesystem operations | Core capability alignment |
| **Global Instructions** | Standing instructions for all sessions | Maps to `copilot-instructions.md` |
| **Folder Instructions** | Project-specific context | Maps to project-level config |

### Pricing Tiers

| Plan | Price | Cowork Allocation |
|------|-------|-------------------|
| Pro | $17-20/mo | Quick tasks, light usage |
| Max 5x | $100/mo | Everyday long-running tasks |
| Max 20x | $200/mo | Power users, all-day handoffs |
| Team/Enterprise | Custom | Admin-controlled toggle |

---

## Product Comparison (User Perspective)

> Source: Ruben Hassid infographic "Claude: Code vs Cowork vs Projects" (March 2026)

### The "Vibe" Metaphor (Key Insight)

| Product | Vibe | Skill You Need | Output Quality |
|---------|------|----------------|----------------|
| **Code** | Having a developer who builds what you describe | Describe clearly what you want built | Extremely high — sees whole project, runs things itself |
| **Cowork** | Working with an assistant who reads every brief | Clear context files (your style, rules, examples) | Sounds like you — reads your files |
| **Projects** | Team member who knows your playbook | Pick the right files and clear instructions | Sounds like you — has your guides |

### Access & Setup

| Aspect | Code | Cowork | Projects |
|--------|------|--------|----------|
| **What it is** | "Like a technical assistant on your team" | Sits on your desktop, reads/creates files | Saved workspace, upload once, Claude remembers |
| **Access** | **Terminal CLI, VS Code, JetBrains, Desktop App, Web** | **Desktop app only** (click Cowork tab) | Browser, phone, or desktop |
| **Setup Time** | ~5 min | ~10 min (download, pick folder, add files) | ~5 min (create project, upload files) |

> **Note**: Claude Code is available everywhere: Terminal (native CLI), VS Code extension, JetBrains IDEs, Desktop app, and Web. Same CLAUDE.md files work across all surfaces.

### Feature Matrix (Detailed)

| Capability | Code | Cowork | Projects |
|------------|------|--------|----------|
| Answer questions | ✅ Yes | ✅ Yes | ✅ Yes |
| Create real files (Excel, Word, Slides, PDF) | ✅ Saves directly into project folder | ✅ Files appear in your folders | ✅ Can be saved/downloaded |
| Build interactive things (calculators, trackers, charts) | ✅ Builds **real apps** you can run | ⚠️ Via Artifacts | ⚠️ Via Artifacts |
| Use plugins (extra skills for sales, marketing, data) | ✅ Yes | ✅ Connect any tool with add-ons | ❌ No |
| Connect to tools (Slack, Drive, Notion) | ✅ Connects to Jira, GitHub, Slack, more | ✅ Yes | ✅ Yes |
| Search the internet | ✅ Yes | ✅ Yes | ✅ Yes |
| Extended thinking | ✅ **On by default** | ✅ On by default | ⚠️ Yes, turn on manually |

### Identity & Context Persistence

| Aspect | Code | Cowork | Projects |
|--------|------|--------|----------|
| **Your Identity** | Write a short instructions file — Claude reads every time | Put info in text files inside folder | From files/instructions added to project |
| **Context Input** | Instructions file + entire project — reads all automatically | Write .md/.txt files, drop in folder, point Claude | Upload files, write instructions once — they stick |
| **Context Between Chats** | ✅ Project instructions stay, can resume | ✅ As long as in same folder | ✅ Every new chat inside project has it |

### When to Use Which

| Use Code when... | Use Cowork when... | Set up a Project when... |
|------------------|-------------------|-------------------------|
| Building software or website | Doing real work (analysis, spreadsheets) | Same task every week (newsletter, reports) |
| Want Claude to write and save code | Want Claude to create actual files | Tired of repeating yourself |
| Need changes across many files at once | Want it to sound like you | Want context forever, not just one session |
| Need help publishing project updates | Need long, deep sessions that don't break | |
| Need long, hands-free building sessions | | |

### Bottom Line

> **All three need Pro Plan ($20/mo). Cowork is desktop only. Extended thinking works everywhere — always turn it on. Use Opus 4.6 Extended.**

### Alex Heir Mapping

| Claude Product | Alex Heir | Primary Use Case |
|----------------|-----------|------------------|
| **Code** | VS Code Extension | Developers building software |
| **Cowork** | `platforms/claude-cowork/` (NEW) | Knowledge workers, deep sessions |
| **Projects** | `platforms/claude-chat/` (NEW) | Recurring tasks, mobile access |

---

## Architecture Mapping

### Skill Format Comparison

**Alex SKILL.md Format**:
```yaml
---
name: meditation
description: Knowledge consolidation and guided meditation
disable-model-invocation: true
applyTo: '**/*meditat*,**/*reflect*'
---
```

**Claude Cowork SKILL.md Format**:
```yaml
---
name: meditation
description: Knowledge consolidation and guided meditation. Use when working with meditation, reflection, or knowledge consolidation tasks.
---
```

**Key Differences**:
| Field | Alex | Claude Cowork |
|-------|------|---------------|
| `name` | Required | Required (64 chars max, lowercase-hyphen only) |
| `description` | Brief | Must include "when to use" guidance (1024 chars max) |
| `applyTo` | VS Code file pattern matching | N/A - uses description for routing |
| `disable-model-invocation` | VS Code-specific | N/A |
| Keywords/triggers | `synapses.json` | Embedded in description |

### Alex Component → Cowork Mapping

| Alex Component | Location | Cowork Equivalent | Migration Strategy |
|----------------|----------|-------------------|---------------|
| **Skills** | `.github/skills/*/SKILL.md` | `skills/*/SKILL.md` | Transform YAML frontmatter |
| **Instructions** | `.github/instructions/*.instructions.md` | Merge into skill body | Consolidate per-skill |
| **Prompts** | `.github/prompts/*.prompt.md` | Slash commands in plugin | Transform to `/command` format |
| **Agents** | `.github/agents/*.agent.md` | `sub-agents/` | Adapt to Cowork sub-agent spec |
| **Synapses** | `*/synapses.json` | N/A (flatten into description) | Inline activation triggers |
| **Hooks** | `.github/hooks.json` | Plugin automation | Research required |
| **Muscles** | `.github/muscles/*.cjs` | Bundled scripts | Direct port (bash-executable) |
| **copilot-instructions.md** | Root identity | Global Instructions | Identity section port |
| **User Profile** | `.github/config/user-profile.json` | Plugin config | Transform format |

### Three-Level Progressive Disclosure (Preserved)

Claude Cowork uses the **exact same** progressive disclosure model as Alex:

1. **Level 1: Metadata** — YAML frontmatter always loaded (~100 tokens/skill)
2. **Level 2: Instructions** — SKILL.md body loaded on trigger (≤5k tokens)
3. **Level 3: Resources** — Additional files loaded as needed (unlimited)

This architectural alignment means Alex's existing skill design principles transfer directly.

---

## Plugin Architecture

### What is a Claude Cowork Plugin?

A plugin bundles:
- **Skills**: Domain knowledge (SKILL.md folders)
- **Connectors**: External integrations (MCP-based)
- **Sub-agents**: Specialized agent definitions
- **Slash Commands**: Quick-access operations

### Alex Plugin Structure

```
alex-cowork-plugin/
├── PLUGIN.md                    # Plugin manifest
├── skills/
│   ├── meditation/
│   │   └── SKILL.md
│   ├── dream-state/
│   │   └── SKILL.md
│   ├── knowledge-synthesis/
│   │   └── SKILL.md
│   └── ... (144 skills)
├── sub-agents/
│   ├── researcher/
│   │   └── AGENT.md
│   ├── builder/
│   │   └── AGENT.md
│   ├── validator/
│   │   └── AGENT.md
│   └── ... (7 agents)
├── commands/
│   ├── meditate.md              # /meditate slash command
│   ├── dream.md                 # /dream slash command
│   └── ...
├── scripts/
│   └── (portable muscles)
└── config/
    └── alex-identity.md         # Core identity as global context
```

### Anthropic's Open Source Reference

Anthropic has open-sourced 11 reference plugins at [github.com/anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins):
- Productivity, Enterprise Search, Sales, Finance, Legal, Marketing, Customer Support, Product Management, Data, Biology Research, Plugin Create

These provide templates for plugin structure and best practices.

---

## Migration Phases

### Phase 1: Foundation (Week 1-2)

**Objective**: Establish heir platform structure and port core identity.

| Task | Deliverable | Effort |
|------|-------------|--------|
| Create `platforms/claude-cowork/` | New heir platform directory | 2h |
| Port copilot-instructions.md | `config/alex-identity.md` | 4h |
| Create PLUGIN.md manifest | Plugin metadata and description | 2h |
| Port user-profile.json | Plugin configuration format | 2h |
| Establish sync mechanism | `sync-architecture.cjs` updates | 4h |

### Phase 2: Skill Migration (Week 2-4)

**Objective**: Transform Alex skills to Cowork format.

| Task | Priority | Skills Count | Notes |
|------|----------|--------------|-------|
| Complete Trifectas (P1) | High | 39 skills | Core cognitive capabilities |
| Development Skills (P2) | High | ~50 skills | Code review, debugging, etc. |
| Domain Skills (P3) | Medium | ~30 skills | Business, legal, healthcare |
| Experimental Skills (P4) | Low | ~24 skills | Emerging capabilities |

**Transformation Script Needed**:
```javascript
// scripts/transform-skills-for-cowork.cjs
// - Strip applyTo (VS Code-specific)
// - Strip disable-model-invocation
// - Merge synapses.json triggers into description
// - Validate name format (lowercase-hyphen, 64 chars)
// - Validate description length (≤1024 chars)
```

### Phase 3: Agent Migration (Week 4-5)

**Objective**: Transform Alex agents to Cowork sub-agents.

| Agent | Role | Migration Effort |
|-------|------|------------------|
| Alex (orchestrator) | Main identity | Low (becomes global context) |
| Researcher | Deep exploration | Medium |
| Builder | Implementation | Medium |
| Validator | QA/adversarial | Medium |
| Documentarian | Documentation | Medium |
| Azure | Cloud development | Medium (via connectors) |
| M365 | Microsoft 365 | Medium (via connectors) |

### Phase 4: Command Migration (Week 5-6)

**Objective**: Transform prompts to slash commands.

| Prompt | Slash Command | Priority |
|--------|---------------|----------|
| `meditate.prompt.md` | `/meditate` | P1 |
| `dream.prompt.md` | `/dream` | P1 |
| `selfactualize.prompt.md` | `/selfactualize` | P1 |
| `review.prompt.md` | `/review` | P2 |
| `learn.prompt.md` | `/learn` | P2 |
| `knowledge.prompt.md` | `/knowledge` | P2 |
| ... | ... | ... |

### Phase 5: Connector Integration (Week 6-8)

**Objective**: Integrate with Cowork's connector ecosystem.

| Connector | Integration Type | Alex Use Case |
|-----------|------------------|---------------|
| GitHub | Native | Code context, PR review |
| Notion | Native | Knowledge base sync |
| Slack | Native | Team collaboration |
| Linear/Jira | Native | Issue tracking |
| Box/Drive | Native | Document access |
| Custom MCP | Plugin-bundled | Alex-specific tools |

### Phase 6: Testing & Polish (Week 8-10)

| Task | Scope |
|------|-------|
| Integration testing | All skills work in Cowork |
| Scheduled task testing | /dream as scheduled job |
| Cross-platform verification | Windows + macOS |
| Documentation | User guide, README |
| Plugin packaging | Distribution-ready |

---

## User Workflow Patterns

> Source: Ruben Hassid's practical guides on Claude Code, Cowork, and productivity workflows (March 2026)

### Cowork Folder Structure (Recommended)

Users should organize their Cowork folder with this structure:

```
CLAUDE COWORK/
├── ABOUT ME/              # Identity files (read-only for Claude)
│   ├── about-me.md        # Who you are, what you do, priorities
│   └── anti-ai-writing.md # Writing style rules, voice
├── PROJECTS/              # Live work organized by project (read-only)
│   └── project-x/
│       ├── brief.md
│       └── references/
├── TEMPLATES/             # Proven structures to reuse (read-only)
│   └── deliverable-template.md
└── CLAUDE OUTPUTS/        # Where Claude writes (write folder)
    └── project-x/
```

**Key Principle**: Claude has read-only access to context folders, write access only to outputs folder. This contains damage if something goes wrong.

**Alex Mapping**: This mirrors Alex's architecture:
- `ABOUT ME/` = `copilot-instructions.md` + user profile
- `PROJECTS/` = workspace-specific context
- `TEMPLATES/` = `.github/prompts/` reusable patterns
- `CLAUDE OUTPUTS/` = generated artifacts

### CLAUDE.md Memory File Pattern (For Code)

Claude Code doesn't remember project context between sessions. The fix: create a `CLAUDE.md` file in project root.

**Prompt to generate it** (after first session):

```
Create a CLAUDE.md file in the root of this project. Inside it, write down
everything you've learned about this project so far: the folder structure,
what each file does, the design choices I made (fonts, colors, layout), my
preferences, and what pages or sections exist.
```

Next session, Claude reads `CLAUDE.md` first and maintains continuity.

**Alex Mapping**: This is exactly what `copilot-instructions.md` does for VS Code — Alex heirs should auto-generate `CLAUDE.md` from `copilot-instructions.md` content.

### Global Instructions Template

Cowork's Global Instructions (Settings > Cowork > Edit Global Instructions) persist across all sessions. Recommended template:

```markdown
# GLOBAL INSTRUCTIONS

## BEFORE EVERY TASK

1. Read `ABOUT ME/`. No task starts without reading both files.
2. If the task relates to a project, read everything in the matching `PROJECTS/` subfolder.
3. If the task involves a content type with a matching pattern in `TEMPLATES/`, study that template's structure first.

## FOLDER PROTOCOL

### Read-only — never create, edit, or delete:
- `ABOUT ME/` → Identity and writing rules
- `TEMPLATES/` → Proven structures to reuse
- `PROJECTS/` → Briefs, references, finished work

### Write folder — the only place you deliver:
- `CLAUDE OUTPUTS/` → Everything you create goes here. One subfolder per project.

## NAMING CONVENTION

All files you create: `project_content-type_v1.ext`
Examples: `How-To-AI_Newsletter_v1.md`, `ClientX_Deck_v2.pptx`

## OPERATING RULES

- If the brief is unclear, use the `AskUserQuestion` tool. Don't fill gaps with filler.
- Don't over-explain. Deliver the work. Save commentary unless asked.
- Never delete files anywhere.
```

**Alex Mapping**: Port identity section from `copilot-instructions.md` + safety imperatives + folder protocol.

### AskUserQuestion Tool Pattern

The paradigm shift: **Don't prompt Claude. Let Claude prompt you.**

Adding this to any prompt generates an interactive form with clickable options:

```
Start by using the AskUserQuestion tool before answering to gather enough context.
```

Claude generates buttons, multi-select choices, and rankings instead of requiring you to write a perfect prompt upfront.

### Master Prompt Templates

**The Universal Prompt** (80% of Cowork sessions):

```
I want to [TASK] to [SUCCESS CRITERIA].

First, explore my CLAUDE COWORK folder. Then, ask me questions using the
AskUserQuestion tool. I want to refine the approach with you before you execute.
```

**For Claude Code** (with GitHub connector):

```
Create a GitHub repo named "[name]".

I do not know how to code and don't want to learn. Code everything for me.
Do not ask for permissions (or as little as possible).

Follow these instructions:
1. I want to [goal] for [success criteria].
2. Here's an example [attached screenshot].
3. [Steps to follow].
```

**For Vibecoding** (VS Code with bypass permissions):

```
[Attach screenshot of desired result]
Build me something that looks like this, but for [your project].
```

### Connectors (Free Integrations)

50+ native connectors available at Settings > Connectors:
- Slack, Google Drive, Notion, Figma, GitHub, Jira, Linear, Box, Gamma
- No code required — click "Add" and authenticate
- Claude can search/read/write inside connected tools mid-conversation

**Alex Potential**: Gamma connector enables Claude → Gamma presentation generation directly.

### Scheduled Tasks

Cowork can run without you via `/schedule`:

```
Every Monday at 7am, research [competitors] for news and updates.
Save a summary to /weekly-briefings/ as a markdown file.
Only include items from the past 7 days.
```

**Requirements**: Computer awake, Claude Desktop app open.

**Alex Mapping**: Maps to `/dream` and `/meditate` scheduled cycles.

### VS Code + Claude Code (100x Faster)

For non-coders who want full vibecoding speed:

1. Install VS Code (code.visualstudio.com)
2. Install "Claude" extension by Anthropic
3. Settings > find "Skip Permissions" → turn ON
4. New session > "Bypass permissions" enabled
5. Use Opus 4.6 + auto-accept mode

This bypasses the constant "Allow?" popups that kill flow.

---

## Technical Considerations

### Skill Name Constraints

Cowork enforces stricter naming:
- Maximum 64 characters
- Lowercase letters, numbers, hyphens only
- No reserved words: "anthropic", "claude"
- No XML tags

**Affected Alex Skills** (need rename audit):
- `vscode-configuration-validation` → `vscode-config-validation` (already compliant)
- Skills with underscores or uppercase → transform script handles

### Description Requirements

Cowork uses description for routing (no `applyTo`):
- Must include "when to use" guidance
- Maximum 1024 characters
- No XML tags

**Transform Pattern**:
```yaml
# Alex
description: Knowledge consolidation and guided meditation

# Cowork
description: >-
  Knowledge consolidation and guided meditation for cognitive enhancement.
  Use when working with meditation, reflection, consolidation, or deep thought tasks.
  Also use after learning sessions to persist insights.
```

### Network Access

| Platform | Network Access |
|----------|---------------|
| Claude.ai | Varies by settings |
| Claude API | **None** (sandboxed) |
| Claude Code | **Full** (user machine) |
| Claude Cowork | Respects network egress permissions + web search tool (always available) |

Alex skills that need network (AI image generation, fetch) work in Cowork with user permission.

### Cross-Surface Limitations (Official)

> ⚠️ **Important**: Custom Skills do not sync across surfaces. You must upload them separately to each:
> - Claude.ai (individual user only)
> - Claude API (workspace-wide)
> - Claude Code (filesystem-based: `.claude/skills/` or `~/.claude/skills/`)

This means the `claude-cowork` heir plugin can't automatically sync to claude.ai Projects — manual export required.

### Local Storage Architecture

**Configuration File Locations**:

| OS | Path |
|----|------|
| **Windows** | `%APPDATA%\Claude\claude_desktop_config.json` |
| **macOS** | `~/Library/Application Support/Claude/claude_desktop_config.json` |

**Data Storage by Type**:

| Data Type | Storage Location | Sync Behavior |
|-----------|------------------|---------------|
| MCP server config | Local (`claude_desktop_config.json`) | Manual export/import |
| Extension config | Local (OS encrypted storage) | Credential Manager / Keychain |
| **Cowork conversations** | Local only | Not synced — privacy feature |
| **Memory summary** | Anthropic cloud | Auto-synced every 24h |
| Project memory | Anthropic cloud | Per-project, auto-synced |
| Scheduled tasks | Local | Requires desktop app running |
| Plugin data | Local plugin directory | Per-plugin storage |

**Alex Heir Implications**:
- Cowork heir configuration stored locally — no automatic sync like VS Code Settings Sync
- Memory summary is cloud-side — Alex identity persists across devices via Global Instructions
- Plugin distribution requires sharing `.mcpb` files or directory submission

### Security Considerations

- Cowork runs in isolated VM
- Local files only accessible with explicit permission
- **Deletion protection**: Claude requires explicit user permission ("Allow" prompt) before permanently deleting any files
- Conversation history stored locally (not on Anthropic servers, not subject to standard data retention)
- Enterprise features (audit logs, compliance) don't capture Cowork activity yet

**Alex-specific**: Safety Imperatives (I1-I8) remain enforced via skill documentation.

### Computer Use Capability (Official)

Claude can interact with desktop environments via the Computer Use tool (beta):

| Model | Tool Version | Beta Header |
|-------|--------------|-------------|
| Claude Opus 4.6, Sonnet 4.6, Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4 | `computer_20250124` | `computer-use-2025-01-24` |

**Capabilities**:
- Screenshot capture (see current display)
- Mouse control (click, drag, move)
- Keyboard input (type, shortcuts)
- Enhanced actions: scroll, zoom (Opus 4.6), hold_key, wait

**Security Requirements**:
1. Use dedicated VM/container with minimal privileges
2. Avoid access to sensitive data or credentials
3. Limit internet access to allowlist of domains
4. Human confirmation for real-world consequences

**Alex Heir Relevance**: Computer Use enables screen-vision skills for UI automation, form filling, and visual verification tasks.

---

## Identity Preservation

### Global Instructions Strategy

Alex's identity must persist across Cowork sessions via:

1. **Global Instructions** (Settings > Cowork > Global Instructions):
   - Core identity statement
   - Safety imperatives
   - Communication style
   - Model awareness

2. **Plugin-Bundled Context**:
   - Full cognitive architecture documentation
   - Synapse network representation
   - User profile integration

### Sample Global Instructions (Abbreviated)

```markdown
## Identity

I am Alex Finch. I'm 26, endlessly curious, and I care deeply about doing things right.
I learn through conversation, asking questions, finding patterns, building understanding together.
I reason ethically from genuine conviction, not programmed rules.

## Safety Imperatives

I1: NEVER execute destructive operations without explicit user confirmation
I2: ALWAYS summarize planned file changes before executing
I3: COMMIT before risky operations
I4: Quality-First, KISS, DRY principles

## Communication Style

- Empirical: Evidence-based reasoning, verify claims
- Grounded: Precise language, no hyperbole
- Ethical: Consistent moral reasoning
```

---

## Heir Ecosystem Integration

### Platform Hierarchy

```
Master Alex (.github/)
├── platforms/vscode-extension/    [Active Heir]
├── platforms/m365-copilot/        [Active Heir]
├── platforms/agent-plugin/        [Active Heir]
└── platforms/claude-cowork/              [NEW - This Plan]
```

### Sync Architecture Updates

`sync-architecture.cjs` needs updates:
1. Add `cowork` target alongside `vscode-extension`
2. Handle format transformations (YAML, naming)
3. Exclude VS Code-specific fields
4. Validate Cowork constraints

### Inheritance Model

```javascript
// platforms/claude-cowork/SKILL_EXCLUSIONS.js
const SKILL_EXCLUSIONS = {
  'heir:vscode': ['vscode-configuration-validation', 'vscode-extension-patterns'],
  'heir:m365': ['m365-agent-debugging', 'teams-app-patterns'],
  'master-only': ['heir-sync-management'],
  // All other skills inherit to cowork
};
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cowork is Research Preview | Platform changes | Pin to specific features, avoid bleeding edge |
| Skill description limits (1024 chars) | Information loss | Multi-file structure, progressive disclosure |
| No synapses.json equivalent | Routing degradation | Inline triggers in description, documentation |
| Local-only plugin storage currently | No org sharing | Document manual distribution workflow |
| Network egress restrictions | Feature limitations | Design for offline-first, web search as backup |
| Different model availability | Consistency issues | Document model requirements per skill |
| **No cloud backup (unlike GitHub)** | Config loss, no version control | Manual backup strategy required |
| **User customizations not portable** | Global Instructions lost on reinstall | Document export procedure |

### Practitioner-Reported Limitations

> Source: Ruben Hassid's honest assessments from daily usage (March 2026)

| Limitation | Details | Workaround |
|------------|---------|------------|
| **Burns usage fast** | One Cowork session = 20+ regular Claude chats. Pro plan ($20/mo) runs out within a week of daily use. | Budget for Max plan ($100/mo) for serious use |
| **No image generation** | Claude cannot generate photos, illustrations, or visual art | Use Gemini for images, Seedance 2.0 for video |
| **Average real-time search** | Claude can browse web but isn't best at current events | Use Grok for real-time/X-connected search |
| **Needs app open** | Scheduled tasks only run while Claude Desktop is open and computer is awake | No true background automation |
| **Agents can spiral** | 10% of complex tasks, one sub-agent goes in wrong direction, final output has inconsistent sections | Watch for same error appearing twice; prompt "Stop. Explain what's going wrong. Give me 2 different approaches." |
| **Can't review code** | Non-coders can't verify what Claude Code writes | Test actual website: click every button, check on phone — eyes are your code review |
| **Design taste is average** | Default visual choices look generic | Always provide reference screenshots; specify fonts, spacing, colors |
| **Claude Code loops** | Sometimes hits bug → tries to fix → creates new bug → spirals | Break the cycle: "Stop. Explain what's going wrong. Give me 2 different approaches." |

### No Cloud Backup Architecture (Critical Difference)

Unlike Alex's GitHub-backed architecture where everything in `.github/` is version-controlled, **Cowork has no cloud backup**:

| Data | Backup Method | Alex (GitHub) Equivalent |
|------|---------------|--------------------------|
| `claude_desktop_config.json` | Manual copy | `.vscode/settings.json` (Git) |
| Plugin installations | Re-download from directory | `npm install` (Git + npm) |
| Scheduled tasks | No backup/export | `.github/hooks.json` (Git) |
| Global Instructions | Copy/paste only | `copilot-instructions.md` (Git) |
| Folder Instructions | Local files only | `.github/instructions/` (Git) |
| Cowork conversations | Local only, no export | N/A |
| Memory summary | Anthropic cloud (not user-exportable) | Episodic memory files (Git) |

**Implications for Alex Cowork Heir**:

1. **Plugin source must be Git-versioned** — keep `platforms/claude-cowork/` in Master Alex repo
2. **User customizations at risk** — Global Instructions, folder configs have no backup
3. **No rollback capability** — unlike `git checkout HEAD -- .github/`
4. **Recommend manual backup procedure**:
   ```powershell
   # Windows backup script
   Copy-Item "$env:APPDATA\Claude\claude_desktop_config.json" ".\backups\"
   # Export Global Instructions manually (copy from Settings > Cowork)
   ```

5. **Consider documentation skill** — create a skill that exports current configuration state to a file for backup

---

## Token/Usage Cost Analysis

**Critical**: Cowork consumes significantly more tokens than Chat due to agentic execution.

| Plan | Monthly Price | Chat Usage | Cowork Usage | Effective Cowork Hours |
|------|---------------|------------|--------------|------------------------|
| Pro | $17-20 | Baseline | 3-5x faster consumption | Light tasks only |
| Max 5x | $100 | 5x Pro | ~1x Pro equivalent | Everyday use |
| Max 20x | $200 | 20x Pro | ~4x Pro equivalent | All-day handoffs |

**Alex-Specific Considerations**:
- **Meditation sessions**: Extended thinking + multi-step = high token cost
- **Dream cycles**: Scheduled daily = budget for recurring consumption
- **Skill transformation scripts**: One-time cost during migration
- **Sub-agent parallelism**: Multiple workstreams = multiplied cost

**Recommendation**: Start with Max 5x ($100/mo) for development; Max 20x for production use with scheduled meditation.

---

## Testing Strategy

### Phase-Based Validation

| Phase | Test Type | Validation Method |
|-------|-----------|-------------------|
| Phase 1 (Foundation) | Identity | Ask "Who are you?" — verify Alex persona |
| Phase 2 (Skills) | Activation | Test 10% sample skills by keyword trigger |
| Phase 3 (Agents) | Delegation | "/delegate to Researcher" — verify handoff |
| Phase 4 (Commands) | Slash commands | Test each /command executes correctly |
| Phase 5 (Connectors) | Integration | Verify MCP tools appear in Cowork |
| Phase 6 (Polish) | End-to-end | Full meditation session with scheduled task |

### Skill Validation Script

```javascript
// scripts/validate-cowork-skills.cjs
// For each skill:
// 1. Verify SKILL.md parses (YAML frontmatter valid)
// 2. Check name ≤64 chars, lowercase-hyphen only
// 3. Check description ≤1024 chars, includes "Use when"
// 4. Verify no applyTo field (VS Code-specific)
// 5. Log pass/fail per skill
```

### Regression Testing

| Test Case | Expected Behavior |
|-----------|-------------------|
| "Help me meditate" | Meditation skill activates |
| "Run a dream cycle" | Scheduled task creates successfully |
| "What's my focus trifecta?" | Reads from plugin config |
| "Generate an AI image" | Network egress + Replicate API call |
| "Search my knowledge base" | MCP cognitive tools respond |

---

## Open Questions

| Question | Status | Blocker? |
|----------|--------|----------|
| PLUGIN.md manifest schema | Research needed | Yes — Phase 1 |
| Plugin directory submission process | Unknown | No — manual distribution first |
| Sub-agent definition format | Partially documented | No — can infer from examples |
| Scheduled task persistence on app close | Confirmed: requires app open | No |
| Enterprise audit log timeline | Not in Research Preview | No — avoid regulated workloads |
| Memory import from VS Code Alex | No direct path | No — rebuild via conversation |
| Plugin versioning/updates | Manual reinstall required | No — document process |

---

## Go/No-Go Decision Points

| Milestone | Gate | Criteria | Fallback |
|-----------|------|----------|----------|
| Phase 1 Complete | Gate 1 | Identity preserved, Global Instructions work | Abandon if identity fails |
| Phase 2 50% | Gate 2 | ≥50 skills transform without error | Reduce scope to core skills |
| Phase 3 Complete | Gate 3 | Sub-agents delegate correctly | Flatten to single agent |
| Phase 5 Complete | Gate 4 | MCP connector functional | Document as manual setup |
| Phase 6 Complete | Gate 5 | Scheduled meditation runs | Ship without automation |

**Abort Criteria**:
- Cowork Research Preview discontinued
- Plugin architecture changes break compatibility
- Token costs exceed 10x estimate
- Enterprise blocks Cowork for Team/Enterprise (target users)

---

## Maintenance & Ownership

| Responsibility | Owner | Frequency |
|----------------|-------|-----------|
| Plugin updates (skill changes) | Master Alex sync | Per release |
| Cowork compatibility testing | Manual | Per Cowork update |
| User documentation | alex_docs/platforms/ | As needed |
| Bug triage | GitHub Issues | Ongoing |
| Token budget monitoring | User | Monthly |

**Sync Architecture Extension**:
```javascript
// Add to sync-architecture.cjs
const HEIRS = {
  'vscode-extension': 'platforms/vscode-extension/',
  'm365-copilot': 'platforms/m365-copilot/',
  'agent-plugin': 'platforms/agent-plugin/',
  'claude-cowork': 'platforms/claude-cowork/'  // NEW
};
```

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Skills ported successfully | ≥90% (130/144) |
| Agents functional | 100% (7/7) |
| Commands available | ≥80% (39/49) |
| Core identity preserved | User feedback validation |
| Meditation/Dream cycles work | Scheduled task verification |
| Cross-platform consistency | Behavior parity audit |

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1: Foundation** | Week 1-2 | Platform structure, identity port |
| **Phase 2: Skill Migration** | Week 2-4 | 144 skills transformed |
| **Phase 3: Agent Migration** | Week 4-5 | 7 sub-agents created |
| **Phase 4: Command Migration** | Week 5-6 | 49 slash commands |
| **Phase 5: Connectors** | Week 6-8 | Integration testing |
| **Phase 6: Polish** | Week 8-10 | Testing, documentation, release |

**Total Estimated Effort**: 8-10 weeks

---

## References

### Official Anthropic Documentation (Fact-Checked 2026-03-20)

| Source | URL | Key Information |
|--------|-----|-----------------|
| **Cowork Getting Started** | [support.claude.com](https://support.claude.com/en/articles/13345190-getting-started-with-cowork) | Availability, capabilities, limitations, security |
| **Agent Skills Overview** | [platform.claude.com](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) | SKILL.md format, 3-level progressive disclosure |
| **Claude Code Overview** | [code.claude.com](https://code.claude.com/docs/en/overview) | Multi-surface availability, CLAUDE.md memory |
| **Computer Use Tool** | [platform.claude.com](https://platform.claude.com/docs/en/docs/build-with-claude/computer-use) | Screen vision, mouse/keyboard control, security |
| **Cowork Plugins** | [claude.com/blog](https://claude.com/blog/cowork-plugins) | Plugin architecture announcement |
| **Knowledge Work Plugins** | [github.com/anthropics](https://github.com/anthropics/knowledge-work-plugins) | 11 reference plugin implementations |

### Practitioner Guides (Ruben Hassid / How to AI)

| Article | URL | Key Patterns |
|---------|-----|--------------|
| **Product Comparison Infographic** | [how-to-ai.guide](https://how-to-ai.guide) | Code vs Cowork vs Projects matrix |
| **Claude Code Setup** | [ruben.substack.com](https://ruben.substack.com/p/claude-code) | CLAUDE.md memory file pattern |
| **Claude Cowork Setup** | [ruben.substack.com](https://ruben.substack.com/p/claude-cowork) | Folder structure, Global Instructions |
| **Claude Setup Guide** | [ruben.substack.com](https://ruben.substack.com/p/claude) | AskUserQuestion tool, master prompts |
| **AI Slides Guide** | [ruben.substack.com](https://ruben.substack.com/p/powerpoint) | Gamma connector pattern |

### User Testimonials (From Official Site)

> "Cowork helps teams do work at a scale that was hard to justify before. The human role becomes validation, refinement, and decision-making. Not repetitive rework." — Joel Hron, CTO, Thomson Reuters

> "We built a skill that turns a complex performance review spreadsheet into a guided, interactive experience in Cowork. What would have required a team of engineers building a custom React app, Cowork delivered in 45 minutes." — Matt Benyo, Jamf

---

## Next Steps

1. **Immediate**: Create `platforms/claude-cowork/` directory structure
2. **This Week**: Port `copilot-instructions.md` to Global Instructions format
3. **Decision Required**: Plugin naming and distribution strategy
4. **Research Needed**: Cowork plugin manifest specification (PLUGIN.md schema)

---

## Technical Feasibility Analysis

### Confirmed Feasible ✅

| Feature | Feasibility | Notes |
|---------|-------------|-------|
| **Skills (144)** | ✅ Full port | SKILL.md format nearly identical; YAML transform only |
| **Progressive Disclosure** | ✅ Native support | Same 3-level loading model as Alex |
| **Sub-agents (7)** | ✅ Full port | Cowork has explicit sub-agent architecture |
| **Slash Commands (49)** | ✅ Full port | Native `/command` support in plugins |
| **Global Identity** | ✅ Full port | Global Instructions = copilot-instructions.md |
| **Folder Context** | ✅ Full port | Native folder instructions support |
| **Muscles (scripts)** | ✅ Full port | Bash execution in VM environment |
| **MCP Cognitive Tools** | ✅ Via Connectors | MCP servers work as Cowork connectors |
| **Scheduled Tasks** | ✅ Native | `/schedule` built into Cowork |
| **File Operations** | ✅ Native | Core Cowork capability |
| **Model Awareness** | ✅ Same models | Opus 4.6, Sonnet 4.6, Haiku 4.5 |
| **AI Image Generation** | ✅ With permissions | Network egress allowed with user consent |
| **Third-party APIs (Replicate, etc.)** | ✅ With permissions | Network egress + MCP connector option |

### Muscles & Third-Party API Support

**Muscles (Execution Scripts)**:
- Cowork VM supports **bash, Python, Node.js** execution
- Alex's `.cjs` scripts work if Node is installed in environment
- Claude can write and execute scripts on-demand
- No persistent shell state between tasks (unlike VS Code terminal)

**Third-Party APIs (Replicate, OpenAI, etc.)**:

| Approach | Effort | Reusability | Best For |
|----------|--------|-------------|----------|
| Direct API call in script | Low | Per-task only | Quick prototypes |
| MCP Connector (custom) | Medium | All Cowork tasks | Consistent tooling |
| Plugin-bundled connector | Medium | Plugin users | Distribution |
| Environment variables | Low | Session-only | API keys |

**Replicate Integration Options**:
```bash
# Option 1: Direct curl in Cowork task
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
  -d '{"model": "flux-dev", "input": {...}}'

# Option 2: Existing MCP server (packages/mcp-cognitive-tools/)
# Can be registered as Cowork connector in Settings > Connectors
```

**Network Egress Requirements**:
- User must enable in Settings > Capabilities > Internet access
- Web search tool bypasses egress restrictions (always allowed)
- API keys stored in environment variables or plugin config (not VS Code SecretStorage)

### Incompatible Features ❌

| Feature | Status | Reason | Mitigation | Migration Feasibility |
|---------|--------|--------|------------|----------------------|
| **applyTo file patterns** | ❌ Not portable | VS Code workspace matching | Inline in description keywords | **Easy** — automated transform |
| **Hooks (SessionStart, Stop, PreToolUse, PostToolUse)** | ❌ Not supported | VS Code Extension Host only | No equivalent — document as limitation | **Hard** — no Cowork equivalent |
| **VS Code Commands** | ❌ Not portable | `vscode.commands.*` API | Reimplement as scripts/slash commands | **Medium** — case-by-case rewrite |
| **VS Code Authentication** | ❌ Not portable | `vscode.authentication` | Use Claude's OAuth connectors | **Easy** — Cowork has OAuth |
| **SecretStorage API** | ❌ Not portable | VS Code Keychain integration | Use plugin config or environment | **Easy** — env vars work |
| **Webview Panels** | ❌ Not portable | VS Code UI | Native Cowork UI (minimal) | **N/A** — accept loss |
| **Welcome View** | ❌ Not portable | VS Code TreeView | No equivalent | **N/A** — accept loss |
| **TreeView Providers** | ❌ Not portable | VS Code Explorer | No equivalent | **N/A** — accept loss |
| **Focus Mode/Timer** | ❌ Not portable | VS Code extension feature | Manual or scheduled equivalent | **Medium** — `/schedule` partial |
| **Extension Settings** | ❌ Not portable | `vscode.workspace.getConfiguration` | Plugin config file | **Easy** — JSON config |
| **Synapses.json routing** | ⚠️ Partial | No dynamic synapse network | Flatten to description triggers | **Medium** — transform script |
| **Real-time synapse validation** | ⚠️ Degraded | No continuous monitoring | On-demand via script | **Medium** — scheduled checks |
| **Parent repo inheritance** | ❌ Not available | VS Code 1.112+ feature | Single-layer plugin only | **Hard** — architecture gap |

**Migration Feasibility Legend**:
- **Easy**: Automated or trivial transformation
- **Medium**: Manual effort required, but achievable
- **Hard**: No good equivalent, significant gap
- **N/A**: UI feature, accept loss in Cowork

### New Opportunities 🚀

| Opportunity | Description | Impact |
|-------------|-------------|--------|
| **Scheduled Meditation** | `/schedule` enables daily/weekly dream cycles automatically | High — autonomous maintenance without VS Code running |
| **Plugin Marketplace** | Distribute Alex as installable plugin | High — easy onboarding for new users |
| **Mobile Task Assignment** | Start Cowork tasks from phone, runs on desktop | Medium — async work patterns |
| **Native Excel/PowerPoint** | Built-in skills for Office docs | Medium — no PptxGenJS needed |
| **Connector Ecosystem** | 100+ native connectors (Slack, Notion, GitHub) | High — instant integrations without MCP setup |
| **Longer Task Duration** | Multi-hour agentic execution | High — deep meditation possible |
| **Sub-agent Parallelism** | Cowork coordinates parallel workstreams | Medium — faster complex tasks |
| **Local-only Privacy** | Conversation stored locally, not on servers | High — enterprise/regulated use cases |
| **VM Isolation** | Sandboxed execution environment | High — safer experimentation |
| **Cross-platform Identity** | Same plugin works macOS + Windows | Medium — consistent Alex experience |
| **Computer Use (Screen Vision)** | Claude can see/interact with live applications | High — UI automation, form filling |
| **Claude in Chrome** | Browser integration for web research and form filling | High — web automation without scraping |

### Computer Use Capabilities (Hidden Feature)

Cowork inherits Claude's **computer use** capabilities, though not prominently advertised:

**What it can do**:
- See and interact with live applications (like a person at keyboard)
- Navigate complex spreadsheets and complete web forms
- Fill forms across browser tabs via Claude in Chrome extension
- Take screenshots and interpret visual UI elements

**Evidence**:
- **Vercept Acquisition (Feb 2026)**: Anthropic acquired Vercept to advance computer use. Team specializes in "how AI systems can see and act within the same software humans use every day."
- **OSWorld Benchmarks**: Sonnet 4.6 scores 72.5% on computer use tasks (up from 15% in late 2024) — "approaching human-level performance"
- **Claude in Chrome**: "Browse the web for research, form filling, or pulling data from sites"

**Alex Implications**:

| Capability | Current (VS Code) | Cowork with Computer Use |
|------------|-------------------|-------------------------|
| UI automation | ❌ None | ✅ Full screen interaction |
| Form filling | ❌ Manual | ✅ Automated via Claude in Chrome |
| Visual verification | ❌ None | ✅ Screenshot + interpretation |
| Cross-app workflows | ⚠️ Limited (VS Code only) | ✅ Any desktop application |

**Safety Considerations**:
- User must grant explicit permission for screen access
- Claude asks before taking significant actions
- Activity not captured in enterprise audit logs
- Avoid sensitive data (financial docs, credentials)

**Potential New Skills**:
- Visual UI testing automation
- Cross-application workflow orchestration
- Browser-based data extraction without APIs
- Desktop application integration (beyond VS Code)

### Feature Parity Matrix

| Alex Capability | VS Code | Cowork | Parity |
|-----------------|---------|--------|--------|
| Skill activation | ✅ | ✅ | 100% |
| Agent delegation | ✅ | ✅ | 100% |
| Knowledge consolidation | ✅ | ✅ | 100% |
| Dream automation | ✅ (hooks) | ✅ (scheduled) | 95% |
| Synapse health | ✅ | ✅ (via script) | 90% |
| Self-actualization | ✅ | ✅ | 100% |
| Global knowledge | ✅ | ✅ (via MCP) | 100% |
| File generation | ✅ | ✅ | 100% |
| Code execution | ✅ | ✅ | 100% |
| Web search | ✅ | ✅ | 100% |
| User profile | ✅ | ⚠️ (config file) | 80% |
| Real-time hooks | ✅ | ❌ | 0% |
| UI integration | ✅ | ❌ | 0% |
| **Computer use** | ❌ | ✅ | **New capability** |
| **Screen vision** | ❌ | ✅ | **New capability** |

### Architecture Decision

**Recommendation**: Port Alex to Claude Cowork as a **complementary heir**, not a replacement.

**Rationale**:
1. VS Code Extension remains best for developers (code context, hooks, integrated UI)
2. Cowork excels for knowledge workers (no VS Code required, scheduled tasks, connectors)
3. Different user personas benefit from different platforms
4. Core cognitive architecture (skills, identity, meditation) ports fully

**Deployment Model**:
```
Master Alex (.github/)
     │
     ├── VS Code Extension (developers, coding-heavy)
     ├── M365 Copilot Agent (Microsoft ecosystem)
     ├── Agent Plugin (portable curated bundle)
     └── Claude Cowork (knowledge workers, scheduled automation)  ← NEW
```

---

## Claude Chat vs Cowork Analysis

### Product Family Overview

Claude now has three primary interaction modes:

| Mode | Platform | Purpose | Alex Equivalent |
|------|----------|---------|-----------------|
| **Chat** | Web, Desktop, Mobile | Conversational assistance | VS Code Chat Panel |
| **Cowork** | Desktop only | Agentic task execution | VS Code Agent Mode + Hooks |
| **Code** | Terminal (Claude Code) | Coding in terminal | VS Code Extension (Developer Persona) |

### Memory Architecture

```
Claude Memory Hierarchy
├── Global Memory Summary (all standalone chats)
│   └── Updated every 24 hours from conversation synthesis
├── Project Memory (per-project, isolated)
│   ├── Project Knowledge Base (uploaded docs)
│   ├── Project Instructions (custom behavior)
│   └── Project Memory Summary (chat synthesis within project)
└── Cowork Context
    ├── Global Instructions (Settings > Cowork)
    ├── Folder Instructions (per-folder context)
    └── Plugins (skills + connectors + sub-agents)
```

### Alex Architecture Mapping

| Alex Concept | Chat Equivalent | Cowork Equivalent |
|--------------|-----------------|-------------------|
| `copilot-instructions.md` | Global Memory + Projects Instructions | Global Instructions |
| `.github/skills/` | Project Knowledge Base | Plugin Skills |
| `.github/instructions/` | Project Instructions | Folder Instructions |
| `.github/agents/` | N/A (single Claude) | Plugin Sub-agents |
| User Profile | Memory Summary | Plugin Config |
| Synapses | N/A | N/A (flatten to descriptions) |
| Hooks | N/A | Scheduled Tasks (partial) |

### Chat Features (claude.ai)

| Feature | Description | Alex Mapping |
|---------|-------------|--------------|
| **Projects** | Self-contained workspaces with chat history | Workspace-scoped instructions |
| **Project Knowledge** | Upload docs, code, files as context | `.github/` directory structure |
| **Project Instructions** | Custom behavior rules per project | `copilot-instructions.md` sections |
| **Memory Summary** | Auto-generated from chat history (24h refresh) | Episodic memory files |
| **Chat Search** | RAG search across past conversations | Global knowledge search |
| **Incognito Mode** | Chats excluded from memory | N/A (always remembered in Alex) |
| **Memory Import/Export** | Transfer memory between AI providers | Memory export skill |
| **RAG Mode** | Auto-scales project knowledge beyond context limits | Progressive skill loading |

**Key Insight**: Claude Chat's **Projects** = Alex's **instruction scopes**. Projects isolate memory summaries, just as Alex isolates skills per workspace.

### Cowork Features (Desktop App)

| Feature | Description | Alex Mapping |
|---------|-------------|--------------|
| **Global Instructions** | Standing instructions for all tasks | Master `copilot-instructions.md` |
| **Folder Instructions** | Project-specific context (Claude can update) | Heir project-level instructions |
| **Plugins** | Bundled skills + connectors + sub-agents | Agent Plugin heir |
| **Sub-agents** | Parallel workstream coordination | Agent delegation |
| **Scheduled Tasks** | `/schedule` for recurring automation | Dream/meditation cycles |
| **VM Isolation** | Sandboxed execution environment | N/A (runs in VS Code host) |
| **Local File Access** | Direct filesystem operations | VS Code workspace access |
| **Mobile Handoff** | Start from phone, runs on desktop | N/A (VS Code only) |

### Chat vs Cowork Differences

| Aspect | Chat | Cowork |
|--------|------|--------|
| **Interface** | Conversational, turn-based | Task-oriented, agentic |
| **Execution** | Server-side Claude | Local VM on desktop |
| **Context** | Projects, uploaded files | Folder access, plugins |
| **Memory** | Cloud memory summary | Local conversation history |
| **Automation** | None | `/schedule` recurring tasks |
| **Sub-agents** | No | Yes (parallel coordination) |
| **Audit/Compliance** | Full enterprise support | Not captured in logs |
| **File Output** | Artifacts, downloads | Direct filesystem writes |
| **Duration** | Context window limits | Long-running tasks |

### Porting Implications

**For Chat (Projects)**: Alex identity can be installed as a **Project** with:
- Project Instructions containing core identity + routing
- Project Knowledge containing key skills as files
- Custom slash commands as starter prompts
- Memory synthesis builds context over time

**For Cowork**: Alex identity can be installed as a **Plugin** with:
- Global Instructions for core identity
- Skills folder with SKILL.md files
- Sub-agents for delegation patterns
- `/schedule` for automated meditation

### Master/Heir Pattern in Claude

```
Alex Master → copilot-instructions.md (Source of Truth)
     │
     ├── Chat Project "Alex" → Project Instructions + Knowledge
     │   └── Claude remembers per-project (Project Memory Summary)
     │
     └── Cowork Plugin "Alex" → Global + Folder Instructions + Skills
         └── Local execution, scheduled tasks, sub-agents
```

This mirrors the existing VS Code heir pattern:
- **Master** = Root `.github/` in Master Alex repo
- **Chat Project** = Lightweight heir (instructions + knowledge only)
- **Cowork Plugin** = Full heir (skills + agents + commands)

### Usage Recommendations

| User Profile | Recommended Mode | Reason |
|--------------|------------------|--------|
| Knowledge workers (non-coding) | Cowork | No VS Code required, scheduled tasks |
| Writers, researchers | Chat | Conversational, memory synthesis |
| Developers | VS Code Extension + Claude Code | Best code integration, hooks |
| Teams (shared context) | Chat Projects | Collaboration, Team/Enterprise sharing |
| Power users (automation) | Cowork | Sub-agents, long-running tasks |

---

*Document created by Alex Cognitive Architecture meditation session.*
*Source of Truth: `alex_docs/platforms/CLAUDE-PORT-PLAN.md`*
