---
sem: 1
description: "Convert Markdown documents to professional Word files with Mermaid diagrams and SVG images"
application: "When user needs to convert Markdown to Word document for professional sharing or printing"
mode: "agent"
tools: ["run_in_terminal", "read_file", "list_dir"]
---

# Convert Markdown to Word

Help the user convert Markdown files to professional Word documents.

## Context Gathering

First, understand what the user needs:

1. **Identify the source file(s)**
   - Ask: "Which Markdown file(s) would you like to convert?"
   - Check if file exists and is valid Markdown

2. **Determine output requirements**
   - Style preset: professional, academic, course, or creative?
   - Need Table of Contents?
   - Need cover page?
   - Specific output filename?

## Prerequisites Check

Before converting, verify dependencies:

```bash
# Check pandoc
pandoc --version

# Check mermaid-cli
npx mmdc --version

# Check svgexport (optional, for SVG files)
svgexport --version 2>$null
```

If any are missing, guide installation:
- pandoc: `winget install JohnMacFarlane.Pandoc`
- mermaid-cli: `npm install -g @mermaid-js/mermaid-cli`
- svgexport: `npm install -g svgexport`

## Content Analysis

Scan the Markdown file for:

1. **Mermaid diagrams**: Look for ` ```mermaid ` blocks
2. **SVG images**: Look for `![...](....svg)` references
3. **Tables**: Count and note complexity
4. **Code blocks**: Identify languages used
5. **Image references**: Verify all images exist

Report findings to user before conversion.

## Conversion

Run the muscle script with appropriate options:

```powershell
# Basic professional document
node .github/muscles/md-to-word.cjs $file --style professional

# Academic paper with TOC
node .github/muscles/md-to-word.cjs $file --style academic --toc

# Full report with cover and TOC
node .github/muscles/md-to-word.cjs $file --style professional --toc --cover
```

## Post-Conversion Verification

After conversion completes:

1. **Confirm output file created**: Check file size (should be > 10KB)
2. **Report what was processed**:
   - Number of Mermaid diagrams rendered
   - Number of SVG images converted
   - Number of tables styled
3. **Suggest next steps**:
   - Open in Word to verify
   - Add page breaks if needed
   - Export to PDF via Word

## Troubleshooting Guidance

If conversion fails:

| Error | Solution |
|-------|----------|
| "mmdc not found" | `npm install -g @mermaid-js/mermaid-cli` |
| "svgexport not found" | `npm install -g svgexport` |
| "pandoc not found" | `winget install JohnMacFarlane.Pandoc` |
| Mermaid syntax error | Check diagram syntax in preview first |
| SVG not found | Verify path relative to Markdown file |

For persistent issues, run with debug mode:

```powershell
node .github/muscles/md-to-word.cjs $file --debug --keep-temp
```

This saves intermediate files for inspection.

## Response Format

After successful conversion:

```
✅ Converted: {filename}.md → {filename}.docx

📊 Processed:
- {n} Mermaid diagrams → PNG
- {n} SVG images → PNG
- {n} tables → styled
- {n} code blocks → formatted

📁 Output: {full_path_to_docx}

💡 Next: Open in Word to verify, then File > Save As > PDF
```
