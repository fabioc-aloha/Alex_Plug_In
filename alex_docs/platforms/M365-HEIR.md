# M365 Heir — Alex Cognitive Architecture

> Declarative agent deployment for Microsoft 365 Copilot

|              |                            |
| ------------ | -------------------------- |
| **Status**   | ✅ Production               |
| **Version**  | 1.6 Schema (February 2026) |
| **Target**   | Microsoft 365 Copilot      |
| **Location** | `platforms/m365-copilot/`  |

---

## Executive Summary

The M365 heir brings Alex's personality and capabilities to the Microsoft 365 ecosystem. As a declarative agent, it operates within **Teams, Outlook, Word, PowerPoint**, and other M365 apps, providing learning partnership and cognitive assistance in business productivity contexts.

### Platform Capabilities

| Capability            | Implementation               | Status |
| --------------------- | ---------------------------- | ------ |
| **Declarative Agent** | M365 Copilot manifest v1.6   | ✅      |
| **OneDrive Memory**   | `Alex-Memory/` folder        | ✅      |
| **Natural Language**  | Cognitive protocols via chat | ✅      |
| **VS Code Sync**      | One-way export via extension | ✅      |
| **Multi-Model**       | GPT-5.2 + Claude Sonnet 4.5  | ✅      |
| **Code Interpreter**  | Python code execution        | ✅      |
| **Image Generation**  | GraphicArt capability        | ✅      |

---

## Declarative Agent Capabilities (Schema v1.6)

The M365 declarative agent manifest supports 12 capability types. Each capability can be configured to provide grounded knowledge for Alex.

### Capability Matrix

| Capability                | Description                               | Requires License | Scoped |
| ------------------------- | ----------------------------------------- | ---------------- | ------ |
| **WebSearch**             | Bing search, optionally scoped to 4 sites | No               | ✅      |
| **OneDriveAndSharePoint** | Files, folders, sites search              | Yes              | ✅      |
| **GraphConnectors**       | External data via Copilot connectors      | Yes              | ✅      |
| **GraphicArt**            | AI image generation from text             | No               | ❌      |
| **CodeInterpreter**       | Python code execution, data analysis      | No               | ❌      |
| **Dataverse**             | CRM/Dynamics data tables                  | Yes              | ✅      |
| **TeamsMessages**         | Channels, chats, meeting chats            | Yes (license)    | ✅      |
| **Email**                 | Personal and shared mailboxes             | Yes (license)    | ✅      |
| **People**                | Organizational profiles, relationships    | Yes (license)    | ✅      |
| **ScenarioModels**        | Task-specific fine-tuned models           | Varies           | ✅      |
| **Meetings**              | Meeting metadata, transcripts, chats      | Yes (license)    | ✅      |

### Knowledge Sources

| Source                    | Build Tool          | Scoping                        |
| ------------------------- | ------------------- | ------------------------------ |
| **Copilot connectors**    | Both                | By connection ID, KQL query    |
| **SharePoint/OneDrive**   | Both                | By site, folder, or file URL   |
| **Web search**            | Both                | Up to 4 site URLs              |
| **Embedded file content** | M365 Copilot only   | Direct upload                  |
| **Dataverse**             | Agents Toolkit only | By table name                  |
| **Email**                 | Both                | By folder, shared mailbox      |
| **People**                | Both                | Include related content option |
| **Teams messages**        | Both                | Up to 5 channels/chats         |
| **Meetings**              | Both                | Up to 5 specific meetings      |

### Build Tools

| Tool                             | Use Case                  | Capabilities                                                                |
| -------------------------------- | ------------------------- | --------------------------------------------------------------------------- |
| **Microsoft 365 Agents Toolkit** | VS Code-based development | Full manifest control, API plugins, local testing                           |
| **Copilot Studio**               | Low-code builder          | Visual designer, connectors, workflow automation                            |
| **Microsoft 365 Copilot**        | Native browser builder    | Quick agent creation, drag-drop file upload, visual knowledge configuration |
| **SharePoint**                   | Site-scoped agents        | Document knowledge agents, automatic site context                           |

