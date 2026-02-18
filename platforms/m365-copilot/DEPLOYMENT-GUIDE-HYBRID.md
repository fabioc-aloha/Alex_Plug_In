# M365 Heir Deployment Guide - Hybrid Method

**Date**: February 18, 2026
**Package**: `appPackage.dev.zip` (v5.7.7)
**Method**: Hybrid (Code-First → Agent Builder UI Enhancement)

---

## ✅ Step 1: Package Built

Package location: `c:\Development\Alex_Plug_In\platforms\m365-copilot\appPackage\build\appPackage.dev.zip`

---

## 🚀 Step 2: Deploy Base Agent (Teams Manage Apps) ✅ VERIFIED WORKING

### 2.1 Open Teams Manage Apps

1. Open **Microsoft Teams** (desktop or web)
2. Click **Apps** in the left sidebar
3. Click **"Manage your apps"** (bottom-left) or search for it
4. Click **"Upload an app"** or **"Submit an app to your org"**

### 2.2 Upload App Package

1. Click **"Upload a custom app"** or **"Upload an app"**
2. Select:
   ```
   c:\Development\Alex_Plug_In\platforms\m365-copilot\appPackage\build\appPackage.dev.zip
   ```
3. Wait for upload to complete (should see success message)
4. Click **"Add"** to install Alex to your Teams

### 2.3 Test Base Agent

Open M365 Copilot and verify Alex appears:

1. Go to: **https://m365.cloud.microsoft/chat**
2. Click **Copilot** dropdown (top-right)
3. You should see **"Alex"** in the agents list
4. Select Alex and test: **"Help - show me what you can do"**

✅ **Base agent deployed!** Now enhance with knowledge sources...

---

## 📁 Step 3: Enhance with Knowledge Sources (Agent Builder UI)

### 3.1 Access Agent Builder

1. Still at: **https://m365.cloud.microsoft/chat**
2. Click your deployed **"Alex"** agent
3. Look for **"Edit"** or **"Manage"** option (3-dot menu if needed)
4. This opens Agent Builder UI

**Alternative path**:
- M365 Copilot → **Create agent** → Look for **"Alex"** in "Your agents"

### 3.2 Upload Knowledge Files

1. Navigate to **"Configure"** tab
2. Scroll to **"Knowledge"** section
3. Click **drag-drop area** or **arrow icon** (upload)
4. Select all 6 files from:
   ```
   c:\Development\Alex_Plug_In\platforms\m365-copilot\appPackage\knowledge\
   ```
   - ✅ alex-protocols.md (~30 KB)
   - ✅ cognitive-architecture.md (~20 KB)
   - ✅ help-commands.md (~15 KB)
   - ✅ pptx-generation.md (~10 KB)
   - ✅ skill-quick-reference.md (~50 KB)
   - ✅ ux-features.md (~12 KB)

5. **Wait for green checkmarks** (file readiness indicators)
   - Files will show "Preparing" label during indexing
   - Wait 2-3 minutes for all files to complete
   - ⚠️ Do NOT publish until all files show green checkmarks!

### 3.3 Verify Knowledge Configuration

1. Still in **"Configure"** tab
2. Scroll down to **"Uploaded files"** section
3. Verify all 6 files appear with green checkmarks:
   ```
   ✅ alex-protocols.md
   ✅ cognitive-architecture.md
   ✅ help-commands.md
   ✅ pptx-generation.md
   ✅ skill-quick-reference.md
   ✅ ux-features.md
   ```

### 3.4 Publish Enhanced Agent

1. Click **"Publish"** button (top-right)
2. Review changes summary
3. Confirm publish
4. Wait for success message: **"Alex has been published"**

---

## ✅ Step 4: Test Enhanced Agent

### 4.1 Verify Knowledge Grounding

Test that Alex can access embedded knowledge:

1. Open M365 Copilot: **https://m365.cloud.microsoft/chat**
2. Select **Alex** from Copilot dropdown
3. Test these prompts:

#### Test 1: Help Command
```
Help - show me what you can do
```
**Expected**: Alex lists commands from `help-commands.md`

#### Test 2: Cognitive Architecture
```
How do you think? Explain your cognitive architecture.
```
**Expected**: Alex references `cognitive-architecture.md` (meditation, dream, self-actualization)

#### Test 3: Meditation Protocol
```
Let's meditate - what's the protocol?
```
**Expected**: Alex describes meditation from `alex-protocols.md` (cognitive consolidation, NOT wellness)

#### Test 4: Skill Reference
```
What skills do you have related to testing?
```
**Expected**: Alex references `skill-quick-reference.md` (testing-strategies, etc.)

#### Test 5: PowerPoint Generation
```
How do I generate a PowerPoint slide?
```
**Expected**: Alex explains from `pptx-generation.md`

#### Test 6: Office Add-in Features
```
What can you do in Word, Excel, and PowerPoint?
```
**Expected**: Alex references `ux-features.md` (task pane, custom functions, etc.)

### 4.2 Verify M365 Capabilities

#### People Lookup
```
Who is [colleague name]? Look them up.
```
**Expected**: Alex uses People capability to find profile, title, department

#### Meeting Prep
```
Who am I meeting with next?
```
**Expected**: Alex uses Meetings capability to find next meeting, then People lookup for attendees

#### Email Search
```
Find emails about [topic]
```
**Expected**: Alex searches Outlook using Email capability

