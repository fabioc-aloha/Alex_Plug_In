# M365 Full Integration Guide — Copilot + Office Add-ins

**Version**: v5.7.7
**Last Updated**: 2026-02-16
**Deployment**: GitHub Pages + M365 Developer Portal

---

## Integration Architecture

Alex for M365 provides **two integration surfaces**:

### 1️⃣ M365 Copilot Declarative Agent

**What**: Conversational AI agent in M365 Copilot chat interface
**Access**: https://m365.cloud.microsoft/chat → Agents dropdown → "Alex"
**Features**:
- OneDrive memory integration (profile.md, notes.md, focus-trifectas.md)
- Persona-aware conversations
- 100+ VS Code skills accessible via synapses
- Weekly reviews, meeting prep, focus sessions

**Requires**: M365 Copilot license

### 2️⃣ Office Add-ins (Word, Excel, PowerPoint, Outlook)

**What**: Task pane UI in Office applications with memory-augmented features
**Access**: Home ribbon → "Alex" button → Task pane opens
**Features**:
- **Word**: Memory-based templates (research, meeting notes, articles)
- **Excel**: Custom functions (SKILLLEVEL, GOALSTATUS, NEXTSTEP), goal trackers
- **PowerPoint**: Trifecta slide generation, architecture diagrams
- **Outlook**: Smart email replies (Professional/Casual/Brief), meeting extraction

**Requires**: Microsoft 365 apps (E3/E5 license or M365 Apps for Business)

---

## Deployment Components

### Unified Manifest (`appPackage/manifest.json`)

**Single file deploys to**:
- ✅ Microsoft Teams (staticTabs)
- ✅ M365 Copilot (copilotAgents)
- ✅ Word/Excel/PowerPoint/Outlook (extensions)

**Schema**: v1.19 (Teams manifest with Office extensions)

### GitHub Pages Hosting

**Required for**: Office Add-in task panes
**Base URL**: https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/

**Hosted Files**:
```
docs/platforms/m365-copilot/
├── index.html (landing page)
├── taskpane/
│   ├── taskpane.html (main UI)
│   ├── taskpane.js (initialization)
│   ├── office-operations.js (Office.js APIs)
│   ├── custom-functions.js (Excel functions)
│   ├── action-panel.js (host-specific actions)
│   └── functions.json (Excel metadata)
└── appPackage/
    ├── color.png (192x192 icon)
    ├── outline.png (32x32 icon)
    └── *.svg (vector icons)
```

### OneDrive Memory Integration

**Shared across both surfaces**:

**Memory Folder**: `OneDrive/Alex-Memory/`

**Required Files**:
1. **profile.md** — Name, role, goals, current focus
2. **focus-trifectas.md** — Learning skills with progress tracking
3. **notes.md** — Daily context, insights, observations

**Access**: Microsoft Graph API with Files.Read permission

---

## Complete Deployment Workflow

### Phase 1: Deploy to GitHub Pages ✅ DONE

```powershell
# Already completed — files are in docs/ folder
cd platforms/m365-copilot

# Verify files copied
Get-ChildItem docs/platforms/m365-copilot -Recurse -File

# Commit and push
git add docs/platforms/m365-copilot/
git commit -m "deploy: Office Add-in taskpane to GitHub Pages"
git push

# Wait 2-3 minutes for GitHub Pages CDN
```

**Verify**:
```powershell
.\verify-github-pages.ps1
```

**Expected**: All 9 URLs return HTTP 200

---

### Phase 2: Upload Package to M365

**Option A: Developer Portal** (Recommended)

1. Go to: https://dev.teams.microsoft.com/apps
2. Sign in with M365 account
3. Click **"Apps"** → **"Import app"**
4. Select: `appPackage/build/appPackage.dev.zip`
5. Click **"Preview in Teams"**
6. Click **"Add"** to install

**Option B: Teams Direct Upload**

1. Go to: https://teams.microsoft.com
2. **Apps** → **"Manage your apps"**
3. **"Upload an app"** → **"Upload a custom app"**
4. Select: `appPackage/build/appPackage.dev.zip`
5. Click **"Add"**

---

### Phase 3: Setup OneDrive Memory

**Critical for full functionality**:

1. Navigate to OneDrive: https://onedrive.live.com or File Explorer
2. Create folder: `Alex-Memory`
3. Create `profile.md`:
   ```markdown
   # My Profile

   Name: Your Name
   Role: Your Job Title
   Goals: What you're working toward
   Current Focus: This week's priorities
   ```

4. Create `focus-trifectas.md`:
   ```markdown
   # Focus Trifectas

   ## Q1 2026 - Web Development
   1. **React Hooks** (Beginner → Advanced, 40%)
      Next: Complete useEffect tutorial
   2. **TypeScript Generics** (Intermediate → Expert, 25%)
      Next: Practice utility types
   3. **Testing with Jest** (Beginner → Intermediate, 60%)
      Next: Write integration tests
   ```

5. Create `notes.md`:
   ```markdown
   # Daily Notes

   ## 2026-02-16
   - Testing Alex M365 integration
   - Key insight: Memory enables personalization
   - Tomorrow: Try focus session workflow
   ```

