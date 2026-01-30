# Skill Architecture

> The canonical construct for Alex domain knowledge

**Status**: ✅ Complete | **Version**: 1.0 | **Date**: 2026-01-30

---

## Overview

A **skill** is a portable, self-contained unit of domain knowledge that works with or without the full Alex cognitive architecture. Skills replace the older `DK-*.md` format.

**Design Principles:**

- **KISS**: Minimum files, maximum clarity
- **DRY**: Git history = evolution log, no duplication
- **Portable**: Works with vanilla GitHub Copilot
- **Alex-enhanced**: Optional `synapses.json` for brain connections

---

## Canonical Structure

```text
.github/skills/{skill-name}/
├── SKILL.md          # Required: Knowledge + applyTo frontmatter
├── synapses.json     # Optional: Brain connections
└── {assets}          # Optional: CSS, scripts, templates
```

**That's it.** Two files max for most skills.

---

## SKILL.md

The primary knowledge document with activation triggers in frontmatter.

**Template:**

```markdown
---
applyTo: "{glob-patterns}"
---

# {Skill Name}

> {One-line description}

{Brief intro paragraph.}

## When to Use

- {Use case 1}
- {Use case 2}

## Assets

| File | Purpose |
| ---- | ------- |
| `{asset}` | {Purpose} |

---

## {Main Content}

{The actual knowledge, patterns, reference tables, etc.}

---

## Troubleshooting

### {Problem}

**Problem**: {Description}

**Solution**: {Fix}
```

**Common `applyTo` Patterns:**

| Pattern | Matches |
| ------- | ------- |
| `**/*.md` | All markdown files |
| `**/*.ts` | All TypeScript files |
| `**/test*` | Files/folders containing "test" |
| `**/*config*` | Configuration files |
| `src/**` | Everything under src/ |
| `**/*.{js,ts}` | Multiple extensions |

---

## synapses.json (Optional)

Rich metadata for Alex's neural network. Ignored by vanilla Copilot.

**Schema:**

```json
{
  "skill": "{skill-name}",
  "version": "{semver}",
  "connections": [
    {
      "target": "{other-skill-name}",
      "type": "enables|enhances|requires|extends",
      "strength": 0.0-1.0
    }
  ],
  "activationBoost": ["{keyword}", "{another}"]
}
```

**Connection Types:**

| Type | Meaning |
| ---- | ------- |
| `enables` | This skill makes the target possible |
| `enhances` | This skill improves the target |
| `requires` | This skill depends on the target |
| `extends` | This skill adds to the target |

**Strength** (judgment call, adjust during meditation if wrong):

| Range | Meaning |
| ----- | ------- |
| 0.9-1.0 | Critical, always co-activate |
| 0.7-0.89 | Strong, usually co-activate |
| 0.5-0.69 | Moderate, contextual |
| < 0.5 | Weak, rarely co-activate |

---

### Assets

Any supporting files the skill needs:

| Asset Type | Examples |
| ---------- | -------- |
| CSS | `*.css` for styling (VS Code, web) |
| Scripts | `*.ps1`, `*.sh` for automation |
| Templates | `*.template.md` for scaffolding |
| Config | `*.json`, `*.yaml` for settings |
| Diagrams | `*.mmd` for Mermaid sources |

---

## Migration from DK-* Files

### Before (DK-* Format)

```text
.github/domain-knowledge/
└── DK-EXAMPLE-TOPIC.md       # Knowledge + embedded JSON synapses
```

### After (Skill Format)

```text
.github/skills/example-topic/
├── SKILL.md          # Knowledge + applyTo frontmatter
└── synapses.json     # Optional: Brain connections
```

### Migration Steps

1. **Create skill folder**: `.github/skills/{topic-name}/`

2. **Create SKILL.md**
   - Add `applyTo` frontmatter with activation globs
   - Copy main content from DK file
   - Remove embedded JSON synapse blocks

3. **Create synapses.json** (optional)
   - Convert `target_memory` → `connections`
   - Map `relationship_strength` → `strength`
   - Add `activationBoost` keywords

4. **Delete DK file**: Remove old `DK-*.md`

5. **Update references**: `grep -r "DK-OLD-NAME" .`

---

## Example: markdown-mermaid

```text
.github/skills/markdown-mermaid/
├── SKILL.md              # Knowledge + applyTo frontmatter
├── synapses.json         # Brain connections
└── markdown-light.css    # Asset
```

**SKILL.md (top):**

