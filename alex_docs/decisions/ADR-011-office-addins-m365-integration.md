# ADR-011: Office Add-ins Integration with M365 Heir

**Status**: Accepted
**Date**: 2026-02-15
**Deciders**: @fabioc, @Alex
**Technical Story**: Roadmap v5.7.6 — Determine if Office Add-ins (Word/Excel/PowerPoint/Outlook) should be a separate heir platform or integrated into the M365 heir

## Context

### The Question

Microsoft Office applications (Word, Excel, PowerPoint, Outlook) support extensibility via Office Add-ins — custom web-based UI and functionality that runs inside Office applications. Should Alex deploy to Office as:

1. **Part of M365 heir** (same codebase as M365 Copilot declarative agent)
2. **Separate Office heir** (independent platform)
3. **Outside scope** (not pursued)

### Current M365 Heir Architecture

The M365 heir (`platforms/m365-copilot/`) is a **declarative agent** for M365 Copilot, running in:
- Teams (chat interface)
- M365 Copilot (productivity chat)
- BizChat (enterprise chat)

**Key characteristics**:
- Conversational UI (chat-based)
- OneDrive-based memory (profile.md, notes.md, DK-*.md knowledge files)
- Unified manifest format (Teams app manifest)
- Microsoft Entra ID authentication
- Limited document manipulation (indirect, via user confirmation)

### Office Add-ins Platform

Office Add-ins extend Office applications with custom functionality:

**Deployment model**:
- **Task pane**: Persistent sidebar UI (like VS Code extension sidebar)
- **Mail add-in**: Outlook compose/read panes
- **Custom functions**: Excel user-defined functions (UDFs)
- **Content add-in**: Embedded within document (Excel only)

**Key characteristics**:
- HTML/CSS/JavaScript web app (self-hosted)
- Office.js API for document manipulation
- **Unified manifest** support (same manifest format as Teams apps!)
- Microsoft Entra ID authentication (SSO)
- Direct document access (Office.js DOM)

### Critical Discovery: Unified Manifest

The **unified manifest** format allows **one manifest to publish BOTH a Teams app AND Office Add-in**:

```json
{
  "id": "alex-m365",
  "manifestVersion": "devPreview",
  "extensions": [
    {
      "id": "alexDeclarativeAgent",
      "type": "declarativeCopilot",
      ...
    },
    {
      "id": "alexOfficeAddin",
      "type": "officeAddin",
      ...
    }
  ]
}
```

This means M365 heir can publish to **both Teams and Office from the same codebase**.

## Decision Drivers

1. **Infrastructure Overlap**: 90% shared infrastructure (manifest, auth, deployment, admin policies)
2. **Memory Synergy**: Both can use same OneDrive storage (profile.md, notes.md, knowledge files)
3. **User Workflow Continuity**: Natural flow from chat (Teams) → creation (Office)
4. **Deployment Efficiency**: Single AppSource listing, single admin deployment
5. **Maintenance Burden**: One codebase easier to maintain than two separate heirs
6. **Platform Maturity**: Office Add-ins stable and production-ready (vs experimental platforms)

## Considered Options

### Option A: Integrate into M365 Heir (Recommended)

Office Add-ins become an **additional surface** for the M365 heir, alongside Teams/M365 Copilot.

**Pros**:
- ✅ Unified manifest = single deployment
- ✅ Shared OneDrive memory = consistent personality across surfaces
- ✅ One codebase to maintain (`platforms/m365-copilot/`)
- ✅ Same authentication, admin policies, compliance
- ✅ Natural workflow continuity (chat in Teams → create in Office)
- ✅ No user confusion (one "Alex" app to install)
- ✅ Synergy: Research in Teams → write in Word → analyze in Excel

**Cons**:
- ⚠️ Broader scope for M365 heir (more to maintain)
- ⚠️ Office.js learning curve (new API surface)
- ⚠️ Task pane UI different from chat interface (HTML/CSS/JS vs conversational)

**Technical feasibility**: **High** — 90% infrastructure already exists

### Option B: Create Separate Office Heir

Office Add-ins become an independent heir platform (`platforms/office-addins/`).

**Pros**:
- ✅ Clear separation of concerns
- ✅ Independent versioning
- ✅ Focused team ownership

