# Global Knowledge Migration & Normalization Plan

> **Version**: 1.0
> **Created**: 2025-01-30
> **Status**: ✅ Implemented

---

## Overview

Global Knowledge (GK) entries accumulated over time can have data quality issues:
- Empty tags from bulk promotion
- Miscategorized entries
- Misleading source attribution (e.g., `Alex_Sandbox` for entries actually from promotion)
- Inconsistent formatting

This plan defines a **migration function** that normalizes GK entries **during cloud sync**, ensuring data quality without breaking backward compatibility with older Alex versions.

---

## Data Quality Issues Identified

### 1. Empty Tags

**Problem**: Bulk-promoted DK files often have empty tag arrays.

```json
{
  "id": "GK-domain-knowledge-advanced-diagramming-vi",
  "tags": [],  // ← Empty!
  "category": "documentation"
}
```

**Solution**: Auto-generate tags from:
- Title words (remove common words)
- Category name
- Content keywords

---

### 2. Miscategorized Entries

**Problem**: Entries assigned wrong categories during promotion.

| Entry Title | Current Category | Correct Category |
|-------------|------------------|------------------|
| ascii-art-alignment | error-handling | documentation |
| writing-publication | testing | documentation |
| lint-clean-markdown | performance | tooling |

**Solution**: Category mapping rules based on title/content keywords.

---

### 3. Misleading Source Attribution

**Problem**: Entries promoted via bulk scripts show `Alex_Sandbox` as source.

**Solution**:
- Map `Alex_Sandbox` → `Master Alex` for promoted skills
- Preserve specific project names for actual project insights

---

### 4. Skill-Promoted Entries

**Problem**: Entries from skill promotion lack `promotedFrom` metadata.

**Solution**: Detect skill-origin entries and add metadata.

---

## Normalization Rules

### Tag Generation

```typescript
const COMMON_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
  'that', 'these', 'those', 'it', 'its', 'domain', 'knowledge'
]);

function generateTagsFromTitle(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .split(/[\s-]+/)
    .filter(word => word.length > 2 && !COMMON_WORDS.has(word))
    .slice(0, 5);  // Max 5 auto-generated tags
}
```

### Category Mapping

```typescript
const CATEGORY_KEYWORD_MAP: Record<string, string[]> = {
  'documentation': ['writing', 'publication', 'ascii', 'art', 'diagram', 'markdown', 'lint'],
  'tooling': ['lint', 'clean', 'tool', 'build', 'script', 'automation'],
  'debugging': ['debug', 'error', 'fix', 'troubleshoot', 'issue'],
  'testing': ['test', 'spec', 'unit', 'integration', 'mock'],
  'architecture': ['architecture', 'design', 'pattern', 'structure', 'system'],
  'performance': ['performance', 'optimization', 'speed', 'cache', 'memory'],
  'security': ['security', 'auth', 'permission', 'token', 'credential'],
  'api-design': ['api', 'endpoint', 'rest', 'graphql', 'schema'],
  'deployment': ['deploy', 'release', 'publish', 'ci', 'cd', 'pipeline'],
  'refactoring': ['refactor', 'migration', 'upgrade', 'modernize', 'cleanup'],
  'patterns': ['pattern', 'practice', 'convention', 'standard', 'idiom'],
};

function inferCategory(entry: IGlobalKnowledgeEntry): GlobalKnowledgeCategory {
  const titleLower = entry.title.toLowerCase();
  const summaryLower = (entry.summary || '').toLowerCase();
  const combined = `${titleLower} ${summaryLower}`;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORD_MAP)) {
    if (keywords.some(kw => combined.includes(kw))) {
      return category as GlobalKnowledgeCategory;
    }
  }

  return entry.category;  // Keep original if no match
}
```

### Source Attribution

```typescript
function normalizeSource(entry: IGlobalKnowledgeEntry): string | undefined {
  // Map bulk-promoted sandbox entries to their true origin
  if (entry.sourceProject === 'Alex_Sandbox' &&
      entry.id.startsWith('GK-domain-knowledge-')) {
    return 'Master Alex (promoted skill)';
  }

  return entry.sourceProject;
}
```

---

## Migration Function Design

### Location

`src/chat/globalKnowledge.ts`

### Signature

```typescript
export interface IMigrationResult {
  entriesNormalized: number;
  tagsGenerated: number;
  categoriesFixed: number;
  sourcesFixed: number;
  skipped: number;
}

export async function normalizeGlobalKnowledge(): Promise<IMigrationResult>;
```

### Integration Point

Call in `cloudSync.ts` before push:

```typescript
// In pushToCloud() and syncWithCloud()
const migrationResult = await normalizeGlobalKnowledge();
logUnconscious(`Migration: ${migrationResult.entriesNormalized} normalized`);
```

---

## Backward Compatibility

### Schema Version

- Current: `1.0.0`
- After migration: `1.0.1` (minor bump, backward compatible)

### Compatibility Guarantees

1. **No field removal**: Only additions and corrections
2. **Tags array always present**: Empty → populated (older versions handle arrays)
3. **Category values unchanged**: Same enum values
4. **Optional fields remain optional**: `promotedFrom` is optional

### Version Detection

```typescript
interface IGlobalKnowledgeIndex {
  version: string;  // "1.0.0" | "1.0.1"
  schemaVersion?: string;  // Explicit schema version (new)
  // ...
}
```

---

## Implementation Steps

### Phase 1: Core Migration Function

1. Add `normalizeGlobalKnowledge()` to `globalKnowledge.ts`
2. Implement tag generation
3. Implement category inference
4. Implement source normalization
5. Update index atomically

### Phase 2: Cloud Sync Integration

1. Call migration before `pushToCloud()`
2. Call migration during `syncWithCloud()` (before push phase)
3. Log migration stats to unconscious channel
4. Bump schema version to `1.0.1`

### Phase 3: File Content Update (Optional)

1. Update markdown frontmatter in `.md` files
2. Sync index fields with file content
3. Only for entries with changes

---

## Testing Strategy

### Unit Tests

- Tag generation from various titles
- Category inference from keywords
- Source normalization rules

### Integration Tests

- Full migration on test GK
- Verify backward compatibility
- Sync cycle with migration

### Manual Validation

- Run migration on real GK
- Verify entries look correct
- Confirm old Alex versions can read

---

## Rollback Plan

If migration causes issues:

1. **Revert to backup**: GK files preserved in gist history
2. **Reset schema version**: Back to `1.0.0`
3. **Manual correction**: Fix specific problematic entries

---

## Related Files

| File | Role |
|------|------|
| `src/chat/globalKnowledge.ts` | Migration function home |
| `src/chat/cloudSync.ts` | Integration point |
| `src/shared/constants.ts` | Type definitions |
| `~/.alex/global-knowledge/alex-knowledge-index.json` | Target data |

---

*Alex Global Knowledge Migration — Data Quality Without Breaking Changes*
