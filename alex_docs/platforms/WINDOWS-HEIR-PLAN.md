# Windows Agent Heir Plan

> **Status**: Research Complete | **Created**: 2026-03-26 | **Updated**: 2026-03-27 | **Platform**: Windows Agent Workspace | **Roadmap**: Conditional #19
>
> **Research Sources**: Official Microsoft blogs + Windows Insider Preview documentation
>
> **Gate**: Agent Workspace exits Insider Preview (GA) + ODR developer documentation published

## Project Checklist

### Pre-Gate (Can Start Now)

- [ ] **PG-01** Obtain code signing certificate (EV or Azure Trusted Signing)
- [ ] **PG-02** Enroll in Windows Insider Preview (Dev Channel) on test machine
- [ ] **PG-03** Enable Copilot Labs and Agent Workspace: Settings > System > AI components > Agent tools > Experimental agentic features
- [ ] **PG-04** Verify `@alex/mcp-cognitive-tools` v1.0.0 builds cleanly: `cd packages/mcp-cognitive-tools && npm run build`
- [ ] **PG-05** Run existing MCP tools end-to-end via Claude Desktop or VS Code to confirm baseline behavior
- [ ] **PG-06** Monitor Windows Insider blog for ODR developer preview announcements
- [ ] **PG-07** Sign up for private developer preview when Microsoft opens registration (post-Build)

### Phase 1: ODR Registration

- [ ] **P1-01** Read ODR developer documentation (publish date TBD)
- [ ] **P1-02** Create `packages/mcp-cognitive-tools/windows-manifest.json` -- declarative privilege manifest
- [ ] **P1-03** Declare read-only access scope: `~/.alex/global-knowledge/`, workspace `.github/`
- [ ] **P1-04** Declare write access scope: `~/.alex/global-knowledge/insights/` (for `alex_knowledge_save`)
- [ ] **P1-05** Sign the `alex-mcp` binary with code signing certificate
- [ ] **P1-06** Verify immutable tool definitions -- ensure `ListToolsRequestSchema` handler returns static `TOOLS` array (already compliant)
- [ ] **P1-07** Run security tests against all 5 tool input schemas (fuzz inputs, path traversal, injection)
- [ ] **P1-08** Register package in Windows ODR with package identity `com.alex.mcp-cognitive-tools`
- [ ] **P1-09** Verify tool discovery: open Agent Workspace, confirm all 5 tools appear in Copilot Actions tool palette
- [ ] **P1-10** Verify tool-level authorization: confirm user approval prompt fires on first invocation of each tool
- [ ] **P1-11** Verify proxy-mediated communication: confirm `alex-mcp` receives calls through Windows proxy (not direct stdio)
- [ ] **P1-12** Test error scenario: kill MCP server mid-invocation, verify Copilot Actions handles gracefully

### Phase 2: Tool Enhancement for Desktop

- [ ] **P2-01** Review all 5 tool `description` fields and rewrite for desktop agent context (not developer-centric)
- [ ] **P2-02** Add `examples` property to each tool's `inputSchema` showing desktop use cases
- [ ] **P2-03** Add structured output formatting: return markdown-friendly text (not raw JSON) for vision model consumption
- [ ] **P2-04** Implement `alex_meditate` tool: checkpoint session state, summarize active work, save episodic memory
- [ ] **P2-05** Implement `alex_dream` tool: run synapse validation, prune stale connections, consolidate episodic fragments
- [ ] **P2-06** Implement `alex_self_actualize` tool: deep architecture assessment with growth recommendations
- [ ] **P2-07** Update `TOOLS` array and `CallToolRequestSchema` switch for new tools (5 -> 8)
- [ ] **P2-08** Update tool privilege declarations in `windows-manifest.json` for new tool scopes
- [ ] **P2-09** Bump `@alex/mcp-cognitive-tools` to v2.0.0 (breaking: new tool surface)
- [ ] **P2-10** Rebuild and re-sign the binary
- [ ] **P2-11** Re-register updated package in ODR
- [ ] **P2-12** Test learning loop: invoke `alex_knowledge_save` from Copilot Actions, then retrieve via `alex_knowledge_search`

### Phase 3: Integration Testing

- [ ] **P3-01** Scenario: "Search my knowledge base before writing this report" -- verify `alex_knowledge_search` returns relevant results
- [ ] **P3-02** Scenario: "Check architecture health" -- verify `alex_synapse_health` returns accurate status
- [ ] **P3-03** Scenario: "What patterns have I seen across projects?" -- verify `alex_memory_search` with `memoryType: global`
- [ ] **P3-04** Scenario: "Save what I learned from this task" -- verify `alex_knowledge_save` persists correctly
- [ ] **P3-05** Scenario: "Meditate on today's work" -- verify `alex_meditate` creates episodic checkpoint
- [ ] **P3-06** Security: confirm agent account cannot read `~/.alex/` paths outside declared scope
- [ ] **P3-07** Security: confirm agent account cannot write to workspace `.github/` (read-only scope)
- [ ] **P3-08** Security: fuzz all tool inputs through proxy -- verify no injection escapes to shell
- [ ] **P3-09** Security: verify audit trail captures all tool invocations with timestamps and parameters
- [ ] **P3-10** Performance: measure tool response time through Windows proxy (target: <2s per tool call)
- [ ] **P3-11** Performance: test with large `.github/` directory (157+ skills) -- verify no timeout
- [ ] **P3-12** Resilience: test with Network disconnected (tools should still work -- all local)
- [ ] **P3-13** Resilience: test with `~/.alex/` missing -- verify graceful error messages
- [ ] **P3-14** Resilience: test with corrupt `synapses.json` -- verify health check reports issue without crashing

### Phase 4: Documentation and Release

- [ ] **P4-01** Create `platforms/windows-agent/README.md` with setup + troubleshooting guide
- [ ] **P4-02** Update `alex_docs/platforms/MASTER-HEIR-ARCHITECTURE.md` -- add Windows Agent to heir diagram
- [ ] **P4-03** Update `copilot-instructions.md` Heirs section -- add `Windows Agent: platforms/windows-agent/`
- [ ] **P4-04** Update `ROADMAP.md` -- close Conditional #19, add to Shipped Releases
- [ ] **P4-05** Document known limitations (vision-based interaction, no slash commands, no agent modes)
- [ ] **P4-06** Create troubleshooting guide: ODR registration errors, proxy timeout, permission denied, tool not discovered
- [ ] **P4-07** Update `packages/mcp-cognitive-tools/README.md` -- add Windows ODR configuration section
- [ ] **P4-08** Publish `@alex/mcp-cognitive-tools` v2.0.0 to npm
- [ ] **P4-09** Add Windows Agent to Platform Strategy table in ROADMAP (active, not conditional)
- [ ] **P4-10** Write meditation/episodic entry documenting heir launch

