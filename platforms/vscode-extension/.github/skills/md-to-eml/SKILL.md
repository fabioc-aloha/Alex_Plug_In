---
name: "md-to-eml"
description: "Convert Markdown to RFC 5322 email (.eml) with inline CSS and CID images"
tier: extended
version: "1.0.0"
---

# Markdown to Email Conversion

> Write in Markdown, send as professional email

Convert Markdown documents with YAML frontmatter into RFC 5322-compliant `.eml` files ready for governance, newsletter, and stakeholder communication workflows.

## When to Use

- Sending formatted content via email clients (Outlook, Thunderbird, etc.)
- Newsletter or governance communication from Markdown sources
- Generating test emails for review before batch sending
- Converting documentation into distributable email format

## Key Features

| Feature | Details |
|---------|---------|
| YAML frontmatter | Maps to RFC 5322 headers (To, From, Subject, CC, Reply-To) |
| Email-safe HTML | Inline CSS with table-based layout (no `<style>` blocks) |
| Mermaid fallback | Diagrams converted to ASCII table representation (email-safe) |
| CID images | Local images embedded as base64 multipart MIME attachments |
| Emoji preservation | Subject and body emoji render correctly across clients |
| Test mode | `--test` flag overrides recipients for safe preview |

## Usage

```bash
# Basic conversion
node .github/muscles/md-to-eml.cjs newsletter.md

# With test recipient override
node .github/muscles/md-to-eml.cjs newsletter.md --test --test-to me@example.com

# Debug mode (saves intermediate HTML)
node .github/muscles/md-to-eml.cjs update.md --debug --inline-images
```

## Frontmatter Format

```yaml
---
to: team@example.com
from: sender@example.com
subject: Weekly Update
cc: manager@example.com
reply-to: sender@example.com
---
```

## Requirements

- Node.js 18+
- pandoc (for Markdown to HTML conversion)
- Shared modules: `markdown-preprocessor.cjs`, `mermaid-pipeline.cjs`

## Limitations

- Email clients cannot execute JavaScript -- Mermaid diagrams are converted to table fallbacks
- Complex CSS layouts may render differently across email clients (Outlook vs Gmail vs Apple Mail)
- Inline images add to email size -- consider linking for large image sets
