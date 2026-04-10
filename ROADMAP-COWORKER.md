# Alex Coworker Platforms — Roadmap

![The path from partnership to trust](assets/banner-roadmap.svg)

**Last Updated**: April 9, 2026

Roadmap for Alex's non-VS Code platforms: M365 Copilot Agent, Cowork (GCX Coworker), and Windows Agent.
Separated from the core VS Code roadmap to allow independent prioritization and decision-making.

---

## 🗺️ Platform Strategy

| Platform                  | Heir                       |  Status   | Notes                                                                                                                                                   |
| ------------------------- | -------------------------- | :-------: | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GCX Coworker (DA)**     | `platforms/gcx-coworker/`  | ✅ Active  | Declarative agent via Agent Builder. 20 knowledge packs (82 sources, 746 KB) embedding full Alex brain. Canonical deployment path.                      |
| **M365 Copilot Agent**    | `platforms/m365-copilot/`  | 🔄 Legacy  | Original M365 heir. Knowledge packs migrated to `gcx-coworker/`. Retained for Office Add-in and MCP integration docs.                                   |
| **Cowork (GCX Coworker)** | `platforms/cowork/`        | ❌ Blocked | 20 curated skills deployed but Cowork cannot read file content or Custom Instructions on Microsoft corporate tenant. Pivoted to Agent Builder approach. |
| **Windows Agent**         | `platforms/windows-agent/` | ⏳ Planned | MCP cognitive tools as ODR-registered agent connectors for Windows Agent Workspace. Gate: Agent Workspace GA                                            |

---

## 🚧 In Progress

### M365 MCP Integration (from ATK 6.6)

Wire Alex's MCP cognitive tools into the M365 declarative agent for Teams/Copilot access.

| #   | Feature                             | Effort | Description                                                                                                |
| --- | ----------------------------------- | :----: | ---------------------------------------------------------------------------------------------------------- |
| 1   | **MCP tools in Declarative Agent**  |   3d   | Expose knowledge search, architecture status, and insight save as DA actions via ATK tool definition files |
| 2   | **Embedded Knowledge for DA**       |   2d   | Package a curated subset of skill catalog + instructions as embedded knowledge for grounded M365 responses |
| 3   | **MCP auto-parameter verification** |   1d   | Verify ATK 6.6.1 auto-discovery works with Alex MCP tools, document any manual overrides needed            |

### Cowork (GCX Coworker)

| Item                  | Status      | Notes                                                                                                                                 |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Skill pack deployment | ✅ Done      | 20 skills built, zip deployed to OneDrive `Documents/Cowork/Skills/`                                                                  |
| Custom instructions   | ✅ Done      | GCX Coworker identity pasted into Settings > Personalization. File backup at `Cowork/custom-instructions.txt` (not auto-loaded)       |
| Build script          | ✅ Done      | `platforms/cowork/build-skill-pack.ps1` with MD5 verification + prune step                                                            |
| Skill discovery       | ✅ Confirmed | Cowork lists all 20 skill folders correctly                                                                                           |
| File read access      | ❌ Blocked   | Cowork discovers skill folders but cannot read SKILL.md content. See investigation notes below.                                       |
| Custom instructions   | ❌ Blocked   | Cowork ignores Custom Instructions text: responds as "Microsoft Copilot" instead of "GCX Coworker". Same root cause suspected.        |
| Canary test           | ❌ Failed    | Asked "What status report methodology do you recommend?" Got generic RAG/4Ps/STAR. No mention of "Coral Framework v3.2" (2026-04-09). |

### Agent Builder Knowledge Packs (Pivot from Cowork)

Because Cowork file reading is blocked on the Microsoft corporate tenant, we pivoted to Agent Builder as the M365 deployment path. Instead of uploading 20 individual Cowork skills (80 KB), we consolidated Alex's full cognitive architecture into 20 themed knowledge packs (746 KB from 82 sources).

| Item                   | Status      | Notes                                                                                                |
| ---------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| Knowledge pack script  | ✅ Done      | `platforms/gcx-coworker/appPackage/knowledge/pack-knowledge.cjs` (configurable manifest, 82 sources) |
| 20 knowledge files     | ✅ Generated | 746 KB total. Regenerable via `node pack-knowledge.cjs`                                              |
| GCX Coworker heir      | ✅ Done      | `platforms/gcx-coworker/` with full ATK project structure, DA v1.6 manifest, build.ps1               |
| GCX deploy guide       | ✅ Done      | `platforms/m365-copilot/AGENT-BUILDER-GCX-DEPLOY.md` (step-by-step)                                  |
| Instructions prompt    | ✅ Done      | GCX Coworker identity (4,781 / 8,000 chars) with canary verification in declarativeAgent.json        |
| Agent Builder creation | ⏳ Pending   | Deploy via Agent Builder UI at m365.cloud.microsoft                                                  |
| Canary test            | ⏳ Pending   | Test "Coral Framework v3.2" + identity + writing quality                                             |
| Share to GCX team      | ⏳ Pending   | Share after canary passes                                                                            |

