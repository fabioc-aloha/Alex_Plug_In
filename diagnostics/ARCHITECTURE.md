# Architecture Diagnostic

## Extension Identity

| Property | Value |
|----------|-------|
| Name | Alex Cognitive Architecture |
| Version | 7.6.0 |
| Publisher | CorreaX |
| Engine | `^1.96.0` |
| Entry point | `dist/extension.js` (esbuild bundle) |
| Source root | `platforms/vscode-extension/src/` |
| Activation | `onStartupFinished` |

---

## Repository Structure

```
AlexMaster/
├── .github/                          # Master cognitive architecture (source of truth)
│   ├── agents/                       # 7 agent definition files
│   ├── config/                       # Protected config (MASTER-ALEX-PROTECTED.json)
│   ├── copilot-instructions.md       # The "brain" — Active Context, routing, identity
│   ├── hooks/                        # Git pre-commit hooks (cross-platform)
│   ├── instructions/                 # 39+ auto-loaded procedural memory files
│   ├── muscles/                      # Executable scripts (brain-qa, sync, audit, etc.)
│   ├── prompts/                      # Interactive workflow prompts (slash commands)
│   └── skills/                       # 124 skill folders (SKILL.md + synapses.json)
├── alex_archive/                     # Historical/archived content
├── alex_docs/                        # Alex documentation
├── assets/                           # Root-level brand assets (banner, logo, icon)
├── docs/                             # Project documentation
├── packages/                         # ⚠️ EMPTY — placeholder directory
├── platforms/
│   ├── vscode-extension/             # VS Code extension (primary heir)
│   │   ├── .github/                  # Heir copy of master .github/ (synced at build)
│   │   ├── assets/                   # Extension-specific assets
│   │   ├── dist/                     # Built output (esbuild bundle)
│   │   ├── src/                      # TypeScript source
│   │   │   ├── chat/                 # Chat participant + routing
│   │   │   ├── commands/             # Command handlers
│   │   │   ├── services/             # Core services (singletons)
│   │   │   └── views/                # WebviewViewProviders
│   │   ├── package.json              # Extension manifest
│   │   └── test/                     # Test directory
│   └── m365-copilot/                 # M365 heir (separate release cycle)
├── scripts/                          # Build scripts (quality-gate, sync-architecture)
├── MULTI-AGENT-STRATEGY.md           # CoDev/Coder/Critic coordination model
├── ROADMAP-COWORKER.md               # Non-VS Code platform roadmap
├── ROADMAP.md                        # Product roadmap
└── package.json                      # Root workspace package.json
```

---

## Activation Flow

```
VS Code starts
  → onStartupFinished event fires
  → activate(context) in extension.ts
      1. Register CognitiveOrchestrator (builds AI system prompts)
      2. Register SkillManager (discovers .github/skills/)
      3. Register SessionManager (episodic session files)
      4. Register EpisodicMemoryService (YAML frontmatter I/O)
      5. Register SecretStorage (Replicate/Gamma tokens)
      6. Register chat participant (@alex) with 36 slash commands
      7. Register 7 LLM tools (alex_initialize, etc.)
      8. Register TreeView providers (Welcome, Dashboard, etc.)
      9. Register all command palette commands
```

---

## Core Services (Singletons)

| Service | File | Responsibility |
|---------|------|----------------|
| `CognitiveOrchestrator` | `services/cognitiveOrchestrator.ts` | Builds AI system prompts from skill/memory files; central intelligence engine |
| `SkillManager` | `services/skillManager.ts` | Discovers `.github/skills/*/SKILL.md`, keyword-based activation matching |
| `SessionManager` | `services/sessionManager.ts` | Manages episodic session lifecycle in `.github/episodic/` |
| `EpisodicMemoryService` | `services/episodicMemoryService.ts` | Reads/writes YAML-frontmatter episodic memory files |
| SecretStorage | VS Code API | Secure credential storage for API tokens |

---

## Chat Participant Architecture

The `@alex` chat participant is registered in `chatParticipant.ts` and serves as the primary interaction surface.

**Routing pattern**: User message → slash command match → handler function → system prompt assembly → LLM invocation → streamed response.

The system prompt is dynamically assembled by `CognitiveOrchestrator` based on:
1. Active Context from `copilot-instructions.md`
2. Relevant skills matched by `SkillManager` keyword index
3. Applicable instruction files (auto-loaded by `applyTo` patterns)
4. Session history from `EpisodicMemoryService`
5. Command-specific context (e.g., `/learn` adds bootstrap-learning skill)

---

## WebviewViewProviders

| View | Purpose |
|------|---------|
| Welcome View | Onboarding, persona display, quick actions |
| Cognitive Dashboard | Architecture health metrics, synapse stats |

---

## Master-Heir Architecture (I8 Principle)

**Cardinal rule**: Architecture MUST NOT depend on the Extension. The dependency arrow is Extension → Architecture, never reverse.

```
.github/ (Master)           →    platforms/vscode-extension/.github/ (Heir)
  Source of truth                  Build-time copy via sync-architecture
  Edited directly                  Never edited directly
  Contains all skills              Contains inheritable skills only
  Contains master-only files       master-only files excluded
```

The `sync-architecture.cjs` script enforces this at build time:
- Copies master `.github/` to heir `.github/`
- Strips `inheritance: master-only` files
- Validates skill counts match expectations
- Runs as part of `vscode:prepublish`

---

## Dependency Graph (Simplified)

```
extension.ts (entry)
  ├── chatParticipant.ts (36 commands, 7 tools)
  │   ├── CognitiveOrchestrator (prompt assembly)
  │   │   ├── SkillManager (skill discovery)
  │   │   └── .github/skills/ (124 SKILL.md files)
  │   ├── SessionManager (episodic)
  │   └── EpisodicMemoryService (YAML I/O)
  ├── commands/ (command palette handlers)
  ├── views/ (webview providers)
  │   ├── welcomeView.ts
  │   └── cognitiveDashboard.ts
  └── services/ (shared singletons)
```

---

## Safety Imperatives

| ID | Rule | Rationale |
|----|------|-----------|
| I1 | Never test extension in Master Alex workspace | Source of truth protection |
| I2 | Always install extension locally via VSIX before publishing | Verify behavior |
| I3 | Never run Initialize on Master Alex | Overwrites living mind |
| I4 | Never run Reset on Master Alex | Deletes architecture |
| I5 | Commit before risky operations | Recovery checkpoint |
| I6 | One platform, one roadmap | Coordination |
| I7 | Root `.github/` is source of truth, extension `.github/` is generated | Master-heir |
| I8 | Architecture NEVER depends on the Extension | Dependency direction |
