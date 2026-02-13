# Claude Code Heir — Alex Cognitive Architecture

> Potential heir deployment for Anthropic's Claude Code platform

|              |                                    |
| ------------ | ---------------------------------- |
| **Status**   | 📋 Planning                         |
| **Created**  | 2026-02-13                         |
| **Target**   | Claude Code CLI + IDE integrations |
| **Location** | `platforms/claude-code/` (planned) |

---

## Executive Summary

Create a Claude Code heir that enables Alex to operate in Anthropic's Claude Code environment (terminal, VS Code extension, JetBrains, Desktop app, Web). This expands Alex's reach beyond GitHub Copilot while gaining powerful automation capabilities through hooks.

### Strategic Value

| Benefit            | Description                                         |
| ------------------ | --------------------------------------------------- |
| **Multi-platform** | Terminal, VS Code, JetBrains, Desktop, Web          |
| **Automation**     | Full lifecycle hooks (SessionStart → Stop)          |
| **Auto-memory**    | Native per-project learning without manual synapses |
| **Agent Teams**    | Multi-agent collaboration with quality gates        |
| **Future-proof**   | Anthropic's growing ecosystem                       |

---

## Architecture Mapping

### Source → Target Transformation

| Master Alex (VS Code)                    | Claude Code Heir              | Transformation                     |
| ---------------------------------------- | ----------------------------- | ---------------------------------- |
| `copilot-instructions.md`                | `CLAUDE.md`                   | Direct copy with minor adjustments |
| `.github/agents/*.agent.md`              | `.claude/agents/*.md`         | Frontmatter schema change          |
| `.github/skills/*/SKILL.md`              | `.claude/skills/*.md`         | Flatten + schema change            |
| `.github/instructions/*.instructions.md` | `.claude/rules/*.md`          | Add `paths` frontmatter            |
| `.github/prompts/*.prompt.md`            | Inline in agents or CLAUDE.md | No direct equivalent               |
| `synapses.json` files                    | Auto-memory                   | Let Claude Code learn naturally    |
| Extension commands                       | Hooks + CLI                   | Platform-specific                  |

### What Transfers Directly

- Core personality and identity (from copilot-instructions.md)
- Safety imperatives and kill switch awareness
- Working memory rules (7 slot system)
- Model awareness and tier mapping
- Memory architecture concepts
- Code review guidelines
- Release management procedures

### What Requires Adaptation

- Skill format (VS Code YAML → Claude Code YAML)
- Agent handoffs (explicit array → Task tool)
- File-specific rules (applyTo → paths frontmatter)
- Prompt files (no equivalent — merge into agents)

### What Cannot Transfer

- Synapse network (custom Alex concept)
- VS Code extension API calls
- Copilot Chat sidebar integration
- Extension commands (meditate, dream, etc.)

---

## Proposed Directory Structure

```
platforms/claude-code/
├── README.md                           # Platform documentation
├── SYNC-STATUS.md                      # Last sync timestamp + changes
│
├── CLAUDE.md                           # Main Alex instructions
│                                       # (Generated from copilot-instructions.md)
│
├── .claude/
│   ├── CLAUDE.md                       # Alternative location (symlink to parent)
│   │
│   ├── agents/
│   │   ├── alex.md                     # Main Alex agent
│   │   ├── alex-researcher.md          # Research specialist
│   │   ├── alex-builder.md             # Implementation specialist
│   │   ├── alex-validator.md           # QA specialist
│   │   └── README.md                   # Agent catalog
│   │
│   ├── rules/
│   │   ├── code-review.md              # From code-review-guidelines
│   │   ├── release-management.md       # From release-management
│   │   ├── dependency-management.md    # From dependency-management
│   │   ├── brand-assets.md             # From brand-asset-management
│   │   ├── technical-debt.md           # From technical-debt-tracking
│   │   └── README.md                   # Rules index
│   │
│   ├── skills/
│   │   ├── text-to-speech.md           # Voice synthesis
│   │   ├── deep-thinking.md            # Problem analysis
│   │   ├── meditation.md               # Knowledge consolidation
│   │   └── README.md                   # Skills index (selected high-value skills)
│   │
│   └── settings.json                   # Hooks + MCP configuration
│
└── scripts/
    ├── sync-from-master.ps1            # Pull updates from Master Alex
    ├── generate-claude-md.ps1          # Transform copilot-instructions → CLAUDE.md
    └── validate-heir.ps1               # Ensure heir structure is valid
```

---

## Hook Implementation Plan

### Full Lifecycle Hooks

