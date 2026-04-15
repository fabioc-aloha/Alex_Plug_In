---
description: "Scaffold properly structured Markdown files from templates for clean first-pass conversion"
application: "When creating new documents that will be converted to other formats"
applyTo: "**/*scaffold*,**/*template*.md"
---

# Markdown Scaffolding

Auto-loaded when creating new structured documents.

## Quick Reference

| Template | Command |
|----------|---------|
| Report | `node .github/muscles/md-scaffold.cjs report "Title"` |
| Tutorial | `node .github/muscles/md-scaffold.cjs tutorial "Title"` |
| Reference | `node .github/muscles/md-scaffold.cjs reference "Title"` |
| Slides | `node .github/muscles/md-scaffold.cjs slides "Title"` |
| Email | `node .github/muscles/md-scaffold.cjs email "Title"` |

## Options

| Option | Usage |
|--------|-------|
| `--output PATH` | Custom output location |
| `--list` | Show all templates |
| `--author NAME` | Set author name |
| `--force` | Overwrite existing file |

## Template Selection Guide

| Document Type | Template | Target Format |
|---------------|----------|---------------|
| Formal business document | `report` | Word, PDF |
| How-to guide | `tutorial` | HTML, Word |
| CLI/API docs | `reference` | HTML, Word |
| Presentation | `slides` | Gamma |
| Newsletter/announcement | `email` | .eml |

## Automatic Features

| Feature | Included |
|---------|----------|
| YAML frontmatter | All templates |
| Nav sentinels | All templates |
| Lint-clean output | All templates |
| Table examples | report, reference |
| Code blocks | tutorial, reference |

## Quality Checklist

### After Scaffolding

- [ ] Fill in all `{{placeholder}}` values
- [ ] Delete unused sections
- [ ] Update frontmatter metadata
- [ ] Run lint validation
- [ ] Preview before converting

## Common Patterns

| Use Case | Command |
|----------|---------|
| New project docs | `report "Project Charter"` |
| User guide | `tutorial "Getting Started"` |
| API documentation | `reference "CLI Reference"` |
| Sprint demo | `slides "Sprint Demo"` |
| Team update | `email "Weekly Update"` |

## Do NOT

- Edit frontmatter to invalid YAML syntax
- Remove nav sentinels if using nav-inject
- Skip the lint validation step
- Use for single-paragraph content (overkill)
