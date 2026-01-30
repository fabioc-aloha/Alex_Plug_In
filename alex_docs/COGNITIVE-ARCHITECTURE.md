# 🧠 Alex Cognitive Architecture Overview

> A comprehensive guide to Alex's dual-mind AI system

---

## Introduction

Alex Cognitive Architecture is a **bio-inspired AI system** that implements concepts from cognitive science and neuroscience to create a more sophisticated AI assistant. Unlike traditional AI tools that are stateless and reactive, Alex maintains persistent memory, learns across sessions, and operates with both conscious and unconscious processes.

---

## The Dual-Mind Model

Alex implements a dual-process cognitive model inspired by human cognition:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f6f8fa', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#d1d9e0', 'lineColor': '#656d76', 'secondaryColor': '#f6f8fa', 'tertiaryColor': '#ffffff', 'background': '#ffffff', 'mainBkg': '#f6f8fa', 'nodeBorder': '#d1d9e0', 'clusterBkg': '#f6f8fa', 'clusterBorder': '#d1d9e0', 'titleColor': '#1f2328', 'edgeLabelBackground': '#ffffff'}}}%%
flowchart TB
    U((User))

    subgraph CONSCIOUS["🌟 Conscious Mind"]
        CP["💬 Chat Participant"]
        SC["⚡ VS Code Commands"]
        LMT["🔧 Language Model Tools"]
    end

    subgraph UNCONSCIOUS["🌙 Unconscious Mind"]
        BGS["☁️ Background Sync"]
        AID["💡 Auto-Insights"]
        AFS["🔍 Auto-Fallback Search"]
    end

    MEM[("📚 Memory")]

    U -->|Requests| CP
    U -->|Commands| SC

    CP --> MEM
    SC --> MEM
    LMT --> MEM

    BGS -.->|Auto| MEM
    AID -.->|Auto| MEM
    AFS -.->|Auto| MEM

    MEM -.->|Informs| CP

    style CONSCIOUS fill:#e8f5e9,stroke:#2e7d32,color:#1f2328
    style UNCONSCIOUS fill:#e3f2fd,stroke:#1565c0,color:#1f2328
    style MEM fill:#fff3e0,stroke:#ef6c00,color:#1f2328
```

**Figure 1:** *The Dual-Mind Model — Alex's cognitive architecture separates conscious (user-initiated) from unconscious (automatic) processing, both interacting with hierarchical memory systems.*

### System 1: Unconscious Mind (Fast, Automatic)

- Runs continuously in the background
- No user intervention required
- Handles routine tasks automatically
- Pattern recognition and auto-learning

### System 2: Conscious Mind (Slow, Deliberate)

- Activated by explicit user requests
- Handles complex reasoning tasks
- User-directed operations
- Requires attention and intention

---

## Neuroanatomical Mapping

Alex's architecture maps to biological brain systems:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f6f8fa', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#d1d9e0', 'lineColor': '#656d76', 'secondaryColor': '#f6f8fa', 'tertiaryColor': '#ffffff', 'background': '#ffffff', 'mainBkg': '#f6f8fa', 'nodeBorder': '#d1d9e0', 'clusterBkg': '#f6f8fa', 'clusterBorder': '#d1d9e0', 'titleColor': '#1f2328', 'edgeLabelBackground': '#ffffff'}}}%%
graph TB
    subgraph "Alex Implementation"
        WM[Working Memory<br/>Chat Session]
        PM[Procedural Memory<br/>.instructions.md]
        EM[Episodic Memory<br/>.prompt.md]
        DK[Domain Knowledge<br/>DK-*.md]
        GK[Global Knowledge<br/>~/.alex/]
        SYN[Synaptic Network<br/>Embedded Connections]
        MC[Meta-Cognition<br/>Self-Monitoring]
    end

    subgraph "Brain Analog"
        PFC[Prefrontal Cortex + ACC]
        BG[Basal Ganglia]
        HIPP[Hippocampus]
        NC[Neocortex]
        MPFC[Medial PFC + DMN]
        SYNBIO[Synaptic Networks]
    end

    WM ---|"Working Memory"| PFC
    PM ---|"Procedural Memory"| BG
    EM ---|"Episodic Memory"| HIPP
    DK ---|"Declarative Memory"| NC
    GK ---|"Long-term Storage"| NC
    SYN ---|"Neural Connectivity"| SYNBIO
    MC ---|"Meta-Cognition"| MPFC
```