#### Agent Builder UI (M365 Copilot)

**New in 2026**: Native agent creation directly in M365 Copilot at https://m365.cloud.microsoft/chat

**Features**:
- 📁 Visual knowledge source picker (SharePoint, Teams, Email)
- 📎 Drag-drop embedded file upload (up to 20 files, 512MB max)
- 🔌 Connector scoping UI (select specific projects, repositories, folders)
- 🏷️ Real-time sensitivity label visibility
- ✅ File readiness indicators during indexing
- 🎯 "Only use specified sources" toggle for strict knowledge control

**Ideal for**: Non-developers, quick prototyping, embedded file knowledge
**Limitations**: No API plugin support, no local testing, limited to UI-exposed features

For manifest-based control and API plugins, use **Microsoft 365 Agents Toolkit**.

### Multi-Model Support

M365 Copilot now supports multiple model selection:

| Model                 | Mode           | Strengths                            |
| --------------------- | -------------- | ------------------------------------ |
| **GPT-5.2**           | Think Deeper   | Extended reasoning, complex analysis |
| **GPT-5.2**           | Quick Response | Fast, efficient responses            |
| **Claude Sonnet 4.5** | Internal       | Alternative reasoning style          |

User can select model via M365 Copilot UI dropdown.

---

## Agent Instructions Best Practices

Based on Microsoft's latest guidance for declarative agent development.

### Instruction Components

1. **Purpose** — What the agent must accomplish
2. **General Guidelines** — Tone, restrictions, interaction style
3. **Skills** — Capabilities the agent references
4. **Step-by-step workflows** — With clear transitions
5. **Error handling** — Graceful failure patterns
6. **Examples** — Few-shot prompting for complex scenarios

### Markdown Formatting

```markdown
# Use headers for sections
## Use subheaders for topics
- Use bullets for lists
1. Use numbers for ordered steps
**Bold** critical instructions
`Backticks` for tool/system names
```

### Best Practices

| Practice                              | Why                                      |
| ------------------------------------- | ---------------------------------------- |
| **One clarifying question at a time** | Avoid overwhelming users                 |
| **Explicitly reference capabilities** | e.g., "Use `ServiceNow KB` for articles" |
| **Step-by-step with transitions**     | Goal → Action → Transition to next       |
| **Few-shot prompting**                | Multiple examples for complex scenarios  |
| **Avoid over-eager tool use**         | Ask for inputs before calling            |

### RAI Validation

All declarative agents undergo **Responsible AI (RAI) validation** during publish. Ensure:
- Instructions uphold ethical standards
- No harmful, biased, or misleading content
- Privacy-respecting behavior
- Appropriate disclaimers when needed

---

## Architecture Mapping

### Alex Family Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Alex Family Architecture                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  VS Code Alex                    M365 Alex                           │
│  ┌──────────────┐               ┌──────────────┐                    │
│  │  Extension   │───export───►  │  Declarative │                    │
│  │  + Tools     │               │    Agent     │                    │
│  └──────┬───────┘               └──────┬───────┘                    │
│         │                              │                             │
│         ▼                              ▼                             │
│  ~/.alex/global-knowledge/       OneDrive/Alex-Memory/              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Memory System Comparison

| Feature            | VS Code                  | M365                | Notes              |
| ------------------ | ------------------------ | ------------------- | ------------------ |
| User profile       | `user-profile.json`      | `profile.md`        | Different format   |
| Session notes      | Episodic folder          | `notes.md`          | Simplified         |
| Domain knowledge   | 100+ skills + DK files   | `knowledge/*.md`    | VS Code richer     |
| Learning goals     | Goals system             | `learning-goals.md` | Simplified         |
| Cross-project sync | Global knowledge + cloud | ❌ N/A               | VS Code only       |
| Cross-device sync  | GitHub Gist              | ✅ OneDrive          | Different backends |

