---
description: "Convert Markdown to RFC 5322 email (.eml) with inline CSS and embedded images"
application: "When converting Markdown to email format for newsletters, governance, or stakeholder communication"
applyTo: "**/*.md,**/*email*,**/*newsletter*"
---

# Markdown to Email Conversion

Auto-loaded for email conversion requests.

## Quick Reference

| Option | Usage |
|--------|-------|
| `--test` | Override recipients for safe preview |
| `--test-to EMAIL` | Custom test recipient |
| `--inline-images` | Embed images as CID attachments |
| `--debug` | Save intermediate HTML |

## Command

```bash
node .github/muscles/md-to-eml.cjs SOURCE.md [OUTPUT.eml] [options]
```

## Required Frontmatter

```yaml
---
to: recipient@example.com
from: sender@example.com
subject: Your Subject Line
cc: optional@example.com
reply-to: optional@example.com
---
```

## Automatic Handling

| Content | Behavior |
|---------|----------|
| YAML frontmatter | Mapped to RFC 5322 headers |
| Local images | CID embedded with `--inline-images` |
| Mermaid diagrams | Table fallback (no JS in email) |
| Code blocks | Monospace, gray background |
| Tables | HTML table with borders |
| Emoji | Unicode preserved |

## Quality Checklist

### Before Conversion

- [ ] Frontmatter has to, from, subject
- [ ] Subject under 60 characters
- [ ] Images are reasonably sized
- [ ] Markdown is valid

### After Conversion

- [ ] Open .eml in email client
- [ ] Check formatting renders
- [ ] Verify images display
- [ ] Test links work

## Common Patterns

| Use Case | Command |
|----------|---------|
| Test preview | `--test --test-to me@example.com` |
| With images | `--inline-images` |
| Debug issues | `--debug` |
| Production | No flags (uses frontmatter recipients) |

## Do NOT

- Use Mermaid diagrams expecting full rendering (use table fallback)
- Embed very large images (increases email size)
- Use complex CSS (clients strip it)
- Send without testing with `--test` first
