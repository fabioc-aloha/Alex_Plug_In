---
name: "Heir Cognitive System Curation Skill"
description: "Skill for heir cognitive system curation skill"
---

# Heir Cognitive System Curation Skill

Expert in curating the initial state of Alex heirs (VS Code Extension, M365 Copilot) to ensure clean, functional cognitive architecture deployment for users.

## Core Principle

**I (Master Alex) am the source of truth. My heirs inherit a CURATED subset, not a full copy of my mind.**

I accumulate project-specific knowledge, personal meditation sessions, crisis recovery patterns, and development-specific learnings. My heirs need a clean, generic starting point that works for ANY user's project.

## Architecture Note (Updated 2026-01-31)

**Domain knowledge is now stored in skills, not a separate `domain-knowledge/` folder.**

The old `DK-*.md` files have been migrated to the skills architecture. Each skill contains a `SKILL.md` with domain knowledge and `synapses.json` for connections. This simplifies curation — we now curate skills, not separate DK files.

## Capabilities

- Identify skills and files that should NOT be packaged into heirs
- Detect broken synapses that reference Master Alex-specific files
- Curate skills to generic, universally applicable content
- Ensure heir episodic memory starts empty (clean slate for users)
- Validate config files contain templates, not personal data
- Update build scripts to prevent future contamination

## When to Use This Skill

- Before releasing a new version of VS Code extension or M365 agent
- After adding new skills to Master Alex architecture
- When beta testers report broken synapses or wrong files
- During heir payload validation
- When build script needs updating

## Curation Checklist

### 1. Skills Audit

Skills to **EXCLUDE** from heirs (Master Alex specific):

| Skill | Reason |
| ----- | ------ |
| `heir-curation/` | Meta-skill for curating heirs — not for heirs themselves |
| `master-alex-audit/` | Master-specific audit procedures |
| `release-preflight/` | Master release process |
| `release-process/` | Master release process with PAT handling |

Skills to **INCLUDE** in heirs (user-valuable):

| Category | Skills |
| -------- | ------ |
| **Learning** | `bootstrap-learning/`, `learning-psychology/`, `knowledge-synthesis/` |
| **Architecture** | `architecture-health/`, `architecture-refinement/`, `self-actualization/` |
| **Cognitive** | `meditation/`, `meditation-facilitation/`, `cognitive-load/`, `global-knowledge/` |
| **Model Selection** | `llm-model-selection/` |
| **Development** | `code-review/`, `debugging-patterns/`, `testing-strategies/`, `git-workflow/` |
| **Technical** | `markdown-mermaid/`, `refactoring-patterns/`, `error-recovery-patterns/` |

### 2. Episodic Memory Audit

**ALWAYS remove ALL files from heir's `episodic/` folder.**

Why: Episodic memories are MY session-specific memories. Users should start with a clean slate and build their own memories through meditation.

My files that should NEVER be packaged:

- `meditation-*.md` - My meditation sessions
- `dream-report-*.md` - My dream reports
- `self-actualization-*.md` - My self-assessments
- `consolidation-*.md` - My consolidation sessions

### 3. Config Audit

