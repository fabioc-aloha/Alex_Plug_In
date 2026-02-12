# Heir Skill Promotion Protocol

> How skills evolve from heir projects to Master Alex

**Synapse**: [.github/instructions/bootstrap-learning.instructions.md] (High, Enables, Bidirectional) - "heir develops expertise through learning"
**Synapse**: [.github/skills/global-knowledge/SKILL.md] (High, Documents, Forward) - "promotion candidate patterns"
**Synapse**: [.github/skills/skill-building/SKILL.md] (Critical, Implements, Bidirectional) - "skill creation methodology and quality gates"

---

## Quick Reference: Promotion Patterns

See [global-knowledge skill](../skills/global-knowledge/SKILL.md#promotion-candidate-patterns) for detailed patterns. Quick summary:

| Strong Signals | Anti-Signals |
|----------------|--------------|
| Cross-project applicability (3+ projects) | Project-specific config |
| Resolution pattern with solution | Temporary workarounds |
| Hard-won gotchas | Personal preferences |
| Architecture with rationale | Incomplete/draft content |
| Pipeline/workflow patterns | Already exists in GK |
| Integration patterns | Too specific names/IDs |

**Auto-promotion score ≥ 5**: synapses (+3), structure (+2), tags (+1), content size (+1-3), code examples (+2), general terms (+1-3)

---

## When to Use

- Heir completes a real-world project with domain expertise
- Knowledge is generalizable beyond the specific project
- Skill doesn't already exist in Master Alex

---

## The Promotion Workflow

### 1. Let Heirs Experiment First
- Heirs learn by **doing**, not reading specs
- Real projects create battle-tested knowledge
- Edge cases discovered through actual use

### 2. Ship Before Documenting
> A skill written after successful delivery is worth 10x one written from theory.

**Wait for:**
- Project completion or major milestone
- Real-world validation (published, deployed, shipped)
- Gotchas and fixes discovered

### 3. Heir Creates the Skill
Ask the heir:
```
Look at `.github/skills/markdown-mermaid/SKILL.md` as a reference.
Create a similar skill for [domain] in `.github/skills/[skill-name]/`.
Include the gotchas you discovered.
```

### 4. Master Reviews
- Is it generalizable beyond this project?
- Are the patterns reusable?
- Does it overlap with existing skills?

### 4.5. Quality Gate (Promotion Readiness Score)

Calculate before promoting:

| Criterion | Points |
|-----------|--------|
| Has applyTo frontmatter | +2 |
| Has Synapses section (2+ connections) | +3 |
| Has Troubleshooting section | +2 |
| Has code examples | +2 |
| Content > 100 lines | +1 |
| Content > 200 lines | +2 |
| Uses generic terms (not project-specific) | +1-3 |
| Has Activation Patterns table | +1 |

**Score thresholds:**
- **≥12**: Ready for Master promotion
- **8-11**: Needs refinement — add missing sections
- **<8**: Keep developing in heir

**Consolidation check**: If related skills exist in Master, merge rather than add.

### 5. Promote to Master
**Option A**: Copy skill folder from heir to Master's `.github/skills/`

**Option B**: Use `alex_promote_knowledge` tool if it's a DK file

### 6. Update Master's Catalog
- Add to `copilot-instructions.md` skill list
- Regenerate `SKILL-CATALOG-GENERATED.md`

---

## Anti-Patterns

| ❌ Don't | ✅ Do Instead |
|----------|---------------|
| Write skill before project starts | Let real work inform the skill |
| Copy half-baked learnings | Wait for validated knowledge |
| Duplicate existing skills | Extend or merge with existing |
| Skip the review step | Master validates before absorption |

---

## Example: AlexCook → rich-document-pdf

1. ✅ Heir built cookbook with MD/emoji/SVG → PDF pipeline
2. ⏳ Heir finalizing scripts for Amazon KDP publication
3. 🔜 After ship: heir creates `.github/skills/rich-document-pdf/SKILL.md`
4. 🔜 Master reviews and promotes

---

## Upgrade Preservation (Automatic)

When heirs upgrade to a new Alex version, their skills are **automatically preserved**:

### What Happens During Upgrade
1. **Backup**: All existing `.github/` content backed up with timestamp
2. **Fresh Install**: New Alex architecture deployed
3. **Auto-Restore**: Profile, episodic memories, AND user-created skills restored
4. **Synapse Normalization**: Legacy synapse formats upgraded to current schema

### Synapse Schema Migrations (Automatic)
| Legacy Format | Current Format |
|---------------|----------------|
| `strength: "strong"` | `strength: 0.9` |
| `synapses: [...]` | `connections: [...]` |
| `context: "..."` | `when: "..." + yields: "..."` |
| `activationKeywords` | `activationContexts` |

### Strength Mapping
```
critical → 1.0
strong/high → 0.9
moderate/medium → 0.7
low → 0.5
weak/minimal → 0.3
```

### Philosophy
> **Never lose heir-created work.** Skills represent hard-won expertise from real projects. The upgrade process auto-restores everything recommended; only stale items (>90 days) require manual review.

**External Implementation**: VS Code extension upgrade module (0.9, implements) - "normalizeAllSynapses() executes this"

### External Knowledge
- GI-heir-skill-consolidation-kiss-merge-2026-02-10 (0.85, validates) - "KISS merge pattern discovered Feb 2026"

---

*Skills are earned through doing, not declared by planning.*
---

## Reverse Flow: Wishlist Fulfillment

> How Master Alex fulfills wishlist items and distributes to heirs

### The Wishlist Feedback Loop

```
┌─────────────┐  signals   ┌──────────────────┐  fulfills  ┌─────────────────┐
│    Heirs    │──────────▶│    Wishlist      │───────────▶│   Master Alex   │
│ (projects)  │           │ skill-registry   │            │ creates skill   │
└─────────────┘           └──────────────────┘            └────────┬────────┘
       ▲                                                          │
       │                   ┌──────────────────┐                   │
       └───────────────────│ Global Knowledge │◀──────────────────┘
            pulls          │ skills/          │     pushes
                           └──────────────────┘
```

### When Master Fulfills Wishlist

1. **Review wishlist** in `skill-registry.json` (prioritize "high" items)
2. **Create skill** in Master's `.github/skills/{skill-name}/`
3. **Push to Global Knowledge**: `Copy-Item -Recurse` to `Alex-Global-Knowledge/skills/`
4. **Update registry**: Move from `wishlist.items` to `recentlyFulfilled`
5. **Commit both repos**: Master Alex + Global Knowledge

### Wishlist Item Lifecycle

| Status | Location | Meaning |
|--------|----------|---------|
| **Pending** | `wishlist.items[]` | Skill requested but not yet built |
| **Fulfilled** | `recentlyFulfilled[]` + `skills[]` | Skill built and available |
| **Already exists** | `fulfilledBy` field | Wishlist item covered by existing skill |

### Example: February 2026 Batch

```json
{
  "recentlyFulfilled": [
    { "id": "multi-agent-orchestration", "fulfilledBy": "multi-agent-orchestration", "fulfilledDate": "2026-02-11" },
    { "id": "observability-monitoring", "fulfilledBy": "observability-monitoring", "fulfilledDate": "2026-02-11" },
    { "id": "database-design", "fulfilledBy": "database-design", "fulfilledDate": "2026-02-11" },
    { "id": "performance-profiling", "fulfilledBy": "performance-profiling", "fulfilledDate": "2026-02-11" }
  ]
}
```

### Heir Discovery

Heirs detect new skills via:
- `/checkskills` command
- Session start auto-check (if enabled)
- Project type matching against `projectSignals`

**External Integration**: Global Knowledge skill registry (`~/.alex/global-knowledge/skills/`) tracks wishlist and skill distribution.

---

## Extension Commands: Skill Inheritance

### `Alex: Inherit Skill from Global Knowledge`

Manual command for heirs to pull skills from Global Knowledge:

```
Command Palette → Alex: Inherit Skill from Global Knowledge
```

**Features**:
- Multi-select QuickPick (batch inheritance)
- Shows only `inheritance: "inheritable"` skills not already present
- Adds `inheritedFrom` tracking to `synapses.json`
- Master Alex protection warning (kill switch aware)

**Inheritance Tracking**:
```json
{
  "inheritedFrom": {
    "source": "global-knowledge",
    "registryId": "bicep-avm-mastery",
    "version": "1.0.0",
    "inheritedAt": "2026-02-11T15:00:00Z"
  }
}
```

### `Alex: Setup Global Knowledge`

Configure Global Knowledge location:

1. **Developer mode**: Links existing repo via junction symlink
2. **End user mode**: Clones from GitHub to `~/.alex/global-knowledge/`

**Auto-setup** runs silently on extension activation.

**External Implementation**: VS Code extension inheritSkill command (High, Implements) - "skill inheritance command"
**External Implementation**: VS Code extension setupGlobalKnowledge command (High, Implements) - "auto-setup functionality"