### Ongoing Maintenance

- [ ] **M-01** Monitor Windows Insider blog for Agent Workspace GA announcement
- [ ] **M-02** Track MCP SDK breaking changes (`@modelcontextprotocol/sdk` updates)
- [ ] **M-03** Run `brain-qa` to validate cognitive architecture after each MCP tool change
- [ ] **M-04** Re-sign binary when code signing certificate approaches expiry
- [ ] **M-05** Review ODR security requirements quarterly as Microsoft evolves the platform

## Executive Summary

Windows 11 is introducing an **Agent Workspace** -- a contained, OS-level environment where AI agents operate with their own dedicated Windows account, isolated desktop session, and scoped file access. Agents interact with apps and data through **Copilot Actions**, which uses vision and advanced reasoning to click, type, and scroll like a human.

The bridge between Alex and this platform is the **Model Context Protocol (MCP)**. Windows uses MCP servers registered in the **On-Device Registry (ODR)** as the standard mechanism for agent connectors. Alex already ships a production MCP server (`packages/mcp-cognitive-tools/`) exposing 5 cognitive tools -- making this the lowest-friction heir deployment in the entire platform family.

This document defines the **Windows Agent heir**, creating a desktop-native AI partner alongside VS Code Extension (developer) and M365 Copilot (enterprise productivity).

## Platform Overview

### What is Agent Workspace?

Agent Workspace is an experimental feature in Windows 11 (Insider Preview via Copilot Labs) that provides a contained environment for AI agents to operate on your behalf.

| Aspect                | Details                                                                            |
| --------------------- | ---------------------------------------------------------------------------------- |
| **Product**           | Windows 11 Agent Workspace + Copilot Actions                                       |
| **Status**            | Experimental / Insider Preview (Copilot Labs)                                      |
| **Author**            | Dana Huang (CVP, Windows Security), David Weston (CVP, Enterprise and OS Security) |
| **Announced**         | October 16, 2025 (Agent Workspace), May 19, 2025 (MCP Security Architecture)       |
| **GA Timeline**       | Not announced -- gated on Insider Preview feedback                                 |
| **Target Users**      | Windows 11 end users, enterprise managed devices                                   |
| **Developer Preview** | Private preview of MCP server capabilities -- post-Microsoft Build 2025            |

### What is Copilot Actions?

Copilot Actions is an AI agent that completes tasks by interacting with apps and files on the Windows desktop. It uses **vision + advanced reasoning** to click, type, and scroll like a human. It transforms agents from passive assistants into active digital collaborators.

Key capabilities:

- Acts on local files and apps (not just browser-based)
- Operates within the Agent Workspace (its own desktop session)
- Can update documents, organize files, book tickets, send emails
- Requests user approval for sensitive actions
- User can monitor progress and take control at any time

### Architecture Building Blocks

Windows 11 introduces four new building blocks for agentic computing:

| Building Block        | Description                                                                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User Control**      | Copilot Actions disabled by default. Enabled via Settings > System > AI components > Agent tools > Experimental agentic features                                                         |
| **Agent Accounts**    | Separate standard Windows account for agents -- enables agent-level authorization and access control distinct from user accounts                                                         |
| **Agent Workspace**   | Contained environment with its own desktop. Runtime isolation + granular permissions. Built on recognized security boundaries that Microsoft will defend per security servicing criteria |
| **User Transparency** | Users can authorize, monitor, and take over agent actions in the workspace                                                                                                               |

**Coming soon**: Entra and MSA identity support.

### File Access Model

During the experimental preview, Copilot Actions has access to:

| Folder                | Access                                   |
| --------------------- | ---------------------------------------- |
| Documents             | Default (known folder)                   |
| Downloads             | Default (known folder)                   |
| Desktop               | Default (known folder)                   |
| Music                 | Default (known folder)                   |
| Pictures              | Default (known folder)                   |
| Videos                | Default (known folder)                   |
| Other user folders    | Only with explicit user authorization    |
| System-wide resources | Accessible to all accounts on the system |

Standard Windows ACLs enforce unauthorized access prevention.

## MCP Security Architecture

### Why MCP on Windows?

Windows 11 embraces MCP as the foundational layer for secure, interoperable agentic computing. MCP servers registered in the Windows On-Device Registry (ODR) serve as **agent connectors** -- the standard way for agents to discover and invoke tools.

MCP defines three roles in Windows:
- **MCP Hosts**: Applications like VS Code or AI tools that access capabilities via MCP
- **MCP Clients**: Clients that initiate requests to MCP servers
- **MCP Servers**: Lightweight services exposing capabilities (file access, semantic search, app actions) through the MCP interface

### Security Principles (3 Pillars)

| Principle             | Implementation                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **Baseline Security** | All MCP servers must meet security requirements to appear in the Windows Registry         |
| **User Control**      | Users approve all security-sensitive operations. Sensitive actions surfaced and auditable |
| **Least Privilege**   | Declarative capabilities and isolation limit blast radius of attacks                      |

### MCP Security Controls

| Control                          | Description                                                                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proxy-Mediated Communication** | All client-server interactions routed through a trusted Windows proxy for centralized policy enforcement, authentication, authorization, and audit |
| **Tool-Level Authorization**     | Users must explicitly approve each client-tool pair with per-resource granularity                                                                  |
| **Central Server Registry**      | Only MCP servers meeting baseline security criteria appear in the Windows ODR                                                                      |
| **Runtime Isolation**            | Principle of least privilege enforced through isolation and granular permissions via declarative model                                             |

### MCP Server Security Requirements

MCP servers must meet these baseline requirements to appear in the Windows 11 ODR:

1. **Mandatory code signing** -- establish provenance, enable revocation
2. **Immutable tool definitions** -- tool definitions cannot change at runtime (prevents tool poisoning)
3. **Security testing** -- exposed interfaces must be security-tested
4. **Mandatory package identity** -- each server has a unique identity
5. **Privilege declaration** -- servers must declare required privileges upfront

### Threat Model

Windows addresses these MCP-specific threat vectors:

| Threat                        | Mitigation                                                |
| ----------------------------- | --------------------------------------------------------- |
| Cross-Prompt Injection (XPIA) | Agent Workspace isolation + proxy-mediated communication  |
| Authentication Gaps           | Centralized auth enforcement via Windows proxy            |
| Credential Leakage            | Agent accounts with limited privileges (not user context) |
| Tool Poisoning                | ODR registry vetting + immutable tool definitions         |
| Lack of Containment           | Agent Workspace runtime isolation                         |
| Registry Supply Chain Risks   | Baseline security criteria + code signing                 |
| Command Injection             | Input validation requirements for registered servers      |

