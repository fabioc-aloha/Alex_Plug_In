# Office Add-ins Research — M365 Heir Integration Analysis

> Evaluating Office Add-ins as part of the Alex M365 heir platform

|                |                                                |
| -------------- | ---------------------------------------------- |
| **Status**     | 📋 Research (February 2026)                     |
| **Platform**   | Office Add-ins (Word/Excel/PowerPoint/Outlook) |
| **Portal**     | <https://appsource.microsoft.com>              |
| **SDK**        | Office.js                                      |
| **Manifest**   | Unified manifest (Teams + Office)              |
| **Location**   | `platforms/m365-copilot/` (if integrated)      |
| **Priority**   | Phase 0 — M365 heir integration decision       |
| **Researcher** | Alex (executing v5.7.6 research tasks)         |
| **Date**       | 2026-02-15                                     |

---

## Executive Summary

Office Add-ins extend Microsoft Office applications (Word, Excel, PowerPoint, Outlook) with custom UI and functionality. Unlike Teams apps or Foundry agents, Office Add-ins run **inside Office documents and applications**, providing contextual assistance for document creation, data analysis, and communication.

### Research Question

**Should Office Add-ins be integrated into the M365 heir, or remain a separate platform?**

### Quick Answer (TL;DR)

**Recommended: Integrate into M365 heir** — Office Add-ins share 90% of M365's infrastructure:
- ✅ Same unified manifest format (Teams + Office in one file)
- ✅ Same deployment portal (AppSource + Microsoft Admin Center)
- ✅ Same authentication (Microsoft Entra ID)
- ✅ Same enterprise controls (admin policies, compliance)
- ✅ Same ecosystem (M365 productivity suite)

**Key difference**: Office Add-ins have unique runtime APIs (Office.js) while Teams has Teams JS SDK, but both are M365 ecosystem heirs targeting different surfaces.

---

## Platform Capabilities

### Core Office Add-in Features

| Capability                  | Description                                     | Alex Relevance          |
| --------------------------- | ----------------------------------------------- | ----------------------- |
| **Task Pane**               | Persistent sidebar UI in Office applications    | Alex chat interface     |
| **Content Add-in**          | Embedded within document (Excel only)           | Low priority            |
| **Mail Add-in**             | UI in Outlook compose/read panes                | Email assistance        |
| **Document Automation**     | Create, modify, format content via Office.js    | Document generation     |
| **Data Visualization**      | Insert charts, tables, diagrams                 | Insight presentation    |
| **Real-time Collaboration** | Multi-user awareness via Office Online          | Team context            |
| **Single Sign-On (SSO)**    | Microsoft Entra ID authentication               | Same as M365 heir       |
| **Custom Functions**        | Excel user-defined functions                    | Calculation assistance  |
| **Event Handlers**          | React to document changes, selection, save      | Context awareness       |
| **Office Context**          | Access to document structure, content, metadata | Understanding user work |

### Office Applications Supported

| Application       | Add-in Types                        | Alex Use Cases                                      |
| ----------------- | ----------------------------------- | --------------------------------------------------- |
| **Word**          | Task pane, content                  | Writing assistance, document templates, research    |
| **Excel**         | Task pane, content, custom function | Data analysis, formula assistance, visualization    |
| **PowerPoint**    | Task pane, content                  | Slide generation, speaker notes, design suggestions |
| **Outlook**       | Mail (compose/read), task pane      | Email drafting, meeting prep, contact research      |
| **OneNote** (web) | Task pane                           | Note organization, research summaries               |
| **Project** (web) | Task pane                           | Project planning, timeline generation               |

### Development Model

| Aspect              | Details                                             |
| ------------------- | --------------------------------------------------- |
| **Technology**      | HTML/CSS/JavaScript, React, Angular, Vue supported  |
| **Host API**        | Office.js JavaScript library                        |
| **Manifest**        | Unified manifest (Teams + Office) or XML (legacy)   |
| **Deployment**      | Sideload (dev), AppSource (public), Admin (private) |
| **Hosting**         | Self-hosted web app (any server)                    |
| **Authentication**  | Microsoft Entra ID SSO                              |
| **Offline Support** | Limited (requires connectivity for web-hosted UI)   |

