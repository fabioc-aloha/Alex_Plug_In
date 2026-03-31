---
name: "md-to-html"
description: "Convert Markdown to standalone HTML pages with embedded CSS, images, and Mermaid diagrams"
tier: standard
version: "1.0.0"
---

# Markdown to HTML Conversion

> Write in Markdown, share as a polished web page

Convert Markdown documents into self-contained HTML files with embedded CSS, base64 images, and Mermaid diagram rendering. Ready for quick-share distribution, offline viewing, or print.

## When to Use

- Sharing formatted documents without requiring Word or PDF viewers
- Creating self-contained HTML pages for offline distribution
- Generating printable web pages from Markdown sources
- Quick previews of documentation with professional styling

## Key Features

| Feature | Details |
|---------|---------|
| Style presets | professional, academic, minimal, dark |
| Self-contained | All CSS embedded in `<style>` block, no external deps |
| Image embedding | Local images converted to base64 data URIs |
| Mermaid support | PNG rendering or table fallback for diagrams |
| Print-ready | CSS `@media print` rules included |
| TOC generation | Optional table of contents via `--toc` |
| Frontmatter | Extracted for title, stripped from output |

## Usage

```bash
# Basic conversion (professional style)
node .github/muscles/md-to-html.cjs report.md

# Academic style with TOC
node .github/muscles/md-to-html.cjs thesis.md --style academic --toc

# Dark mode output
node .github/muscles/md-to-html.cjs docs.md --style dark

# Mermaid diagrams rendered as PNG
node .github/muscles/md-to-html.cjs architecture.md --mermaid-png

# Custom output path
node .github/muscles/md-to-html.cjs README.md output/readme.html
```

## Style Presets

| Preset | Font | Max Width | Best For |
|--------|------|-----------|----------|
| professional | Segoe UI | 900px | Business docs, reports |
| academic | Palatino Linotype | 750px | Papers, theses |
| minimal | Inter | 800px | Clean, modern pages |
| dark | Segoe UI | 900px | Dark mode preference |

## Requirements

- Node.js 18+
- pandoc (`winget install pandoc`)
- mermaid-cli (optional, only for `--mermaid-png`)

## Muscle Script

`.github/muscles/md-to-html.cjs`

## Related Skills

- **md-to-word** -- Sister converter for Word document output
- **md-to-eml** -- Sister converter for email distribution
- **markdown-mermaid** -- Diagram authoring for embedded Mermaid
- **lint-clean-markdown** -- Pre-validate markdown before conversion
