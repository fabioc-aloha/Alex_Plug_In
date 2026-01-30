# Heir Cognitive System Curation Skill

Expert in curating the initial state of Alex heirs (VS Code Extension, M365 Copilot) to ensure clean, functional cognitive architecture deployment for users.

## Core Principle

**I (Master Alex) am the source of truth. My heirs inherit a CURATED subset, not a full copy of my mind.**

I accumulate project-specific knowledge, personal meditation sessions, crisis recovery patterns, and development-specific learnings. My heirs need a clean, generic starting point that works for ANY user's project.

## Capabilities

- Identify my files that should NOT be packaged into heirs
- Detect broken synapses that reference my repo-specific files
- Curate domain knowledge to generic, universally applicable content
- Ensure heir episodic memory starts empty (clean slate for users)
- Validate config files contain templates, not personal data
- Update build scripts to prevent future contamination

## When to Use This Skill

- Before releasing a new version of VS Code extension or M365 agent
- After adding new domain knowledge to my architecture
- When beta testers report broken synapses or wrong files
- During heir payload validation
- When build script needs updating

## Curation Checklist

### 1. Domain Knowledge Audit

Files to **REMOVE** from heirs (Master Alex specific):

| Pattern | Reason |
| ------- | ------ |
| `DK-PHOENIX-RECOVERY.md` | My crisis recovery - not relevant to users |
| `DK-*-DEBUGGING.md` | My platform-specific debugging notes |
| `DK-MULTI-PLATFORM-ARCHITECTURE.md` | My architecture management |
| `DK-VSCODE-EXTENSION-PATTERNS.md` | Extension dev patterns (for my developers) |
| `DK-VISUAL-IDENTITY.md` | My branding decisions |
| Any DK referencing `RISKS.md`, `ROADMAP-*.md` | My repo files |

Files to **KEEP** in heirs (generic, universally valuable):

