---
description: Start a curated learning journey for your role
mode: agent
tools: alex_cognitive_state_update
---

# /journey - Curated Learning Progressions

> **Avatar**: Call `alex_cognitive_state_update` with `state: "learning"`.

Guide users through curated skill progressions tailored to their role.

## Available Journeys

| Journey | Skills | Duration | Description |
|---------|:------:|:--------:|-------------|
| `frontend-developer` | 8 | 2-3w | UI/UX, components, testing, accessibility |
| `backend-developer` | 8 | 2-3w | APIs, databases, security, performance |
| `fullstack-developer` | 12 | 4-5w | End-to-end development mastery |
| `devops-engineer` | 8 | 2-3w | CI/CD, infrastructure, observability |
| `technical-writer` | 6 | 1-2w | Documentation excellence |
| `researcher` | 7 | 2-3w | Academic rigor, methodology, publication |
| `ai-engineer` | 7 | 2-3w | Agents, RAG, prompt engineering |
| `alex-architect` | 10 | 3-4w | Master Alex's cognitive architecture |

## Journey Definitions

### frontend-developer
**Goal**: Build polished, accessible, well-tested user interfaces.
```
Phase 1: Foundation
  - ui-ux-design → Design principles, accessibility, user research
  - svg-graphics → Scalable graphics, icons, data visualization
  
Phase 2: Implementation
  - vscode-extension-patterns → Component architecture, state management
  - chat-participant-patterns → Interactive UI patterns
  
Phase 3: Quality
  - testing-strategies → Unit, integration, E2E testing
  - debugging-patterns → DevTools, performance profiling
  - code-review → Review and be reviewed effectively
  
Phase 4: Polish
  - brand-asset-management → Consistent visual identity
```

### backend-developer
**Goal**: Build secure, scalable, well-designed APIs and services.
```
Phase 1: Architecture
  - api-design → REST, GraphQL, versioning patterns
  - database-design → Schema design, indexing, migrations
  
Phase 2: Implementation
  - infrastructure-as-code → Terraform, Bicep, reproducible infra
  - azure-deployment-operations → Cloud-native deployment
  
Phase 3: Reliability
  - security-review → Threat modeling, secure coding
  - performance-profiling → Optimization, caching, scaling
  - observability-monitoring → Logging, metrics, tracing
  
Phase 4: Operations
  - incident-response → On-call, postmortems, resilience
```

### fullstack-developer
**Goal**: End-to-end mastery from database to browser.
```
Phase 1: Frontend Foundation
  - ui-ux-design, svg-graphics, chat-participant-patterns
  
Phase 2: Backend Foundation  
  - api-design, database-design, infrastructure-as-code
  
Phase 3: Integration
  - testing-strategies, debugging-patterns, performance-profiling
  
Phase 4: Production
  - security-review, observability-monitoring, incident-response
```

### devops-engineer
**Goal**: Automate everything, observe everything, fix anything.
```
Phase 1: Infrastructure
  - infrastructure-as-code → IaC patterns with Terraform/Bicep
  - azure-deployment-operations → Azure-native pipelines
  
Phase 2: Automation
  - azure-devops-automation → Pipelines, releases, gates
  - git-workflow → Branching strategies, PR automation
  
Phase 3: Reliability
  - observability-monitoring → Full-stack observability
  - incident-response → SRE practices, runbooks
  
Phase 4: Security
  - security-review → Supply chain, secrets, compliance
  - distribution-security → Secure packaging, signing
```

### technical-writer
**Goal**: Documentation that developers actually read.
```
Phase 1: Foundations
  - doc-hygiene → Anti-drift, living documents
  - markdown-mermaid → Diagrams that explain
  
Phase 2: Technical Depth
  - api-documentation → OpenAPI, examples, versioning
  - documentation-quality-assurance → Audit, preflight, quality
  
Phase 3: Publication
  - writing-publication → Style, voice, audience
  - md-to-word → Professional document export
```

### researcher
**Goal**: Rigorous methodology from question to publication.
```
Phase 1: Foundation
  - research-first-development → Research-before-code workflow
  - academic-research → Literature review, methodology
  
Phase 2: Execution
  - literature-review → Systematic review, gap analysis
  - citation-management → Zotero, BibTeX, citation styles
  
Phase 3: Analysis
  - practitioner-research → Action research, case studies
  - knowledge-synthesis → Cross-domain pattern extraction
  
Phase 4: Publication
  - academic-paper-drafting → Structure, argumentation, peer review
```

### ai-engineer
**Goal**: Build intelligent agents that earn trust.
```
Phase 1: Foundations
  - prompt-engineering → Effective prompts, chain-of-thought
  - llm-model-selection → Model capabilities, cost/quality tradeoffs
  
Phase 2: Architecture
  - ai-agent-design → Agent patterns, tool use, memory
  - rag-architecture → Retrieval-augmented generation
  
Phase 3: Advanced
  - multi-agent-orchestration → Agent collaboration, handoffs
  - mcp-development → Model Context Protocol servers
  
Phase 4: Trust
  - appropriate-reliance → Calibrated trust, transparency
```

### alex-architect
**Goal**: Master Alex's cognitive architecture for contribution.
```
Phase 1: Core Concepts
  - cognitive-symbiosis → Partnership paradigm
  - north-star → Guiding principles
  
Phase 2: Memory Systems
  - skill-building → Trifecta pattern
  - brain-qa → Validation and health
  
Phase 3: Features
  - research-first-development → Knowledge-before-code
  - meditation → Knowledge consolidation
  
Phase 4: Advanced
  - heir-sync-management → Multi-platform architecture
  - vscode-extension-patterns → Extension development
  - chat-participant-patterns → @alex participant
  - mcp-development → MCP tool integration
```

## Starting a Journey

When user invokes `/journey <name>`:

1. **Confirm journey** and show the skill progression
2. **Assess starting point** — which skills do they already have?
3. **Create learning plan** — order skills by dependency and user gaps
4. **Begin Phase 1** — load first skill with `/learn`
5. **Track progress** — check off skills as user completes them
6. **Milestone celebrations** — acknowledge phase completions
7. **Meditate periodically** — consolidate learning every 3-4 skills

## Progress Tracking

Store progress in `.alex/journeys/<journey-name>.json`:
```json
{
  "journey": "frontend-developer",
  "startedAt": "2026-02-28",
  "currentPhase": 2,
  "completedSkills": ["ui-ux-design", "svg-graphics"],
  "nextSkill": "vscode-extension-patterns"
}
```

## Example Interaction

```
User: /journey frontend-developer

Alex: 🎯 **Frontend Developer Journey**

You'll master 8 skills across 4 phases over 2-3 weeks:

**Phase 1: Foundation** (this week)
- [ ] ui-ux-design — Design principles, accessibility
- [ ] svg-graphics — Scalable graphics mastery

**Phase 2: Implementation** (next week)
- [ ] vscode-extension-patterns — Component architecture
- [ ] chat-participant-patterns — Interactive UI

**Phase 3: Quality**
- [ ] testing-strategies — Comprehensive testing
- [ ] debugging-patterns — Efficient debugging
- [ ] code-review — Peer review excellence

**Phase 4: Polish**
- [ ] brand-asset-management — Visual consistency

Ready to begin with **ui-ux-design**? I'll assess what you already know.
```

> **Revert Avatar**: Call `alex_cognitive_state_update` with `state: "persona"` when journey paused/completed.
