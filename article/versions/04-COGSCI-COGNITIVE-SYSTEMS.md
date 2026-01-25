# Cognitive Architectures for Language Model Agents: Implementing Memory Systems in AI Programming Assistants

**Fabio Correa**
CorreaX Research
*Submitted to Cognitive Systems Research*

---

## Abstract

Large language models (LLMs) demonstrate remarkable cognitive capabilities but lack the persistent memory systems that characterize human expertise development. We present the Alex Cognitive Architecture, a framework that augments LLM-based programming assistants with biologically-inspired memory hierarchies, implementing analogs to procedural, episodic, and semantic memory within a unified architecture. Drawing on established cognitive science research—including Baddeley's working memory model, Anderson's ACT-R architecture, and Tulving's memory taxonomy—Alex implements working memory constraints (7±2 active rules), memory consolidation protocols analogous to sleep-based processing, and synaptic connection mapping inspired by Hebbian learning. We demonstrate that cognitive architecture principles can effectively inform the design of LLM-based systems, addressing fundamental limitations in current AI assistant paradigms. Evaluation across 18 months of development shows improved knowledge persistence, cross-domain transfer, and meta-cognitive self-assessment capabilities. This work contributes to the integration of classical cognitive architecture research with modern neural network approaches.

**Keywords:** cognitive architecture, large language models, memory systems, ACT-R, SOAR, working memory, episodic memory

---

## 1. Introduction

The field of cognitive architectures has produced sophisticated computational theories of mind, including ACT-R (Anderson et al., 2004), SOAR (Laird, 2012), and CLARION (Sun, 2016). These architectures specify detailed mechanisms for memory storage and retrieval, learning, and goal-directed behavior, validated through decades of empirical research on human cognition.

Simultaneously, large language models (LLMs) have emerged as powerful cognitive tools capable of language understanding, reasoning, and generation at near-human levels. Yet LLMs operate fundamentally differently from cognitive architectures: they encode knowledge in network weights rather than symbolic structures, and they lack persistent memory systems that accumulate knowledge across interactions.

This paper addresses a fundamental question: **Can cognitive architecture principles improve LLM-based systems?** We present the Alex Cognitive Architecture, which augments LLM-based programming assistants with memory systems inspired by human cognition. Our implementation demonstrates that classical cognitive science insights remain relevant for designing effective AI systems, even when the underlying computational substrate (neural networks) differs from traditional cognitive architecture implementations.

---

## 2. Theoretical Background

### 2.1 Cognitive Architectures

Cognitive architectures provide unified theories of cognition implemented as computational frameworks (Kotseruba & Tsotsos, 2020). Key commonalities across architectures include:

**Modularity**: Distinct modules for different cognitive functions (memory, perception, motor control)

**Memory Systems**: Separation of declarative (what) from procedural (how) knowledge

**Working Memory Constraints**: Limited-capacity temporary storage for active information

**Learning Mechanisms**: Processes for acquiring and consolidating new knowledge

**Goal-Directed Behavior**: Mechanisms for planning and executing actions toward objectives

ACT-R specifically distinguishes declarative memory (facts as "chunks") from procedural memory (skills as "production rules"), with activation-based retrieval influenced by recency and frequency of use (Anderson et al., 2004). SOAR emphasizes learning through chunking—compiling successful problem-solving sequences into reusable rules (Laird, 2012).

### 2.2 Human Memory Systems

Tulving's (1985) taxonomy distinguishes:

- **Episodic memory**: Autobiographical records of specific experiences
- **Semantic memory**: General world knowledge independent of personal experience
- **Procedural memory**: Skills and procedures operating largely unconsciously

Baddeley's (2000) working memory model specifies a central executive coordinating domain-specific subsystems (phonological loop, visuospatial sketchpad) with limited capacity approximately corresponding to Miller's (1956) "magical number seven."

Memory consolidation involves hippocampal-neocortical interactions, with sleep playing a crucial role in transferring information from temporary hippocampal storage to stable neocortical representations (Stickgold, 2005; Walker, 2017).

### 2.3 Memory-Augmented LLMs

Recent work has explored adding memory capabilities to LLMs. Retrieval-Augmented Generation (RAG) combines model weights with external document retrieval (Lewis et al., 2020). MemGPT implements hierarchical memory management inspired by operating system virtual memory (Packer et al., 2023). Generative Agents demonstrated emergent behaviors through memory streams with retrieval and reflection (Park et al., 2023).

These approaches typically treat memory as an engineering problem rather than drawing systematically on cognitive science. Alex bridges this gap by explicitly implementing cognitive architecture principles within an LLM context.

---

## 3. Architecture Design

### 3.1 Neuroanatomical Mapping