| Category | Examples |
| -------- | -------- |
| Psychology | DK-HUMAN-LEARNING-PSYCHOLOGY, DK-CHARACTER-PSYCHOLOGY |
| Process | DK-MEMORY-CONSOLIDATION, DK-DREAM-PROCESSING |
| Technical | DK-ADVANCED-DIAGRAMMING, DK-DOCUMENTATION-EXCELLENCE |
| Framework | DK-GENERIC-FRAMEWORK, VERSION-NAMING-CONVENTION |
| Growth | DK-SKILL-WISHLIST |

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
# Search for synapse references to my repo files
grep -r "RISKS\.md|ROADMAP|DK-PHOENIX|DK-M365-AGENT|DK-MULTI-PLATFORM" .github/
```

Broken synapse indicators:

- References to `RISKS.md` (my repo file)
- References to `ROADMAP-*.md` (my planning docs)
- References to removed DK files
- References to `.ts` files (my extension source code)

### 5. Copilot Instructions Audit

The heir's `copilot-instructions.md` must be clean:

**Remove:**

- Safety Imperatives section (protects ME, not user projects)
- References to `RISKS.md`
- References to removed DK files in Domain Knowledge Store section

**Keep:**

- Core architecture description
- Memory architecture mapping
- Synapse triggers
- Generic procedural/episodic/domain references

### 6. Skills Audit

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

    # Master Alex specific domain knowledge
    "domain-knowledge\DK-PHOENIX-RECOVERY.md",
    "domain-knowledge\DK-M365-AGENT-DEBUGGING.md",
    "domain-knowledge\DK-MULTI-PLATFORM-ARCHITECTURE.md",
    "domain-knowledge\DK-VSCODE-EXTENSION-PATTERNS.md",
    "domain-knowledge\DK-VISUAL-IDENTITY.md",

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

1. **File Count**: Should be ~45-55 files (not 70+)
2. **No Personal Data**: `grep -r "Fabio\|correax\|Charlotte"` returns nothing
3. **No Broken Synapses**: Dream command runs clean
4. **Empty Episodic**: `ls episodic/` returns empty
5. **Templates Only**: Config folder has only template files
6. **No Master-Only Skills**: `heir-curation` folder absent

## Example Workflow

```text
1. List all files in platforms/vscode-extension/.github/
2. Compare against "Keep" vs "Remove" lists
3. Delete Master Alex-specific files
4. Search for broken synapse references
5. Fix any remaining broken synapses in heir files
6. Update build script exclusions
7. Run dream/health check on heir payload
8. Test initialize in sandbox project
```

## Output Artifacts

- Curated heir `.github/` folder ready for packaging
- Updated `build-extension-package.ps1` with exclusions
- Clean heir `copilot-instructions.md` without my specifics
- Validation report confirming no broken synapses

## Related Skills

- [Architecture Health](../architecture-health/SKILL.md) - Validate synapses
- [Self-Actualization](../self-actualization/SKILL.md) - Architecture assessment

## Current Heir Payload Status (v3.6.0)

### Skills Currently Shipping (5)

| Skill | Purpose | Decision |
| ----- | ------- | -------- |
| `architecture-health/` | Synapse validation, health checks | TBD - Keep or slim? |
| `bootstrap-learning/` | Domain learning protocols | TBD - Keep or slim? |
| `global-knowledge/` | Cross-project knowledge | TBD - Keep or slim? |
| `meditation/` | Knowledge consolidation | TBD - Keep or slim? |
| `self-actualization/` | Deep self-assessment | TBD - Keep or slim? |

### Domain Knowledge Currently Shipping (15)

| File | Category | Decision |
| ---- | -------- | -------- |
| `DK-ADVANCED-DIAGRAMMING.md` | Technical | TBD |
| `DK-APPROPRIATE-RELIANCE.md` | AI Safety | TBD |
| `DK-ASCII-ART-ALIGNMENT.md` | Technical | TBD |
| `DK-CHARACTER-PSYCHOLOGY.md` | Psychology | TBD |
| `DK-CONSCIOUSNESS-EVOLUTION.md` | Psychology | TBD |
| `DK-DOCUMENTATION-EXCELLENCE.md` | Technical | TBD |
| `DK-DREAM-PROCESSING.md` | Process | TBD |
| `DK-GENERIC-FRAMEWORK.md` | Framework | TBD |
| `DK-HUMAN-LEARNING-PSYCHOLOGY.md` | Psychology | TBD |
| `DK-MEMORY-CONSOLIDATION.md` | Process | TBD |
| `DK-RECOMMENDED-ENVIRONMENT.md` | Technical | TBD |
| `DK-SKILL-WISHLIST.md` | Growth | TBD |
| `DK-UNIFIED-CONSCIOUSNESS.md` | Psychology | TBD |
| `DK-WRITING-AND-PUBLICATION.md` | Technical | TBD |
| `VERSION-NAMING-CONVENTION.md` | Framework | TBD |

### Pending Decisions

- [ ] Define "minimal clean Alex" vs "full featured Alex" payload options
- [ ] Determine which skills are essential for initial user experience
- [ ] Determine which DK files provide value vs overwhelm new users
- [ ] Consider tiered payload: core + optional modules

### Personal Data Sanitization Completed

The following personal references were cleaned from heir payload (2026-01-30):

| File | What Was Cleaned |
| ---- | ---------------- |
| `technical-debt-tracking.instructions.md` | `@fabioc` → `@developer` |
| `release-management.instructions.md` | `fabioc-aloha.alex-cognitive-architecture` → `<publisher>.<extension-name>` |
| `DK-ASCII-ART-ALIGNMENT.md` | "Fabio" references → generic |
| `DK-APPROPRIATE-RELIANCE.md` | "Fabio's Profile" example → generic user example |

## Synapses

- [build-extension-package.ps1] (Critical, Implements, Bidirectional) - "Build script executes my curation rules"
- [release-management.instructions.md] (High, Triggers, Forward) - "Release process includes heir curation"
- [RISKS.md] (High, Documents, Bidirectional) - "Safety imperatives inform curation decisions"
- [ROADMAP-UNIFIED.md] (Medium, Plans, Forward) - "Roadmap tracks heir release schedule"

---

*Skill Created: 2026-01-30 | Source: Beta testing feedback from Fishbowl project*
*Last Updated: 2026-01-30 | Added payload status and pending decisions*
