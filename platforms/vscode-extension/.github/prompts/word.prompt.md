---
description: Convert Markdown with Mermaid diagrams to professional Word document
mode: agent
agent: Alex
---

# /word - Markdown to Word Export

Convert Markdown documents to professionally formatted Word files with perfect diagram sizing.

## What Happens

1. **Mermaid diagrams** → PNG (white background, optimal size)
2. **SVG assets** → PNG (for Word compatibility)
3. **Image sizing** → 90% page coverage (width OR height)
4. **Tables** → Microsoft blue headers, borders, alternating rows
5. **Lists** → Proper spacing (fixes merged bullets)
6. **Images** → Centered on page
7. **Pagination** → Tables don't break mid-row; headers stay with data

## Usage

```powershell
/word                         # Current file → .docx
/word docs/spec.md            # Specific file
/word README.md output.docx   # Custom output name
```

## Sizing (v2.1.0)

| Constraint | Max Size |
|------------|----------|
| Width | 5.85" (90% of 6.5") |
| Height | 8.1" (90% of 9.0") |

The script reads actual PNG dimensions and applies the most constraining limit while preserving aspect ratio.

## Output

```
📄 Converting docs/spec.md → docs/spec.docx
🔧 Preprocessing markdown...
📊 Found 3 Mermaid diagrams
   Converting diagram 1... ✓ {width=5.8in}
   Converting diagram 2... ✓ {height=8.1in}
   Converting diagram 3... ✓ {width=5.8in}
📝 Generating Word document...
🎨 Applying formatting...
✅ Done! Output: docs/spec.docx
```

## Prerequisites

```powershell
winget install pandoc
npm install -g @mermaid-js/mermaid-cli
pip install python-docx
```
