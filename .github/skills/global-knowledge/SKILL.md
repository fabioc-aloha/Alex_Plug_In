---
name: "global-knowledge"
description: "Cross-project knowledge search, pattern recognition, and insight management via unified AI-Memory"
tier: standard
---

# Global Knowledge Skill

> Your past solved problems, accessible from any AI surface.

## Architecture: AI-Memory

Global knowledge lives in a single shared file: **AI-Memory/global-knowledge.md**

This replaces the previous GitHub-based system (~/.alex/global-knowledge/, GK-_/GI-_ files, index.json). The AI-Memory folder is accessible across all surfaces:

- **M365 Copilot**: Reads via OneDriveAndSharePoint capability
- **VS Code**: Reads via local OneDrive sync path. Falls back to `~/.alex/AI-Memory/` when OneDrive is unavailable
- **Agent Builder agents**: Reads via OneDriveAndSharePoint capability

### AI-Memory Files

| File                  | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| `profile.md`          | User identity, preferences, expertise           |
| `notes.md`            | Session notes, reminders, observations          |
| `learning-goals.md`   | Active/completed goals with progress tracking   |
| `global-knowledge.md` | Cross-project insights, patterns, and learnings |

Templates: `platforms/m365-shared/onedrive-templates/AI-Memory/`

## Check Before You Create

**Always search global-knowledge.md before creating new skills, instructions, or prompts.** This prevents duplicate work and ensures institutional knowledge is reused.

### Lookup Process

1. **Search** `AI-Memory/global-knowledge.md` for existing content
2. **Also search** local `.github/skills/` (the answer may already be a skill)
3. **Also search** Copilot Memory (`/memories/`) for VS Code-specific notes
4. **Evaluate** the result:

| Result        | Action                                      |
| ------------- | ------------------------------------------- |
| Exact match   | Adopt directly; don't recreate              |
| Similar match | Adapt as starting point                     |
| No match      | Create new, then add to global-knowledge.md |

This check is mandatory before skill creation (Phase 1 of skill-building procedure).

## Knowledge Organization in global-knowledge.md

Insights are organized by category with a consistent format:

```markdown
### [Topic Title]

- **Source**: [Project or context where learned]
- **Insight**: [The key learning]
- **Date**: [When captured]
```

Categories emerge organically: PowerShell Patterns, Azure Patterns, Frontend Patterns, AI Image Generation, Design Patterns, Workflow Patterns, etc.

### What Goes in global-knowledge.md

| Content                 | Example                                               |
| ----------------------- | ----------------------------------------------------- |
| Cross-project patterns  | "SWA EasyAuth handles login; domain gating via fetch" |
| Hard-won gotchas        | "PowerShell -replace corrupts multi-byte content"     |
| Architecture decisions  | "Cosmos liveness probes cause container kill loops"   |
| Integration patterns    | "MS Graph MCP: call suggest_queries first"            |
| Tool-specific learnings | "Flux 1.1 Pro max width 1440px"                       |

### What Does NOT Go in global-knowledge.md

| Content                 | Where It Belongs                  |
| ----------------------- | --------------------------------- |
| Personal preferences    | AI-Memory/profile.md              |
| Session reminders       | AI-Memory/notes.md                |
| Learning goals          | AI-Memory/learning-goals.md       |
| Project-specific config | Project's own .github/ or docs    |
| Temporary workarounds   | Project notes (will become stale) |

## Memory System Differentiation

Alex uses **three complementary memory systems**:

### 1. AI-Memory (OneDrive): Cross-Platform Persistent Memory

Shared across all AI surfaces via OneDrive sync. Use for:

- User profile and preferences (profile.md)
- Session notes and observations (notes.md)
- Learning goals with progress tracking (learning-goals.md)
- Cross-project insights and patterns (global-knowledge.md)

### 2. Copilot Memory (/memories/): VS Code Session Memory

GitHub-cloud-synced notes for VS Code workflows. Use for:

- VS Code-specific preferences and workflow notes
- Project-specific context that may overlap with AI-Memory
- Session-scoped working state (/memories/session/)

### 3. Project Memory (.github/): Local Architecture

Project-specific cognitive architecture. Use for:

- Skills, instructions, prompts (the trifecta)
- Episodic memories from meditation sessions
- Synapse connections between skills
- Configuration and settings

### Decision Matrix

