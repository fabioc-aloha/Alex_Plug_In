---
sem: 1
mode: agent
description: "Scaffold properly structured Markdown files from templates"
application: "When user needs to create a new structured Markdown document from a template"
---

# Markdown Scaffolding

Create a new structured Markdown document from a template.

## Context Gathering

1. **Document purpose** — What is the document for?
2. **Target format** — Where will it be converted? (Word, HTML, email, slides)
3. **Template selection**:
   - Formal business document → `report`
   - How-to guide → `tutorial`
   - CLI/API documentation → `reference`
   - Presentation → `slides`
   - Email/newsletter → `email`
4. **Title** — What should the document be called?
5. **Output location** — Default directory or custom path?

## Template Selection Matrix

| User Intent | Template | Notes |
|-------------|----------|-------|
| "quarterly report" | `report` | Formal structure |
| "how to guide" | `tutorial` | Step-by-step |
| "document the API" | `reference` | Commands/options |
| "presentation" | `slides` | Gamma-ready |
| "email newsletter" | `email` | RFC 5322 headers |
| "project charter" | `report` | Business document |
| "getting started" | `tutorial` | User guide |

## Scaffolding Commands

### Report

```bash
node .github/muscles/md-scaffold.cjs report "{{title}}"
```

### Tutorial

```bash
node .github/muscles/md-scaffold.cjs tutorial "{{title}}"
```

### Reference

```bash
node .github/muscles/md-scaffold.cjs reference "{{title}}"
```

### Slides

```bash
node .github/muscles/md-scaffold.cjs slides "{{title}}"
```

### Email

```bash
node .github/muscles/md-scaffold.cjs email "{{title}}"
```

### Custom Output Path

```bash
node .github/muscles/md-scaffold.cjs --output "{{path}}" {{template}} "{{title}}"
```

## Post-Scaffold Workflow

After scaffolding:

1. **Open the file** — Review generated structure
2. **Fill placeholders** — Replace `{{placeholder}}` values
3. **Delete unused sections** — Remove sections that don't apply
4. **Update frontmatter** — Adjust metadata as needed
5. **Validate** — Run lint check

```bash
node .github/muscles/markdown-lint.cjs {{output_file}}
```

## Conversion Pipeline

Typical workflow after scaffolding:

```bash
# Scaffold
node .github/muscles/md-scaffold.cjs report "Q4 Review"

# Edit...

# Convert to Word
node .github/muscles/md-to-word.cjs q4-review.md --style professional

# Or convert to HTML
node .github/muscles/md-to-html.cjs q4-review.md
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "File exists" error | Use `--force` to overwrite |
| Template not found | Run `--list` to see options |
| Invalid frontmatter | Check YAML syntax, re-scaffold |

## Response Format

After scaffolding, report:

```markdown
✅ Created: {{output_file}}

Template: {{template}}
Title: "{{title}}"

Next steps:
1. Open the file and fill in placeholders
2. Delete unused sections
3. Run lint validation
4. Convert to target format when ready
```
