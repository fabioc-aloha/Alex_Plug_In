---
name: "docx-to-md"
description: "Convert Word documents (.docx) to clean Markdown with image extraction and pandoc cleanup"
tier: extended
version: "1.0.0"
---

# Word to Markdown Conversion

> Ingest Word documents into your Markdown workflow

Convert .docx files into clean, linted Markdown with extracted images, normalized headings, and cleaned table formatting. Reverse converter for ingesting external documents.

## When to Use

- Importing Word documents from stakeholders into a Markdown-based workflow
- Converting legacy documentation to Markdown for version control
- Extracting content from .docx for further processing (presentations, email, web)
- Onboarding external resources (SOWs, RFPs, specs) into project repositories

## Key Features

| Feature | Details |
|---------|---------|
| Image extraction | Embedded images saved to `images/` folder with sequential naming |
| Pandoc cleanup | Removes escaped brackets, span classes, trailing backslashes |
| Table normalization | Aligns columns, adds proper separators |
| Heading fix | Normalizes hierarchy to start at H1 |
| Frontmatter | Optional YAML frontmatter with title and date |
| Comment stripping | Removes Word review comments |

## Usage

```bash
# Basic conversion
node .github/muscles/docx-to-md.cjs report.docx

# With frontmatter and heading normalization
node .github/muscles/docx-to-md.cjs spec.docx --add-frontmatter --fix-headings

# Strip review comments
node .github/muscles/docx-to-md.cjs reviewed.docx --strip-comments

# Custom output path
node .github/muscles/docx-to-md.cjs input.docx output/document.md

# Debug mode (keeps raw pandoc output)
node .github/muscles/docx-to-md.cjs input.docx --debug
```

## Post-Processing Pipeline

1. pandoc converts .docx to raw Markdown
2. Pandoc quirks cleaned (escaped brackets, attributes, etc.)
3. Word comments stripped (optional)
4. Heading hierarchy normalized (optional)
5. Table formatting cleaned
6. Images extracted to `images/` folder
7. YAML frontmatter generated (optional)

## Requirements

- Node.js 18+
- pandoc (`winget install pandoc`)

## Muscle Script

`.github/muscles/docx-to-md.cjs`

## Related Skills

- **md-to-word** -- Reverse direction (Markdown to Word)
- **lint-clean-markdown** -- Post-validate converted Markdown
- **md-scaffold** -- Template for structuring imported content
