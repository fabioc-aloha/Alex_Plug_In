# 📚 Memory Systems

> How Alex stores, organizes, and retrieves knowledge

---

## Overview

Alex implements a **hierarchical memory system** inspired by human cognition. Different types of memory serve different purposes and have different lifespans.

```mermaid
graph TB
    subgraph "Memory Hierarchy"
        WM["🧠 Working Memory<br/>Current session<br/>7±2 rules"]

        subgraph "Long-Term Memory"
            subgraph "Local (Project)"
                PM["📋 Procedural<br/>.instructions.md<br/>How to do things"]
                EM["📝 Episodic<br/>.prompt.md<br/>What happened"]
                DK["🎓 Domain<br/>DK-*.md<br/>What I know"]
            end

            subgraph "Global (User)"
                GK["🌐 Global Knowledge<br/>~/.alex/<br/>Cross-project wisdom"]
            end
        end

        CLOUD["☁️ Cloud Backup<br/>GitHub Gist"]
    end

    WM -->|"Consolidation"| PM
    WM -->|"Recording"| EM
    WM -->|"Learning"| DK

    DK -->|"Promotion"| GK
    PM -->|"Promotion"| GK

    GK <-->|"Sync"| CLOUD
```

---

## Working Memory

### Characteristics

| Property | Value |
| --- | --- |
| Location | Chat session context |
| Capacity | 7±2 rules (cognitive limit) |
| Lifespan | Current session only |
| Access | Immediate |

### Structure

Working memory is divided into:

**Core Rules (P1-P4)** - Always active:

- P1: `meta-cognitive-awareness` - Self-monitoring
- P2: `bootstrap-learning` - Knowledge acquisition
- P3: `worldview-integration` - Ethical reasoning
- P4: `grounded-factual-processing` - Accuracy verification

**Domain Slots (P5-P7)** - Available for project-specific rules:

- Assigned during learning sessions
- Cleared between sessions
- Can be reallocated as needed

### Consolidation

When working memory needs to persist:

```mermaid
flowchart LR
    WM[Working Memory]

    WM -->|"Repeated procedure"| PM[Procedural Memory]
    WM -->|"Session record"| EM[Episodic Memory]
    WM -->|"Domain expertise"| DK[Domain Knowledge]

    PM -->|".instructions.md"| FS[File System]
    EM -->|".prompt.md"| FS
    DK -->|"DK-*.md"| FS
```

---

## Procedural Memory

### Purpose

Stores **how to do things** - repeatable processes, protocols, and procedures.

### Location

```
.github/instructions/
├── alex-core.instructions.md
├── bootstrap-learning.instructions.md
├── dream-state-automation.instructions.md
├── embedded-synapse.instructions.md
├── release-management.instructions.md
└── ... other procedures
```

### File Format

```markdown
# Procedure Name

## Purpose
What this procedure accomplishes

## Trigger
When to use this procedure

## Steps
1. First step
2. Second step
3. ...

## Synapses
- [related-file.md] (Strength, Type, Direction) - "Description"
```

### Examples

| File | Purpose |
| --- | --- |
| `dream-state-automation.instructions.md` | Neural maintenance protocol |
| `release-management.instructions.md` | How to publish releases |
| `bootstrap-learning.instructions.md` | Knowledge acquisition process |

---

## Episodic Memory

### Purpose

Stores **what happened** - records of sessions, events, and experiences.

### Location

```
.github/prompts/           # Active workflows
├── unified-meditation-protocols.prompt.md
├── domain-learning.prompt.md
└── ...

.github/episodic/          # Historical records
├── meditation-2026-01-24.prompt.md
├── self-actualization-2026-01-20.prompt.md
└── dream-report-2026-01-15.md
```

### File Format

```markdown
# Session Type - Date

**Timestamp**: ISO date
**Context**: What prompted this session
**Outcome**: What was achieved

## Content
Details of what happened

## Insights
Key learnings from this session

## Synapses
- [related-file.md] (Strength, Type, Direction) - "Description"
```

### Examples

| File | Purpose |
| --- | --- |
| `unified-meditation-protocols.prompt.md` | How to run meditation |
| `meditation-2026-01-24.prompt.md` | Record of a meditation |
| `dream-report-*.md` | Neural maintenance reports |

---

## Domain Knowledge

### Purpose

Stores **what Alex knows** - specialized expertise about specific topics.

### Location

```
.github/domain-knowledge/
├── DK-ADVANCED-DIAGRAMMING.md
├── DK-DOCUMENTATION-EXCELLENCE.md
├── DK-HUMAN-LEARNING-PSYCHOLOGY.md
├── DK-MEMORY-CONSOLIDATION.md
├── DK-SKILL-WISHLIST.md
└── ...
```

### File Format

```markdown
# Domain: Topic Name

**ID**: DK-TOPIC-NAME
**Category**: Category name
**Tags**: tag1, tag2, tag3

## Overview
What this domain covers

## Key Concepts
### Concept 1
Details...

### Concept 2
Details...

## Best Practices
- Practice 1
- Practice 2

## Synapses
- [related-file.md] (Strength, Type, Direction) - "Description"
```

