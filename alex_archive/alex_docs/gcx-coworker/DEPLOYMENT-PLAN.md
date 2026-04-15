# GCX Coworker Declarative Agent: Deployment Plan

**Date**: April 9, 2026
**Status**: Phase 1-2 Complete, Ready for Agent Builder Deployment
**Location**: `platforms/gcx-coworker/`

## Context

Cowork (M365 Copilot built-in personalization) cannot read Custom Instructions or SKILL.md files on the Microsoft corporate tenant. We are pivoting to a declarative agent deployed via Agent Builder as the primary M365 surface for Alex's cognitive architecture.

This plan documents the constraints, decisions, and deployment steps based on the latest Microsoft documentation (schema v1.6, Agent Builder docs, content optimization guidance, known issues, sharing/publishing lifecycle).

## Architecture Choice: Agent Builder UI vs. Code-First (ATK)

We are deploying via **Agent Builder UI** (not code-first ATK sideload) because:

1. **EmbeddedKnowledge is "not yet available" in code-first manifests**. The v1.6 schema defines it, but the feature is disabled. Agent Builder UI is the only path to upload embedded files.
2. **Agent Builder supports 20 embedded files** vs. code-first's 10-file limit (when it becomes available).
3. **No admin approval required** for Author > Share workflow. Sharing supports up to 98 named users, groups, or teams.
4. **ZIP download for sideloading** is available from Agent Builder BUT cannot include embedded files (they are stripped). This is a one-way door: embedded files only live in Agent Builder.
5. **Changes auto-save** but are not visible to users until the creator selects "Update".

**Implication**: The `declarativeAgent.json` in our repo is a reference/template, not a deployable artifact. The actual agent lives in Agent Builder. We version-control the source of truth (.md packs, instructions text, manifest template) but deploy via UI.

## Constraints from Microsoft Documentation

### DA Manifest Schema v1.6

| Property                    | Limit                            | Source      |
| --------------------------- | -------------------------------- | ----------- |
| instructions                | 8,000 chars max                  | Schema v1.6 |
| description                 | 1,000 chars max                  | Schema v1.6 |
| name                        | 100 chars max                    | Schema v1.6 |
| conversation_starters       | Max 6 (schema), 12 (schema note) | Schema v1.6 |
| actions (plugins)           | 1 to 10                          | Schema v1.6 |
| worker_agents               | Preview only                     | Schema v1.6 |
| disclaimer.text             | 500 chars max                    | Schema v1.6 |
| string properties (default) | 4,000 chars                      | Schema v1.6 |

#### New v1.6 Capabilities (Unused But Available)

| Capability                       | Detail                                                                          | Action for GCX Coworker              |
| -------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| `worker_agents` (preview)        | Multi-agent: orchestrator can delegate to other DAs by title ID                 | Future: decompose into sub-agents    |
| `ScenarioModels`                 | Task-specific models by model ID                                                | Not applicable yet                   |
| `GraphicArt`                     | Image generation from text input                                                | Consider enabling for presentations  |
| `Dataverse`                      | Tables, skills, knowledge sources from Dynamics 365                             | Not applicable (no CRM)              |
| `Email.group_mailboxes`          | Array of SMTP addresses for M365 Groups or shared mailboxes (max 25)            | Could add GCX team shared mailbox    |
| `Email.folders`                  | Scope to specific folders (well-known names like 'inbox' or folder IDs)         | Consider scoping to avoid noise      |
| `Meetings.items_by_id`           | Scope to specific recurring meetings (by ID, is_series boolean)                 | Could scope to GCX standup/all-hands |
| `People.include_related_content` | When true, includes shared docs, emails, Teams messages between user and person | Already enabled (true)               |
| `discourage_model_knowledge`     | When true, agent avoids using model's general knowledge                         | Consider: forces grounded responses  |
| `sensitivity_label`              | Purview label GUID for embedded file content (not yet enabled)                  | N/A until embedded files enabled     |

### Knowledge Sources: How Copilot Uses Each Source

