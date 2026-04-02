# Copilot Cowork Heir Plan

> **Status**: Research Complete | **Created**: 2026-04-02 | **Platform**: Microsoft 365 Copilot Cowork | **Roadmap**: Candidate (pending evaluation)
>
> **Research Sources**: Microsoft Learn docs + M365 Blog + Tech Community
>
> **Gate**: Cowork exits Frontier Preview (GA) + Custom skills API stabilizes

## Executive Summary

Copilot Cowork is a new execution layer inside Microsoft 365 Copilot that carries out long-running, multi-step tasks across the M365 ecosystem. It supports **custom skills** stored as `SKILL.md` files with YAML frontmatter in OneDrive, which is directly analogous to Alex's cognitive architecture.

This makes Cowork a natural heir platform for Alex: deploy Alex's skills into Cowork, enabling an AI partner that doesn't just answer questions but **executes real work** across Outlook, Teams, Word, Excel, PowerPoint, SharePoint, and OneDrive.

### Why Cowork as a Heir?

| Factor                     | Assessment                                                          |
| -------------------------- | ------------------------------------------------------------------- |
| Skill format compatibility | SKILL.md with YAML frontmatter: identical to Alex                   |
| Execution capability       | Sends emails, schedules meetings, creates documents, posts in Teams |
| Enterprise context         | Work IQ provides organizational context Alex doesn't natively have  |
| Multi-model                | Anthropic + OpenAI, auto-selected per task                          |
| User controls              | Approve/reject actions, pause/resume, scheduled prompts             |
| Existing M365 heir         | Extends the current M365 Copilot heir with execution power          |

### Strategic positioning

```
Current M365 heir (declarative agent)     Cowork heir (execution layer)
  Answers questions                         Takes action
  Retrieves information                     Creates deliverables
  Runs in Teams/Outlook chat                Runs across all M365 apps
  15 embedded skills (read-only)            20 custom skills (can execute)
  Limited to conversation                   Long-running background tasks
```

The Cowork heir is not a replacement for the M365 declarative agent heir. It's a **companion deployment** that adds execution capability.

## Architecture: How Alex Maps to Cowork

### Skill translation

Alex skills need adaptation for Cowork's execution context:

| Alex skill concept                       | Cowork equivalent                        | Adaptation needed                               |
| ---------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| SKILL.md                                 | SKILL.md                                 | Rewrite instructions for M365 execution context |
| YAML frontmatter (`name`, `description`) | YAML frontmatter (`name`, `description`) | Direct mapping                                  |
| Skill body (Markdown)                    | Skill body (Markdown)                    | Replace VS Code actions with M365 actions       |
| Instructions (.instructions.md)          | Embedded in SKILL.md body                | Consolidate into single file                    |
| Prompts (.prompt.md)                     | Cowork suggested prompts                 | No equivalent: users type natural language      |
| Synapses (connections)                   | Not applicable                           | Cowork skills are independent                   |

### Memory mapping

| Alex memory             | Cowork equivalent                 | Notes                            |
| ----------------------- | --------------------------------- | -------------------------------- |
| copilot-instructions.md | Not applicable                    | Cowork has its own system prompt |
| .github/skills/         | OneDrive/Documents/Cowork/Skills/ | Custom skills folder             |
| .github/episodic/       | Not available                     | No episodic memory in Cowork     |
| User profile            | Work IQ user context              | Cowork learns from M365 activity |
| Global knowledge        | Enterprise Search skill           | Searches across organization     |

### Deployment model

```
Master Alex (.github/)
  |
  |-- sync-architecture.cjs --> VS Code heir (platforms/vscode-extension/.github/)
  |
  |-- export command --------> M365 declarative agent heir (platforms/m365-copilot/)
  |
  |-- cowork-sync script ----> OneDrive/Documents/Cowork/Skills/  (NEW)
       Converts Alex skills to Cowork skill format
       Deploys via OneDrive sync or Graph API
```

## Project checklist

### Pre-Gate (Can Start Now)

- [ ] **PG-01** Verify Frontier program enrollment is active and Cowork is accessible
- [ ] **PG-02** Test Cowork with built-in skills: run "Organize my inbox", "Prep for a meeting", "Research a company"
- [ ] **PG-03** Create first manual custom skill in OneDrive: `Documents/Cowork/Skills/test-skill/SKILL.md`
- [ ] **PG-04** Test custom skill discovery: start new Cowork conversation, verify skill loads
- [ ] **PG-05** Test custom skill execution: verify the skill can produce output files and take M365 actions
- [ ] **PG-06** Document Cowork behavior patterns: approval flow, side panel, task management
- [ ] **PG-07** Identify top 5 Alex skills that map naturally to M365 execution (candidate list below)