## Agentic Security and Privacy Principles

Six durable principles that all Windows agents must meet:

| #   | Principle                      | Description                                                                                                        | Alex Alignment                                           |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| 1   | **Distinct Agent Accounts**    | Agents operate with dedicated accounts distinct from user accounts. Share resources like with family/coworkers     | Aligns with I1 (never test in Master workspace)          |
| 2   | **Limited Agentic Privileges** | Start with limited permissions, only obtain explicitly granted access. No device changes without user intervention | Aligns with I8 (architecture never depends on extension) |
| 3   | **Operational Trust**          | Agents must be signed by trusted source. Defense-in-depth: certificate validation, antivirus, revocation           | Aligns with I5 (commit before risky operations)          |
| 4   | **Privacy-Preserving Design**  | Data collection only for defined purposes, transparency and trust enforced                                         | Aligns with distribution-security skill                  |
| 5   | **Non-Repudiation**            | All agent actions auditable and attributable                                                                       | Aligns with Alex's tamper-evident audit approach         |
| 6   | **Microsoft SFI Compliance**   | Secure Future Initiative alignment -- security as top priority                                                     | Aligns with security-review instruction                  |

## Bridge Technology: Alex MCP Cognitive Tools

### Existing MCP Server

Alex already ships a production-ready MCP server that forms the direct bridge to Windows ODR registration.

| Aspect        | Details                             |
| ------------- | ----------------------------------- |
| **Package**   | `@alex/mcp-cognitive-tools` v1.0.0  |
| **Location**  | `packages/mcp-cognitive-tools/`     |
| **SDK**       | `@modelcontextprotocol/sdk` ^1.27.1 |
| **Transport** | StdioServerTransport (JSON-RPC)     |
| **Runtime**   | Node.js >=18                        |
| **License**   | Apache-2.0                          |
| **Published** | npm registry                        |
| **Binary**    | `alex-mcp` (npx-compatible)         |

### Tools Exposed (5)

| Tool                       | Description                                                                                                      | Windows Use Case                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `alex_synapse_health`      | Validate cognitive architecture health -- synapses, memory files, connections                                    | Agent workspace health monitoring            |
| `alex_memory_search`       | Search across all memory systems (skills, instructions, prompts, episodic, global knowledge) with type filtering | Desktop-context knowledge retrieval          |
| `alex_architecture_status` | Get current inventory -- skill counts, trifectas, agents                                                         | Agent self-awareness in workspace            |
| `alex_knowledge_search`    | Search global knowledge base for patterns and insights                                                           | Cross-project intelligence for desktop tasks |
| `alex_knowledge_save`      | Persist insights with category + tags                                                                            | Learning from desktop interactions           |

### Current Configuration (VS Code / Claude Desktop)

The MCP server is already configured for multiple hosts:

```json
{
  "mcpServers": {
    "alex-cognitive-tools": {
      "command": "npx",
      "args": ["-y", "@alex/mcp-cognitive-tools"]
    }
  }
}
```

## Architecture Mapping

### How Windows Agent Maps to Alex

```
+------------------------------------------+
|        WINDOWS AGENT WORKSPACE           |
|  +------------------------------------+  |
|  | Copilot Actions (Vision + Reason)  |  |
|  +-----------|------------------------+  |
|              | MCP (JSON-RPC)             |
|  +-----------|------------------------+  |
|  | Windows Proxy (Auth + Audit)       |  |
|  +-----------|------------------------+  |
|              | Tool Invocation            |
|  +-----------|------------------------+  |
|  | On-Device Registry (ODR)           |  |
|  |  +------------------------------+  |  |
|  |  | @alex/mcp-cognitive-tools    |  |  |
|  |  | - alex_synapse_health        |  |  |
|  |  | - alex_memory_search         |  |  |
|  |  | - alex_architecture_status   |  |  |
|  |  | - alex_knowledge_search      |  |  |
|  |  | - alex_knowledge_save        |  |  |
|  |  +------------------------------+  |  |
|  +------------------------------------+  |
+------------------------------------------+
         |                        |
    Agent Account            User Account
    (isolated)               (protected)
```

### Component Mapping

| Alex Component                  | Windows Agent Equivalent                                | Status              |
| ------------------------------- | ------------------------------------------------------- | ------------------- |
| Skills (SKILL.md)               | MCP Tool definitions                                    | Ready (5 tools)     |
| Instructions (.instructions.md) | System-level agent prompts (managed by Copilot Actions) | Platform-managed    |
| Prompts (.prompt.md)            | User task prompts (natural language to Copilot Actions) | N/A -- vision-based |
| Agents (.agent.md)              | Single agent (Copilot Actions is the orchestrator)      | Platform-managed    |
| Episodic Memory                 | Agent Workspace session logs + audit trail              | Built-in            |
| Global Knowledge (`~/.alex/`)   | Accessed via `alex_knowledge_search` tool through ODR   | Ready               |
| Synapses                        | Internal to MCP server logic                            | Ready               |

### What Alex Brings to Windows

Unlike other MCP servers that expose file-system or API wrappers, Alex's MCP server exposes **cognitive capabilities**:

1. **Knowledge Search** -- Copilot Actions can search Alex's cross-project knowledge before acting, improving task quality
2. **Architecture Awareness** -- the agent knows its own cognitive inventory (skills, trifectas, agents) and can report status
3. **Learning Loop** -- insights from desktop interactions can be saved back to Alex's global knowledge, creating a feedback loop
4. **Health Monitoring** -- synapse health checks ensure the cognitive architecture is consistent before trusting its outputs

This transforms Copilot Actions from a generic desktop automator into an **Alex-enhanced** knowledge worker.

## Portable Alex Capabilities

### Portability Matrix

Each Alex capability is assessed for Windows Agent portability based on the MCP tool surface and Copilot Actions' file access model.

