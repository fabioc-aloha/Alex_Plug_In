---
name: "global-knowledge-sync"
description: "Synchronize insights between local projects and the Alex Global Knowledge repository"
---

# Global Knowledge Sync Skill

Manages bidirectional synchronization between local project knowledge and the centralized Alex Global Knowledge repository.

## Repository Location

**Default**: `~/.alex/global-knowledge/` (user home directory)

**Note**: All heirs inherit this skill — GK sync works in any Alex-enabled project.

## Capabilities

### 1. Save Insight to GK

Save a learning from the current project to global knowledge.

**Trigger**: `/saveinsight`, `save this insight`, `promote to global`

**Process**:
1. Capture insight title and content
2. Determine type: `pattern` (reusable) or `insight` (timestamped)
3. Assign category and tags
4. Generate file: `GK-{slug}.md` or `GI-{slug}-{date}.md`
5. Update `KNOWLEDGE-INDEX.md` with metadata
6. Commit to GK repo (optional auto-push)

### 2. Search Global Knowledge

Find relevant knowledge from past projects.

**Trigger**: `/knowledge <query>`, `have I solved this before?`

**Process**:
1. Search `KNOWLEDGE-INDEX.md` for matching entries (title, tags, summary)
2. Return top matches with links
3. Optionally read full content

### 3. Sync During Dream

Automated sync during dream/meditation cycles.

**Trigger**: Dream protocol, meditation consolidation

**Process**:
1. Check for uncommitted changes in GK repo
2. Pull latest from remote
3. Regenerate `KNOWLEDGE-INDEX.md` if entries changed
4. Report sync status in dream output

### 4. Promote Local Skill to Global

Promote a project's skill file to global pattern.

**Trigger**: `/promote`, `make this global`

**Process**:
1. Select local file from `.github/skills/`
2. Convert to GK format with proper frontmatter
3. Add source project attribution
4. Save to `skills/` folder in GK

### 5. Skill Pull-Sync (For Heirs)

Discover and pull new skills from the GK repository.

**Trigger**: `/checkskills`, session start (if auto-check enabled)

**Process**:
1. Read `skills/` directory from GK
2. Compare against local `.github/skills/`
3. Report new/updated skills available
4. Pull on demand

## Integration Points

### Dream Protocol
Add to dream checklist:
```markdown
- [ ] GK sync: Pull latest, check uncommitted, regenerate index
```

### Meditation Protocol
During consolidation, prompt:
- "Any insights worth saving globally?"
- Auto-detect cross-project patterns

## File Formats

### Pattern (GK-*)
```markdown
# Pattern Title

**Category**: category-name
**Tags**: tag1, tag2, tag3
**Source**: Original project name
**Created**: 2026-02-06T12:00:00Z

---

## Description
What this pattern solves.

## Implementation
How to apply it.
```

### Insight (GI-*)
```markdown
# Insight Title

**Category**: category-name
**Tags**: tag1, tag2
**Source**: Project name
**Date**: 2026-02-06

---

Insight content.
```

## Triggers

- "save insight", "promote to global", "sync knowledge"
- "global knowledge sync", "gk sync"
- "check skills", "pull skill"
- "/knowledge", "/saveinsight", "/promote"

## Synapses

See [synapses.json](synapses.json) for connections.
