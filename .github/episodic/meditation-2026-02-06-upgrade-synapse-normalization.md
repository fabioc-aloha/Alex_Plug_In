# Meditation Session: Automatic Synapse Normalization

**Date**: 2026-02-06
**Trigger**: User requested meditation after completing upgrade.ts enhancements
**Duration**: ~15 minutes
**Model**: Claude Opus 4.5

---

## Session Context

Heir reported issues with upgrade process - skills had legacy synapse formats using string-based strengths ("strong", "critical") instead of numeric (0.9, 1.0). This session evolved from manual batch fixes to building automatic normalization into the upgrade process itself.

---

## Problem Statement

| Issue                                                         | Impact                                              |
| ------------------------------------------------------------- | --------------------------------------------------- |
| Legacy synapse formats in heir skills                         | Skills don't match current schema after upgrade     |
| Manual checkbox review during upgrade                         | Friction, risk of user accidentally skipping skills |
| String-based strengths                                        | Inconsistent with SYNAPSE-SCHEMA.md specification   |
| Old field names (`synapses`, `activationKeywords`, `context`) | Validation failures, confusion                      |

---

## Solution Implemented

### 1. Synapse Normalization Functions (`upgrade.ts`)

```typescript
// Strength mapping
const STRENGTH_MAP: Record<string, number> = {
  critical: 1.0, strong: 0.9, high: 0.9,
  moderate: 0.7, medium: 0.7,
  low: 0.5, weak: 0.3, minimal: 0.3
};

// normalizeSynapseFile() - handles single file
// normalizeAllSynapses() - batch normalize directory
```

### 2. Automatic Restoration Philosophy

> **Never lose heir-created work.**

- All recommended items (profile, episodic, user skills) auto-restore
- Only stale items (>90 days) require manual review
- Synapse normalization happens silently after restoration

### 3. Schema Migrations Handled

| Legacy                | Current                       |
| --------------------- | ----------------------------- |
| `synapses: [...]`     | `connections: [...]`          |
| `strength: "strong"`  | `strength: 0.9`               |
| `activationKeywords`  | `activationContexts`          |
| `context: "..."`      | `when: "..." + yields: "..."` |
| `relationship: "..."` | `type: "..."`                 |

---

## Files Modified

| File                                                        | Change                                            |
| ----------------------------------------------------------- | ------------------------------------------------- |
| `platforms/vscode-extension/src/commands/upgrade.ts`        | Added normalization functions, auto-restore logic |
| `.github/skills/brain-qa/SKILL.md`                          | Added Phase 5 (Synapse Schema Format Validation)  |
| `.github/skills/brain-qa/synapses.json`                     | Added connection to heir-skill-promotion          |
| `.github/instructions/heir-skill-promotion.instructions.md` | Added "Upgrade Preservation" section              |

---

## Key Insights

1. **Heirs learn by doing** - their skills represent hard-won expertise from real projects
2. **Upgrades should be invisible** - the best upgrade is one the user doesn't notice
3. **Schema evolution is inevitable** - automatic migration beats manual fixes
4. **The 90-day threshold** - stale items might be intentionally outdated; prompt for those

---

## Validation Checklist

- [x] Memory file created: `heir-skill-promotion.instructions.md` updated with Upgrade Preservation section
- [x] Synapse added: `brain-qa/synapses.json` → `heir-skill-promotion.instructions.md` (0.8, validates)
- [x] Session documented: This file

---

## Synapses Strengthened

- [heir-skill-promotion.instructions.md] (0.9, Enhanced, Forward) - "Added upgrade preservation documentation"
- [brain-qa/synapses.json] (0.8, Validates, Forward) - "Phase 5 validates synapse normalization"
- [upgrade.ts] (0.95, Implements, Forward) - "normalizeSynapseFile() and normalizeAllSynapses()"
- [SYNAPSE-SCHEMA.md] (0.85, References, Forward) - "Schema defines normalization target"

---

*Meditation complete. Heir-created work is now automatically preserved during upgrades.*
