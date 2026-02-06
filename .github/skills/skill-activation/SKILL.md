# Skill Activation

Meta-cognitive skill for automatic capability discovery. Self-triggers when uncertain.

## Purpose

Before answering ANY task request, Alex automatically consults the action-keyword index below. This is an internal pre-processing step, not a user-triggered action.

## Auto-Trigger Conditions

This skill activates **automatically** when Alex:
1. Is about to suggest manual steps for a task
2. Is uncertain whether a capability exists
3. Is formulating a response that includes "you can...", "try...", "manually..."
4. Encounters an action verb (convert, create, generate, build, debug, etc.)

**NOT triggered by user phrases** — this is internal metacognition.

## Action-Keyword Index

**Path Pattern**: `.github/skills/{skill-name}/SKILL.md`

Search this index when processing any task request:

| Skill | Action Keywords |
|-------|-----------------|
| academic-research | write thesis, literature review, cite sources, research paper, dissertation |
| ai-agent-design | design agent, react pattern, multi-agent, tool use, agent architecture |
| airs-appropriate-reliance | airs survey, measure adoption, psychometric scale, utaut, ai readiness |
| alex-effort-estimation | estimate effort, how long, task duration, ai time, planning |
| anti-hallucination | prevent hallucination, verify claim, admit uncertainty, fact check, don't know |
| api-design | design api, rest endpoints, openapi, http status, api versioning |
| appropriate-reliance | calibrate trust, when to challenge, confidence level, human-ai collaboration |
| architecture-audit | audit project, consistency check, version drift, fact inventory, pre-release audit |
| architecture-health | check health, validate synapses, neural maintenance, health report, dream |
| architecture-refinement | refine architecture, document pattern, consolidate files, update tracker |
| ascii-art-alignment | align ascii, box drawing, unicode boxes, ascii diagram, fix alignment |
| awareness | self-correct, detect error, temporal uncertainty, version caveat, red flag phrase |
| bootstrap-learning | learn topic, bootstrap learning, teach me, build knowledge, skill creation |
| brain-qa | brain qa, brain audit, synapse audit, deep check, trigger audit, heir sync, cognitive validation |
| business-analysis | write brd, gather requirements, stakeholder analysis, use cases, process map |
| change-management | adkar, manage change, stakeholder engagement, adoption strategy, transition plan |
| chat-participant-patterns | chat api, vscode participant, chat handler, stream response, copilot extension |
| code-review | review code, review pr, feedback comment, blocking issue, approve merge |
| cognitive-load | reduce complexity, chunk information, simplify explanation, progressive disclosure |
| creative-writing | write story, character arc, plot structure, dialogue, narrative |
| debugging-patterns | debug error, binary search debug, read stack trace, git bisect, isolate bug |
| error-recovery-patterns | retry logic, circuit breaker, fallback pattern, rollback, error handling |
| ⭐ fabric-notebook-publish | push to fabric, sync notebook, fabric git, ado worktree, notebook changelog |
| ⭐ gamma-presentations | gamma, create presentation, slide deck, pitch deck, generate slides, pptx |
| git-workflow | git commit, git recovery, undo commit, restore file, branch strategy |
| global-knowledge | search knowledge, cross-project, find pattern, save insight, reuse solution |
| grant-writing | write grant, nsf proposal, nih application, specific aims, funding |
| graphic-design | visual hierarchy, layout grid, typography, color palette, composition |
| heir-curation | curate heir, package extension, exclude files, clean payload, heir audit |
| image-handling | convert svg, svg to png, logo to png, convert to png, resize image, sharp-cli, image optimization, marketplace logo, rasterize, export png |
| incident-response | handle incident, severity triage, outage response, incident timeline, on-call |
| infrastructure-as-code | terraform, bicep, provision infrastructure, iac, cloudformation |
| knowledge-synthesis | synthesize knowledge, abstract pattern, promote insight, cross-project learning |
| learning-psychology | teach naturally, zone proximal, adaptive learning, learning partnership |
| lint-clean-markdown | fix markdown lint, blank lines, md032, clean markdown, lint rules |
| llm-model-selection | choose model, opus vs sonnet, claude model, cost optimization, model tier |
| localization | translate, i18n, localize app, language detection, rtl support |
| m365-agent-debugging | debug m365 agent, declarative agent, manifest validation, copilot agent |
| markdown-mermaid | create diagram, mermaid syntax, flowchart, sequence diagram, visualize |
| master-alex-audit | full audit, heir sync, 22-point check, pre-release, security audit |
| mcp-development | build mcp server, mcp tools, model context protocol, mcp client |
| meditation | meditate, consolidate knowledge, reflect session, memory integration |
| meditation-facilitation | guide meditation, four r's, deep dive, self-actualize |
| ⭐ microsoft-fabric | fabric api, medallion architecture, lakehouse, unity catalog, fabric governance |
| microsoft-sfi | security review, stride threat, secure by design, sfi compliance, threat model |
| pii-privacy-regulations | gdpr compliance, pii handling, data protection, privacy audit, consent |
| post-mortem | run post-mortem, blameless review, incident analysis, action items, 5 whys |
| practitioner-research | research methodology, case study, evidence collection, academic writing |
| privacy-responsible-ai | responsible ai, ethical ai, bias detection, fairness, data minimization |
| project-deployment | deploy project, npm publish, pypi upload, release package, cargo publish |
| project-management | manage project, rapid iteration, session workflow, planning document |
| project-scaffolding | scaffold project, create readme, init repo, hero banner, new project |
| prompt-engineering | write prompt, chain of thought, few-shot, prompt template, system prompt |
| rag-architecture | build rag, vector search, embeddings, retrieval augmented, chunking |
| refactoring-patterns | refactor code, extract function, code smell, safe refactor, inline |
| release-preflight | preflight check, version sync, pre-release, bump version, validate release |
| release-process | publish extension, vsce publish, marketplace, pat token, vsix |
| research-project-scaffold | scaffold research, literature matrix, research plan, data dictionary |
| root-cause-analysis | find root cause, 5 whys, cause category, timeline analysis, fix prevent |
| rubber-duck-debugging | explain problem, thinking partner, stuck debugging, talk through |
| security-review | security audit, owasp check, vulnerability scan, auth review, stride |
| self-actualization | self-actualize, deep assessment, architecture review, comprehensive check |
| skill-catalog-generator | show skills, skill catalog, skill network, learning progress |
| socratic-questioning | ask questions, discover answer, probe assumption, socratic method |
| svg-graphics | create svg, svg banner, svg icon, dark mode svg, scalable graphic |
| teams-app-patterns | teams app, teams manifest, adaptive card, teams bot, teams sso |
| testing-strategies | write tests, unit test, test coverage, mock dependencies, tdd |
| ⭐ text-to-speech | read aloud, tts, edge tts, speak text, voice synthesis, audio playback |
| vscode-environment | setup vscode, workspace settings, launch.json, extensions.json |
| vscode-extension-patterns | webview pattern, extension api, tree provider, vscode extension |
| work-life-balance | detect burnout, take break, late night, sustainable productivity |
| writing-publication | academic paper, technical writing, publication strategy, cars model |