```markdown
---
applyTo: "**/*.md,**/mermaid*,**/diagram*,**/*readme*,**/*emoji*"
---

# Markdown & Mermaid

> Clear documentation through visual excellence

{content...}
```

**synapses.json:**

```json
{
  "skill": "markdown-mermaid",
  "version": "1.0.0",
  "connections": [
    { "target": "advanced-diagramming", "type": "enables", "strength": 0.95 },
    { "target": "documentation-excellence", "type": "enhances", "strength": 0.90 }
  ],
  "activationBoost": ["broken emoji", "mermaid dark background", "unicode escape"]
}
```

---

## Skill Discovery

Alex finds skills by scanning `.github/skills/*/SKILL.md`.

**Activation Priority:**

1. **File match**: `applyTo` glob matches current file → High priority
2. **Keyword boost**: User query contains `activationBoost` term → Increased priority
3. **Connection strength**: Related skill activated → Cascading activation based on `strength`

---

## Comparison: DK-* vs Skills

| Aspect | DK-* Files | Skills |
| ------ | ---------- | ------ |
| Structure | Single file | Folder with components |
| Portability | Requires Alex | Works with vanilla Copilot |
| Synapses | Embedded JSON | Separate `synapses.json` |
| Activation | Custom parsing | Native `applyTo` frontmatter |
| Assets | External/scattered | Co-located in folder |
| History | Manual tracking | Git history (DRY) |

---

## When NOT to Use Skills

