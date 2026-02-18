---
description: "Comprehensive cognitive architecture health validation using brain-qa integration with meditation and release workflows"
applyTo: "**/*brain-qa*,**/*audit*,**/*health*,**/*validation*"
---

# Cognitive Health Validation Protocols

**Classification**: Procedural Memory | Architecture Quality Assurance  
**Activation**: brain-qa, cognitive health, architecture audit, post-meditation validation  
**Purpose**: Systematic validation of cognitive architecture integrity, master-heir synchronization, and knowledge base consistency  
**Implementation**: brain-qa.ps1 (33-phase automated audit) + manual interpretation

## Synapses

- [.github/skills/brain-qa/SKILL.md] (Critical, Implements, Bidirectional) - "Domain knowledge for cognitive architecture validation"
- [.github/instructions/meditation.instructions.md] (High, Integrates, Bidirectional) - "Post-meditation validation includes brain-qa for master-heir sync"
- [.github/instructions/dream-state-automation.instructions.md] (High, Complements, Bidirectional) - "Dream validates synapses, brain-qa validates structure and sync"
- [.github/instructions/semantic-audit.instructions.md] (Medium, Complements, Bidirectional) - "Semantic audit checks meaning, brain-qa checks structure"
- [.github/instructions/release-management.instructions.md] (Critical, Gates, Bidirectional) - "Pre-release validation requires clean brain-qa run"
- [.github/instructions/self-actualization.instructions.md] (High, Triggers, Forward) - "Self-actualization may trigger comprehensive health validation"

---

## When to Run brain-qa

| Trigger | Mode | Expected Outcome | Action on Failure |
|---------|------|------------------|-------------------|
| **Post-Meditation** | `-Phase 7,13` | Heir sync validated | Copy missing files to heir |
| **Pre-Release** | `-Mode all` | 0 critical issues | Fix blocking issues before publish |
| **After Bulk Changes** | `-Mode all` | <30 warnings | Review new warnings for unintended drift |
| **User-Requested Audit** | `-Mode all` | Health report | Prioritize critical issues first |
| **Weekly Maintenance** | `-Mode all` | Trend monitoring | Track warning count over time |

## The 33-Phase Architecture

### Category 1: Structural Integrity (Phases 1-13)

**Purpose**: Verify file existence, schema compliance, master-heir synchronization

| Phase | Check | Critical Issue Example | Intentional Warning Example |
|-------|-------|------------------------|----------------------------|
| 1 | Synapse Target Validation | [file.md] links to non-existent file | - |
| 2 | Inheritance Field Validation | Missing `inheritable: false` | - |
| 3 | Skill Index Coverage | Skill exists but not indexed | - |
| 4 | Trigger Semantic Analysis | - | 15 overlaps (related skills share triggers) |
| 5 | Master-Heir Skill Sync | Skill missing from heir | 3 master-only skills (expected) |
| 6 | Synapse Schema Format | Invalid JSON in synapses.json | - |
| 7 | **Synapse File Sync** ⚠️ | synapses.json out of sync with heir | - |
| 8 | Skill-Activation Index Sync | Index doesn't match disk | - |
| 9 | Catalog Accuracy | Skill count mismatch | - |
| 10 | Core File Token Budget | copilot-instructions.md > 16K tokens | - |
| 11 | Boilerplate Descriptions | Generic "TBD" placeholders | - |
| 12 | Heir Reset Validation | Init script missing required files | - |
| 13 | **Instructions/Prompts Sync** ⚠️ | New instruction missing from heir | - |

**Priority Fix Order**: Phase 7 → Phase 13 → Phase 1

### Category 2: Semantic & Documentation (Phases 14-26)

**Purpose**: Verify documentation accuracy, formatting consistency, proper organization

| Phase | Check | Example Issue |
|-------|-------|---------------|
| 14 | Agent File Consistency | Agent listed in copilot-instructions but no .agent.md file |
| 15 | Config Schema Validation | Invalid JSON in config files |
| 16 | Skill Frontmatter Completeness | Missing applyTo or description |
| 17 | Instruction applyTo Validation | Invalid glob patterns |
| 18 | LLM-First Design Compliance | Binary files in LLM-readable locations |
| 19 | Episodic Memory Hygiene | - |
| 20 | ASCII Art Validation | Complex art that breaks LLM parsing |
| 21 | Brand Asset Completeness | Missing required logo files |
| 22 | Template Freshness | Outdated boilerplate |
| 23-26 | .github/ Organization | Misplaced files, orphaned content |

