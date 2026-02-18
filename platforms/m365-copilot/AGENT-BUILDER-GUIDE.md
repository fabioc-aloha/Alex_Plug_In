# Alex M365 Agent - Agent Builder Enhancement Guide

> Leverage M365 Copilot's native Agent Builder UI to enhance Alex with advanced knowledge sources

**Last Updated**: February 2026
**Agent Builder Documentation**: https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agent-builder-add-knowledge

---

## 🎯 Overview

Microsoft 365 Copilot now includes a **native Agent Builder UI** with visual knowledge source configuration. This guide shows how to enhance the Alex agent using these new capabilities.

**Two Deployment Paths**:

| Path              | Build Tool          | Best For                              | Knowledge Sources   |
| ----------------- | ------------------- | ------------------------------------- | ------------------- |
| **Code-First**    | M365 Agents Toolkit | Developers, full control, API plugins | Manifest-configured |
| **Builder-First** | M365 Copilot UI     | Quick prototyping, embedded files     | Visual drag-drop    |

---

## 🚀 Quick Start: Agent Builder UI

### Access Agent Builder

1. Navigate to https://m365.cloud.microsoft/chat
2. Click **Create agent** (top-right)
3. Choose **Configure** tab for knowledge sources

### Knowledge Source Options

| Type                      | Limit                   | Scoping                   | Use Case                   |
| ------------------------- | ----------------------- | ------------------------- | -------------------------- |
| 📁 **SharePoint/OneDrive** | 100 files               | Site, folder, or file URL | Documentation, policies    |
| 🌐 **Public websites**     | 4 URLs (2 levels)       | None                      | External references        |
| 💬 **Teams chats**         | 5 specific chats or all | By chat/channel           | Project context            |
| 📧 **Outlook emails**      | Entire mailbox          | None                      | Email history              |
| 📎 **Embedded files**      | 20 files                | Upload directly           | Templates, guides          |
| 👥 **People data**         | N/A                     | Include related content   | Org structure              |
| 🔌 **Copilot connectors**  | Varies                  | Connection ID + scope     | Azure DevOps, Jira, GitHub |

---

## 📁 Recommended Knowledge Sources for Alex

### 1. Embedded Files (High Priority)

Upload these files directly in Agent Builder for optimal performance:

| File                        | Purpose                            | Size   | Update Frequency |
| --------------------------- | ---------------------------------- | ------ | ---------------- |
| `skill-quick-reference.md`  | 100+ skill summaries               | ~50 KB | Monthly          |
| `cognitive-architecture.md` | How Alex works                     | ~20 KB | Quarterly        |
| `alex-protocols.md`         | Meditation, dream, focus protocols | ~30 KB | Quarterly        |
| `help-commands.md`          | Command reference                  | ~15 KB | Monthly          |
| `pptx-generation.md`        | PowerPoint generation guide        | ~10 KB | Quarterly        |
| `ux-features.md`            | Office add-in features             | ~12 KB | Monthly          |

**How to Upload**:
1. Agent Builder → **Configure** tab → **Knowledge** section
2. Drag-drop files OR click arrow icon → select files
3. Wait for "Preparing" status to clear (file readiness)
4. Verify green checkmark appears

**Benefits**:
- ✅ Embedded knowledge travels with the agent
- ✅ Users see Alex behavior instantly
- ✅ No SharePoint setup required
- ✅ Faster query response (pre-indexed)

### 2. SharePoint Knowledge Base (Optional)

If your organization has a centralized Alex knowledge base:

```json
{
  "capabilities": [
    {
      "name": "OneDriveAndSharePoint",
      "items_by_url": [
        {
          "url": "https://contoso.sharepoint.com/sites/AlexKnowledge"
        }
      ]
    }
  ]
}
```

**Use when**:
- Multiple users sharing same knowledge base
- IT manages centralized documentation
- Regular updates via SharePoint workflows

### 3. Scoped Copilot Connectors

#### Azure DevOps Integration

**Scenario**: Alex helps with project planning from ADO work items

**Setup**:
1. Admin enables Azure DevOps Work Items connector in M365 Admin Center
2. Agent Builder → **Choose other data sources** → **Azure DevOps Work Items**
3. Add relevant connections
4. **Scope by Area Path**: Select specific area paths (e.g., `/Engineering/Platform`)
5. Save configuration

**Result**: Alex can answer queries like:
- "What work items are in the backlog?"
- "Show me all features assigned to Platform team"
- "What's blocking us this sprint?"

#### GitHub Integration

**Scenario**: Engineering teams using GitHub for code/docs

**Setup**:
1. Admin enables GitHub Cloud Knowledge connector
2. Agent Builder → **Choose other data sources** → **GitHub Cloud Knowledge**
3. **Scope by Repository**: Select specific repos (e.g., `Alex_Plug_In`)
4. Save configuration

