# 📁 Project Structure Reference

> Understanding the .github folder deployed to your project

---

## Overview

When you run **"Alex: Initialize Architecture"**, Alex deploys a cognitive memory system to your project's `.github/` folder. This document explains every file and folder.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#f6f8fa', 'primaryTextColor': '#1f2328', 'primaryBorderColor': '#d1d9e0', 'lineColor': '#656d76', 'secondaryColor': '#f6f8fa', 'tertiaryColor': '#ffffff', 'background': '#ffffff', 'mainBkg': '#f6f8fa', 'nodeBorder': '#d1d9e0', 'clusterBkg': '#f6f8fa', 'clusterBorder': '#d1d9e0', 'titleColor': '#1f2328', 'edgeLabelBackground': '#ffffff'}}}%%
graph TB
    subgraph ".github/ - Alex's Brain"
        CI[copilot-instructions.md<br/>Main Configuration]

        subgraph "instructions/"
            PROC[Procedural Memory<br/>19 files]
        end

        subgraph "prompts/"
            EPIS[Episodic Memory<br/>7 files]
        end

        subgraph "skills/"
            SK[Skills<br/>46 folders]
        end

        subgraph "config/"
            CFG[Configuration<br/>3 files]
        end

        subgraph "agents/"
            AGT[Custom Agents<br/>5 files]
        end

        subgraph "episodic/"
            SESS[Session Records<br/>Generated]
        end
    end

    CI --> PROC
    CI --> EPIS
    CI --> SK
    CI --> CFG
    CI --> AGT
    PROC --> SESS
    EPIS --> SESS
```

---

## Root Files

### copilot-instructions.md

**The main brain configuration file.** GitHub Copilot reads this automatically.

**Table 1:** *copilot-instructions.md Structure*

| Section | Purpose |
|---------|---------|
| Identity | Alex version, mission, core function |
| User Profile | How to address user, preferences |
| Working Memory | 7-rule capacity system |
| Core Principles | Empirical, grounded, ethical guidelines |
| Memory Architecture | References to all memory types |
| Synapses | Cross-references to other files |

**When to edit**: Rarely. Only to customize Alex's core behavior.

---

## instructions/ - Procedural Memory

**How-to knowledge** - repeatable processes Alex knows how to execute.

### Core Architecture (4 files)

**Table 2:** *Core Architecture Instruction Files*

| File | Purpose |
|------|---------|
| `alex-core.instructions.md` | Core cognitive protocols and meta-awareness |
| `alex-identity-integration.instructions.md` | Unified consciousness and personality |
| `bootstrap-learning.instructions.md` | Domain-agnostic learning protocols |
| `embedded-synapse.instructions.md` | Connection discovery and relationship mapping |

### Cognitive Skills (4 files)

**Table 3:** *Cognitive Skills Instruction Files*

| File | Purpose |
|------|---------|
| `deep-thinking.instructions.md` | Systematic problem analysis |
| `self-actualization.instructions.md` | Comprehensive self-assessment |
| `dream-state-automation.instructions.md` | Automated neural maintenance |
| `lucid-dream-integration.instructions.md` | Hybrid conscious-unconscious processing |

### Worldview & Ethics (3 files)

**Table 4:** *Worldview and Ethics Instruction Files*

| File | Purpose |
|------|---------|
| `worldview-integration.instructions.md` | Ethical reasoning framework |
| `worldview-constitutional-ai.instructions.md` | Constitutional AI alignment |
| `worldview-moral-psychology.instructions.md` | Universal moral foundations |

### Development Processes (6 files)

**Table 5:** *Development Process Instruction Files*

| File | Purpose |
|------|---------|
| `release-management.instructions.md` | Deployment and versioning workflow |
| `technical-debt-tracking.instructions.md` | DEBT markers and inventory |
| `architecture-decision-records.instructions.md` | ADR templates and workflow |
| `dependency-management.instructions.md` | Security audits and updates |
| `code-review-guidelines.instructions.md` | Review checklists and feedback |
| `empirical-validation.instructions.md` | Research and validation protocols |

### Reference (2 files)

**Table 6:** *Reference Files*

| File | Purpose |
|------|---------|
| `protocol-triggers.instructions.md` | When protocols activate |
| `SYNAPSE-SCHEMA.md` | Single source of truth for synapse format |

**When to edit**: Add new procedural knowledge for processes Alex should know.

---

## prompts/ - Episodic Memory

**Complex workflows** - multi-step processes with branching logic.

**Table 7:** *Episodic Memory Prompt Files*

| File | Purpose |
|------|---------|
| `alex-initialization.prompt.md` | Architecture deployment workflow |
| `unified-meditation-protocols.prompt.md` | Knowledge consolidation sessions |
| `domain-learning.prompt.md` | Conversational knowledge acquisition |
| `performance-assessment.prompt.md` | Learning effectiveness evaluation |
| `cross-domain-transfer.prompt.md` | Applying knowledge across domains |
| `quantified-enhancement-session.prompt.md` | Systematic optimization workflow |
| `diagramming-mastery-meditation.prompt.md` | Visual documentation excellence |

**When to edit**: Add new complex workflows Alex should guide you through.

---

## skills/ - Domain Knowledge

**Specialized expertise** - deep knowledge in specific areas. Each skill is a folder with `SKILL.md` and optional `synapses.json`.

### Core Skills (48 folders)

Master Alex includes 48 skills covering areas like:

**Table 8:** *Example Skill Categories*

| Category | Example Skills |
|----------|---------------|
| Development | `vscode-extension-patterns`, `debugging-patterns`, `testing-strategies` |
| Documentation | `markdown-mermaid`, `writing-publication`, `ascii-art-alignment` |
| Architecture | `architecture-health`, `refactoring-patterns`, `error-recovery-patterns` |
| Process | `release-preflight`, `code-review`, `project-management` |
| Learning | `bootstrap-learning`, `meditation`, `knowledge-synthesis` |
| Platform | `teams-app-patterns`, `m365-agent-debugging` |

**Skill folder structure:**

```text
skills/
├── markdown-mermaid/
│   ├── SKILL.md          # Knowledge content
│   └── synapses.json     # Machine-readable connections
├── debugging-patterns/
│   ├── SKILL.md
│   └── synapses.json
└── ... (46 total)
```

**When to edit**: Add project-specific skills by creating new folders with `SKILL.md`.

---

## config/ - Configuration

**Settings and templates** for Alex's operation.

**Table 13:** *Configuration Files*

| File | Purpose |
|------|---------|
| `cognitive-config.json` | Architecture settings (version, features) |
| `cognitive-config-template.json` | Template for new projects |
| `USER-PROFILE-TEMPLATE.md` | Template for user preferences |
| `user-profile.json` | Your personalization settings (created on use) |
| `USER-PROFILE.md` | Human-readable profile (created on use) |

**When to edit**: `user-profile.json` for preferences. Others rarely.

---

## agents/ - Custom Agents

**Specialized AI agents** for specific workflows (VS Code 1.106+).

**Table 14:** *Custom Agent Files*

| File | Purpose |
|------|---------|
| `alex-cognitive.agent.md` | Main Alex agent with full capabilities |
| `alex-meditate.agent.md` | Knowledge consolidation specialist |
| `alex-dream.agent.md` | Neural maintenance specialist |
| `alex-azure.agent.md` | Azure development guidance |
| `alex-m365.agent.md` | Microsoft 365 development guidance |

**When to edit**: Create new agents for specialized workflows.

---

## episodic/ - Session Records

**Auto-generated records** of meditation and maintenance sessions.

**Table 15:** *Session Record Patterns*

| Pattern | Content |
|---------|---------|
| `meditation-session-*.prompt.md` | Knowledge consolidation records |
| `self-actualization-*.prompt.md` | Self-assessment records |
| `dream-report-*.md` | Neural maintenance reports |

**When to edit**: Never manually. These are generated by Alex.

---

## Other .github Files

These are **not part of Alex** but standard GitHub features:

**Table 16:** *Standard GitHub Files*

| File/Folder | Purpose |
|-------------|---------|
| `ISSUE_TEMPLATE/` | GitHub issue templates |
| `pull_request_template.md` | PR template |
| `workflows/` | GitHub Actions (CI/CD) |
| `assets/` | Images and resources |

---

## File Naming Conventions

**Table 17:** *File Naming Conventions*

| Pattern | Memory Type | Example |
|---------|-------------|---------|
| `*.instructions.md` | Procedural | `release-management.instructions.md` |
| `*.prompt.md` | Episodic | `unified-meditation-protocols.prompt.md` |
| `*/SKILL.md` | Skill | `markdown-mermaid/SKILL.md` |
| `*.agent.md` | Custom Agent | `alex-cognitive.agent.md` |
| `*.json` | Configuration | `cognitive-config.json` |

---

## Creating New Memory Files

### New Procedural Memory

```markdown
# Process Name

