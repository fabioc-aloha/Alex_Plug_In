# Heir Parity Comparison

**Date**: 2026-03-04
**Version**: 6.2.0
**Purpose**: Feature parity analysis across all heirs to support "Ship one heir to parity" roadmap item

> **Note**: GitHub Copilot Web heir was discontinued on 2026-03-05. The `platforms/github-copilot-web/` directory has been removed. GH Web columns below are retained for historical reference only.

---

## Summary

| Content Type | Master | VS Code Ext | Agent Plugin | M365 Copilot | GH Copilot Web |
| --- | :---: | :---: | :---: | :---: | :---: |
| **Skills** | 129 | 128 (99%) | 85 (66%) | 90 (70%) | 2 (1.5%) |
| **Instructions** | 63 | 62 (98%) | 22 (35%) | 23 (37%) | 2 (3%) |
| **Prompts** | 48 | 47 (98%) | 11 (23%) | 13 (27%) | 1 (2%) |
| **Agents** | 7 | 7 (100%) | 7 (100%) | 0 (n/a) | 0 (0%) |
| **Hooks** | ✅ | ✅ | ✅ | — | ❌ |
| **MCP config** | — | — | ✅ | — | ❌ |
| **Config files** | 6 | 3 | — | — | — |
| **Knowledge files** | — | — | — | 6 | — |
| **copilot-instructions.md** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Sync script** | — | — | ✅ | ✅ | ❌ |
| **Overall parity** | — | **~99%** | **~66%** | **~50%** | **~1.5%** |

---

## Heir Architecture Notes

### VS Code Extension (platforms/vscode-extension/)
- **Role**: Primary distribution. Extension code + `.github/` cognitive layer
- **Sync**: Manual via release process; nearly 1:1 with Master
- **Gap**: 1 skill (`ai-writing-avoidance`), 1 instruction, 1 prompt — trivial to close
- **Unique**: Contains TypeScript extension source (`src/`), `package.json` with 89+ commands

### Agent Plugin (platforms/agent-plugin/)
- **Role**: Curated portable plugin — skills, agents, instructions, prompts, hooks, MCP
- **Sync**: `sync-plugin.ps1` — copies curated subset from Master
- **Gap**: 44 skills, 41 instructions, 37 prompts omitted by design (platform-specific content excluded)
- **Unique**: `.mcp.json` (cognitive tools), `marketplace.json`, `hooks.json`, curated README + USER-MANUAL

### M365 Copilot (platforms/m365-copilot/)
- **Role**: Declarative agent for Microsoft 365 / Teams
- **Sync**: `sync-m365.ps1` — copies `.github/` subset; knowledge files updated manually
- **Gap**: No agents (uses declarativeAgent.json instead), knowledge files supplement instructions
- **Unique**: `appPackage/` (manifest.json, declarativeAgent.json, knowledge/), conversation starters

### GitHub Copilot Web (DISCONTINUED 2026-03-05)
- **Role**: Was `.github/`-only heir for github.com Copilot Chat integration
- **Status**: Removed — not worth the effort at ~1.5% parity; Agent Plugin covers the same use case better
- **Gap**: Was massive — only 2 skills, 2 instructions, 1 prompt, 0 agents, no hooks
- **Unique**: Lightest heir; only needed `.github/` directory (no extension code, no manifest)

---

## GitHub Copilot Web vs Agent Plugin — Detailed Gap Analysis

### What GH Web Has (5 items)
| Type | Name |
| --- | --- |
| Skill | north-star |
| Skill | visual-memory |
| Instruction | skill-building |
| Instruction | visual-memory |
| Prompt | visual-memory |

### What Agent Plugin Has That GH Web Doesn't (120 items)

#### Skills (83 missing, present in Plugin)