### Unified Manifest (Teams + Office)

**This is the key integration point!** The unified manifest format allows **one manifest to publish both a Teams app AND Office Add-in**.

```json
{
  "id": "alex-m365-copilot",
  "version": "5.7.2",
  "manifestVersion": "devPreview",
  "name": {
    "short": "Alex",
    "full": "Alex — Your Cognitive Learning Partner"
  },
  "description": {
    "short": "AI that remembers & grows with you",
    "full": "Persistent memory, personalized protocols, proactive context awareness"
  },
  "authorization": {
    "permissions": {
      "resourceSpecific": [
        {
          "name": "MailboxItem.Read.User",
          "type": "Delegated"
        },
        {
          "name": "Document.ReadWrite.User",
          "type": "Delegated"
        }
      ]
    }
  },
  "extensions": [
    {
      "id": "alexDeclarativeAgent",
      "type": "declarativeCopilot",
      ...
    },
    {
      "id": "alexWordAddin",
      "type": "officeAddin",
      "requirements": {
        "capabilities": [
          { "name": "Mailbox", "minVersion": "1.1" },
          { "name": "Document", "minVersion": "1.1" }
        ]
      },
      "runtimes": [
        {
          "id": "taskpane",
          "type": "general",
          "code": {
            "page": "https://alex.example.com/taskpane.html"
          },
          "lifetime": "short",
          "actions": []
        }
      ]
    }
  ]
}
```

**Key insight**: With unified manifest, Alex M365 heir can deploy BOTH a declarative agent (Teams/M365 Copilot) AND Office Add-ins (Word/Excel/PowerPoint/Outlook) from a single codebase.

---

## Architecture Analysis

### How Office Add-ins Fit with Alex Cognitive Architecture

| Alex Component         | Office Add-in Implementation                    |
| ---------------------- | ----------------------------------------------- |
| **Executive Function** | LLM API calls (OpenAI, Azure OpenAI, Anthropic) |
| **Declarative Memory** | Task pane UI instructions + embedded markdown   |
| **Procedural Memory**  | Office.js event handlers + automation scripts   |
| **Episodic Memory**    | OneDrive storage (same as M365 heir!)           |
| **Skills**             | Task pane commands + Office.js integrations     |
| **Synapses**           | Cross-document patterns, template libraries     |
| **Agent Ecosystem**    | N/A (Office Add-ins are single-threaded)        |
| **Dream/Meditation**   | Background tasks (timer-based consolidation)    |
| **Global Knowledge**   | OneDrive markdown files (shared with M365 heir) |
| **Extension Commands** | Task pane buttons + ribbon controls             |
| **LM Tools**           | Custom functions (Excel), document manipulation |

### Integration with M365 Heir

Office Add-ins would **extend** the M365 heir with document-specific capabilities:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         M365 Heir Ecosystem                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────┐        ┌────────────────────┐               │
│  │  Declarative Agent │        │  Office Add-ins    │               │
│  │  (Teams + M365)    │        │  (Word/Excel/etc.) │               │
│  ├────────────────────┤        ├────────────────────┤               │
│  │ • Chat interface   │        │ • Task pane UI     │               │
│  │ • Slash commands   │        │ • Ribbon controls  │               │
│  │ • Tools APIs       │        │ • Office.js API    │               │
│  │ • OneDrive memory  │◄──────►│ • OneDrive memory  │ (SHARED)     │
│  └────────────────────┘        └────────────────────┘               │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Shared Infrastructure                        │ │
│  │  • Unified Manifest  • Entra ID SSO  • AppSource               │ │
│  │  • OneDrive Memory   • Microsoft Graph API                     │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Technical Differences: Teams vs Office