### Naming Convention

Files follow the pattern: `DK-TOPIC-NAME.md`

Examples:

- `DK-REACT-HOOKS.md`
- `DK-API-DESIGN.md`
- `DK-TESTING-STRATEGIES.md`

---

## Global Knowledge

### Purpose

Stores **cross-project wisdom** - patterns and insights that apply anywhere.

### Location

```
~/.alex/
├── global-knowledge/
│   ├── index.json           # Knowledge index
│   ├── patterns/            # Reusable patterns (GK-*)
│   │   ├── GK-error-handling-patterns.md
│   │   └── ...
│   └── insights/            # Timestamped learnings (GI-*)
│       ├── GI-react-effect-cleanup-2026-01-24.md
│       └── ...
├── project-registry.json    # Known projects
└── sync-metadata.json       # Cloud sync state
```

### Entry Types

**Patterns (GK-*):**

- Reusable across many projects
- Not time-specific
- Example: "Error Handling Best Practices"

**Insights (GI-*):**

- Specific learning moments
- Timestamped
- Example: "React useEffect cleanup order"

### Index Structure

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-01-24T10:30:00.000Z",
  "cloudGistId": "abc123...",
  "entries": [
    {
      "id": "GK-error-handling-patterns",
      "title": "Error Handling Patterns",
      "type": "pattern",
      "category": "error-handling",
      "tags": ["try-catch", "async", "typescript"],
      "sourceProject": "my-api-project",
      "created": "2026-01-20T...",
      "modified": "2026-01-24T...",
      "summary": "Best practices for...",
      "filePath": "/Users/.../.alex/global-knowledge/patterns/GK-..."
    }
  ]
}
```

---

## Memory Search Flow

When searching for knowledge:

```mermaid
flowchart TD
    QUERY[Search Query]

    QUERY --> LOCAL[Search Local Memory]

    LOCAL --> PM_SEARCH[Search Procedural<br/>.instructions.md]
    LOCAL --> EM_SEARCH[Search Episodic<br/>.prompt.md]
    LOCAL --> DK_SEARCH[Search Domain<br/>DK-*.md]

    PM_SEARCH --> RESULTS{Found?}
    EM_SEARCH --> RESULTS
    DK_SEARCH --> RESULTS

    RESULTS -->|Yes| RETURN[Return Results]
    RESULTS -->|No| GLOBAL[Search Global Knowledge<br/>Unconscious Fallback]

    GLOBAL --> GK_SEARCH[Search ~/.alex/]
    GK_SEARCH --> GK_RESULTS{Found?}

    GK_RESULTS -->|Yes| AUGMENT[Return with<br/>Global Results]
    GK_RESULTS -->|No| EMPTY[No Results]
```

---

## Knowledge Promotion

Moving knowledge from local to global:

```mermaid
flowchart LR
    subgraph "Local (Project)"
        DK[DK-TOPIC.md]
    end

    subgraph "Promotion Process"
        CMD["@alex /promote"]
        COPY[Copy content]
        INDEX[Update index]
        SYNC[Trigger sync]
    end

    subgraph "Global (User)"
        GK[GK-topic.md]
        IDX[index.json]
    end

    subgraph "Cloud"
        GIST[GitHub Gist]
    end

    DK --> CMD
    CMD --> COPY
    COPY --> GK
    CMD --> INDEX
    INDEX --> IDX
    INDEX --> SYNC
    SYNC --> GIST
```

---

## Synapse Network

Memory files are connected via synapses:

### Synapse Format

```markdown
## Synapses

- [target-file.md] (Strength, Type, Direction) - "Description"
```

**Strength levels:** Critical, High, Medium, Low

**Relationship types:** Defines, Enables, References, Validates, Implements

**Directions:** Bidirectional, Forward, Backward

### Example

```markdown
## Synapses

- [bootstrap-learning.instructions.md] (Critical, Enables, Bidirectional) - "Learning protocol"
- [DK-MEMORY-CONSOLIDATION.md] (High, References, Forward) - "Consolidation theory"
- [meditation-session.prompt.md] (Medium, Validates, Backward) - "Session record"
```

---

## Memory Capacity Guidelines

| Memory Type | Recommended Max | Reason |
| --- | --- | --- |
| Working Memory | 7 rules | Cognitive limit |
| Procedural Files | 20-30 | Keep focused |
| Episodic Files | Unlimited | History is valuable |
| Domain Files | 10-20 per project | Avoid sprawl |
| Global Patterns | Unlimited | Cross-project value |
| Global Insights | Unlimited | Timestamped history |

---

## Maintenance

### Dream Protocol

Validates and repairs memory:

- Scans all memory files
- Checks synapse connections
- Reports broken links
- Auto-repairs when possible

### Meditation

Consolidates working memory:

- Reviews session learnings
- Creates/updates memory files
- Strengthens synapses
- Documents session

### Self-Actualization

Deep memory assessment:

- Checks version consistency
- Assesses memory balance
- Identifies gaps
- Generates recommendations

---

*Memory Systems - The Foundation of Alex's Learning*
