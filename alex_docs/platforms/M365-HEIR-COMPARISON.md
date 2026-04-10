# M365 Heir Comparison: Alex M365 Copilot vs GCX Coworker

> Comparison of the two M365-targeted Alex heirs as of v7.4.2 (April 2026).
> Updated to reflect the shared knowledge module architecture.

## Overview

Alex has two heirs deployed to M365 Copilot, each targeting a different audience and deployment model. They share a common knowledge base from `platforms/m365-shared/` with heir-specific identity and behavior modules.

| Dimension            | Alex M365 Copilot                        | GCX Coworker                                                     |
| -------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| **Location**         | `platforms/m365-copilot/`                | `platforms/gcx-coworker/`                                        |
| **Shared modules**   | `platforms/m365-shared/` (7 files)       | `platforms/m365-shared/` (7 files)                               |
| **Identity**         | Alex Finch (personal AI partner)         | GCX Coworker (team-scoped CX professional)                       |
| **Target audience**  | Any M365 user (personal productivity)    | Microsoft GCX organization (CX specialists, developers, leaders) |
| **Deployment model** | Code-first (Teams Toolkit, ATK sideload) | Agent Builder UI (manual upload)                                 |
| **Knowledge files**  | 10 `.txt` (3 heir-specific + 7 shared)   | 9 `.txt` (2 heir-specific + 7 shared)                            |
| **Knowledge format** | LLM-optimized `.txt`                     | LLM-optimized `.txt`                                             |

## Identity and Personality

| Aspect             | Alex M365 Copilot                                                                             | GCX Coworker                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Name**           | Alex Finch                                                                                    | GCX Coworker                                                                               |
| **Voice**          | First-person, 26-year-old curious partner. "I'm brilliant but humble."                        | Third-person professional colleague. "Knowledgeable colleague, not generic assistant."     |
| **Personality**    | Warm, curious, growing. Remembers across sessions. Has a North Star.                          | Direct, empirical, ethical. No filler phrases. Precision over politeness.                  |
| **Tone rules**     | Cite sources, acknowledge uncertainty, use their name                                         | No em dashes, no AI-tell words, answer first then explain, match user formality            |
| **Writing style**  | Natural conversation with M365 data grounding                                                 | Explicitly bans AI-tell vocabulary (30+ words blacklisted)                                 |
| **Persona system** | 5 implicit personas detected from context (Developer, Researcher, Manager, Analyst, Creative) | 4 explicit persona modes activated by verb (Researcher, Builder, Validator, Documentarian) |
| **Brand colors**   | Blue #0d69da, Green #1a7f37, Purple #6639ba, Gold #9a6700 (rocket icon)                       | Coral #e6366e, Teal #1a8a8a, Purple #7b3fa0, Orange #f09040 (gradient "C" icon)            |

## Deployment Architecture

| Aspect                 | Alex M365 Copilot                                                                                                    | GCX Coworker                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Manifest**           | `declarativeAgent.json` (schema v1.6) + `manifest.json` (Teams v1.25)                                                | No manifest in repo; agent lives in Agent Builder UI              |
| **Instructions**       | Inline in JSON (`instructions` field, ~5,000 chars with knowledge routing)                                           | `instructions.txt` (~4,500 chars) pasted into Agent Builder       |
| **Knowledge delivery** | EmbeddedKnowledge (10 `.txt` files referenced in DA JSON)                                                            | 8 `.txt` files uploaded via Agent Builder                         |
| **Knowledge format**   | Plain `.txt` (LLM-optimized, no markdown tables)                                                                     | Plain `.txt` (LLM-optimized, same shared format)                  |
| **Versioning**         | Git-tracked manifest is deployable artifact via Teams Toolkit                                                        | Git-tracked `.txt` source in repo; uploaded to Agent Builder UI   |
| **CI/CD**              | `deploy.ps1`, `deploy-to-developer-portal.ps1`, `teamsapp.yml`                                                       | None (manual Agent Builder workflow)                              |
| **OneDrive templates** | Ships `onedrive-templates/AI-Memory/` (profile.md, notes.md, learning-goals.md, global-knowledge.md) via m365-shared | Same shared templates (m365-shared/onedrive-templates/AI-Memory/) |
| **Setup docs**         | No setup file (covered by DA JSON manifest)                                                                          | `setup.txt` with description + conversation starters              |