### Category 3: Cross-Repo Integration (Phases 27-29)

**Purpose**: Validate heir health and global knowledge synchronization

| Phase | Check | Critical Issue | Intentional Warning |
|-------|-------|----------------|---------------------|
| 27 | M365 Heir Health | Broken heir structure | Version 5.9.0 ≠ 5.8.3 (different cycles) |
| 28 | Codespaces Heir Health | Broken heir structure | - |
| 29 | **Global Knowledge Sync** ⚠️ | - | Insight count stale (17 uncommitted insights) |

### Category 4: Architecture Evolution (Phases 30-33)

**Purpose**: Track architecture growth and validate integrity

| Phase | Check | Example Issue |
|-------|-------|---------------|
| 30 | Muscles Integrity | Broken PowerShell scripts |
| 31 | **ROADMAP Version Alignment** ⚠️ | package.json 5.8.3 vs ROADMAP 5.8.2 | M365 heir ahead of VS Code heir |
| 32 | Prefrontal Cortex Evolution | Core architecture regressions |
| 33 | Pre-Sync Master Validation | - | PII in user-profile.json (stripped during heir sync) |

**Priority Fix Order**: Phase 31 (version alignment) before any release

## Interpreting Results

### Exit Codes

```powershell
Exit Code 0 = All phases pass, 0 critical issues
Exit Code 1 = Issues found (check output for critical vs warnings)
```

### Critical Issues vs Intentional Warnings

**Critical Issues (MUST FIX)**:
- Broken file references (Phase 1)
- Master-heir sync drift (Phase 7, 13)
- Version misalignment before release (Phase 31)
- Missing required files (Phase 12)