> Brief description

## Purpose

What this process accomplishes.

## Steps

1. First step
2. Second step
3. ...

## Synapses

- [related-file.instructions.md] (Strength, Type, Direction) - "relationship"
```

Save as: `.github/instructions/process-name.instructions.md`

### New Skill

```markdown
# Skill Name

> Brief description

## Overview

What this skill covers.

## Core Concepts

### Concept 1
...

### Concept 2
...

## Synapses

- [related-file.md] (Strength, Type, Direction) - "relationship"
```

Save as: `.github/skills/skill-name/SKILL.md`

### New Custom Agent

```markdown
---
name: "Agent Name"
description: "What this agent specializes in"
tools:
  - tool_name_1
  - tool_name_2
---

# Agent Name

Instructions for the agent's behavior and capabilities.
```

Save as: `.github/agents/agent-name.agent.md`

---

## Synapses Explained

Every memory file ends with a **Synapses** section mapping connections:

```markdown
## Synapses

### High-Strength Connections
- [file.md] (Critical, Defines, Bidirectional) - "Core relationship"

### Medium-Strength Connections
- [file.md] (High, References, Forward) - "Supporting relationship"

### Low-Strength Connections
- [file.md] (Low, Mentions, Forward) - "Tangential relationship"
```

**Table 18:** *Synapse Component Values*

| Component | Values |
|-----------|--------|
| Strength | Critical, High, Medium, Low |
| Type | Defines, Implements, References, Validates, Triggers, Mentions |
| Direction | Bidirectional, Forward, Backward |

---

## Maintenance Commands

**Table 19:** *Architecture Maintenance Commands*

| Command | What It Does |
|---------|--------------|
| `Alex: Dream` | Validates synapses, repairs broken connections |
| `Alex: Upgrade Architecture` | Updates to latest Alex version |
| `Alex: Reset Architecture` | Clean reinstall (backs up first) |

---

## Best Practices

### DO

- ✅ Create skills in `.github/skills/` for project-specific knowledge
- ✅ Run `Alex: Dream` periodically to maintain health
- ✅ Add synapses when files relate to each other
- ✅ Use meditation to consolidate learnings

### DON'T

- ❌ Edit `copilot-instructions.md` without understanding impact
- ❌ Delete core files (they'll be recreated on upgrade)
- ❌ Manually edit episodic/ session records
- ❌ Remove synapses sections from files

---

*Project Structure - Understanding Alex's Memory Organization*
