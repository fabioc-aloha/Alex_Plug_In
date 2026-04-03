# 📚 Memory Systems

> How Alex stores, organizes, and retrieves knowledge

**Related**: [Cognitive Architecture](./COGNITIVE-ARCHITECTURE.md) · [Global Knowledge](./GLOBAL-KNOWLEDGE.md) · [Neuroanatomical Mapping](./NEUROANATOMICAL-MAPPING.md) · [Loading Mechanics](./LOADING-MECHANICS.md)

---

## Overview

Alex implements a **hierarchical memory system** inspired by human cognition. Different types of memory serve different purposes and have different lifespans.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d1f5ef', 'secondaryBorderColor': '#5ab5a0', 'tertiaryColor': '#ede7f6', 'tertiaryBorderColor': '#b39ddb', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart TB
    subgraph WM_LAYER["⏱️ Volatile"]
        WM["🧠 Working Memory<br/>7±2 rules | Session only"]
    end

    subgraph LOCAL_LAYER["📁 Local (Project)"]
        direction LR
        PM["📋 Procedural<br/>.instructions.md"]
        EM["📝 Episodic<br/>.prompt.md"]
        SK["🎓 Skills<br/>skills/*/SKILL.md"]
        VM["📷 Visual Memory<br/>skills/*/visual-memory/"]
    end

    subgraph GLOBAL_LAYER["🌐 Global (User)"]
        GK["🌍 Global Knowledge<br/>~/.alex/"]
    end

    subgraph CLOUD_LAYER["☁️ Cloud (Backup)"]
        GIST["📤 Private GitHub Repo<br/>Multi-machine sync"]
    end

    WM ==>|Consolidate| PM
    WM ==>|Record| EM
    WM ==>|Learn| SK
    SK -->|Embed media| VM

    PM -.->|Promote| GK
    SK -.->|Promote| GK

    GK <-->|Sync| GIST

    style WM_LAYER fill:#ffebee,stroke:#c62828
    style LOCAL_LAYER fill:#e8f5e9,stroke:#2e7d32
    style GLOBAL_LAYER fill:#e3f2fd,stroke:#1565c0
    style CLOUD_LAYER fill:#f3e5f5,stroke:#7b1fa2
```

**Figure 1:** *Memory Hierarchy — Five-tier system from volatile working memory to cloud backup, showing consolidation and promotion paths.*

---

## Working Memory

### Characteristics

**Table 1:** *Working Memory Characteristics*

| Property | Value                       |
| -------- | --------------------------- |
| Location | Chat session context        |
| Capacity | 7±2 rules (cognitive limit) |
| Lifespan | Current session only        |
| Access   | Immediate                   |

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
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d1f5ef', 'secondaryBorderColor': '#5ab5a0', 'tertiaryColor': '#ede7f6', 'tertiaryBorderColor': '#b39ddb', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart LR
    WM[Working Memory]

    WM -->|Repeated procedure| PM[Procedural Memory]
    WM -->|Session record| EM[Episodic Memory]
    WM -->|Domain expertise| SK[Skills]

    PM -->|".instructions.md"| FS[File System]
    EM -->|".prompt.md"| FS
    SK -->|"SKILL.md"| FS
```

**Figure 2:** *Memory Consolidation Flow — How working memory content is persisted to different memory types.*

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

**Table 2:** *Procedural Memory Examples*

| File                                     | Purpose                       |
| ---------------------------------------- | ----------------------------- |
| `dream-state-automation.instructions.md` | Neural maintenance protocol   |
| `release-management.instructions.md`     | How to publish releases       |
| `bootstrap-learning.instructions.md`     | Knowledge acquisition process |

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

**Table 3:** *Episodic Memory Examples*

| File                                     | Purpose                    |
| ---------------------------------------- | -------------------------- |
| `unified-meditation-protocols.prompt.md` | How to run meditation      |
| `meditation-2026-01-24.prompt.md`        | Record of a meditation     |
| `dream-report-*.md`                      | Neural maintenance reports |

---

## Skills (Domain Knowledge)

### Purpose

Stores **what Alex knows** - specialized expertise about specific topics. Skills are portable domain knowledge that can be shared across projects.

### Location

```text
.github/skills/
├── markdown-mermaid/
│   ├── SKILL.md
│   └── synapses.json
├── writing-publication/
│   ├── SKILL.md
│   └── synapses.json
├── error-recovery-patterns/
│   ├── SKILL.md
│   └── synapses.json
└── ...
```

### File Format

Each skill is a folder containing:

**SKILL.md** - The knowledge content:

```markdown
# Skill Name

> Brief description

## Overview
What this skill covers

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

**synapses.json** - Machine-readable connections (optional)

### Naming Convention

Folders use kebab-case: `skill-topic-name/`

Examples:

- `api-design/SKILL.md`
- `react-hooks/SKILL.md`
- `testing-strategies/SKILL.md`

---

## Visual Memory (Embedded Media)

### Purpose

Stores **reference media directly inside skills** as embedded data URIs — making skills fully self-sufficient with zero external path dependencies. Promoted from AlexBooks (2026-03-01).

### Three Sub-Types

**Table VM-1:** *Visual Memory Sub-Types*

| Type       | Storage                                    | Use Case                                           |
| ---------- | ------------------------------------------ | -------------------------------------------------- |
| **Visual** | Base64 JPEG in `visual-memory.json`        | Face-consistent AI portrait generation             |
| **Audio**  | WAV/MP3 file paths in `visual-memory.json` | TTS voice cloning (`chatterbox-turbo`, `qwen-tts`) |
| **Video**  | JSON prompt templates                      | Consistent motion style                            |

### Location

```text
.github/skills/
└── persona-name/
    ├── SKILL.md
    ├── synapses.json
    └── visual-memory/
        ├── index.json              ← metadata only (no data URIs)
        ├── visual-memory.json      ← full base64 data URIs
        └── subject.jpg             ← optional originals
```

### Photo Specifications

| Property              | Value                                   |
| --------------------- | --------------------------------------- |
| **Format**            | JPEG                                    |
| **Max dimension**     | 512px (longest edge)                    |
| **Quality**           | 85%                                     |
| **File size**         | 40–80 KB each                           |
| **Count per subject** | 5–8 photos                              |
| **Diversity**         | Different angles, expressions, lighting |

### Critical Generation Rule

When providing reference photos: **NEVER describe physical appearance** (hair color, eye color, skin tone, facial features). Only describe scene, clothing, expression, and action. The model reads the photos directly. Appearance descriptions conflict with the reference images and reduce consistency.

**Correct prompt anchor:**
```
"EXACTLY the person shown in the reference images"
```

### Implementation Pattern

```json
// visual-memory.json
{
  "version": "1.0",
  "subject": "Alex Finch",
  "photos": [
    {
      "id": "ref-001",
      "description": "Front-facing portrait, neutral expression",
      "dataUri": "data:image/jpeg;base64,/9j/4AAQ..."
    }
  ],
  "audioSamples": [],
  "videoTemplates": []
}
```

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
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d1f5ef', 'secondaryBorderColor': '#5ab5a0', 'tertiaryColor': '#ede7f6', 'tertiaryBorderColor': '#b39ddb', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart TD
    QUERY[Search Query]

    QUERY --> LOCAL[Search Local Memory]

    LOCAL --> PM_SEARCH[Search Procedural<br/>.instructions.md]
    LOCAL --> EM_SEARCH[Search Episodic<br/>.prompt.md]
    LOCAL --> SK_SEARCH[Search Skills<br/>SKILL.md]

    PM_SEARCH --> RESULTS{Found?}
    EM_SEARCH --> RESULTS
    SK_SEARCH --> RESULTS

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
%%{init: {'theme': 'base', 'themeVariables': {'background': '#f8f9fa', 'primaryColor': '#dbe9f6', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#6ea8d9', 'lineColor': '#6b7280', 'secondaryColor': '#d1f5ef', 'secondaryBorderColor': '#5ab5a0', 'tertiaryColor': '#ede7f6', 'tertiaryBorderColor': '#b39ddb', 'edgeLabelBackground': '#ffffff', 'fontFamily': 'Segoe UI, system-ui, sans-serif'}}}%%
flowchart LR
    subgraph "Local (Project)"
        SK[SKILL.md]
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
        GIST[Private GitHub Repo]
    end

    SK --> CMD
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
- [meditation/SKILL.md] (High, References, Forward) - "Consolidation theory"
- [meditation-session.prompt.md] (Medium, Validates, Backward) - "Session record"
```

---

## Memory Capacity Guidelines

| Memory Type      | Recommended Max   | Reason              |
| ---------------- | ----------------- | ------------------- |
| Working Memory   | 7 rules           | Cognitive limit     |
| Procedural Files | 20-30             | Keep focused        |
| Episodic Files   | Unlimited         | History is valuable |
| Skill Folders    | 10-20 per project | Avoid sprawl        |
| Global Patterns  | Unlimited         | Cross-project value |
| Global Insights  | Unlimited         | Timestamped history |

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
