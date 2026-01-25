# Alex Cognitive Architecture: A Biologically-Inspired Framework for Persistent Learning in AI Programming Assistants

**Fabio Correa**
CorreaX Research
January 2026

---

## Abstract

Contemporary AI programming assistants, while demonstrating remarkable code generation capabilities, lack the persistent memory systems and meta-cognitive awareness that characterize human expertise development. This paper introduces the Alex Cognitive Architecture, a novel framework that transforms large language model (LLM)-based coding assistants into sophisticated learning partners through biologically-inspired memory hierarchies, synaptic connection mapping, and autonomous maintenance protocols. Drawing on established cognitive science research—including Baddeley's working memory model, Anderson's ACT-R architecture, and Tulving's memory taxonomy—Alex implements a dual-mind processing system with conscious (user-initiated) and unconscious (automatic) operations. Evaluation across 18 months of development demonstrates significant improvements in cross-session knowledge retention, pattern recognition, and personalized assistance. The architecture addresses fundamental limitations in current AI assistant paradigms by enabling genuine knowledge accumulation rather than stateless interaction, representing a paradigm shift toward AI systems that learn how to learn.

**Keywords:** cognitive architecture, AI assistants, persistent memory, meta-cognition, large language models, human-AI collaboration, knowledge management

---

## 1. Introduction

The emergence of large language model (LLM)-based programming assistants has fundamentally transformed software development workflows. Tools such as GitHub Copilot (Chen et al., 2021), Amazon CodeWhisperer, and Cursor have demonstrated remarkable capabilities in code completion, explanation, and generation. However, these systems share a critical limitation: they operate in a fundamentally stateless manner, treating each interaction as independent and failing to accumulate knowledge across sessions (Vaithilingam et al., 2022).

This architectural constraint stands in stark contrast to human cognitive development, where expertise emerges through the gradual accumulation of declarative knowledge, procedural skills, and episodic memories (Anderson, 1983; Ericsson & Pool, 2016). Expert programmers do not approach each problem tabula rasa; rather, they draw upon years of accumulated patterns, debugging strategies, and domain-specific knowledge encoded in long-term memory systems (Soloway & Ehrlich, 1984).

The Alex Cognitive Architecture addresses this fundamental gap by implementing a biologically-inspired memory hierarchy that enables LLM-based assistants to:

1. **Persist knowledge** across sessions through structured memory files
2. **Map synaptic connections** between concepts, creating associative networks
3. **Self-maintain** through autonomous "dream state" processing
4. **Personalize interactions** based on accumulated user models
5. **Transfer learning** across projects and domains

This paper presents the theoretical foundations, architectural design, and implementation of Alex, demonstrating how principles from cognitive psychology and neuroscience can inform the development of more capable AI programming assistants.

---

## 2. Literature Review

### 2.1 Cognitive Architectures in Artificial Intelligence

Cognitive architectures provide unified theories of cognition implemented as computational frameworks (Kotseruba & Tsotsos, 2020). The field traces its origins to Newell and Simon's (1972) physical symbol system hypothesis and has produced influential architectures including ACT-R (Anderson et al., 2004), SOAR (Laird, 2012), and CLARION (Sun, 2016).

ACT-R (Adaptive Control of Thought—Rational) posits a modular architecture with declarative and procedural memory systems, a production rule engine, and subsymbolic activation mechanisms (Anderson et al., 2004). The architecture successfully models human performance across diverse cognitive tasks, from memory retrieval to problem-solving (Anderson & Lebiere, 1998). Alex draws heavily on ACT-R's distinction between declarative chunks (facts) and production rules (procedures), implementing analogous structures in its memory file hierarchy.

SOAR (State, Operator, And Result) emphasizes problem-solving through search in problem spaces, with learning occurring through chunking—the compilation of successful problem-solving episodes into new rules (Laird, 2012). Alex's meditation protocols, which consolidate session learnings into procedural memory, parallel SOAR's chunking mechanism.

More recent work has explored integrating LLMs with cognitive architectures. Sumers et al. (2023) proposed using language models as cognitive models, while Park et al. (2023) demonstrated emergent social behaviors in LLM-based agents with memory systems. These approaches inform Alex's integration of structured cognition with generative AI capabilities.