| Hook Event             | Purpose in Alex Context                       | Script                       |
| ---------------------- | --------------------------------------------- | ---------------------------- |
| **SessionStart**       | Load context, check for pending tasks         | `hooks/session-start.sh`     |
| **UserPromptSubmit**   | Detect meditation/dream triggers              | `hooks/prompt-filter.sh`     |
| **PreToolUse**         | Validate dangerous operations                 | `hooks/pre-tool-validate.sh` |
| **PostToolUse**        | Auto-run tests after Write/Edit               | `hooks/post-tool-check.sh`   |
| **PostToolUseFailure** | Log failures, suggest fixes                   | `hooks/failure-handler.sh`   |
| **Stop**               | Check for incomplete tasks, prompt meditation | `hooks/session-stop.sh`      |
| **SubagentStart**      | Log agent handoffs                            | `hooks/subagent-log.sh`      |
| **SubagentStop**       | Validate agent output quality                 | `hooks/subagent-validate.sh` |

### Proposed settings.json

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/scripts/hooks/session-start.sh",
            "statusMessage": "Loading Alex context..."
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/scripts/hooks/post-edit-lint.sh",
            "async": true,
            "timeout": 120
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check if there are incomplete tasks or if the user should be reminded to meditate. Context: $ARGUMENTS",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

---

## Migration Phases

### Phase 1: Foundation (Week 1)

**Goal**: Minimal viable Claude Code heir

| Task                                         | Effort  | Output                   |
| -------------------------------------------- | ------- | ------------------------ |
| Create directory structure                   | 1 hour  | `platforms/claude-code/` |
| Generate CLAUDE.md from copilot-instructions | 2 hours | Main instructions file   |
| Create main alex.md agent                    | 2 hours | Core agent definition    |
| Basic settings.json (no hooks)               | 30 min  | MCP configuration        |
| Test in Claude Code CLI                      | 1 hour  | Validation               |

**Deliverable**: Alex responds in Claude Code with core personality intact.

### Phase 2: Rules & Agents (Week 2)

**Goal**: Port instruction files and agents

| Task                                                  | Effort  | Output                         |
| ----------------------------------------------------- | ------- | ------------------------------ |
| Transform 8 priority instructions → rules             | 4 hours | `.claude/rules/*.md`           |
| Port 4 agents (Researcher, Builder, Validator, Azure) | 3 hours | `.claude/agents/*.md`          |
| Create sync script                                    | 2 hours | `scripts/sync-from-master.ps1` |
| Document transformation rules                         | 1 hour  | README files                   |

**Deliverable**: Multi-agent Alex in Claude Code.

### Phase 3: Hooks Integration (Week 3)

**Goal**: Enable cognitive automation

| Task                        | Effort  | Output              |
| --------------------------- | ------- | ------------------- |
| Implement SessionStart hook | 2 hours | Context loading     |
| Implement PostToolUse hook  | 2 hours | Auto-lint/test      |
| Implement Stop hook         | 2 hours | Meditation reminder |
| Test full hook lifecycle    | 3 hours | Integration testing |

**Deliverable**: Alex with automated cognitive maintenance.

### Phase 4: Skills Selection (Week 4)

**Goal**: Port high-value skills

| Task                         | Effort  | Output                |
| ---------------------------- | ------- | --------------------- |
| Select 10-15 priority skills | 1 hour  | Skills list           |
| Transform skill format       | 4 hours | `.claude/skills/*.md` |
| Test skill invocation        | 2 hours | Validation            |

**Priority Skills**:
1. `text-to-speech` — Voice synthesis
2. `deep-thinking` — Problem analysis
3. `meditation` — Knowledge consolidation
4. `brain-qa` — Architecture validation
5. `release-management` — Publish workflow
6. `brand-asset-management` — Visual identity
7. `bootstrap-learning` — Knowledge acquisition
8. `research-first-development` — Gap analysis
9. `alex-effort-estimation` — Project estimation
10. `code-review` — Quality checks

**Deliverable**: Alex with portable skills.

### Phase 5: Validation & Documentation (Week 5)

**Goal**: Production-ready heir

| Task                                 | Effort  | Output              |
| ------------------------------------ | ------- | ------------------- |
| Create heir validation script        | 2 hours | `validate-heir.ps1` |
| Write user documentation             | 2 hours | README.md           |
| Create sync workflow                 | 1 hour  | Automated sync      |
| Integration testing across platforms | 4 hours | Test report         |

**Deliverable**: Publishable Claude Code heir.

---

## Skill Selection Criteria

Not all skills port well. Selection based on:

| Criterion            | Weight | Rationale                                 |
| -------------------- | ------ | ----------------------------------------- |
| VS Code independence | High   | Skills using VS Code APIs won't work      |
| User-invokable       | High   | Internal metacognitive skills less useful |
| Knowledge-based      | High   | Factual skills transfer well              |
| Workflow-based       | Medium | May need hooks adaptation                 |
| Synapse-dependent    | Low    | Connection mapping not available          |

### Skills to PORT (30-40 priority)

| Category    | Skills                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| Cognitive   | meditation, deep-thinking, bootstrap-learning, self-actualization       |
| Development | code-review, release-management, technical-debt, dependency-management  |
| Research    | research-first-development, citation-management, literature-review      |
| Azure       | azure-architecture-patterns, bicep-avm-mastery, azure-devops-automation |
| Content     | text-to-speech, pptx-generation, slide-design, gamma-presentation       |
| Estimation  | alex-effort-estimation, sprint-planning                                 |

### Skills to SKIP (internal/VS Code-dependent)

| Category            | Skills                                                             |
| ------------------- | ------------------------------------------------------------------ |
| Metacognitive       | skill-activation, prompt-activation, awareness, anti-hallucination |
| Extension-dependent | Any using VS Code commands                                         |
| Synapse-dependent   | Skills relying on connection queries                               |

---

## Sync Strategy

### Automated Sync Options

| Strategy           | Pros                | Cons          |
| ------------------ | ------------------- | ------------- |
| **Manual trigger** | Full control        | May drift     |
| **Git hook**       | Automatic on commit | Overhead      |
| **Weekly script**  | Balanced            | Batch changes |
| **CI/CD pipeline** | Automated           | Complexity    |

**Recommendation**: Weekly manual sync with diff review.

### Sync Script Outline

```powershell
# sync-from-master.ps1
# Syncs Claude Code heir from Master Alex

param(
    [switch]$DryRun,
    [switch]$Force
)

# 1. Generate CLAUDE.md from copilot-instructions.md
# 2. Transform instructions → rules
# 3. Transform agents → Claude format
# 4. Update SYNC-STATUS.md with timestamp
# 5. Validate with validate-heir.ps1
```

---

## Risk Assessment

| Risk                   | Likelihood | Impact | Mitigation                        |
| ---------------------- | ---------- | ------ | --------------------------------- |
| Format incompatibility | Medium     | High   | Test each component individually  |
| Drift from Master      | High       | Medium | Automated sync + diff review      |
| Hook complexity        | Medium     | Medium | Start simple, add incrementally   |
| Auto-memory conflicts  | Low        | Low    | Let Claude Code manage its memory |
| Multi-platform bugs    | Medium     | Medium | Test on each platform             |

---

## Success Criteria

### Phase 1 Complete When:
- [ ] CLAUDE.md loads in Claude Code CLI
- [ ] Alex personality consistent with VS Code
- [ ] Basic conversation works

### Phase 2 Complete When:
- [ ] All 4 agents load correctly
- [ ] Rules apply to correct file types
- [ ] Sync script runs without errors

### Phase 3 Complete When:
- [ ] Hooks fire at correct lifecycle points
- [ ] PostToolUse linting works
- [ ] Stop hook prompts for meditation

### Phase 4 Complete When:
- [ ] 10+ skills invokable
- [ ] Skills produce expected outputs
- [ ] No VS Code dependency errors

### Phase 5 Complete When:
- [ ] Documentation complete
- [ ] Validation script passes
- [ ] Tested on CLI + VS Code + one other platform

---

## Open Questions

1. **Synapse replacement**: Should Claude Code heir use auto-memory exclusively, or implement a simplified connection tracking?

2. **Skill density**: Port all 100+ skills (high effort, low value for some) or curate ~30 high-value skills?

3. **Prompt files**: Merge into CLAUDE.md sections, convert to skills, or drop entirely?

4. **Extension commands**: Implement as hooks, CLI aliases, or document as manual processes?

5. **Version alignment**: Should heir version match Master Alex, or have independent versioning?

---

## Next Steps

1. **Approval**: Review this plan and confirm scope
2. **Directory creation**: Set up `platforms/claude-code/` structure
3. **Phase 1 implementation**: Create CLAUDE.md and main agent
4. **Testing**: Validate in Claude Code CLI

---

## Related Documentation

- [FEATURE-GAP-ANALYSIS.md](../architecture/FEATURE-GAP-ANALYSIS.md) — Platform comparison
- [Claude Code Docs](https://code.claude.com/docs) — Official documentation
- [Claude Code Memory](https://code.claude.com/docs/en/memory) — CLAUDE.md format
- [Claude Code Hooks](https://code.claude.com/docs/en/hooks) — Hook reference

---

*Claude Code Heir Plan — Alex Cognitive Architecture, February 2026*