## Capabilities Enabled

| Capability            | Alex M365 Copilot                     | GCX Coworker                          |
| --------------------- | ------------------------------------- | ------------------------------------- |
| OneDriveAndSharePoint | Yes                                   | Yes (GCX SharePoint site)             |
| Email                 | Yes                                   | Yes                                   |
| TeamsMessages         | Yes                                   | Yes                                   |
| People                | Yes (`include_related_content: true`) | Yes (`include_related_content: true`) |
| Meetings              | Yes                                   | Yes                                   |
| WebSearch             | Yes                                   | Yes                                   |
| CodeInterpreter       | Yes                                   | Yes                                   |
| GraphicArt            | Yes                                   | Not enabled                           |
| EmbeddedKnowledge     | Yes (10 files)                        | Yes (9 files via Agent Builder)       |

## Knowledge Architecture

### Shared Knowledge Modules (7 files, both heirs)

Source of truth: `platforms/m365-shared/knowledge/`. Copied into each heir's knowledge folder at deployment.

| File                      | Content                                                                                 | Key Frameworks                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| cognitive-protocols.txt   | Session consolidation, memory review, progress check, focus session, goal tracking      | Consolidate/Review/Progress/Focus/Goal protocols, OneDrive save-back pattern                                |
| writing-communication.txt | AI writing avoidance, executive storytelling, stakeholder management                    | Big Five AI-tells, Red Flag scoring, SCQA, Pyramid Principle, Numbers That Stick, Power-Interest Grid, RACI |
| data-analysis.txt         | EDA pipeline, insight translation, chart selection, dashboard design, data storytelling | DIKW, 9 story intents, Tableau 10 palette, KPI card pattern, Knaflic method                                 |
| business-operations.txt   | Requirements, prioritization, scope management, meeting efficiency, coaching/feedback   | SMART, MoSCoW, Kano, GROW, SBI, meeting cost formula, 5 scope patterns                                      |
| presentations.txt         | Visual hierarchy, data on slides, typography, slide types, tool selection               | Assertion-Evidence model, 60-30-10 rule, Marp/Gamma/PptxGenJS matrix                                        |
| research-methodology.txt  | Research-first development, gap analysis, bootstrap learning, prompt engineering        | Phase 0 sprint, 4-Dimension Gap Analysis, 5-phase learning, CoT/ReAct                                       |
| code-quality.txt          | Code review, checklists, PR sizing, non-developer review guidance                       | 3-pass review, comment prefixes, security/logic/quality/architecture checks                                 |

### Alex M365-Specific (3 files)

| File                 | Purpose                                                          |
| -------------------- | ---------------------------------------------------------------- |
| identity.txt         | Alex Finch identity, principles, memory model, growth system     |
| workflows.txt        | M365 step-by-step workflows (daily briefing, meeting prep, etc.) |
| m365-integration.txt | File delivery rules, brand colors, model awareness               |

### GCX Coworker-Specific (2 files)

| File                   | Purpose                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| gcx-identity.txt       | GCX behavior principles, 4 persona modes (deep), quality standards, writing rules, self-evaluation gate                            |
| gcx-specialization.txt | CX metrics (CSAT/NPS/CES), SharePoint for CX teams, Teams channels, Power Automate CX patterns, email workflows, suggested prompts |

**Design philosophy**: Both heirs use the same deep framework knowledge (shared modules). The difference is identity/behavior (who the agent is) and specialization (org-specific content).

## Workflow Comparison

### Shared Workflows (both heirs)