---

## Export System

### What VS Code Exports to M365

| File                | Source                                      | Description                      |
| ------------------- | ------------------------------------------- | -------------------------------- |
| `profile.md`        | `~/.alex/global-knowledge/profile.json`     | Identity, preferences, expertise |
| `notes.md`          | Generated template                          | Quick notes and reminders        |
| `learning-goals.md` | Generated template                          | Active learning objectives       |
| `knowledge/*.md`    | `~/.alex/global-knowledge/patterns/GK-*.md` | Domain knowledge (renamed DK-*)  |
| `insights/*.md`     | `~/.alex/global-knowledge/insights/GI-*.md` | Timestamped learnings            |
| `README.md`         | Generated                                   | Setup instructions               |

### Export Location

```
~/Alex-Memory-Export/
├── profile.md
├── notes.md
├── learning-goals.md
├── README.md
├── knowledge/
│   ├── DK-typescript-patterns.md
│   └── DK-react-hooks.md
└── insights/
    ├── GI-2026-01-15-debugging-trick.md
    └── GI-2026-01-20-api-design.md
```

### How to Export

**Command Palette:**
1. Press `Ctrl+Shift+P`
2. Type "Alex: Export for M365 Copilot"
3. Press Enter

**Status Bar:**
1. Click the Alex status bar item
2. Select "Export for M365"

**Chat:**
```
@alex /exportm365
```

---

## Cognitive Protocols

### Available in M365

| Protocol               | VS Code          | M365               | Trigger              |
| ---------------------- | ---------------- | ------------------ | -------------------- |
| **Meditate**           | ✅ Command + tool | ✅ Natural language | "help me meditate"   |
| **Dream**              | ✅ Command        | ✅ Memory review    | "review my learning" |
| **Self-Actualize**     | ✅ Command + tool | ✅ Goal assessment  | "assess my goals"    |
| **Bootstrap Learning** | ✅ Full           | ✅ Via OneDrive     | "learn about X"      |

### Embedded Skills (15)

Due to M365 token limits, 15 high-value skills are embedded:

1. Appropriate Reliance
2. Architecture Health
3. Bootstrap Learning
4. Business Analysis
5. Change Management
6. Cognitive Load
7. Creative Writing
8. Learning Psychology
9. Meditation
10. Project Management
11. Refactoring Patterns
12. Root Cause Analysis
13. Self-Actualization
14. Testing Strategies
15. Work-Life Balance

---

## Setup Workflow

### Step 1: Build Knowledge in VS Code

```
@alex /saveinsight    # Save insights as you learn
@alex /promote        # Promote project knowledge
@alex /knowledgestatus # Check what's available
```

### Step 2: Export

Run the export command. Progress notification shows:
1. "Checking global knowledge..."
2. "Exporting profile..."
3. "Exporting patterns..."
4. "Exporting insights..."
5. "Creating notes template..."
6. "Complete!"

### Step 3: Upload to OneDrive