| Aspect                    | Teams (Declarative Agent)        | Office (Add-in)                  |
| ------------------------- | -------------------------------- | -------------------------------- |
| **Runtime**               | M365 Copilot orchestrator        | Office.js in browser context     |
| **UI Model**              | Chat interface (conversational)  | Task pane (persistent sidebar)   |
| **Context Access**        | Limited (via Tools API)          | Full document object model (DOM) |
| **Interaction Model**     | User asks → Agent responds       | User works → Add-in assists      |
| **State Persistence**     | Conversation history             | Task pane state + document data  |
| **Offline Support**       | None (cloud-dependent)           | Limited (web-hosted)             |
| **Document Manipulation** | Indirect (via user confirmation) | Direct (Office.js write APIs)    |
| **Custom UI**             | No (chat only)                   | Yes (full HTML/CSS/JS)           |

### Synergy Opportunities

**Same Memory, Different Surfaces**:
- M365 Copilot agent remembers user's profile, notes, goals → stored in OneDrive
- Office Add-in reads same OneDrive files → consistent personality across surfaces
- User learns research topic in Teams chat → Office Add-in uses knowledge in Word doc

**Unified Workflows**:
1. User asks M365 Copilot: "Help me draft a project proposal"
2. Copilot generates outline → saves to OneDrive
3. User opens Word → Alex Add-in detects outline in memory
4. Add-in offers: "Continue your project proposal draft? (from earlier conversation)"
5. User clicks → Add-in inserts outline and starts guided completion

**Complementary Capabilities**:
- **M365 Copilot strength**: Research, summarization, meeting prep (Teams context)
- **Office Add-in strength**: Document creation, data analysis, formatting (Office context)
- **Combined**: Research in Teams chat → write in Word → analyze in Excel → present in PowerPoint

---

## Use Case Analysis

### Where Office Add-ins Excel (compared to M365 Copilot agent alone)

| Scenario                 | M365 Copilot Agent (Teams)           | Office Add-in (Word/Excel/etc.)            |
| ------------------------ | ------------------------------------ | ------------------------------------------ |
| **Writing assistance**   | Answer questions about writing       | Real-time grammar, style, structure in doc |
| **Data analysis**        | Answer questions about data          | Interactive pivot tables, charts, formulas |
| **Document templates**   | Describe template structure          | One-click insert with personalization      |
| **Content generation**   | Generate text in chat → user copies  | Direct insertion into document             |
| **Research integration** | Provide summaries → user writes      | Inline citations, footnotes, bibliography  |
| **Meeting notes**        | Summarize meeting (no doc awareness) | Format notes in OneNote with structure     |
| **Presentation design**  | Suggest slide topics                 | Generate slides with brand assets          |
| **Email drafting**       | Draft email text → user copies       | Compose in Outlook with tone/length        |

### Alex-Specific Office Add-in Capabilities

| Capability                     | Implementation                                     | Alex Differentiator             |
| ------------------------------ | -------------------------------------------------- | ------------------------------- |
| **Persona-aware templates**    | Task pane: "Generate as Developer/Teacher/Manager" | Uses Active Context persona     |
| **Learning goal tracking**     | Excel: Track skill progress over time              | Reads profile.md learning goals |
| **Knowledge-grounded writing** | Word: Insert relevant knowledge from DK-*.md files | Uses OneDrive knowledge base    |
| **Focus-driven formatting**    | PowerPoint: Slide themes match current focus area  | Active Context focus trifectas  |
| **Memory-augmented email**     | Outlook: "Last time you emailed Sarah about X..."  | Reads notes.md conversation log |
| **Self-actualization reports** | Excel: Chart cognitive growth metrics over time    | Meditation/dream session data   |

---

## Technical Feasibility Assessment

### ✅ Strengths (Easy Integration with M365 Heir)