---

## Integration Testing Checklist

### M365 Copilot Agent

| Test              | Command                           | Expected Result                            | Status |
| ----------------- | --------------------------------- | ------------------------------------------ | ------ |
| **Agent loads**   | Open M365 Copilot → Select "Alex" | No errors, conversation starters appear    | ⬜      |
| **Memory recall** | "What's my name?"                 | Returns name from profile.md               | ⬜      |
| **Goal tracking** | "What am I learning?"             | Lists focus trifectas                      | ⬜      |
| **Weekly review** | "Give me a weekly review"         | Summarizes meetings, emails, progress      | ⬜      |
| **Meeting prep**  | "Prep for meeting with [person]"  | Provides attendee research, talking points | ⬜      |

### Word Add-in

| Test                   | Action                   | Expected Result                          | Status |
| ---------------------- | ------------------------ | ---------------------------------------- | ------ |
| **Button appears**     | Open Word → Home tab     | "Alex" button in ribbon                  | ⬜      |
| **Task pane loads**    | Click "Alex" button      | Task pane opens, no errors               | ⬜      |
| **Template insert**    | Click "Research Summary" | Document content inserted with your name | ⬜      |
| **Memory integration** | Check inserted name      | Matches profile.md                       | ⬜      |

### Excel Add-in

| Test                | Action                              | Expected Result                             | Status |
| ------------------- | ----------------------------------- | ------------------------------------------- | ------ |
| **Custom function** | Type `=ALEX.SKILLLEVEL("React")`    | Returns skill level from focus-trifectas.md | ⬜      |
| **Goal status**     | Type `=ALEX.GOALSTATUS("React")`    | Returns 0.4 (40% progress)                  | ⬜      |
| **Memory query**    | Type `=ALEX.MEMORYQUERY("my name")` | Returns name from profile.md                | ⬜      |
| **Goals tracker**   | Click "Create Goals Tracker"        | Table created with 3 skills                 | ⬜      |

### PowerPoint Add-in

| Test                 | Action                          | Expected Result                     | Status |
| -------------------- | ------------------------------- | ----------------------------------- | ------ |
| **Button appears**   | Open PowerPoint → Home tab      | "Alex" button in ribbon             | ⬜      |
| **Slide generation** | Click "Generate Trifecta Slide" | 4 slides created (title + 3 skills) | ⬜      |
| **Content accuracy** | Review slides                   | Skills match focus-trifectas.md     | ⬜      |

### Outlook Add-in

| Test                    | Action                                                      | Expected Result                | Status |
| ----------------------- | ----------------------------------------------------------- | ------------------------------ | ------ |
| **Button appears**      | Open Outlook → Mail ribbon                                  | "Alex" button visible          | ⬜      |
| **Smart replies**       | Open email → Click "Generate Smart Replies"                 | 3 tone options displayed       | ⬜      |
| **Sentiment detection** | Test with urgent email                                      | Correctly identifies sentiment | ⬜      |
| **Meeting extraction**  | Email with "meet on Monday at 2pm" → Click "Create Meeting" | Parses date/time correctly     | ⬜      |

---

## Troubleshooting Integration Issues

### GitHub Pages Not Loading

**Symptom**: Task pane shows 404 error or blank screen

**Diagnosis**:
```powershell
.\verify-github-pages.ps1
```

**Fix**:
```powershell
# Redeploy to GitHub Pages
.\deploy-to-github-pages.ps1 -Commit
git push

# Wait 2-3 minutes, then verify
.\verify-github-pages.ps1
```

---

### Manifest Validation Errors

**Symptom**: Upload rejected with "Invalid manifest"

**Fix**:
1. Validate manifest: https://dev.teams.microsoft.com/validation
2. Upload `appPackage/build/appPackage.dev.zip`
3. Review validation report
4. Fix errors in `appPackage/manifest.json`
5. Rebuild: `npm run package:dev`
6. Retry upload

---

### Office Add-in Button Not Appearing

**Symptom**: No "Alex" button in Word/Excel/PowerPoint/Outlook ribbon

**Possible Causes**:
1. Package not installed in M365
2. Office app not restarted after install
3. Manifest missing Office extensions

**Fix**:
1. Verify M365 app installed (Teams → Apps → Manage apps → Look for "Alex")
2. Restart Office application completely
3. Check manifest has `extensions` array with Office hosts
4. Re-upload package if manifest was edited

---

### OneDrive Memory Not Loading

**Symptom**: Task pane shows "Memory not available" warning

**Fix**:
1. Verify OneDrive folder exists: `OneDrive/Alex-Memory/`
2. Check files present: profile.md, focus-trifectas.md, notes.md
3. Grant OneDrive permissions when prompted
4. Check internet connection (Graph API requires network access)
5. Refresh task pane (close and reopen)

---

### Custom Functions Show #ERROR

**Symptom**: Excel formula `=ALEX.SKILLLEVEL("React")` returns `#ERROR`

**Fix**:
1. Check focus-trifectas.md exists in OneDrive
2. Verify skill name spelling matches file exactly
3. Wait 60 seconds for cache to expire
4. Verify internet connection (needs OneDrive access)
5. Check Office Online vs Desktop (custom functions more reliable in desktop)