**Knowledge Pack Coverage** (82 sources across 20 files):

| Pack | Theme                   | Sources                                                 | Size    |
| ---- | ----------------------- | ------------------------------------------------------- | ------- |
| 01   | Identity and Mission    | GCX persona, North Star, user profile                   | 14.5 KB |
| 02   | Cognitive Protocols     | Meta-awareness, anti-hallucination, dialog engineering  | 52.3 KB |
| 03   | Research and Learning   | Research-first, bootstrap learning, knowledge synthesis | 37.7 KB |
| 04   | Writing Quality         | AI writing avoidance, markdown, documentation           | 45.6 KB |
| 05   | Data Analysis           | Exploratory analysis, chart interpretation, databases   | 32.3 KB |
| 06   | Data Visualization      | Charts, dashboards, graphic design, SVG                 | 64.4 KB |
| 07   | Data Storytelling       | Narrative construction, Mermaid diagrams                | 53.6 KB |
| 08   | Executive Communication | Storytelling, status reports, slide design              | 30.7 KB |
| 09   | Meetings and Coaching   | Meeting efficiency, coaching, stakeholders              | 40.8 KB |
| 10   | Business Analysis       | Requirements, scope, change management                  | 27.9 KB |
| 11   | Prompt Engineering      | Prompts, LLM selection, multi-agent                     | 33.5 KB |
| 12   | Code Development        | Code review, debugging, root cause                      | 17.5 KB |
| 13   | Refactoring and Testing | Refactoring, testing, API design                        | 31.3 KB |
| 14   | Security and Privacy    | OWASP, PII, responsible AI                              | 36.2 KB |
| 15   | Azure Cloud             | Architecture, OpenAI, IaC, observability                | 63.0 KB |
| 16   | M365 and Graph          | Graph API, Teams, MSAL, Fabric                          | 39.7 KB |
| 17   | Presentations           | Gamma, PowerPoint, tool selection                       | 29.5 KB |
| 18   | Project Leadership      | Post-mortem, incident response, career                  | 30.6 KB |
| 19   | Agent Modes             | Researcher, Builder, Validator, Documentarian           | 42.9 KB |
| 20   | Ethical Framework       | Constitutional AI, moral psychology                     | 22.1 KB |

#### File Read Access Investigation (2026-04-09)