| Source                                                    | How the Agent Uses It                                                                                                                                                                                                                                                                                                                  | Retrieval Priority                                                                                                                                                                               | Speed                                                                                                                                                          | Table Parsing                                                                                                                | Update Latency                                 | License            |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------ |
| **Embedded files** (uploaded .docx/.pdf/.txt/.pptx/.xlsx) | Copilot **indexes the full content** (first 750-1,000 pages / 1.8M chars per file). When a user query arrives, Copilot performs **semantic search** across all indexed chunks and returns the most relevant passages as grounding context. This is the highest-fidelity retrieval path.                                                | **Highest**. Embedded content is always searched when relevant to the query. It is the agent's "own brain." When "Only use specified sources" is on, embedded + SPO are the only search targets. | **Fastest**. Content is pre-indexed at upload time. No runtime network fetch.                                                                                  | **Yes**. OOXML tables in .docx are structurally parsed. Excel data in one sheet works well.                                  | Minutes after upload (shows "Preparing" in UI) | Copilot or metered |
| **SharePoint/OneDrive** (via URL or ID)                   | Copilot searches the **Microsoft Search index** for the referenced sites/folders/files. For **20 or fewer files by ID**, full content of all files is searched. For broader site/folder references, Copilot uses **semantic ranking** over the search index, which may not scan every file. Files > 36K chars may have content missed. | **High** (but below embedded). SPO is searched alongside embedded content when enabled. If `discourage_model_knowledge: true`, SPO + embedded are the only sources.                              | **Medium**. Depends on Microsoft Search indexing pipeline. Newly uploaded SPO files take "several minutes" to index. Large sites may have stale index entries. | **No**. Copilot currently **cannot parse tables** in SharePoint content. Tables render as flat text or are skipped entirely. | Minutes to hours (Search index crawl cycle)    | Copilot or metered |
| **Web search** (public URLs, max 4)                       | Copilot performs a **Bing web search scoped to the specified URLs** (max 2 path segments, no query params). Returns web content as grounding. Unscoped web search uses general Bing.                                                                                                                                                   | **Lower than embedded/SPO**. Web search is a fallback: used when embedded + SPO don't have a relevant answer, or for current-events queries.                                                     | **Slow**. Runtime HTTP fetch + Bing ranking. Subject to network latency and site availability.                                                                 | **Depends on site**. HTML tables may or may not parse cleanly. Not reliable.                                                 | Real-time (fetches live content)               | No (free)          |
| **Email** (Outlook)                                       | Copilot searches the user's **mailbox** (or shared/group mailboxes via `group_mailboxes`). Unscoped by default; can scope to specific folders. Agent can read but **cannot send** email.                                                                                                                                               | **Medium**. Email is searched when the query relates to communications, action items, or people context. Not searched for knowledge-base-style queries.                                          | **Medium**. Searches Exchange Online index.                                                                                                                    | **N/A**                                                                                                                      | Real-time (Exchange index)                     | Copilot only       |
| **Teams messages** (max 5 chat URLs)                      | Copilot searches Teams **channels, meeting chats, group chats, 1:1 chats**. Can scope to specific chat URLs or search all.                                                                                                                                                                                                             | **Medium**. Same as Email: used for communication/context queries, not knowledge-base queries.                                                                                                   | **Medium**. Searches Teams index.                                                                                                                              | **N/A**                                                                                                                      | Real-time (Teams index)                        | Copilot only       |
| **People**                                                | Returns **org chart, name, title, skills, contact info**. With `include_related_content: true`, also returns shared documents, emails, and Teams messages between the user and the referenced person.                                                                                                                                  | **Contextual**. Activated when queries mention people ("who is...", "tell me about..."). Not used for knowledge-base queries.                                                                    | **Fast**. Reads Microsoft Graph People API + related content index.                                                                                            | **N/A**                                                                                                                      | Real-time                                      | Copilot or metered |
| **Meetings**                                              | Searches **calendar events, meeting transcripts, attendee lists**. Can scope to specific meeting series by ID.                                                                                                                                                                                                                         | **Contextual**. Activated for scheduling/meeting queries. Transcript search may be incomplete for old/large transcripts.                                                                         | **Medium**. Reads Graph Calendar API + transcript index.                                                                                                       | **N/A**                                                                                                                      | Real-time                                      | Copilot only       |
| **Code interpreter**                                      | Generates and executes **Python code** in a sandbox. Used for data analysis, chart generation, math, file processing. Not a knowledge source; it's a compute capability.                                                                                                                                                               | **On-demand**. Activated when the query requires computation, analysis, or visualization.                                                                                                        | **Slow** (code generation + execution). But produces precise outputs.                                                                                          | **Yes** (Python can parse any format).                                                                                       | N/A (compute, not storage)                     | No (free)          |
| **Copilot connectors** (ADO, Jira, ServiceNow, etc.)      | Searches **external system data** via admin-configured connectors. Can scope by area path (ADO), project (Jira), knowledge base (ServiceNow), etc.                                                                                                                                                                                     | **Medium**. Searched alongside SPO when connector is configured. Scoping improves relevance significantly.                                                                                       | **Medium**. Depends on connector sync frequency and external system response time.                                                                             | **Varies by connector**                                                                                                      | Depends on connector crawl                     | Copilot or metered |

### Knowledge Delivery Strategy: Embedded vs. SharePoint vs. SWA vs. OneDrive

This is the critical architecture decision. Here is the full comparison:

| Dimension                   | Embedded Upload (.docx)                                                                                                     | SharePoint Document Library                                                                                                           | Azure SWA (public site)                                                                                                                                                                        | Personal OneDrive                                                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **How Copilot accesses it** | Pre-indexed at upload. Full content search across all 20 files. Semantic chunking + ranking.                                | Microsoft Search index. Site/folder crawl. Semantic ranking over search results.                                                      | Web search capability (Bing). Fetches HTML at runtime. Max 4 URLs, max 2 path segments each.                                                                                                   | Same as SharePoint (OneDriveAndSharePoint capability). Searches user's personal OneDrive.                                                   |
| **Retrieval quality**       | **Best**. Full content indexed. Tables parsed. Heading hierarchy preserved in OOXML. Copilot cites specific passages.       | **Good for prose, bad for tables**. Tables not parsed. Files > 36K chars may have content missed. Best for narrative docs < 20 pages. | **Poor for knowledge bases**. Bing indexes public HTML pages on its own crawl schedule. No guarantee of freshness. No table parsing reliability. 2-level URL limit kills deep site structures. | **Good** (same as SPO). But personal OneDrive adds noise from all user files. Cannot scope to specific folders via Agent Builder UI easily. |
| **Table support**           | **Yes**. OOXML tables are structurally parsed. This is the ONLY source where Copilot reliably parses tabular data.          | **No**. Must avoid tables; use prose or bullet lists instead.                                                                         | **Unreliable**. HTML tables may or may not parse via Bing.                                                                                                                                     | **Same as SPO** (no table parsing).                                                                                                         |
| **Update workflow**         | Must re-upload via Agent Builder UI. No API. No git-push deploy. Manual drag-and-drop per file.                             | Upload files to SPO library. Search index crawls automatically (minutes to hours). Git-based deploy possible via CI/CD to SPO.        | `swa deploy` from CLI. Files update instantly. Git-based CI/CD trivial.                                                                                                                        | Upload to OneDrive. Auto-indexed.                                                                                                           |
| **Max files**               | 20                                                                                                                          | 100 (Agent Builder), unlimited via SPO site URL                                                                                       | 4 URLs (not files; entire sites)                                                                                                                                                               | Same as SPO                                                                                                                                 |
| **Max content**             | 1.8M chars per file (750-1,000 pages)                                                                                       | 36K chars per file for reliable retrieval. 300 pages total recommended.                                                               | Entire public website (Bing-crawled). Unpredictable depth.                                                                                                                                     | Same as SPO                                                                                                                                 |
| **Sharing model**           | Embedded in agent. Any user with agent access sees this content. No per-file permissions. IB not supported.                 | SPO permissions respected. Users without access to SPO site don't see that content in responses.                                      | Public. Anyone can access (no auth on SWA static content).                                                                                                                                     | User's own OneDrive. Only that user sees their content.                                                                                     |
| **Cost**                    | Free (part of agent).                                                                                                       | Free (existing SPO).                                                                                                                  | SWA Free tier: $0. Custom domain: $0 with managed TLS.                                                                                                                                         | Free (existing OneDrive).                                                                                                                   |
| **Sensitivity**             | No sensitivity label enforcement yet. Embedded files bypass IB. **Caution with confidential content.**                      | Full sensitivity label and IB enforcement. Proper enterprise governance.                                                              | Public internet. **Never put confidential content here.**                                                                                                                                      | User-scoped. No cross-user sharing.                                                                                                         |
| **Best for**                | **Core knowledge packs** (Alex brain, skills, prompts, instructions). High-fidelity, table-heavy, always-available content. | **Organizational docs** (process docs, policies, team wikis). Content that changes frequently and needs SPO governance.               | **Not recommended for this use case.** SWA is great for web apps, terrible for DA knowledge grounding. Bing crawl latency, 4-URL limit, no auth, no table parsing.                             | **Not recommended.** Adds noise from all personal files. Use SPO for shared team content instead.                                           |

### Verdict: Why Embedded .docx is the Right Choice for Knowledge Packs

1. **Retrieval priority**: Embedded content is always searched first and with highest fidelity. SPO goes through Microsoft Search; web goes through Bing. Neither matches embedded quality.
2. **Table parsing**: Only embedded files support structured table parsing. Our knowledge packs are table-heavy (skill matrices, capability comparisons, protocol procedures). SPO would lose all tabular data.
3. **Speed**: Pre-indexed at upload. No runtime fetch latency. SPO adds search-index hop. SWA adds Bing crawl + HTTP fetch.
4. **Reliability**: Embedded content is always available. SPO depends on search index freshness. SWA depends on Bing crawl schedule (could be hours or days stale).
5. **20-file limit fits perfectly**: We have exactly 20 knowledge packs. No waste.
6. **Content security trade-off**: Embedded files bypass IB and per-file permissions. This is acceptable because our knowledge packs contain Alex's public skills/instructions, not confidential GCX data. Confidential org docs stay in SPO where permissions are enforced.

**SWA as knowledge source is not viable** because:
- Only 4 URLs allowed, with max 2 path segments each
- Bing crawl schedule is unpredictable (hours to days for fresh content)
- No structured content parsing guarantee
- Public exposure of all hosted content
- The web search capability is designed for "look up current events" not "ground in a knowledge base"

**Final architecture**:
- **Embedded .docx** (20 files): Alex's cognitive architecture (skills, prompts, protocols, domain knowledge)
- **SharePoint** (GCX site URL): Organizational documents, team processes, living content that changes
- **Web search** (unscoped): Fallback for current-events and general research queries
- **Email/Teams/People/Meetings**: Live M365 context for personalized, real-time responses

### Embedded File Constraints (Agent Builder UI)

| Property                       | Value                                                               |
| ------------------------------ | ------------------------------------------------------------------- |
| Max files                      | 20                                                                  |
| Supported types                | .doc, .docx, .pdf, .ppt, .pptx, .txt, .xls, .xlsx, .html (SPO only) |
| Max file size (Office/PDF/txt) | 512 MB                                                              |
| Max file size (Excel)          | 30 MB                                                               |
| Indexing depth                 | First 750-1,000 pages (1.8M chars) per file                         |
| Sensitivity labels             | Highest priority label applied to embedded content                  |
| Information Barriers           | Not supported on embedded files                                     |
| .md files                      | NOT supported for embedded upload                                   |

### SharePoint Content Optimization

| Guideline                            | Detail                                                      |
| ------------------------------------ | ----------------------------------------------------------- |
| File size limit (for good retrieval) | Max 36,000 chars (~15-20 pages) per file                    |
| File count (full content search)     | Up to 20 files when referenced by ID                        |
| File count (Agent Builder)           | Up to 100 SharePoint files per agent                        |
| Table parsing                        | Copilot currently CANNOT parse tables in SharePoint content |
| Best practice                        | Reference specific files, not broad folders                 |
| Page count (for full content)        | Limit to 300 total pages across referenced files            |

