---
name: lint-clean-markdown
description: Write markdown that passes linting on first attempt by internalizing common rules.
tier: core
applyTo: '**/*.md,**/*markdown*,**/*lint*'
---

# Lint-Clean Markdown Skill

> Write markdown that passes linting on first attempt by internalizing common rules.

## Purpose

Eliminate the edit-lint-fix cycle by writing markdown correctly the first time. This skill encodes the most common markdown lint rules as muscle memory.

## The Golden Rule

**When in doubt: Add a blank line.**

90% of markdown lint errors are missing blank lines. Lists, code blocks, and headings all need breathing room.

## Core Rules Quick Reference

| Rule | Code | Pattern | Mnemonic |
| ---- | ---- | ------- | -------- |
| Blank lines around lists | MD032 | `\n- item\n- item\n` | "Lists breathe" |
| Blank lines around fences | MD031 | `\n```code```\n` | "Code breathes" |
| Blank line before headings | MD022 | `text\n\n## Head` | "Headers breathe" |
| Use dash for lists | MD004 | `-` not `*` or `+` | "Dash dash dash" |
| No trailing whitespace | MD009 | No spaces at line end | "Clean endings" |
| Single final newline | MD047 | One `\n` at EOF | "One newline" |
| Language on fences | MD040 | ` ```js ` not ` ``` ` | "Name your code" |
| Consistent fence style | MD046 | Use ` ``` ` not indent | "Fences only" |
| No bold as heading | MD036 | Use `##` not `**text**` | "Headers are headers" |
| Table separator spacing | MD060 | Space around pipes | "Tables breathe too" |

## Rule Details

### MD032: Blank Lines Around Lists

❌ **Wrong**: Text immediately before/after list

✅ **Correct**: Blank line before first `-` AND after last `-`

```markdown
**Why**:

- Reason one
- Reason two

**Result**: Something
```

### MD031: Blank Lines Around Code Blocks

❌ **Wrong**: Text touching the fence markers

✅ **Correct**: Blank line before opening ` ``` ` AND after closing ` ``` `

### MD022: Blank Lines Before Headings

❌ **Wrong**: `Some text.\n## Heading`

✅ **Correct**: `Some text.\n\n## Heading`

### MD004: Use Dash for Unordered Lists

❌ **Wrong**: `* item` or `+ item`

✅ **Correct**: `- item`

### MD040: Specify Language on Fenced Code

❌ **Wrong**: ` ``` ` (no language)

✅ **Correct**: ` ```javascript ` or ` ```text ` or ` ```markdown `

## Mermaid-Specific Rules

### Template Blocks Use `text`

When showing a template/pattern (not a renderable diagram), use ` ```text ` instead of ` ```mermaid `.

Why: Mermaid parser will fail on placeholder text like `[DIAGRAM_TYPE]`.

### Diagram Type Required

## Nested Code Block Problem

**You cannot nest fenced code blocks in markdown.**

When documenting code block rules (like this skill), use:

1. **Inline code** for short examples: ` ```js `
2. **Descriptions** instead of showing wrong examples
3. **Single examples** showing only the correct form

This skill itself demonstrates the solution.

## Pre-Write Mental Checklist

Before writing markdown, plan for:

1. ☐ Will I have lists? → Remember blank lines around them
2. ☐ Will I have code blocks? → Remember blank lines around them
3. ☐ Will I show "wrong" examples? → Can't nest fences, describe instead
4. ☐ Will I have tables? → Need `| ---- |` separator row
5. ☐ Will I have mermaid? → Need diagram type after init