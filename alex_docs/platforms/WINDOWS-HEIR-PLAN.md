# Windows Agent Heir Plan

> **Status**: Research Complete | **Created**: 2026-03-26 | **Updated**: 2026-03-26 | **Platform**: Windows Agent Workspace | **Roadmap**: Conditional #19
>
> **Research Sources**: Official Microsoft blogs + Windows Insider Preview documentation
>
> **Gate**: Agent Workspace exits Insider Preview (GA) + ODR developer documentation published

## Executive Summary

Windows 11 is introducing an **Agent Workspace** -- a contained, OS-level environment where AI agents operate with their own dedicated Windows account, isolated desktop session, and scoped file access. Agents interact with apps and data through **Copilot Actions**, which uses vision and advanced reasoning to click, type, and scroll like a human.

The bridge between Alex and this platform is the **Model Context Protocol (MCP)**. Windows uses MCP servers registered in the **On-Device Registry (ODR)** as the standard mechanism for agent connectors. Alex already ships a production MCP server (`packages/mcp-cognitive-tools/`) exposing 5 cognitive tools -- making this the lowest-friction heir deployment in the entire platform family.

This document defines the **Windows Agent heir**, creating a desktop-native AI partner alongside VS Code Extension (developer), M365 Copilot (enterprise productivity), and Agent Plugin (cloud API).

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

| Capability | Category | Portability | Transport | Notes |
|------------|----------|-------------|-----------|-------|
| Global Knowledge Search | Knowledge | Ready Now | `alex_knowledge_search` MCP tool | Cross-project patterns and insights available immediately |
| Global Knowledge Save | Knowledge | Ready Now | `alex_knowledge_save` MCP tool | Learning loop -- desktop interactions persist to global KB |
| Memory Search | Knowledge | Ready Now | `alex_memory_search` MCP tool | Search skills, instructions, prompts, episodic, and global memory |
| Architecture Status | Meta-Cognitive | Ready Now | `alex_architecture_status` MCP tool | Skill counts, trifectas, agents -- full inventory |
| Synapse Health | Meta-Cognitive | Ready Now | `alex_synapse_health` MCP tool | Architecture integrity checks before trusting outputs |
| Meditation Protocol | Meta-Cognitive | New MCP Tool | Expose as `alex_meditate` tool | Knowledge consolidation checkpoint -- summarize and save session state |
| Self-Actualization | Meta-Cognitive | New MCP Tool | Expose as `alex_self_actualize` tool | Deep architecture assessment and growth planning |
| Skill Catalog (150 skills) | Skills | File Access | Copilot Actions reads `~/.alex/` or workspace `.github/skills/` | Vision-based: agent reads SKILL.md files directly from disk |
| Instruction Library (60+) | Skills | File Access | Copilot Actions reads `.github/instructions/` | Domain-specific rules available as reference documents |
| Prompt Templates (26+) | Workflow | File Access | Copilot Actions reads `.github/prompts/` | Reusable workflow templates for desktop tasks |
| Bootstrap Learning | Knowledge | New MCP Tool | Expose as `alex_bootstrap_learn` tool | Domain-agnostic knowledge acquisition for unfamiliar tasks |
| Knowledge Synthesis | Knowledge | Partial | Via `alex_knowledge_search` + `alex_knowledge_save` | Cross-project pattern recognition works; trifecta routing does not |
| Code Review | Development | File Access | Copilot Actions reads code files + `.github/instructions/code-review-guidelines.instructions.md` | Vision-based code review on desktop IDE screenshots |
| Research-First Development | Workflow | File Access | Agent reads research workflow instructions | 4-dimension gap analysis before starting work |
| Root Cause Analysis | Debugging | File Access | Agent reads RCA instruction | 5 Whys, binary search, timeline reconstruction |
| Debugging Patterns | Development | File Access | Agent reads debugging instruction | Reproduce, isolate, hypothesize, fix |
| Security Review | Security | File Access | Agent reads security-review instruction | OWASP Top 10, STRIDE, dependency audit |
| AI Writing Avoidance | Writing | File Access | Agent reads writing instruction | Human-sounding content generation |
| Brand Asset Management | Creative | File Access | Agent accesses `assets/` via known folders | Logo, icon, and banner management |
| Image Generation (Replicate) | Creative | New MCP Tool | Expose as `alex_generate_image` tool | AI image generation via Replicate API |
| Gamma Presentations | Productivity | Not Portable | Requires Gamma API + browser | Web-based service, not desktop-native |
| MD to Word Conversion | Productivity | Partial | Copilot Actions can run CLI commands | Requires Pandoc installed on system |
| Chat Participant (@alex) | VS Code | Not Portable | VS Code Extension API only | Platform-specific -- no equivalent in Agent Workspace |
| Agent Modes (7 agents) | VS Code | Not Portable | VS Code agent framework only | Builder, Researcher, Validator, etc. are VS Code constructs |
| Language Model Tools | VS Code | Not Portable | VS Code LM API only | Copilot Chat tool calling is extension-specific |
| Slash Commands | VS Code | Not Portable | VS Code Chat API only | /meditate, /dream, /learn are chat-specific |
| Graph API Integration | M365 | Not Portable | Teams/M365 runtime only | Declarative Agent + Graph connector |
| Adaptive Cards | M365 | Not Portable | Teams rendering only | M365-specific UI surface |
| Episodic Memory (session) | Memory | Built-in | Agent Workspace audit logs | Windows provides its own session logging |
| Copilot Memory | Memory | Not Portable | GitHub Copilot API only | Cross-session memory is platform-specific |
| Dream State Automation | Meta-Cognitive | New MCP Tool | Expose as `alex_dream` tool | Automated neural maintenance and consolidation |

