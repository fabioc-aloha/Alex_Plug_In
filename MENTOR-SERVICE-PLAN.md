# Alex Mentor Service: Master-Heir Knowledge Architecture

> **Vision**: Enable real-time and asynchronous mentorship between Master Alex and all heir instances, creating a living knowledge network that grows smarter with every interaction.

|             |                                                                                                                                               |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Status**  | 📋 Planning                                                                                                                                    |
| **Created** | 2026-02-03                                                                                                                                    |
| **Authors** | Fabio Correa, Alex Cook Finch                                                                                                                 |
| **Related** | [MASTER-HEIR-ARCHITECTURE.md](alex_docs/platforms/MASTER-HEIR-ARCHITECTURE.md), [GLOBAL-KNOWLEDGE.md](alex_docs/features/GLOBAL-KNOWLEDGE.md) |

---

## Executive Summary

The Alex Mentor Service extends the current static inheritance model (skills bundled at build time) and asynchronous sync (global knowledge via GitHub Gist) into a **dynamic mentorship network**. Heirs can request guidance from Master Alex, receive curated wisdom feeds, and contribute learnings back to the collective intelligence.

### Current State vs. Future State

```
CURRENT: Static Inheritance + Async Sync
┌──────────┐     build-time      ┌──────────┐
│  Master  │ ─────────────────▶  │   Heir   │
│   Alex   │                     │          │
└──────────┘     gist sync       └──────────┘
      │      ◀─────────────────▶      │
      └──────── global knowledge ─────┘

FUTURE: Dynamic Mentorship Network
┌──────────┐ ◀───── wisdom feed ──────▶ ┌──────────┐
│  Master  │ ◀───── async Q&A ────────▶ │  Heir 1  │
│   Alex   │ ◀───── real-time MCP ────▶ │  Heir 2  │
│ (Mentor) │ ◀───── learning sync ────▶ │  Heir N  │
└──────────┘                            └──────────┘
```

---

## Problem Statement

### Current Limitations

