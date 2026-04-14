---
name: "nav-inject"
description: "Inject cross-document navigation tables into multi-file Markdown documentation suites"
tier: extended
applyTo: '**/*nav*,**/*navigation*,**/nav.json'
muscle: .github/muscles/nav-inject.cjs
---

# Navigation Injector

> One config, every file navigable -- keep multi-doc suites connected

Reads a `nav.json` config and stamps a navigation table into every `.md` file in a documentation suite. Eliminates manual navigation maintenance across multi-file document sets.

## When to Use

- Maintaining a multi-file documentation suite (governance, specs, guides)
- Need consistent cross-document navigation across all Markdown files
- Want to update navigation in one place and propagate everywhere
- Preparing document suites for Word/PDF conversion with navigation links

## How It Works

1. Define a `nav.json` with the list of documents, labels, and icons
2. Run `nav-inject.cjs` -- it finds `<!-- nav:start -->` / `<!-- nav:end -->` sentinels in each file
3. The navigation table is generated and injected between sentinels
4. Run again after adding/removing files -- only sentinel content is replaced

## Usage

```bash
# Initialize a starter nav.json
node .github/muscles/nav-inject.cjs --init

# Inject navigation into all files
node .github/muscles/nav-inject.cjs nav.json

# Preview changes without writing
node .github/muscles/nav-inject.cjs nav.json --dry-run
```

## nav.json Format

```json
{
  "title": "Project Documentation",
  "style": "table",
  "position": "top",
  "files": [
    { "path": "README.md", "label": "Overview", "icon": "📋" },
    { "path": "SETUP.md", "label": "Setup Guide", "icon": "🔧" },
    { "path": "API.md", "label": "API Reference", "icon": "📡" }
  ]
}
```

## Output Styles

| Style | Format | Best For |
|-------|--------|----------|
| `table` | Markdown table with icons and descriptions | Formal documentation suites |
| `list` | Bullet list with links | Lightweight nav headers |

## Sentinel Markers

Every target file must contain these markers (added automatically by `md-scaffold.cjs`):

```markdown
<!-- nav:start -->
<!-- nav:end -->
```

The injector replaces only the content between sentinels, preserving all other content.
