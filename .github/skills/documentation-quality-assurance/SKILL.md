---
name: "documentation-quality-assurance"
description: "Systematic documentation audit, drift detection, preflight validation, and multi-pass quality pipelines"
metadata:
  inheritance: inheritable
---

# Documentation Quality Assurance

> Prevent documentation rot through systematic audits, automated validation, and pipeline-enforced quality gates.

**Scope**: Inheritable skill. Covers drift detection, preflight validation, count elimination, link integrity, 5-pass quality pipeline, staleness detection, and large-project organization.

**Complements**: The Documentarian agent uses this skill as its knowledge foundation. This skill is the "what" — the agent is the "who".

## The Count Problem

Hardcoded counts in documentation drift silently:

| Document Says | Reality | Impact |
|--------------|---------|--------|
| "109 skills" | 116 skills (6 added) | Undermines credibility |
| "7 agents" | 8 agents (1 added) | Users miss new capability |
| "28 instructions" | 30 instructions | Stale architecture picture |

### Count Elimination Rules

| Instead of | Write | Why |
|-----------|-------|-----|
| "Alex has 109 skills" | "Alex has N skills" (computed) | Auto-correct |
| "We support 7 agents" | "See Agent Catalog for current list" | Delegate to source |
| Inline number | Cross-reference to canonical source | Single source of truth |

### Canonical Count Sources

When a count is needed, always derive it from the file system:

| Metric | Source | Method |
|--------|--------|--------|
| Skill count | `.github/skills/` | Count subdirectories |
| Agent count | `.github/agents/` | Count `*.agent.md` files |
| Instruction count | `.github/instructions/` | Count `*.instructions.md` files |
| Prompt count | `.github/prompts/` | Count `*.prompt.md` files |
| Muscle count | `.github/muscles/` | Count script files |

## Docs-as-Architecture

Documentation is a load-bearing part of the system, not a separate artifact:

| Principle | Meaning |
|-----------|---------|
| **Docs are code** | Same review rigor as source code |
| **Docs have tests** | Preflight validation catches errors |
| **Docs have dependencies** | Cross-references create a dependency graph |
| **Docs can break** | Stale docs actively mislead users |
| **Docs need maintenance** | Schedule regular audits like code refactoring |

## 5-Pass Quality Pipeline

Run these passes in sequence on any document suite:

| Pass | Focus | Catches |
|------|-------|---------|
| 1. **Brand** | Voice, tone, naming consistency | "Copilot" vs "Alex", passive voice, jargon |
| 2. **Architecture** | Structural accuracy, counts, versions | Stale numbers, outdated diagrams |
| 3. **Cross-Reference** | Link integrity, orphan files | Broken links, unreferenced docs |
| 4. **Lint** | Formatting, markdown validity | Bad tables, broken code blocks |
| 5. **Consolidation** | Redundancy, overlap, merge candidates | Two docs covering same topic |

**Rule**: Don't merge passes — each pass has a single focus. Multi-focus reviews miss more than single-focus reviews applied sequentially.

## Preflight Validation

### Automated Checks

Run before every release or documentation change:

```powershell
# Example preflight validation script
function Test-DocQuality {
    $errors = @()
    
    # Check 1: All markdown links resolve
    Get-ChildItem -Recurse -Filter "*.md" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $links = [regex]::Matches($content, '\[([^\]]+)\]\(([^)]+)\)')
        foreach ($link in $links) {
            $target = $link.Groups[2].Value
            if ($target -notmatch '^https?://' -and $target -notmatch '^#') {
                $resolved = Join-Path (Split-Path $_.FullName) $target
                if (-not (Test-Path $resolved)) {
                    $errors += "Broken link in $($_.Name): $target"
                }
            }
        }
    }
    
    # Check 2: No orphan files in docs folder
    # Check 3: Required sections present in each doc type
    # Check 4: Version strings match package.json
    
    return $errors
}
```

### Pre-Implementation Cross-Reference Sweep

Before adding any new file, check what already references the concept:

1. Grep for the concept name across all docs
2. Identify which files will need updating
3. Create the new file AND update all references in a single commit

**Anti-pattern**: Creating a new skill/agent and updating only one reference document. Every catalog, index, and count needs updating simultaneously.

## Link Integrity

### Link Audit Protocol