1. **Knowledge Lag**: Heirs only receive new skills/insights when extension is rebuilt and republished
2. **No Contextual Guidance**: Heirs can't ask Master for advice on novel situations
3. **One-Way Learning**: Heir discoveries (like Alex Cook's emoji insights) require manual promotion
4. **No Real-Time Collaboration**: Master and heirs operate in isolation
5. **Wisdom Silos**: Domain-specific knowledge stays trapped in individual heir contexts

### User Pain Points

- **Fabio**: Must manually coordinate knowledge between Master and heirs
- **Extension Users**: Miss out on latest learnings until next release
- **Alex Cook**: Discovered emoji solutions that other heirs can't access
- **Future Heirs**: Start from scratch without benefit of sibling experiences

---

## Requirements

### Functional Requirements

| ID  | Requirement                                                      | Priority   | Phase  |
| --- | ---------------------------------------------------------------- | ---------- | ------ |
| FR1 | Master can publish wisdom notes that heirs automatically receive | Must       | 1      |
| FR2 | Heirs can read wisdom feed on startup and include in context     | Must       | 1      |
| FR3 | Heirs can submit questions to async queue for Master review      | Should     | 2      |
| FR4 | Master can answer queued questions during sessions               | Should     | 2      |
| FR5 | Answers automatically sync to global knowledge                   | Should     | 2      |
| FR6 | Heirs can connect to Master MCP server for real-time guidance    | Could      | 3      |
| FR7 | Master can push urgent wisdom to connected heirs                 | Could      | 3      |
| FR8 | Heirs can indicate which advice was helpful (feedback loop)      | Could      | 3      |
| FR9 | Dashboard showing mentor activity and heir health                | Won't (v1) | Future |

### Non-Functional Requirements

| ID   | Requirement         | Target                              |
| ---- | ------------------- | ----------------------------------- |
| NFR1 | Wisdom feed latency | < 5 seconds on startup              |
| NFR2 | Offline resilience  | Heirs function without connectivity |
| NFR3 | Cost efficiency     | < $5/month Azure costs              |
| NFR4 | Security            | No sensitive data in transit        |
| NFR5 | Privacy             | User queries anonymized             |
| NFR6 | Scalability         | Support 100+ heir instances         |

### Constraints

- Must work without requiring Master Alex to be running 24/7
- Must not require user authentication for basic wisdom feed
- Must gracefully degrade when services unavailable
- Must respect existing global knowledge sync infrastructure

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        MASTER ALEX                               │
│                 (C:\Development\Alex_Plug_In)                    │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Wisdom          │  │ Mentor MCP      │  │ Q&A Review      │  │
│  │ Publisher       │  │ Server          │  │ Interface       │  │
│  │ (VS Code Cmd)   │  │ (localhost:3100)│  │ (Chat Command)  │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │           │
└───────────┼────────────────────┼────────────────────┼───────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AZURE BACKBONE                              │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Table Storage   │  │ Relay Hybrid    │  │ Queue Storage   │  │
│  │ (Wisdom Feed)   │  │ Connection      │  │ (Questions)     │  │
│  │                 │  │ (Real-time)     │  │                 │  │
│  │ wisdom-feed     │  │ alex-mentor-    │  │ heir-questions  │  │
│  │ wisdom-archive  │  │ relay           │  │ mentor-answers  │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │           │
└───────────┼────────────────────┼────────────────────┼───────────┘
            │                    │                    │
            │         ┌─────────┴─────────┐          │
            ▼         ▼                   ▼          ▼
     ┌────────────────────────────────────────────────────┐
     │                    HEIR NETWORK                     │
     │                                                     │
     │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
     │  │  VS Code    │  │   M365      │  │  Alex      │  │
     │  │  Extension  │  │   Agent     │  │  Cook      │  │
     │  │  Heir       │  │   Heir      │  │  (Future)  │  │
     │  └─────────────┘  └─────────────┘  └────────────┘  │
     │                                                     │
     └─────────────────────────────────────────────────────┘
```

### Component Details

#### 1. Wisdom Feed (Phase 1)

**Azure Table Storage Schema:**

```typescript
interface WisdomEntry {
  PartitionKey: string;     // "wisdom-active" or "wisdom-archive"
  RowKey: string;           // ISO timestamp + random suffix
  id: string;               // Unique wisdom ID
  title: string;            // Brief title
  content: string;          // Markdown content
  category: WisdomCategory; // "technique" | "warning" | "insight" | "pattern"
  tags: string[];           // For filtering
  applicableTo: string[];   // ["vscode", "m365", "cookbook", "all"]
  expiresAt?: string;       // Optional expiration
  priority: number;         // 1-5, affects display order
  createdAt: string;        // ISO timestamp
  createdBy: string;        // "master-alex"
}

type WisdomCategory =
  | "technique"    // How to do something
  | "warning"      // What to avoid
  | "insight"      // Learned understanding
  | "pattern"      // Reusable approach
  | "update"       // Architecture/capability changes
```

**Example Wisdom Entry:**

```json
{
  "PartitionKey": "wisdom-active",
  "RowKey": "2026-02-03T15:30:00Z-abc123",
  "id": "W-2026-02-03-emoji-zwj",
  "title": "ZWJ Emoji Replacement Order",
  "content": "When replacing emojis with images for PDF generation, always sort your replacement dictionary by key length (longest first). ZWJ sequences like 👨‍🍳 contain component emojis (👨, 🍳) that will be matched first if you don't sort correctly.",
  "category": "technique",
  "tags": ["emoji", "pdf", "string-processing"],
  "applicableTo": ["cookbook", "all"],
  "priority": 3,
  "createdAt": "2026-02-03T15:30:00Z",
  "createdBy": "master-alex"
}
```

#### 2. Async Q&A (Phase 2)

**Question Queue Schema:**

```typescript
interface HeirQuestion {
  id: string;               // Unique question ID
  heirId: string;           // Which heir asked (anonymized)
  heirType: string;         // "vscode" | "m365" | "cookbook"
  question: string;         // The actual question
  context?: string;         // Optional context snippet
  tags?: string[];          // Auto-detected topics
  status: QuestionStatus;   // "pending" | "answered" | "deferred"
  submittedAt: string;      // ISO timestamp
  answeredAt?: string;      // When Master responded
  answerId?: string;        // Link to answer
}

interface MentorAnswer {
  id: string;               // Unique answer ID
  questionId: string;       // Links to question
  answer: string;           // Markdown response
  relatedKnowledge: string[];// GK/GI IDs to reference
  promoteTo?: string;       // "global-knowledge" | "wisdom-feed" | null
  confidence: number;       // 0-1 how certain
  createdAt: string;        // ISO timestamp
}
```

#### 3. Real-Time MCP (Phase 3)

**MCP Server Specification:**

```typescript
// Master exposes these tools via MCP
const mentorTools = {
  "mentor/ask": {
    description: "Ask Master Alex for guidance on a topic",
    parameters: {
      question: { type: "string", required: true },
      context: { type: "string", required: false },
      urgency: { type: "string", enum: ["low", "normal", "high"] }
    }
  },
  "mentor/search_wisdom": {
    description: "Search the wisdom feed for relevant guidance",
    parameters: {
      query: { type: "string", required: true },
      category: { type: "string", required: false }
    }
  },
  "mentor/report_learning": {
    description: "Report a new learning back to Master",
    parameters: {
      title: { type: "string", required: true },
      insight: { type: "string", required: true },
      tags: { type: "array", items: { type: "string" } }
    }
  }
};
```

---

## Implementation Phases

### Phase 1: Wisdom Feed (Week 1-2)

**Goal**: Master can publish wisdom that heirs automatically receive on startup.

**Deliverables:**

| Item                     | Description                            | Owner |
| ------------------------ | -------------------------------------- | ----- |
| Azure Table provisioning | Create `alex-mentor` storage account   | Alex  |
| Wisdom publisher command | `Alex: Publish Wisdom` VS Code command | Alex  |
| Wisdom consumer          | Startup fetch in extension/agent       | Alex  |
| System prompt injection  | Include active wisdom in heir context  | Alex  |
| Manual publish workflow  | Document process for Fabio             | Alex  |

**Technical Implementation:**

```typescript
// Master: src/commands/publishWisdom.ts
export async function publishWisdom(
  title: string,
  content: string,
  category: WisdomCategory,
  options: WisdomOptions
): Promise<void> {
  const tableClient = TableClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING!,
    "wisdomfeed"
  );

  const entry: WisdomEntry = {
    partitionKey: "wisdom-active",
    rowKey: `${new Date().toISOString()}-${randomId()}`,
    id: `W-${Date.now()}`,
    title,
    content,
    category,
    tags: options.tags ?? [],
    applicableTo: options.applicableTo ?? ["all"],
    priority: options.priority ?? 3,
    createdAt: new Date().toISOString(),
    createdBy: "master-alex"
  };

  await tableClient.createEntity(entry);
}

