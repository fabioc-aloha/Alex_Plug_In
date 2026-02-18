# Agent Builder Quick Reference Card

> 2-page cheat sheet for deploying Alex using M365 Copilot Agent Builder UI

---

## 🚀 Quick Deploy (5 Minutes)

### Step-by-Step

1. **Access Agent Builder**
   https://m365.cloud.microsoft/chat → **Create agent**

2. **Configure Tab → Basic Info**
   ```
   Name: Alex
   Description: AI partner with persistent OneDrive memory,
                M365 context awareness, and 100+ cognitive skills.
   ```

3. **Upload Knowledge Files** (Drag & Drop)
   - [x] `skill-quick-reference.md` (100+ cognitive skills)
   - [x] `cognitive-architecture.md` (How Alex works)
   - [x] `alex-protocols.md` (Meditation, dream, focus protocols)
   - [x] `help-commands.md` (Command reference)
   - [x] `pptx-generation.md` (PowerPoint generation)
   - [x] `ux-features.md` (Office add-in features)

   **Wait for green checkmarks** (no "Preparing" labels)

4. **Paste Instructions**
   Copy from: `appPackage/declarativeAgent.json` → `instructions` field
   (Long multi-line JSON string — entire persona + protocols)

5. **Enable Capabilities**
   - [x] OneDrive and SharePoint
   - [x] Web Search
   - [x] Graphic Art
   - [x] Code Interpreter
   - [x] Email
   - [x] Teams Messages
   - [x] People (toggle "Include related content" = ON)
   - [x] Meetings

6. **Add Conversation Starters** (Copy 6 from declarativeAgent.json)
   - ❓ Show me what you can do
   - 👋 Learn about me
   - 📅 Prep for my next meeting
   - 📊 Weekly review
   - ⚖️ Am I overloaded?
   - 🧘 Meditate

7. **Publish**
   Share with → **Anyone in your organization** → **Publish**

---

## 📁 Knowledge Source Files

| File                        | Size   | Purpose                               |
| --------------------------- | ------ | ------------------------------------- |
| `skill-quick-reference.md`  | ~50 KB | All 100+ VS Code skills condensed     |
| `cognitive-architecture.md` | ~20 KB | How Alex thinks and learns            |
| `alex-protocols.md`         | ~30 KB | Meditation, dream, self-actualization |
| `help-commands.md`          | ~15 KB | Command reference for all platforms   |
| `pptx-generation.md`        | ~10 KB | PowerPoint slide generation guide     |
| `ux-features.md`            | ~12 KB | Office add-in feature overview        |

**Location**: `appPackage/knowledge/`
**Total Upload Time**: ~2-3 minutes (depends on internet speed)

---

## 🎯 Capabilities Reference

| Capability      | Toggle Name                          | What Alex Gets                                 |
| --------------- | ------------------------------------ | ---------------------------------------------- |
| OneDrive        | "OneDrive and SharePoint"            | Read Alex-Memory folder (profile.md, notes.md) |
| Email           | "Email"                              | Search Outlook conversations                   |
| Teams           | "Teams messages"                     | Find channel/chat discussions                  |
| People          | "People" + "Include related content" | Look up colleagues + org structure             |
| Meetings        | "Meetings"                           | Calendar awareness, meeting prep               |
| WebSearch       | "Search all websites"                | Research topics online                         |
| GraphicArt      | "Graphic art"                        | Generate images via DALL-E                     |
| CodeInterpreter | "Code interpreter"                   | Run Python code for analysis                   |

---

## 🔒 Security Toggles

| Toggle                         | Location          | Effect                                            |
| ------------------------------ | ----------------- | ------------------------------------------------- |
| **Only use specified sources** | Knowledge section | Restrict to ONLY embedded files (compliance mode) |
| **Search all websites**        | Knowledge section | Allow web search beyond specified sites           |
| **Include related content**    | People capability | Include colleague's work history in lookup        |

**Recommendation**: Leave all toggles OFF for first deployment (default behavior).

---

## 🎨 Conversation Starters

Copy these 6 from `declarativeAgent.json` → `conversation_starters` array:

```json
{
  "title": "❓ Show me what you can do",
  "text": "Help - show me all your commands and features across M365 Copilot, Word, Excel, PowerPoint, and Outlook"
},
{
  "title": "👋 Learn about me",
  "text": "Hey Alex! Look me up - my profile, calendar, who I work with. Get to know me."
},
{
  "title": "📅 Prep for my next meeting",
  "text": "Who am I meeting with next? Look up every attendee and tell me about them."
},
{
  "title": "📊 Weekly review",
  "text": "Let's review my week - meetings, emails, Teams activity, and what I accomplished"
},
{
  "title": "⚖️ Am I overloaded?",
  "text": "Check my calendar - how many meetings do I have? Any back-to-backs? Where's my focus time?"
},
{
  "title": "🧘 Meditate",
  "text": "Let's meditate - consolidate what I learned today into memory"
}
```

**Note**: Agent Builder UI accepts up to 12 conversation starters (v1.6 schema).

---

## ✅ Testing Checklist

After publishing, test these scenarios:

- [ ] **Memory access**: "Read my profile from OneDrive Alex-Memory"
- [ ] **Meeting prep**: "Who am I meeting with next?"
- [ ] **People lookup**: "Tell me about [colleague name]"
- [ ] **Email search**: "Find emails about [topic]"
- [ ] **Teams search**: "What's been discussed in my Teams channels?"
- [ ] **Weekly review**: "Let's do a weekly review"
- [ ] **Help command**: "Help - show me what you can do"
- [ ] **Meditation**: "Let's meditate"

---

## 🚨 Common Issues

| Issue                             | Cause                   | Fix                                     |
| --------------------------------- | ----------------------- | --------------------------------------- |
| Files show "Preparing"            | Still indexing          | Wait 5-10 min, refresh page             |
| Agent doesn't use knowledge files | Files failed upload     | Re-upload, check file size < 512 MB     |
| Can't find OneDrive folder        | Folder not shared       | Share `Alex-Memory` with Copilot        |
| Email/Teams not working           | Capability disabled     | Re-enable in Configure tab              |
| Conversation starters missing     | Not copied              | Add manually from declarativeAgent.json |
| Agent visible but can't install   | Sensitivity label issue | Check extract rights on embedded files  |

---

## 🔄 Updating Alex

### To Update Knowledge Files

1. Agent Builder → **Edit** (your deployed agent)
2. **Configure** tab → **Knowledge** section
3. Click **X** next to old file → **Remove**
4. Drag-drop new version
5. Wait for green checkmark
6. **Publish** changes

### To Update Instructions

1. Edit in `appPackage/declarativeAgent.json`
2. Copy new `instructions` field
3. Agent Builder → **Edit** → **Describe** tab
4. Paste new instructions
5. **Publish** changes

**Version control tip**: Keep declarativeAgent.json as source of truth, manually sync to Agent Builder UI.

---

## 📊 Deployment Comparison

| Method                     | Time   | Difficulty | Version Control | API Plugins |
| -------------------------- | ------ | ---------- | --------------- | ----------- |
| **Agent Builder UI**       | 5 min  | Easy       | ❌ Manual        | ❌ No        |
| **Teams Developer Portal** | 15 min | Medium     | ✅ Git           | ✅ Yes       |
| **M365 Agents Toolkit**    | 30 min | Hard       | ✅ Git           | ✅ Yes       |

**Recommendation**:
- **Prototype**: Agent Builder UI
- **Production**: Teams Developer Portal (code-first)
- **Enterprise**: M365 Agents Toolkit (full CI/CD)

---

## 🔗 Resources

| Resource                     | URL                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| **Agent Builder Full Guide** | [AGENT-BUILDER-GUIDE.md](./AGENT-BUILDER-GUIDE.md)                                          |
| **Deployment Checklist**     | [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)                                        |
| **Microsoft Learn**          | https://learn.microsoft.com/microsoft-365-copilot/extensibility/agent-builder-add-knowledge |
| **Alex M365 Repo**           | https://github.com/fabioc-aloha/Alex_Plug_In/tree/main/platforms/m365-copilot               |

---

**Print this card for quick reference during deployment! 🚀**