### Portability Summary

| Portability Level | Count | Description |
|-------------------|-------|-------------|
| **Ready Now** | 5 | Existing MCP tools -- register in ODR and go |
| **New MCP Tool** | 5 | Requires adding new tools to `@alex/mcp-cognitive-tools` |
| **File Access** | 10 | Copilot Actions reads Alex files via desktop vision/file access |
| **Partial** | 2 | Some functionality works, some does not |
| **Built-in** | 1 | Windows provides equivalent capability natively |
| **Not Portable** | 7 | Platform-specific to VS Code or M365 -- no transport path |
| **Total** | **30** | **23 of 30 capabilities (77%) are portable to Windows Agent** |

### Priority for New MCP Tools

If building new tools for Phase 2, prioritize in this order:

| Priority | Tool | Rationale |
|----------|------|-----------|
| P0 | `alex_meditate` | Core cognitive protocol -- every heir should support checkpointing |
| P1 | `alex_dream` | Automated maintenance keeps architecture healthy between sessions |
| P1 | `alex_self_actualize` | Deep assessment enables growth on any platform |
| P2 | `alex_bootstrap_learn` | Knowledge acquisition is platform-agnostic |
| P3 | `alex_generate_image` | Creative capability via Replicate API -- nice to have on desktop |

## Platform Comparison

### Where Windows Agent Fits

| Platform              | Surface        | Runtime                | Interaction                   | Alex Role                         |
| --------------------- | -------------- | ---------------------- | ----------------------------- | --------------------------------- |
| **VS Code Extension** | Code editor    | Node.js Extension Host | Chat / commands / agent modes | Full cognitive partner (flagship) |
| **M365 Copilot**      | Teams / Office | Declarative Agent      | Graph + adaptive cards        | Enterprise productivity           |
| **Agent Plugin**      | Cloud API      | Azure Functions        | API calls                     | Service-to-service                |
| **Windows Agent**     | Desktop OS     | MCP Server via ODR     | Vision + reasoning            | Desktop knowledge partner         |
| **Claude Cowork**     | Desktop app    | Skills + Connectors    | File access + sub-agents      | Knowledge worker (planned)        |

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
- Code signing certificate

**Tasks**:
1. Review ODR registration requirements and developer documentation
2. Add code signing to `@alex/mcp-cognitive-tools` package
3. Create declarative privilege manifest (tools only read from `~/.alex/` and workspace `.github/`)
4. Register package in Windows ODR
5. Verify tool discovery: Copilot Actions can see all 5 Alex tools

**Validation**:
- [ ] MCP server appears in Windows ODR
- [ ] All 5 tools discoverable by Copilot Actions
- [ ] Tool-level authorization prompts work correctly
- [ ] Proxy-mediated communication functioning

### Phase 2: Tool Enhancement for Desktop Context (Week 2)

**Goal**: Optimize tool descriptions and schemas for desktop agent use cases

**Tasks**:
1. Review tool descriptions for clarity in desktop context (current descriptions optimized for developer use)
2. Add desktop-specific examples to tool schemas
3. Consider new tools for desktop-specific scenarios:
   - `alex_desktop_context`: Provide relevant knowledge based on active files/applications
   - `alex_task_history`: Search previous desktop task completions for patterns
4. Test tool invocation through Copilot Actions vision + reasoning pipeline
5. Validate the learning loop: insights saved via `alex_knowledge_save` are retrievable

**Validation**:
- [ ] Copilot Actions correctly invokes Alex tools for relevant tasks
- [ ] Tool responses are useful in desktop automation context
- [ ] Knowledge save/search round-trip works through ODR

### Phase 3: Integration Testing (Week 3)

**Goal**: End-to-end validation in Agent Workspace environment

**Tasks**:
1. Test scenarios:
   - "Search my knowledge base before starting this document"
   - "Check architecture health before making changes"
   - "Save what I learned from this task"
   - "What patterns have I seen across my projects?"
2. Validate security boundaries:
   - Agent account cannot access files outside declared scope
   - User authorization required for sensitive operations
   - Audit trail captures all tool invocations
3. Performance testing: tool response times through Windows proxy
4. Error handling: graceful degradation when MCP server unavailable

**Validation**:
- [ ] All test scenarios pass
- [ ] Security boundaries verified
- [ ] Performance acceptable (<2s tool response through proxy)
- [ ] Error handling graceful

### Phase 4: Documentation and Release (Week 4)

**Goal**: Publish Windows Agent heir with documentation

**Tasks**:
1. Create `platforms/windows-agent/README.md` with setup instructions
2. Update heir architecture diagram in `MASTER-HEIR-ARCHITECTURE.md`
3. Add Windows Agent to copilot-instructions.md Heirs section
4. Document known limitations and workarounds
5. Create troubleshooting guide for common ODR issues
6. Update ROADMAP: close Conditional #19, move to shipped

**Validation**:
- [ ] Documentation complete and reviewed
- [ ] Heir architecture docs updated
- [ ] ROADMAP reflects shipped status

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