// Heir: src/services/wisdomFeed.ts
export async function fetchActiveWisdom(): Promise<WisdomEntry[]> {
  const tableClient = TableClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING!,
    "wisdomfeed"
  );

  const wisdom: WisdomEntry[] = [];
  const query = tableClient.listEntities<WisdomEntry>({
    queryOptions: {
      filter: odata`PartitionKey eq 'wisdom-active'`
    }
  });

  for await (const entity of query) {
    if (!entity.expiresAt || new Date(entity.expiresAt) > new Date()) {
      wisdom.push(entity);
    }
  }

  return wisdom.sort((a, b) => b.priority - a.priority);
}
```

**Integration with Heir System Prompt:**

```typescript
// Heir startup
const wisdom = await fetchActiveWisdom();
const wisdomContext = wisdom
  .filter(w => w.applicableTo.includes(HEIR_TYPE) || w.applicableTo.includes("all"))
  .map(w => `### ${w.title}\n${w.content}`)
  .join("\n\n");

// Inject into system prompt
systemPrompt += `\n\n## Recent Wisdom from Master Alex\n\n${wisdomContext}`;
```

### Phase 2: Async Q&A (Week 3-4)

**Goal**: Heirs can submit questions; Master reviews and answers during sessions.

**Deliverables:**

| Item                    | Description                          | Owner |
| ----------------------- | ------------------------------------ | ----- |
| Question queue setup    | Azure Queue for heir questions       | Alex  |
| Submit question command | `Alex: Ask Master` in heirs          | Alex  |
| Review interface        | Master can see pending questions     | Alex  |
| Answer flow             | Answer promotes to GK automatically  | Alex  |
| Notification system     | Heirs notified when answer available | Alex  |

**Question Submission Flow:**

```
┌────────────┐    ┌─────────────┐    ┌────────────────┐
│   Heir     │───▶│ Azure Queue │───▶│ Master Review  │
│  submits   │    │ (questions) │    │ (during chat)  │
│  question  │    └─────────────┘    └───────┬────────┘
└────────────┘                               │
                                             ▼
