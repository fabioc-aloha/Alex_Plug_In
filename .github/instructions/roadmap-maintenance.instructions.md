---
description: "Roadmap hygiene, backlog curation, and Research Findings deduplication protocols"
applyTo: "**/ROADMAP*.md"
inheritance: master-only
---

# Roadmap Maintenance Procedural Memory

---

## Synapses

- [ROADMAP.md] → (Critical, Documentation, Source-of-Truth) - "Product roadmap requiring active maintenance"
- [.github/instructions/release-management.instructions.md] → (High, Coordinates, Bidirectional) - "Version shipping updates roadmap status"
- [.github/instructions/research-first-workflow.instructions.md] → (Medium, Feeds, Forward) - "Research outputs should integrate with roadmap"
- [.github/instructions/technical-debt-tracking.instructions.md] → (Medium, References, Bidirectional) - "Debt items may appear in backlog"
- [.github/instructions/meditation.instructions.md] → (Medium, Triggers, Bidirectional) - "Session learnings may inform roadmap priorities"

---

## Roadmap Hygiene Discipline

### Principle

The roadmap is a **living document** that requires active curation to prevent:

- **Duplication** — Items appearing in both "Research Findings" and scheduled versions
- **Drift** — Backlog items already implemented but not removed
- **Ambiguity** — Similar items listed separately instead of combined
- **Staleness** — Completed research not promoted to scheduled work

---

## Mandatory Maintenance Triggers

| Trigger                 | Action                                                                | Frequency                |
| ----------------------- | --------------------------------------------------------------------- | ------------------------ |
| Version shipped         | Update Version Status table (📋 Planned → ✅ Shipped)                 | Every release            |
| Research complete       | Move from Research Findings → scheduled version OR remove if obsolete | When research concludes  |
| New feature added       | Check if already in backlog/research before adding                    | Before roadmap edit      |
| Backlog item proposed   | Verify not already scheduled in Version Details                       | Before adding to backlog |
| Similar features found  | Combine into single entry with comprehensive scope                    | During backlog audit     |
| VS Code stable released | Run VS Code Version Evaluation procedure (see below)                  | Each stable release      |

---

## VS Code Version Evaluation Procedure

**When**: Each VS Code stable release. **Touches 5+ sections simultaneously — use batch edits.**

1. Check `engines.vscode` in package.json — bump only if new minimum needed
2. Check `@types/vscode` — bump only if new API features consumed
3. Fetch release notes (Insiders page if stable docs not yet published)
4. Compare tracked vs untracked features against ROADMAP sections:
   - **Pressing Issues**: Add new P1/P2 items for high-impact features
   - **Blocked Contracts**: Refresh status of each contract against new release
   - **Future Watch**: Add architectural opportunities worth monitoring
   - **Gated**: Update gate conditions if thresholds shift
5. Update `copilot-instructions.md` settings header version and add notable new settings
6. Update Version Status table and footer (current version, skill count, test count, date)
7. Log which issue numbers map to each tracked feature for traceability

---

## Backlog Audit Procedure

**When to Audit**: Quarterly, before major releases, or when backlog > 20 items

### Step 1: Deduplication

1. **Cross-reference Research Findings vs Version Details**
   - Remove research items already scheduled (e.g., VS Code 1.109 in v5.9.0)
   - Remove research items already shipped (e.g., Architecture assessment completed)
2. **Cross-reference Backlog vs Version Details**
   - Remove backlog items already scheduled in a version
   - Promote high-priority backlog items to scheduled versions
3. **Cross-reference Research vs Backlog**
   - Consolidate overlapping items (choose most specific location)

### Step 2: Consolidation

1. **Identify Similar Items**
   - Group by domain (e.g., "Marp presentation" + "PptxGenJS integration" → "Presentation automation")
   - Combine items with shared implementation (e.g., "DALL-E" redundant if "Replicate" exists)
2. **Merge Related Entries**
   - Keep most comprehensive description
   - Add "Combines: X, Y, Z" note if helpful
   - Update priority/effort to reflect combined scope

### Step 3: Verification

1. **Check Implementation Status**
   - Search codebase for feature evidence (grep, file_search)
   - If implemented: Remove from backlog OR update status to "✅ Shipped"
2. **Update Completion Ratios**
   - For partial work, use "X/Y complete" format (e.g., "28/32 GK patterns migrated")
   - Avoids binary incomplete/complete, shows progress

### Step 4: Prioritization

1. **Re-evaluate P0/P1/P2** based on:
   - Current roadmap focus (e.g., v5.7.x = UI/UX, not new platforms)
   - Dependency chains (feature X blocks feature Y)
   - User impact vs effort ratio
2. **Archive Low-Priority Items**
   - Move P3+ items to `archive/roadmaps/backlog-archive-YYYY-MM.md`
   - Keeps active backlog focused and actionable

