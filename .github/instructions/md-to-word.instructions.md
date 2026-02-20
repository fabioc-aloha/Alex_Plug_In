---
description: Markdown to Word document conversion with diagram support
applyTo: "**/*.md"
---

# Markdown to Word Conversion Instructions

## Auto-Activation Trigger

When user requests Word export (`/word`, "convert to word", "export docx", "create word document"):

1. **Use the muscle script**: `.github/muscles/md-to-word.py`
2. **Do NOT manually run pandoc** — the script handles everything

## Key Features (v2.1.0)

- **90% page coverage** — images fit both horizontally AND vertically
- **Centered images** — all diagrams centered on page
- **Smart sizing** — reads actual PNG dimensions, calculates optimal fit
- **Markdown preprocessing** — fixes bullet lists, checkboxes, spacing
- **Table formatting** — Microsoft blue headers, borders, alternating rows
- **Table pagination** — rows don't split across pages; headers stay with data

## Command

```powershell
python .github/muscles/md-to-word.py SOURCE.md [OUTPUT.docx]
```

## Sizing Algorithm

| Page Constraint | Value |
|-----------------|-------|
| Usable width | 6.5" (Letter - margins) |
| Usable height | 9.0" (Letter - margins) |
| Max image | 90% of usable = 5.85" x 8.1" |

The script:
1. Reads PNG dimensions from file header
2. Calculates scale to fit within 90% bounds
3. Applies the most constraining dimension
4. Pandoc preserves aspect ratio automatically

## Table Styling

| Element | Style |
|---------|-------|
| Header | #0078D4 (Microsoft blue), white text |
| Even rows | #F0F0F0 (light gray) |
| Odd rows | #FFFFFF (white) |
| Borders | #666666 outer, #AAAAAA inner |

## Quality Checklist

After conversion, verify:
- [ ] All Mermaid diagrams rendered as PNG
- [ ] Images centered and within page bounds
- [ ] Tables have blue headers and borders
- [ ] Tables don't break awkwardly across pages
- [ ] Bullet lists properly spaced
- [ ] Headings have consistent styling

## Troubleshooting

| Issue | Solution |
|-------|----------|
| mmdc not found | `npm install -g @mermaid-js/mermaid-cli` |
| python-docx missing | `pip install python-docx` |
| Diagrams distorted | Update to v2.0.0 (aspect ratio fix) |
| Lists merged | Update to v2.0.0 (markdown preprocessing) |
