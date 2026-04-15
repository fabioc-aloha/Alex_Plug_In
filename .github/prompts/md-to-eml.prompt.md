---
sem: 1
mode: agent
description: "Convert Markdown to RFC 5322 email (.eml) for newsletters and communication"
application: "When user wants to convert Markdown to email format or create newsletter content"
---

# Markdown to Email Conversion

Convert the user's Markdown document to an email-ready .eml file.

## Context Gathering

1. **Identify the source file** - Which .md file to convert?
2. **Check frontmatter** - Does it have required fields?
   - `to:` - Recipient email(s)
   - `from:` - Sender email
   - `subject:` - Email subject line
3. **Determine workflow**:
   - Testing/preview → Use `--test --test-to`
   - Production send → No test flags
4. **Check for images** - Need `--inline-images`?

## Prerequisites Check

Verify pandoc is installed:

```bash
pandoc --version
```

## Content Analysis

Before converting, check the source for:

- [ ] Valid YAML frontmatter with to/from/subject
- [ ] Subject line under 60 characters
- [ ] Mermaid diagrams (will use table fallback)
- [ ] Local images (need --inline-images)
- [ ] Email-safe content (no JS, minimal CSS reliance)

## Frontmatter Validation

Ensure source has proper frontmatter:

```yaml
---
to: recipient@example.com
from: sender@example.com
subject: Your Subject Line Here
cc: optional@example.com
reply-to: optional@example.com
---
```

## Conversion Commands

### Test Preview (Recommended First)

```bash
node .github/muscles/md-to-eml.cjs "{{source}}" --test --test-to {{user_email}}
```

### With Embedded Images

```bash
node .github/muscles/md-to-eml.cjs "{{source}}" --inline-images
```

### Production (Real Recipients)

```bash
node .github/muscles/md-to-eml.cjs "{{source}}"
```

### Debug Mode

```bash
node .github/muscles/md-to-eml.cjs "{{source}}" --debug
```

## Post-Conversion Verification

After conversion:

1. **Check file created**: Confirm .eml file exists
2. **Open in email client**: Double-click .eml to preview
3. **Verify formatting**: Check headers, body, images
4. **Test links**: Ensure hyperlinks work
5. **Check file size**: Large size may indicate image embedding

## Email Client Testing

| Client | How to Test |
|--------|-------------|
| Outlook | Double-click .eml file |
| Thunderbird | File → Open Saved Message |
| Gmail | Forward the .eml as attachment to yourself |
| Apple Mail | Double-click .eml file |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Missing frontmatter error | Add required to/from/subject |
| Images not showing | Add `--inline-images` flag |
| Formatting looks wrong | Check in different email client |
| File too large | Reduce image sizes or link instead |

## Response Format

After conversion, report:

```markdown
✅ Converted: {{source}} → {{output}}
- To: {{to}}
- From: {{from}}
- Subject: {{subject}}
- Images: {{image_count}} embedded
- File size: {{size}}

⚠️ Test with `--test` before sending to real recipients!
```