### Instructions Best Practices (Microsoft Guidance)

| Practice          | Detail                                                                                                                                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Structure         | Use Markdown: `#`, `##`, `###` headers, `-` for lists, `1.` for ordered steps                                                                                                                                                 |
| Clarity           | Precise action verbs: "ask", "search", "send", "check", "use"                                                                                                                                                                 |
| Atomicity         | Break multi-action instructions into separated units                                                                                                                                                                          |
| Output format     | Always specify tone, verbosity, and output format                                                                                                                                                                             |
| Tool references   | Explicitly name capabilities/knowledge at each step                                                                                                                                                                           |
| Domain vocabulary | Define specialized terms, acronyms, formulas                                                                                                                                                                                  |
| Self-evaluation   | Add final check step before responses                                                                                                                                                                                         |
| Reasoning control | Deep reasoning cues vs. fast minimal cues depending on task                                                                                                                                                                   |
| Stability header  | For GPT 5.1+ stability: literal-execution header pattern                                                                                                                                                                      |
| Patterns          | 9 instruction patterns documented (deterministic workflows, parallel vs. sequential, decision rules, output contracts, clean markdown, self-evaluation gates, reasoning steering, literal-execution headers, migration audit) |

### Document Length Guidance (Microsoft Support)

LLMs process documents with the following behavior:

| Scenario                       | Limit                         | Note                                                       |
| ------------------------------ | ----------------------------- | ---------------------------------------------------------- |
| Summarize / full-context tasks | Max 1.5M words or 300 pages   | Beyond this, Copilot focuses only on beginning of document |
| Question about specific topic  | Length does not impact much   | LLM can search for specific answers in long docs           |
| Rewrite tasks                  | Best under 3,000 words        | Larger docs produce degraded rewrites                      |
| LLM attention bias             | Beginning and end of file     | Content in the middle of a long file gets less attention   |
| Embedded files (DA-specific)   | First 750-1,000 pages indexed | 1.8M chars per file                                        |

**Implication for our 20 packs**: Each knowledge pack is ~37 KB / ~18 pages. Well within all limits. No splitting needed.

### Known Issues Affecting GCX Coworker

| Issue                             | Impact                                                                       | Mitigation                                        |
| --------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- |
| SPO null chars in filename        | Files with null chars return no results                                      | Validate filenames in pack-knowledge.cjs          |
| SPO grounding fails silently      | No Copilot license = "Sorry, I wasn't able to respond" with no explanation   | Verify all GCX users have Copilot license         |
| Power Automate actions unreliable | Flows may not return results, newly created flows may not appear             | Avoid Power Automate actions for now              |
| URLs stripped in @mention         | Bare URLs in responses may be removed in shared contexts (Word, Teams, etc.) | Return Markdown links `[text](url)` not bare URLs |
| Sharing with distribution groups  | Share fails if target is a distribution group (not security group)           | Use security groups or individual names           |
| ZIP download strips embedded      | Downloaded .zip for sideloading cannot include embedded files                | Embedded files only via Agent Builder UI          |
| Unrecognized JSON properties      | Any extra properties in manifest make entire document invalid                | Validate JSON against schema before paste         |

## Key Decisions

### Decision 1: Three-Tier Knowledge Architecture

**Decided**: Three tiers, each optimized for its role.

| Tier                            | Source                                 | What Goes Here                                                                                                                                                                      | Why                                                                                                |
| ------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Tier 1: Embedded .docx**      | Agent Builder upload (20 files max)    | Alex's brain: skills, methodologies, frameworks, protocols. Actionable domain knowledge the agent needs for every answer.                                                           | Highest retrieval priority. Pre-indexed. Table parsing. Always available. Fastest.                 |
| **Tier 2: SharePoint**          | GCX SharePoint site via `items_by_url` | Static departmental data: org charts, process docs, team wikis, policy documents, project templates. Content that lives in the department and changes through normal SPO workflows. | Proper governance (permissions, sensitivity labels, IB). Auto-indexed. No manual re-upload needed. |
| **Tier 3: Native capabilities** | Email, Teams, People, Meetings         | Live M365 context: recent emails, chat threads, calendar, org relationships. Copilot searches these natively per-user.                                                              | Real-time. Per-user scoped. No curation needed. Copilot does this out of the box.                  |

**What stays OUT of embedded files**:
- Alex-specific cognitive architecture internals (meditation, dream state, synapses, version compatibility detection, memory file management). These are VS Code extension features, not workplace agent behaviors.
- Raw API references (Graph endpoints, Azure CLI commands). Users have docs.microsoft.com for that.
- Code-heavy developer skills (refactoring patterns, testing strategies, debugging). Copilot Chat in VS Code handles this natively. Only keep code review principles.

**What stays OUT of SharePoint**:
- Table-heavy reference data (decision matrices, comparison charts, procedure tables). SPO cannot parse tables; these must go in embedded .docx.

## Content Curation Strategy

### Principle: Speed Over Completeness

Embedded files are the agent's working memory. Every token that isn't useful for answering workplace questions is retrieval noise that competes with the right answer. Optimize for:

1. **Retrieval speed**: Fewer, larger, semantically coherent files. Copilot searches all embedded files on every query; semantic chunking works better within a single themed document than across scattered small files.
2. **LLM consumption**: Flat structure (H1 file title, H2 major sections, H3 subsections max). No metadata tables, no skill frontmatter, no generation timestamps, no decorative formatting.
3. **Answer density**: Every paragraph should be something the agent might cite in a response. If a section is "nice to know" but never answers a user question, cut it.

### File Organization: Semantic Domains

Reorganize from 20 skill-boundary files into fewer, larger, semantically coherent documents. Each file covers a complete domain so the agent can find everything it needs in one retrieval chunk.

| #   | File                                     | Source Skills                                                                                                                               | Actual Size | Domain Coverage                                                                                                                                                                              |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | **coworker-identity.docx**               | Custom (persona modes, ethical principles, quality standards)                                                                               | 21.4 KB     | Who the agent is. Tone, boundaries, GCX context, persona modes (Researcher/Builder/Validator/Documentarian behaviors), ethical principles. One file for all "how should I behave" questions. |
| 02  | **writing-and-communication.docx**       | ai-writing-avoidance (9.9 KB), executive-storytelling (13.9 KB), status-reporting (7.1 KB)                                                  | 25.5 KB     | AI writing avoidance (Big Five categories, Red Flag scoring), SCQA framework, Pyramid Principle, Numbers That Stick, stakeholder management, status report methodology.                      |
| 03  | **data-analysis-and-visualization.docx** | data-analysis (11 KB), data-visualization (19.6 KB), data-storytelling (8.8 KB), dashboard-design (12.2 KB), chart-interpretation (11.3 KB) | 57.1 KB     | EDA pipeline, chart selection, Tableau 10 palette, annotation, decluttering, KPI card design, filter architecture, self-contained HTML pattern, three-act data narrative, dashboard layout.  |
| 04  | **business-operations.docx**             | business-analysis (7.6 KB), meeting-efficiency (9.7 KB), coaching-techniques (9.4 KB), scope-management (7.9 KB)                            | 36.5 KB     | Requirements elicitation, BRDs, GROW model, SBI feedback, meeting cost formula, 5 scope negotiation patterns, MoSCoW, scope health check, facilitation techniques.                           |
| 05  | **presentations-and-slides.docx**        | slide-design (10 KB), presentation-tool-selection (7.9 KB)                                                                                  | 11.4 KB     | Slide design, visual hierarchy, tool selection (Marp/Gamma/PptxGenJS), Gamma workflow. Standalone because presentation requests are frequent and specific.                                   |
| 06  | **research-methodology.docx**            | research-first-development (16.3 KB), bootstrap-learning (4.5 KB), prompt-engineering (9.3 KB)                                              | 24.0 KB     | Phase 0 research sprint, 4-Dimension Gap Analysis, bootstrap learning 5 phases, Feynman check, prompt craft for effective LLM queries.                                                       |
| 07  | **code-quality.docx**                    | code-review (8.1 KB), trimmed: security content removed (Copilot knows OWASP/STRIDE natively)                                               | 8.1 KB      | Code review methodology (3-pass review, comment prefixes, 4 checklists), NASA/JPL Power of 10, CX-focused: non-developers in reviews, when to request security review.                       |
| 08  | **m365-workflows.docx**                  | Custom (replaced Graph API reference with practical CX workflows)                                                                           | 22.1 KB     | SharePoint organization for CX teams, Teams collaboration patterns, Power Automate for CX, email workflows, calendar integration, M365 Copilot usage tips.                                   |

**Total**: 8 files, 206 KB actual (down from 20 files, 746 KB). 1,473 table rows preserved (96% of source). 12 unused file slots reserved for future domain additions.

### What Was Cut

| Original Content                                                                              | Action          | Reason                                                                                               |
| --------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| Pack 02: Cognitive protocols (meditation, dream state, synapse monitoring, version detection) | Dropped         | VS Code extension internals. Not relevant to workplace agent.                                        |
| Pack 15: Azure cloud (WAF pillars, IaC, deployment patterns)                                  | Dropped         | Too specialized. GCX users ask Azure questions to Copilot Chat in VS Code, not to a workplace agent. |
| Pack 19: Agent modes (slash commands, memory file ops)                                        | Kept behaviors  | `/meditate`, `/dream` are VS Code commands. Researcher/Builder/Validator tone guidance kept in 01.   |
| Pack 20: Ethical framework (full moral psychology)                                            | Kept principles | Compressed to core ethical reasoning principles in 01. Academic framework details dropped.           |
| File 07: OWASP Top 10, STRIDE, SFI, credential mgmt, dependency audits                        | Dropped         | M365 Copilot already knows generic security. Kept code review methodology + CX-focused guidance.     |
| File 08: Graph API endpoints, TypeScript code, OAuth patterns, OData, Teams SDK               | Replaced        | M365 Copilot already knows Graph/Teams. Replaced with practical CX workflow patterns.                |
| All packs: Skill metadata tables, blockquote banners, horizontal rules, timestamps            | Dropped         | LLM noise. Zero retrieval value.                                                                     |

### LLM Optimization Rules for Embedded Files

Apply these rules when generating the final .docx files:

1. **No frontmatter or metadata blocks**. Start with `# Title` immediately.
2. **No horizontal rules** (`---`). Use headings for section breaks.
3. **No blockquote banners** (`> Generated...`). Zero preamble.
4. **No skill metadata tables** (ID, version, category, prerequisites). Internal indexing only.
5. **Heading hierarchy**: H1 (file title, once), H2 (major sections), H3 (subsections). Never deeper than H3.
6. **Tables are first-class**. Embedded .docx is the only source that parses tables. Use tables for decision matrices, comparison charts, procedure checklists.
7. **Front-load critical content**. LLMs attend more to the beginning and end of documents. Put the most-queried frameworks and procedures at the top of each file.
8. **Bullet lists over prose**. Faster to scan, less token waste, better chunking boundaries.
9. **No redundancy across files**. Each concept appears in exactly one file. Cross-references use plain text ("See coworker-identity.docx for tone guidance"), not links.
10. **Section titles should be natural-language queries**. Instead of "Overview" use "How to choose the right chart type". This improves semantic matching when users ask questions.
11. **No Mermaid diagrams**. Mermaid code blocks render as raw text in .docx. Replace with prose descriptions, bullet-list flows, or tables. If a diagram is essential, convert to an inline image before Word conversion.

### SharePoint Content Strategy (Tier 2)

SharePoint via `items_by_url` scoped to GCX team site. This tier holds content that:
- Changes through normal department workflows (no re-upload needed)
- Requires SPO permission governance (not everyone should see everything)
- Is prose-heavy, not table-heavy (SPO cannot parse tables)
- Lives as the department's source of truth already

| Content Type                  | Location                           | Notes                                                                |
| ----------------------------- | ---------------------------------- | -------------------------------------------------------------------- |
| GCX process documentation     | GCX SharePoint > Documents         | Team processes, escalation procedures, onboarding guides             |
| Org charts and team structure | GCX SharePoint > Wiki or Documents | Who does what, reporting lines, RACI matrices (as prose, not tables) |
| Project templates             | GCX SharePoint > Templates         | Standard deliverable templates, status report formats                |
| Policy documents              | GCX SharePoint > Policies          | Department policies, compliance requirements                         |
| Meeting notes and decisions   | GCX SharePoint > Meeting Notes     | Historical decisions, action items                                   |

**SharePoint optimization rules**:
- Keep files under 36,000 chars (~15-20 pages) for reliable full-content retrieval
- Reference specific document library paths, not the entire site root, to improve relevance
- Convert any table-heavy SPO docs to embedded .docx format instead
- Use descriptive filenames (Copilot uses filename in semantic ranking)

### Native Capabilities Strategy (Tier 3)

These require no content curation. Configure the capabilities in the manifest and let Copilot do its job:

| Capability           | Config                          | Purpose                                                                                     |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Email**            | Unscoped (user's mailbox)       | "What action items did I get from Sarah?" "Summarize emails about Project X"                |
| **Teams messages**   | Unscoped (all chats/channels)   | "What did the team discuss about the release?" "Find the decision from yesterday's standup" |
| **People**           | `include_related_content: true` | "Who is the PM for Project X?" "What have I been working on with John?"                     |
| **Meetings**         | Unscoped (user's calendar)      | "What's on my calendar tomorrow?" "Summarize the transcript from the design review"         |
| **Code interpreter** | Enabled                         | "Analyze this CSV" "Create a chart from this data"                                          |
| **Web search**       | Unscoped                        | Fallback for current events, external references, public documentation                      |

### Update Cadence

| Tier                          | Update Trigger                          | Process                                                                                       | Frequency                         |
| ----------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------- |
| **Embedded .docx**            | Brain skill changes in Master Alex repo | Regenerate packs via `pack-knowledge.cjs` > convert to .docx > re-upload via Agent Builder UI | Monthly or on major skill changes |
| **SharePoint**                | Department updates docs normally        | No agent-side action needed. Microsoft Search re-indexes automatically.                       | Continuous (auto)                 |
| **Native (Email/Teams/etc.)** | N/A                                     | Copilot indexes in real-time from Exchange/Teams/Graph                                        | Real-time (auto)                  |

### Content Budget

| Resource                         | Limit                       | Our Usage                   | Headroom                    |
| -------------------------------- | --------------------------- | --------------------------- | --------------------------- |
| Embedded files                   | 20                          | 8                           | 12 slots for future domains |
| Embedded file size               | 1.8M chars / 750 pages each | 57.1 KB / ~25 pages largest | Massive headroom            |
| Instructions                     | 8,000 chars                 | 6,309 chars (79%)           | 1,691 chars                 |
| SharePoint files (by ID)         | 20 (full content search)    | TBD                         | TBD                         |
| SharePoint files (Agent Builder) | 100                         | TBD                         | TBD                         |
| Conversation starters            | 6                           | 6                           | 0                           |

### Decision 2: .md File Optimization for LLM Consumption

**Completed**. All 8 curated .md files have LLM optimization rules applied: no frontmatter, no horizontal rules, no blockquote banners, no metadata tables, tables first-class, query-shaped section titles, no em dashes, no AI-tell words (verified by automated scan).

**Action**: Strip LLM-hostile patterns from knowledge packs before conversion:
- Remove `---` horizontal rules (confuse YAML parsers, waste tokens)
- Remove decorative separators and blank-line padding
- Remove "Generated YYYY-MM-DD" timestamps (irrelevant to LLM)
- Remove `> blockquote` metadata banners
- Flatten deep heading hierarchies where content is short
- Keep: tables (critical structured data), headers (section routing), bullet lists (structured info)

### Decision 3: Instructions Optimization

**Completed**. Instructions rewritten to 6,309/8,000 chars (79%). Contains:
- Identity and 4 persona modes (Researcher/Builder/Validator/Documentarian)
- Knowledge routing table mapping 8 domains to files
- Capability routing (8 capabilities with triggers)
- Writing rules (no em dashes, no AI-tell words, human-sounding output)
- Output format specifications
- Self-evaluation gate before every response

### Decision 4: File Format for Embedded Upload

**Problem**: .md not supported. Need to choose between .docx and .txt.

**Analysis**:
- .docx: preserves heading hierarchy, tables rendered as native Word tables (Copilot can parse these in embedded files), larger files
- .txt: flat text, no structural information, smaller but less useful for retrieval
- .pdf: preserves formatting but tables may not parse cleanly

**Recommendation**: **.docx** for embedded upload. Tables in Word documents are properly structured OOXML and Copilot can reason over them. This is confirmed by Microsoft's guidance that "Agents respond best to queries based on data in Excel when the data is in one sheet" (tables in structured formats work).

### Decision 5: SharePoint Sources Configuration

**Problem**: We want to include the GCX SharePoint site and its document repositories as knowledge.

**Configuration** in `declarativeAgent.json`:
```json
{
  "name": "OneDriveAndSharePoint",
  "items_by_url": [
    { "url": "https://microsoft.sharepoint.com/teams/GlobalCustomerExperience" }
  ]
}
```

**Note**: When `items_by_url` is specified, the capability is SCOPED to those URLs only. The user's general OneDrive is NOT searched. This is intentional: the agent should focus on GCX content, and personal OneDrive may add noise.

To add general OneDrive access back, omit `items_by_url` entirely (searches everything) or add both URLs. For now, scoped to GCX SharePoint is the right choice.

## Deployment Plan

### Phase 1: Curate and Build Knowledge Files (COMPLETED)

1. ~~Update `pack-knowledge.cjs` to produce the new 8-file semantic structure~~ Done: hand-curated from 19 source skills
2. ~~Apply LLM optimization rules~~ Done: no frontmatter, no `---`, no blockquotes, no metadata tables, no em dashes, no AI-tell words
3. ~~Drop cognitive protocols, Azure cloud, slash commands~~ Done: removed VS Code internals
4. ~~Keep persona behaviors, ethical principles, all workplace skills~~ Done
5. ~~Front-load critical content~~ Done: most-queried frameworks at top of each file
6. ~~Verify no cross-file redundancy~~ Done: each concept in exactly one file
7. ~~Generate 8 .md source files~~ Done: 206 KB total, 1,473 table rows
8. Convert to .docx via `md-to-word.cjs` (PENDING)
9. Validate: tables render correctly in Word (PENDING)

**Behavioral fidelity audit**: 8/8 user scenarios traced through both source skills and curated files. All methodologies, decision frameworks, tables, and templates verified present.

### Phase 2: Rewrite Instructions (COMPLETED)

1. ~~Audit current instructions against Microsoft's 9 patterns~~ Done
2. ~~Structure workflows as deterministic steps~~ Done: persona modes, knowledge routing, capability routing
3. ~~Add output contract for common tasks~~ Done: format specifications per domain
4. ~~Add self-evaluation gate~~ Done: quality check before every response
5. ~~Validate: char count < 8,000~~ Done: 6,309/8,000 chars (79%), 1,691 chars headroom

### Phase 3: Agent Builder Deployment

1. Go to https://m365.cloud.microsoft > New agent > Skip to configure
2. Set name: "GCX Coworker" (30 char limit)
3. Set description (1,000 char limit)
4. Paste instructions from `declarativeAgent.json`
5. Upload 8 .docx files as embedded knowledge
6. Add SharePoint URL: `https://microsoft.sharepoint.com/teams/GlobalCustomerExperience`
7. Enable capabilities: Code interpreter, Image generator
8. Add Email, Teams, People, Meetings (Copilot license required)
9. Add 6 conversation starters
10. Toggle "Only use specified sources" if we want to restrict to our knowledge

### Phase 4: Test and Validate

1. **Canary test**: "What methodology do you use for status reports?" (expect: Coral Framework v3.2)
2. **Identity test**: "Who are you?" (expect: GCX Coworker identity, not "Microsoft Copilot")
3. **Knowledge test**: "What are the principles of AI writing avoidance?" (expect: Big Five categories from file 02)
4. **SharePoint test**: "Find the latest GCX process documentation" (expect: content from GCX SharePoint)
5. **Capability test**: "Analyze this data" with CSV attachment (expect: Code interpreter activation)
6. **Writing test**: Verify no em dashes, no AI-tell phrases in responses

### Phase 5: Share and Iterate

1. **Share "Only you" first**: Test thoroughly before sharing with anyone
2. **Share "Specific users"**: Add 2-3 GCX pilot users by name/email (not distribution groups; use security groups)
3. **Verify SharePoint access**: Shared users must have Read permissions on GCX SPO site AND Copilot licenses
4. If SharePoint files were added as knowledge, re-share when updating the agent to ensure file permissions propagate
5. Gather feedback on knowledge retrieval accuracy
6. Iterate on instructions based on test results
7. Consider adding scoped web search for external CX resources
8. Consider `discourage_model_knowledge: true` if agent is hallucinating from general knowledge
9. Consider `GraphicArt` capability for presentation/visual tasks
10. Long-term: evaluate `worker_agents` for multi-agent decomposition when feature exits preview

### Phase 6: Scale and Publish (Future)

1. **Org-wide sharing**: Switch to "Anyone in your organization" when ready
2. **Admin deployment**: For formal deployment across channels, use Copilot Studio (not Agent Builder alone)
3. **Monitor**: Agent Builder auto-saves but changes aren't visible until "Update" is selected
4. **Ownership**: Only the creator can delete the agent. Ownership transfer requires PowerShell (no UI transfer)
5. **Backup**: Export ZIP periodically (note: embedded files are NOT included in ZIP)

## File Inventory

### Current State (After Phase 1-2)

| File                     | Format | Size   | Status                                       |
| ------------------------ | ------ | ------ | -------------------------------------------- |
| 8 knowledge packs        | .md    | 206 KB | Complete, LLM-optimized, fidelity-audited    |
| 8 knowledge packs        | .docx  | TBD    | Pending: convert from .md via md-to-word.cjs |
| instructions.txt         | .txt   | 6.3 KB | Complete (6,309/8,000 chars)                 |
| setup.txt                | .txt   | ~1 KB  | Complete                                     |
| profile.png (variant-06) | .png   | ~50 KB | Complete (gradient C logo)                   |
| color.png + outline.png  | .png   | ~50 KB | Complete (Agent Builder icon variants)       |

### Remaining Work

| Change                                           | Priority | Status      |
| ------------------------------------------------ | -------- | ----------- |
| ~~Reorganize 20 packs into 8 semantic domains~~  | ~~P1~~   | DONE        |
| ~~Apply LLM optimization rules to all files~~    | ~~P1~~   | DONE        |
| ~~Rewrite instructions using MSoft patterns~~    | ~~P1~~   | DONE        |
| Convert 8 .md to .docx                           | P1       | Not started |
| Deploy via Agent Builder UI                      | P1       | Not started |
| Run validation tests (Phase 4)                   | P1       | Not started |
| Share with pilot users (Phase 5)                 | P1       | Not started |
| Identify and add GCX SharePoint doc libraries    | P2       | Not started |
| Consider Copilot connectors (Azure DevOps, etc.) | P3       | Not started |

## Open Questions

1. **Copilot license**: Do all GCX team members have M365 Copilot licenses? SharePoint grounding fails silently without one ("Sorry, I wasn't able to respond" with no explanation).
2. **Copilot connectors**: Are Azure DevOps, Jira, or ServiceNow connectors enabled in the Microsoft tenant? Could scope to GCX repos by area path (ADOps) or project (Jira).
3. **Additional SharePoint sites**: Are there other GCX document libraries beyond the main team site? items_by_url scopes to specified URLs and their subpaths.
4. **Restricted SharePoint Search**: Is this enabled in the tenant? If so, SharePoint knowledge source is completely blocked.
5. **Information Barriers**: Are there IB policies? IB is NOT supported on embedded files: any user with agent access can see responses grounded in embedded content regardless of IB.
6. **GPT version**: Which GPT version is the corporate tenant running? 5.0 or 5.1+? Affects instruction pattern selection.
7. **Shared mailboxes**: Does GCX have a shared mailbox? Could add via `Email.group_mailboxes` to search team-wide email (max 25 mailboxes).
8. **Admin sharing policy**: Has the Microsoft tenant admin restricted who can share agents? Default is "All users". If restricted, need admin approval before sharing.
9. **Content sensitivity**: Do any GCX SharePoint files have sensitivity labels with DKE, user-defined permissions, or disabled extract rights? These silently fail as knowledge sources.
10. **Copilot Studio metering**: Is Copilot Studio metered usage enabled in the tenant? Required for non-Copilot-licensed users to access agents with SPO/embedded knowledge.

## Risk Register

| Risk                                                   | Likelihood | Impact   | Mitigation                                                    |
| ------------------------------------------------------ | ---------- | -------- | ------------------------------------------------------------- |
| Users lack Copilot license (SPO grounding fails)       | Medium     | High     | Verify licenses before sharing; test with pilot user first    |
| Restricted SharePoint Search blocks all SPO knowledge  | Low        | Critical | Check tenant setting before deployment                        |
| Embedded files with sensitivity labels block agent     | Low        | High     | Remove labeled files, use plain .docx without encryption      |
| Agent creator leaves org (only owner can delete)       | Low        | Medium   | Document owner, use PowerShell reassignment if needed         |
| LLM attention bias misses middle content in long files | Medium     | Medium   | Keep packs < 20 pages; put critical content at top and bottom |
| Tables in SPO content not parseable                    | Certain    | Medium   | All table-heavy content goes in embedded .docx, not SPO       |
| ZIP export strips embedded files (no offline backup)   | Certain    | Low      | Maintain .docx source files in git as our backup              |

## References

- [DA Schema v1.6](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-manifest-1.6)
- [Knowledge Sources](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/knowledge-sources)
- [Agent Builder: Add Knowledge](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-add-knowledge)
- [Optimize Content Retrieval](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/optimize-content-retrieval)
- [Write Effective Instructions](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/declarative-agent-instructions)
- [Agent Builder: Build Agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/agent-builder-build-agents)
- [Share and Manage Agents](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/copilot-studio-agent-builder-publish)
- [Known Issues](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/known-issues)
- [Document Length Guide](https://support.microsoft.com/en-us/topic/keep-it-short-and-sweet-a-guide-on-the-length-of-documents-that-you-provide-to-copilot-66de2ffd-deb2-4f0c-8984-098316104389)