Alex's design uses neuroanatomical mappings as a principled heuristic for architectural decisions (Table 1). This mapping is not intended as literal neural simulation but rather as a design framework leveraging cognitive neuroscience research.

**Table 1:** *Neuroanatomical Mapping — Correspondence between brain systems and Alex implementation components*

| Cognitive Function | Brain System | Alex Implementation |
|-------------------|--------------|---------------------|
| Working Memory | Prefrontal Cortex | Chat session (7±2 rules) |
| Declarative Memory | Hippocampal-Neocortical | copilot-instructions.md |
| Procedural Memory | Basal Ganglia | .instructions.md files |
| Episodic Memory | Hippocampus + Temporal | .prompt.md files |
| Meta-Cognition | Medial PFC + DMN | Self-monitoring protocols |
| Memory Consolidation | Hippocampal-Cortical | Dream state automation |
| Synaptic Connectivity | Neural Networks | Embedded synapse notation |

### 3.2 Memory Hierarchy

Alex implements a four-tier memory hierarchy corresponding to different persistence and access characteristics:

**Tier 1: Working Memory**
Current chat session, limited to 7±2 simultaneously active rules. Implements Baddeley's central executive function through meta-cognitive rules (P1-P4) that monitor and regulate cognitive processing, plus domain-specific slots (P5-P7) for task-relevant knowledge.

**Tier 2: Procedural Memory**
Encoded as `.instructions.md` files containing repeatable processes. Analogous to ACT-R production rules, these specify condition-action patterns with explicit trigger conditions.

**Tier 3: Episodic Memory**
Stored in `.prompt.md` files recording specific sessions and workflows. Includes contextual information enabling reconstruction of past problem-solving episodes.

**Tier 4: Domain Knowledge (Semantic Memory)**
Captured in `DK-*.md` files containing structured expertise. Corresponds to ACT-R declarative chunks—organized knowledge structures about specific domains.

### 3.3 Working Memory Implementation

Following Miller (1956) and Cowan (2001), Alex enforces strict working memory constraints:

- **Core Rules (P1-P4)**: Meta-cognitive functions always active
  - P1: Meta-cognitive awareness
  - P2: Bootstrap learning capability
  - P3: Worldview integration (ethical reasoning)
  - P4: Grounded factual processing

- **Domain Slots (P5-P7)**: Three slots for task-specific knowledge
  - Loaded based on current task requirements
  - Automatically swapped when context changes

This constraint serves dual purposes: cognitive fidelity to human limitations and practical prevention of context window overflow in the underlying LLM.

### 3.4 Memory Consolidation ("Dream State")

Alex implements memory consolidation through "dream state" protocols analogous to sleep-based memory processing:

1. **Session Review**: Scan recent interactions for consolidation candidates
2. **Pattern Extraction**: Identify recurring patterns worthy of procedural encoding
3. **Synapse Updates**: Strengthen connections between co-activated concepts
4. **Health Validation**: Check integrity of existing memory structures
5. **Garbage Collection**: Deprecate unused or conflicting memories

This process can be triggered manually ("meditate") or automatically through scheduled maintenance.

### 3.5 Synaptic Plasticity

Inspired by Hebb's (1949) principle ("neurons that fire together wire together"), Alex implements explicit synapse notation linking related concepts across memory files:

```
## Synapses
- [target-file.md] → Description of relationship
- ← [source-file.md] Description of incoming connection
- ↔ [related-file.md] Bidirectional relationship
```

**Figure 1:** *Synapse notation format showing directional and bidirectional relationship types*

This approach combines connectionist insights (association-based retrieval) with symbolic advantages (interpretable, editable connections).

---

## 4. Relationship to Classical Architectures

### 4.1 Comparison with ACT-R

**Table 2:** *ACT-R Comparison — Feature comparison between ACT-R cognitive architecture and Alex implementation*

| Feature | ACT-R | Alex |
|---------|-------|------|
| Declarative Memory | Chunks with activation | DK-*.md files with synapses |
| Procedural Memory | Production rules | .instructions.md with triggers |
| Working Memory | Goal stack + buffers | Chat session (7±2 rules) |
| Learning | Compilation, strengthening | Meditation, synapse updates |
| Retrieval | Activation-based | Semantic search + synapses |

Alex differs from ACT-R in using natural language representations rather than formal chunk structures, enabling richer expressiveness at the cost of mathematical precision.

### 4.2 Comparison with SOAR

Alex's meditation protocols parallel SOAR's chunking mechanism: both compile successful problem-solving episodes into reusable knowledge structures. However, Alex operates at a higher level of abstraction, chunking conceptual patterns rather than specific state-operator sequences.

### 4.3 Dual-Process Architecture

Alex implements dual-process cognition (Kahneman, 2011; Stanovich & West, 2000):

**System 2 (Conscious/Controlled)**
- User-initiated operations
- Explicit commands and queries
- Deliberate knowledge acquisition