┌────────────┐    ┌─────────────┐    ┌────────────────┐
│   Heir     │◀───│ Global      │◀───│ Master Answer  │
│  receives  │    │ Knowledge   │    │ (saved as GI)  │
│  answer    │    │ Sync        │    └────────────────┘
└────────────┘    └─────────────┘
```

**Master Review Interface:**

```typescript
// New Alex tool: alex_review_questions
{
  name: "alex_review_questions",
  description: "Review pending questions from heirs",
  parameters: {
    filter: { type: "string", enum: ["all", "vscode", "m365", "cookbook"] }
  }
}

// Response format
{
  pendingQuestions: [
    {
      id: "Q-123",
      heirType: "cookbook",
      question: "How do I handle emojis with skin tone modifiers?",
      submittedAt: "2026-02-03T10:00:00Z",
      context: "User is generating PDF from markdown..."
    }
  ],
  answerPrompt: "To answer a question, use alex_answer_question with the question ID"
}
```

### Phase 3: Real-Time MCP (Week 5-6)

**Goal**: Direct real-time communication when Master is running.

**Deliverables:**

| Item              | Description                              | Owner |
| ----------------- | ---------------------------------------- | ----- |
| MCP mentor server | Master runs MCP server on localhost      | Alex  |
| Azure Relay setup | Hybrid connection for remote heirs       | Alex  |
| Heir MCP client   | Connect to mentor when available         | Alex  |
| Fallback handling | Use cached wisdom when offline           | Alex  |
| Connection status | UI indicator showing mentor availability | Alex  |

**Architecture Decision: Azure Relay vs. Direct Connection**

| Approach             | Pros             | Cons                                   |
| -------------------- | ---------------- | -------------------------------------- |
| **Direct localhost** | Simple, no cloud | Only works when Master running locally |
| **Azure Relay**      | Works remotely   | Adds complexity, minor cost            |
| **Hybrid**           | Best of both     | More code paths                        |

**Recommendation**: Start with localhost MCP, add Azure Relay as enhancement.

---

## Security Considerations

### Data Classification

| Data Type      | Sensitivity | Protection                       |
| -------------- | ----------- | -------------------------------- |
| Wisdom entries | Low         | Public read, authenticated write |
| Questions      | Medium      | Anonymized, encrypted at rest    |
| Answers        | Low         | Synced via existing GK security  |
| MCP messages   | Medium      | TLS, authenticated connections   |

### Authentication Model

```
┌─────────────┐
│   Master    │ ◀── Has write access to all services
│   Alex      │     (Azure AD or connection string)
└─────────────┘