| Question                            | AI-Memory (OneDrive) | Copilot Memory | Project .github/  |
| ----------------------------------- | -------------------- | -------------- | ----------------- |
| Cross-project pattern?              | global-knowledge.md  |                |                   |
| Personal preference (all surfaces)? | profile.md           |                |                   |
| VS Code-specific preference?        |                      | /memories/     |                   |
| Learning goal?                      | learning-goals.md    |                |                   |
| Session note?                       | notes.md             |                |                   |
| Project architecture?               |                      |                | .github/skills/   |
| Meditation output?                  |                      |                | .github/episodic/ |

### Integration Workflow

```
User learns something
  Is it cross-project?     -> AI-Memory/global-knowledge.md
  Is it personal preference -> AI-Memory/profile.md (or /memories/ for VS Code only)
  Is it project-specific?  -> .github/skills/ or .github/episodic/
```

**No duplication**: Each piece of information lives in ONE system.

## Saving Insights

### From VS Code

During a session, when you learn something cross-project:

1. Open `%OneDrive%/AI-Memory/global-knowledge.md` (synced locally)
2. Add entry under the appropriate category
3. Use the standard format: Topic, Source, Insight, Date
4. Save the file (OneDrive syncs automatically)

Or say "consolidate" to trigger the cognitive protocols consolidation workflow, which prompts you to capture insights.

### From M365 Copilot / Agent Builder

1. Say "consolidate" or "save this insight"
2. Alex generates the content update in a code block
3. You save it to OneDrive > AI-Memory > global-knowledge.md

### Promotion from Project to Global

When a project-specific learning proves cross-project:

1. Identify the insight in .github/episodic/ or session notes
2. Abstract it (remove project-specific details)
3. Add to AI-Memory/global-knowledge.md under the right category
4. Verify it reads well without project context

## Promotion Signals

### Strong Promotion Signals

| Pattern                         | Description                           |
| ------------------------------- | ------------------------------------- |
| **Cross-project applicability** | Would 3+ other projects benefit?      |
| **Resolution pattern**          | Solved problem with concrete solution |
| **Hard-won gotchas**            | Prevents repeat mistakes              |
| **Architecture with rationale** | ADR-style decisions with "why"        |
| **Integration patterns**        | How systems connect                   |

### Anti-Promotion Signals

| Signal                       | Why Skip                  |
| ---------------------------- | ------------------------- |
| **Project-specific config**  | Only works in one context |
| **Temporary workarounds**    | Will be obsolete          |
| **Personal preferences**     | Goes in profile.md        |
| **Incomplete/draft content** | Needs validation          |

## Migration from Legacy GK System

The previous system used `~/.alex/global-knowledge/` with GK-_/GI-_ files and index.json. All valuable content has been migrated to `AI-Memory/global-knowledge.md`. The legacy system is deprecated:

| Legacy                              | Replacement                              |
| ----------------------------------- | ---------------------------------------- |
| `~/.alex/global-knowledge/`         | `OneDrive/AI-Memory/`                    |
| `patterns/GK-*.md`                  | Categories in global-knowledge.md        |
| `insights/GI-*.md`                  | Entries in global-knowledge.md           |
| `index.json`                        | Not needed (single file, searchable)     |
| `Alex-Global-Knowledge` GitHub repo | OneDrive sync (automatic)                |
| `skill-registry.json`               | Master Alex .github/skills/ is canonical |

## Triggers

- "save insight", "promote to global", "consolidate"
- "search knowledge", "have I solved this before?"
- "global knowledge", "cross-project"

```powershell
$patterns = (Get-ChildItem patterns\GK-*.md).Count
$insights = (Get-ChildItem insights\GI-*.md).Count
```

### Sync During Dream

Automated sync during dream/meditation cycles: check for uncommitted changes, pull latest, regenerate `KNOWLEDGE-INDEX.md`, report sync status.

### Skill Pull-Sync (For Heirs)

Discover and pull new skills from GK via `skills/skill-registry.json`. Commands: `/knowledge checkskills` (discover), `/knowledge pullskill <id>` (pull on demand).

### Quality Gates

✅ `sync-index.ps1` reports 0 orphaned, 0 unindexed
✅ Heir contributions documented as insights (if any)
✅ Counts in copilot-instructions.md match disk
✅ `git status` clean (or changes committed)

---
