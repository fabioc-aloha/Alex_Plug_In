# 📎 Alex Office Add-ins Integration

> Unified manifest deployment — One file for Teams + Outlook + Office

---

## Overview

Alex is now available as an **Office Add-in** across Word, Excel, PowerPoint, and Outlook using the **unified manifest for Microsoft 365**. This means one manifest file deploys Alex to:

- ✅ **Microsoft Teams** (declarative agent)
- ✅ **M365 Copilot** (chat interface)
- ✅ **Outlook** (mail add-in, task pane)
- ✅ **Word** (task pane, document assistance)
- ✅ **Excel** (task pane, data analysis)
- ✅ **PowerPoint** (task pane, slide generation)

**Unified manifest version**: 1.19 (Teams schema with Office extensions)

---

## Architecture

### Unified Manifest Strategy

```
manifest.json
├── copilotAgents: [...] ← M365 Copilot declarative agent
├── staticTabs: [...] ← Teams personal tab
└── extensions: [ ← Office Add-ins (NEW)
    {
      requirements: {
        scopes: ["workbook", "document", "presentation", "mail"]
      },
      runtimes: [{ taskpane runtime }],
      ribbons: [{ Alex button in Home ribbon }]
    }
  ]
```

### Shared Infrastructure

| Component          | Implementation                            | Shared? |
| ------------------ | ----------------------------------------- | ------- |
| **Manifest**       | `manifest.json` (unified v1.19)           | ✅ Yes   |
| **Memory**         | OneDrive `Alex-Memory/` folder            | ✅ Yes   |
| **Authentication** | Microsoft Entra ID SSO                    | ✅ Yes   |
| **Deployment**     | AppSource + Microsoft Admin Center        | ✅ Yes   |
| **UI**             | HTML task pane (`taskpane/taskpane.html`) | ⚠️ New   |
| **API**            | Office.js (new surface)                   | ⚠️ New   |

---

## Implementation Status

**Version**: v5.7.6 (Phase 1 — Minimal Viable Add-in)

### ✅ Completed

- [x] Research unified manifest Office Add-in capabilities
- [x] Decision: Integrate into M365 heir (ADR-011)
- [x] Update `manifest.json` with `extensions` array
- [x] Create task pane HTML UI (`taskpane/taskpane.html`)
- [x] Create task pane JavaScript logic (`taskpane/taskpane.js`)
- [x] Add Alex button to Office ribbon (Home tab)
- [x] OneDrive memory status display
- [x] Host-specific welcome messages (Word/Excel/PowerPoint/Outlook)

### 🚧 In Progress (Phase 2)

- [ ] Microsoft Graph API integration for OneDrive file read
- [ ] Full chat interface in task pane
- [ ] Insert content into documents (Word/Excel/PowerPoint)

### 📋 Planned (Phase 3)

- [ ] **Word**: Template insertion from persona
- [ ] **Excel**: Learning goal tracker charts
- [ ] **PowerPoint**: Slide generation from focus trifectas
- [ ] **Outlook**: Email drafting with memory context
- [ ] Custom Excel functions (UDFs)
- [ ] Real-time collaboration awareness

---

## File Structure

```
platforms/m365-copilot/
├── appPackage/
│   ├── manifest.json ← Unified manifest (Teams + Office)
│   ├── declarativeAgent.json ← M365 Copilot agent definition
│   ├── color.png ← 192x192 icon
│   └── outline.png ← 32x32 icon
├── taskpane/ ← Office Add-in task pane (NEW)
│   ├── taskpane.html ← Task pane UI
│   └── taskpane.js ← Office.js logic
├── onedrive-templates/ ← Memory file templates
│   ├── profile.md
│   ├── notes.md
│   └── focus-trifectas.md
└── OFFICE-ADDINS-README.md ← This file
```

---

## How It Works

### 1. Ribbon Button

When users install Alex in Office, they see:

```
Home Ribbon
└── Alex Group
    └── [Alex] button ← Opens task pane
```

### 2. Task Pane Opens

The task pane displays:

- **Header**: Alex logo + "Your Cognitive Learning Partner"
- **Memory Status**: OneDrive file check (profile.md, notes.md, focus-trifectas.md)
- **Welcome Message**: Host-specific (Word/Excel/PowerPoint/Outlook)
- **Capabilities**: What Alex can do in this application
- **Action Buttons**: Chat, Setup Memory, Learn More

### 3. OneDrive Memory Integration

Alex reads from:

```
OneDrive/
└── Alex-Memory/
    ├── profile.md ← User name, role, learning goals
    ├── notes.md ← Session notes, reminders
    ├── focus-trifectas.md ← Current focus areas (3 skills each)
    └── DK-*.md ← Domain knowledge files
```

**Status Display**:
- ✅ **Loaded** (green) — File found and accessible
- ⚠️ **Not found** (yellow) — File missing (user needs to create)
- ❌ **Error** (red) — Permission or API error

---

## Development & Testing

### Prerequisites

1. **Microsoft 365 Developer Account** ([join program](https://developer.microsoft.com/microsoft-365/dev-program))
2. **Office Version**: 2304 (Build 16320.00000) or later (for unified manifest support)
3. **Node.js**: v18 or later
4. **M365 Agents Toolkit**: VS Code extension

### Local Development

```bash
cd platforms/m365-copilot

# Install dependencies
npm install

# Start local dev server
npm run dev-server

# Deploy to Teams (sideload for testing)
npm run deploy:dev
```

### Sideload in Office

**Option 1: Via Teams** (Recommended)

1. Open Teams
2. Go to **Apps** → **Manage your apps**
3. Click **Upload an app** → **Upload a custom app**
4. Select `appPackage/build/appPackage.zip`
5. Click **Add**
6. Close Teams
7. Open Word/Excel/PowerPoint
8. Wait 1-2 minutes for manifest sync
9. Look for **Alex** button in Home ribbon

**Option 2: Via Office** (Direct sideload - Windows only)

1. Open Word/Excel/PowerPoint
2. Go to **Insert** → **Get Add-ins** → **My Add-ins**
3. Click **Upload My Add-in**
4. Select `appPackage/manifest.json`
5. Click **Upload**

### Testing Checklist

- [ ] **Word**: Task pane opens, displays memory status
- [ ] **Excel**: Task pane opens, shows Excel-specific capabilities
- [ ] **PowerPoint**: Task pane opens, shows slide generation options
- [ ] **Outlook**: Task pane opens (desktop + web)
- [ ] **OneDrive Access**: File check shows correct status
- [ ] **UI Responsiveness**: Task pane resizes properly
- [ ] **Icons**: Alex logo displays at 16px, 32px, 80px

---

## Deployment

### AppSource Submission

The unified manifest allows **one submission to AppSource** that deploys to:
- Microsoft Teams
- M365 Copilot
- Outlook
- Word (preview)
- Excel (preview)
- PowerPoint (preview)

**Submission Requirements**:

1. **Manifest Validation**: Pass Teams App Validation tool
2. **Screenshots**: Show task pane in Word/Excel/PowerPoint/Outlook
3. **Privacy Policy**: Updated to mention Office Add-in data access
4. **Terms of Use**: Covers Office Add-in usage
5. **Support**: Help documentation for each Office host

### Admin Deployment

IT admins can deploy via **Microsoft 365 admin center**:

1. Go to **Settings** → **Integrated apps**
2. Click **Upload custom apps**
3. Upload `appPackage.zip`
4. Configure user assignment (individuals, groups, or entire org)
5. Users get Alex in Teams + Office apps automatically

---

## Office.js API Usage

### Current Implementation (Phase 1)

```javascript
// taskpane/taskpane.js

Office.onReady((info) => {
    console.log(`Host: ${info.host}, Platform: ${info.platform}`);
    initializeTaskPane(info);
});

async function checkMemoryAccess() {
    // TODO: Microsoft Graph API calls
    // For MVP, simulates OneDrive file check
}
```

### Planned (Phase 2)

```javascript
// Word: Insert content
await Word.run(async (context) => {
    const body = context.document.body;
    body.insertParagraph(generatedText, Word.InsertLocation.end);
    await context.sync();
});

// Excel: Create chart from learning goals
await Excel.run(async (context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    const chart = sheet.charts.add(Excel.ChartType.line, range);
    await context.sync();
});

// PowerPoint: Generate slide
await PowerPoint.run(async (context) => {
    const slides = context.presentation.slides;
    const slide = slides.add();
    slide.shapes.addTextBox(title);
    await context.sync();
});
```

---

## Host-Specific Capabilities

### Word

| Capability                         | Phase | Description                                   |
| ---------------------------------- | ----- | --------------------------------------------- |
| 📝 Template insertion               | 2     | Generate docs from persona-aware templates    |
| ✍️ Writing assistance               | 2     | Style and tone based on Active Context        |
| 📋 Research summary injection       | 2     | Insert DK-*.md content directly into document |
| 🎯 Focus trifecta document structu | 3     | Organize headings by current focus areas      |

### Excel

| Capability                     | Phase | Description                                 |
| ------------------------------ | ----- | ------------------------------------------- |
| 📊 Learning goal tracker        | 2     | Chart skill progress over time              |
| 📈 Skill development visualize | 2     | Line charts from profile.md learning goals  |
| 🔢 Custom functions (UDFs)      | 3     | `=ALEX.FOCUS()` returns current trifectas   |
| 💡 Data analysis with context   | 2     | Analyze data using focus area as lens       |

### PowerPoint

| Capability                        | Phase | Description                                   |
| --------------------------------- | ----- | --------------------------------------------- |
| 🎨 Slide generation                | 2     | Create slides from focus trifectas            |
| 📊 Project visual summaries        | 2     | Auto-generate timeline/roadmap slides         |
| 🎯 Memory-based presentations      | 2     | Pull insights from notes.md and DK-*.md       |
| ✨ Persona-driven design           | 3     | Slide style adapts to Developer/Teacher/etc.  |

### Outlook

| Capability                    | Phase | Description                                 |
| ----------------------------- | ----- | ------------------------------------------- |
| ✉️ Email drafting              | 2     | Compose with memory-augmented context       |
| 📅 Meeting prep                | 2     | Attendee research from M365 Copilot         |
| 🔍 Conversation search         | 2     | Cognitive search across email threads       |
| ⚡ Quick responses             | 3     | Style-aware reply suggestions               |

---

## Limitations

### Platform Constraints

| Limitation                     | Impact                                             | Workaround                                 |
| ------------------------------ | -------------------------------------------------- | ------------------------------------------ |
| **No LLM built-in**            | Can't generate content without external API        | Use M365 Copilot in task pane (future)     |
| **Web-hosted UI only**         | Requires internet connection                       | Graceful offline message                   |
| **Single-threaded**            | No background processing                           | Show loading spinners during operations    |
| **Limited offline**            | OneDrive API requires connectivity                 | Cache last-known memory state              |
| **No multi-agent support**     | Can't orchestrate Alex sub-agents (Foundry-only)   | Keep task pane simple, link to M365 Copilot |

### Excel-Specific

- **Custom Functions**: Require separate registration (not in Phase 1)
- **Real-time collaboration**: Multi-user awareness needs CoAuthoring API (Phase 3)

### Word-Specific

- **Content controls**: Advanced document generation requires Office.js 1.3+

---

## Security & Privacy

### Data Flow

```
User → Office Add-in Task Pane → Microsoft Graph API → OneDrive/Alex-Memory/ → Display
```

**No data leaves Microsoft 365 ecosystem** — all memory storage is OneDrive.

### Permissions Required

| Permission                  | Scope                 | Justification                       |
| --------------------------- | --------------------- | ----------------------------------- |
| **Files.Read**              | OneDrive              | Read Alex-Memory folder             |
| **Files.ReadWrite** (opt.)  | OneDrive              | Allow Alex to update notes.md       |
| **User.Read**               | Microsoft Graph       | Get user profile (name, email)      |
| **Contacts.Read** (opt.)    | Microsoft Graph       | Meeting attendee research (Outlook) |

Users can **disable capabilities** via M365 admin center:
- Disable OneDrive access → Alex shows "Memory not available" message
- Disable Graph API → Alex works but can't personalize

---

## Roadmap

### Phase 1: MVP ✅ (1 week — COMPLETED)

- [x] Update manifest.json with Office Add-in extension
- [x] Build task pane HTML/JavaScript
- [x] OneDrive memory status display
- [x] Host-specific welcome messages
- [x] Setup instructions

**Target**: v5.7.6 (February 2026)

### Phase 2: Office-Specific Features 📋 (2-3 weeks)

- [ ] Word: Template insertion
- [ ] Excel: Learning goal tracker charts
- [ ] PowerPoint: Slide generation from focus trifectas
- [ ] Outlook: Email drafting with memory context
- [ ] Full chat interface in task pane
- [ ] Microsoft Graph API integration

**Target**: v5.8.x (March 2026)

### Phase 3: Advanced Capabilities 🔮 (future)

- [ ] Real-time collaboration awareness
- [ ] Custom Excel functions (UDFs)
- [ ] Office script automation
- [ ] Cross-app workflows (e.g., Outlook meeting → Word agenda → PowerPoint slides)
- [ ] Voice input integration

**Target**: v6.x (2027)

---

## Troubleshooting

### Task Pane Doesn't Open

**Symptoms**: Click Alex button, nothing happens

**Solutions**:
1. Check Office version: Must be 2304+ for unified manifest
2. Clear Office cache: `%LOCALAPPDATA%\Microsoft\Office\16.0\Wef`
3. Restart Office application
4. Re-sideload manifest

### Memory Status Shows "Not Found"

**Symptoms**: ⚠️ All files show "Not found"

**Solutions**:
1. Check OneDrive folder exists: `OneDrive/Alex-Memory/`
2. Create required files: `profile.md`, `notes.md`, `focus-trifectas.md`
3. Use templates from GitHub
4. Click "Refresh Memory" in task pane

### Icons Not Displaying

**Symptoms**: Blank button in ribbon

**Solutions**:
1. Check icon URLs are accessible (GitHub Pages hosted)
2. Verify `color.png` (192x192) and `outline.png` (32x32) exist
3. Clear browser cache (for web Office)
4. Wait 5-10 minutes for icon cache refresh

---

## References

### Documentation

- [Office Add-ins Overview](https://learn.microsoft.com/office/dev/add-ins/)
- [Unified Manifest for Microsoft 365](https://learn.microsoft.com/office/dev/add-ins/develop/unified-manifest-overview)
- [Office.js API Reference](https://learn.microsoft.com/javascript/api/office)
- [Teams App Manifest Schema](https://learn.microsoft.com/microsoftteams/platform/resources/schema/manifest-schema)

### Alex Resources

- [OFFICE-ADDINS-RESEARCH.md](../../alex_docs/platforms/OFFICE-ADDINS-RESEARCH.md) — Full platform analysis
- [ADR-011](../../alex_docs/decisions/ADR-011-office-addins-m365-integration.md) — Architectural decision record
- [M365 Heir README](README.md) — M365 Copilot declarative agent

---

## Contributing

### Adding New Office-Specific Features

1. **Update Task Pane UI**: Modify `taskpane/taskpane.html`
2. **Add Office.js Logic**: Extend `taskpane/taskpane.js`
3. **Test in All Hosts**: Word, Excel, PowerPoint, Outlook
4. **Update Documentation**: Add to roadmap and this README
5. **Submit PR**: Include screenshots from each host

### Testing Guidelines

- Test on **Windows desktop** (primary platform)
- Test on **Office on the web** (secondary platform)
- Test with **OneDrive personal** and **OneDrive for Business**
- Validate **icon display** at all sizes (16px, 32px, 80px)
- Check **responsive layout** (task pane min width: 320px)

---

**Updated**: 2026-02-15 (v5.7.6 — Phase 1 Complete)  
**Maintainer**: Fabio Correa  
**License**: Apache 2.0