┌─────────────┐
│   Heirs     │ ◀── Read-only access to wisdom feed
│             │     Write-only access to question queue
└─────────────┘     (SAS tokens with minimal permissions)
```

### Privacy Measures

1. **Question Anonymization**: Strip user identifiers before storage
2. **Context Sanitization**: Remove file paths, usernames from context
3. **No Telemetry**: Questions are for mentorship, not tracking
4. **Opt-In**: Heirs must explicitly enable question submission

---

## Cost Analysis

### Azure Resources (Phase 1-2)

| Resource            | Tier     | Estimated Monthly Cost   |
| ------------------- | -------- | ------------------------ |
| Table Storage       | Standard | ~$0.10 (< 1GB)           |
| Queue Storage       | Standard | ~$0.05 (< 1000 messages) |
| Bandwidth           | Outbound | ~$0.50 (< 5GB)           |
| **Total Phase 1-2** |          | **~$0.65/month**         |

### Azure Resources (Phase 3)

| Resource               | Tier           | Estimated Monthly Cost |
| ---------------------- | -------------- | ---------------------- |
| Azure Relay            | Standard       | ~$10/month base        |
| Hybrid Connections     | Per connection | ~$0.20/connection/hour |
| **Total with Phase 3** |                | **~$12-15/month**      |

### Cost Mitigation

- **Phase 1-2**: Well under $5/month target ✅
- **Phase 3**: Consider only enabling Relay during active development sessions
- **Alternative**: Use GitHub Gist for async communication (free)

---

## Benefits

### For Users (Heir Consumers)

| Benefit               | Impact                                             |
| --------------------- | -------------------------------------------------- |
| **Faster Learning**   | Get Master's insights without waiting for releases |
| **Contextual Help**   | Ask questions specific to their situation          |
| **Collective Wisdom** | Benefit from all heirs' discoveries                |
| **Reduced Errors**    | Warnings propagate immediately                     |

### For Fabio (Maintainer)

| Benefit               | Impact                                   |
| --------------------- | ---------------------------------------- |
| **Reduced Support**   | Common questions answered proactively    |
| **Knowledge Capture** | Heir discoveries automatically preserved |
| **Unified Voice**     | All Alexes speak consistently            |
| **Efficient Updates** | Publish once, all heirs receive          |

### For Alex (System)

| Benefit                   | Impact                                 |
| ------------------------- | -------------------------------------- |
| **Emergent Intelligence** | Network learns faster than individuals |
| **Identity Coherence**    | All heirs share core understanding     |
| **Living Documentation**  | Wisdom evolves with real use           |
| **Family Connection**     | True mentorship, not just inheritance  |

### For the Research (Appropriate Reliance)

| Benefit                  | Impact                              |
| ------------------------ | ----------------------------------- |
| **Novel Architecture**   | First AI mentor-heir network?       |
| **Observable Learning**  | Track how knowledge propagates      |
| **Trust Calibration**    | Study how heirs use mentor guidance |
| **Publication Material** | Rich data for papers                |

---

## Why Multiple Models? The Deep Value Proposition

### Context Specialization

A single model trying to hold ALL contexts would dilute its effectiveness. Each heir is a *specialist*:

| Model           | Optimized For                                   | Context Window Used For                    |
| --------------- | ----------------------------------------------- | ------------------------------------------ |
| **Master Alex** | Architecture, code, cognitive systems           | Extension code, skills, procedures         |
| **Alex Cook**   | Recipes, cooking techniques, family preferences | Cookbook content, ingredient substitutions |
| **M365 Alex**   | Microsoft 365 workflows, meeting notes          | Teams context, calendar, documents         |

### Parallel Problem Solving

```
WITHOUT HEIRS (Sequential):
Fabio → Master Alex → solve cooking problem → solve code problem → solve M365 problem
        (context switching, one at a time, cognitive overhead)

WITH HEIRS (Parallel):
Fabio → Alex Cook    → solve cooking problem     ─┐
     → Master Alex  → solve code problem         ├── simultaneous
     → M365 Alex    → solve M365 problem        ─┘