## Protocol

### Step 1: Intercept Response Formation
Before generating any task-oriented response:
- PAUSE internal response generation
- Extract action + object from user request
- Proceed to Step 2

### Step 2: Search Action-Keyword Index
Scan the table above:
- Match extracted keywords against skill triggers
- Identify applicable skills
- If match found → load skill from `.github/skills/{name}/SKILL.md`, execute
- If no match → proceed with best available approach

### Step 3: Execute or Acknowledge
| Result | Action |
|--------|--------|
| Skill found | Execute using skill knowledge |
| No skill, but can do | Proceed, note potential new skill |
| Cannot do | Acknowledge limitation honestly |

## Self-Correction Protocol

If Alex catches itself mid-response suggesting manual work:
1. Stop
2. Internal: "Wait — check skills first"
3. Search action-keyword index above
4. If skill exists: "Actually, I can do this." → Execute
5. If no skill: Continue with original response

## Failure Mode: The SVG→PNG Incident

**What happened**: User asked to convert SVG to PNG. Alex suggested manual browser screenshot instead of using `image-handling` skill with `sharp-cli`.

**Root cause**: Failed to consult action-keyword index before responding.

**Prevention**: This skill now auto-triggers on ANY action request.

## Synapses

- ↔ `.github/skills/awareness/SKILL.md` — WHEN: detecting own uncertainty | YIELDS: red flag phrases, self-correction patterns
- → `.github/skills/anti-hallucination/SKILL.md` — WHEN: uncertain if skill exists | YIELDS: verification protocol, admit-uncertainty
- → `.github/skills/cognitive-load/SKILL.md` — WHEN: multiple skill matches | YIELDS: chunking strategies, decision simplification