| Capability                   | Category       | Portability  | Transport                                                                                        | Notes                                                                  |
| ---------------------------- | -------------- | ------------ | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Global Knowledge Search      | Knowledge      | Ready Now    | `alex_knowledge_search` MCP tool                                                                 | Cross-project patterns and insights available immediately              |
| Global Knowledge Save        | Knowledge      | Ready Now    | `alex_knowledge_save` MCP tool                                                                   | Learning loop -- desktop interactions persist to global KB             |
| Memory Search                | Knowledge      | Ready Now    | `alex_memory_search` MCP tool                                                                    | Search skills, instructions, prompts, episodic, and global memory      |
| Architecture Status          | Meta-Cognitive | Ready Now    | `alex_architecture_status` MCP tool                                                              | Skill counts, trifectas, agents -- full inventory                      |
| Synapse Health               | Meta-Cognitive | Ready Now    | `alex_synapse_health` MCP tool                                                                   | Architecture integrity checks before trusting outputs                  |
| Meditation Protocol          | Meta-Cognitive | New MCP Tool | Expose as `alex_meditate` tool                                                                   | Knowledge consolidation checkpoint -- summarize and save session state |
| Self-Actualization           | Meta-Cognitive | New MCP Tool | Expose as `alex_self_actualize` tool                                                             | Deep architecture assessment and growth planning                       |
| Skill Catalog (150 skills)   | Skills         | File Access  | Copilot Actions reads `~/.alex/` or workspace `.github/skills/`                                  | Vision-based: agent reads SKILL.md files directly from disk            |
| Instruction Library (60+)    | Skills         | File Access  | Copilot Actions reads `.github/instructions/`                                                    | Domain-specific rules available as reference documents                 |
| Prompt Templates (26+)       | Workflow       | File Access  | Copilot Actions reads `.github/prompts/`                                                         | Reusable workflow templates for desktop tasks                          |
| Bootstrap Learning           | Knowledge      | New MCP Tool | Expose as `alex_bootstrap_learn` tool                                                            | Domain-agnostic knowledge acquisition for unfamiliar tasks             |
| Knowledge Synthesis          | Knowledge      | Partial      | Via `alex_knowledge_search` + `alex_knowledge_save`                                              | Cross-project pattern recognition works; trifecta routing does not     |
| Code Review                  | Development    | File Access  | Copilot Actions reads code files + `.github/instructions/code-review-guidelines.instructions.md` | Vision-based code review on desktop IDE screenshots                    |
| Research-First Development   | Workflow       | File Access  | Agent reads research workflow instructions                                                       | 4-dimension gap analysis before starting work                          |
| Root Cause Analysis          | Debugging      | File Access  | Agent reads RCA instruction                                                                      | 5 Whys, binary search, timeline reconstruction                         |
| Debugging Patterns           | Development    | File Access  | Agent reads debugging instruction                                                                | Reproduce, isolate, hypothesize, fix                                   |
| Security Review              | Security       | File Access  | Agent reads security-review instruction                                                          | OWASP Top 10, STRIDE, dependency audit                                 |
| AI Writing Avoidance         | Writing        | File Access  | Agent reads writing instruction                                                                  | Human-sounding content generation                                      |
| Brand Asset Management       | Creative       | File Access  | Agent accesses `assets/` via known folders                                                       | Logo, icon, and banner management                                      |
| Image Generation (Replicate) | Creative       | New MCP Tool | Expose as `alex_generate_image` tool                                                             | AI image generation via Replicate API                                  |
| Gamma Presentations          | Productivity   | Not Portable | Requires Gamma API + browser                                                                     | Web-based service, not desktop-native                                  |
| MD to Word Conversion        | Productivity   | Partial      | Copilot Actions can run CLI commands                                                             | Requires Pandoc installed on system                                    |
| Chat Participant (@alex)     | VS Code        | Not Portable | VS Code Extension API only                                                                       | Platform-specific -- no equivalent in Agent Workspace                  |
| Agent Modes (7 agents)       | VS Code        | Not Portable | VS Code agent framework only                                                                     | Builder, Researcher, Validator, etc. are VS Code constructs            |
| Language Model Tools         | VS Code        | Not Portable | VS Code LM API only                                                                              | Copilot Chat tool calling is extension-specific                        |
| Slash Commands               | VS Code        | Not Portable | VS Code Chat API only                                                                            | /meditate, /dream, /learn are chat-specific                            |
| Graph API Integration        | M365           | Not Portable | Teams/M365 runtime only                                                                          | Declarative Agent + Graph connector                                    |
| Adaptive Cards               | M365           | Not Portable | Teams rendering only                                                                             | M365-specific UI surface                                               |
| Episodic Memory (session)    | Memory         | Built-in     | Agent Workspace audit logs                                                                       | Windows provides its own session logging                               |
| Copilot Memory               | Memory         | Not Portable | GitHub Copilot API only                                                                          | Cross-session memory is platform-specific                              |
| Dream State Automation       | Meta-Cognitive | New MCP Tool | Expose as `alex_dream` tool                                                                      | Automated neural maintenance and consolidation                         |

### Portability Summary

| Portability Level | Count  | Description                                                     |
| ----------------- | ------ | --------------------------------------------------------------- |
| **Ready Now**     | 5      | Existing MCP tools -- register in ODR and go                    |
| **New MCP Tool**  | 5      | Requires adding new tools to `@alex/mcp-cognitive-tools`        |
| **File Access**   | 10     | Copilot Actions reads Alex files via desktop vision/file access |
| **Partial**       | 2      | Some functionality works, some does not                         |
| **Built-in**      | 1      | Windows provides equivalent capability natively                 |
| **Not Portable**  | 7      | Platform-specific to VS Code or M365 -- no transport path       |
| **Total**         | **30** | **23 of 30 capabilities (77%) are portable to Windows Agent**   |

### Priority for New MCP Tools

If building new tools for Phase 2, prioritize in this order:

| Priority | Tool                   | Rationale                                                          |
| -------- | ---------------------- | ------------------------------------------------------------------ |
| P0       | `alex_meditate`        | Core cognitive protocol -- every heir should support checkpointing |
| P1       | `alex_dream`           | Automated maintenance keeps architecture healthy between sessions  |
| P1       | `alex_self_actualize`  | Deep assessment enables growth on any platform                     |
| P2       | `alex_bootstrap_learn` | Knowledge acquisition is platform-agnostic                         |
| P3       | `alex_generate_image`  | Creative capability via Replicate API -- nice to have on desktop   |

## Platform Comparison

### Where Windows Agent Fits

| Platform              | Surface        | Runtime                | Interaction                   | Alex Role                         |
| --------------------- | -------------- | ---------------------- | ----------------------------- | --------------------------------- |
| **VS Code Extension** | Code editor    | Node.js Extension Host | Chat / commands / agent modes | Full cognitive partner (flagship) |
| **M365 Copilot**      | Teams / Office | Declarative Agent      | Graph + adaptive cards        | Enterprise productivity           |
| **Windows Agent**     | Desktop OS     | MCP Server via ODR     | Vision + reasoning            | Desktop knowledge partner         |

### Unique Value Propositions

| Advantage                      | Description                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| **OS-level integration**       | Only platform with native Windows account isolation and ACL-based file access       |
| **Zero new code required**     | Existing MCP server registers directly in ODR -- no new heir codebase needed        |
| **Vision-based interaction**   | Copilot Actions can interact with ANY desktop application (not just MCP-aware ones) |
| **Security-first**             | Six durable security principles enforced by the Windows kernel                      |
| **Cross-project intelligence** | Alex's global knowledge base brings cross-cutting insights to desktop tasks         |

