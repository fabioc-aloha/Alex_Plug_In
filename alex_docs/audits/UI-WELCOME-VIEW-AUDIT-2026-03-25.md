# Welcome View UI Audit

**Date**: 2026-03-25
**Scope**: All 4 tabs of the Welcome View sidebar (Mission, Mind, Skill Store, Docs)
**Goal**: Assess whether each displayed item is truly useful to users
**Remediation**: Completed same day -- Phase/Mode selectors, Identity card, Install from GitHub, Global Knowledge static icons, Knowledge Freshness, Honest Uncertainty, Practice section, Books section all removed. Reference section folded into Architecture. Playbooks expanded from 5 to 8 categories matching live site. CTA redesigned with companion tool links. All inline styles moved to CSS classes.

## Mission Tab

| Item                                         | Verdict       | Notes                                                                                                                                                                                            |
| -------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Personality toggle** (Auto/Precise/Chatty) | Useful        | Writes `Tone:` to copilot-instructions.md. Tangible effect on AI behavior.                                                                                                                       |
| ~~**Phase selector**~~                       | REMOVED       | No behavioral enforcement. Removed from UI, code, and copilot-instructions.md.                                                                                                                   |
| ~~**Mode selector**~~                        | REMOVED       | No behavioral enforcement. Removed from UI, code, and copilot-instructions.md.                                                                                                                   |
| **PARTNERSHIP group**                        | Mostly useful | Chat, North Star, Rubber Duck all open chat with useful prompts. Initialize/Update is critical. Feedback links to GitHub Issues.                                                                 |
| **BUILD group**                              | Useful        | Code Review, Debug, Tests, Audit, Preflight, Diagnostics, PR Review all trigger real commands.                                                                                                   |
| **CREATE group**                             | Useful        | PPTX, Gamma, Image Gen, Image Edit all trigger real workflows. All require API keys though -- no indication if keys are missing until you click.                                                 |
| **LEARN & KNOWLEDGE group**                  | Mixed         | "Ask About Selection" and "Save Insight" are useful. "Generate Diagram" is useful. "Export Memory" opens chat with a prompt -- it's an LLM-dependent action, not a real export command. Fragile. |

## Mind Tab

| Item                           | Verdict  | Notes                                                                                                                                     |
| ------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| ~~**Identity card**~~          | REMOVED  | Vanity -- showed "Alex Finch" + version with no actionable value. Removed.                                                                |
| **Agent Context panel**        | Useful   | Shows current Persona, Tone, Priorities, Principles, North Star. Read-only mirror of copilot-instructions.md. Clickable to edit the file. |
| **Architecture health banner** | Useful   | Synapse count + broken count at a glance. Links to Health Dashboard.                                                                      |
| ~~**Global Knowledge card**~~  | REWORKED | Static icons removed. Now shows only the "Search Knowledge" button when GK repo is available.                                             |
| **Memory Architecture card**   | Useful   | Shows real counts (Skills, Instructions, Prompts, Agents, Episodic). Factual.                                                             |
| **Maintenance card**           | Useful   | Last Dream/Meditation dates. Clickable to trigger. Meditation streak count.                                                               |
| ~~**Knowledge Freshness**~~    | REMOVED  | Freshness buckets and "Review Fading Skills" button removed -- the button just opened chat with a prompt, not a real analysis.            |
| ~~**Honest Uncertainty**~~     | REMOVED  | Calibration bars and "Review Low-Confidence" button removed -- same LLM-prompt-only pattern with no real data analysis.                   |
| **API Keys**                   | Useful   | Real status (Set/Missing) for each token. Links to Manage Keys.                                                                           |
| **Quick Settings**             | Useful   | Real VS Code setting toggles. Actionable.                                                                                                 |

## Skill Store Tab

| Item                             | Verdict | Notes                                                                    |
| -------------------------------- | ------- | ------------------------------------------------------------------------ |
| **Skill count + search**         | Useful  | Searchable, categorized.                                                 |
| **Skill cards**                  | Useful  | Click opens chat to explain the skill. Synapse indicator is informative. |
| **Health bar** (synapses/broken) | Useful  | Quick status.                                                            |
| ~~**"Install from GitHub"**~~    | REMOVED | Misleading -- no actual GitHub skill install mechanism existed. Removed. |

## Docs Tab