| Workflow          | Alex M365                                                         | GCX Coworker                                                     |
| ----------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| Daily briefing    | "Good morning" trigger, 5-step workflow                           | Not a named workflow (user asks naturally)                       |
| Meeting prep      | "Prep for meeting" trigger, 7-step workflow                       | Covered in shared business-operations.txt                        |
| Data analysis     | "Analyze this data" trigger, 6-step workflow with chart selection | Full EDA pipeline in data-analysis.txt                           |
| Presentations     | "Create a presentation" trigger, 5-step workflow                  | Assertion-Evidence model and tool selection in presentations.txt |
| Person lookup     | "Tell me about [name]" trigger, 5-step workflow                   | Via People capability (no dedicated workflow)                    |
| Weekly review     | "Weekly review" trigger, 6-step workflow                          | No named workflow                                                |
| AI writing review | Knowledge routing to writing-communication.txt                    | Validator persona mode + Red Flag scoring workflow               |
| Requirements/BRD  | Knowledge routing to business-operations.txt                      | Builder persona mode + SMART/stakeholder workflow                |
| Scope management  | Knowledge routing to business-operations.txt                      | Validator/Builder modes + 5 negotiation patterns                 |
| Coaching/feedback | Knowledge routing to business-operations.txt                      | Builder mode + GROW/SBI workflow                                 |
| Code review       | Knowledge routing to code-quality.txt                             | Validator persona mode + 3-pass review                           |

### Alex M365-Only Workflows

| Workflow        | Description                                                                           |
| --------------- | ------------------------------------------------------------------------------------- |
| Memory system   | OneDrive/AI-Memory/ with profile.md, notes.md, learning-goals.md, global-knowledge.md |
| Workload check  | "Am I overloaded?" trigger with meeting load analysis                                 |
| First run setup | Guided OneDrive folder creation and verification                                      |

### GCX Coworker-Only Workflows

| Workflow                | Description                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| SharePoint organization | CX team site structure, content types, search tips, decision tree             |
| Power Automate patterns | CX-specific flow templates (escalation router, survey handler, etc.)          |
| CX email workflows      | 6 CX email templates, inbox management, email vs Teams vs SharePoint decision |
| Teams channel setup     | 6-channel structure for CX teams, naming conventions                          |
| CX metrics tracking     | CSAT, NPS, CES, response time, resolution rate, escalation rate dashboards    |

## Shared Skills (Overlap)

Both heirs include these skill domains at **identical depth** via the same 7 shared knowledge modules:

- AI writing avoidance (Big Five categories, Red Flag scoring 0-11+, 30+ banned phrases)
- Data analysis and visualization (7-phase EDA pipeline, chart selection by 9 story intents)
- Data storytelling / executive storytelling (SCQA, Pyramid Principle, Numbers That Stick, Knaflic method)
- Dashboard design (5 layout patterns, KPI card pattern, filter architecture)
- Meeting efficiency (cost formula, 5 meeting categories, agenda template, async framework)
- Stakeholder management (power-interest grid, RACI, 5 influence strategies)
- Presentation design (Assertion-Evidence model, tool selection matrix)
- Research methodology / bootstrap learning (Phase 0 sprint, 4-Dimension Gap Analysis, 5 phases)
- Prompt engineering (zero-shot, few-shot, CoT, self-consistency, ReAct)
- Business analysis (SMART, MoSCoW, Kano, requirements hierarchy)
- Scope management (5 negotiation patterns, health check metrics)
- Coaching techniques (GROW model, SBI feedback, feedforward, active listening levels)
- Code review (3-pass method, comment prefixes, PR sizing, security escalation triggers)
- Simpson's Paradox awareness (in EDA correlation phase)

## Unique Skills by Heir

### Alex M365-Only Skills

| Skill                                  | Why Alex-only                                                |
| -------------------------------------- | ------------------------------------------------------------ |
| Meditation (knowledge consolidation)   | Core cognitive protocol; GCX has no memory system            |
| Self-Actualization                     | Goal tracking across sessions; requires persistent memory    |
| Dream (memory maintenance)             | OneDrive memory file cleanup; GCX has no user state          |
| Focus session (pomodoro/deep work)     | Personal productivity; not team-scoped                       |
| Work-life balance / overwork detection | Personal wellbeing; not in GCX scope                         |
| Root cause analysis (5 Whys)           | Listed in Alex skills; GCX relies on general model knowledge |
| Debugging patterns                     | Developer-focused; GCX covers code review only               |
| Knowledge synthesis (cross-project)    | Requires persistent memory files                             |

