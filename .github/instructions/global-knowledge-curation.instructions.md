# Global Knowledge Curation Protocol

> Master Alex periodically reviews global knowledge, implements for heirs when appropriate, and cleans up to maintain a curated knowledge base.

## Purpose

Global knowledge (`~/.alex/global-knowledge/`) accumulates insights and patterns from all projects. Without curation, it becomes cluttered with:
- Outdated insights
- Duplicate patterns
- Context-specific learnings that shouldn't be global
- Items already implemented in Master or heirs

This protocol ensures global knowledge remains valuable and actionable.

## Curation Workflow

### Step 1: Review Global Knowledge

```powershell
# Check current global knowledge status
Get-ChildItem ~/.alex/global-knowledge/patterns/ -Recurse
Get-ChildItem ~/.alex/global-knowledge/insights/ -Recurse
```

For each item, assess:
- **Relevance**: Is this still useful?
- **Scope**: Is this truly cross-project, or context-specific?
- **Implementation**: Has this already been implemented somewhere?
- **Quality**: Is this well-documented and actionable?

### Step 2: Triage Decision

For each global knowledge item, decide:

| Decision | Action | When to Use |
|----------|--------|-------------|
| **Keep** | Leave in global knowledge | Valuable, not yet implemented |
| **Implement Master** | Promote to Master Alex files | Core capability for all projects |
| **Implement Heirs** | Deploy to heir platforms | Platform-specific enhancement |
| **Implement Both** | Master + sync to heirs | Universal improvement |
| **Archive** | Move to `~/.alex/archive/` | Outdated but worth keeping |
| **Delete** | Remove entirely | No longer relevant |

### Step 3: Implementation Paths

#### A. Implement in Master Only
For knowledge that belongs in the core architecture but doesn't need heir distribution:

1. Create/update appropriate Master Alex file:
   - New skill → `.github/skills/[skill-name]/SKILL.md`
   - New procedure → `.github/instructions/[name].instructions.md`
   - New workflow → `.github/prompts/[name].prompt.md`
   
2. Remove from global knowledge:
   ```powershell
   Remove-Item ~/.alex/global-knowledge/[patterns|insights]/[item]
   ```

#### B. Implement in Heirs
For knowledge that should be available in packaged distributions:

1. Implement in Master first (single source of truth)
2. Sync to heirs:
   ```powershell
   # Sync skills
   Copy-Item -Path ".\.github\skills\*" -Destination ".\platforms\vscode-extension\.github\skills\" -Recurse -Force
   
   # Sync instructions
   Copy-Item -Path ".\.github\instructions\*" -Destination ".\platforms\vscode-extension\.github\instructions\" -Recurse -Force
   ```

3. Remove from global knowledge after heir sync

#### C. Archive
For knowledge that's outdated but has historical value:

```powershell
# Create archive folder if needed
New-Item -ItemType Directory -Path ~/.alex/archive/ -Force

# Move item to archive
Move-Item ~/.alex/global-knowledge/[patterns|insights]/[item] ~/.alex/archive/
```

### Step 4: Document Changes

After curation session, update:
- Changelog if significant
- Skill catalog if new skills added
- Implementation plan if related to roadmap

## Curation Triggers

Run this protocol when:
- **Scheduled**: Weekly or bi-weekly review
- **Before Release**: Ensure no orphaned knowledge
- **After Major Learning**: When global knowledge grows significantly
- **Meditation Insight**: When meditation surfaces curation need

## Index Validation (Schema Integrity)

GK index entries can drift from the expected schema. Run this validation during curation:

### Two-Layer Validation Protocol

**Layer 1: File ↔ Index Sync**
```powershell
# Check for orphaned files (file exists, no index entry)
$allFiles = (Get-ChildItem patterns/*.md) + (Get-ChildItem insights/*.md)
$indexPaths = (Get-Content index.json | ConvertFrom-Json).entries.filePath
$orphans = $allFiles | Where-Object { $_.Name -notin ($indexPaths | Split-Path -Leaf) }

# Check for missing files (index entry, no file)
$missing = $indexPaths | Where-Object { -not (Test-Path $_) }
```

**Layer 2: Schema Field Compliance**
```powershell
$requiredFields = @('id', 'title', 'type', 'category', 'created', 'filePath')
$index = Get-Content index.json | ConvertFrom-Json
foreach ($entry in $index.entries) {
    $missingFields = $requiredFields | Where-Object { -not $entry.$_ }
    if ($missingFields) { "Entry $($entry.id): missing $($missingFields -join ', ')" }
}
```

**Common Schema Drift Issues**:
- `source` instead of `sourceProject`
- `path` instead of `filePath`
- Missing `type`, `modified`, or `summary` fields

## Example Curation Session