| Check                               | Result                                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| Sensitivity labels (MIP)            | None. No alternate data streams beyond default `$DATA`.                                             |
| File attributes                     | `A P` (Archive + Pinned). All 20 SKILL.md files pinned and synced to cloud.                         |
| OneDrive sync status                | All files synced. No cloud-only stubs.                                                              |
| Folder structure                    | Correct: `Documents/Cowork/Skills/<name>/SKILL.md`. All 20 folders have SKILL.md.                   |
| Repo vs disk match                  | Identical. `Compare-Object` shows zero differences.                                                 |
| Graph API access                    | 403 Forbidden from MCP tool (insufficient scopes). Cannot verify cloud-side properties.             |
| Personal OneDrive                   | Empty (not in use). Cannot test as alternative.                                                     |
| Corporate OneDrive path             | `OneDrive - Microsoft\Documents\Cowork\Skills\`. Corporate tenant policies may block Cowork access. |
| Custom Instructions (UI)            | Text pasted via Settings > Personalization. Cowork ignores it (responds as "Microsoft Copilot").    |
| Anthropic tenant prerequisite (new) | Learn docs now list "Anthropic enabled in tenant" as a prerequisite. May need admin verification.   |

**Hypothesis**: The Microsoft corporate tenant has Conditional Access or DLP policies that block the Cowork service principal from reading OneDrive file content, even though it can enumerate folders. Custom Instructions not loading suggests a broader tenant-level issue with Cowork personalization features, not just file access.

**Next steps**:

1. Verify "Anthropic enabled in tenant" prerequisite with tenant admin (new requirement in Learn docs as of April 2026)
2. Check Conditional Access policies for Cowork/Anthropic service principal
3. Test creating a SKILL.md directly in OneDrive web UI (bypass sync client entirely)
4. Ask tenant admin if there are DLP policies blocking M365 Copilot from reading OneDrive files
5. Monitor Microsoft Build 2026 (June 2-3) for Cowork GA announcements or policy changes

---

## 📋 Backlog

### Gated (External Dependencies)

| #   | Task                           | Gate                             | Effort | Description                           | Status                                                                                                              |
| --- | ------------------------------ | -------------------------------- | :----: | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 14  | **Worker agent orchestration** | v1.6 worker_agents exits preview |   1w   | Configure Alex as worker_agent target | ⏳ Still preview. No change in M365 schema. ATK 6.6 ships MCP-in-DA (GA) and Foundry template but not worker_agents. |

### Conditional (Trigger-Dependent)

| #   | Task                       | Trigger                                    | Effort | Description                                                                                                                                                                                                                     |
| --- | -------------------------- | ------------------------------------------ | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 15  | **Foundry POC**            | Real user/team requests Alex in Teams      |   1w   | Foundry project + Alex orchestrator + Teams publish. ATK 6.6 adds Foundry proxy template in CLI (`atk init`).                                                                                                                   |
| 16  | **Teams Deep Integration** | Active M365 users                          |  12w   | Bot Framework + Message Extensions + Meeting Integration                                                                                                                                                                        |
| 17  | **Windows Agent Heir**     | Agent Workspace exits Insider Preview (GA) |   2w   | Register Alex MCP tools as ODR agent connectors. Enables Copilot Actions to use Alex's knowledge search, architecture status, and skill routing on the Windows desktop. Bridge: `packages/mcp-cognitive-tools/` already exists. |

---

## 🔭 Future Watch

**Windows Agent Workspace + MCP Agent Connectors** ([Experimental Agentic Features](https://support.microsoft.com/en-us/windows/experimental-agentic-features-a25ede8a-e4c2-4841-85a8-44839191dfb3)): Windows introduces OS-level agent isolation: agents get their own Windows account, desktop session, and scoped file access (Documents, Downloads, Desktop, etc.) with per-agent consent. Agent connectors are **MCP servers** registered in the Windows On-Device Registry (ODR). Alex's existing MCP cognitive tools (`packages/mcp-cognitive-tools/`) could be registered as ODR connectors, giving Copilot Actions access to Alex's knowledge base, architecture status, and skill catalog. The 6 agentic security principles (least privilege, audit logs, user consent, containment) align with Alex's Safety Imperatives I1-I8. **Status**: Windows Insider preview (Copilot Labs). Not GA. Gated on Conditional #17.

---

## 🎯 Next Actions

### ATK 6.6 Integration (Priority 1)

Microsoft 365 Agents Toolkit v6.6.0 (Mar 9) + v6.6.1 hotfix (Mar 26) shipped features directly relevant to the M365 heir:

| Feature                                  | ATK Version | Impact                                                                                                                                         | Action                                                                           |
| ---------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **MCP tools in Declarative Agents (GA)** | 6.6.0       | High: Alex's MCP cognitive tools (knowledge search, architecture status, insight save) can be exposed as actions in the M365 declarative agent | Wire MCP tools into agent manifest via ATK's new separated tool definition files |
| **Embedded Knowledge for DAs**           | 6.6.0       | High: Alex's instructions, skills, and domain knowledge can be packaged as embedded knowledge for grounded, context-aware responses            | Evaluate packaging a subset of skill catalog as embedded knowledge               |
| **MCP auto-parameter retrieval**         | 6.6.1       | Medium: automatically retrieves all parameters from MCP tool definitions, reducing manual manifest work                                        | Update ATK extension, verify auto-discovery works with Alex MCP tools            |
| **Foundry Agent template (CLI)**         | 6.6.0       | Medium: `atk init` + Foundry proxy template provides alternative deployment path for Alex agent logic                                          | Evaluate alongside Conditional #15 (Foundry POC)                                 |
| **Enhanced share flow**                  | 6.6.0       | Low: clearer environment differentiation and error handling when sharing agents                                                                | Adopt when distributing M365 agent to others                                     |

**Immediate actions**:

1. Update ATK extension to v6.6.1
2. Test MCP tool integration with Alex's cognitive tools in declarative agent
3. Prototype embedded knowledge with Alex's instruction files
4. Evaluate `atk init` for existing M365 heir project

### Cowork: Unblock File Read Access

1. Investigate tenant-level Conditional Access / DLP policies blocking Cowork file reads
2. Test creating SKILL.md directly in OneDrive web (bypass sync client)
3. Check sensitivity labels on OneDrive files
4. Escalate to tenant admin if needed
5. Validate canary test once access is restored