**Result**: Alex can help with:
- "What issues are open in the Alex repo?"
- "Show me recent pull requests"
- "Find documentation about deployment"

#### Jira Integration

**Scenario**: Product management using Jira for roadmap tracking

**Setup**:
1. Admin enables Jira connector
2. Agent Builder → **Choose other data sources** → **Jira**
3. **Scope by Project**: Select specific projects (e.g., `ALEX`)
4. Save configuration

**Result**: Alex provides context about:
- Epic status and progress
- Sprint planning insights
- Blocker identification

---

## 🎯 Advanced Configuration

### "Only Use Specified Sources" Toggle

**Purpose**: Restrict Alex to ONLY your knowledge sources for data-sensitive environments.

**Enable When**:
- ✅ Compliance requires no general AI knowledge
- ✅ Proprietary information only
- ✅ Regulatory environments (finance, healthcare, government)

**Behavior**:
- **Search queries** → Only use your knowledge sources
- **General queries** (math, translation) → Still use general AI
- **Not found** → "I can't find that information in the knowledge sources provided"

**How to Enable**:
1. Agent Builder → **Configure** tab
2. Scroll to **Knowledge** section
3. Toggle **"Only use specified sources"** = ON

**Trade-off**:
- ✅ Maximum control over information
- ❌ Alex can't reference general world knowledge for context

### Sensitivity Labels Management

**Automatic Label Inheritance**:
- Agent inherits **highest priority** label from embedded files
- Example: Upload `General.docx` + `Confidential.xlsx` → Agent = Confidential
- Label applies to **embedded content only** (not SharePoint sources)

**User Access Control**:
- Only users with **extract rights** to the label can install/use Alex
- Users without permissions see Alex in store but **cannot install**
- Label doesn't appear on Agent Store listing

**Best Practice**:
1. Review sensitivity labels on all embedded files BEFORE upload
2. Use **lowest necessary label** for widest access
3. Consider separate agents for different security levels:
   - `Alex (General)` - Public knowledge, all employees
   - `Alex (Confidential)` - Internal docs, authorized teams only
   - `Alex (Highly Confidential)` - Executive/legal, restricted access

---

## 🔄 Hybrid Deployment Strategy

**Recommended**: Combine Agents Toolkit (code) + Agent Builder UI (knowledge)

### Step 1: Deploy Base Agent (Agents Toolkit)

```bash
# Build and deploy with M365 Agents Toolkit
npm run package:dev
# Upload to Teams Developer Portal
```

**Result**: Agent with instructions, capabilities, conversation starters defined in code.

### Step 2: Enhance with Knowledge (Agent Builder UI)

1. Open deployed agent in M365 Copilot
2. **Edit** → **Configure** tab
3. Add embedded files (skill references, protocols)
4. Add scoped connectors (if needed)
5. **Publish** changes

**Result**: Code-defined behavior + visually-configured knowledge sources.

### Why This Works

| Aspect                  | Code (Toolkit)       | UI (Builder)    | Winner |
| ----------------------- | -------------------- | --------------- | ------ |
| Version control         | ✅ Git-tracked        | ❌ Manual        | Code   |
| Instructions            | ✅ External file refs | ❌ Inline only   | Code   |
| API plugins             | ✅ Supported          | ❌ Not supported | Code   |
| Embedded files          | ❌ Complex            | ✅ Drag-drop     | UI     |
| Connector scoping       | ❌ Manual JSON        | ✅ Visual picker | UI     |
| File readiness feedback | ❌ None               | ✅ Live status   | UI     |

---

## 📊 Knowledge Source Optimization

### File Size Best Practices

| File Type         | Max Size | Recommended Size | Rationale                         |
| ----------------- | -------- | ---------------- | --------------------------------- |
| Word/PDF/PPT/Text | 512 MB   | < 1 MB           | Faster indexing, better retrieval |
| Excel             | 30 MB    | < 500 KB         | Single sheet works best           |

### Content Structure

**DO**:
- ✅ Use clear headings (Markdown `##`, Word Heading 2/3)
- ✅ Short paragraphs (3-5 sentences)
- ✅ Bullet lists for scanning
- ✅ Tables for structured data
- ✅ Code blocks with language tags

**DON'T**:
- ❌ Long prose without breaks
- ❌ Dense legal text without summaries
- ❌ Multi-sheet Excel workbooks
- ❌ Scanned PDFs (low OCR quality)
- ❌ Password-protected files

### Excel Data Tips

**Optimal Structure**:
```
| Skill Name    | Category      | Description                 | Synapse Count |
| ------------- | ------------- | --------------------------- | ------------- |
| deep-thinking | metacognition | Systematic problem analysis | 8             |
| code-review   | engineering   | Quality gate protocols      | 12            |
```

**Query Examples**:
- "How many skills are in the metacognition category?"
- "What skill has the most synapses?"
- "List all engineering skills"

---

## 🛡️ Security & Compliance