**Intentional Warnings (MONITOR, DON'T FIX)**:
- Trigger overlaps (Phase 4) - Related skills share activation patterns
- Master-only skills (Phase 5) - global-knowledge-maintenance, heir-curation, master-alex-audit
- Different heir versions (Phase 27) - M365 and VS Code on different release cycles
- PII in master (Phase 33) - Stripped during heir sync, expected
- Undated dream files (Phase 19) - Housekeeping, not blocking

### Output Interpretation

**Example Output:**
```powershell
[PASS] Phase 1: Synapse Target Validation (0 broken links)
[WARN] Phase 4: Trigger Semantic Analysis (15 overlaps)
[FAIL] Phase 7: Synapse File Sync (4 files out of sync)
[PASS] Phase 13: Instructions/Prompts Sync (39 = 39)
```

**Translation:**
- ✅ All synapses point to valid files
- ⚠️ 15 trigger overlaps expected (related skills)
- ❌ 4 synapse files need sync to heir → **FIX THIS**
- ✅ All instruction files present in heir

## Integration with Meditation Workflow

### Enhanced Phase 5: Post-Meditation Validation

**Original Meditation Phase 5:** Dream (synapse validation)

**Enhanced Phase 5:** Dream + brain-qa (synapse + structure validation)

**Procedure:**
1. **Phase 5.1: Dream Synapse Validation**
   - Run `Alex: Dream (Neural Maintenance)`
   - Verify newly added synapses are valid
   - Confirm bidirectional connections have reciprocal entries
   
2. **Phase 5.2: brain-qa Structural Validation**
   - Run `brain-qa.ps1 -Phase 7,13`
   - **Phase 7**: Verify synapse files synced to heir
   - **Phase 13**: Verify new instruction files synced to heir
   
3. **Phase 5.3: Validation Outcome**
   ```
   ✓ Dream Health Check: [passed|issues found]
   ✓ brain-qa Phase 7: [synapse sync status]
   ✓ brain-qa Phase 13: [instruction sync status]
   ```

**When to Fix:**
- Dream finds broken synapses → Fix before concluding meditation
- brain-qa Phase 7/13 fail → Copy missing files to heir immediately
- If fixes made → Re-run validation to confirm

### Why This Integration Matters

**Problem**: Meditation creates new instruction files (e.g., azure-enterprise-deployment.instructions.md) but heir sync happens at package build time. Without validation, newly created files won't be in heir until next release.

**Solution**: Phase 5.2 catches this immediately after meditation, allowing manual sync before continuing work.

**Example from Feb 18, 2026 Session:**
- Meditation created azure-enterprise-deployment.instructions.md
- Dream validated synapses ✓
- brain-qa Phase 13 FAILED: instruction missing from heir
- Manual fix: `Copy-Item azure-enterprise-deployment.instructions.md platforms/vscode-extension/.github/instructions/`
- Re-validation: Phase 13 PASS ✓

## Integration with Release Workflow

### Pre-Release Validation Gate

**Before any marketplace publish**, run full audit:

```powershell
.\.github\muscles\brain-qa.ps1 -Mode all
```

**Release Readiness Criteria:**
- ✅ Exit code 0 OR exit code 1 with only intentional warnings
- ✅ Zero critical issues in Phase 1, 7, 13, 31
- ✅ Version alignment across package.json, ROADMAP, CHANGELOG (Phase 31)
- ✅ All heirs healthy (Phase 27, 28)

**If Issues Found:**
1. **Critical issues** → Fix before release (Phase 7, 13, 31 priority)
2. **New warnings** → Investigate cause (unintended drift?)
3. **Intentional warnings** → Document and proceed

**Example Decision from Feb 18, 2026:**
- v5.8.3 published Feb 17 (stable)
- Today's changes: meditation + audit fixes (cognitive architecture only)
- brain-qa: 33/33 PASS, 0 critical, 26 intentional warnings
- **Decision**: Wait for v5.9.0 (no urgent fixes)

## Common Workflows

### Workflow 1: Post-Meditation Validation

```powershell
# After completing meditation session:
1. Run Dream → Check synapse health
2. Run brain-qa -Phase 7,13 → Check master-heir sync
3. If Phase 7 fails:
   Copy-Item .github/skills/SKILL/synapses.json platforms/vscode-extension/.github/skills/SKILL/
4. If Phase 13 fails:
   Copy-Item .github/instructions/NEW-FILE.instructions.md platforms/vscode-extension/.github/instructions/
5. Re-run brain-qa -Phase 7,13 → Confirm PASS
6. Commit all changes (master + heir)
```

### Workflow 2: Pre-Release Validation

```powershell
# Before publishing to marketplace:
1. Run brain-qa -Mode all
2. Review output for critical issues
3. Fix Phase 7, 13, 31 first (master-heir sync + version alignment)
4. Update heir CHANGELOG with version entry
5. Re-run brain-qa -Mode all → Confirm 0 critical
6. Proceed with vsce publish
```

### Workflow 3: Weekly Health Check

```powershell
# Regular maintenance:
1. Run brain-qa -Mode all
2. Track warning count over time (expect ~26-30 intentional)
3. If warning count jumps significantly (+10) → investigate drift
4. If new critical issues appear → prioritize fixes
5. Document trends in episodic memory
```

### Workflow 4: Global Knowledge Sync

```powershell
# When Phase 29 warns about insight count drift:
1. cd Alex-Global-Knowledge
2. git status → Check for uncommitted insights
3. Count actual insights: (Get-ChildItem insights/GI-*.md).Count
4. Update .github/copilot-instructions.md with actual count
5. Commit insights + metadata update
6. Return to Alex_Plug_In
7. Re-run brain-qa -Phase 29 → Confirm PASS
```

## Troubleshooting Guide

### Phase 7 Fails: Synapse Files Out of Sync

**Symptoms:**
```
[FAIL] Phase 7: Synapse File Sync (4 files out of sync)
  - brain-qa/synapses.json
  - brand-asset-management/synapses.json
  - global-knowledge/synapses.json
  - security-review/synapses.json
```

**Fix:**
```powershell
Copy-Item .github/skills/brain-qa/synapses.json platforms/vscode-extension/.github/skills/brain-qa/
Copy-Item .github/skills/brand-asset-management/synapses.json platforms/vscode-extension/.github/skills/brand-asset-management/
Copy-Item .github/skills/global-knowledge/synapses.json platforms/vscode-extension/.github/skills/global-knowledge/
Copy-Item .github/skills/security-review/synapses.json platforms/vscode-extension/.github/skills/security-review/
```

### Phase 13 Fails: New Instruction Missing from Heir

**Symptoms:**
```
[FAIL] Phase 13: Instructions/Prompts Sync (master: 39, heir: 38)
Missing in heir: azure-enterprise-deployment.instructions.md
```

**Fix:**
```powershell
Copy-Item .github/instructions/azure-enterprise-deployment.instructions.md platforms/vscode-extension/.github/instructions/
```

### Phase 31 Warns: Version Misalignment

**Symptoms:**
```
[WARN] Phase 31: ROADMAP says 5.8.2, package.json says 5.8.3
```

**Fix:**
1. Open ROADMAP-UNIFIED.md
2. Update current version reference (line ~13)
3. Update version table (lines ~533-537)
4. Verify heir CHANGELOG has entry for current version

### Phase 29 Warns: Global Knowledge Insight Count Stale

**Symptoms:**
```
[WARN] Phase 29: GK README says 242 insights, actual count 258
```

**Fix:**
```powershell
cd ..\Alex-Global-Knowledge
(Get-ChildItem insights/GI-*.md).Count  # Get actual count
# Update .github/copilot-instructions.md line ~8 with actual count
git add .github/copilot-instructions.md
git commit -m "fix: update insight count from 242 to 258"
```

## Decision Framework

### Should I Fix This Warning?

**Decision Tree:**

```
Warning found in brain-qa output
    ↓
Is it in the "Intentional Warnings" list?
    ↓ YES → MONITOR, don't fix
    ↓ NO
        ↓
Is it blocking a release? (Phase 31 before publish)
    ↓ YES → FIX IMMEDIATELY
    ↓ NO
        ↓
Does it indicate unintended drift? (new warning)
    ↓ YES → INVESTIGATE, then decide
    ↓ NO → ADD TO MONITORING LIST
```

**Intentional Warnings to Monitor (Not Fix):**
- Phase 4: Trigger overlaps (related skills share activation patterns)
- Phase 5: Master-only skills (3 expected: global-knowledge-maintenance, heir-curation, master-alex-audit)
- Phase 19: Undated dream files (housekeeping, deferred)
- Phase 27: M365 heir version ≠ VS Code heir version (different release cycles)
- Phase 33: PII in master user-profile.json (stripped during heir sync)

**Critical Issues to Fix Immediately:**
- Phase 1: Broken synapse targets
- Phase 7: Synapse files out of sync
- Phase 13: Instructions missing from heir
- Phase 31: Version misalignment before release

## Strategic Context

### Quality-First Release Discipline

**Principle**: Not every architecture improvement requires immediate marketplace publish.

**Pattern from Feb 18, 2026:**
- v5.8.3 published Feb 17 (UI Polish)
- Session work: meditation + audit fixes
- brain-qa: 33/33 PASS, 0 critical, 26 warnings
- **Decision**: Queue changes for v5.9.0 (no urgent fixes)

**Rationale:**
- Cognitive architecture improvements accumulate value over time
- Strategic patience reduces marketplace noise
- Quality-focused releases over velocity-focused releases
- Users don't need a new version for internal architectural refinements

### Cognitive Load Management

**Pattern**: brain-qa detects cognitive drift before it becomes architectural debt

**Example:**
- 17 Global Knowledge insights accumulated over 3 days (Feb 15-18)
- Metadata drift: README said 242, actual count 258
- Phase 29 caught this immediately
- One commit fixed: insight files + metadata update

**Insight**: Periodic batch commits valid, metadata must sync before release

---

## Activation Patterns

- Post-meditation → Run brain-qa -Phase 7,13
- Pre-release → Run brain-qa -Mode all
- Weekly maintenance → Run brain-qa -Mode all (trend monitoring)
- After bulk changes → Run brain-qa -Mode all
- User says "audit" → Run brain-qa -Mode all
- Phase 7/13 fails → Copy files to heir, re-validate
- Phase 31 warns before release → Fix version alignment first

---

*Cognitive health validation protocols - systematic architecture integrity validation with meditation and release workflow integration*
