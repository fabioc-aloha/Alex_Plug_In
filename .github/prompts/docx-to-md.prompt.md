---
sem: 1
mode: agent
description: "Convert Word documents (.docx) to clean Markdown with image extraction"
application: "When user has a .docx file to convert to Markdown or needs to migrate Word content to version control"
---

# Word to Markdown Conversion

Convert the user's Word document to clean, version-control-ready Markdown.

## Context Gathering

1. **Identify the source file** - Which .docx file to convert?
2. **Check document state**:
   - Track changes resolved?
   - Embedded objects present?
3. **Determine cleanup level**:
   - Basic import → Minimal options
   - Full cleanup → All cleanup flags
4. **Output location** - Same directory or specific path?

## Prerequisites Check

Verify pandoc is installed:

```bash
pandoc --version
```

## Pre-Conversion Checklist

Before converting, advise user to:

- [ ] Open document in Word
- [ ] Accept/reject all track changes
- [ ] Remove or extract embedded objects (charts, SmartArt)
- [ ] Save and close the document

## Content Analysis

Check for potential issues:

- **Large file size** → May have many embedded images
- **Complex tables** → May need manual cleanup
- **Track changes** → Must be resolved first
- **Embedded objects** → Won't convert

## Conversion Commands

### Basic Import

```bash
node .github/muscles/docx-to-md.cjs "{{source}}"
```

### Full Cleanup (Recommended)

```bash
node .github/muscles/docx-to-md.cjs "{{source}}" --add-frontmatter --fix-headings --strip-comments
```

### Custom Output Path

```bash
node .github/muscles/docx-to-md.cjs "{{source}}" "{{output}}" --add-frontmatter --fix-headings
```

### Debug Mode

```bash
node .github/muscles/docx-to-md.cjs "{{source}}" --debug
```

## Post-Conversion Verification

After conversion:

1. **Check file created**: Confirm .md file exists
2. **Verify images**: Check images/ folder has extracted images
3. **Run lint**: `node .github/muscles/markdown-lint.cjs {{output}}`
4. **Review content**: Open in VS Code, check formatting
5. **Check tables**: Verify alignment and structure

## Image Handling

Images are extracted to `images/` folder alongside the markdown:

```
source.docx
source.md
images/
├── image1.png
├── image2.png
└── image3.jpg
```

Markdown references updated automatically:

```markdown
![](images/image1.png)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "pandoc not found" | `winget install pandoc` |
| Images missing | Check images/ folder, verify extraction |
| Tables misaligned | Manual cleanup or simplify in Word |
| Heading levels wrong | Add `--fix-headings` flag |
| Comments showing | Add `--strip-comments` flag |
| Encoding errors | Re-save .docx with UTF-8 encoding |

## Response Format

After conversion, report:

```markdown
✅ Converted: {{source}} → {{output}}
- Images extracted: {{image_count}} to images/
- Frontmatter: {{yes/no}}
- Headings normalized: {{yes/no}}
- Comments stripped: {{yes/no}}

Next steps:
1. Review the markdown for accuracy
2. Run lint validation
3. Commit to version control
```