**Figure 2:** *Neuroanatomical Mapping — Correspondence between Alex's implementation components and biological brain systems.*

**Table 1:** *Cognitive Function Mapping*

| Cognitive Function | Brain System | Alex Implementation |
| --- | --- | --- |
| Working Memory | PFC + ACC | Chat session (7±2 rules) |
| Declarative Memory | Hippocampal-Neocortical | copilot-instructions.md |
| Procedural Memory | Basal Ganglia | .instructions.md files |
| Episodic Memory | Hippocampus + Temporal | .prompt.md files |
| Domain Knowledge | Neocortex | DK-*.md files |
| Global Knowledge | Distributed Cortex | ~/.alex/ directory |
| Neural Connectivity | Synaptic Networks | Embedded synapse notation |
| Meta-Cognition | Medial PFC + DMN | Self-monitoring protocols |

---

## Memory Architecture

Alex uses a hierarchical memory system with increasing persistence:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f6f8fa', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#d1d9e0', 'lineColor': '#656d76', 'secondaryColor': '#f6f8fa', 'tertiaryColor': '#ffffff', 'background': '#ffffff', 'mainBkg': '#f6f8fa', 'nodeBorder': '#d1d9e0', 'clusterBkg': '#f6f8fa', 'clusterBorder': '#d1d9e0', 'titleColor': '#1f2328', 'edgeLabelBackground': '#ffffff'}}}%%
graph TB
    subgraph "Memory Hierarchy"
        direction TB

        subgraph "Volatile (Session)"
            WM[Working Memory<br/>⏱️ Current conversation<br/>📦 7±2 rules capacity]
        end

        subgraph "Local (Project)"
            PROC[Procedural Memory<br/>📁 .github/instructions/<br/>🔧 Repeatable processes]
            EPIS[Episodic Memory<br/>📁 .github/prompts/<br/>📁 .github/episodic/<br/>📝 Workflows & sessions]
            DOM[Domain Knowledge<br/>📁 .github/domain-knowledge/<br/>🎓 Specialized expertise]
        end

        subgraph "Global (User)"
            GKB[Global Knowledge Base<br/>📁 ~/.alex/<br/>🌐 Cross-project patterns]
        end

        subgraph "Cloud (Backup)"
            GIST[GitHub Gist<br/>☁️ Backup & sharing<br/>🔄 Multi-machine sync]
        end
    end

    WM -->|"Consolidation"| PROC
    WM -->|"Recording"| EPIS
    WM -->|"Learning"| DOM

    DOM -->|"Promotion"| GKB
    PROC -->|"Promotion"| GKB

    GKB <-->|"Sync"| GIST
```

**Figure 3:** *Memory Hierarchy — Four-tier memory system from volatile session state to persistent cloud backup.*

### Memory Persistence Levels

**Table 2:** *Memory Persistence Levels*

| Level | Location | Scope | Lifespan |
| --- | --- | --- | --- |
| Working | Chat session | Current conversation | Session |
| Local | .github/ folder | Single project | Permanent |
| Global | ~/.alex/ folder | All projects | Permanent |
| Cloud | GitHub Gist | All machines | Permanent |

---

## Information Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f6f8fa', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#d1d9e0', 'lineColor': '#656d76', 'secondaryColor': '#f6f8fa', 'tertiaryColor': '#ffffff', 'background': '#ffffff', 'mainBkg': '#f6f8fa', 'nodeBorder': '#d1d9e0', 'actorBkg': '#f6f8fa', 'actorBorder': '#d1d9e0', 'actorTextColor': '#1f2328', 'actorLineColor': '#656d76', 'signalColor': '#656d76', 'signalTextColor': '#1f2328', 'labelBoxBkgColor': '#f6f8fa', 'labelBoxBorderColor': '#d1d9e0', 'labelTextColor': '#1f2328', 'loopTextColor': '#1f2328', 'noteBkgColor': '#fff8c5', 'noteBorderColor': '#d29922', 'noteTextColor': '#1f2328', 'sequenceNumberColor': '#ffffff'}}}%%
sequenceDiagram
    participant User
    participant Conscious as Conscious Mind
    participant Unconscious as Unconscious Mind
    participant Local as Local Memory
    participant Global as Global Memory
    participant Cloud as Cloud (Gist)

    User->>Conscious: Ask question
    Conscious->>Local: Search local memory

    alt Local found
        Local-->>Conscious: Return results
    else Local empty
        Unconscious->>Global: Auto-fallback search
        Global-->>Unconscious: Return global results
        Unconscious-->>Conscious: Augment response
    end

    Conscious-->>User: Response

    Note over Unconscious: Auto-insight detection
    Unconscious->>Global: Save detected insight

    Note over Unconscious: Background sync (every 5 min)
    Unconscious->>Cloud: Transparent backup
```