| Category | Skills |
| --- | --- |
| **AI & LLM** | ai-agent-design, ai-writing-avoidance, airs-appropriate-reliance, airs-integration, anti-hallucination, appropriate-reliance, llm-model-selection, prompt-activation, prompt-engineering, rag-architecture |
| **Architecture & Design** | api-design, architecture-audit, architecture-refinement, database-design, infrastructure-as-code (Master only) |
| **Code Quality** | code-review, debugging-patterns, error-recovery-patterns, lint-clean-markdown, performance-profiling, refactoring-patterns, root-cause-analysis, security-review, testing-strategies |
| **Development** | ascii-art-alignment, distribution-security, git-workflow, mcp-development, project-deployment, project-scaffolding, svg-graphics, ui-ux-design, vscode-environment |
| **Documentation** | api-documentation, doc-hygiene, documentation-quality-assurance, executive-storytelling, markdown-mermaid |
| **Knowledge & Learning** | bootstrap-learning, knowledge-synthesis, learning-psychology, skill-activation, skill-building, skill-development |
| **Research & Academia** | academic-paper-drafting, academic-research, citation-management, dissertation-defense, grant-writing, literature-review, practitioner-research, research-first-development, research-project-scaffold |
| **Project Management** | alex-effort-estimation, business-analysis, change-management, incident-response, observability-monitoring, post-mortem, project-management, scope-management, status-reporting |
| **People & Communication** | awareness, coaching-techniques, cognitive-load, cognitive-symbiosis, creative-writing, cross-cultural-collaboration, deep-work-optimization, frustration-recognition, meditation-facilitation, multi-agent-orchestration, muscle-memory-recognition, pii-privacy-regulations, presentation-tool-selection, privacy-responsible-ai, proactive-assistance, rubber-duck-debugging, slide-design, socratic-questioning, work-life-balance, writing-publication |
| **Enterprise** | enterprise-integration, localization |

#### Instructions (20 missing, present in Plugin)
adversarial-oversight, architecture-decision-records, bootstrap-learning, code-review-guidelines, deep-thinking, dependency-management, empirical-validation, knowledge-synthesis, markdown-mermaid, mcp-development, nasa-code-standards, north-star, research-first-workflow, semantic-audit, skill-building, skill-selection-optimization, technical-debt-tracking, testing-strategies, ui-ux-design, worldview-constitutional-ai, worldview-integration, worldview-moral-psychology

#### Prompts (10 missing, present in Plugin)
cross-domain-transfer, gapanalysis, improve, learn, mcp-server, northstar, plan, presentation, review, tdd, ui-ux-audit

#### Agents (7 missing, present in Plugin)
alex, alex-azure, alex-builder, alex-documentarian, alex-m365, alex-researcher, alex-validator

### What Master Has That Neither Web Nor Plugin Have (44 skills, 41 instructions, 37 prompts)

These are platform-specific or Master-internal items intentionally excluded from portable heirs:

| Type | Count | Examples |
| --- | :---: | --- |
| **VS Code Extension skills** | ~15 | chat-participant-patterns, vscode-extension-patterns, vscode-configuration-validation, extension-audit-methodology, pptx-generation, terminal-image-rendering, text-to-speech |
| **Alex cognitive skills** | ~10 | brain-qa, dream-state, meditation, self-actualization, master-alex-audit, persona-detection, global-knowledge* |
| **Platform-specific skills** | ~10 | m365-agent-debugging, teams-app-patterns, microsoft-graph-api, fabric-notebook-publish, foundry-agent-platform, microsoft-fabric |
| **Brand/media skills** | ~9 | ai-character-reference-generation, ai-generated-readme-banners, brand-asset-management, character-aging-progression, correax-brand, image-handling, visual-memory, heir-sync-management, release-preflight |

*Some global-knowledge skills may be portable; requires assessment.

---

## Parity Strategy

> **GitHub Copilot Web heir was discontinued on 2026-03-05.** Options A and B below are no longer applicable. Option C (Agent Plugin → Master parity) remains the active strategy.

### ~~Option A: GH Copilot Web → Plugin Parity~~ — DISCONTINUED
### ~~Option B: GH Copilot Web → Full Master Parity~~ — DISCONTINUED

### Option C: Agent Plugin → Full Master Parity
**Effort**: ~1 week
**What**: Promote remaining portable skills + instructions + prompts from Master to Plugin
**Consideration**: Many excluded items are intentionally platform-specific. Would require portability review per skill.
**Result**: Plugin goes from 66% → ~90%+ (after filtering non-portable items)

### Recommendation

Pursue **Option C** to close the Plugin → Master gap on genuinely portable skills.

---

## Content That Should NOT Transfer to Web/Plugin

These are Master-internal or platform-locked:

| Content | Reason |
| --- | --- |
| brain-qa, master-alex-audit | Master workspace validation only |
| dream-state, meditation, self-actualization | Require cognitive tools (MCP/extension) |
| heir-sync-management, release-preflight, release-process | Master operational workflows |
| chat-participant-patterns, vscode-extension-patterns | VS Code extension development only |
| m365-agent-debugging, teams-app-patterns | M365 platform only |
| persona-detection | Requires extension runtime |
| skill-catalog-generator | Requires file system access + Master paths |

---

## Next Steps

1. [ ] Assess Plugin portability of remaining Master-only skills
2. [ ] Promote portable skills from Master to Agent Plugin
3. [ ] Update sync-plugin.ps1 with expanded curated set
4. [ ] Validate Plugin parity post-promotion