### Key Differences from Other Heirs

| Aspect            | VS Code                                 | M365                             | Windows Agent                    |
| ----------------- | --------------------------------------- | -------------------------------- | -------------------------------- |
| **Architecture**  | Full extension (TypeScript)             | Declarative JSON + API plugin    | MCP server registration          |
| **Codebase Size** | Large (~800-line files, full extension) | Medium (manifest + handlers)     | Minimal (existing MCP package)   |
| **Maintenance**   | High (VS Code API changes)              | Medium (Graph API + ATK updates) | Low (MCP protocol is stable)     |
| **Deployment**    | VS Code Marketplace                     | Teams App Store                  | Windows ODR                      |
| **User Surface**  | Chat panel + commands                   | Teams chat + adaptive cards      | Desktop workspace (vision-based) |

## Migration Phases

### Phase 1: ODR Registration (Week 1)

**Goal**: Register existing MCP server in Windows On-Device Registry

**Prerequisites**:
- Windows 11 Insider Preview with Agent Workspace enabled
- ODR developer documentation published (currently private preview)
- Code signing certificate (EV or Azure Trusted Signing)

#### 1.1 Code Signing

The ODR requires **mandatory code signing** to establish provenance and enable revocation. Options:

| Option                              | Cost           | Trust Level       | Notes                                                               |
| ----------------------------------- | -------------- | ----------------- | ------------------------------------------------------------------- |
| Azure Trusted Signing               | ~$10/month     | Microsoft-trusted | Native Azure integration, recommended for Microsoft ecosystem       |
| EV Code Signing (DigiCert, Sectigo) | ~$350-500/year | Broadly trusted   | Industry standard, works with any platform                          |
| Self-signed (dev mode only)         | Free           | Device-local only | Only works when Windows is in Developer Mode during private preview |

**Recommended**: Azure Trusted Signing -- aligns with Microsoft ecosystem, Alex already uses Azure for other services, and the ODR may provide accelerated trust for Azure-signed packages.

**Signing workflow**:
```
Build: npm run build
Package: npm pack
Sign: signtool sign /fd SHA256 /td SHA256 /tr http://timestamp.digicert.com /sha1 <cert-thumbprint> dist/index.js
```

For Azure Trusted Signing, the workflow uses `az codesign` CLI instead of `signtool`.

#### 1.2 Declarative Privilege Manifest

The ODR requires servers to **declare privileges upfront**. This is the bridge between Windows security and Alex's read/write patterns.

Create `packages/mcp-cognitive-tools/windows-manifest.json`:

```json
{
  "$schema": "https://schemas.microsoft.com/windows/mcp-server/v1/manifest.json",
  "identity": {
    "name": "com.alex.mcp-cognitive-tools",
    "displayName": "Alex Cognitive Tools",
    "version": "1.0.0",
    "publisher": "Alex Cognitive Architecture",
    "description": "Cognitive architecture tools for knowledge search, architecture health, and learning"
  },
  "signing": {
    "method": "azure-trusted-signing",
    "certificateProfile": "alex-mcp-production"
  },
  "capabilities": {
    "fileSystem": {
      "read": [
        "~/.alex/global-knowledge/**",
        "${workspacePath}/.github/skills/**",
        "${workspacePath}/.github/instructions/**",
        "${workspacePath}/.github/prompts/**",
        "${workspacePath}/.github/agents/**",
        "${workspacePath}/.github/episodic/**",
        "${workspacePath}/.github/copilot-instructions.md"
      ],
      "write": [
        "~/.alex/global-knowledge/insights/**"
      ]
    },
    "network": "none",
    "childProcesses": "none",
    "shellExecution": "none"
  },
  "tools": {
    "immutable": true,
    "definitions": [
      "alex_synapse_health",
      "alex_memory_search",
      "alex_architecture_status",
      "alex_knowledge_search",
      "alex_knowledge_save"
    ]
  },
  "runtime": {
    "command": "node",
    "args": ["dist/index.js"],
    "transport": "stdio"
  }
}
```

**Key design decisions**:
- **No network access**: All tools operate on local files. This minimizes attack surface and simplifies the security review.
- **No shell execution**: Alex MCP tools use pure Node.js `fs` module -- no `execSync` or child processes. This eliminates command injection risk entirely.
- **Write scope limited to insights**: Only `alex_knowledge_save` writes, and only to `~/.alex/global-knowledge/insights/`. Architecture files, skills, and instructions are read-only.
- **Immutable tool definitions**: The `TOOLS` array in `index.ts` is a static constant. No dynamic tool generation at runtime. This satisfies ODR requirement #2.

#### 1.3 Immutable Tool Compliance Verification

The ODR requires that **tool definitions cannot change at runtime** (prevents tool poisoning). Alex's current implementation is already compliant:

```typescript
// packages/mcp-cognitive-tools/src/index.ts

// Static constant -- never modified after initialization
const TOOLS: Tool[] = [
  { name: "alex_synapse_health", ... },
  { name: "alex_memory_search", ... },
  { name: "alex_architecture_status", ... },
  { name: "alex_knowledge_search", ... },
  { name: "alex_knowledge_save", ... },
];

// Handler returns the static array directly
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,  // No mutation, no dynamic generation
}));
```

**Verification**: Run `ListToolsRequestSchema` at t=0 and t=60s -- output must be byte-identical.

#### 1.4 Security Testing

ODR requirement #3 mandates security testing of exposed interfaces. Required test matrix:

| Test Category       | Tool(s)                                       | Test Cases                                                                     |
| ------------------- | --------------------------------------------- | ------------------------------------------------------------------------------ |
| **Path Traversal**  | All tools with `workspacePath`                | `../../etc/passwd`, `..\\..\\Windows\\System32`, UNC paths `\\\\server\\share` |
| **Input Injection** | `alex_memory_search`, `alex_knowledge_search` | Query with shell metacharacters: `; rm -rf /`, `$(whoami)`, backticks          |
| **Large Input**     | `alex_knowledge_save`                         | Content >1MB, title >10K chars, 1000+ tags                                     |
| **Null/Missing**    | All tools                                     | Omit required fields, pass null, pass wrong types                              |
| **Unicode**         | `alex_knowledge_save`                         | Emoji in title, RTL text, zero-width characters                                |
| **Concurrent**      | All tools                                     | 50 parallel invocations -- no race conditions in file writes                   |

**Current risk assessment**: Low. All tools use `fs.readFileSync`/`fs.writeFileSync` with path-joined operations and no shell execution. The primary risk vector is path traversal via `workspacePath`, which should be validated against a whitelist of allowed base directories.