### Information Barriers (IB) Warning

⚠️ **CRITICAL**: Information Barriers NOT supported on embedded files.

**Impact**:
- Any user who can access the agent can see embedded file content
- Use SharePoint/OneDrive sources for IB-protected content
- SharePoint sources respect existing permissions

**Recommendation**:
- **Embedded files**: Public/General knowledge only
- **SharePoint sources**: Sensitive/restricted content

### Unsupported Scenarios

| Scenario                     | Behavior                   | Workaround                |
| ---------------------------- | -------------------------- | ------------------------- |
| Double Key Encryption (DKE)  | File embedded but NOT used | Don't embed DKE files     |
| User-defined permissions     | Agent creation FAILS       | Remove custom permissions |
| Extract rights disabled      | Agent creation FAILS       | Grant extract rights      |
| Cross-tenant encrypted files | Embedded but NOT used      | Use same-tenant files     |
| Password-protected files     | Upload fails with error    | Remove password           |

### Data Residency

✅ **All data stays in M365**:
- Embedded files → Stored in M365 backend
- SharePoint/OneDrive → Existing locations
- User queries/responses → M365 Copilot infrastructure
- No data sent to external services

---

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] Review all embedded files for sensitivity labels
- [ ] Verify file sizes < recommended limits
- [ ] Remove passwords from protected files
- [ ] Test Excel workbooks (single sheet per file)
- [ ] Document scoped connector requirements

### Knowledge Configuration

- [ ] Upload core knowledge files (6 files recommended)
- [ ] Wait for file readiness (green checkmarks)
- [ ] Configure SharePoint sources (if centralized KB exists)
- [ ] Set up scoped connectors (ADO/GitHub/Jira if applicable)
- [ ] Enable "Only use specified sources" (if compliance requires)
- [ ] Test People data inclusion

### Testing

- [ ] Ask general question → Verify knowledge grounding
- [ ] Ask scoped connector question → Verify data access
- [ ] Check sensitivity label behavior → Verify access control
- [ ] Test with user WITHOUT extract rights → Should fail gracefully
- [ ] Verify file readiness after SharePoint rename/delete

### Documentation

- [ ] Document which knowledge sources are configured
- [ ] Note any scoped connector configurations
- [ ] Record sensitivity label decisions
- [ ] Update user guide with agent capabilities
- [ ] Add troubleshooting section for permission issues

---

## 🔧 Troubleshooting

### File Not Appearing as Knowledge Source

**Symptoms**: File uploaded but agent doesn't use it in responses

**Causes**:
1. File still indexing (check for "Preparing" label)
2. Sensitivity label blocks access (check extract rights)
3. Unsupported file type (verify supported formats)
4. File too large (check size limits)

**Solution**:
1. Wait 5-10 minutes for indexing
2. Click reload button in Knowledge section
3. Check file permissions and sensitivity label
4. Try smaller file or different format

### Connector Data Not Accessible

**Symptoms**: Scoped connector added but no results

**Causes**:
1. Admin didn't configure connector in M365 Admin Center
2. User lacks permissions to connector data
3. Scope attribute invalid (wrong project/folder/repo)

**Solution**:
1. Verify connector enabled: M365 Admin Center → Connectors
2. Check user has access to scoped resource (Jira project, ADO area path)
3. Re-scope to valid attribute (search for it in scoping UI)

### "Agent Creation Failed" Error

**Symptoms**: Silent failure after uploading files

**Causes**:
1. User-defined permissions on uploaded file
2. Extract rights disabled on sensitivity label
3. Password protection

**Solution**:
1. Remove problematic files one by one
2. Check each file's sensitivity label (right-click → Properties)
3. Remove passwords before upload

---

## 📚 Related Documentation

| Resource                             | URL                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Add Knowledge Sources (MS Learn)** | https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agent-builder-add-knowledge |
| **Knowledge Sources Overview**       | https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/knowledge-sources           |
| **Copilot Connectors Gallery**       | https://learn.microsoft.com/en-us/microsoftsearch/connectors-gallery                              |
| **Declarative Agent Reference**      | [DECLARATIVE-AGENT-REFERENCE.md](./docs/DECLARATIVE-AGENT-REFERENCE.md)                           |
| **Deployment Checklist**             | [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)                                              |

---

## 🎓 Key Takeaways

1. **Embedded files (up to 20)** are the fastest way to ground Alex in custom knowledge
2. **Scoped connectors** bring live external data (ADO, Jira, GitHub) into Alex's context
3. **"Only use specified sources"** provides strict knowledge control for compliance
4. **Sensitivity labels** automatically control who can install/use Alex
5. **Hybrid deployment** (code + UI) gives best of both worlds
6. **Information Barriers NOT supported** on embedded files — use SharePoint for IB content

---

**🚀 Ready to enhance your Alex agent? Start with embedded files, then layer in connectors as needed!**