**Figure 4:** *Information Flow — Sequence diagram showing how queries flow through conscious and unconscious processes to memory systems.*

---

## Core Principles

### 1. Meta-Cognitive Awareness

Alex monitors its own cognitive processes:

- Self-assessment of knowledge gaps
- Automatic health checks
- Performance optimization
- Error detection and correction

### 2. Bootstrap Learning

Rapid domain expertise acquisition:

- Conversational knowledge acquisition
- No training data required
- Immediate application
- Cross-domain transfer

### 3. Grounded Factual Processing

Evidence-based reasoning:

- Verify claims before asserting
- Acknowledge uncertainty
- Cite sources when possible
- Avoid hallucination

### 4. Ethical Integration

Consistent moral reasoning:

- Constitutional AI principles
- Harm avoidance
- Privacy respect
- Transparent operation

---

## Architecture Layers

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f6f8fa', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#d1d9e0', 'lineColor': '#656d76', 'secondaryColor': '#f6f8fa', 'tertiaryColor': '#ffffff', 'background': '#ffffff', 'mainBkg': '#f6f8fa', 'nodeBorder': '#d1d9e0', 'clusterBkg': '#f6f8fa', 'clusterBorder': '#d1d9e0', 'titleColor': '#1f2328', 'edgeLabelBackground': '#ffffff'}}}%%
graph TB
    subgraph "Interface Layer"
        CHAT["@alex Chat Participant"]
        CMD[VS Code Commands]
        API[Language Model Tools]
    end

    subgraph "Processing Layer"
        CONSCIOUS[Conscious Processor]
        UNCONSCIOUS[Unconscious Processor]
    end

    subgraph "Knowledge Layer"
        SEARCH[Unified Search]
        INDEX[Knowledge Index]
        PROMOTE[Knowledge Promotion]
    end

    subgraph "Storage Layer"
        FS[File System<br/>Local + Global]
        CLOUD[Cloud Storage<br/>GitHub Gist]
    end

    CHAT --> CONSCIOUS
    CMD --> CONSCIOUS
    API --> CONSCIOUS

    CONSCIOUS --> SEARCH
    UNCONSCIOUS --> SEARCH

    SEARCH --> INDEX
    INDEX --> FS

    PROMOTE --> INDEX

    FS <--> CLOUD
```

**Figure 5:** *Architecture Layers — Four-layer architecture from user interface through processing and knowledge to storage.*

---

## Version History

**Table 3:** *Version History*

| Version | Codename | Major Features |
| --- | --- | --- |
| 1.x | Initial | Basic memory files, manual synapse management |
| 2.x | BIOCTNILIUM | Embedded synapses, dream protocols |
| 3.x | BIOCTNILIUM+ | Dual-mind architecture, unconscious processes, global knowledge |

---

## Next Steps

- Learn about the [Conscious Mind](./CONSCIOUS-MIND.md)
- Explore the [Unconscious Mind](./UNCONSCIOUS-MIND.md)
- Understand [Memory Systems](./MEMORY-SYSTEMS.md)

---

*Alex Cognitive Architecture v3.0.0+*