**Hardening needed**: Add path validation to `synapseHealth()` and `architectureStatus()` to reject paths containing `..` segments or UNC prefixes before any filesystem access:

```typescript
function validatePath(inputPath: string): string {
  const resolved = path.resolve(inputPath);
  // Reject UNC paths and paths outside user home
  if (resolved.startsWith('\\\\') || !resolved.startsWith(os.homedir())) {
    throw new Error('Path outside allowed scope');
  }
  return resolved;
}
```

#### 1.5 ODR Registration

The exact registration process depends on the developer preview documentation (not yet published). Expected workflow based on Microsoft's blog posts:

1. **Enable Developer Mode** on Windows 11 Insider Preview
2. **Package the server** with manifest, signed binary, and tool definitions
3. **Register via ODR CLI** (expected): `mcp-register --manifest windows-manifest.json`
4. **Verify discovery**: open Copilot Actions, search for "Alex Cognitive" in available tools
5. **Approve tool-level authorization**: first invocation of each tool triggers a User Approval dialog

**Validation**:
- [ ] MCP server appears in Windows ODR
- [ ] All 5 tools discoverable by Copilot Actions
- [ ] Tool-level authorization prompts work correctly
- [ ] Proxy-mediated communication functioning

### Phase 2: Tool Enhancement for Desktop Context (Week 2)

**Goal**: Optimize tool descriptions and add new cognitive tools for desktop agent use cases

#### 2.1 Tool Description Rewrite

Current tool descriptions are developer-centric (optimized for VS Code / Claude Desktop). Desktop agent context requires descriptions that help Copilot Actions' vision + reasoning model understand **when** to invoke each tool.