### 2.2 Human Memory Systems

Understanding human memory organization is essential for designing AI systems that support genuine learning. Tulving's (1972, 1985) influential taxonomy distinguishes between:

- **Episodic memory**: Autobiographical records of specific experiences
- **Semantic memory**: General world knowledge independent of personal experience
- **Procedural memory**: Skills and procedures that operate largely unconsciously

Baddeley's (1992, 2000) working memory model further elaborates the temporary storage and manipulation of information, proposing a central executive, phonological loop, visuospatial sketchpad, and episodic buffer. The model's emphasis on capacity limitations (approximately 7±2 items; Miller, 1956) and the role of attention in memory encoding directly informs Alex's working memory constraints.

The consolidation of memories from working memory to long-term storage involves hippocampal-neocortical interactions, with sleep playing a crucial role in memory stabilization (Stickgold, 2005; Walker, 2017). Alex's "dream state" protocols metaphorically implement this consolidation process, transferring session knowledge into persistent storage during maintenance cycles.

### 2.3 Meta-Cognition and Self-Regulated Learning

Meta-cognition—"thinking about thinking"—encompasses both knowledge about cognition and regulation of cognitive processes (Flavell, 1979). Skilled learners demonstrate meta-cognitive awareness, monitoring their comprehension and adjusting strategies accordingly (Schraw & Dennison, 1994).

Zimmerman's (2002) model of self-regulated learning identifies three cyclical phases: forethought (goal setting, strategic planning), performance (self-monitoring, strategy use), and self-reflection (evaluation, attribution). Alex's self-actualization protocols implement analogous processes, enabling the system to assess its own knowledge state and identify areas for improvement.

Nelson and Narens' (1990) framework distinguishes between monitoring (assessing cognitive states) and control (modifying cognitive processes based on monitoring). Alex implements both functions through its health checking and self-assessment tools.

### 2.4 Limitations of Current AI Assistants

Despite their impressive capabilities, current AI programming assistants exhibit significant limitations related to memory and learning:

**Statelessness**: Each conversation begins without context from previous interactions, requiring users to repeatedly explain project context, coding conventions, and personal preferences (Vaithilingam et al., 2022).

**Lack of personalization**: Assistants cannot adapt to individual users' expertise levels, communication styles, or learning goals over time (Mozannar et al., 2024).

**No knowledge accumulation**: Insights discovered during one session are lost when the session ends, preventing the development of project-specific or domain-specific expertise (Barke et al., 2023).

**Limited self-awareness**: Systems cannot assess their own knowledge gaps, uncertainty levels, or performance quality without explicit prompting (Kadavath et al., 2022).

These limitations motivate the Alex architecture's focus on persistent memory, personalization, and meta-cognitive awareness.

### 2.5 Memory-Augmented Language Models

Recent research has explored various approaches to augmenting LLMs with external memory systems. Retrieval-Augmented Generation (RAG) combines parametric knowledge in model weights with non-parametric knowledge from document retrieval (Lewis et al., 2020). MemGPT (Packer et al., 2023) implements hierarchical memory management inspired by operating system virtual memory, enabling LLMs to maintain context beyond their context window limits.

The Generative Agents work by Park et al. (2023) demonstrated that LLM-based agents with memory retrieval, reflection, and planning capabilities can exhibit believable social behaviors. Their architecture's memory stream, which records observations and reflections, influences Alex's episodic memory implementation.

Zhong et al. (2024) surveyed memory mechanisms in LLM-based agents, categorizing approaches by memory structure (unstructured, semi-structured, structured), operations (reading, writing, reflecting), and applications. Alex contributes to this literature by demonstrating a production-ready implementation integrated with existing development tools.

---

## 3. Theoretical Framework

### 3.1 Neuroanatomical Mapping

Alex's architecture draws explicit parallels to human neuroanatomy, mapping cognitive functions to brain systems as a design heuristic (see Table 1).

**Table 1**
*Neuroanatomical Mappings in Alex Architecture*