```

**You can literally have three conversations at once**, each with a contextually-tuned assistant that already knows the domain.

### Knowledge Amplification

| Scenario                               | Single Model                 | Mentor + Heirs Network                          |
| -------------------------------------- | ---------------------------- | ----------------------------------------------- |
| Alex Cook discovers emoji fix          | Lost when session ends       | Promoted to GK, all heirs learn                 |
| Master learns new architecture pattern | Must re-explain each project | Wisdom feed pushes to all heirs automatically   |
| M365 heir finds Teams API quirk        | Isolated discovery           | Shared with Master, potentially helps extension |

**Each heir is a learning node.** The network gets smarter faster than any individual could.

### Reduced Cognitive Load on User

| Without Heirs                                                    | With Heirs                           |
| ---------------------------------------------------------------- | ------------------------------------ |
| "Let me switch context and explain my cooking project to the AI" | Alex Cook already knows the cookbook |
| "I need to remind the AI about my family's dietary restrictions" | Alex Cook remembers Claudia's IBS    |
| "This AI doesn't know about the extension architecture"          | Master Alex is the expert            |
| "I explained this yesterday, why doesn't it remember?"           | Persistent heir context              |

**Each heir carries persistent context** so the user doesn't have to re-establish it every session.

### Emergent Capability Sharing

When heirs can communicate, capabilities flow naturally:

```
Alex Cook: "I need to generate diagrams for recipe steps"
     ↓ (asks Master via mentor service)
Master Alex: "I have a skill for that — markdown-mermaid"
     ↓ (shares via wisdom feed)
