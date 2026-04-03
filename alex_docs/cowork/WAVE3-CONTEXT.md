# Wave 3 Context: Frontier Transformation

Source: Microsoft blogs and Tech Community, collected 2026-04-02

## Wave 3 of Microsoft 365 Copilot

Wave 3 marks a new version of Microsoft 365 Copilot, moving beyond assistance to embedded agentic capabilities. It was announced on March 9, 2026, by Jared Spataro (CMO, AI at Work) and Charles Lamanna (President, Business Applications and Agents).

Core thesis: **"Frontier Transformation starts with intelligence and trust."** Intelligence ensures AI is contextual, relevant, and grounded. Trust ensures AI can scale safely, securely, and responsibly.

## Wave 3 components

### 1. Copilot Cowork

Long-running, multi-step execution layer. Detailed in [OVERVIEW.md](OVERVIEW.md).

### 2. Copilot in Word, Excel, PowerPoint, and Outlook

Copilot now works alongside you creating, editing, and refining content from start to finish inside the apps. Uses Work IQ for context.

- Refining Word documents into polished drafts
- Improving Excel spreadsheets with real formulas
- Producing PowerPoint slides matching org brand kits and layouts
- Drafting and refining emails directly in Outlook

"Agent Mode" during preview has been dropped as a label because this is now core to how Copilot works.

GA status: Excel and Word generally available. PowerPoint and Outlook rolling out.

### 3. Agents in chat

Chat in Copilot is the entry point for chat-first creation and execution:

- Create documents, spreadsheets, presentations from conversation
- Take common workplace actions (scheduling, email drafting) without switching contexts
- Built-in agents for Word, Excel, PowerPoint, Outlook
- Agents supporting open standards: Apps SDK and MCP Apps
- Partner experiences: Adobe, Monday.com, Figma, Dynamics 365, Power Apps

### 4. Multi-model intelligence

Microsoft 365 Copilot brings leading models from multiple providers:

- **Claude**: Available in mainline chat via Frontier program
- **OpenAI**: Latest generation (GPT-5.4) continuing to roll out
- Auto-model-selection (default): Copilot applies the right model per task
- All grounded in enterprise context and protected by Microsoft security

**Cowork model picker** (verified from UI, 2026-04-03): Users can explicitly choose between Auto (default), Claude Sonnet 4.6, and Claude Opus 4.6. Only Anthropic models appear in the Cowork picker. OpenAI models may participate behind the scenes in Auto mode or in Researcher's Critique/Council patterns.

### 5. Agent 365

The control plane for agents across the organization:

- One place to observe, secure, and govern every agent
- Extends management, security, and governance processes to agents
- Uses familiar Microsoft solutions: Admin Center, Defender, Entra, Purview
- **GA date**: May 1, 2026
- **Price**: $15 per user per month

## Microsoft 365 E7: The Frontier Suite

New SKU unifying productivity, AI, identity, and security:

- **Includes**: Microsoft 365 Copilot, Agent 365, Microsoft Entra Suite, M365 E5 (with Defender, Entra, Intune, Purview)
- **GA date**: May 1, 2026
- **Price**: $99 per user per month (with and without Teams variants)

## Work IQ

The intelligence layer that personalizes Microsoft 365 Copilot. Three tightly integrated layers:

### Data layer

- Microsoft 365 tenant data (SharePoint, OneDrive, Outlook, Teams)
- Dynamics 365 and Power Apps data (Dataverse integration)
- Copilot Connectors for non-Microsoft systems
- Broad Dataverse access anticipated Summer 2026

### Context layer

- **Memory**: Explicit (custom instructions, saved memories) + implicit (inferred from chat history)
- **Semantic index**: Meaning-based retrieval beyond keyword matching
- **Business understanding**: Ontologies and glossaries capturing procedural knowledge from business workflows

### Skills and tools layer

- Agentic skills: specialized instructions for specific tasks
- Custom toolsets: MCP server tools, agent flows, APIs, plugins
- **Work IQ API**: RESTful interface for developers (Public Preview coming)
- CLI support today; MCP and A2A support coming

### Security

- Respects user permissions, security groups, sensitivity labels, DLP policies
- GDPR and EU Data Boundary compliance
- Indexed data retains existing governance policies

## Researcher enhancements (multi-model)

Researcher is Copilot's deep research agent. New features announced alongside Cowork:

### Critique

Separates generation from evaluation using multi-model architecture:

- One model plans and generates initial draft
- Second model (from a different provider) reviews and refines
- Rubric-based evaluation: source reliability, completeness, evidence grounding
- **Result**: +13.8% on DRACO benchmark vs. previous best (Perplexity Deep Research with Claude Opus 4.6)

### Council

Side-by-side comparison across multiple models:

- Anthropic and OpenAI models run simultaneously
- Each produces a complete standalone report
- Judge model creates distilled summary: agreements, divergences, unique contributions

Both available in Frontier program.

## Key people

| Person          | Title                                       | Role                                        |
| --------------- | ------------------------------------------- | ------------------------------------------- |
| Jared Spataro   | CMO, AI at Work                             | Wave 3 announcements, Frontier availability |
| Charles Lamanna | President, Business Applications and Agents | Cowork product announcement                 |
| Seth Patton     | GM, Microsoft 365                           | Work IQ deep dive                           |

## Timeline

| Date           | Event                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------- |
| March 2, 2026  | SharePoint at 25 blog (knowledge work context)                                              |
| March 9, 2026  | Wave 3 announcement: Copilot Cowork, Agent 365, E7 Frontier Suite, multi-model intelligence |
| March 9, 2026  | Copilot Cowork blog by Charles Lamanna                                                      |
| March 9, 2026  | Work IQ deep dive by Seth Patton                                                            |
| March 30, 2026 | Copilot Cowork available in Frontier program                                                |
| March 30, 2026 | Researcher Critique and Council available in Frontier                                       |
| May 1, 2026    | Agent 365 GA ($15/user/month)                                                               |
| May 1, 2026    | Microsoft 365 E7 Frontier Suite available ($99/user/month)                                  |
| Summer 2026    | Broad Dataverse access via Work IQ                                                          |

## Customer early access

Capital Group had early access and reported value in planning, scheduling, creating deliverables, and preparing for executive reviews:

> "This isn't about generating content or answers. It's about taking real action: connecting steps, coordinating tasks, and following through across everyday workflows. Because Cowork operates on our enterprise data and within our security and risk boundaries, we can experiment, learn, and scale with confidence."
> Barton Warner, SVP of Enterprise Technology, Capital Group

## Frontier program

Join at: https://adoption.microsoft.com/en-us/copilot/frontier-program/

The Frontier program provides early access to Microsoft's latest AI innovations. Frontier previews are subject to existing preview terms of customer agreements.

Admin setup: If Cowork isn't visible in Admin Center Agent management, ensure the admin account is enrolled in Frontier (Copilot > Settings > Frontier).
