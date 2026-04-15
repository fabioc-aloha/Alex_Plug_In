---
description: "Markdown to Word document conversion with diagram support"
application: "When converting Markdown documents to professional Word files"
applyTo: "**/*.md"
---

# Markdown to Word — Auto-Loaded Rules

Full documentation, all options, style presets, professional features → see [md-to-word skill](../skills/md-to-word/SKILL.md).

## Quick Reference

### Trigger Phrases

User says: "convert to word", "export docx", "word document", "generate word", "md to docx"

### Basic Conversion

```bash
node .github/muscles/md-to-word.cjs SOURCE.md
```

### Common Options

| Use Case | Command |
|----------|---------|
| Basic conversion | `node md-to-word.cjs doc.md` |
| With Table of Contents | `node md-to-word.cjs doc.md --toc` |
| Professional report | `node md-to-word.cjs doc.md --style professional --toc --cover` |
| Academic paper | `node md-to-word.cjs thesis.md --style academic --toc` |
| Debug issues | `node md-to-word.cjs doc.md --debug --keep-temp` |

## Automatic Handling

The muscle script automatically:

| Feature | Automatic Action |
|---------|------------------|
| Mermaid diagrams | Rendered to PNG, sized to fit page |
| SVG images | Converted to PNG via svgexport |
| Tables | Professional styling (blue headers, borders) |
| Code blocks | Consolas font, gray background, borders |
| Links | Blue underlined hyperlinks |
| Headings | Branded colors, proper spacing |
| Page numbers | Centered footer |
| Bullet lists | Spacing fixes applied |

## Style Presets

| Preset | Best For |
|--------|----------|
| `professional` | Business docs, specs, reports |
| `academic` | Papers, dissertations, theses |
| `course` | Course materials, syllabi |
| `creative` | Blog posts, narratives |

## Quality Checklist

Before conversion:
- [ ] Markdown passes lint (`markdownlint`)
- [ ] Mermaid diagrams render in preview
- [ ] All images exist at referenced paths
- [ ] SVG files have viewBox attribute

After conversion, verify:
- [ ] All diagrams visible and properly sized
- [ ] Tables have styled headers
- [ ] Code blocks are formatted
- [ ] No content overflows page margins

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `mmdc not found` | `npm install -g @mermaid-js/mermaid-cli` |
| `svgexport not found` | `npm install -g svgexport` |
| `pandoc not found` | `winget install JohnMacFarlane.Pandoc` |
| Tables plain | Check jszip is available, set NODE_PATH |
| Images too large | Script auto-sizes; check for complex diagrams |
| Missing diagrams | Run with `--debug --keep-temp` to inspect |

## Do NOT

- ❌ Run pandoc directly — use the muscle script
- ❌ Manually size images — auto-sizing handles it
- ❌ Edit the .docx OOXML by hand — script does post-processing
- ❌ Convert SVG manually — script handles it
