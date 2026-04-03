# Alex Coworker Platforms — Roadmap

**Last Updated**: April 3, 2026

Roadmap for Alex's non-VS Code platforms: M365 Copilot Agent, Cowork (GCX Coworker), and Windows Agent.
Separated from the core VS Code roadmap to allow independent prioritization and decision-making.

---

## 🗺️ Platform Strategy

| Platform                  | Heir                       |  Status   | Notes                                                                                                                                                                    |
| ------------------------- | -------------------------- | :-------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **M365 Copilot Agent**    | `platforms/m365-copilot/`  | ✅ Active  | Declarative agent via Agent Builder + Office Add-ins                                                                                                                     |
| **Cowork (GCX Coworker)** | `platforms/cowork/`        | 🧪 Testing | 20 curated skills + custom instructions deployed to OneDrive for M365 Copilot Cowork (Frontier Preview). Skill discovery confirmed, file read access under investigation |
| **Windows Agent**         | `platforms/windows-agent/` | ⏳ Planned | MCP cognitive tools as ODR-registered agent connectors for Windows Agent Workspace. Gate: Agent Workspace GA                                                             |

---

## 🚧 In Progress

### M365 MCP Integration (from ATK 6.6)

Wire Alex's MCP cognitive tools into the M365 declarative agent for Teams/Copilot access.

| #   | Feature                             | Effort | Description                                                                                                |
| --- | ----------------------------------- | :----: | ---------------------------------------------------------------------------------------------------------- |
| 7.1 | **MCP tools in Declarative Agent**  |   3d   | Expose knowledge search, architecture status, and insight save as DA actions via ATK tool definition files |
| 7.2 | **Embedded Knowledge for DA**       |   2d   | Package a curated subset of skill catalog + instructions as embedded knowledge for grounded M365 responses |
| 7.3 | **MCP auto-parameter verification** |   1d   | Verify ATK 6.6.1 auto-discovery works with Alex MCP tools, document any manual overrides needed            |

### Cowork (GCX Coworker)

| Item                  | Status      | Notes                                                                                                                                       |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Skill pack deployment | ✅ Done      | 20 skills built, zip deployed to OneDrive `Documents/Cowork/Skills/`                                                                        |
| Custom instructions   | ✅ Done      | GCX Coworker identity, CX mission, Customer-First + Security-First principles                                                               |
| Build script          | ✅ Done      | `platforms/cowork/build-skill-pack.ps1` with MD5 verification + prune step                                                                  |
| Skill discovery       | ✅ Confirmed | Cowork lists all 20 skill folders correctly                                                                                                 |
| File read access      | ❌ Blocked   | Cowork gets authentication errors reading SKILL.md content. Likely tenant-level Conditional Access/DLP policy on Microsoft corporate tenant |
| Canary test           | ⏳ Pending   | "Coral Framework methodology version 3.2" embedded in status-reporting skill. Will validate once file read access is resolved               |

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