```
📋 Global Knowledge Review - 2026-02-04

Patterns (5 items):
├── GK-001-error-recovery.md
│   Decision: Implement Both
│   Action: Created error-recovery-patterns skill, synced to VS Code heir
│   Status: ✅ Removed from global
│
├── GK-002-azure-auth-tips.md
│   Decision: Implement Heirs (VS Code only)
│   Action: Added to azure skill, synced to heir
│   Status: ✅ Removed from global
│
├── GK-003-debugging-shortcuts.md
│   Decision: Keep
│   Reason: Still accumulating insights
│   Status: 📌 Retained
│
├── GK-004-old-phoenix-notes.md
│   Decision: Archive
│   Reason: Historical, no longer relevant
│   Status: 📦 Moved to archive
│
└── GK-005-duplicate-pattern.md
    Decision: Delete
    Reason: Already in anti-hallucination skill
    Status: 🗑️ Deleted

Insights (3 items):
└── [similar triage...]

Summary: 2 implemented, 1 retained, 1 archived, 1 deleted
```

## Synapses

- Connects to: `heir-skill-promotion.instructions.md` (for heir implementation)
- Connects to: `global-knowledge/SKILL.md` (for knowledge management)
- Connects to: `unified-meditation-protocols.prompt.md` (may surface curation needs)
- Connects to: `dream-state-automation.instructions.md` (could automate checks)
- Connects to: `GI-gk-index-schema-drift-detection-2026-02-10` (index validation pattern)

---

## Complete Heir Skill Promotion Workflow (Validated February 2026)

**Context**: Heirs create skills in Global Knowledge. Master Alex periodically discovers, promotes, and integrates them into core architecture.

### End-to-End Procedural Pattern

**Phase 1: Discovery**
```powershell
# Check GK skill registry
$registry = Get-Content ~/.alex/global-knowledge/skills/skill-registry.json | ConvertFrom-Json
$registrySkills = $registry.skills | Where-Object { $_.inheritance -eq 'inheritable' }

# Check GK patterns for knowledge-only patterns
$patterns = Get-ChildItem ~/.alex/global-knowledge/patterns/GK-*.md
$knowledgeOnlyPatterns = $patterns | Where-Object { 
    (Get-Content $_.FullName -Raw) -notmatch 'trifecta-complete' 
}
```

**Phase 2: Triage and Assessment**
1. **Full Trifectas** (SKILL.md + synapses.json in registry) → Ready for direct copy
2. **Knowledge-Only Patterns** (GK-*.md in patterns/) → Need trifecta creation
3. Assess which to promote based on:
   - Relevance to Master Alex's core capabilities
   - Quality and completeness of documentation
   - Cross-project applicability vs. project-specific

**Phase 3: Promotion Execution**

For **Full Trifectas**:
```powershell
# Copy entire skill folder
Copy-Item -Path "~/.alex/global-knowledge/skills/database-design/" `
          -Destination ".github/skills/database-design/" `
          -Recurse
```

For **Knowledge-Only Patterns**:
1. Extract skill content from GK pattern file
2. Create skill folder structure:
   ```
   .github/skills/{skill-name}/
   ├── SKILL.md (from GK pattern content)
   └── synapses.json (create new with proper schema)
   ```
3. Populate synapses.json with:
   - Schema version 2.1.0
   - Connections to related skills (6+ recommended)
   - activationBoost keywords
   - when/yields routing logic

**Phase 4: Documentation Updates**

Update skill count across all files (search for old count → replace with new):
1. `.github/copilot-instructions.md` → "Total Skills: X"
2. `CHANGELOG.md` → Add new skills under current version
3. `README.md` → Multiple instances (architecture tree, features, etc.)
4. `ROADMAP-UNIFIED.md` → Total and inheritable counts
5. `platforms/vscode-extension/README.md` → Heir documentation
6. `.github/skills/self-actualization/SKILL.md` → Self-reference
7. `.github/skills/documentation-quality-assurance/SKILL.md` → Examples

**Phase 5: Asset Generation (if applicable)**

For skills that generate visual assets:
```powershell
# Run generation scripts
node scripts/generate-{skill-assets}.js

# Verify outputs in assets/
Get-ChildItem assets/ -Filter "banner-*"
```

**Phase 6: Validation**

1. **Syntax**: Check for errors in new skill files
   ```powershell
   # VS Code will show diagnostics
   code .github/skills/{new-skill}/SKILL.md
   ```

2. **Synapses**: Verify all connection targets exist
   ```powershell
   # Run Dream to validate synaptic health
   # Alex: Dream (Neural Maintenance)
   ```

3. **Documentation**: Confirm all skill counts match
   ```powershell
   # Search workspace for old count
   # Ensure all instances updated
   ```

**Phase 7: Global Knowledge Cleanup**

