# Semantic Skill Graph Implementation Plan

**Created**: 2026-02-26
**Status**: Phase 1 Ready to Start
**Owner**: Alex Cognitive Architecture
**Source Doc**: [SEMANTIC-SKILL-GRAPH.md](SEMANTIC-SKILL-GRAPH.md)

---

## Executive Summary

Replace keyword-based skill activation with vector embeddings to solve the **skill discovery degradation problem** as skill count grows beyond 100+.

| Metric | Current | Target |
|--------|---------|--------|
| Skills | 114 | 150+ |
| Activation accuracy | ~70% | 95%+ |
| Keyword table rows | 87 (manual) | 0 (automated) |
| Rework cycles per doc | 2-3 | 0 |

---

## Prerequisites

### 1. Azure OpenAI Resource

| Item | Value |
|------|-------|
| Resource name | `alex-cognitive-openai` (suggested) |
| Region | East US 2 (or nearest) |
| Model deployment | `text-embedding-3-small` |
| Dimensions | 1536 |
| Pricing tier | S0 (standard) |

**Action**: Create Azure OpenAI resource via Azure Portal or `az cognitiveservices account create`.

### 2. Secrets Manager Update

Add to `src/services/secretsManager.ts`:

```typescript
AZURE_OPENAI_ENDPOINT: 'alex.secrets.azureOpenAiEndpoint',
AZURE_OPENAI_KEY: 'alex.secrets.azureOpenAiKey',
```

**Action**: Extend `SECRETS` and `SECRET_METADATA` objects with Azure OpenAI credentials.

### 3. Test Data

Three documented failure cases for validation:

| # | Query | Expected Skills | Current Result |
|---|-------|-----------------|----------------|
| 1 | "make diagrams consistent" | markdown-mermaid + graphic-design | markdown-mermaid only |
| 2 | "convert SVG to PNG" | svg-graphics + image-conversion | svg-graphics only |
| 3 | "fix Mermaid layout issues" | markdown-mermaid + accessibility | markdown-mermaid only |

---

## Phase 1: Proof of Concept

**Timeline**: 1 week (5 working days)
**Dependency**: Azure OpenAI API key
**Output**: Standalone script + 3 JSON artifacts

### Day 1-2: Parsing & Chunking

| Task | Description | Output |
|------|-------------|--------|
| 1.1 | Create `scripts/semantic-graph/compile.ts` | Script skeleton |
| 1.2 | Parse all 114 SKILL.md files | Skill array with content |
| 1.3 | Parse all synapses.json files | Explicit edge array |
| 1.4 | Implement chunking (300-500 tokens) | ~570 chunks |

**Chunking Strategy**:
- Split by markdown headers (##, ###)
- Max 500 tokens per chunk
- Preserve section context in chunk metadata

### Day 3: Embedding Generation

| Task | Description | Output |
|------|-------------|--------|
| 1.5 | Azure OpenAI client setup | Authenticated client |
| 1.6 | Batch embed all chunks | 1536-dim vectors |
| 1.7 | Store in `skill-vectors.json` | ~2MB file |

**Cost Estimate**:
```
114 skills × 5 chunks × 300 tokens = 171,000 tokens
$0.02 / 1M tokens = $0.003 per compile
```

### Day 4: Graph Construction

| Task | Description | Output |
|------|-------------|--------|
| 1.8 | Compute cosine similarity matrix | Similarity pairs |
| 1.9 | Threshold filtering (> 0.75) | Discovered edges |
| 1.10 | Merge explicit + discovered | `skill-graph.json` |
| 1.11 | K-means clustering (k=10) | `cluster-map.json` |

### Day 5: Validation

| Task | Description | Output |
|------|-------------|--------|
| 1.12 | Build query function | `findRelevantSkills(query)` |
| 1.13 | CLI test harness | `npx ts-node query.ts "..."` |
| 1.14 | Run 3 failure cases | Pass/fail report |
| 1.15 | Document results | Phase 1 completion report |

### Phase 1 Success Criteria

- [ ] All 3 failure cases return correct skill combination
- [ ] Compilation completes in < 60 seconds
- [ ] Graph contains > 20 discovered edges
- [ ] Clusters are semantically coherent (manual review)

### Phase 1 Artifacts

```
.alex/compiled/
├── skill-vectors.json    # Chunk embeddings
├── skill-graph.json      # Nodes + edges
└── cluster-map.json      # Skill clusters
```

---

## Phase 2: Extension Integration

**Timeline**: 1 week
**Dependency**: Phase 1 validated
**Output**: Integrated skill activation

| Task | Description |
|------|-------------|
| 2.1 | Add `alex.recompileSkills` command |
| 2.2 | Integrate into Dream maintenance |
| 2.3 | Add semantic query to skill-activation |
| 2.4 | Implement staleness detection |
| 2.5 | Fallback to keyword table if unavailable |

### Integration Points

```typescript
// skillActivation.ts
async function findSkills(query: string): Promise<string[]> {
    const graph = await loadCompiledGraph();
    if (graph && !isStale(graph)) {
        return semanticQuery(query, graph);  // NEW
    }
    return keywordMatch(query);  // EXISTING fallback
}
```

---

## Phase 3: Synapse Discovery Dashboard

**Timeline**: 1 week
**Dependency**: Phase 2 complete
**Output**: TreeView + curation actions

| Task | Description |
|------|-------------|
| 3.1 | Generate `discovered-synapses.md` |
| 3.2 | TreeView of discovered connections |
| 3.3 | "Promote" action → add to synapses.json |
| 3.4 | "Dismiss" action → exclude from reports |

---

## Phase 4: Global Knowledge Integration

**Timeline**: 1 week
**Dependency**: Phase 2 complete
**Output**: Cross-project semantic search

| Task | Description |
|------|-------------|
| 4.1 | Include 33 GK-* patterns in compilation |
| 4.2 | Include 166+ GI-* insights |
| 4.3 | Cross-project query pipeline |
| 4.4 | Store global vectors in `~/.alex/compiled/` |

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Azure OpenAI unavailable | Medium | Graceful fallback to keyword table |
| False positive skills | Low | Tunable top-K threshold (start K=3) |
| Compilation cost | Negligible | < $0.01/month |
| Vector drift on model update | Low | Recompile when model changes |
| Stale graph | Low | Hash-based staleness detection |
| Over-engineering | Medium | Phase 1 is reversible (3 JSON files) |

---

## Cost Analysis

| Operation | Frequency | Tokens | Cost |
|-----------|-----------|--------|------|
| Full compile (114 skills) | Weekly | ~171K | $0.003 |
| Incremental (1 skill) | As needed | ~1.5K | $0.00003 |
| Query embedding | Per chat turn | ~50 | $0.000001 |
| **Monthly total** | 4 compiles + 500 queries | ~700K | **< $0.02** |

---

## Immediate Next Actions

1. **Create Azure OpenAI resource** with `text-embedding-3-small` deployment
2. **Update secretsManager.ts** with `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_KEY`
3. **Create script skeleton** at `scripts/semantic-graph/compile.ts`
4. **Update ROADMAP-UNIFIED.md** status to "Phase 1 in progress"

---

## Approval

- [ ] Architecture review complete
- [ ] Azure resource budget approved
- [ ] Phase 1 timeline confirmed

**Ready to proceed when Azure OpenAI resource is provisioned.**