**Cons**:
- ❌ Duplicate infrastructure (manifest, auth, deployment scripts)
- ❌ Split memory (OneDrive files managed separately → personality drift)
- ❌ User confusion (two Alex apps in AppSource)
- ❌ Missed synergy (can't reference Teams chat context in Word doc)
- ❌ Double maintenance burden

**Technical feasibility**: **High** but wasteful

### Option C: Not Pursued

Office Add-ins remain outside Alex's scope.

**Pros**:
- ✅ Narrow focus (fewer platforms to support)

**Cons**:
- ❌ Missed productivity opportunity (Word/Excel are where knowledge work happens)
- ❌ Incomplete M365 coverage (Alex in chat but not documents)

**Strategic fit**: **Poor** — Office is core M365 productivity surface

## Decision

**Option A: Integrate Office Add-ins into M365 Heir**

### Justification

1. **Unified Manifest Eliminates Overhead**: The primary cost of a separate heir (deployment, auth, admin) is eliminated by unified manifest
2. **Shared Memory Creates Synergy**: Same OneDrive files → continuous personality from Teams chat to Word doc
3. **Complementary Surfaces**: Teams (research/collaboration) + Office (creation/analysis) = complete productivity stack
4. **Platform Maturity**: Office Add-ins stable API, not experimental → low risk
5. **Natural User Workflow**: Users already move between Teams and Office frequently

### Implementation Strategy

**Phase 1: Minimal Viable Add-in** (1 week)
- Update unified manifest with `officeAddin` extension
- Build task pane HTML (chat-style interface)
- Integrate OneDrive read (profile.md, notes.md)
- Test in Word/Excel (sideload)

**Phase 2: Office-Specific Features** (2-3 weeks)
- Word: Template insertion, style suggestions
- Excel: Learning goal tracker, data analysis
- PowerPoint: Slide generation from focus areas
- Outlook: Memory-augmented email drafting

**Phase 3: Advanced Capabilities** (backlog)
- Real-time collaboration awareness
- Custom Excel functions (UDFs)
- Office script automation
- Clipboard integration (Teams → Office paste)

### Architecture Changes

```diff
platforms/m365-copilot/
├── appPackage/
│   ├── manifest.json              # Add officeAddin extension
│   ├── declarativeAgent.json      # Existing (no change)
│   ├── instructions/              # Existing (no change)
│   ├── knowledge/                 # Existing (no change)
+   └── addin/                     # NEW: Office Add-in web app
+       ├── taskpane.html          # Task pane UI
+       ├── taskpane.css           # Styling
+       ├── taskpane.js            # Office.js integration
+       ├── auth.js                # SSO with Entra ID
+       └── memory.js              # OneDrive read/write (shared)
├── onedrive-templates/            # Existing (shared memory)
├── package.json
└── README.md                      # Document Office Add-in capabilities
```

## Consequences

### Positive

- ✅ Complete M365 productivity coverage (Teams + Office)
- ✅ Unified user experience (same Alex personality across surfaces)
- ✅ Reduced maintenance burden (one codebase)
- ✅ Natural workflow continuity (chat → create → analyze)
- ✅ Stronger value proposition (Alex everywhere in M365)

### Negative

- ⚠️ M365 heir scope expands (more code to maintain)
- ⚠️ Office.js learning curve for development
- ⚠️ Task pane UI development (HTML/CSS/JS, not just manifest)

### Neutral

- 🟡 New capability surface requires documentation updates
- 🟡 Testing matrix expands (Teams + Word + Excel + PowerPoint + Outlook)

## Compliance

### With Existing ADRs

- **ADR-009 (Global Knowledge Sync)**: No conflict — Office Add-in uses same OneDrive memory
- **ADR-010 (Copilot-Instructions)**: No conflict — M365 heir uses declarative agent instructions, not copilot-instructions.md

### With Architecture Principles

- ✅ **KISS**: Simpler to maintain one heir than two
- ✅ **DRY**: Shared infrastructure, not duplicated
- ✅ **Quality-First**: Office.js is stable, production-ready API

## Implementation Plan

### Immediate (v5.7.6 — This Session)

- [x] Research Office Add-ins platform (completed)
- [x] Create `OFFICE-ADDINS-RESEARCH.md` (completed)
- [x] Create ADR-011 (this document)
- [ ] Update roadmap status: v5.7.6 research → Complete
- [ ] Add Phase 1 implementation to backlog

### Short-term (Next Sprint)

- [ ] Update `manifest.json` with `officeAddin` extension
- [ ] Build minimal task pane HTML (chat interface)
- [ ] Test sideload in Word and Excel
- [ ] Document Office Add-in setup in M365 heir README

### Long-term (Backlog)

- [ ] Build Office-specific features (templates, charts, email)
- [ ] Publish to AppSource with Office Add-in capabilities
- [ ] User feedback loop on Office vs Teams preferences

## References

### Research Documents

- [OFFICE-ADDINS-RESEARCH.md](../platforms/OFFICE-ADDINS-RESEARCH.md) — Full platform analysis (this session)
- [M365 Heir README](../../platforms/m365-copilot/README.md) — Current M365 heir architecture
- [FOUNDRY-HEIR.md](../platforms/FOUNDRY-HEIR.md) — Foundry comparison (separate backend strategy)

### Official Documentation

- [Office Add-ins Platform Overview](https://learn.microsoft.com/en-us/office/dev/add-ins/overview/office-add-ins)
- [Unified Manifest for M365](https://learn.microsoft.com/en-us/microsoftteams/platform/m365-apps/overview)
- [Office.js API Reference](https://learn.microsoft.com/en-us/javascript/api/office)
- [M365 Agents Toolkit](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension)

---

*Decision: Office Add-ins integrate into M365 heir via unified manifest — same Alex personality from Teams chat to Word documents*