| Item                                                                | Verdict               | Notes                                                                                                                                                                 |
| ------------------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tips** (meditate, file-type activation, dream)                    | Useful for onboarding | Dismissible. Good first-use guidance.                                                                                                                                 |
| **Getting Started** (Setup, How We Work, Quick Ref, Responsible AI) | Useful                | All open real docs or commands.                                                                                                                                       |
| **Architecture docs**                                               | Useful                | Brain Anatomy (3D viz), Cognitive Architecture, Memory Systems, Conscious Mind, Agent Catalog, Trifecta Catalog, Skill-to-Discipline Map. All open real bundled docs. |
| ~~**Reference** (Skill-to-Discipline Map)~~                         | FOLDED                | Merged into Architecture section. Hardcoded "133 skills" count replaced with generic "Skills mapped to disciplines".                                                  |
| **Playbooks** (8 categories + "Browse all 80 playbooks")            | External dependency   | All link to learnai.correax.com. Updated from 5 to 8 categories matching live site. Anchors aligned with site section IDs.                                            |
| ~~**Practice** (Self-Study, Exercises, Quiz, AIRS)~~                | REMOVED               | External links moved to companion site CTA. Dead command handlers cleaned from welcomeView.ts.                                                                        |
| ~~**Books**~~                                                       | REMOVED               | External link. Dead command handler cleaned. actionButton import removed from docsTabHtml.                                                                            |
| **CTA** ("Browse learnai.correax.com")                              | Redesigned            | Updated copy ("LearnAI" branding). Added Prompt Engineering, AI Readiness, AI Adoption companion tool links.                                                          |

## Issues Summary

### Resolved

1. ~~**Phase/Mode selectors**~~ -- REMOVED. No behavioral enforcement existed.
2. ~~**Global Knowledge card**~~ -- REWORKED. Static icons removed, kept Search button only.
3. ~~**"Install from GitHub" card**~~ -- REMOVED. Implied a feature that didn't exist.
4. ~~**"Review Fading Skills" / "Review Low-Confidence"**~~ -- REMOVED. Just opened chat with prompts.
5. ~~**Identity card**~~ -- REMOVED. Vanity with no utility.
6. ~~**"133 skills mapped to 76 disciplines"**~~ -- FIXED. Hardcoded count replaced with generic label. Card folded into Architecture section.
7. ~~**Docs tab CTA redundancy**~~ -- FIXED. Practice and Books sections removed. CTA redesigned as standalone LearnAI hub with companion tool links.
8. ~~**Practice section**~~ -- REMOVED. 4 external link buttons (Self-Study, Exercises, Quiz, AIRS) and dead command handlers cleaned.
9. ~~**Books section**~~ -- REMOVED. External link button and dead command handler cleaned.
10. ~~**Playbook categories stale**~~ -- FIXED. Expanded from 5 to 8 categories matching live site. Anchors aligned with site section IDs.
11. ~~**Inline styles scattered**~~ -- FIXED. All inline styles in tab HTML files moved to CSS classes (playbook-browse-row, docs-cta-links, agent-context-edit).

### Remaining

1. **Export Memory button** -- Just opens chat with a prompt. Not a real export.
2. **API key status on CREATE buttons** -- No indication if keys are missing until you click.

## Recommended Actions

| Priority | Action                                                | Impact                                               |
| -------- | ----------------------------------------------------- | ---------------------------------------------------- |
| ~~P0~~   | ~~Remove Phase/Mode selectors~~                       | DONE -- removed from UI, code, copilot-instructions  |
| ~~P0~~   | ~~Remove "Install from GitHub" card~~                 | DONE -- removed                                      |
| ~~P1~~   | ~~Fix Global Knowledge card~~                         | DONE -- static icons removed, kept Search button     |
| ~~P1~~   | ~~Remove hardcoded skill count~~                      | DONE -- generic label, card folded into Architecture |
| ~~P1~~   | ~~Remove Knowledge Freshness card~~                   | DONE -- removed                                      |
| ~~P1~~   | ~~Remove Honest Uncertainty card~~                    | DONE -- removed                                      |
| ~~P2~~   | ~~Remove Identity card~~                              | DONE -- removed                                      |
| ~~P2~~   | ~~Remove Practice + Books sections~~                  | DONE -- removed sections and dead handlers           |
| ~~P2~~   | ~~Redesign Docs tab CTA~~                             | DONE -- LearnAI hub with companion tool links        |
| ~~P2~~   | ~~Expand playbook categories to match site~~          | DONE -- 5 to 8 categories, anchors aligned           |
| ~~P2~~   | ~~Move inline styles to CSS classes~~                 | DONE -- 3 new CSS classes                            |
| P3       | Add API key status indicators to CREATE group buttons | Better UX -- users know before clicking              |