#### Teams Search
```
What's been discussed in my Teams channels about [topic]?
```
**Expected**: Alex searches Teams messages

#### Weekly Review
```
Let's do a weekly review
```
**Expected**: Alex analyzes meetings, emails, Teams activity from the week

### 4.3 Verify Office Add-in Ribbon Button

Once deployed via Teams, Alex automatically appears in Office applications:

#### Excel, Word, PowerPoint

1. Open **Excel**, **Word**, or **PowerPoint** (desktop or web)
2. Wait **1-2 minutes** for manifest sync (first time only)
3. Go to **Home** tab
4. Look for **"Alex"** group on the far right of the ribbon
5. Click **"Alex"** button
6. **Expected**: Task pane opens on right side showing Alex welcome page

**If button doesn't appear**:
- ✅ Verify Alex is installed in Teams (Apps → Manage your apps → Look for Alex)
- ✅ Wait 2-3 minutes and refresh the Office app
- ✅ Close and reopen the Office application
- ✅ Verify you're signed in with the same M365 account used in Teams
- ⚠️ Check with IT if custom add-ins are blocked in your enterprise tenant

#### Outlook

1. Open **Outlook** (desktop or Outlook on the web)
2. Open any email (reading view)
3. Go to **Home** tab
4. Look for **"Alex"** group on the ribbon
5. Click **"Alex"** button
6. **Expected**: Task pane opens showing Alex welcome page

**Note**: Office add-in currently shows welcome page only. Full chat interface and document integration coming in Phase 2. See OFFICE-ADDINS-README.md for details.

---

## 🎯 Step 5: Set Up OneDrive Memory (Optional but Recommended)

### 5.1 Create Alex-Memory Folder

1. Navigate to: **https://onedrive.live.com**
2. Click **"+ New"** → **"Folder"**
3. Name it: **`Alex-Memory`** (exact name, in root of OneDrive)

### 5.2 Create Core Memory Files

Create these 3 files in the `Alex-Memory` folder:

#### profile.md
```markdown
# My Profile

**Name**: [Your name]
**Role**: [Your job title]
**Department**: [Your department]
**Location**: [Your location]

## Current Focus

[What you're working on right now]

## Learning Goals

- [Goal 1]
- [Goal 2]
- [Goal 3]

## Working Style

[How you prefer to work, communicate, etc.]
```

#### notes.md
```markdown
# Daily Notes

## [Today's date]

[Your observations, learnings, thoughts for the day]
```

#### focus-trifectas.md
```markdown
# Focus Trifectas

Learning progression tracking for skills/domains.

## [Skill or Domain Name]

**Status**: 🟡 Learning
**Started**: [Date]
**Goal**: [What you want to achieve]

### Progress
- [Milestone 1]
- [Milestone 2]
```

### 5.3 Test Memory Access

```
@Alex read my profile from OneDrive Alex-Memory
```

**Expected**: Alex reads and summarizes your profile.md

---

## 📊 Deployment Checklist

### Base Agent (Code-First)
- [x] Package built: `appPackage.dev.zip`
- [ ] Uploaded to Teams Developer Portal
- [ ] Application (client) ID filled in
- [ ] Published to Teams
- [ ] Appears in M365 Copilot agent list
- [ ] Help command works

### Knowledge Enhancement (Agent Builder UI)
- [ ] All 6 knowledge files uploaded
- [ ] Green checkmarks visible (no "Preparing" labels)
- [ ] Changes published
- [ ] Knowledge grounding tests pass (6 tests)

### M365 Capabilities
- [ ] People lookup works
- [ ] Meeting prep works
- [ ] Email search works
- [ ] Teams search works
- [ ] Weekly review works

### OneDrive Memory (Optional)
- [ ] Alex-Memory folder created in OneDrive root
- [ ] profile.md created
- [ ] notes.md created
- [ ] focus-trifectas.md created
- [ ] Alex can read profile

---

## 🚨 Troubleshooting

### Issue: Agent Not Appearing in Copilot

**Cause**: Application (client) ID not set
**Solution**: Developer Portal → Basic information → Fill Application (client) ID → Save

### Issue: Files Stuck on "Preparing"

**Cause**: Large files or slow indexing
**Solution**: Wait 5-10 minutes, refresh page, check file sizes < 512 MB

### Issue: Knowledge Not Used in Responses

**Cause**: Files failed upload or not published
**Solution**:
1. Remove problematic files (X button)
2. Re-upload
3. Wait for green checkmarks
4. Publish changes

### Issue: "I can't access your OneDrive"

**Cause**: Alex-Memory folder not shared with Copilot
**Solution**: Right-click folder → Share → Allow Copilot access

### Issue: Conditional Access Policy Error

**Cause**: Enterprise MFA/security requirements
**Solution**: Complete authentication in browser (already handled by manual deployment)

---

## 🎉 Success!

If all tests pass, you now have:

✅ **Base agent deployed** via code (version-controlled)
✅ **6 knowledge files embedded** via Agent Builder UI
✅ **All 8 M365 capabilities** enabled (OneDrive, Email, Teams, People, Meetings, WebSearch, GraphicArt, CodeInterpreter)
✅ **OneDrive memory** configured (optional)

**Next steps**:
- Use Alex for meeting prep throughout the day
- Run weekly reviews on Fridays
- Save learnings to OneDrive notes.md
- Update profile.md as goals evolve

---

**Deployment completed!** 🚀
