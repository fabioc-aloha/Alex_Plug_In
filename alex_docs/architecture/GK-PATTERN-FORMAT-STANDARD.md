# Global Knowledge Pattern Format Standard

> Standardized format for skill patterns in Global Knowledge (`~/.alex/global-knowledge/patterns/`)

---

## Current Problem

GK pattern files have inconsistent header formats that require manual extraction:

```markdown
# Book Publishing Skill

**ID**: GK-book-publishing-skill
**Category**: documentation
**Tags**: publishing, pdf, pandoc
**Source**: AlexCook
**Created**: 2026-02-04T16:05:51.785Z

---

---
applyTo: "**/*book*..."
---

# Book Publishing Skill
> [Actual skill content]
```

This requires:
1. Detecting the GK metadata block
2. Stripping it to find the skill content
3. Handling the double `---` separator

---

## Standard Format (v2)

Move ALL metadata to YAML frontmatter at the top:

```markdown
---
# GK Metadata
gkId: GK-book-publishing-skill
gkCategory: documentation
gkTags: [publishing, pdf, pandoc]
gkSource: AlexCook
gkCreated: 2026-02-04T16:05:51.785Z

# Skill Metadata (passed through on extraction)
name: "Book Publishing"
description: "End-to-end PDF book publishing pipeline"
applyTo: "**/*book*,**/*publish*,**/*pandoc*"
---

# Book Publishing Skill

> End-to-end PDF book publishing pipeline using Pandoc, LaTeX, and modern asset processing.

[Actual skill content continues...]
```

### Benefits

1. **Single parse**: Standard YAML frontmatter parsing extracts everything
2. **Clean content**: Everything after `---` is the skill file verbatim
3. **Clear separation**: `gk*` prefixed fields are GK-only, others pass through
4. **Tool-friendly**: Standard frontmatter works with existing parsers

---

## Field Reference

### GK Metadata Fields (stripped on extraction)

| Field        | Required | Description                                  |
| ------------ | -------- | -------------------------------------------- |
| `gkId`       | Yes      | Unique GK identifier (e.g., `GK-skill-name`) |
| `gkCategory` | Yes      | GK category for indexing                     |
| `gkTags`     | Yes      | Array of search tags                         |
| `gkSource`   | Yes      | Project that originated this pattern         |
| `gkCreated`  | Yes      | ISO timestamp of creation                    |
| `gkModified` | No       | ISO timestamp of last update                 |

### Skill Metadata Fields (preserved on extraction)

| Field         | Required | Description                  |
| ------------- | -------- | ---------------------------- |
| `name`        | Yes      | Human-readable skill name    |
| `description` | No       | Brief skill description      |
| `applyTo`     | Yes      | Glob patterns for activation |

---

## Extraction Process

```typescript
function extractSkillFromGKPattern(content: string): { metadata: object, skillContent: string } {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
        throw new Error('Invalid GK pattern: missing YAML frontmatter');
    }

    const yaml = parseYaml(frontmatterMatch[1]);
    const skillContent = frontmatterMatch[2];

    // Strip gk* fields, keep skill metadata
    const skillMetadata = Object.fromEntries(
        Object.entries(yaml).filter(([key]) => !key.startsWith('gk'))
    );

    // Reconstruct skill file with preserved metadata
    const skillFile = `---\n${stringifyYaml(skillMetadata)}---\n${skillContent}`;

    return { metadata: yaml, skillContent: skillFile };
}
```

---

## Migration Script

To migrate existing GK patterns to the new format:

```powershell
# Located in: scripts/migrate-gk-patterns.ps1

$patterns = Get-ChildItem ~/.alex/global-knowledge/patterns/*.md

foreach ($file in $patterns) {
    $content = Get-Content $file -Raw

    # Parse old format
    $match = $content -match '# (.*?)\n\n\*\*ID\*\*: (.*?)\s*\n\*\*Category\*\*: (.*?)\s*\n\*\*Tags\*\*: (.*?)\s*\n\*\*Source\*\*: (.*?)\s*\n\*\*Created\*\*: (.*?)\s*\n\n---\n\n([\s\S]*)'

    if ($match) {
        # Extract components and rebuild in new format
        # ... (full implementation)
    }
}
```

---

## Validation

Run during `Alex: Dream` to check GK pattern health:

```typescript
function validateGKPatternFormat(filePath: string): ValidationResult {
    const content = fs.readFileSync(filePath, 'utf8');
    const errors: string[] = [];

    // Check for YAML frontmatter
    if (!content.startsWith('---\n')) {
        errors.push('Missing YAML frontmatter');
    }

    // Parse frontmatter
    const yaml = extractFrontmatter(content);

    // Required GK fields
    const requiredGK = ['gkId', 'gkCategory', 'gkTags', 'gkSource', 'gkCreated'];
    for (const field of requiredGK) {
        if (!yaml[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    // Required skill fields
    if (!yaml.name) errors.push('Missing skill name');
    if (!yaml.applyTo) errors.push('Missing applyTo patterns');

    return { valid: errors.length === 0, errors };
}
```

---

## Timeline

| Phase | Action                                          | Target                 |
| ----- | ----------------------------------------------- | ---------------------- |
| 1     | Document standard (this file)                   | ✅ Done                 |
| 2     | Update `inheritSkill.ts` to handle both formats | Next release           |
| 3     | Create migration script                         | Next release           |
| 4     | Migrate existing patterns                       | After migration script |
| 5     | Add validation to Dream protocol                | v5.7                   |

---

*Global Knowledge Pattern Format Standard v2 — Simplifying skill extraction*
