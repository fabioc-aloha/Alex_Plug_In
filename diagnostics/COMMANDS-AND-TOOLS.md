# Commands and Tools Diagnostic

## Slash Commands (36 total)

All slash commands are registered through the `@alex` chat participant in `chatParticipant.ts`.

### Cognitive Architecture Commands

| Command | Purpose | Category |
|---------|---------|----------|
| `/initialize` | Initialize Alex cognitive architecture in a workspace | Setup |
| `/dream` | Run neural maintenance (synapse validation, repair, health report) | Maintenance |
| `/meditate` | Knowledge consolidation session with file persistence | Consolidation |
| `/selfactualize` | Comprehensive architecture assessment (6 dimensions) | Assessment |

### Learning & Knowledge

| Command | Purpose | Category |
|---------|---------|----------|
| `/learn` | Conversational knowledge acquisition (bootstrap learning) | Learning |
| `/gapanalysis` | 4-dimension gap analysis (Skills, Instructions, Agents, Prompts) | Analysis |
| `/improve` | Project improvement workflow (trifecta + research-first) | Improvement |

### Development Workflow

| Command | Purpose | Category |
|---------|---------|----------|
| `/build` | Build/compile project | Dev |
| `/create` | Create new files, components, or structures | Dev |
| `/implement` | Guided feature implementation | Dev |
| `/scaffold` | Generate project scaffolding | Dev |
| `/plan` | Create implementation plan | Planning |
| `/design` | Design system/component architecture | Planning |
| `/architect` | High-level architecture decisions | Planning |
| `/workflow` | Define or execute workflows | Process |

### Code Quality

| Command | Purpose | Category |
|---------|---------|----------|
| `/analyze` | Analyze code, data, or architecture | Analysis |
| `/review` | Code review with confidence scoring | Quality |
| `/test` | Write or run tests | Quality |
| `/debug` | Systematic debugging (6-step protocol) | Quality |
| `/fix` | Fix bugs or issues | Quality |
| `/refactor` | Safe refactoring (behavior preservation) | Quality |
| `/audit` | Architecture or code quality audit | Quality |

### Documentation & Communication

| Command | Purpose | Category |
|---------|---------|----------|
| `/document` | Generate documentation | Docs |
| `/explain` | Explain code or concepts | Docs |
| `/summarize` | Summarize content | Docs |

### Exploration & Ideation

| Command | Purpose | Category |
|---------|---------|----------|
| `/explore` | Explore codebase or topics | Research |
| `/brainstorm` | Ideation and creative thinking | Creative |

### Content Generation

| Command | Purpose | Category |
|---------|---------|----------|
| `/image` | AI image generation via Replicate | Media |
| `/video` | AI video generation | Media |
| `/tts` | Text-to-speech generation | Media |

### Export & Conversion

| Command | Purpose | Category |
|---------|---------|----------|
| `/convert` | Convert between formats | Export |
| `/export` | Export content | Export |
| `/word` | Convert markdown to Word document | Export |
| `/slides` | Generate presentation slides (Gamma) | Export |

### Release & Deployment

| Command | Purpose | Category |
|---------|---------|----------|
| `/release` | Release management workflow | Release |
| `/deploy` | Deploy to target environment | Release |

---

## LLM Tools (7 total)

LLM tools are declared in `package.json` under `contributes.languageModelTools`. They are callable by the LLM during agent sessions without requiring user slash commands.

| Tool | Description | Parameters |
|------|-------------|------------|
| `alex_initialize` | Initialize Alex cognitive architecture | `workspaceFolder`, `options` |
| `alex_meditate` | Trigger knowledge consolidation meditation | `topic`, `depth` |
| `alex_dream` | Run neural maintenance dream protocol | `mode`, `reportOnly` |
| `alex_self_actualization` | Run comprehensive self-assessment | `createReport`, `autoFix` |
| `alex_learn` | Acquire domain knowledge through conversation | `domain`, `depth`, `style` |
| `alex_release_management` | Execute release management workflow | `action`, `version`, `scope` |
| `alex_skill_building` | Create or enhance a cognitive skill | `skillName`, `domain`, `action` |

**Tool vs Command relationship**:
- Tools are invoked programmatically by the LLM during agentic workflows
- Commands are invoked explicitly by users via `/command` syntax
- Some operations are available as both (e.g., `/meditate` command and `alex_meditate` tool)
- Tools enable multi-step agent workflows where the LLM can invoke operations without user intervention

---

## Command Palette Commands

In addition to chat slash commands, the extension registers commands accessible via the VS Code command palette (`Ctrl+Shift+P`):

| Command ID | Title | Category |
|------------|-------|----------|
| `alex.initialize` | Alex: Initialize Cognitive Architecture | Setup |
| `alex.dream` | Alex: Dream (Neural Maintenance) | Maintenance |
| `alex.meditate` | Alex: Meditate | Consolidation |
| `alex.selfActualize` | Alex: Self-Actualization | Assessment |
| Various view commands | Open/refresh webview panels | UI |

---

## Command Categories Distribution

```
Development Workflow:  9 commands (25%)
Code Quality:         7 commands (19%)
Cognitive:            4 commands (11%)
Export/Conversion:    4 commands (11%)
Documentation:        3 commands  (8%)
Learning/Knowledge:   3 commands  (8%)
Media Generation:     3 commands  (8%)
Release/Deploy:       2 commands  (6%)
Exploration:          1 command   (3%)
```

---

## Implementation Depth Assessment

Commands vary in implementation depth:

**Deep implementation** (dedicated logic, multi-step workflows):
- `/initialize` — Full workspace setup with file creation
- `/dream` — Invokes brain-qa.cjs, generates reports
- `/meditate` — 8-phase consolidation with file persistence
- `/release` — Multi-step release workflow with validation gates
- `/image`, `/video`, `/tts` — Replicate API integration
- `/word` — md-to-word.cjs muscle invocation
- `/slides` — gamma-generator.cjs integration

**Medium implementation** (skill-enhanced LLM routing):
- `/learn` — Loads bootstrap-learning skill, guided conversation
- `/gapanalysis` — Loads research-first skill, 4D analysis
- `/review` — Loads code-review skill, confidence scoring
- `/test` — Loads testing-strategies skill
- `/debug` — Loads debugging-patterns skill

**Thin implementation** (context injection + LLM passthrough):
- `/build`, `/create`, `/plan`, `/design`, `/architect`, `/scaffold`
- `/explore`, `/brainstorm`, `/summarize`, `/explain`
- These load relevant skills/instructions into the system prompt and pass to the LLM
- The LLM does the heavy lifting with enriched context

**Note**: "Thin" does not mean "low value." The skill/instruction context injection is the primary value proposition — the LLM produces significantly better output with Alex's domain knowledge loaded.