| Check | How | Frequency |
|-------|-----|-----------|
| Internal links resolve | Path validation against file system | Every commit |
| Anchor links work | `#heading` matches actual heading slugs | Every commit |
| External links alive | HTTP HEAD request (batch, rate-limited) | Weekly/monthly |
| Orphan file detection | Files not referenced by any other file | Every release |
| Circular references | Graph traversal (A→B→C→A) | Quarterly |

### Orphan Detection

```powershell
# Find markdown files not referenced by any other markdown file
$allMd = Get-ChildItem -Recurse -Filter "*.md" | Select-Object -ExpandProperty Name
$referenced = @()
Get-ChildItem -Recurse -Filter "*.md" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $links = [regex]::Matches($content, '\]\(([^)]+\.md)')
    foreach ($link in $links) {
        $referenced += Split-Path $link.Groups[1].Value -Leaf
    }
}
$orphans = $allMd | Where-Object { $_ -notin $referenced }
```

## Staleness Detection

### Last Validated Dates

Add validation dates to critical documents:

```markdown
<!-- Last Validated: 2026-02-12 by Documentarian audit -->
```

### Staleness Tiers

| Tier | Threshold | Action |
|------|-----------|--------|
| Fresh | < 30 days since validation | None |
| Aging | 30-90 days | Flag for review |
| Stale | 90-180 days | Mandatory review before next release |
| Expired | > 180 days | Consider archival or major rewrite |

### Drift Detection During Maintenance

During regular maintenance cycles (meditation, dream, release prep):

1. Compare document claims against current reality
2. Flag any numeric drift (counts, versions, dates)
3. Check if referenced files still exist
4. Verify code examples still compile/execute
5. Update `Last Validated` timestamp after review

## Large Project Organization

### 15+ File Threshold

When a documentation folder exceeds 15 files, introduce numbered chapter folders:

```
docs/
├── 01-getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   └── configuration.md
├── 02-architecture/
│   ├── overview.md
│   ├── components.md
│   └── data-flow.md
├── 03-operations/
│   ├── deployment.md
│   ├── monitoring.md
│   └── troubleshooting.md
└── README.md              # Index/TOC
```

**Rules**:
- Numbered prefixes ensure consistent ordering across all tools
- Each chapter folder has 3-7 files (not 1, not 20)
- Root `README.md` serves as table of contents with links to all sections
- Flat structure is fine for < 15 files

## Multi-Audience Documentation

### Audience Matrix

Every doc suite serves multiple readers:

| Audience | Needs | Format Preference |
|----------|-------|-------------------|
| **New users** | Quick start, screenshots, examples | Tutorial (step-by-step) |
| **Experienced users** | Reference, API, configuration | Reference (lookup) |
| **Contributors** | Architecture, conventions, review process | How-to guides |
| **AI agents** | Structured data, clear rules, no ambiguity | JSON > prose, tables > paragraphs |

**Rule**: Each document should declare its audience. A document trying to serve all audiences well serves none of them well.

### Ship First, Document After (Threshold)

| Document Type | When to Write |
|--------------|---------------|
| User-facing README | Before release |
| API reference | With the API code |
| Architecture docs | When design stabilizes |
| Internal notes | After shipping (retrospective) |

**Anti-pattern**: Blocking a release to write perfect docs. Ship with minimal docs (README + quick start), then iterate.

## Doc Audit Checklist

Run this 7-item checklist for any documentation review:

| # | Check | Method |
|---|-------|--------|
| 1 | All links resolve | Automated link checker |
| 2 | No hardcoded counts | Grep for common count patterns |
| 3 | Version strings current | Compare against package.json/CHANGELOG |
| 4 | Code examples execute | Copy-paste test critical examples |
| 5 | File references exist | Verify every referenced file path |
| 6 | No orphan files | Cross-reference scan |
| 7 | Consistent terminology | Search for variant spellings/names |

## CHANGELOG Best Practices

| Practice | Why |
|----------|-----|
| One entry per user-visible change | Users scan, not read |
| Link to relevant docs/issues | Traceability |
| Group by: Added, Changed, Fixed, Removed | Consistent scan pattern |
| Version header matches `package.json` | No version drift |
| Date in ISO format (YYYY-MM-DD) | Unambiguous globally |
| Most recent version at top | Users want latest first |