---

## Integration Benefits

### Synergistic Features

**M365 Copilot + Office Add-ins working together**:

1. **Consistent Memory**: Same OneDrive folder used by both surfaces
2. **Persona Awareness**: Copilot detects role → Office templates adapt
3. **Cross-App Workflows**:
   - Copilot conversation → Generates insights
   - Excel → Tracks progress with custom functions
   - PowerPoint → Visualizes trifectas in slides
   - Word → Documents learnings in templates

4. **Synaptic Connections**: 29 VS Code skills accessible from both surfaces

---

## Performance Benchmarks

### Expected Response Times

| Operation            | Surface            | Expected Time |
| -------------------- | ------------------ | ------------- |
| **Agent greeting**   | M365 Copilot       | <1 second     |
| **Memory recall**    | M365 Copilot       | 1-2 seconds   |
| **Task pane open**   | Office Add-in      | <1 second     |
| **Template insert**  | Word               | 1-2 seconds   |
| **Custom function**  | Excel (first call) | 2-4 seconds   |
| **Custom function**  | Excel (cached)     | <1 second     |
| **Slide generation** | PowerPoint         | 3-5 seconds   |
| **Smart replies**    | Outlook            | 2-4 seconds   |

**If slower**:
- Check internet connection
- Verify OneDrive sync status
- Clear Office cache
- Restart Office application

---

## Security & Permissions

### Required Permissions

| Permission     | Scope           | Used By             | Purpose                              |
| -------------- | --------------- | ------------------- | ------------------------------------ |
| **Files.Read** | OneDrive        | Both                | Read Alex-Memory folder              |
| **User.Read**  | Microsoft Graph | Both                | Get user name/email                  |
| **Mailbox**    | Outlook         | Outlook Add-in only | Read email content for smart replies |

### Data Flow

```
User's OneDrive (Alex-Memory/)
        ↓
Microsoft Graph API (OAuth 2.0)
        ↓
Alex M365 Integration
   ↙         ↘
M365 Copilot   Office Add-ins
  (Chat)      (Task Panes)
```

**No external servers**: All processing happens client-side in M365 environment

**No data storage**: Memory files stay in your OneDrive, you control access

---

## Maintenance & Updates

### Updating Office Add-in Code

```powershell
# 1. Edit source files
code platforms/m365-copilot/taskpane/office-operations.js

# 2. Deploy to GitHub Pages
.\deploy-to-github-pages.ps1 -Commit
git push

# 3. Wait 2-3 minutes for CDN update

# 4. Users: Hard refresh (Ctrl+F5) or restart Office app
```

**No manifest changes?** → No need to re-upload package, just update GitHub Pages

**Manifest changed?** → Rebuild package and re-upload:
```powershell
npm run package:dev
# Upload appPackage/build/appPackage.dev.zip to Developer Portal
```

### Versioning Strategy

- **Manifest version**: Increment in `manifest.json` → `"version": "5.7.8"`
- **Package rebuild**: `npm run package:dev`
- **GitHub Pages**: Always latest code (no versioning)

---

## Next Steps

### Phase 4 Roadmap (Future Enhancements)

1. **Mermaid Rendering**: Client-side SVG generation from Mermaid code
2. **PowerPoint Animations**: OOXML injection for actual animation effects
3. **NLP Sentiment Analysis**: Replace keyword-based with context-aware NLP
4. **Offline Support**: Service worker caching for task pane files
5. **Test Coverage**: Jest + Office.js mocks for automated testing

### Marketplace Publication

**When ready for public release**:

1. Fix critical issues from QA report (C1: broken paths, C2: timezone bug)
2. Complete test coverage
3. Add telemetry (Application Insights)
4. Submit to AppSource: https://appsource.microsoft.com

**Approval timeline**: 2-4 weeks

---

## Resources

| Resource                  | URL                                                                 |
| ------------------------- | ------------------------------------------------------------------- |
| **M365 Developer Portal** | https://dev.teams.microsoft.com/apps                                |
| **Teams Toolkit**         | https://aka.ms/teams-toolkit                                        |
| **Office Add-ins Docs**   | https://learn.microsoft.com/office/dev/add-ins/                     |
| **GitHub Pages Hosting**  | https://fabioc-aloha.github.io/Alex_Plug_In/platforms/m365-copilot/ |
| **User Manual**           | [USER-MANUAL.md](./USER-MANUAL.md)                                  |
| **QA Report**             | [M365-QA-REPORT-2026-02-16.md](./M365-QA-REPORT-2026-02-16.md)      |
| **Quick Deploy**          | [QUICK-DEPLOY.md](./QUICK-DEPLOY.md)                                |

---

**Status**: ✅ Fully Integrated
**M365 Copilot**: Declarative agent deployed
**Office Add-ins**: GitHub Pages hosted, ready for upload
**OneDrive Memory**: Shared across all surfaces
**Version**: v5.7.7
**Last Updated**: 2026-02-16

🚀 **Strap a rocket to your back — in M365 Copilot AND Office apps!**
