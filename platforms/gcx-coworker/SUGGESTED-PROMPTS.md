# GCX Coworker: Suggested Prompts

Example prompts organized by capability. Use these to get started or share with your team.

## Writing and Communication (File 02)

| Prompt                                                                                 | What it activates                                                                                           |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Score this email draft using the Red Flag system. How AI-generated does it sound?      | Big Five AI-tell categories, Red Flag scoring (0-2 human, 3-5 needs revision, 6-10 significant AI patterns) |
| Rewrite this paragraph to sound more human. Keep the same meaning.                     | AI writing avoidance patterns, sentence variation, active voice                                             |
| Write a one-page executive summary of this report for our VP using the SCQA framework. | Situation-Complication-Question-Answer structure, Numbers That Stick                                        |
| Help me write a status report for Sprint 12 using the Coral Framework.                 | Coral Framework methodology, structured status template                                                     |
| I need to present bad news to stakeholders. Help me frame it constructively.           | Pyramid Principle, objection handling, stakeholder communication                                            |
| Map the stakeholders for this initiative using a power-interest grid.                  | Stakeholder power-interest grid, influence strategies, RACI                                                 |
| Review this document and tell me exactly which sentences have AI-tell patterns.        | Document audit checklist (quick scan + deep scan)                                                           |

## Data Analysis and Visualization (File 03)

| Prompt                                                                             | What it activates                                                                          |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Walk me through a full EDA of this CSV. Start with profiling.                      | Full EDA pipeline: profiling, descriptive stats, distributions, correlations, segmentation |
| What chart should I use to show how customer satisfaction changed over 12 months?  | Story-intent chart selection (trend intent, line chart recommendation)                     |
| Translate these statistics into business language my manager will understand.      | DIKW hierarchy, WHAT / SO WHAT / NOW WHAT insight template                                 |
| Create a chart comparing CSAT scores across 5 regions. Use colorblind-safe colors. | Tableau 10 palette, grouped bar chart, annotation patterns                                 |
| Design a KPI dashboard layout for our monthly CX review.                           | KPI card design (metric + delta + context), filter architecture, 5-visual rule             |
| I have a chart from another team. Help me interpret what it's really saying.       | Chart interpretation: type identification, encoding analysis, bias detection               |
| Build a three-act data story from this analysis for the leadership review.         | Data storytelling: setup (KPIs), confrontation (breakdown), resolution (recommendation)    |

## Business Operations (File 04)

| Prompt                                                                        | What it activates                                                                                |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Help me write a BRD for our new customer feedback portal.                     | BRD structure, SMART criteria, requirements hierarchy                                            |
| I think my project has scope creep. Help me assess it.                        | Scope health check metrics, warning signs table                                                  |
| A stakeholder wants to add a feature mid-sprint. What do I say?               | 5 scope negotiation patterns (Capture & Defer, Trade-Off, MVP Challenge, 80/20 Cut, Parking Lot) |
| Prioritize these 12 requirements. We can only deliver 6 this quarter.         | MoSCoW method with guidance percentages, priority matrix                                         |
| Prepare a coaching conversation. My direct report missed two deadlines.       | GROW model (all four phases), SBI feedback model                                                 |
| Should this be a meeting or an async update?                                  | Meeting-or-not decision tree, async alternatives                                                 |
| Create an agenda for a 45-minute project kickoff with 8 people.               | Agenda template, time boxing, facilitation techniques                                            |
| Help me run a retrospective for our team.                                     | Sprint retrospective template, facilitation patterns                                             |
| I need to elicit requirements but the stakeholders keep changing their minds. | Elicitation techniques, progressive elaboration, requirements traceability                       |

## Presentations and Slides (File 05)

| Prompt                                                                | What it activates                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| What's the best visual hierarchy for a slide about quarterly results? | Assertion-Evidence model, data visualization on slides             |
| Should I use Marp, Gamma, or PowerPoint for this presentation?        | Tool selection decision matrix (speed, audience, fidelity)         |
| Review this slide deck for common design mistakes.                    | Slide design checklist, cognitive load reduction, typography rules |
| Convert these bullet points into a visual slide layout.               | Visual hierarchy patterns, slide type library                      |

## Research Methodology (File 06)

| Prompt                                                                         | What it activates                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| I need to evaluate 3 vendor tools. Structure the comparison.                   | Phase 0 research sprint, evidence standards, comparison framework                           |
| Help me learn about a topic I know nothing about.                              | Bootstrap learning 5 phases (Discovery, Foundation, Elaboration, Connection, Consolidation) |
| What's the gap between what we know and what we need to know for this project? | 4-Dimension Gap Analysis                                                                    |
| Write better prompts for Copilot to get more useful answers.                   | Prompt engineering patterns, chain-of-thought, few-shot examples                            |
| Test my understanding: can I explain this topic clearly enough to teach it?    | Feynman check, teaching test for knowledge validation                                       |

## Code Quality (File 07)

| Prompt                                                                        | What it activates                                                     |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| I'm not a developer but I need to review this pull request. Where do I start? | CX-focused code review guidance, reading PRs as a non-developer       |
| What should I look for in a code review?                                      | 3-pass review method, comment prefixes (must/should/consider/nitpick) |
| Does this change need a security review before shipping?                      | Security review triggers, quick security questions checklist          |
| How do NASA-grade code standards apply to our project?                        | NASA/JPL Power of 10 rules adapted for practical use                  |

## M365 Workflows (File 08)

| Prompt                                                                    | What it activates                                                     |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| How should our CX team organize SharePoint for maximum findability?       | SharePoint organization for CX teams, naming conventions, search tips |
| Should I post this in a Teams channel, group chat, or send an email?      | Chat vs channel vs email decision framework                           |
| Build a Power Automate flow to notify me when CSAT drops below threshold. | Power Automate patterns for CX automation                             |
| Help me set up a recurring meeting cadence for a distributed CX team.     | Calendar integration patterns for distributed teams                   |
| What are the best ways to use M365 Copilot across Word, Excel, and Teams? | M365 Copilot usage tips per app                                       |

## Cross-Capability Prompts

These prompts combine multiple knowledge files and capabilities:

| Prompt                                                                                        | Files/capabilities used                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Check my email for action items from the past week and help me prioritize them using MoSCoW.  | Email capability + File 04 (MoSCoW)                           |
| Summarize yesterday's team standup transcript, then help me write a status update from it.    | Meetings capability + File 02 (Coral Framework)               |
| Analyze this survey data, create a dashboard, and write the executive summary for leadership. | Code Interpreter + File 03 (EDA + dashboard) + File 02 (SCQA) |
| Research best practices for customer feedback loops, then draft a BRD for implementing one.   | File 06 (research sprint) + File 04 (BRD)                     |
| Find what Sarah sent about the Q3 metrics, analyze the attached data, and prepare 3 slides.   | Email capability + Code Interpreter + File 05 (slides)        |

## Tips for Getting the Best Results

- **Be specific about the framework**: "Use the SCQA framework" gets better results than "write a summary."
- **Attach data early**: Upload CSVs or paste tables in your first message so Code Interpreter can start immediately.
- **Name the persona**: "As a Validator, review this..." or "In Researcher mode, investigate..." activates the right behavior.
- **Ask for the template**: "What template should I use for this?" triggers knowledge file search for the right structure.
- **Chain requests**: Start with analysis, then ask for the deliverable. "Analyze this data, then build the dashboard, then write the exec summary."
