# 🔌 Alex — Agent Plugin Heir

> Alex's cognitive architecture as an installable VS Code agent plugin.

---

## What This Is

An agent plugin heir. No TypeScript extension. No Marketplace publish. Just install and go.

VS Code 1.110+ supports [agent plugins](https://code.visualstudio.com/docs/copilot/customization/agent-plugins) — prepackaged bundles of skills, agents, instructions, prompts, hooks, and MCP servers that install from the Extensions sidebar or via `chat.plugins.paths`. This heir packages Alex's cognitive architecture in that format.

**What this provides**:

| Capability | Mechanism |
| ---------- | --------- |
| Alex identity + routing | `copilot-instructions.md` sets Alex persona |
| Domain instructions | `instructions/` loaded by applyTo patterns |
| Skills (on-demand knowledge) | `skills/` with 3-level progressive disclosure |
| Custom agents | `agents/` with specialist personas (Researcher, Builder, Validator, etc.) |
| Prompt templates | `prompts/` available as `/` commands |
| Lifecycle hooks | `hooks.json` for session and tool-use safety gates |
| MCP cognitive tools | `.mcp.json` for cognitive tools via MCP stdio |

**What this doesn't provide** (no VS Code extension):
- `@alex` chat participant (requires extension registration)
- Welcome panel webview and avatar states
- Extension commands (`alex.meditate`, `alex.dream`, etc.)
- SecretStorage-backed credentials
- Episodic memory, outcome tracker, task detector services
- Expertise model and workflow engine

---

## Differences from Other Heirs

| Aspect | VS Code Extension | Agent Plugin |
| ------ | ----------------- | ------------ |
| Delivery | `.vsix` on Marketplace | Plugin marketplace or local path |
| Install | Extensions sidebar | `@agentPlugins` in Extensions sidebar |
| Commands | 90 registered commands | Slash commands via prompts |
| Agents | 7 specialist agents | 7 specialist agents |
| Skills | 143 skills | 84 plugin-ready skills |
| Hooks | 4 lifecycle hooks | 1 lifecycle hook (PreToolUse) |
| MCP | Via extension activation | `.mcp.json` standalone |
| Memory | SecretStorage + file + episodic | File memory only |
| Personas | Full detection | Chat-only detection |
| Update path | Marketplace publish | Git pull / plugin update |

---

## Directory Structure

```
agent-plugin/
├── README.md                     # This file
├── marketplace.json              # Plugin marketplace metadata
├── plugin/                       # The installable plugin bundle
│   ├── copilot-instructions.md   # Alex identity (plugin-tuned)
│   ├── .mcp.json                 # MCP cognitive tools server
│   ├── hooks.json                # Lifecycle hooks
│   ├── mcp/                      # Self-contained MCP server (esbuild bundle)
│   │   └── index.js              # 704KB single-file, zero dependencies
│   ├── agents/                   # Specialist agent definitions
│   │   ├── alex.agent.md
│   │   ├── alex-researcher.agent.md
│   │   ├── alex-builder.agent.md
│   │   ├── alex-validator.agent.md
│   │   ├── alex-documentarian.agent.md
│   │   ├── alex-azure.agent.md
│   │   └── alex-m365.agent.md
│   ├── instructions/             # Auto-loaded instruction files
│   ├── prompts/                  # Reusable prompt templates
│   └── skills/                   # Curated skill subset
└── scripts/
    └── sync-plugin.ps1           # Sync from Master Alex
```

---

## Installation

### From Plugin Marketplace (future)

Once published to a plugin marketplace:

1. Open Extensions sidebar (`Ctrl+Shift+X`)
2. Enter `@agentPlugins` in search
3. Find "Alex Cognitive Architecture" and click **Install**

### From Local Path

1. Clone or sync the plugin directory
2. Add to VS Code settings:

```json
"chat.plugins.paths": {
    "c:/path/to/alex-cognitive-architecture/platforms/agent-plugin/plugin": true
}
```

3. Restart VS Code — Alex's skills, agents, and instructions will load into chat

### From Source Directory (VS Code 1.112+)

1. Open Command Palette (`Ctrl+Shift+P`)
2. Run **Chat: Install Plugin from Source**
3. Browse to the `plugin/` directory inside this agent-plugin folder
4. Alex's skills, agents, and instructions load immediately — no restart needed

> VS Code 1.112 also supports per-workspace and global plugin enable/disable via the Extensions sidebar (`@agentPlugins` filter).

### From Git Repository (marketplace config)

Add to a plugin marketplace's `marketplace.json`:

```json
{
    "name": "alex-cognitive-architecture",
    "source": "platforms/agent-plugin/plugin",
    "description": "Alex Cognitive Architecture — AI partner with skills, agents, and cognitive tools.",
    "version": "6.7.1",
    "skills": ["./skills/*"]
}
```

---

## Deployment

This heir is synced from Master Alex during release. To deploy:

1. Run `sync-plugin.ps1` from this directory (or use `sync-architecture.js` with the `agent-plugin` target)
2. The `plugin/` directory contains the installable bundle
3. Distribute via marketplace, git repo, or local path

---

## Skill Selection — Complete Inventory (84 Plugin-Ready Skills)

Every Alex skill listed below with its trifecta status, inheritance, dependencies, and plugin readiness. Use this to decide what to include.

**Legend**:
- **Trifecta**: ✅ = Skill + Instruction + Prompt | ⚡ = has Instruction | 📝 = has Prompt | 💡 = Skill only
- **Plugin Ready**: ✅ = works as-is | ⚠️ = knowledge useful, actions need external tool/API | ❌ = needs extension runtime or Master-only
- **Included**: ● = currently synced to plugin

<details>
<summary><strong>Cognitive & Learning (18 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| bootstrap-learning | ✅ | inheritable | None | ✅ | ● |
| meditation | ✅ | inheritable | Extension commands | ⚠️ | |
| knowledge-synthesis | ✅ | inheritable | None | ✅ | ● |
| self-actualization | ✅ | inheritable | Extension commands | ⚠️ | |
| cognitive-load | 💡 | inheritable | None | ✅ | ● |
| learning-psychology | 💡 | inheritable | None | ✅ | ● |
| appropriate-reliance | 💡 | inheritable | None | ✅ | ● |
| airs-appropriate-reliance | 💡 | inheritable | None | ✅ | ● |
| meditation-facilitation | 💡 | inheritable | None | ✅ | ● |
| global-knowledge | 💡 | inheritable | ~/.alex/ GK path | ⚠️ | |
| global-knowledge-sync | 💡 | universal | Cloud sync service | ⚠️ | |
| socratic-questioning | 💡 | inheritable | None | ✅ | ● |
| rubber-duck-debugging | 💡 | inheritable | None | ✅ | ● |
| anti-hallucination | 💡 | inheritable | None | ✅ | ● |
| awareness | 💡 | inheritable | None | ✅ | ● |
| work-life-balance | 💡 | inheritable | None | ✅ | ● |
| deep-work-optimization | 💡 | inheritable | None | ✅ | ● |
| cognitive-symbiosis | 💡 | inheritable | None | ✅ | ● |

</details>

<details>
<summary><strong>Empathy & Coaching (3 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| frustration-recognition | 💡 | inheritable | None | ✅ | ● |
| coaching-techniques | 💡 | inheritable | None | ✅ | ● |
| proactive-assistance | 💡 | inheritable | None | ✅ | ● |

</details>

<details>
<summary><strong>Engineering Fundamentals (10 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| research-first-development | ✅ | inheritable | None | ✅ | ● |
| testing-strategies | ✅ | inheritable | None | ✅ | ● |
| code-review | ⚡📝 | inheritable | None | ✅ | ● |
| refactoring-patterns | 💡 | inheritable | None | ✅ | ● |
| debugging-patterns | 💡 | inheritable | None | ✅ | ● |
| git-workflow | 💡 | inheritable | None | ✅ | ● |
| project-scaffolding | 💡 | inheritable | None | ✅ | ● |
| vscode-environment | 💡 | inheritable | VS Code settings | ✅ | ● |
| api-design | 💡 | inheritable | None | ✅ | ● |
| infrastructure-as-code | 💡 | inheritable | Terraform/Bicep CLI | ⚠️ | |

</details>

<details>
<summary><strong>Azure (3 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| azure-architecture-patterns | 💡 | inheritable | Azure subscription | ⚠️ | |
| azure-devops-automation | 💡 | inheritable | Azure DevOps | ⚠️ | |
| azure-deployment-operations | 💡 | inheritable | Azure CLI | ⚠️ | |

</details>

<details>
<summary><strong>Operations & Reliability (10 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| north-star | ✅ | inheritable | None | ✅ | ● |
| incident-response | 💡 | inheritable | None | ✅ | ● |
| scope-management | 💡 | inheritable | None | ✅ | ● |
| status-reporting | 💡 | inheritable | None | ✅ | ● |
| project-management | 💡 | inheritable | None | ✅ | ● |
| root-cause-analysis | 💡 | inheritable | None | ✅ | ● |
| error-recovery-patterns | 💡 | inheritable | None | ✅ | ● |
| post-mortem | 💡 | inheritable | None | ✅ | ● |
| project-deployment | 💡 | inheritable | None | ✅ | ● |
| change-management | 💡 | inheritable | None | ✅ | ● |

</details>

<details>
<summary><strong>Security & Privacy (5 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| secrets-management | ✅ | inheritable | VS Code SecretStorage | ⚠️ | |
| security-review | 💡 | inheritable | None | ✅ | ● |
| pii-privacy-regulations | 💡 | inheritable | None | ✅ | ● |
| privacy-responsible-ai | 💡 | inheritable | None | ✅ | ● |
| distribution-security | 💡 | inheritable | None | ✅ | ● |

</details>

<details>
<summary><strong>Documentation & Communication (18 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| markdown-mermaid | ✅ | inheritable | None | ✅ | ● |
| md-to-word | ✅ | inheritable | Pandoc, python-docx | ⚠️ | |
| documentation-quality-assurance | 💡 | inheritable | None | ✅ | ● |
| doc-hygiene | 💡 | inheritable | None | ✅ | ● |
| writing-publication | 💡 | inheritable | None | ✅ | ● |
| academic-research | 💡 | inheritable | None | ✅ | ● |
| practitioner-research | 💡 | inheritable | None | ✅ | ● |
| research-project-scaffold | 💡 | inheritable | None | ✅ | ● |
| grant-writing | 💡 | inheritable | None | ✅ | ● |
| creative-writing | 💡 | inheritable | None | ✅ | ● |
| lint-clean-markdown | 💡 | inheritable | None | ✅ | ● |
| ascii-art-alignment | 💡 | inheritable | None | ✅ | ● |
| localization | 💡 | inheritable | None | ✅ | ● |
| api-documentation | 💡 | inheritable | None | ✅ | ● |
| cross-cultural-collaboration | 💡 | inheritable | None | ✅ | ● |
| executive-storytelling | 💡 | inheritable | None | ✅ | ● |
| slide-design | 💡 | inheritable | None | ✅ | ● |
| book-publishing | 💡 | inheritable | Pandoc, LuaLaTeX | ⚠️ | |

</details>

<details>
<summary><strong>Academic Research (5 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| academic-paper-drafting | 💡 | inheritable | None | ✅ | ● |
| literature-review | 💡 | inheritable | None | ✅ | ● |
| citation-management | 💡 | inheritable | None | ✅ | ● |
| dissertation-defense | 💡 | inheritable | None | ✅ | ● |
| airs-integration | 💡 | inheritable | None | ✅ | ● |

</details>

<details>
<summary><strong>Visual Design & Content Creation (10 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| ai-character-reference-generation | ✅ | inheritable | Replicate API | ⚠️ | |
| ai-generated-readme-banners | ✅ | inheritable | Replicate API (Ideogram) | ⚠️ | |
| gamma-presentations | ✅ | inheritable | Gamma API | ⚠️ | |
| image-handling | 💡 | inheritable | Replicate API | ⚠️ | |
| text-to-speech | 💡 | inheritable | Replicate API | ⚠️ | |
| visual-memory | 💡 | inheritable | Replicate API | ⚠️ | |
| character-aging-progression | 💡 | inheritable | Replicate API | ⚠️ | |
| svg-graphics | 💡 | inheritable | None | ✅ | ● |
| graphic-design | 💡 | inheritable | None | ✅ | ● |
| pptx-generation | 💡 | inheritable | python-pptx | ⚠️ | |

</details>

<details>
<summary><strong>Business & Analysis (2 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| business-analysis | 💡 | inheritable | None | ✅ | ● |
| alex-effort-estimation | 💡 | inheritable | None | ✅ | ● |

</details>

<details>
<summary><strong>Architecture & Design (20 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| dream-state | ✅ | inheritable | Extension commands | ⚠️ | |
| brain-qa | ✅ | inheritable | brain-qa.ps1 muscle | ⚠️ | |
| brand-asset-management | ✅ | inheritable | Alex brand assets | ⚠️ | |
| release-process | ✅ | inheritable | Extension + Marketplace | ❌ | |
| architecture-audit | 💡 | inheritable | None | ✅ | ● |
| architecture-health | 💡 | inheritable | Synapse files | ⚠️ | |
| architecture-refinement | 💡 | inheritable | None | ✅ | ● |
| llm-model-selection | 💡 | inheritable | None | ✅ | ● |
| correax-brand | 💡 | inheritable | Alex brand-specific | ⚠️ | |
| skill-catalog-generator | 💡 | inheritable | gen-skill-catalog.cjs | ⚠️ | |
| skill-building | 💡 | inheritable | None | ✅ | ● |
| skill-development | 💡 | inheritable | None | ✅ | ● |
| skill-activation | 💡 | inheritable | None | ✅ | ● |
| heir-sync-management | 💡 | inheritable | Master sync scripts | ❌ | |
| prompt-activation | 💡 | inheritable | None | ✅ | ● |
| muscle-memory-recognition | 💡 | inheritable | None | ✅ | ● |
| release-preflight | 💡 | inheritable | Extension build | ❌ | |
| master-alex-audit | 💡 | master-only | Master audit scripts | ❌ | |
| global-knowledge-maintenance | 💡 | master-only | Master GK path | ❌ | |
| self-actualization | ✅ | inheritable | Extension commands | ⚠️ | |

</details>

<details>
<summary><strong>AI & Machine Learning (5 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| mcp-development | ✅ | inheritable | None | ✅ | ● |
| prompt-engineering | 💡 | inheritable | None | ✅ | ● |
| rag-architecture | 💡 | inheritable | None | ✅ | ● |
| ai-agent-design | 💡 | inheritable | None | ✅ | ● |
| foundry-agent-platform | 💡 | inheritable | Azure Foundry | ⚠️ | |

</details>

<details>
<summary><strong>Data Analytics (2 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| microsoft-fabric | 💡 | inheritable | Fabric platform | ⚠️ | |
| fabric-notebook-publish | 💡 | inheritable | Fabric Git sync | ⚠️ | |

</details>

<details>
<summary><strong>VS Code Extension (5 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| vscode-extension-patterns | ✅ | heir:vscode | VS Code Extension API | ⚠️ | |
| vscode-configuration-validation | ✅ | heir:vscode | VS Code Extension | ⚠️ | |
| chat-participant-patterns | ✅ | heir:vscode | VS Code Proposed API | ⚠️ | |
| extension-audit-methodology | ✅ | heir:vscode | VS Code Extension | ⚠️ | |
| persona-detection | 💡 | heir:vscode | Extension runtime | ❌ | |

</details>

<details>
<summary><strong>M365 / Teams (2 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| m365-agent-debugging | ✅ | heir:m365 | M365 Dev Portal | ⚠️ | |
| teams-app-patterns | ✅ | heir:m365 | Teams Toolkit | ⚠️ | |

</details>

<details>
<summary><strong>Other (8 skills)</strong></summary>

| Skill | Trifecta | Inheritance | Dependencies | Plugin Ready | ● |
| ----- | :------: | ----------- | ------------ | :----------: | :-: |
| ui-ux-design | ✅ | inheritable | None | ✅ | ● |
| enterprise-integration | 💡 | inheritable | None | ✅ | ● |
| database-design | 💡 | inheritable | None | ✅ | ● |
| bicep-avm-mastery | 💡 | inheritable | Azure, Bicep CLI | ⚠️ | |
| multi-agent-orchestration | 💡 | inheritable | None | ✅ | ● |
| observability-monitoring | 💡 | inheritable | None | ✅ | ● |
| performance-profiling | 💡 | inheritable | None | ✅ | ● |
| presentation-tool-selection | 💡 | inheritable | None | ✅ | ● |

</details>

### Summary

| Category | Total | ✅ Plugin Ready | ⚠️ Partial | ❌ Not Suitable | Currently Included |
| -------- | :---: | :------------: | :--------: | :------------: | :----------------: |
| Cognitive & Learning | 18 | 14 | 4 | 0 | 14 |
| Empathy & Coaching | 3 | 3 | 0 | 0 | 3 |
| Engineering Fundamentals | 10 | 9 | 1 | 0 | 9 |
| Azure | 3 | 0 | 3 | 0 | 0 |
| Operations & Reliability | 10 | 10 | 0 | 0 | 10 |
| Security & Privacy | 5 | 4 | 1 | 0 | 4 |
| Documentation & Communication | 18 | 16 | 2 | 0 | 16 |
| Academic Research | 5 | 5 | 0 | 0 | 5 |
| Visual Design & Content | 10 | 2 | 8 | 0 | 2 |
| Business & Analysis | 2 | 2 | 0 | 0 | 2 |
| Architecture & Design | 20 | 8 | 7 | 5 | 8 |
| AI & Machine Learning | 5 | 4 | 1 | 0 | 4 |
| Data Analytics | 2 | 0 | 2 | 0 | 0 |
| VS Code Extension | 5 | 0 | 4 | 1 | 0 |
| M365 / Teams | 2 | 0 | 2 | 0 | 0 |
| Other | 8 | 7 | 1 | 0 | 7 |
| **Total** | **126** | **84** | **36** | **6** | **84** |

**26 complete trifectas** (Skill + Instruction + Prompt): meditation, dream-state, self-actualization, release-process, brand-asset-management, ai-character-reference-generation, ai-generated-readme-banners, extension-audit-methodology, research-first-development, brain-qa, bootstrap-learning, vscode-configuration-validation, ui-ux-design, md-to-word, gamma-presentations, secrets-management, chat-participant-patterns, vscode-extension-patterns, mcp-development, microsoft-graph-api, teams-app-patterns, m365-agent-debugging, markdown-mermaid, testing-strategies, knowledge-synthesis, north-star

---

## Settings

Enable agent plugins in VS Code:

```json
{
    "chat.plugins.enabled": true
}
```

---

## Status

| Item | Status |
| ---- | ------ |
| Plugin structure defined | ✅ |
| marketplace.json | ✅ |
| copilot-instructions.md (plugin-tuned) | ✅ |
| Agents synced | ✅ |
| Curated skills | ✅ |
| Hooks | ✅ |
| MCP server config | ✅ |
| Sync script | ✅ |
| Published to marketplace | 🔜 Pending plugin ecosystem maturity |
