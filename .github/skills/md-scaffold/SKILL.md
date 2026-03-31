---
name: "md-scaffold"
description: "Scaffold properly structured Markdown files from templates for clean first-pass conversion"
tier: extended
version: "1.0.0"
---

# Markdown Scaffolder

> Start right, convert clean -- templates that work with every converter

Generate properly structured Markdown files from battle-tested templates. Each template includes correct frontmatter, extended syntax examples, converter directives, and navigation sentinels so documents convert cleanly on first pass.

## When to Use

- Starting a new document that will be converted to Word, PDF, or email
- Need a consistent structure for reports, tutorials, or reference guides
- Want converter-ready Markdown with correct frontmatter from the start
- Creating Gamma-ready slide decks from Markdown

## Available Templates

| Template | Purpose | Includes |
|----------|---------|----------|
| `report` | Formal report with TOC | Executive summary, sections, appendix, tables |
| `tutorial` | Step-by-step guide | Prerequisites, learning objectives, exercises |
| `reference` | CLI/API reference | Commands, parameters, examples |
| `slides` | Gamma-ready presentation | H2 slide breaks, speaker notes format |
| `email` | Newsletter/governance email | YAML frontmatter for RFC 5322 headers |

## Usage

```bash
# Create a report
node .github/muscles/md-scaffold.cjs report "Quarterly Review"

# Create a tutorial with custom output path
node .github/muscles/md-scaffold.cjs --output docs/guide.md tutorial "Getting Started"

# List available templates
node .github/muscles/md-scaffold.cjs --list
```

## Template Design Principles

1. **Converter-ready**: Every template produces Markdown that passes `markdown-lint.cjs` on first run
2. **Navigation sentinels**: `<!-- nav:start -->` / `<!-- nav:end -->` markers for `nav-inject.cjs`
3. **Frontmatter included**: Correct YAML frontmatter for the target converter
4. **Extended syntax**: Callouts, kbd shortcuts, highlights, and other extended Markdown features
5. **Minimal editing**: Fill in content, delete unused sections -- ready to convert
