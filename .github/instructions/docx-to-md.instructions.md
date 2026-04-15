---
description: "Convert Word documents (.docx) to clean Markdown with image extraction and cleanup"
application: "When converting Word documents to Markdown for version control or further processing"
applyTo: "**/*.docx"
---

# Word to Markdown Conversion

Auto-loaded for Word document conversion requests.

## Quick Reference

| Option | Usage |
|--------|-------|
| `--add-frontmatter` | Add YAML frontmatter with title/date |
| `--fix-headings` | Normalize heading hierarchy to H1 |
| `--strip-comments` | Remove Word review comments |
| `--extract-images` | Extract to images/ folder (default) |
| `--debug` | Keep raw pandoc output |

## Command

```bash
node .github/muscles/docx-to-md.cjs SOURCE.docx [OUTPUT.md] [options]
```

## Automatic Handling

| Content | Behavior |
|---------|----------|
| Embedded images | Extracted to images/ folder |
| Escaped brackets | Cleaned automatically |
| Trailing backslashes | Removed |
| Span classes | Stripped |
| Excessive blank lines | Normalized |
| Tables | Column widths aligned |

## Quality Checklist

### Before Conversion

- [ ] Accept/reject all track changes in Word
- [ ] Remove any embedded objects (charts, SmartArt)
- [ ] Ensure document is saved as .docx (not .doc)

### After Conversion

- [ ] Run markdown lint to validate
- [ ] Check images extracted correctly
- [ ] Verify table formatting
- [ ] Review heading hierarchy
- [ ] Check for encoding issues

## Common Patterns

| Use Case | Command |
|----------|---------|
| Basic import | (no options) |
| Full cleanup | `--add-frontmatter --fix-headings --strip-comments` |
| Keep comments | `--add-frontmatter --fix-headings` |
| Debug issues | `--debug` |

## Post-Conversion

After converting, typically run:

```bash
# Validate markdown
node .github/muscles/markdown-lint.cjs output.md

# Commit to version control
git add output.md images/
git commit -m "docs: import [document name]"
```

## Do NOT

- Convert documents with unresolved track changes
- Expect embedded charts/SmartArt to convert
- Skip the lint validation step
- Forget to commit the images/ folder