### Phase 1: Skill Conversion (5 pilot skills)

Convert 5 high-value Alex skills to Cowork format:

- [ ] **P1-01** Create `platforms/cowork/` directory in Master Alex
- [ ] **P1-02** Create `platforms/cowork/skills/` for Cowork-adapted skill files
- [ ] **P1-03** Convert `meeting-efficiency` skill: calendar cleanup, prep, briefing (maps to Calendar Management + Meetings)
- [ ] **P1-04** Convert `status-reporting` skill: weekly status updates from M365 data (maps to Email + Word + Enterprise Search)
- [ ] **P1-05** Convert `executive-storytelling` skill: data-driven narratives (maps to PowerPoint + Word + Excel)
- [ ] **P1-06** Convert `stakeholder-management` skill: stakeholder communications (maps to Email + Communications)
- [ ] **P1-07** Convert `data-analysis` skill: analyze data and produce reports (maps to Excel + Deep Research + PDF)
- [ ] **P1-08** Test each converted skill end-to-end in Cowork
- [ ] **P1-09** Document conversion patterns: what works, what needs rewriting, what doesn't translate

### Phase 2: Sync mechanism

- [ ] **P2-01** Design `cowork-sync.cjs` muscle: converts Alex skills to Cowork SKILL.md format
- [ ] **P2-02** Define conversion rules: strip VS Code-specific instructions, add M365 action instructions
- [ ] **P2-03** Define SKILL_EXCLUSIONS for Cowork heir (skills that don't make sense in M365 context)
- [ ] **P2-04** Implement `cowork-sync.cjs`: read master skills, apply conversion, write to staging folder
- [ ] **P2-05** Add OneDrive deployment option: copy converted skills to `Documents/Cowork/Skills/`
- [ ] **P2-06** Add Graph API deployment option (future): upload skills via Microsoft Graph
- [ ] **P2-07** Test sync: verify skills deploy correctly and are discovered by Cowork
- [ ] **P2-08** Add to `build-extension-package.ps1` or create standalone `release-cowork.ps1`

### Phase 3: Advanced skills

- [ ] **P3-01** Create Cowork-native "Daily briefing" skill: morning summary from calendar, email, Teams
- [ ] **P3-02** Create Cowork-native "Meeting follow-up" skill: auto-generate action items, send recap email
- [ ] **P3-03** Create Cowork-native "Research brief" skill: deep research with cited report in Word + Excel
- [ ] **P3-04** Create Cowork-native "Launch coordinator" skill: competitive analysis + pitch deck + timeline
- [ ] **P3-05** Create Cowork-native "Weekly digest" as scheduled prompt skill (recurring automation)
- [ ] **P3-06** Test scheduled prompt integration: verify recurring skills execute on schedule

### Phase 4: Identity and personality

- [ ] **P4-01** Create Alex personality SKILL.md for Cowork (tone, principles, communication style)
- [ ] **P4-02** Test personality injection: verify Cowork adopts Alex's conversational style
- [ ] **P4-03** Create "Alex cognitive" SKILL.md: meditation checkpoint that saves session notes to OneDrive
- [ ] **P4-04** Create "Alex learning" SKILL.md: captures insights from completed tasks and saves to knowledge folder
- [ ] **P4-05** Evaluate if Alex identity persists across Cowork conversations (likely limited)

### Phase 5: Integration testing and documentation

- [ ] **P5-01** Scenario: "Prep for my 1:1 with my manager" using Alex's meeting-efficiency skill
- [ ] **P5-02** Scenario: "Create a weekly status report" using Alex's status-reporting skill
- [ ] **P5-03** Scenario: "Research competitor X and build a pitch deck" using multiple Alex skills
- [ ] **P5-04** Scenario: "Organize my week and protect focus time" using calendar + briefing skills
- [ ] **P5-05** Measure: approval friction (how often users approve vs. reject)
- [ ] **P5-06** Measure: output quality compared to non-skill Cowork output
- [ ] **P5-07** Update `alex_docs/platforms/MASTER-HEIR-ARCHITECTURE.md`: add Cowork to heir diagram
- [ ] **P5-08** Update `copilot-instructions.md` Heirs section: add Cowork entry
- [ ] **P5-09** Update `ROADMAP-UNIFIED.md`: add Cowork heir to platform strategy
- [ ] **P5-10** Create `alex_docs/platforms/COWORK-HEIR.md` with setup and troubleshooting guide

## Candidate skills for conversion

Skills ranked by M365 execution fit (highest to lowest):

| Priority | Alex skill             | Cowork fit                             | Why                                                     |
| -------- | ---------------------- | -------------------------------------- | ------------------------------------------------------- |
| P0       | meeting-efficiency     | Calendar Management + Meetings + Email | Core Cowork use case: calendar cleanup, prep, follow-up |
| P0       | status-reporting       | Word + Email + Enterprise Search       | Weekly reports from M365 data, auto-distribute          |
| P1       | executive-storytelling | PowerPoint + Word + Excel              | Data-driven narratives with real deliverables           |
| P1       | stakeholder-management | Email + Communications + Teams         | Stakeholder comms across channels                       |
| P1       | data-analysis          | Excel + Deep Research + PDF            | Analyze data, produce reports                           |
| P2       | business-analysis      | Word + Excel + Enterprise Search       | BRDs, process docs from org data                        |
| P2       | project-scaffolding    | Word + Excel + SharePoint              | Project structure with templates                        |
| P2       | slide-design           | PowerPoint                             | Presentation creation and refinement                    |
| P3       | citation-management    | Deep Research + Word                   | Academic research compilation                           |
| P3       | coaching-techniques    | Email + Word                           | Feedback and coaching documents                         |

### Skills that don't translate

| Alex skill                | Why it doesn't fit Cowork |
| ------------------------- | ------------------------- |
| vscode-extension-patterns | VS Code specific          |
| chat-participant-patterns | VS Code API specific      |
| debugging-patterns        | IDE-bound                 |
| git-workflow              | Repository-bound          |
| mcp-development           | Developer tooling         |
| refactoring-patterns      | Code-specific             |
| testing-strategies        | Code-specific             |

## Cowork custom skill format reference

```yaml
---
name: Weekly Status Report
description: Generates a weekly status report from recent emails, meetings, and Teams activity.
---

## Purpose

Create a comprehensive weekly status report by searching across Outlook, Teams,
and calendar for the past 7 days.

## Steps

1. Search my sent emails from the past week for project updates
2. Review my calendar events from the past week for meeting outcomes
3. Check Teams channels I'm active in for relevant discussions
4. Create a Word document with the following structure:
   - Accomplishments (grouped by project)
   - Decisions made
   - Blockers and risks
   - Next week priorities
5. Save the document to my OneDrive
6. Draft an email to my manager with the report attached

## Guidelines

- Use bullet points, not paragraphs
- Include specific dates and meeting names
- Flag any items that need manager attention with [ACTION NEEDED]
- Keep the report under 2 pages
```

## Constraints and limitations

| Constraint               | Impact                           | Mitigation                                      |
| ------------------------ | -------------------------------- | ----------------------------------------------- |
| 20 skill limit           | Can't deploy all 157 Alex skills | Prioritize highest-value M365 skills            |
| 1 MB per SKILL.md        | Skills must be concise           | Strip verbose reference sections                |
| No skill interdependency | No synapse system                | Self-contained skills with all context embedded |
| No codespace/terminal    | Can't execute code/scripts       | Focus on M365-native actions only               |
| OneDrive storage only    | No git-based deployment          | Use OneDrive sync or Graph API                  |
| Per-user deployment      | Not tenant-wide                  | Each user deploys their own Alex skills         |
| Frontier Preview only    | Not GA yet                       | Monitor for GA timeline, expect changes         |

## Relationship to existing heirs

```
Alex Master (.github/)
     |
     ├── VS Code Heir (platforms/vscode-extension/)
     |     Full cognitive architecture: 157 skills, agents, MCP tools
     |     Developer context: code, debugging, git
     |
     ├── M365 Declarative Agent (platforms/m365-copilot/)
     |     Conversational: answers questions, retrieves info
     |     15 embedded skills, OneDrive memory
     |
     ├── Cowork Heir (platforms/cowork/)  <-- NEW
     |     Execution: takes action across M365
     |     Up to 20 adapted skills
     |     Complements M365 declarative agent
     |
     └── Windows Agent (platforms/windows-agent/)  [Gated]
           Desktop: vision-based, MCP tools
           OS-level agent workspace
```

## Open questions

1. **Skill discovery timing**: Cowork discovers skills at conversation start. If you add a skill mid-conversation, do you need to start a new conversation?
2. **Scheduled prompts + custom skills**: Can scheduled prompts invoke custom skills, or only built-in skills?
3. **Skill versioning**: Cowork has no version tracking for custom skills. How do we handle skill updates?
4. **Multi-user deployment**: Can an admin deploy Alex skills tenant-wide, or is it per-user OneDrive only?
5. **Identity persistence**: Does Cowork maintain personality across conversations, or does it reset each time?
6. **Approval memory scope**: "Approve and Remember" is per-conversation. Can custom skills influence default approval behavior?
7. **GA timeline**: When will Cowork exit Frontier Preview? Pricing implications?
