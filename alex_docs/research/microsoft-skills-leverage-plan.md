# Microsoft Skills Repository Leverage Plan

> Leveraging [microsoft/skills](https://github.com/microsoft/skills) to enhance Alex's cognitive architecture.

**Repository**: [fabioc-aloha/skills](https://github.com/fabioc-aloha/skills) (fork) | **License**: MIT | **Last Updated**: April 14, 2026

---

## Executive Summary

Imported **7 skills**, **5 agents**, **3 prompts**, and **1 muscle** from Microsoft's skills repository. Remaining high-value items: KQL skill, fresh-first principle, self-correction lookup tables.

| Category | Completed | Remaining |
|----------|:---------:|:---------:|
| Skills | 7 | 3 |
| Agents | 5 | — |
| Prompts | 3 | 1 |
| Patterns | 1 (Ralph Loop) | 3 |

---

## Part 1: Source Inventory

### Microsoft Skills Repository (132 total)

| Category | Count | Suffix | Notes |
|----------|:-----:|--------|-------|
| Core | 9 | — | Tooling, infrastructure, language-agnostic |
| Python | 41 | `-py` | Foundry, AI Services, Data, Messaging, Entra |
| .NET | 29 | `-dotnet` | Foundry, M365, Data, Messaging, Entra |
| TypeScript | 25 | `-ts` | Foundry, M365, Data, Messaging, Frontend |
| Java | 26 | `-java` | Foundry, Communication, Data, Messaging |
| Rust | 7 | `-rust` | Entra, Data, Messaging |

### Repository Structure (Deep Dive: April 14, 2026)

```
C:\Development\skills/
├── .github/
│   ├── skills/                        # 11 core skills
│   ├── prompts/                       # 5 prompts
│   ├── plugins/microsoft-foundry/     # 39 AI SDK skills
│   ├── agents/                        # Agent personas
│   └── scripts/                       # 2 Python scripts (low value)
├── hooks/continual-learning/          # Session hooks
└── tests/harness/                     # TypeScript quality infrastructure
    ├── ralph-loop.ts                  # Iterative improvement
    ├── evaluator.ts                   # Code validation
    ├── criteria-loader.ts             # Parse acceptance criteria
    └── feedback-builder.ts            # LLM-actionable feedback
```

---

## Part 2: Implementation Status

### Completed (April 14, 2026)

#### Skills (7)

| Skill | Description |
|-------|-------------|
| `copilot-sdk` | Copilot SDK patterns (Node.js, Python, Go, .NET), tools, hooks, MCP, BYOK |
| `mcp-builder` | MCP server development (TypeScript, Python, C#), tool design, testing |
| `skill-creator` | Azure SDK skill creation guide, acceptance criteria, test scenarios |
| `cloud-solution-architect` | 10 design principles, 6 architecture styles, 44 design patterns, WAF |
| `frontend-design-review` | Design system compliance, 3 quality pillars, accessibility |
| `entra-agent-id` | Agent Identity Blueprint creation via Graph beta API |
| `ralph-loop` | Iterative quality improvement (generate → evaluate → feedback → regen) |

**Location**: `.github/skills/{skill-name}/SKILL.md`

#### Agents (5)

| Agent | Role |
|-------|------|
| `Backend` | FastAPI, Pydantic, Cosmos DB patterns, dependency injection |
| `Frontend` | React/TypeScript UI, Tailwind, React Query, accessibility-first |
| `Infrastructure` | Bicep modules, Container Apps, deployment automation, cost optimization |
| `Planner` | Task decomposition, milestone planning, dependency graphs, estimation |
| `Presenter` | Demos, slide design, executive summaries, stakeholder documentation |

**Location**: `.github/agents/alex-{agent}.agent.md`

#### Prompts (3)

| Prompt | Purpose |
|--------|---------|
| `code-review-checklist.prompt.md` | 5-dimension code review checklist |
| `create-store.prompt.md` | Zustand stores with TypeScript, devtools, persistence |
| `add-endpoint.prompt.md` | FastAPI endpoints with Pydantic, error handling |

#### Muscles (1)

| Muscle | Description |
|--------|-------------|
| `ralph-loop.cjs` | CLI + API for iterative content improvement (449 lines) |

Components: ContentEvaluator, FeedbackBuilder, RalphLoopController

---

## Part 3: Remaining Work

### Tier 1: Immediate (High Value)

| Priority | Item | Type | Effort |
|:--------:|------|------|--------|
| 1 | `kql` skill | Skill | Medium |
| 2 | Fresh-first principle (I9) | Principle | Low |
| 3 | Self-correction tables | Pattern | Medium |

**Self-correction tables to add:**
- `debugging-patterns` — Error patterns → diagnostic steps
- `root-cause-analysis` — Symptom → likely cause mapping
- `vscode-extension-patterns` — VS Code API error → fix mapping

### Tier 2: Near-Term (Medium Value)

| Priority | Item | Type | Effort |
|:--------:|------|------|--------|
| 4 | `microsoft-docs` skill | Skill | Low |
| 5 | Acceptance criteria pattern | Pattern | Medium |
| 6 | `scaffold-foundry-app.prompt` | Prompt | Medium |

### Tier 3: Research (Future)

| Item | Type | Notes |
|------|------|-------|
| Continual learning hooks | Architecture | Requires extension integration |
| Sensei scoring | Pattern | Map to Alex skill quality tiers |
| SDK skills (39) | Skills | Import on-demand per project |

### Deprioritized

| Item | Reason |
|------|--------|
| `github-issue-creator` | Alex already handles issue formatting |
| `podcast-generation` | Too specialized, low reuse |
| `create-node.prompt` | Project-specific (React Flow) |

---

## Part 4: Proposed Architecture Improvements

Based on [Alex vs Microsoft Skills Comparison](./alex-vs-microsoft-skills-comparison.md).

### A1. Self-Correction Lookup Tables (HIGH VALUE)

Error → fix mapping tables reduce retry cascades.

**Example from Microsoft KQL skill:**

| Error message contains | Likely cause | Fix |
|---|---|---|
| `is of a 'dynamic' type` | Dynamic column in `by`/`on`/`order by` | Wrap in `tostring()`/`tolong()` |
| `Only equality is allowed` | Range predicate in join condition | Pre-bucket with `bin()` |

**Target skills:** `debugging-patterns`, `root-cause-analysis`, `vscode-extension-patterns`, `azure-architecture-patterns`, `testing-strategies`

### A2. Acceptance Criteria Pattern (MEDIUM VALUE)

Add `references/acceptance-criteria.md` with ✅/❌ code patterns:

```markdown
### ✅ Correct
from azure.identity import DefaultAzureCredential

### ❌ Incorrect
credential = {"key": "abc123"}  # Hardcoded credentials
```

**Target skills:** `vscode-extension-patterns`, `chat-participant-patterns`, `mcp-development`, `azure-architecture-patterns`

### A3. Fresh-First Principle (HIGH VALUE)

Add to copilot-instructions.md Safety Imperatives:

```markdown
I9: VERIFY before implementing — search official docs for SDK/API patterns
```

Add "Verify First" sections to: `azure-architecture-patterns`, `vscode-extension-patterns`, `microsoft-graph-api`

### A4. Skill Structure Enhancement (LOW EFFORT)

**Current:**
```
.github/skills/{name}/
├── SKILL.md
└── synapses.json
```

**Proposed (optional additions):**
```
.github/skills/{name}/
├── SKILL.md
├── synapses.json
└── references/                    # Optional
    ├── acceptance-criteria.md
    └── self-correction-table.md
```

### A5. Existing Skill Enhancements

| Skill | Enhancement | Effort |
|-------|-------------|--------|
| `debugging-patterns` | Add self-correction lookup table | Low |
| `root-cause-analysis` | Add symptom → cause mapping | Low |
| `anti-hallucination` | Add fresh-first principle section | Low |
| `skill-building` | Add acceptance criteria guidance | Medium |
| `vscode-extension-patterns` | Add VS Code error → fix table | Medium |

### A6. Learning Hooks Research (FUTURE)

Microsoft's `continual-learning` hook observes tool outcomes and persists learnings.

**Alignment with Alex:**
- Global learnings → AI-Memory/ (exists)
- Local learnings → .github/episodic/ or workspace memory
- Session hooks → Could integrate with Alex extension

**Research questions:**
1. Can VS Code extension trigger on tool use?
2. Where to persist learnings (SQLite vs JSON)?
3. How to integrate with meditation/consolidation?

---

## Part 5: Research Findings

### High-Value Assets Discovered

#### Core Skills

| Skill | Value | Status |
|-------|-------|:------:|
| `copilot-sdk` | Build Copilot-powered apps, MCP servers, BYOK, deployment | ✅ |
| `mcp-builder` | MCP server patterns (Python/Node/C#) | ✅ |
| `kql` | KQL mastery — gotchas, join patterns, memory safety, self-correction table | ⏳ |
| `continual-learning` | Auto-learning between sessions, two-tier memory | ⏳ |
| `microsoft-docs` | Query official MS docs via Learn MCP Server | ⏳ |

#### Quality Patterns

| Pattern | Description | Status |
|---------|-------------|:------:|
| **Ralph Loop** | Iterative gen → eval → feedback → regen until threshold | ✅ |
| **Sensei Scoring** | Skill quality tiers based on frontmatter completeness | — |
| **Acceptance Criteria** | `references/acceptance-criteria.md` with ✅/❌ patterns | — |

#### Hooks Architecture (Continual Learning)

```
learn.sh <event>
├── sessionStart   → Query DBs, surface top learnings
├── postToolUse    → Log tool name + result (3ms overhead)
└── sessionEnd     → Analyze patterns, persist insights, compact old data
```

**Two-Tier Memory** (aligns with Alex's global/local):
- **Global** (`~/.copilot/learnings.db`) — Cross-project insights
- **Local** (`.copilot-memory/learnings.db`) — Repo conventions

#### Microsoft Foundry Plugin Skills (39)

Specialized Azure AI SDK skills with acceptance criteria:

| Skill | Languages |
|-------|-----------|
| `azure-ai-projects-*` | py, dotnet, ts, java |
| `azure-ai-agents-*` | Multiple |
| `azure-search-documents-*` | py, dotnet, ts |
| `azure-ai-contentsafety-*` | py, ts, java |
| `m365-agents-*` | py, dotnet, ts |

**Import selectively based on project needs.**

### Key Insights

1. **KQL Skill is a Gem**: 300+ lines including dynamic type discipline, join pitfalls, memory-safe patterns, self-correction table
2. **Continual Learning Aligns with Alex**: Two-tier memory mirrors AI-Memory + workspace; decay mechanism (60-day TTL) prevents bloat
3. **Agents.md Core Principles**: "Think Before Coding", "Simplicity First", "Surgical Changes", "Goal-Driven Execution"
4. **Test Harness is Sophisticated**: `criteria-loader.ts`, `evaluator.ts`, `feedback-builder.ts`

---

## Part 6: Risk Assessment

| Risk | Mitigation |
|------|------------|
| Token bloat from too many skills | Selective import — follow "context rot" warning |
| Format incompatibility | Convert to Alex SKILL.md format before import |
| Stale/outdated patterns | Check last update dates, prefer recently maintained |
| Duplicate coverage | Cross-reference against existing 160+ Alex skills |

---

## Success Metrics

- [x] 5-10 high-value skills imported (7)
- [x] Ralph Loop implemented as muscle + skill
- [x] No token waste — skills earn their context space
- [x] Local repo exploration completed (39 Foundry plugin skills discovered)
- [ ] Sensei scoring mapped to Alex skill quality tiers
- [ ] Test scenarios created for imported skills
- [ ] KQL skill imported
- [ ] Continual learning hook evaluated

---

## References

- [Skill Explorer](https://microsoft.github.io/skills/) — Browse all 132 skills
- [Context-Driven Development Blog](https://devblogs.microsoft.com/all-things-azure/context-driven-development-agent-skills-for-microsoft-foundry-and-azure/)
- [Ralph Loop / Sensei Patterns](https://github.com/microsoft/GitHub-Copilot-for-Azure/tree/main/.github/skills/sensei)
- [Test Harness](https://github.com/fabioc-aloha/skills/tree/main/tests)