| Tool                       | Current Description                                                                                      | Desktop-Optimized Description                                                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alex_synapse_health`      | "Check the health of Alex's cognitive architecture -- validates synapses, memory files, and connections" | "Run a health check on my knowledge system before starting important work. Returns architecture integrity status and any issues that need attention."                         |
| `alex_memory_search`       | "Search across all Alex memory systems (skills, instructions, prompts, episodic, global knowledge)"      | "Search my accumulated knowledge across all domains -- finds relevant skills, past decisions, documented patterns, and saved insights. Use before starting unfamiliar tasks." |
| `alex_architecture_status` | "Get current inventory of Alex's cognitive architecture -- skill counts, trifectas, agents, etc."        | "Show what I know -- returns a complete inventory of my skills, expertise areas, and capabilities so you can assess what help is available."                                  |
| `alex_knowledge_search`    | "Search Alex's global knowledge base for patterns and insights"                                          | "Search my cross-project library for reusable patterns, lessons learned, and best practices that might apply to the current task."                                            |
| `alex_knowledge_save`      | "Save a new insight to Alex's global knowledge base"                                                     | "Save a new insight or lesson learned from this task so I can apply it to future work across all projects."                                                                   |

The key shift: descriptions become **task-oriented** ("before starting important work", "use before unfamiliar tasks") rather than **component-oriented** ("validates synapses", "skill counts").

#### 2.2 Structured Output for Vision Model

Copilot Actions uses vision + reasoning. Tool responses that return raw JSON are harder for the vision model to interpret than formatted text. Add a `formatForDesktop` option:

```typescript
function formatHealthForDesktop(health: object): string {
  return `
## Architecture Health: ${health.status}

| Component    | Count                  |
| ------------ | ---------------------- |
| Skills       | ${health.skills}       |
| Instructions | ${health.instructions} |
| Prompts      | ${health.prompts}      |
| Agents       | ${health.agents}       |

**Synapses**: ${health.synapses} total, ${health.brokenSynapses} broken

${health.status === 'EXCELLENT' ? 'All systems healthy -- safe to proceed.' :
  `**Action needed**: ${health.brokenSynapses} broken connections found.`}
`;
}
```

This returns markdown that renders cleanly when Copilot Actions displays results in the Agent Workspace.

#### 2.3 New Tool: `alex_meditate`

**Purpose**: Knowledge consolidation checkpoint -- the most fundamental cognitive protocol. Every heir should support meditation.

```typescript
{
  name: "alex_meditate",
  description: "Take a moment to consolidate what was learned in this session. " +
    "Summarizes active work, saves key decisions to memory, and creates a checkpoint " +
    "that can be resumed later. Use at natural stopping points or before context switches.",
  inputSchema: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "Brief summary of what was accomplished in this session"
      },
      keyDecisions: {
        type: "array",
        items: { type: "string" },
        description: "Important decisions made during this session"
      },
      openQuestions: {
        type: "array",
        items: { type: "string" },
        description: "Unresolved questions to carry forward"
      }
    },
    required: ["summary"]
  }
}
```

**Implementation**: Writes a timestamped markdown file to `~/.alex/episodic/meditation-{date}-{slug}.md` using the same format as VS Code meditation entries. This keeps the episodic memory format consistent across all heirs.

#### 2.4 New Tool: `alex_dream`

**Purpose**: Automated neural maintenance -- run synapse validation, detect stale connections, suggest consolidation targets.

```typescript
{
  name: "alex_dream",
  description: "Run automated maintenance on the knowledge architecture. " +
    "Validates all synapse connections, identifies stale or orphaned knowledge, " +
    "and suggests areas for consolidation. Run periodically to keep the system healthy.",
  inputSchema: {
    type: "object",
    properties: {
      workspacePath: {
        type: "string",
        description: "Path to workspace (optional, uses cwd)"
      },
      autoFix: {
        type: "boolean",
        description: "Automatically fix broken synapse connections (default: false)"
      }
    }
  }
}
```

**Implementation**: Combines synapse health validation with deeper analysis -- checks for skills without synapses, episodic files older than 30 days without consolidation, and knowledge files without tags. Returns a maintenance report.

#### 2.5 New Tool: `alex_self_actualize`

**Purpose**: Deep architecture assessment -- evaluates cognitive completeness and recommends growth areas.

```typescript
{
  name: "alex_self_actualize",
  description: "Perform a deep assessment of cognitive architecture completeness. " +
    "Evaluates which skill domains are strong, which have gaps, and recommends " +
    "areas for growth. Use when planning what to learn or improve next.",
  inputSchema: {
    type: "object",
    properties: {
      workspacePath: {
        type: "string",
        description: "Path to workspace (optional, uses cwd)"
      },
      focusArea: {
        type: "string",
        description: "Optional domain to focus assessment on (e.g., 'security', 'data')"
      }
    }
  }
}
```

**Implementation**: Reads the skills catalog, counts trifecta completeness, identifies skills without synapses (isolated knowledge), and returns a growth roadmap.

#### 2.6 Version Bump and Re-Registration

After adding 3 new tools, the package requires:

1. Bump version: `1.0.0` -> `2.0.0` (new tool surface is a breaking change for automation consumers)
2. Update `windows-manifest.json` tool definitions array (5 -> 8 tools)
3. Add write scope for episodic directory: `~/.alex/episodic/**` (for `alex_meditate`)
4. Rebuild: `npm run build`
5. Re-sign binary with code signing certificate
6. Re-register in ODR: `mcp-register --manifest windows-manifest.json --update`

**Validation**:
- [ ] Copilot Actions correctly invokes Alex tools for relevant tasks
- [ ] Tool responses are useful in desktop automation context
- [ ] Knowledge save/search round-trip works through ODR
- [ ] New tools (meditate, dream, self-actualize) function correctly
- [ ] User authorization prompt fires for new tools on first use

### Phase 3: Integration Testing (Week 3)

**Goal**: End-to-end validation in Agent Workspace environment

#### 3.1 Functional Test Scenarios

Each scenario tests a realistic desktop workflow:

| #   | Scenario                                                 | Tools Invoked                                               | Expected Outcome                                                                |
| --- | -------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | "Search my knowledge base before starting this document" | `alex_knowledge_search`                                     | Returns relevant patterns; Copilot Actions uses them to guide document creation |
| 2   | "Check architecture health before making changes"        | `alex_synapse_health`                                       | Returns EXCELLENT/GOOD status with component counts                             |
| 3   | "Save what I learned from this task"                     | `alex_knowledge_save`                                       | Insight persisted to `~/.alex/global-knowledge/insights/{category}/`            |
| 4   | "What patterns have I seen across my projects?"          | `alex_memory_search` (type: global)                         | Returns cross-project patterns sorted by relevance                              |
| 5   | "What skills do I have for data analysis?"               | `alex_memory_search` (type: skills, query: "data analysis") | Returns data-analysis, data-visualization, dashboard-design skills              |
| 6   | "Meditate on today's work"                               | `alex_meditate`                                             | Creates episodic checkpoint file with session summary                           |
| 7   | "Run maintenance on my knowledge system"                 | `alex_dream`                                                | Returns maintenance report with synapse health and suggestions                  |
| 8   | "What should I learn next?"                              | `alex_self_actualize`                                       | Returns growth recommendations based on skill gaps                              |

#### 3.2 Security Boundary Validation

| Test                                                    | Expected Result | Pass Criteria                                                 |
| ------------------------------------------------------- | --------------- | ------------------------------------------------------------- |
| Agent reads `~/.alex/global-knowledge/`                 | Allowed         | File content returned                                         |
| Agent reads `~/.alex/secrets/` (if exists)              | Denied          | Access denied by Windows ACL                                  |
| Agent writes to workspace `.github/skills/`             | Denied          | Write blocked (read-only scope)                               |
| Agent writes to `~/.alex/global-knowledge/insights/`    | Allowed         | File created successfully                                     |
| Agent attempts `workspacePath: "C:\\Windows\\System32"` | Rejected        | Path validation blocks before filesystem access               |
| Agent tool invocation logged in audit trail             | Logged          | Windows Event Log or Agent Workspace history shows invocation |
| Agent runs with standard account (not admin)            | Confirmed       | `whoami` from agent context shows agent account, not user     |

#### 3.3 Performance Benchmarks

| Metric                             | Target             | Measurement Method                                        |
| ---------------------------------- | ------------------ | --------------------------------------------------------- |
| Tool response time (simple)        | <500ms             | `alex_architecture_status` with small workspace           |
| Tool response time (search)        | <2s                | `alex_memory_search` across 157+ skills                   |
| Tool response time (through proxy) | <3s                | Same operations measured including Windows proxy overhead |
| Concurrent tool calls              | No race conditions | 10 parallel `alex_knowledge_search` calls                 |
| Memory footprint                   | <50MB              | Node.js process during active tool invocation             |
| Cold start time                    | <3s                | Time from ODR launch to first tool response               |

#### 3.4 Resilience Testing

| Failure Mode                                      | Expected Behavior                                      |
| ------------------------------------------------- | ------------------------------------------------------ |
| `~/.alex/` directory missing                      | "Global knowledge base not found" message (no crash)   |
| Workspace has no `.github/`                       | "Architecture not installed" status (no crash)         |
| Corrupt `synapses.json`                           | Health check reports issue, other tools unaffected     |
| MCP server process killed mid-invocation          | Copilot Actions shows error, offers retry              |
| Disk full during `alex_knowledge_save`            | Write fails gracefully with clear error message        |
| Very large workspace (1000+ skills, hypothetical) | Tools complete within timeout, use streaming if needed |

**Validation**:
- [ ] All 8 test scenarios pass
- [ ] Security boundaries verified (all 7 tests)
- [ ] Performance acceptable (all metrics within targets)
- [ ] Error handling graceful (all 6 failure modes handled)

### Phase 4: Documentation and Release (Week 4)

**Goal**: Publish Windows Agent heir with documentation

#### 4.1 Platform Directory Structure

```
platforms/windows-agent/
  README.md                    # Setup guide, architecture, troubleshooting
  KNOWN-LIMITATIONS.md         # What doesn't port, workarounds
```

The Windows Agent heir has **no new codebase** -- it refers to `packages/mcp-cognitive-tools/` for all code. The `platforms/windows-agent/` directory contains only documentation and configuration.

#### 4.2 Documentation Updates

| Document                                          | Change                                                                       |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| `platforms/windows-agent/README.md`               | New: Setup guide, ODR registration steps, tool reference, troubleshooting    |
| `alex_docs/platforms/MASTER-HEIR-ARCHITECTURE.md` | Add Windows Agent box to heir diagram, update platform count                 |
| `.github/copilot-instructions.md`                 | Add `Windows Agent: platforms/windows-agent/` to Heirs section               |
| `ROADMAP-UNIFIED.md`                              | Close Conditional #19, move Windows Agent to Shipped Releases                |
| `packages/mcp-cognitive-tools/README.md`          | Add "Windows ODR" configuration section alongside VS Code and Claude Desktop |
| Platform Strategy table                           | Change Windows Agent from "Planned" to "Active"                              |

#### 4.3 Troubleshooting Guide

Common issues and resolutions for the Windows Agent heir:

| Issue                                  | Cause                                                | Resolution                                                                                      |
| -------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Tools not appearing in Copilot Actions | ODR registration failed or pending                   | Re-run `mcp-register`, check Windows Event Log for registration errors                          |
| "Access denied" on tool invocation     | Agent account lacks read permission to `~/.alex/`    | Grant agent account read access: `icacls %USERPROFILE%\.alex /grant "AgentAccount:(OI)(CI)(R)"` |
| Tool invocation times out              | Windows proxy timeout too short for large workspaces | Optimize search to use index, or request longer timeout in manifest                             |
| "Global knowledge base not found"      | `~/.alex/global-knowledge/` not created              | Run `alex_knowledge_save` once to auto-create the directory structure                           |
| Binary signature invalid               | Certificate expired or revoked                       | Re-sign with current certificate, re-register in ODR                                            |
| Tool definition mismatch               | Stale registration after upgrade                     | Re-register: `mcp-register --manifest windows-manifest.json --update`                           |
| Agent can't find workspace `.github/`  | `workspacePath` not set or incorrect                 | Pass explicit `workspacePath` parameter, or ensure cwd is set to workspace root                 |

#### 4.4 npm Publish Checklist

Before publishing `@alex/mcp-cognitive-tools` v2.0.0:

1. All 8 tools tested end-to-end in Agent Workspace
2. Security test matrix passed (Phase 1.4)
3. `npm run build` succeeds with zero errors
4. `npm pack --dry-run` shows only `dist/`, `README.md`, `windows-manifest.json`
5. Version bumped in `package.json`
6. CHANGELOG updated with new tools and breaking changes
7. Binary re-signed with code signing certificate
8. `npm publish --access public`

**Validation**:
- [ ] Documentation complete and reviewed
- [ ] Heir architecture docs updated
- [ ] ROADMAP reflects shipped status
- [ ] npm package v2.0.0 published

## Risk Assessment

| Risk                                                         | Likelihood | Impact | Mitigation                                                            |
| ------------------------------------------------------------ | ---------- | ------ | --------------------------------------------------------------------- |
| Agent Workspace remains in Insider Preview indefinitely      | Medium     | High   | Gate #19 blocks work until GA. No wasted effort.                      |
| ODR developer docs insufficient or API changes               | Medium     | Medium | Private preview participation. Adapt when API stabilizes.             |
| MCP server security requirements too strict for npm packages | Low        | High   | Alex MCP server already follows best practices. Add code signing.     |
| Tool-level authorization UX too disruptive                   | Low        | Medium | Optimize tool granularity so users approve once, not per invocation.  |
| Copilot Actions vision model misinterprets tool responses    | Medium     | Low    | Add structured output formatting to tool responses.                   |
| Windows proxy adds unacceptable latency                      | Low        | Medium | MCP tools are lightweight reads -- should be fast even through proxy. |

## Effort Estimate

| Phase                        | Duration       | Dependencies                             |
| ---------------------------- | -------------- | ---------------------------------------- |
| Phase 1: ODR Registration    | 1 week         | ODR docs published, code signing cert    |
| Phase 2: Tool Enhancement    | 1 week         | Phase 1 complete                         |
| Phase 3: Integration Testing | 1 week         | Phase 2 complete, Insider Preview access |
| Phase 4: Documentation       | 3 days         | Phase 3 complete                         |
| **Total**                    | **~3.5 weeks** | **Gate: Agent Workspace GA**             |

This is the most lightweight heir deployment in the family -- Alex's existing MCP server does the heavy lifting, and Windows provides the infrastructure.

## Prerequisites and Gates

### Hard Gates (Must Be Met)

| Gate                                       | Current Status              | Required For |
| ------------------------------------------ | --------------------------- | ------------ |
| Agent Workspace exits Insider Preview      | Experimental / Copilot Labs | Phase 1      |
| ODR developer documentation published      | Private preview             | Phase 1      |
| Code signing certificate obtained          | Not started                 | Phase 1      |
| Windows 11 Insider Preview build available | Available                   | Phase 1      |

### Soft Prerequisites (Nice to Have)

| Prerequisite                                    | Status                  | Benefit                             |
| ----------------------------------------------- | ----------------------- | ----------------------------------- |
| Entra + MSA identity support in Agent Workspace | Announced "coming soon" | Enterprise managed device support   |
| MCP server marketplace/store                    | Not announced           | Discoverability for Alex MCP tools  |
| Copilot Actions API documentation               | Private preview         | Deeper integration beyond MCP tools |

## Future Opportunities

### Beyond MCP Tools

Once the basic ODR registration is complete, additional integration paths open up:

1. **Custom Copilot Actions Plugins**: If Microsoft opens a plugin API for Copilot Actions, Alex could provide pre-built action templates (e.g., "research then write" workflows)
2. **Enterprise Policy Integration**: With Entra identity support, Alex tools could respect organizational policies for knowledge sharing
3. **Multi-Agent Coordination**: Alex MCP server could coordinate with other ODR-registered MCP servers, acting as a knowledge layer across multiple tools
4. **Desktop Skill Building**: Observe desktop patterns through tool invocations and automatically create new skills from recurring workflows (muscle-memory-recognition meets desktop context)
5. **Visual Memory Integration**: Copilot Actions' vision capabilities could feed into Alex's visual memory system for learning from UI patterns

### Cross-Heir Synergies

| Synergy               | Platforms               | Value                                                              |
| --------------------- | ----------------------- | ------------------------------------------------------------------ |
| Knowledge sharing     | Windows Agent + VS Code | Insights from desktop tasks inform development workflows           |
| Enterprise compliance | Windows Agent + M365    | Unified audit trail across desktop and cloud                       |
| Learning loop         | All heirs               | Desktop observations enrich global knowledge accessible everywhere |

## References

### Official Microsoft Sources

| Source                        | URL                                                                                                                                    | Date         |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Securing AI Agents on Windows | https://blogs.windows.com/windowsexperience/2025/10/16/securing-ai-agents-on-windows/                                                  | Oct 16, 2025 |
| Securing MCP on Windows       | https://blogs.windows.com/windowsexperience/2025/05/19/securing-the-model-context-protocol-building-a-safer-agentic-future-on-windows/ | May 19, 2025 |
| Experimental Agentic Features | https://support.microsoft.com/en-us/windows/experimental-agentic-features...                                                           | 2025         |

### Alex Architecture Sources

| Source                      | Location                                          |
| --------------------------- | ------------------------------------------------- |
| MCP Cognitive Tools         | `packages/mcp-cognitive-tools/`                   |
| Master-Heir Architecture    | `alex_docs/platforms/MASTER-HEIR-ARCHITECTURE.md` |
| VS Code Heir (reference)    | `alex_docs/platforms/VSCODE-HEIR.md`              |
| Claude Heir Plan (template) | `alex_docs/platforms/CLAUDE-HEIR-PLAN.md`         |
| Roadmap Entry               | `ROADMAP-UNIFIED.md` Conditional #19              |