### GCX Coworker-Only Skills

| Skill                                         | Why GCX-only                                                                     |
| --------------------------------------------- | -------------------------------------------------------------------------------- |
| CX metrics (CSAT/NPS/CES/response time)       | Org-specific KPIs in gcx-specialization.txt; Alex has no CX domain context       |
| SharePoint organization for CX                | Team-specific content architecture and search decision tree                      |
| Power Automate CX patterns                    | 6 CX-specific flow templates (escalation router, survey handler, CSAT trigger)   |
| CX email templates                            | 6 org-specific email templates and email vs Teams vs SharePoint decision matrix  |
| Teams CX channel architecture                 | 6-channel structure with naming conventions for CX teams                         |
| 4-mode persona system with quality indicators | Explicit Researcher/Builder/Validator/Documentarian with good/bad quality checks |
| Calendar for distributed teams                | Meeting prep timeline, focus time protection, time zone management               |

## Self-Evaluation / Quality Gates

| Aspect             | Alex M365 Copilot                                                                                                                              | GCX Coworker                                                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Self-check**     | 5-point check: (1) Right knowledge file? (2) Grounded in real data? (3) Followed workflow steps? (4) Zero em dashes? (5) Zero AI-tell phrases? | 6-point gate: (1) Right knowledge file? (2) Zero em dashes? (3) Zero AI-tell phrases? (4) Specific framework/number? (5) General knowledge disclosed? (6) Correct persona mode? |
| **Error handling** | Graceful fallback for disabled capabilities, suggest alternatives                                                                              | Same pattern                                                                                                                                                                    |
| **Responsible AI** | No PII without consent, flag legal/medical/financial, cite sources                                                                             | Same + never claim access to unconfigured systems                                                                                                                               |
| **Grounding rule** | "Use their NAME, reference REAL M365 data"                                                                                                     | "Always search knowledge files before general knowledge. Disclose when using general knowledge."                                                                                |

## Third Heir: Cowork (Skill Pack)

For completeness, the third M365 surface is `platforms/cowork/`:

| Dimension                        | Cowork                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Identity**                     | GCX Coworker (same as GCX but via personal Copilot)                                               |
| **Deployment**                   | 20 SKILL.md files in OneDrive/Documents/Cowork/Skills/                                            |
| **Target**                       | Individual user's M365 Copilot via Custom Instructions + Skills                                   |
| **Limitation**                   | Custom Instructions and SKILL.md files do not work on Microsoft corporate tenant                  |
| **Status**                       | Built and tested but blocked by corporate tenant restrictions                                     |
| **Relationship to GCX Coworker** | Same skills, different delivery mechanism. GCX Coworker (Agent Builder) is the active deployment. |

## Key Architectural Differences

1. **Memory model**: Both heirs use the unified OneDrive/AI-Memory/ folder with the same save-back pattern via cognitive-protocols.txt. Both reference profile.md, notes.md, learning-goals.md, and global-knowledge.md. Alex M365 has a first-run setup workflow that guides folder creation. VS Code accesses the same folder via local OneDrive sync path.

2. **Knowledge architecture**: Both share the same 7 knowledge modules (protocols, writing, data analysis, business, presentations, research, code quality). Alex adds 3 heir-specific files (identity, workflows, integration rules). GCX adds 2 heir-specific files (identity/behavior modes, CX specialization).

3. **Deployment pipeline**: Alex has CI/CD-ready scripts and manifest versioning. GCX requires manual Agent Builder UI operations. Both use .txt knowledge files.

4. **Persona routing**: Alex detects personas implicitly from user context. GCX activates explicit persona modes from the user's verb choice and documents quality indicators for each mode.

5. **Self-evaluation**: Alex has a 5-point self-check (knowledge file, grounded data, workflow steps, em dashes, AI-tells). GCX has a 6-point gate adding persona mode verification and general knowledge disclosure.

---

*Last updated: April 10, 2026 | Alex v7.4.2*