After successful promotion:
```powershell
# For full trifectas - remove from GK (now in Master)
Remove-Item ~/.alex/global-knowledge/skills/{skill-name}/ -Recurse

# For knowledge-only patterns - optionally archive
Move-Item ~/.alex/global-knowledge/patterns/GK-{pattern}.md `
          ~/.alex/archive/promoted/
```

### Real-World Example (February 15, 2026)

**Discovered**:
- 4 full trifectas in GK skill registry: database-design, multi-agent-orchestration, observability-monitoring, performance-profiling
- 3 knowledge-only patterns: extension-audit-methodology, ai-character-reference-generation, ai-generated-readme-banners

**Promoted**:
- Created 3 new skill trifectas from knowledge-only patterns
- Total: 119 skills (116 → 119)
- Updated 7 documentation files
- Generated 6 Ideogram banners ($0.48, stunning quality)

**Time**: ~30 minutes for complete workflow
**Cost**: $0.48 for banner generation
**Quality**: Production-ready, validated trifectas

### Automation Opportunities

**Future Enhancement**: Create `/promote-gk-skill` command that:
1. Scans GK for new skills
2. Shows QuickPick for selection
3. Executes promotion workflow
4. Updates documentation automatically
5. Runs Dream validation
6. Generates summary report

---

## Skill Inheritance from Global Knowledge

Heirs can **inherit skills** from Global Knowledge rather than creating them from scratch. This enables rapid capability deployment across projects.

### Two Inheritance Sources

| Source | Location | Format | Transformation |
|--------|----------|--------|----------------|
| **Skill Registry** | `~/.alex/global-knowledge/skills/` | Ready-to-use folders | Direct copy |
| **GK Patterns** | `~/.alex/global-knowledge/patterns/GK-*-skill*.md` | Embedded skills | Strip GK header |

### Source 1: Skill Registry (Primary)

The `skill-registry.json` contains 89+ production-ready skills:

```json
{
  "skills": [
    {
      "id": "database-design",
      "name": "Database Design",
      "version": "1.0.0",
      "inheritance": "inheritable",
      "category": "engineering",
      "folder": "database-design",
      "projectSignals": ["**/schema*", "**/*sql*", "**/prisma*"],
      "priority": "standard",
      "tags": ["sql", "nosql", "modeling"]
    }
  ]
}
```

**Inheritance Process**:
1. Read `~/.alex/global-knowledge/skills/skill-registry.json`
2. Filter skills not in project's `.github/skills/`
3. Copy entire folder: `skills/{folder}/` → `.github/skills/{folder}/`
4. Add inheritance tracking to `synapses.json`

### Source 2: GK Pattern Extraction (Secondary)

Some skills are embedded in GK pattern files (e.g., `GK-book-publishing-skill.md`):

**Pattern File Structure**:
```markdown
# Book Publishing Skill

**ID**: GK-book-publishing-skill  
**Category**: documentation  
**Tags**: publishing, pdf, pandoc  
**Source**: AlexCook  
**Created**: 2026-02-04T16:05:51.785Z  

---

---
applyTo: "**/*book*,**/*publish*"
---

# Book Publishing Skill
> [Actual skill content starts here]
```

**Extraction Process**:
1. Find GK metadata block (ends at first `---\n---`)
2. Extract content after the YAML frontmatter
3. Create skill folder with extracted content
4. Add inheritance tracking

### Inheritance Tracking

Add to the inherited skill's `synapses.json`:

```json
{
  "skillId": "database-design",
  "inheritedFrom": {
    "source": "global-knowledge",
    "registryId": "database-design",
    "version": "1.0.0",
    "inheritedAt": "2026-02-11T14:30:00Z"
  },
  "connections": [...]
}
```

### Command: `Alex: Inherit Skill from Global`

**Workflow**:
```
1. Load skill-registry.json
2. Get existing project skills
3. Compute available = registry - existing
4. Show QuickPick with:
   - Skill name and description
   - Category and tags
   - projectSignals for relevance
5. User selects one or more
6. For each selected:
   a. Copy skill folder
   b. Add inheritedFrom tracking
   c. Log to output channel
7. Update `alex_docs/skills/SKILLS-CATALOG.md`
8. Show success notification
```

### Validation After Inheritance

Run `Alex: Dream (Neural Maintenance)` to validate:
- Synapse connections are valid
- No broken references
- Schema compliance

### When to Inherit vs. Create

| Inherit from Global | Create New |
|---------------------|------------|
| Skill exists in registry | Novel domain expertise |
| Standard patterns (testing, debugging) | Project-specific knowledge |
| Quick capability deployment | Deep customization needed |
| Proven, tested skills | Experimental approaches |

---

*Global Knowledge Curation: Keeping the collective memory clean and actionable*
