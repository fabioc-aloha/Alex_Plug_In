---
sem: 1
mode: agent
description: "Convert Markdown to standalone HTML with professional styling"
application: "When user needs to convert Markdown to self-contained HTML for sharing or publishing"
---

# Markdown to HTML Conversion

Convert the user's Markdown document to a self-contained HTML file.

## Context Gathering

1. **Identify the source file** - Which .md file to convert?
2. **Determine the purpose**:
   - Business/professional sharing → `--style professional`
   - Academic paper/thesis → `--style academic`
   - Modern/clean look → `--style minimal`
   - Dark mode preference → `--style dark`
3. **Check for special content**:
   - Mermaid diagrams? → Consider `--mermaid-png` for quality
   - Many sections? → Add `--toc` for navigation
   - Images? → Default embedding handles this

## Prerequisites Check

Verify pandoc is installed:

```bash
pandoc --version
```

If Mermaid PNG rendering needed:

```bash
npx mmdc --version
```

## Content Analysis

Before converting, check the source for:

- [ ] Mermaid code blocks (```mermaid)
- [ ] Local image references
- [ ] Table of contents need (5+ headings)
- [ ] Frontmatter with title

## Conversion Commands

### Standard Business Document

```bash
node .github/muscles/md-to-html.cjs "{{source}}" --style professional --toc
```

### Academic Document

```bash
node .github/muscles/md-to-html.cjs "{{source}}" --style academic --toc
```

### With High-Quality Diagrams

```bash
node .github/muscles/md-to-html.cjs "{{source}}" --style professional --mermaid-png
```

### Quick Share (Minimal)

```bash
node .github/muscles/md-to-html.cjs "{{source}}" --style minimal
```

## Post-Conversion Verification

After conversion:

1. **Check file created**: Confirm .html file exists
2. **Verify content**: Open in browser to check rendering
3. **Test print**: Use print preview for print-intended docs
4. **File size**: Large files may indicate image embedding worked

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "pandoc not found" | `winget install pandoc` |
| Mermaid shows as text | Add `--mermaid-png` or check mmdc |
| Images missing | Check source paths are relative |
| Encoding issues | Ensure source is UTF-8 |

## Response Format

After conversion, report:

```markdown
✅ Converted: {{source}} → {{output}}
- Style: {{style}}
- Features: {{features}}
- File size: {{size}}
```