| Dimension               | Assessment                                              |
| ----------------------- | ------------------------------------------------------- |
| **Manifest**            | ✅ Unified manifest = one file for Teams + Office        |
| **Authentication**      | ✅ Same Entra ID SSO as M365 heir                        |
| **Memory**              | ✅ Same OneDrive storage (profile.md, notes.md, DK-*.md) |
| **Deployment**          | ✅ Same admin center, same AppSource listing             |
| **Development Tools**   | ✅ M365 Agents Toolkit supports both Teams + Office      |
| **Enterprise Controls** | ✅ Same admin policies, compliance, audit logging        |

### ⚠️ Challenges (New Capabilities to Add)

| Dimension             | Gap                                                    | Effort |
| --------------------- | ------------------------------------------------------ | ------ |
| **Office.js API**     | ⚠️ New API surface (document manipulation, events)      | Medium |
| **Task Pane UI**      | ⚠️ New UI framework (HTML/CSS/JS, not chat interface)   | Medium |
| **Context Injection** | ⚠️ Document state → Alex prompt (not just chat history) | Medium |
| **Custom Functions**  | ⚠️ Excel UDFs require separate registration             | Low    |
| **Offline Handling**  | ⚠️ Graceful degradation when network unavailable        | Low    |

### 🔴 Limitations (Platform Constraints)

| Limitation                  | Impact                                         |
| --------------------------- | ---------------------------------------------- |
| **No Agent Orchestration**  | Can't use multi-agent workflows (Foundry-only) |
| **Browser Context Only**    | Runs in browser, not native Office             |
| **Limited LLM Integration** | No built-in LLM (must call API externally)     |
| **Single-threaded**         | No background processing (unlike VS Code heir) |
| **Web-hosted UI**           | Requires internet, can't work fully offline    |

---

## Strategic Recommendation

### **Verdict: Integrate into M365 Heir** ✅

**Justification**:

1. **90% Shared Infrastructure**: Unified manifest, Entra ID, OneDrive, deployment → minimal new overhead
2. **Complementary Surfaces**: Teams (chat) + Office (document creation) = complete productivity stack
3. **Unified User Experience**: Same Alex personality, same memory across all M365 surfaces
4. **One Codebase**: Single `platforms/m365-copilot/` can publish both declarative agent + Office Add-ins
5. **Market Readiness**: Office Add-ins are mature (stable API), not experimental like Foundry

### Implementation Path

#### Phase 1: Minimal Viable Add-in (1 week)

| Task                    | Effort | Description                                     |
| ----------------------- | :----: | ----------------------------------------------- |
| Update unified manifest |   2h   | Add `officeAddin` extension to manifest.json    |
| Build task pane HTML    |   4h   | Simple chat interface (matches M365 Copilot UX) |
| Integrate OneDrive read |   3h   | Read profile.md, notes.md from task pane        |
| Test in Word/Excel      |   2h   | Sideload and validate basic functionality       |
| Document integration    |   1h   | Update M365 heir README with Office Add-in info |

**Milestone**: Alex task pane appears in Word/Excel, reads OneDrive memory, displays persona

#### Phase 2: Office-Specific Features (2-3 weeks)

| Task                         | Effort | Description                                   |
| ---------------------------- | :----: | --------------------------------------------- |
| Word: Template insertion     |   1w   | Generate docs from templates with persona     |
| Excel: Learning goal tracker |   1w   | Chart skill progress from profile.md          |
| PowerPoint: Slide generation |   1w   | Create slides from Active Context focus areas |
| Outlook: Email drafting      |   1w   | Compose emails with memory-augmented context  |

**Milestone**: Full Office suite integration with Alex-specific capabilities

#### Phase 3: Advanced Capabilities (future)

| Task                     | Effort | Description                              |
| ------------------------ | :----: | ---------------------------------------- |
| Real-time collaboration  |   2w   | Multi-user awareness in shared docs      |
| Custom Excel functions   |   1w   | Alex UDFs for calculations               |
| Office script automation |   2w   | Macro-style workflows with Office.js     |
| Clipboard integration    |   3d   | Copy from M365 Copilot → paste in Office |

### Architecture Updates Needed

