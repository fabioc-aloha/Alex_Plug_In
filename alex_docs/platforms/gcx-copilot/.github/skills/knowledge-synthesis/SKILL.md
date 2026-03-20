---
name: knowledge-synthesis
description: Search, summarize, and synthesize information across documentation and code. Use when user asks to find information, summarize docs, or understand patterns across the codebase.
---

# Knowledge Synthesis

Find, organize, and synthesize information.

## Instructions

When synthesizing knowledge:

1. **Search broadly** — Check code, docs, comments, history
2. **Cross-reference** — Find related information
3. **Summarize** — Distill to key points
4. **Cite sources** — Link to original locations
5. **Identify gaps** — Note what's missing

## Operations

### Find Information
```
@workspace Where is [topic] documented?
```

### Summarize
```
@workspace Summarize how [feature] works
```

### Pattern Detection
```
@workspace How do we typically handle [pattern]?
```

### Gap Analysis
```
@workspace What documentation is missing for [component]?
```

## Response Format

```
## Summary
[Key findings in 2-3 sentences]

## Details
- [Finding 1] — Source: [link]
- [Finding 2] — Source: [link]

## Related
- [Related topic or file]

## Gaps
- [Missing information if any]
```