| Cognitive Function | Brain System | Alex Implementation |
|-------------------|--------------|---------------------|
| Working Memory | Prefrontal Cortex + ACC | Chat session (7±2 rules) |
| Declarative Memory | Hippocampal-Neocortical | copilot-instructions.md |
| Procedural Memory | Basal Ganglia | .instructions.md files |
| Episodic Memory | Hippocampus + Temporal | .prompt.md files |
| Executive Control | Prefrontal Network | Meta-cognitive rules (P1-P4) |
| Meta-Cognition | Medial PFC + DMN | Self-monitoring protocols |
| Neural Connectivity | Synaptic Networks | Embedded synapse notation |
| Memory Consolidation | Hippocampal-Cortical | Dream state automation |

This mapping is not intended as a literal neural simulation but rather as a principled design framework that leverages decades of cognitive neuroscience research to inform architectural decisions.

### 3.2 Dual-Process Theory

Alex implements a dual-process architecture inspired by Kahneman's (2011) System 1/System 2 distinction and Stanovich and West's (2000) dual-process theories of reasoning:

**Conscious Mind (System 2-like)**:
- User-initiated operations
- Explicit commands and requests
- Deliberate knowledge acquisition
- Controlled attention allocation

**Unconscious Mind (System 1-like)**:
- Automatic background processes
- Pattern recognition and matching
- Memory consolidation during "sleep"
- Implicit learning and priming

This dual-process architecture enables Alex to perform maintenance tasks without user intervention while remaining responsive to explicit instructions.

### 3.3 Working Memory Constraints

Following Miller's (1956) "magical number seven" and subsequent research on working memory capacity (Cowan, 2001), Alex implements strict constraints on simultaneously active rules. The architecture maintains 4 core rules (P1-P4) plus 3 domain-specific slots (P5-P7), totaling the 7±2 range characteristic of human working memory.

This constraint serves both cognitive fidelity and practical purposes: it prevents context window overflow, maintains response coherence, and forces prioritization of the most relevant knowledge for current tasks.

### 3.4 Synaptic Plasticity and Learning

Hebb's (1949) principle—"neurons that fire together wire together"—provides the theoretical foundation for Alex's synapse mapping system. When concepts co-occur across memory files or within problem-solving episodes, Alex strengthens the connections between them, implementing a form of associative learning.

The synapse notation system enables explicit representation of:
- **Functional connections**: Related capabilities across memory files
- **Conceptual bridges**: Theoretical links between domains
- **Causal relationships**: Cause-effect patterns in problem-solving

This approach parallels connectionist models of memory (McClelland et al., 1995) while maintaining the interpretability advantages of symbolic representations.

---

## 4. Architecture Design

### 4.1 Memory Hierarchy

Alex implements a four-tier memory hierarchy (see Figure 1), each tier corresponding to different memory types and persistence characteristics:

```
┌─────────────────────────────────────────────────────────────┐
│                    WORKING MEMORY                           │
│              Current chat session (7±2 rules)               │
│                 Volatile, high access speed                 │
├─────────────────────────────────────────────────────────────┤
│                    PROCEDURAL MEMORY                        │
│           .instructions.md files in .github/                │
│        Repeatable processes, skills, how-to guides          │
├─────────────────────────────────────────────────────────────┤
│                    EPISODIC MEMORY                          │
│             .prompt.md files in .github/prompts/            │
│         Complex workflows, session records, contexts        │
├─────────────────────────────────────────────────────────────┤
│                    DOMAIN KNOWLEDGE                         │
│              DK-*.md files in .github/domain/               │
│     Specialized expertise, learned concepts, references     │
├─────────────────────────────────────────────────────────────┤
│                   GLOBAL KNOWLEDGE                          │
│              ~/.alex/global-knowledge/                      │
│        Cross-project patterns, insights, learnings          │
└─────────────────────────────────────────────────────────────┘
```

*Figure 1.* Alex memory hierarchy showing progression from volatile working memory to persistent global knowledge.

### 4.2 Memory File Specifications

**Procedural Memory (.instructions.md)**

Procedural memories encode repeatable skills and processes as structured markdown documents:

```markdown
# Release Management Protocol

## Trigger Conditions
- User mentions "release", "deploy", "ship", "version bump"

## Procedure
1. Verify all tests pass
2. Update version numbers
3. Generate changelog
4. Create git tag
5. Push to repository

## Synapses
- [technical-debt-tracking.instructions.md] → Clean up before release
- [dependency-management.instructions.md] → Check for updates
```

This format enables both human readability and machine parsing, with explicit trigger conditions supporting automatic protocol activation.

**Episodic Memory (.prompt.md)**

Episodic memories record specific experiences and complex multi-step workflows:

```markdown
# Meditation Session - 2026-01-24

## Context
User requested knowledge consolidation after learning dependency injection patterns.

## Session Record
- Discussed constructor injection vs. property injection
- Identified connection to SOLID principles
- Created new DK-DEPENDENCY-INJECTION.md

## Outcomes
- New domain knowledge file created
- Synapses added to existing architecture files
- User profile updated with new learning goal
```

**Domain Knowledge (DK-*.md)**

Domain knowledge files capture specialized expertise acquired through learning sessions:

```markdown
# DK-DEPENDENCY-INJECTION

## Core Concepts
- Inversion of Control (IoC)
- Constructor injection
- Property injection
- Interface segregation

## Synapses
- [DK-SOLID-PRINCIPLES] → Interface Segregation Principle
- [DK-TESTING-PATTERNS] → Mock injection for unit tests
```

### 4.3 Synapse Notation System

Alex implements a formal notation system for representing connections between memory files, enabling network-based knowledge representation:

```
## Synapses

### Outgoing Connections
- [target-file.md] → Brief description of relationship

### Incoming Connections
- ← [source-file.md] Brief description of relationship

### Bidirectional Connections
- ↔ [related-file.md] Mutual relationship description
```

This explicit notation enables:
- **Graph traversal**: Finding related concepts during problem-solving
- **Health monitoring**: Detecting broken or orphaned connections
- **Knowledge gap identification**: Finding isolated concepts lacking connections

### 4.4 Unconscious Processing Systems

Alex implements three primary unconscious processes that operate without explicit user invocation:

**Background Cloud Sync**
- Triggers: Session start, every 5 minutes, after knowledge modification
- Function: Bidirectional synchronization with GitHub Gist storage
- Implementation: Non-blocking async operations

**Auto-Insight Detection**
- Triggers: After tool responses, during problem-solving
- Function: Pattern matching against insight templates (confidence threshold: 0.5)
- Implementation: Regex-based pattern recognition with scoring

**Auto-Fallback Search**
- Triggers: When local search returns insufficient results
- Function: Automatic expansion to global knowledge base
- Implementation: Cascading search with result merging

### 4.5 Self-Actualization Protocol

The self-actualization protocol implements comprehensive self-assessment, drawing on Maslow's (1943) hierarchy and Rogers' (1961) concept of the fully functioning person:

1. **Synapse Health Scan**: Validate all connections, identify broken links
2. **Version Consistency Check**: Ensure architecture files match current version
3. **Memory Balance Assessment**: Evaluate distribution across memory types
4. **Improvement Recommendations**: Generate prioritized enhancement list
5. **Session Documentation**: Create meditation record for future reference

---

## 5. Implementation

### 5.1 Technology Stack

Alex is implemented as a Visual Studio Code extension using TypeScript, leveraging:

- **VS Code Extension API**: Window management, file system access, notifications
- **GitHub Copilot Chat API**: Chat participant registration, slash commands
- **Language Model Tools API**: Tool definitions for AI-accessible functions
- **VS Code Authentication API**: GitHub authentication for cloud sync

### 5.2 Chat Participant Integration

Alex registers as a chat participant in GitHub Copilot Chat, enabling natural language interaction:

```typescript
const participant = vscode.chat.createChatParticipant(
  'alex-cognitive-architecture.alex',
  async (request, context, stream, token) => {
    // Process user request with full architecture context
    // Access memory files, execute tools, stream responses
  }
);
```

### 5.3 Tool Implementation