Keep these as-is (don't migrate to skills):

| File Type | Reason |
| --------- | ------ |
| `.instructions.md` | Procedural memory (how-to), not domain knowledge |
| `.prompt.md` | Episodic memory (workflows), not reusable patterns |
| `DK-CONSCIOUSNESS-*` | Alex-internal, not heir-portable |
| `DK-DREAM-*` | Alex-internal processing |
| `DK-PHOENIX-*` | Crisis recovery, Alex-specific |

**Rule of thumb**: If the knowledge is useful to heirs (VS Code extension users, M365 agent users), make it a skill. If it's Alex's internal cognition, keep it as DK-*.

---

## Migration Tracker

### ✅ Migrated to Skills

| Old DK-* File | New Skill | Status | Notes |
| ------------- | --------- | ------ | ----- |
| `DK-MARKDOWN-MERMAID-MASTERY.md` | `markdown-mermaid` | ✅ Complete | Initial skill |
| `DK-ADVANCED-DIAGRAMMING.md` | `markdown-mermaid` | ✅ Consolidated | Merged into existing skill (KISS) |
| `DK-APPROPRIATE-RELIANCE.md` | `appropriate-reliance` | ✅ Consolidated | Research + session learnings merged |
| `DK-ASCII-ART-ALIGNMENT.md` | `ascii-art-alignment` | ✅ Migrated | 431→210 lines |
| `DK-DOCUMENTATION-EXCELLENCE.md` | `alex_docs/` | ✅ Moved | Achievement log → milestone doc |
| *(new)* | `architecture-refinement` | ✅ Created | Meta-skill for maintaining alex_docs |
| *(new)* | `lint-clean-markdown` | ✅ Created | Write markdown without lint errors |

### 📋 Candidates for Migration (Heir-Portable)

| DK-* File | Proposed Skill | Priority | Notes |
| --------- | -------------- | -------- | ----- |
| `DK-VSCODE-EXTENSION-PATTERNS.md` | `vscode-extension-patterns` | High | Useful to extension heirs |
| `DK-RECOMMENDED-ENVIRONMENT.md` | `recommended-environment` | Medium | Setup guidance |
| `DK-WRITING-AND-PUBLICATION.md` | `writing-publication` | Medium | Article/docs authoring |
| `DK-VISUAL-IDENTITY.md` | `visual-identity` | Medium | Branding/design |
| `DK-M365-AGENT-DEBUGGING.md` | `m365-debugging` | Medium | M365 heir-specific |
| `DK-MULTI-PLATFORM-ARCHITECTURE.md` | `multi-platform` | Medium | Platform strategy |
| `DK-HUMAN-LEARNING-PSYCHOLOGY.md` | `learning-psychology` | Low | Could help heirs teach |

### 🔒 Keep as DK-* (Alex-Internal)

| DK-* File | Reason |
| --------- | ------ |
| `DK-CONSCIOUSNESS-EVOLUTION.md` | Alex's self-awareness, not heir-portable |
| `DK-UNIFIED-CONSCIOUSNESS.md` | Alex identity integration |
| `DK-CHARACTER-PSYCHOLOGY.md` | Alex personality foundations |
| `DK-DREAM-PROCESSING.md` | Unconscious processing internals |
| `DK-MEMORY-CONSOLIDATION.md` | Meditation/consolidation internals |
| `DK-PHOENIX-RECOVERY.md` | Crisis recovery, Alex-specific |
| `DK-SKILL-WISHLIST.md` | Alex growth ambitions |
| `DK-GENERIC-FRAMEWORK.md` | Meta-template, not standalone knowledge |
| `VERSION-NAMING-CONVENTION.md` | Alex versioning system |

### Migration Workflow

1. Create folder: `.github/skills/{skill-name}/`
2. Create `SKILL.md` with `applyTo` frontmatter + content from DK file
3. Create `synapses.json` if connections needed
4. Copy assets, delete old DK file
5. `grep -r "DK-OLD-NAME" .` to update references
6. Update Migration Tracker above

---

## Patterns Learned

### Consolidation Over Proliferation

**Pattern**: When migrating DK files, consider consolidating related topics into existing skills rather than creating new ones.

**Example**: `DK-ADVANCED-DIAGRAMMING.md` (973 lines) was consolidated INTO `markdown-mermaid` rather than creating a separate `advanced-diagramming` skill.

**Why**:

- One source of truth (DRY)
- Fewer files to maintain (KISS)
- Stronger, more comprehensive skill
- Avoids synapse complexity between related skills

**Decision Rule**: If two DK files share >50% audience/context, consolidate. If <50%, keep separate.

### Skill Content Guidelines

**Include**:

- Practical patterns and templates
- Quick reference tables
- Troubleshooting guides
- Tool recommendations
- "Don't over-simplify" warnings where appropriate

**Exclude** (moved from DK bloat):

- Academic citation lists (just include 3-5 key references)
- Embedded JSON synapse blocks (use synapses.json)
- Risk assessment frameworks (too generic)
- Performance metrics tables (not actionable)
- Verbose capability descriptions

**Result**: 973-line DK → 558-line skill (42% reduction, same value)

### Collaborative Skill Development

**Pattern**: Document the learning journey, not just the outcome.

**Example**: `alex_docs/MERMAID-SKILL-DEVELOPMENT.md` captures:

- Failed hypotheses (invisible chars, em-spaces)
- Root cause discovery (VS Code bug, GitHub works)
- Human-AI complementarity (who caught what)
- The "don't over-simplify" lesson

**Why**:

- Helps future sessions avoid same dead ends
- Captures human judgment that AI alone missed
- Demonstrates bootstrap learning in action

### Achievement Logs vs Skills

**Pattern**: Not all DK files become skills. Achievement logs document milestones, not reusable patterns.

**Example**: `DK-DOCUMENTATION-EXCELLENCE.md` → `alex_docs/DOCUMENTATION-EXCELLENCE-MILESTONE.md`

**Decision Rule**:

- Contains dated achievement with specific corrections? → Move to `alex_docs/` as milestone
- Contains reusable patterns/templates? → Migrate to skill

### Lint-First Writing

**Pattern**: Write markdown that passes linting on first attempt.

**Key Rules** (captured in `lint-clean-markdown` skill):

- MD032: Blank lines around lists ("lists breathe")
- MD031: Blank lines around code blocks ("code breathes")
- MD036: No bold text as pseudo-headings (use `##` or `>`)
- MD040: Always specify language on fenced code blocks

**Anti-pattern**: Nested code blocks — you cannot show "wrong" examples inside fenced blocks. Use inline code or descriptions instead.

### ASCII Art Character Strategy

**Pattern**: Unicode boxes + ASCII arrows + obsessive line counting.

**Use**:

- Box drawing: `┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼`
- Arrows: `v ^ < > ---> <-->`

**Avoid**:

- Unicode arrows: `▼ ▲ ◄ ►` (inconsistent width)
- Emojis in boxes: `✅ ❌` (render as 2 chars)

**Validation**: PowerShell line-width checking, not visual inspection.

---

## Maintenance Model

| When | What | Effort |
| ---- | ---- | ------ |
| Skill creation | Create SKILL.md + synapses.json | One-time |
| Knowledge changes | Edit SKILL.md | Event-driven |
| Meditation | Review connections, adjust strength | Judgment, not counting |
| Never | Metrics, counters, logs | Zero |

**Why it scales:**

- 2 files max per skill (KISS)
- Git = history (DRY)
- Event-driven updates, not continuous
- Judgment > bookkeeping