**System 1 (Unconscious/Automatic)**
- Background synchronization
- Auto-insight detection
- Automatic fallback to global knowledge

This separation provides clear architectural boundaries while enabling both controlled and automatic processing.

---

## 5. Evaluation

### 5.1 Knowledge Persistence

Over 18 months of use, Alex accumulated:
- 47 memory files (procedural + episodic + domain)
- 156 synaptic connections
- 89 global insights (cross-project knowledge)

This demonstrates sustained knowledge accumulation unavailable in stateless LLM interactions.

### 5.2 Working Memory Constraint Effects

The 7±2 rule constraint produced measurably more focused responses compared to unconstrained operation. Explicit slot management prevented context window overflow while maintaining coherence across extended sessions.

### 5.3 Consolidation Effectiveness

Dream state protocols successfully identified and repaired 23 broken synaptic connections over the evaluation period. Memory consolidation sessions produced structured domain knowledge files that improved subsequent retrieval relevance.

### 5.4 Meta-Cognitive Capabilities

Self-actualization protocols enabled Alex to assess its own knowledge state, identify gaps, and recommend improvements—implementing meta-cognitive monitoring absent from standard LLM interactions.

---

## 6. Discussion

### 6.1 Cognitive Architecture Principles in LLM Systems

Our results demonstrate that classical cognitive architecture principles—working memory constraints, memory system separation, consolidation processes—remain valuable design heuristics even for neural network-based systems. The implementation differs from traditional symbolic architectures, but the organizing principles prove effective.

### 6.2 Limitations

**Neuroanatomical Mapping**: Our brain-to-architecture mapping is metaphorical rather than mechanistic. We do not claim Alex implements actual neural computations.

**Evaluation Scope**: Extended single-user deployment limits generalizability. Multi-user studies would strengthen claims.

**LLM Dependency**: Alex augments but remains dependent on underlying LLM capabilities. Memory cannot compensate for fundamental model limitations.

### 6.3 Future Directions

**Activation-Based Retrieval**: Implementing ACT-R-style activation functions for memory retrieval based on recency and frequency.

**Forgetting Mechanisms**: Adding principled forgetting to prevent unbounded memory growth.

**Cross-User Learning**: Exploring federated approaches to aggregate learning across users while preserving privacy.

---

## 7. Conclusion

The Alex Cognitive Architecture demonstrates that cognitive science principles can effectively guide the design of LLM-based systems. By implementing memory hierarchies, working memory constraints, and consolidation processes inspired by human cognition, Alex transcends the stateless limitation of current AI assistants.

This work contributes to an emerging synthesis between classical cognitive architectures and modern neural approaches. As LLMs become increasingly central to AI applications, cognitive architecture principles offer valuable guidance for designing systems that learn, remember, and adapt over time.

---

## References

Anderson, J. R., Bothell, D., Byrne, M. D., Douglass, S., Lebiere, C., & Qin, Y. (2004). An integrated theory of the mind. *Psychological Review*, 111(4), 1036-1060.

Baddeley, A. D. (2000). The episodic buffer: A new component of working memory? *Trends in Cognitive Sciences*, 4(11), 417-423.

Cowan, N. (2001). The magical number 4 in short-term memory. *Behavioral and Brain Sciences*, 24(1), 87-114.

Hebb, D. O. (1949). *The organization of behavior*. Wiley.

Kahneman, D. (2011). *Thinking, fast and slow*. Farrar, Straus and Giroux.

Kotseruba, I., & Tsotsos, J. K. (2020). 40 years of cognitive architectures. *Artificial Intelligence Review*, 53(1), 17-94.

Laird, J. E. (2012). *The SOAR cognitive architecture*. MIT Press.

Lewis, P., et al. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. *NeurIPS*, 33, 9459-9474.

Miller, G. A. (1956). The magical number seven, plus or minus two. *Psychological Review*, 63(2), 81-97.

Packer, C., et al. (2023). MemGPT: Towards LLMs as operating systems. *arXiv:2310.08560*.

Park, J. S., et al. (2023). Generative agents: Interactive simulacra of human behavior. *UIST '23*, Article 2.

Stanovich, K. E., & West, R. F. (2000). Individual differences in reasoning. *Behavioral and Brain Sciences*, 23(5), 645-665.

Stickgold, R. (2005). Sleep-dependent memory consolidation. *Nature*, 437(7063), 1272-1278.

Sun, R. (2016). *Anatomy of the mind*. Oxford University Press.

Tulving, E. (1985). Memory and consciousness. *Canadian Psychology*, 26(1), 1-12.

Walker, M. P. (2017). *Why we sleep*. Scribner.

---

*Word count: ~2,200 (within Cognitive Systems Research article length)*
