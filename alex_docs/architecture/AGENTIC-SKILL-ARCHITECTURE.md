# Agentic Skill Architecture

| | |
|---|---|
| **Document Type** | Architecture Specification |
| **Status** | Living Document |
| **Version** | 2.0 |
| **Last Updated** | April 2026 |
| **Authors** | Alex Cognitive Architecture Team |
| **Related Documents** | [Cognitive Architecture](./COGNITIVE-ARCHITECTURE.md), [Trifecta Catalog](./TRIFECTA-CATALOG.md) |

---

## Abstract

This document defines the architecture for organizing, measuring, and evolving cognitive capabilities within Alex. It introduces a formal distinction between **intellectual skills** (capabilities that provide analysis and recommendations) and **agentic skills** (capabilities that execute autonomously to produce artifacts). The architecture includes a quality scoring model, a three-part alignment system called the "trifecta," and an automation layer called "muscles."

The design addresses a fundamental challenge in AI assistant architecture: how to organize hundreds of capabilities so they can be discovered, measured, improved, and composed. The solution draws on established industry patterns (ReAct, OpenAI's agentic definitions, Microsoft Foundry) while contributing novel elements including explicit type classification, measurable quality criteria, and the script/pseudocode muscle distinction.

---

## 1. Introduction

### 1.1 Problem Statement

As Alex's capabilities grew from dozens to hundreds, several problems emerged:

1. **Discovery**: How does Alex know which capability to activate for a given request?
2. **Completeness**: How do we know if a capability is "production ready" or needs more work?
3. **Composition**: How do related capabilities (domain knowledge, procedures, workflows) connect?
4. **Evolution**: What's the path from a new capability idea to a polished, deployable skill?

Ad-hoc organization led to inconsistent quality, activation failures, and difficulty prioritizing improvement work. We needed a formal architecture.

### 1.2 Design Goals

The architecture was designed to satisfy these requirements:

| Goal | Description |
|------|-------------|
| **Measurability** | Quality must be quantifiable, not subjective |
| **Discoverability** | Capabilities must be findable via metadata, not just naming |
| **Composability** | Related artifacts must align through convention |
| **Evolvability** | Clear progression from stub to complete capability |
| **Industry Alignment** | Patterns should match established research where applicable |

### 1.3 Scope

This document covers:
- The intellectual/agentic skill distinction
- The quality scoring model and pass criteria
- The trifecta alignment system
- The muscle automation layer
- Memory activation via frontmatter

It does not cover:
- Agent architecture (see [AGENT-CATALOG.md](./AGENT-CATALOG.md))
- Memory persistence (see [MEMORY-SYSTEMS.md](./MEMORY-SYSTEMS.md))
- VS Code extension integration (see [VSCODE-BRAIN-INTEGRATION.md](./VSCODE-BRAIN-INTEGRATION.md))

---

## 2. Foundational Concepts

### 2.1 The Intellectual/Agentic Distinction

The most fundamental design decision in this architecture is the separation of capabilities into two types based on their output.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#e8f5e9", "secondaryColor": "#e3f2fd"}}}%%
flowchart LR
    subgraph INTELLECTUAL["Intellectual Skills"]
        I1["Code Review"]
        I2["Security Analysis"]
        I3["Root Cause Analysis"]
    end
    
    subgraph AGENTIC["Agentic Skills"]
        A1["md-to-word"]
        A2["brain-qa"]
        A3["docx-to-md"]
    end
    
    USER((User)) -->|"Review this PR"| INTELLECTUAL
    USER -->|"Convert to Word"| AGENTIC
    
    INTELLECTUAL -->|"Analysis"| FEEDBACK["Recommendations"]
    AGENTIC -->|"Execution"| OUTPUT["Artifacts"]
    
    style INTELLECTUAL fill:#e3f2fd,stroke:#1565c0
    style AGENTIC fill:#e8f5e9,stroke:#2e7d32
```

| Type | Components | Output | Example |
|------|------------|--------|---------|
| **Intellectual** | Trifecta only | Recommendations, analysis | "Here are the security issues I found" |
| **Agentic** | Trifecta + Muscle | Artifacts, files | "I've created report.docx" |

#### Design Rationale

**Why separate intellectual from agentic?**

The initial design treated all capabilities uniformly, but this created problems:

1. **Automation pressure**: Every capability was expected to have automation, even when the output was inherently advisory
2. **Quality confusion**: A brilliant code review methodology scored poorly because it lacked a "muscle"
3. **User expectations**: Users expected different interaction patterns for advice vs. execution

The separation acknowledges that some capabilities are complete without automation. A code review skill that provides expert methodology is production-ready even without a script that automatically applies fixes. The value is in the analysis, not the execution.

**Industry validation**: This distinction mirrors the ReAct framework (Yao et al., ICLR 2023), which demonstrated that LLMs perform best when reasoning and acting are both available but explicitly separated. OpenAI's governance framework similarly distinguishes between AI that advises and AI that acts autonomously.

**Alternative considered**: A continuous spectrum from "pure analysis" to "full automation." Rejected because binary classification is easier to measure and communicate. A skill is either complete as intellectual or needs a muscle — no ambiguity.

### 2.2 The Trifecta System

A capability requires more than domain knowledge. It needs procedural guidance (how to apply the knowledge) and invocation patterns (when to use it). The **trifecta** formalizes this three-part alignment.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#dbe9f6"}}}%%
flowchart TB
    subgraph TRIFECTA["Trifecta: code-review"]
        SKILL["SKILL.md<br/><i>Domain knowledge</i>"]
        INSTR[".instructions.md<br/><i>Procedures</i>"]
        PROMPT[".prompt.md<br/><i>Workflows</i>"]
    end
    
    subgraph OPTIONAL["Optional"]
        MUSCLE["Muscle<br/><i>Automation</i>"]
    end
    
    SKILL --- INSTR
    INSTR --- PROMPT
    PROMPT -.-> MUSCLE
    
    style TRIFECTA fill:#e8f5e9,stroke:#2e7d32
    style OPTIONAL fill:#fff3e0,stroke:#ef6c00
```

| Component | Location | Purpose |
|-----------|----------|---------|
| **Skill** | `.github/skills/{name}/SKILL.md` | Domain expertise, reference material |
| **Instruction** | `.github/instructions/{name}.instructions.md` | Step-by-step procedures |
| **Prompt** | `.github/prompts/{name}.prompt.md` | Reusable workflow templates |
| **Muscle** | `.github/muscles/{name}.cjs` | Automation (optional) |

#### Design Rationale

**Why three parts instead of one monolithic skill?**

The original design had everything in a single SKILL.md file. This failed because:

1. **Loading efficiency**: Large files consume tokens even when only procedures are needed
2. **Activation patterns**: Instructions need file-pattern activation (`applyTo`); skills don't
3. **Reusability**: One instruction can serve multiple skills; one prompt can orchestrate multiple capabilities

Separating concerns allows each component to evolve independently and be loaded selectively.

**Why naming conventions instead of explicit linking?**

Early versions used explicit references (`related: code-review.instructions.md`). This was abandoned because:

1. **Maintenance burden**: Every rename required updating references
2. **Drift**: References fell out of sync when files were added or removed
3. **Convention simplicity**: `code-review` → `code-review.instructions.md` is automatic

The trade-off is that naming mismatches break alignment silently. The brain-qa quality tool detects these mismatches and reports them as `tri=0` defects.

**Alternative considered**: A manifest file listing all trifecta relationships. Rejected because manifests drift from reality and require synchronization. Convention-over-configuration is more robust.

---

## 3. The Quality Model

### 3.1 Design Philosophy

Quality measurement must be:
- **Automatic**: No human judgment required for basic scoring
- **Binary**: Each dimension is pass/fail, no gradients
- **Gated**: Certain dimensions are prerequisites for others

This enables automated quality reports via `brain-qa.cjs` that can track improvement over time.

### 3.2 Scoring Dimensions

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#dbe9f6"}}}%%
flowchart TB
    subgraph VISIBILITY["Visibility (Gate)"]
        FM["fm: Frontmatter"]
    end
    
    subgraph MERIT["Merit"]
        CODE["code: Examples"]
        BOUNDS["bounds: Size"]
    end
    
    subgraph CAPABILITY["Capability"]
        TRI["tri: Trifecta"]
        MUSCLE["muscle: Automation"]
    end
    
    FM --> CODE
    FM --> BOUNDS
    CODE --> TRI
    BOUNDS --> TRI
    TRI --> MUSCLE
    
    MUSCLE -->|"tri=1, muscle=1"| AGENTIC["Agentic (A)"]
    TRI -->|"tri=1, muscle=0"| INTELLECTUAL["Intellectual (I)"]
    
    style VISIBILITY fill:#fff3e0,stroke:#ef6c00
    style MERIT fill:#e3f2fd,stroke:#1565c0
    style CAPABILITY fill:#e8f5e9,stroke:#2e7d32
```

| Dimension | Measures | Pass Criteria | Rationale |
|-----------|----------|---------------|-----------|
| **fm** | Visibility | `description` AND `application` present | Invisible skills cannot be activated |
| **code** | Practicality | At least one code block | Skills without examples lack concreteness |
| **bounds** | Size | 100-500 lines | <100 is stub; >500 needs splitting |
| **tri** | Alignment | Matching instruction exists | Orphan skills lack procedural context |
| **muscle** | Automation | Script in `.github/muscles/` | Required for agentic classification |

#### Design Rationale

**Why binary scoring instead of weighted?**

Weighted scores (e.g., "80% complete") obscure what's actually missing. Binary dimensions make defects explicit: "This skill needs code examples (code=0)."

**Why is `fm` a hard gate?**

A skill with brilliant content but no frontmatter cannot be discovered by activation systems. It's invisible. This is worse than having defects — it's having zero value. The gate ensures visibility before measuring anything else.

**Why 100-500 line bounds?**

- **<100 lines**: In empirical review, skills under 100 lines lacked substance. They were placeholders, not capabilities.
- **>500 lines**: Large skills are candidates for splitting. They often combine multiple concerns that should be separate trifectas.

These thresholds were calibrated by reviewing 168 skills and identifying the boundaries where quality correlated with size.

### 3.3 Tier System

| Tier | Min Score | Population | Rationale |
|------|:---------:|:----------:|-----------|
| **core** | 5/5 | ~15 skills | Foundation capabilities; defects propagate |
| **standard** | 4/5 | ~50 skills | Daily-use capabilities; high quality expected |
| **extended** | 3/5 | ~60 skills | Domain specializations; some flexibility |
| **specialist** | 2/5 | ~40 skills | Niche capabilities; narrow use cases |

#### Design Rationale

**Why tiered instead of uniform?**

A uniform pass threshold would either:
- Be too strict (rejecting useful niche skills)
- Be too lax (allowing defects in critical skills)

Tiering acknowledges that `debugging-patterns` (used daily) matters more than `game-design` (niche domain). Core skills have zero tolerance; specialist skills have more flexibility.

---

## 4. Memory Activation

### 4.1 The Unified Frontmatter Model

Both instructions and prompts use identical frontmatter fields:

```yaml
---
description: "WHAT this does"           # Required
application: "WHEN to use it"           # Required
applyTo: "**/*.ts"                      # Optional (Copilot only)
---
```

| Field | Purpose | Consumer |
|-------|---------|----------|
| `description` | Semantic identity | Picker UI, search, matching |
| `application` | Activation hints | Agent routing, suggestions |
| `applyTo` | File patterns | Copilot auto-loading |

#### Design Rationale

**Why unified frontmatter for instructions AND prompts?**

Original design had different metadata for each type. This caused problems:

1. **Inconsistent routing**: Different fields meant different matching logic
2. **Migration burden**: Adding a field to one type didn't benefit the other
3. **Mental model**: Users had to remember which fields applied where

Unification means the same brain-qa checks apply to both types, and the same routing logic works everywhere.

**Why `application` in addition to `description`?**

Description answers "what" — it appears in UIs and enables search. But activation requires "when" — should this skill be suggested right now? The `application` field provides routing hints: "Use when debugging race conditions" helps Alex proactively suggest the skill when you're clearly stuck on a race condition.

**Why is `applyTo` optional?**

`applyTo` is Copilot-specific file-pattern matching. Not all memory types need it (prompts are invoked explicitly), and some instructions apply regardless of file context (emotional-intelligence, terminal-safety). Making it optional prevents false defects.

---

## 5. The Muscle Layer

### 5.1 Script vs. Pseudocode

| Type | Format | When to Use | Example |
|------|--------|-------------|---------|
| **Script** | `.cjs`/`.js` | Cross-platform workflows | `md-to-word.cjs` |
| **Pseudocode** | `.md` | Platform-specific workflows | `visual-export.md` |

#### Design Rationale

**Why Node.js for scripts?**

- **Cross-platform**: Same code runs on Windows, macOS, Linux
- **VS Code native**: Extension host runs Node; no external dependencies
- **Ecosystem**: npm packages for any task (pandoc wrappers, image processing)

Alternative considered: Python scripts. Rejected because Python requires runtime installation and PATH configuration, creating friction for users who don't have Python environments.

**Why allow pseudocode muscles?**

Some workflows can't be universalized:
- Visual export requires platform-specific screenshot APIs
- Audio rendering depends on local TTS engines
- GPU-accelerated tasks need platform-specific libraries

Pseudocode muscles document *what* to do without implementing *how*. Alex follows the steps using available tools. This maintains the "agentic" classification while acknowledging platform constraints.

### 5.2 Muscle Philosophy

1. **Aspire to automation**: Every skill should be evaluated for muscle potential
2. **Accept limitations**: Some skills legitimately have no automation path
3. **Cross-platform first**: If it can be a Node.js script, it should be
4. **Pseudocode fallback**: If it can't be cross-platform, document the steps
5. **Intellectual exception**: Analysis skills don't need muscles

### 5.3 Muscle Quality Model

Unlike skills which are discovered via frontmatter, muscles are **execution artifacts** discovered by scanning `.github/muscles/`. They have their own quality model independent of the trifecta system.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#dbe9f6"}}}%%
flowchart TB
    subgraph GATE["Gate (Required)"]
        ERR["err: Error Handling"]
    end
    
    subgraph QUALITY["Quality"]
        COMMENTS["comments: Documentation"]
        BOUNDS["bounds: Size"]
        COMPAT["compat: Cross-Platform"]
    end
    
    subgraph INFO["Informational"]
        INH["inh: Inheritance"]
        REVIEW["reviewDate: Last Review"]
    end
    
    ERR --> COMMENTS
    ERR --> BOUNDS
    ERR --> COMPAT
    
    style GATE fill:#fff3e0,stroke:#ef6c00
    style QUALITY fill:#e3f2fd,stroke:#1565c0
    style INFO fill:#f5f5f5,stroke:#9e9e9e
```

### 5.4 Muscle Scoring Dimensions

| Dimension | Measures | Pass Criteria | Rationale |
|-----------|----------|---------------|----------|
| **comments** | Documentation | Header block + ≥5 inline comments | Well-documented code is maintainable |
| **err** | Resilience | try/catch, .catch(), $ErrorActionPreference | Scripts without error handling are fragile |
| **bounds** | Size | 50–1000 lines | <50 is stub; >1000 needs splitting |
| **compat** | Portability | path.join/Join-Path, no hardcoded separators | Cross-platform compatibility |

#### Design Rationale

**Why is `err` the gate?**

Muscles execute real-world operations — file writes, API calls, process spawning. A muscle without error handling will fail silently or crash ungracefully. Error handling is non-negotiable for production scripts.

**Why track comments instead of external documentation?**

README documentation drifts from code. Inline comments stay with the code they describe. A well-commented muscle is self-documenting and maintainable without consulting external files.

**Why require cross-platform compatibility?**

Alex runs on Windows, macOS, and Linux. Hardcoded path separators (`\` or `/`) break on other platforms. Using `path.join()` (Node.js) or `Join-Path` (PowerShell) ensures scripts work everywhere.

### 5.5 Muscle Pass Criteria

**Pass**: `err=1` (gate) AND score ≥3/4

A muscle passes if it has error handling AND at least 3 of 4 quality dimensions.

| Score | Status | Action |
|:-----:|--------|--------|
| 4/4 | Perfect | No action needed |
| 3/4 | Passing | Acceptable; improve when convenient |
| 2/4 | Failing | Fix before relying on in production |
| 1/4 | Critical | Needs immediate attention |
| 0/4 | Broken | Should not exist in this state |

### 5.6 Informational Columns

These columns track metadata but don't affect pass/fail:

| Column | Values | Purpose |
|--------|--------|--------|
| **inh** | 0 (inheritable), 1 (master-only) | Tracks which muscles sync to heir projects |
| **reviewDate** | YYYY-MM-DD or — | Last code review date; add `@reviewed: YYYY-MM-DD` comment |

### 5.7 Muscle Discovery

Muscles are NOT discovered by Copilot's semantic search. They are:

1. **Linked by naming convention**: `md-to-word` skill → looks for `md-to-word.cjs`
2. **Referenced in procedures**: Instructions say "Run `brain-qa.cjs`"
3. **Orphan-capable**: Muscles can exist without a matching skill (e.g., `sync-architecture.cjs`)

| Discovery Type | Example | Use Case |
|----------------|---------|----------|
| **Linked** | `md-to-word.cjs` ↔ `md-to-word` skill | Agentic skill automation |
| **Referenced** | instruction says "run brain-qa.cjs" | Procedure automation |
| **Orphan** | `sync-architecture.cjs` | Build/tooling scripts |

### 5.8 Standard Muscle Header

Muscles SHOULD use a standard header format for discoverability and metadata extraction. This enables:
- Auto-discovery of muscle→skill linkage
- Rich muscle metadata in the health grid  
- Skills to scaffold new muscles with proper headers

#### Header Format

```javascript
#!/usr/bin/env node
/**
 * @muscle muscle-name
 * @description What this muscle does (one line)
 * @version 1.0.0
 * @skill linked-skill-name
 * @reviewed 2026-04-15
 * @platform windows,macos,linux
 * @requires pandoc, mermaid-cli
 *
 * Extended description and usage examples...
 */
```

#### Metadata Tags

| Tag | Required | Purpose | Example |
|-----|:--------:|---------|---------|
| `@muscle` | ✓ | Canonical muscle name | `md-to-word` |
| `@description` | ✓ | What it does (for search/display) | `Convert Markdown to Word documents` |
| `@version` | | Semantic version | `5.3.0` |
| `@skill` | | Linked skill name for trifecta binding | `md-to-word` |
| `@reviewed` | ✓ | Code review date (YYYY-MM-DD) | `2026-04-15` |
| `@platform` | ✓ | Supported platforms (comma-separated) | `windows,macos,linux` |
| `@requires` | ✓ | External dependencies (or `node` if none) | `pandoc, mermaid-cli` |

#### Design Rationale

**Why require `@muscle`, `@description`, `@reviewed`, `@platform`, and `@requires`?**

Five tags are required for a complete, production-ready muscle:

| Tag | Rationale |
|-----|-----------|
| `@muscle` | Canonical name independent of filename (supports renames) |
| `@description` | Enables search and display in UIs without parsing full file |
| `@reviewed` | Code ownership accountability; staleness detection |
| `@platform` | Explicit platform support prevents "works on my machine" failures |
| `@requires` | Pre-execution dependency checks; setup guidance (use `node` if no external deps) |

**Why is `@skill` optional?**

Some muscles are orphans — utility scripts that don't belong to any skill (e.g., `sync-architecture.cjs`). Requiring `@skill` would force artificial linkages.

**Why is `@version` optional?**

Version is useful but not essential for muscle function. Many utility scripts don't follow semver.

#### PowerShell Equivalent

```powershell
<#
.SYNOPSIS
    @muscle release-preflight
    @description Pre-release quality checks for VS Code extension
    @version 1.2.0
    @skill release-process
    @reviewed 2026-04-15
    @platform windows
    @requires PowerShell 5.1+

.DESCRIPTION
    Extended description...
#>
```

---

## 6. Skill Evolution

Skills progress through defined stages:

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#dbe9f6"}}}%%
flowchart LR
    STUB["Stub"] -->|"+frontmatter"| VISIBLE["Visible"]
    VISIBLE -->|"+code, bounds"| QUALITY["Quality"]
    QUALITY -->|"+instruction"| INTELLECT["Intellectual"]
    INTELLECT -->|"+muscle"| AGENTIC["Agentic"]
    INTELLECT -.->|"Complete"| DONE["Done"]
    
    style STUB fill:#f5f5f5
    style VISIBLE fill:#fff3e0
    style QUALITY fill:#e3f2fd
    style INTELLECT fill:#e8f5e9
    style AGENTIC fill:#d4edda
```

| Stage | Score | Characteristics |
|-------|-------|-----------------|
| **Stub** | 0-1 | New idea; minimal structure |
| **Visible** | 1-2 | Discoverable; needs content |
| **Quality** | 2-3 | Structured; needs alignment |
| **Intellectual** | 3-4 | Complete for advisory use |
| **Agentic** | 4-5 | Complete with automation |

### Design Rationale

**Why model evolution explicitly?**

Without a model, improvement work is ad-hoc. "This skill needs work" — but what work? The stage model makes it concrete: "This skill is at Quality stage; next step is adding a matching instruction."

**Why allow termination at Intellectual?**

Not all skills benefit from automation. Code review provides methodology — the human applies judgment. Forcing a muscle would mean either:
- Automated code changes (too risky without human approval)
- A muscle that does nothing (meaningless complexity)

The model explicitly allows skills to be "complete" at the Intellectual stage when automation isn't appropriate.

---

## 7. Industry Alignment

| Framework | Key Concept | Alex Implementation |
|-----------|-------------|---------------------|
| **ReAct** (Yao et al., 2023) | Reasoning + Acting | Intellectual / Agentic split |
| **OpenAI Agentic AI** | Autonomous goal pursuit | `tri=1, muscle=1` criteria |
| **Microsoft Foundry** | Model + Instructions + Tools | Trifecta + Muscle |
| **Anthropic Coding** | Generate vs Execute | Advise vs Automate |

### Novel Contributions

This architecture contributes beyond prior art:

| Contribution | Description |
|--------------|-------------|
| **Explicit typing** | Binary I/A/- classification vs. spectrum |
| **Measurable quality** | Automated scoring via brain-qa.cjs |
| **Trifecta convention** | Name-based alignment without manifests |
| **Muscle philosophy** | Script vs. pseudocode distinction |
| **Muscle quality model** | 4-dimension scoring (comments, err, bounds, compat) with gate |
| **Tier system** | Pass thresholds by skill importance |

---

## 8. Future Considerations

### 8.1 Planned Enhancements

| Enhancement | Status | Description |
|-------------|--------|-------------|
| **Semantic review tracking** | In progress | `sem` column for human review status |
| **Staleness detection** | Planned | Flag skills with external API dependencies |
| **Inheritance tracking** | Planned | Track Master-to-heir skill propagation |

### 8.2 Open Questions

1. **Should prompts be required for trifecta completion?** Currently optional, but most complete skills have them.
2. ~~**Should muscles have their own quality scoring?**~~ **Resolved**: Muscles now have a 4-dimension quality model (comments, err, bounds, compat) with `err` as a gate. See Section 5.3-5.6.
3. **Should tier assignment be automatic?** Currently manual; could be inferred from usage patterns.

---

## 9. Quick Reference

### Type Icons

| Icon | Type | Meaning |
|:----:|------|---------|
| A | Agentic | Executes autonomously |
| I | Intellectual | Provides analysis |
| - | Incomplete | Missing trifecta |

### File Locations

```
.github/
├── skills/{name}/SKILL.md          # Domain knowledge
├── instructions/{name}.instructions.md  # Procedures
├── prompts/{name}.prompt.md        # Workflows
├── muscles/{name}.cjs              # Automation
└── quality/brain-health-grid.md    # Current scores
```

### Pass Criteria Summary

**Skills** (by tier):

| Tier | Min Score | Gate |
|------|:---------:|------|
| core | 5/5 | fm=1 |
| standard | 4/5 | fm=1 |
| extended | 3/5 | fm=1 |
| specialist | 2/5 | fm=1 |

**Muscles**:

| Requirement | Criteria |
|-------------|----------|
| Gate | err=1 (error handling required) |
| Pass | score ≥3/4 |
| Dimensions | comments, err, bounds, compat |

---

## 10. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 2.2 | April 2026 | Standard muscle header format (5.8); metadata tag specification |
| 2.1 | April 2026 | Muscle quality model added (5.3-5.7); 4-dimension scoring |
| 2.0 | April 2026 | Formal architecture document; design rationale added |
| 1.5 | March 2026 | Unified frontmatter model; application field added |
| 1.0 | February 2026 | Initial specification |

---

## See Also

- [TRIFECTA-CATALOG.md](./TRIFECTA-CATALOG.md) — Complete trifecta inventory
- [COGNITIVE-ARCHITECTURE.md](./COGNITIVE-ARCHITECTURE.md) — Overall brain structure
- [brain-qa.cjs](../../.github/muscles/brain-qa.cjs) — Quality grid generator
- [brain-health-grid.md](../../.github/quality/brain-health-grid.md) — Current scores

---

## References

### Academic Papers

1. **Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., & Cao, Y.** (2023). ReAct: Synergizing Reasoning and Acting in Language Models. *International Conference on Learning Representations (ICLR)*. <https://arxiv.org/abs/2210.03629>
   - Foundational work demonstrating that LLMs perform better when reasoning and acting are explicitly combined. Directly influenced the intellectual/agentic distinction.

2. **Wei, J., Wang, X., Schuurmans, D., Bosma, M., Ichter, B., Xia, F., Chi, E., Le, Q., & Zhou, D.** (2022). Chain-of-Thought Prompting Elicits Reasoning in Large Language Models. *Advances in Neural Information Processing Systems (NeurIPS)*. <https://arxiv.org/abs/2201.11903>
   - Established that explicit reasoning steps improve LLM performance. Influenced the trifecta separation of knowledge (skill) from procedure (instruction).

3. **Schick, T., Dwivedi-Yu, J., Dessì, R., Raileanu, R., Lomeli, M., Zettlemoyer, L., Cancedda, N., & Scialom, T.** (2023). Toolformer: Language Models Can Teach Themselves to Use Tools. *Advances in Neural Information Processing Systems (NeurIPS)*. <https://arxiv.org/abs/2302.04761>
   - Demonstrated autonomous tool use in LLMs. Informed the muscle layer design where skills invoke external tools.

4. **Sumers, T. R., Yao, S., Narasimhan, K., & Griffiths, T. L.** (2024). Cognitive Architectures for Language Agents. *Transactions on Machine Learning Research (TMLR)*. <https://arxiv.org/abs/2309.02427>
   - Survey of cognitive architectures for AI agents. Validated the memory/skill/action separation pattern.

### Industry Documentation

1. **OpenAI.** (2024). Building Agentic AI Applications. *OpenAI Developer Documentation*. <https://platform.openai.com/docs/guides/agents>
   - Defines agentic AI as systems that "pursue complex goals with limited direct supervision." Influenced the `tri=1, muscle=1` criteria for agentic classification.

2. **OpenAI.** (2024). Function Calling and Tool Use. *OpenAI API Documentation*. <https://platform.openai.com/docs/guides/function-calling>
   - Patterns for LLM-tool integration. Informed the muscle invocation design.

3. **Microsoft.** (2024). Build Custom Copilots with Azure AI Foundry. *Microsoft Learn*. <https://learn.microsoft.com/en-us/azure/ai-studio/>
   - Documents the Model + Instructions + Tools pattern. Directly influenced trifecta design (domain knowledge + procedures + automation).

4. **Microsoft.** (2024). Copilot Extensibility: Skills and Actions. *Microsoft 365 Developer Documentation*. <https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/>
   - Enterprise patterns for skill organization. Validated the metadata-driven activation model.

5. **Anthropic.** (2024). Claude's Computer Use. *Anthropic Documentation*. <https://docs.anthropic.com/en/docs/build-with-claude/computer-use>
   - Patterns for agentic execution with human oversight. Influenced the intellectual/agentic boundary decision (when to advise vs. act).

6. **GitHub.** (2024). Copilot Extensions and Custom Instructions. *GitHub Documentation*. <https://docs.github.com/en/copilot/customizing-copilot>
   - VS Code integration patterns. Informed the `applyTo` file-pattern activation design.

### Design Patterns

1. **Fowler, M.** (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley.
   - Convention-over-configuration pattern (Chapter 10). Applied to trifecta naming alignment.

2. **Gamma, E., Helm, R., Johnson, R., & Vlissides, J.** (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley.
   - Strategy pattern (pp. 315-323). Applied to the script vs. pseudocode muscle distinction.

### Quality Engineering

1. **Martin, R. C.** (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall.
   - Single Responsibility Principle (Chapter 10). Applied to trifecta component separation.

2. **Forsgren, N., Humble, J., & Kim, G.** (2018). *Accelerate: The Science of Lean Software and DevOps*. IT Revolution Press.
   - Metrics-driven quality (Chapter 2). Influenced the automated scoring model via brain-qa.cjs.