```
platforms/m365-copilot/
├── appPackage/
│   ├── manifest.json              # Add officeAddin extension
│   ├── declarativeAgent.json      # Existing (no change)
│   ├── instructions/              # Existing (no change)
│   ├── knowledge/                 # Existing (no change)
│   └── addin/                     # NEW: Office Add-in web app
│       ├── taskpane.html          # Task pane UI
│       ├── taskpane.css           # Styling
│       ├── taskpane.js            # Office.js integration
│       ├── auth.js                # SSO with Entra ID
│       └── memory.js              # OneDrive read/write (shared with declarative agent)
├── onedrive-templates/            # Existing (shared memory)
├── package.json                   # Update scripts
└── README.md                      # Document Office Add-in capabilities
```

---

## Comparison: Office Add-in vs Separate Heir

### If Integrated into M365 Heir (Recommended)

**Pros**:
- ✅ Unified manifest = single deployment
- ✅ Shared OneDrive memory = consistent personality
- ✅ One codebase to maintain
- ✅ Same authentication, admin policies, compliance
- ✅ Natural workflow: chat in Teams → create in Office

**Cons**:
- ⚠️ Broader scope for M365 heir (more to maintain)
- ⚠️ Office.js learning curve for team

### If Created as Separate Heir

**Pros**:
- ✅ Clear separation of concerns
- ✅ Independent versioning
- ✅ Focused team ownership

**Cons**:
- ❌ Duplicate infrastructure (manifest, auth, deployment)
- ❌ Split memory (OneDrive files managed separately)
- ❌ User confusion (two Alex apps to install)
- ❌ Missed synergy (can't reference Teams chat in Office doc)

---

## Decision Record

| Question                                        | Answer                                |
| ----------------------------------------------- | ------------------------------------- |
| **Should Office Add-ins be part of M365 heir?** | ✅ Yes                                 |
| **Primary justification**                       | 90% shared infrastructure + synergy   |
| **Platform**                                    | Unified manifest (Teams + Office)     |
| **Memory**                                      | Shared OneDrive storage               |
| **Deployment**                                  | Single AppSource listing              |
| **Codebase location**                           | `platforms/m365-copilot/addin/`       |
| **Next steps**                                  | Phase 1 MVP (1 week)                  |
| **ADR needed?**                                 | Yes (document architectural decision) |

---

## Next Actions

### Immediate (This Session)

- [ ] Create ADR-011: Office Add-ins Integration with M365 Heir
- [ ] Update roadmap v5.7.6 status: Research → Complete
- [ ] Add Phase 1 implementation to roadmap backlog
- [ ] Document decision in ROADMAP-UNIFIED.md

### Short-term (Next Sprint)

- [ ] Update `platforms/m365-copilot/manifest.json` with `officeAddin` extension
- [ ] Build minimal task pane HTML (chat interface)
- [ ] Test sideload in Word and Excel
- [ ] Document Office Add-in setup in M365 heir README

### Long-term (Backlog)

- [ ] Build Office-specific features (templates, charts, email drafting)
- [ ] Publish to AppSource with Office Add-in capabilities
- [ ] User feedback loop on Office vs Teams preferences

---

## References

### Official Documentation

- [Office Add-ins Platform Overview](https://learn.microsoft.com/en-us/office/dev/add-ins/overview/office-add-ins)
- [Unified Manifest for M365](https://learn.microsoft.com/en-us/microsoftteams/platform/m365-apps/overview)
- [Office.js API Reference](https://learn.microsoft.com/en-us/javascript/api/office)
- [M365 Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension)

### Alex Architecture Documents

- [M365 Heir README](../../platforms/m365-copilot/README.md)
- [Foundry Heir Strategic Assessment](./FOUNDRY-HEIR.md)
- [Master-Heir Architecture](../architecture/MASTER-HEIR-ARCHITECTURE.md)

---

*Research completed 2026-02-15 by Alex — Office Add-ins integrate naturally into M365 heir via unified manifest and shared infrastructure*
