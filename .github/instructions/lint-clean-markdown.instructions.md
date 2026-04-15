---
description: "Write markdown that passes linting on first attempt"
application: "When writing or editing markdown documentation"
applyTo: "**/*.md"
---

# Lint-Clean Markdown

Write markdown that passes linting on first attempt by internalizing common rules.

## Activation

This instruction activates on markdown files. The skill (`.github/skills/lint-clean-markdown/SKILL.md`) contains the full rule set.

## Quick Reference

### Common Lint Errors

| Rule | Fix |
|------|-----|
| MD009 (trailing spaces) | Remove trailing whitespace |
| MD010 (hard tabs) | Use spaces, not tabs |
| MD012 (multiple blank lines) | Single blank line between sections |
| MD022 (heading blank lines) | Blank line before and after headings |
| MD032 (list blank lines) | Blank line before and after lists |
| MD041 (first line heading) | Start file with `# Title` |

### Structure Rules

- **One H1 per document** (the title)
- **Blank line before/after** headings, lists, code blocks
- **No trailing spaces** on any line
- **End file with single newline**

### Code Block Rules

```markdown
<!-- Always specify language -->
```typescript
const x = 1;
```
```

### Link Rules

- Relative paths for internal: `[Guide](./docs/guide.md)`
- No bare URLs: `[Example](https://example.com)` not `https://example.com`