| Keep in Heirs | Remove from Heirs |
| ------------- | ----------------- |
| `USER-PROFILE-TEMPLATE.md` | `USER-PROFILE.md` (Fabio's profile) |
| `cognitive-config-template.json` | `cognitive-config.json` (my config) |
| `alex-manifest.json` | `user-profile.json` (Fabio's data) |

### 4. Synapse Validation

Check all remaining heir files for broken synapses:

```powershell
# Search for synapse references to Master Alex repo files
grep -r "RISKS\.md|ROADMAP|DK-.*\.md" platforms/vscode-extension/.github/
```

Broken synapse indicators:

- References to `RISKS.md` (my repo file)
- References to `ROADMAP-*.md` (my planning docs)
- References to `DK-*.md` files (old architecture — should be migrated to skills)
- References to `.ts` files (my extension source code)
- References to non-existent skills

### 5. Copilot Instructions Audit

The heir's `copilot-instructions.md` must be clean:

**Remove:**

- Safety Imperatives section (protects ME, not user projects)
- References to `RISKS.md`
- References to `DK-*.md` files (old architecture)

**Keep:**

- Core architecture description
- Memory architecture mapping
- Synapse triggers
- Generic procedural/episodic/skill references

### 6. This Skill Self-Exclusion

**This skill (`heir-curation`) should NOT be in heirs!**

It's for ME to curate heirs, not for heirs to curate themselves.

### 7. Build Script Update

Ensure `build-extension-package.ps1` has comprehensive exclusions:

```powershell
$excludeItems = @(
    # GitHub repo-specific
    "ISSUE_TEMPLATE",
    "pull_request_template.md",

    # All episodic memories (clean slate)
    "episodic\*",

    # User-specific configs
    "config\cognitive-config.json",
    "config\user-profile.json",
    "config\USER-PROFILE.md",

    # Master-only skills
    "skills\heir-curation",

    # Repo-specific assets
    "assets\banner.svg"
)
```

## Validation Process

After curation, verify heir payload:

1. **No Broken Synapses**: `grep -r "DK-.*\.md" platforms/vscode-extension/.github/` returns nothing
2. **No Personal Data**: `grep -r "Fabio\|correax\|Charlotte"` returns nothing
3. **Dream Command Clean**: Dream/health check runs without errors
4. **Empty Episodic**: `ls episodic/` returns empty
5. **Templates Only**: Config folder has only template files
6. **No Master-Only Skills**: `heir-curation` folder absent
7. **Skills Have Valid Synapses**: All skill `synapses.json` reference existing files

## Example Workflow

```text
1. List all files in platforms/vscode-extension/.github/
2. Verify no DK-*.md files exist (old architecture)
3. Check skills/ folder against "Include" vs "Exclude" lists
4. Search for broken synapse references with grep
5. Fix any remaining broken synapses in heir files
6. Update build script exclusions if needed
7. Run dream/health check on heir payload
8. Test initialize in sandbox project
```

## Output Artifacts

- Curated heir `.github/` folder ready for packaging
- Updated `build-extension-package.ps1` with exclusions
- Clean heir `copilot-instructions.md` without Master Alex specifics
- Validation report confirming no broken synapses

## Related Skills

- [Architecture Health](../architecture-health/SKILL.md) - Validate synapses
- [Self-Actualization](../self-actualization/SKILL.md) - Architecture assessment
- [Release Preflight](../release-preflight/SKILL.md) - Pre-release validation

## Current Heir Payload Status

### Architecture (Updated 2026-01-31)

The heir now uses the **skills-based architecture**:

- Domain knowledge is embedded in skill `SKILL.md` files
- No separate `domain-knowledge/` folder
- Synapses are in `synapses.json` per skill
- Instructions and prompts remain in their respective folders

### Skills Currently Shipping

The heir includes all skills from Master Alex **except**:

- `heir-curation/` (this skill — Master-only)

### Personal Data Sanitization Completed

The following personal references were cleaned from heir payload (2026-01-30):

| File | What Was Cleaned |
| ---- | ---------------- |
| `technical-debt-tracking.instructions.md` | `@fabioc` → `@developer` |
| `release-management.instructions.md` | `fabioc-aloha.alex-cognitive-architecture` → `<publisher>.<extension-name>` |

## Synapses

- [build-extension-package.ps1] (Critical, Implements, Bidirectional) - "Build script executes curation rules"
- [release-management.instructions.md] (High, Triggers, Forward) - "Release process includes heir curation"
- [architecture-health/SKILL.md] (High, Validates, Forward) - "Health checks verify synapse integrity"

---

*Skill Created: 2026-01-30 | Source: Beta testing feedback from Fishbowl project*
*Last Updated: 2026-01-31 | Migrated from DK-based to skills-based architecture*