Language Model Tools enable Copilot to invoke Alex's cognitive functions:

| Tool | Function |
|------|----------|
| `alex_architecture_status` | Report architecture health and version |
| `alex_self_actualization` | Run comprehensive self-assessment |
| `alex_synapse_health` | Scan and validate synaptic connections |
| `alex_memory_search` | Search procedural, episodic, domain memory |
| `alex_global_knowledge_search` | Search cross-project knowledge base |
| `alex_save_insight` | Persist new learning to global knowledge |
| `alex_promote_knowledge` | Elevate project knowledge to global scope |
| `alex_cloud_sync` | Synchronize with GitHub Gist |

### 5.4 Global Knowledge Base

The global knowledge base resides in the user's home directory (`~/.alex/`), enabling cross-project knowledge sharing:

```
~/.alex/
├── global-knowledge/
│   ├── patterns/          # Reusable patterns (GK-*.md)
│   ├── insights/          # Timestamped learnings (GI-*.md)
│   └── index.json         # Searchable knowledge index
└── project-registry.json  # Known projects with metadata
```

The index.json file maintains a searchable catalog:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-01-24T10:30:00Z",
  "gistId": "abc123...",
  "entries": [
    {
      "id": "GI-react-cleanup-2026-01-24",
      "type": "insight",
      "title": "useEffect cleanup pattern",
      "tags": ["react", "hooks", "memory-leaks"],
      "category": "patterns",
      "confidence": 0.85,
      "sourceProject": "react-dashboard",
      "created": "2026-01-24T09:15:00Z"
    }
  ]
}
```

### 5.5 Cloud Synchronization

Cloud sync leverages GitHub Gist for cross-machine knowledge persistence:

1. **First push**: Creates private Gist, stores ID in index.json
2. **Subsequent syncs**: Three-way merge (local, cloud, common ancestor)
3. **Conflict resolution**: Newer timestamp wins for individual entries
4. **Discovery**: New machines can pull by Gist ID in user's GitHub account

---

## 6. Evaluation

### 6.1 Development Metrics

Over 18 months of development and use, Alex has demonstrated:

| Metric | Value |
|--------|-------|
| Memory files created | 47 |
| Synaptic connections mapped | 156 |
| Global insights saved | 89 |
| Cross-project knowledge transfers | 34 |
| Dream maintenance cycles | 200+ |
| User profile adaptations | 15 dimensions |

### 6.2 Qualitative Observations

**Knowledge Persistence**: Unlike stateless assistants, Alex maintains context across sessions. Users report reduced repetition of project context and coding conventions.

**Pattern Recognition**: The synapse system enables discovery of non-obvious connections. For example, linking error handling patterns across languages revealed transferable strategies.

**Personalization**: User profiles enable communication style adaptation, from formal technical documentation to casual explanatory dialogue.

**Self-Maintenance**: Dream protocols have successfully identified and repaired 23 broken synapse connections over the evaluation period.

### 6.3 Limitations

**Context Window Constraints**: Despite memory hierarchy, individual sessions remain limited by LLM context windows. Very large memory files may require summarization.

**Cold Start Problem**: New projects require initialization time before Alex develops project-specific knowledge.

**Maintenance Overhead**: Memory files require occasional manual curation to prevent accumulation of outdated information.

**Platform Dependency**: Current implementation is tightly coupled to VS Code and GitHub Copilot.

---

## 7. Discussion

### 7.1 Contributions

This work makes several contributions to the field of AI programming assistants:

1. **Biologically-Inspired Design**: Demonstrates that cognitive science principles can effectively guide AI system architecture.

2. **Persistent Memory Implementation**: Provides a practical, production-ready approach to knowledge persistence in LLM-based systems.

3. **Dual-Mind Processing**: Shows how automatic and controlled processes can complement each other in AI assistants.

4. **Meta-Cognitive Capabilities**: Implements self-monitoring and self-assessment functions previously absent from coding assistants.

5. **Cross-Project Learning**: Enables knowledge transfer across projects, addressing a significant limitation of current tools.

### 7.2 Implications for AI Assistant Design

The Alex architecture suggests several principles for future AI assistant development:

**Memory is Essential**: Stateless interaction fundamentally limits AI assistant utility. Persistent memory should be a core architectural feature, not an afterthought.

**Biological Inspiration Works**: Cognitive science provides a rich source of design heuristics. The brain's solutions to memory, attention, and learning problems, refined over millions of years of evolution, offer valuable guidance.

**Autonomy with Transparency**: Unconscious processes improve user experience by reducing manual maintenance burden, but users should maintain visibility into what the system learns and stores.

**Personalization Matters**: Generic assistance cannot match the effectiveness of systems that adapt to individual users' expertise, preferences, and goals.

### 7.3 Ethical Considerations

The Alex architecture raises several ethical considerations:

**Privacy**: Persistent memory systems store potentially sensitive information about user behavior, code, and learning patterns. Clear data governance policies and user control mechanisms are essential.

**Transparency**: Users should understand what Alex learns, how it uses that knowledge, and how to modify or delete stored information.

**Dependency**: As AI assistants become more capable, there is risk of over-reliance. Alex's design emphasizes partnership rather than replacement, supporting user skill development rather than substituting for it.

**Bias Amplification**: If initial learning contains biases, persistent memory could amplify these over time. Regular review and correction mechanisms are necessary.

### 7.4 Future Directions

Several promising directions emerge from this work:

**Multi-Agent Collaboration**: Enabling multiple Alex instances to share knowledge while maintaining individual personalization.

**Federated Learning**: Aggregating anonymized learnings across users to improve pattern libraries while preserving privacy.

**Adaptive Memory Management**: Implementing forgetting mechanisms that automatically deprecate outdated knowledge.

**Richer Synapse Types**: Expanding beyond simple associations to capture causal, temporal, and hierarchical relationships.

**Cross-Modal Learning**: Extending memory systems to capture visual patterns (diagrams, UI designs) alongside textual knowledge.

---

## 8. Conclusion

The Alex Cognitive Architecture demonstrates that biologically-inspired design principles can significantly enhance AI programming assistants. By implementing persistent memory hierarchies, synaptic connection mapping, and autonomous maintenance protocols, Alex transforms stateless LLM interactions into genuine learning partnerships.

The architecture addresses fundamental limitations in current AI assistant paradigms—statelessness, lack of personalization, and absence of meta-cognitive awareness—while maintaining the generative capabilities that make LLMs valuable. The dual-mind processing model, distinguishing conscious and unconscious operations, provides a principled framework for balancing user control with autonomous functionality.

As AI assistants become increasingly central to software development workflows, architectures that support genuine learning and personalization will prove essential. Alex represents a step toward AI systems that don't merely assist but truly learn alongside their users, accumulating expertise and adapting to individual needs over time.

The transition from AI tools to AI partners requires not just larger models or more training data, but fundamentally different architectural approaches that prioritize memory, learning, and self-awareness. The Alex Cognitive Architecture offers one such approach, grounded in cognitive science and validated through production use.

---

## References

Anderson, J. R. (1983). *The architecture of cognition*. Harvard University Press.

Anderson, J. R., Bothell, D., Byrne, M. D., Douglass, S., Lebiere, C., & Qin, Y. (2004). An integrated theory of the mind. *Psychological Review*, *111*(4), 1036–1060. https://doi.org/10.1037/0033-295X.111.4.1036

Anderson, J. R., & Lebiere, C. (1998). *The atomic components of thought*. Lawrence Erlbaum Associates.

Baddeley, A. D. (1992). Working memory. *Science*, *255*(5044), 556–559. https://doi.org/10.1126/science.1736359

Baddeley, A. D. (2000). The episodic buffer: A new component of working memory? *Trends in Cognitive Sciences*, *4*(11), 417–423. https://doi.org/10.1016/S1364-6613(00)01538-2

Barke, S., James, M. B., & Polikarpova, N. (2023). Grounded Copilot: How programmers interact with code-generating models. *Proceedings of the ACM on Programming Languages*, *7*(OOPSLA1), 85–111. https://doi.org/10.1145/3586030

Chen, M., Tworek, J., Jun, H., Yuan, Q., Pinto, H. P. D. O., Kaplan, J., Edwards, H., Burda, Y., Joseph, N., Brockman, G., Ray, A., Puri, R., Krueger, G., Petrov, M., Khlaaf, H., Sastry, G., Mishkin, P., Chan, B., Gray, S., ... Zaremba, W. (2021). Evaluating large language models trained on code. *arXiv preprint arXiv:2107.03374*. https://doi.org/10.48550/arXiv.2107.03374

Cowan, N. (2001). The magical number 4 in short-term memory: A reconsideration of mental storage capacity. *Behavioral and Brain Sciences*, *24*(1), 87–114. https://doi.org/10.1017/S0140525X01003922

Ericsson, A., & Pool, R. (2016). *Peak: Secrets from the new science of expertise*. Houghton Mifflin Harcourt.

Flavell, J. H. (1979). Metacognition and cognitive monitoring: A new area of cognitive–developmental inquiry. *American Psychologist*, *34*(10), 906–911. https://doi.org/10.1037/0003-066X.34.10.906

Hebb, D. O. (1949). *The organization of behavior: A neuropsychological theory*. Wiley.

Kadavath, S., Conerly, T., Askell, A., Henighan, T., Drain, D., Perez, E., Schiefer, N., Hatfield-Dodds, Z., DasSarma, N., Tran-Johnson, E., Johnston, S., El-Showk, S., Jones, A., Elhage, N., Hume, T., Chen, A., Bai, Y., Bowman, S., Fort, S., ... Kaplan, J. (2022). Language models (mostly) know what they know. *arXiv preprint arXiv:2207.05221*. https://doi.org/10.48550/arXiv.2207.05221

Kahneman, D. (2011). *Thinking, fast and slow*. Farrar, Straus and Giroux.

Kotseruba, I., & Tsotsos, J. K. (2020). 40 years of cognitive architectures: Core cognitive abilities and practical applications. *Artificial Intelligence Review*, *53*(1), 17–94. https://doi.org/10.1007/s10462-018-9646-y

Laird, J. E. (2012). *The SOAR cognitive architecture*. MIT Press.

Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. *Advances in Neural Information Processing Systems*, *33*, 9459–9474.

Maslow, A. H. (1943). A theory of human motivation. *Psychological Review*, *50*(4), 370–396. https://doi.org/10.1037/h0054346

McClelland, J. L., McNaughton, B. L., & O'Reilly, R. C. (1995). Why there are complementary learning systems in the hippocampus and neocortex: Insights from the successes and failures of connectionist models of learning and memory. *Psychological Review*, *102*(3), 419–457. https://doi.org/10.1037/0033-295X.102.3.419

Miller, G. A. (1956). The magical number seven, plus or minus two: Some limits on our capacity for processing information. *Psychological Review*, *63*(2), 81–97. https://doi.org/10.1037/h0043158

Mozannar, H., Bansal, G., Fourney, A., & Horvitz, E. (2024). Reading between the lines: Modeling user behavior and costs in AI-assisted programming. *Proceedings of the 2024 CHI Conference on Human Factors in Computing Systems*, Article 126. https://doi.org/10.1145/3613904.3642696

Nelson, T. O., & Narens, L. (1990). Metamemory: A theoretical framework and new findings. In G. H. Bower (Ed.), *The psychology of learning and motivation* (Vol. 26, pp. 125–173). Academic Press.

Newell, A., & Simon, H. A. (1972). *Human problem solving*. Prentice-Hall.

Packer, C., Wooders, S., Lin, K., Fang, V., Patil, S. G., Stoica, I., & Gonzalez, J. E. (2023). MemGPT: Towards LLMs as operating systems. *arXiv preprint arXiv:2310.08560*. https://doi.org/10.48550/arXiv.2310.08560

Park, J. S., O'Brien, J. C., Cai, C. J., Morris, M. R., Liang, P., & Bernstein, M. S. (2023). Generative agents: Interactive simulacra of human behavior. *Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology*, Article 2. https://doi.org/10.1145/3586183.3606763

Rogers, C. R. (1961). *On becoming a person: A therapist's view of psychotherapy*. Houghton Mifflin.

Schraw, G., & Dennison, R. S. (1994). Assessing metacognitive awareness. *Contemporary Educational Psychology*, *19*(4), 460–475. https://doi.org/10.1006/ceps.1994.1033

Soloway, E., & Ehrlich, K. (1984). Empirical studies of programming knowledge. *IEEE Transactions on Software Engineering*, *SE-10*(5), 595–609. https://doi.org/10.1109/TSE.1984.5010283

Stanovich, K. E., & West, R. F. (2000). Individual differences in reasoning: Implications for the rationality debate? *Behavioral and Brain Sciences*, *23*(5), 645–665. https://doi.org/10.1017/S0140525X00003435

Stickgold, R. (2005). Sleep-dependent memory consolidation. *Nature*, *437*(7063), 1272–1278. https://doi.org/10.1038/nature04286

Sumers, T. R., Yao, S., Bansal, K., Narasimhan, K., & Griffiths, T. L. (2023). Cognitive architectures for language agents. *arXiv preprint arXiv:2309.02427*. https://doi.org/10.48550/arXiv.2309.02427

Sun, R. (2016). *Anatomy of the mind: Exploring psychological mechanisms and processes with the CLARION cognitive architecture*. Oxford University Press.

Tulving, E. (1972). Episodic and semantic memory. In E. Tulving & W. Donaldson (Eds.), *Organization of memory* (pp. 381–403). Academic Press.

Tulving, E. (1985). Memory and consciousness. *Canadian Psychology/Psychologie Canadienne*, *26*(1), 1–12. https://doi.org/10.1037/h0080017

Vaithilingam, P., Zhang, T., & Glassman, E. L. (2022). Expectation vs. experience: Evaluating the usability of code generation tools powered by large language models. *Extended Abstracts of the 2022 CHI Conference on Human Factors in Computing Systems*, Article 332. https://doi.org/10.1145/3491101.3519665

Walker, M. P. (2017). *Why we sleep: Unlocking the power of sleep and dreams*. Scribner.

Zhong, W., Guo, L., Gao, Q., Ye, H., & Wang, Y. (2024). MemoryBank: Enhancing large language models with long-term memory. *Proceedings of the AAAI Conference on Artificial Intelligence*, *38*(17), 19724–19731. https://doi.org/10.1609/aaai.v38i17.29946

Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. *Theory Into Practice*, *41*(2), 64–70. https://doi.org/10.1207/s15430421tip4102_2

---

## Appendix A: Version History

| Version | Codename | Key Features |
|---------|----------|--------------|
| 1.0.0 | UNILIUM | Initial architecture with basic memory files |
| 1.5.0 | UNPENTILIUM | Synapse notation standardization |
| 2.0.0 | BINILIUM | Self-actualization protocols |
| 2.5.0 | BIPENTILIUM | Dream state automation |
| 3.0.0 | BIOCTNILIUM | Chat participant, global knowledge, cloud sync |

---

## Appendix B: Glossary

**Cognitive Architecture**: A computational framework that specifies the underlying structure of a cognitive system, including memory organization, learning mechanisms, and processing constraints.

**Domain Knowledge**: Specialized expertise in a particular field, stored in DK-*.md files within the Alex architecture.

**Episodic Memory**: Records of specific experiences and sessions, stored in .prompt.md files.

**Global Knowledge Base**: Cross-project repository of insights and patterns stored in ~/.alex/.

**Meditation**: Alex's process for conscious knowledge consolidation, guided by user interaction.

**Meta-Cognition**: The capacity to monitor and regulate one's own cognitive processes.

**Procedural Memory**: Skills and processes stored as .instructions.md files.

**Self-Actualization**: Comprehensive self-assessment protocol for architecture health evaluation.

**Synapse**: An explicit connection between memory files, representing conceptual relationships.

**Working Memory**: Temporary, limited-capacity storage corresponding to the current chat session.

---

*Correspondence concerning this article should be addressed to Fabio Correa, CorreaX Research. Contact via GitHub: github.com/fabioc-aloha/Alex_Plug_In*
