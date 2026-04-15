---
description: "Build retrieval-augmented generation systems that ground LLMs in your data"
application: "When building RAG pipelines, vector search, or document-grounded AI"
applyTo: "**/*rag*,**/*retrieval*,**/*embedding*,**/*vector*,**/*semantic-search*"
---

# RAG Architecture

Quick-reference for RAG system design decisions. See [rag-architecture skill](.github/skills/rag-architecture/SKILL.md) for implementation details.

## When to Use RAG

| Scenario | RAG? | Alternative |
|----------|:----:|-------------|
| Private/proprietary data | ✓ | - |
| Current information needed | ✓ | - |
| Verifiable answers with citations | ✓ | - |
| Simple factual Q&A | Maybe | Fine-tuning |
| Creative generation | ✗ | Pure LLM |
| Structured data queries | ✗ | Text-to-SQL |

## Pipeline Components

```
Ingest:   Document → Chunk → Embed → Store
Retrieve: Query → Embed → Search → Rerank → Top-K
Generate: Context + Query → LLM → Grounded Answer
```

## Critical Decisions

### Chunking Strategy

| Strategy | When to Use |
|----------|-------------|
| **Recursive** (default) | Mixed content, unknown structure |
| **Semantic** | Well-structured docs with clear sections |
| **Sentence** | FAQ, short-answer content |
| **Parent retrieval** | Need context beyond matched chunk |

**Chunk sizes**: 500-1500 tokens is typical. Smaller = precise but fragmented. Larger = context-rich but noisy.

### Embedding Model Selection

| Priority | Choose |
|----------|--------|
| Best quality | `text-embedding-3-large` |
| Cost-effective | `text-embedding-3-small` |
| Privacy/local | `BGE-large` or `E5-large` |
| Azure ecosystem | Azure OpenAI embeddings |

### Vector Database Selection

| Requirement | Choose |
|-------------|--------|
| Managed + scalable | Pinecone, Weaviate |
| Azure ecosystem | Azure AI Search |
| Self-hosted + fast | Qdrant |
| Existing PostgreSQL | pgvector |
| Prototyping | Chroma, FAISS |

### Retrieval Strategy

| Scenario | Strategy |
|----------|----------|
| General use | Hybrid (vector + BM25) |
| High precision needed | Rerank top-20 → top-5 |
| Complex queries | HyDE or multi-query |
| Filtered search needed | Self-query with metadata |
| Dynamic source selection | Agentic RAG |

## Prompt Patterns

**Basic grounding**:

```text
Answer using ONLY the context below. If not found, say so.

Context: {retrieved_docs}
Question: {query}
```

**With citations**:

```text
Answer the question using the numbered sources. Cite using [1], [2], etc.

Sources:
[1] {doc1.source}: {doc1.content}
[2] {doc2.source}: {doc2.content}

Question: {query}
```

## Quality Metrics

| Metric | Target | Measures |
|--------|--------|----------|
| Recall@5 | >0.8 | Are relevant docs retrieved? |
| Faithfulness | >0.9 | Is answer grounded in sources? |
| Hallucination rate | <5% | Made-up facts |

## Anti-Patterns

| Problem | Symptom | Fix |
|---------|---------|-----|
| Chunks too large | Irrelevant context in answers | Reduce chunk size |
| Chunks too small | Fragmented, incoherent answers | Increase overlap or use parent retrieval |
| No metadata | Can't filter by date/source/topic | Add metadata during ingestion |
| Wrong K | Too much noise or missing info | Tune K empirically (start K=5) |
| Stale index | Outdated answers | Schedule re-indexing |
| Ignoring context | Hallucinations despite good retrieval | Lower temperature, strengthen prompt |
| No reranking | Mediocre precision | Add cross-encoder reranker |

## Production Checklist

- [ ] Batch embeddings (don't embed one at a time)
- [ ] Cache frequent queries
- [ ] Log retrieval quality metrics
- [ ] Monitor latency (embed + search + generate)
- [ ] Implement incremental index updates
- [ ] Handle retrieval failures gracefully
- [ ] Include source citations in responses
