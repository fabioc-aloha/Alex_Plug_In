---
description: "Build retrieval-augmented generation systems that ground LLMs in your data"
application: "When building RAG pipelines, vector search, or document-grounded AI"
applyTo: "**/*rag*,**/*retrieval*,**/*embedding*,**/*vector*,**/*semantic-search*"
---

# RAG Architecture

## Pipeline Components

1. **Ingest**: Document → chunks → embeddings → vector store
2. **Retrieve**: Query → embedding → similarity search → top-k docs
3. **Generate**: Context + query → LLM → grounded answer

## Chunking Strategy

| Strategy | Use Case |
|----------|----------|
| **Fixed size** | Simple, works for uniform content |
| **Semantic** | Natural boundaries (paragraphs, sections) |
| **Recursive** | Hierarchical (try sentence, then paragraph) |
| **Overlap** | Context preservation at boundaries |

## Retrieval Quality

- Measure recall@k and precision@k
- Hybrid search: vector + keyword (BM25)
- Rerank top results before generation
- Cite sources for verifiability

## Anti-Patterns

- Chunks too large (irrelevant context)
- Chunks too small (lost coherence)
- No metadata (can't filter)
- Ignoring retrieval failures