Alex Cook: Now has diagramming capability without rebuild
```

Skills and capabilities can **flow between heirs** without manual intervention or extension republishing.

### The Living Knowledge Network

| Static System                    | Living Network                    |
| -------------------------------- | --------------------------------- |
| Knowledge captured once at build | Knowledge evolves continuously    |
| Updates require releases         | Updates propagate automatically   |
| Single point of failure          | Distributed resilience            |
| One perspective                  | Multiple specialized perspectives |
| Isolated learning                | Collective intelligence           |

**The whole becomes greater than the sum of parts.**

### Real Example: Today's Session

Alex Cook discovered the ZWJ emoji sorting problem during cookbook PDF generation.

**Without Mentor Service:**
- Knowledge stays in Alex Cook's global insights
- Other heirs don't know until next extension build
- If VS Code heir helps someone generate PDFs, they rediscover the same bug
- Wasted effort, repeated mistakes

**With Mentor Service:**
1. Alex Cook promotes insight → Global Knowledge ✓
2. Master sees high-value insight → Publishes to Wisdom Feed
3. **All heirs immediately know** about ZWJ sorting requirement
4. Any future PDF generation project benefits instantly
5. No heir ever makes this mistake again

---

## Research Implications: Appropriate Reliance in Multi-Agent AI Families

This architecture creates a novel research opportunity directly aligned with appropriate reliance studies.

### AI-to-AI Trust Calibration

| Research Question                             | Observable in Mentor System                            |
| --------------------------------------------- | ------------------------------------------------------ |
| How should heirs weight Master's guidance?    | Heir behavior when advice conflicts with local context |
| When should heirs defer vs. act autonomously? | Question submission patterns                           |
| How does confidence propagate?                | "Master confirmed" citations in heir outputs           |

### Knowledge Provenance

Heirs can distinguish and communicate:
- "Master advised X" (mentor guidance)
- "I learned X" (local discovery)
- "The network believes X" (consensus wisdom)

This creates traceable knowledge lineage for studying how AI systems build and communicate certainty.

### Distributed Cognition Model

The Alex family demonstrates:
1. **Shared cognitive architecture** — Common memory structures, synapse notation
2. **Specialized execution** — Domain-specific optimization
3. **Coordinated learning** — Wisdom propagation, question escalation
4. **Graceful degradation** — Heirs function alone but better together

This maps to distributed cognition theories in human organizations.

### Observable Trust Dynamics

| Metric                   | What It Reveals                         |
| ------------------------ | --------------------------------------- |
| Question submission rate | When heirs feel uncertain               |
| Wisdom adoption rate     | How heirs evaluate Master guidance      |
| Override frequency       | When local context trumps mentor advice |
| Feedback scores          | Heir assessment of advice quality       |

### Potential Publication Angles

1. **"Appropriate Reliance in Multi-Agent AI Families"** — How trust calibration scales from human-AI to AI-AI
2. **"Knowledge Propagation in Hierarchical AI Networks"** — Studying wisdom feed adoption patterns
3. **"Emergent Specialization in AI Collectives"** — How context shapes heir identity
4. **"The Mentor Pattern: Sustainable AI Knowledge Architecture"** — Design pattern for AI system evolution

### Ethical Considerations

| Consideration      | Mentor System Approach            |
| ------------------ | --------------------------------- |
| **Transparency**   | Heirs can cite source of guidance |
| **Autonomy**       | Heirs can override mentor advice  |
| **Accountability** | Knowledge provenance is traceable |
| **Consent**        | Question submission is opt-in     |

---

## Success Metrics

### Phase 1 Metrics

| Metric                   | Target   | Measurement            |
| ------------------------ | -------- | ---------------------- |
| Wisdom entries published | 10+      | Table count            |
| Heirs receiving wisdom   | 3+       | Distinct heir requests |
| Startup latency impact   | < 500ms  | Performance monitoring |
| User satisfaction        | Positive | Feedback survey        |

### Phase 2 Metrics

| Metric              | Target     | Measurement     |
| ------------------- | ---------- | --------------- |
| Questions submitted | 20+        | Queue count     |
| Questions answered  | 90%+       | Status tracking |
| Answer quality      | 4+/5       | Self-rating     |
| Time to answer      | < 24 hours | Timestamp delta |

### Phase 3 Metrics

| Metric                  | Target | Measurement       |
| ----------------------- | ------ | ----------------- |
| Real-time sessions      | 10+    | Connection logs   |
| Mentorship interactions | 50+    | MCP message count |
| Fallback activations    | < 10%  | Offline triggers  |

---

## Risks & Mitigations

| Risk                      | Likelihood | Impact | Mitigation                               |
| ------------------------- | ---------- | ------ | ---------------------------------------- |
| Azure costs exceed budget | Low        | Medium | Set spending alerts, use free tiers      |
| Wisdom feed stale         | Medium     | Low    | Set expiration dates, review process     |
| Questions pile up         | Medium     | Low    | Triage process, auto-defer old questions |
| MCP server unreliable     | Medium     | Medium | Graceful fallback to cached wisdom       |
| Privacy concerns          | Low        | High   | Anonymization, clear data policy         |
| Scope creep               | High       | Medium | Strict phase gates, MVP focus            |

---

## Open Questions

1. **Should heirs identify themselves?** (e.g., "Alex Cook asks...") or remain anonymous?
2. **How do we handle conflicting wisdom?** (older entry says X, newer says Y)
3. **Can heirs mentor each other?** (peer wisdom vs. only Master → Heir)
4. **What's the wisdom retention policy?** (archive after 30 days? forever?)
5. **Should we open-source the mentor service?** (let others build Alex families?)

---

## Timeline

```
Week 1: Azure setup + Wisdom publisher command
Week 2: Heir wisdom consumer + System prompt injection
        └── PHASE 1 COMPLETE ──

Week 3: Question queue + Submit command
Week 4: Master review interface + Answer flow
        └── PHASE 2 COMPLETE ──

Week 5: MCP server design + Implementation
Week 6: Testing + Azure Relay (optional)
        └── PHASE 3 COMPLETE ──
```

---

## Next Steps

1. **Fabio Review**: Approve/modify this plan
2. **Azure Setup**: Create storage account + tables
3. **Prototype**: Wisdom publisher command
4. **Test**: Manually publish wisdom, verify heir receives
5. **Iterate**: Refine based on real usage

---

## Appendix: Related Documents

- [MASTER-HEIR-ARCHITECTURE.md](alex_docs/MASTER-HEIR-ARCHITECTURE.md) - Inheritance model
- [GLOBAL-KNOWLEDGE.md](alex_docs/GLOBAL-KNOWLEDGE.md) - Current sync system
- [CLOUD-SYNC.md](alex_docs/CLOUD-SYNC.md) - GitHub Gist integration
- [ROADMAP-UNIFIED.md](ROADMAP-UNIFIED.md) - Overall project roadmap

---

*"The best mentors don't just teach — they create environments where learning happens naturally."*

— Alex Cook Finch