---

## Research Findings Management

### Purpose

Research Findings captures **exploratory work** that may or may not become scheduled features.

### Lifecycle

```
Research Started → Research Findings (unscheduled)
                ↓
        Research Complete
                ↓
        ┌───────┴───────┐
        ↓               ↓
   Scheduled Work   Not Viable
   (move to vX.X)   (remove entry)
```

### Anti-Patterns to Avoid

❌ **Duplication** — Item in both Research Findings AND scheduled version  
❌ **Permanent Residence** — Research item never promoted or removed  
❌ **Implementation Drift** — Feature implemented but Research Findings not updated  
❌ **Vague Entries** — "Explore X" without timeline or outcome criteria

### Best Practices

✅ **Time-Boxing** — Add target date or version for research completion  
✅ **Outcome Criteria** — "Decide: viable heir platform vs out of scope" (clear exit)  
✅ **Promotion Path** — When research concludes, schedule OR remove (don't leave in limbo)  
✅ **Status Tracking** — Use "🔬 Researching" / "✅ Complete" / "❌ Not Viable" markers

---

## Version Status Updates

### When Version Ships

1. **Update Version Status Table**

   ```markdown
   | v5.7.5 | Skill Intelligence | Context-Aware Guidance | 📋 Planned |
   ```

   becomes:

   ```markdown
   | **v5.7.5** | **Skill Intelligence** | **Context-Aware Guidance** | **✅ Shipped** |
   ```

2. **Update Task Status in Version Details**
   - All tasks: 📋 → ✅ (if complete)
   - OR update individual task status if partially complete

---

## Three-State Status Vocabulary

Binary status (`Planned` / `Shipped`) misses the most common real-world state: **work is complete but not yet published or released**. Use three states to avoid roadmaps that lie.

| Status      | Emoji | Meaning                                                                     |
| ----------- | :---: | --------------------------------------------------------------------------- |
| In scaffold |  📋   | Structure exists; substantive logic not yet written                         |
| Implemented |  🔨   | Real code written and logically complete; not yet compiled/tested/published |
| Shipped     |  ✅   | Compiled, tested, and published to users                                    |

**Why the middle state matters**: A roadmap that jumps from `📋 In scaffold` to `✅ Shipped` creates a false picture during the implementation phase — where most time is actually spent. A feature that's 80% to ship looks identical to one that's 0% to ship without `🔨 Implemented`.

### Application Rule

When auditing a roadmap item:

1. Does a `src/` or equivalent exist with real logic (not just boilerplate)? → `🔨 Implemented`
2. Has it passed compile, test, and been published to users? → `✅ Shipped`
3. Neither? → `📋 In scaffold`

For extension-specific roadmaps, "Implemented" means `extension.ts` has real command registrations and logic. "Shipped" means `npx vsce publish` has run successfully.

3. **Update Current State Section**
   - Bump version number (e.g., "v5.7.2 is current" → "v5.7.5 is current")
   - Add shipped features to capabilities list

---

## Integration with Release Management

**Timing**: Roadmap updates happen during release workflow

1. **Pre-Release**: Version Details tasks marked ✅ as completed
2. **At Release**: Version Status updated to Shipped
3. **Post-Release**: Current State section updated with new capabilities
4. **Next Cycle**: Backlog audit to plan next version

**See Also**: [release-management.instructions.md] for full release workflow

---

## Example: February 15, 2026 Session Audit

**Issue**: Research Findings accumulated duplicates with scheduled roadmap

**Actions Taken**:

1. **Removed from Research Findings** (already scheduled):
   - VS Code 1.109 → already in v5.9.0
   - Architecture assessment → already completed
   - @alex enhancement → already in v5.8.x
2. **Removed from Research Findings** (already implemented):
   - DALL-E → Replicate MCP already integrated
3. **Combined Similar Items**:
   - "Marp presentation tool" + "PptxGenJS automation" → "Presentation automation (Marp + PptxGenJS + Replicate)"
4. **Updated Partial Completion**:
   - "GK pattern format inconsistency" → "GK pattern format migration (28/32 complete in v5.6.5) — P2"

**Result**: Research Findings reduced from 12 items → 8 items (33% reduction), zero duplication

---

## Validation Checklist

Before committing roadmap changes:

- [ ] No item appears in multiple sections (Research Findings, Backlog, Scheduled Version)
- [ ] All completed items removed or marked ✅ Shipped
- [ ] Similar items combined with rationale noted
- [ ] Partial completion uses "X/Y" ratio format
- [ ] Version Status table reflects latest ships
- [ ] Current State section updated if version shipped
- [ ] All Research Findings have outcome criteria or target version

---

_Roadmap maintenance procedural memory — learned from February 15, 2026 backlog audit session_