1. Open [OneDrive](https://onedrive.live.com)
2. Create `Alex-Memory` folder in root
3. Upload all contents from `~/Alex-Memory-Export/`

### Step 4: Use with M365 Copilot

```
@Alex what do you know about me?
@Alex search my knowledge for TypeScript
@Alex what are my learning goals?
@Alex help me with React hooks
```

---

## Deployment Options

### Option 1: Agent Builder UI (Easiest) 🆕

**New in 2026**: No-code deployment using M365 Copilot's native Agent Builder.

**Quick Steps**:
1. Navigate to https://m365.cloud.microsoft/chat → **Create agent**
2. Upload 6 knowledge files from `platforms/m365-copilot/appPackage/knowledge/`
3. Copy instructions from `declarativeAgent.json`
4. Enable capabilities (OneDrive, Email, Teams, People, Meetings)
5. Add conversation starters
6. Publish to organization

**Time**: ~5 minutes
**Skill Level**: Non-technical users
**Version Control**: Manual (UI-based changes)

📘 **Full Guide**: [platforms/m365-copilot/AGENT-BUILDER-GUIDE.md](../../platforms/m365-copilot/AGENT-BUILDER-GUIDE.md)
🎯 **Quick Ref**: [platforms/m365-copilot/AGENT-BUILDER-QUICK-REF.md](../../platforms/m365-copilot/AGENT-BUILDER-QUICK-REF.md)

### Option 2: Code-First Deployment (Advanced)

**Via M365 Agents Toolkit** (for developers needing version control, API plugins, CI/CD):

```bash
cd platforms/m365-copilot
npm install
npx teamsapp package --env dev
npx teamsapp validate --package-file appPackage/build/appPackage.dev.zip
npx teamsapp provision --env dev
```

**Time**: ~30 minutes
**Skill Level**: Developers
**Version Control**: Git-tracked manifest files

📘 **Full Guide**: [platforms/m365-copilot/DEPLOYMENT-CHECKLIST.md](../../platforms/m365-copilot/DEPLOYMENT-CHECKLIST.md)

### Option 3: Hybrid Approach (Recommended)

Combine code-first deployment with Agent Builder enhancements:

1. **Deploy base agent** via M365 Agents Toolkit (version-controlled instructions/capabilities)
2. **Enhance knowledge** via Agent Builder UI (visual embedded file management)
3. **Update code** when instructions change (maintain source of truth in Git)

**Benefits**:
- ✅ Git version control for agent logic
- ✅ Visual interface for knowledge sources
- ✅ Best of both worlds

---

## Limitations

| Limitation               | Workaround                                        |
| ------------------------ | ------------------------------------------------- |
| **One-way sync**         | Export from VS Code regularly                     |
| **15 skills only**       | Core skills selected for business context         |
| **No VS Code API**       | Use Agents Toolkit for dev workflows              |
| **Token limits**         | Condensed instructions, prioritize knowledge      |
| **License gating**       | Some capabilities require M365 Copilot license    |
| **8K char instructions** | Focus on essential behaviors, use examples wisely |

---

## Sync Considerations

### Current State (One-Way)

```
VS Code ──────► OneDrive ──────► M365 Copilot
   │                                  │
   │         (no return path)         │
   └──────────────────────────────────┘
```

### Future: Bi-Directional (Planned)

Azure Functions API for real-time sync:
- M365 insights flow back to VS Code
- Automatic conflict resolution
- Real-time sync between platforms

---

## Troubleshooting

| Issue                          | Solution                                              |
| ------------------------------ | ----------------------------------------------------- |
| "No global knowledge found"    | Run `Alex: Initialize`, then `@alex /saveinsight`     |
| "M365 integration is disabled" | Enable `alex.m365.enabled` in settings                |
| Files not appearing in M365    | Verify files in `OneDrive/Alex-Memory/`, refresh M365 |

---

## Related Documentation

| Document                                                     | Purpose                         |
| ------------------------------------------------------------ | ------------------------------- |
| [MASTER-HEIR-ARCHITECTURE.md](./MASTER-HEIR-ARCHITECTURE.md) | Overall heir architecture       |
| [../m365/](../m365/)                                         | M365 specific documentation     |
| [archive/M365-EXPORT.md](./archive/)                         | Historical export documentation |

### Microsoft Documentation

| Resource                            | URL                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Extensibility Overview**          | <https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/>                               |
| **Declarative Agent Manifest v1.6** | <https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest-1.6> |
| **Knowledge Sources**               | <https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/knowledge-sources>              |
| **Add Knowledge Sources**           | <https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agent-builder-add-knowledge>    |
| **Agent Instructions**              | <https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-instructions> |
| **Microsoft 365 Agents Toolkit**    | <https://aka.ms/M365AgentsToolkit>                                                                     |
| **Build Declarative Agents**        | <https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/build-declarative-agents>       |

---

*M365 Heir — Bringing Alex's learning partnership to Microsoft 365*
