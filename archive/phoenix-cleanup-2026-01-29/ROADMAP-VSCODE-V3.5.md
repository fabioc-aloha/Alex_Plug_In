# Alex VS Code Extension → v3.5.0 TRITRSEPTIUM-PENT Roadmap

> **Phoenix Rising: Stabilization & Quick Wins Before v4.0**

| | |
|---|---|
| **Target Version** | 3.5.0 TRITRSEPTIUM-PENT |
| **Codename** | 🔥 **Phoenix** (Rising from the ashes of restructure) |
| **Status** | ✅ Pre-Release Published (3.5.1) |
| **Foundation** | v3.4.3 TRITRSEPTIUM-QUAD (Current) |
| **Created** | 2026-01-29 |
| **Target VS Code** | 1.108+ (confirmed compatible) |
| **Next Major** | v4.0.0 QUADRUNIUM (Epistemic Integrity) |

---

## 🎯 Vision: Stabilize & Prepare

Version 3.5 is a **transition release** that:

1. **Stabilizes** — Fix pending bugs and technical debt from v3.4.x
2. **Leverages** — Quick wins from VS Code 1.108+ Copilot API features
3. **Prepares** — Lay groundwork for v4.0's epistemic integrity paradigm
4. **Delivers** — User-requested features that don't require major architecture changes

### Why 3.5.0 Before 4.0.0?

- v4.0 represents a paradigm shift (epistemic integrity) requiring careful implementation
- Several quick wins can be shipped immediately
- Users have requested features (configurable storage) that don't require v4.0
- VS Code 1.108 introduced features that benefit Alex now

---

## 🔍 Fact-Check Findings (2026-01-29)

| Feature | Finding | Impact |
|---------|---------|--------|
| Follow-up Provider | **Already implemented** in `participant.ts` | -2 days |
| Tool Confirmation | `prepareInvocation()` exists, extend only | -0.5 days |
| Participant Detection | `disambiguation` exists, add epistemic category | -1.5 days |
| Tool Annotations | `readOnlyHint` API needs verification | ⚠️ Risk |
| Agent Skills | No `.github/skills/` exists yet | +1 day (creation vs validation) |
| DOMPurify | Already in `package-lock.json` | ✅ Ready |

---

## 📋 Implementation Tracker

### 🔴 P0: Critical Fixes (Ship Immediately)

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 1 | Webview HTML Sanitization | ✅ | 1d | Sanitize dream report data to prevent XSS |
| 2 | JSON Schema Validation | ✅ | 1d | Validate user-profile.json and knowledge index |
| 3 | Error Recovery Improvements | ✅ | 1d | Better handling of corrupted config files |

### 🟠 P1: High-Value Quick Wins (VS Code 1.108+ Features)

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 4 | Tool Annotations | ✅ | 1d | Add `readOnlyHint` to read-only tools for auto-approval |
| 5 | Tool Confirmation Messages | ✅ | 0.5d | Extend existing `prepareInvocation()` to remaining tools |
| 6 | Participant Detection | ✅ | 0.5d | Add `epistemic` category to existing disambiguation config |
| 7 | Follow-up Provider | ✅ | 0d | **Already implemented** in `participant.ts` (15+ command templates) |
| 8 | Agent Skills Creation | ✅ | 2d | Create `.github/skills/` with SKILL.md files for Alex capabilities |
| 8b | Architecture Sync Gap Fix | ✅ | 0.5d | Fixed missing root-level docs in sync script (gap analysis verified) |
| 8c | Setup Environment Command | ✅ | 1d | **NEW** UI command to optimize VS Code settings for Alex |

> **Note on #5**: All mutating tools have confirmation messages. UserProfileTool intentionally omitted (low-risk preference updates).

> **Note on #8**: Also created `sync-architecture.ps1` script to fix packaging gap - architecture files from root `.github/` now sync to extension's `.github/` before publishing.
>
> **Note on #8b**: Gap analysis vs v3.3.7 revealed 5 essential docs missing from sync. Fixed: `alex-cognitive-architecture.md`, `ALEX-INTEGRATION.md`, `ASSISTANT-COMPATIBILITY.md`, `PROJECT-TYPE-TEMPLATES.md`, `VALIDATION-SUITE.md`. Extension now has 65 files with all essentials + 6 new enhancements.
>
> **Note on #8c**: New `alex.setupEnvironment` command with tiered settings (Essential/Recommended/Nice-to-Have). Auto-offered during initialize/upgrade. Additive-only, never modifies existing settings. Domain knowledge documented in `DK-RECOMMENDED-ENVIRONMENT.md`.

### 🟡 P2: User-Requested Features

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 9 | Configurable Storage Paths | ⬜ | 3d | `alex.storagePath` setting for OneDrive/cloud storage |
| 10 | `/forget <topic>` Command | ⬜ | 2d | Selective memory cleanup (documented but not implemented) |
| 11 | `/help` Command | ⬜ | 1d | Discoverable command listing with descriptions |
| 12 | Knowledge Export | ⬜ | 2d | Export to Obsidian/plain markdown format |
| 13 | Insight Deduplication | ⬜ | 2d | Prevent similar insights from proliferating |

### ⚙️ P2a: Settings Panel (v3.5.2 Target)

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 9a | Settings Panel Webview | ⬜ | 1d | Create `src/views/settingsPanel.ts` with unified UI |
| 9b | VS Code Settings Schema | ⬜ | 0.5d | Add `alex.*` configuration in package.json |
| 9c | Storage Path Configuration | ⬜ | 1d | Integrate P2 #9 into settings panel |
| 9d | Confirmation Toggles | ⬜ | 0.5d | Per-tool confirmation enable/disable |
| 9e | Cloud Sync Controls | ⬜ | 0.5d | Interval, enable/disable, Gist management |
| 9f | Personalization Integration | ⬜ | 0.5d | Quick profile edit from settings |

> **Note**: Settings Panel consolidates P2 #9 (Storage Paths) and adds user-requested confirmation controls. Total effort: 4.5d.
>
> **Settings Schema Preview:**
> ```json
> {
>   "alex.storagePath": "Custom global knowledge path",
>   "alex.cloudSync.enabled": true,
>   "alex.cloudSync.intervalMinutes": 5,
>   "alex.confirmations.cloudSync": true,
>   "alex.confirmations.saveInsight": true,
>   "alex.confirmations.promote": true,
>   "alex.telemetry.enabled": true
> }
> ```

### 🟢 P3: Technical Debt Payoff

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 14 | Magic Numbers → Constants | ⬜ | 0.5d | Move BACKGROUND_SYNC_INTERVAL_MS, MAX_BUFFER_SIZE to constants.ts |
| 15 | Async Pattern Consistency | ⬜ | 1d | Standardize on async/await over .then().catch() |
| 16 | JSDoc Coverage | ⬜ | 2d | Add documentation to public functions |
| 17 | Extension ID Constant | ⬜ | 0.5d | Move hardcoded extension ID to constants |
| 18 | Unit Test Expansion | ⬜ | 3d | Expand coverage for tools.ts and cloudSync.ts |

### 🔵 P4: Documentation & Preparation for v4.0

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 19 | DK-APPROPRIATE-RELIANCE v1.5 | ⬜ | 1d | Preliminary update with key AETHER concepts |
| 20 | Confidence Expression Guidelines | ⬜ | 1d | Document patterns for v4.0 implementation |
| 21 | Update copilot-instructions.md | ⬜ | 0.5d | Add preliminary epistemic guidance |
| 22 | Architecture Diagrams | ⬜ | 1d | Visual docs for v4.0 planning |

**Legend:** ⬜ Not Started | 🔄 In Progress | ✅ Complete

**v3.5.0 Tasks: 9/22 complete** *(P0 complete, P1 complete)*

---

## 🎯 Feature Specifications

### 1. Webview HTML Sanitization (P0 - Security) ✅ IMPLEMENTED

**Problem:** Dream report data rendered directly in webview without sanitization.

**Solution:** Created centralized `src/shared/sanitize.ts` with:
- `escapeHtml()` - HTML entity encoding for XSS prevention
- `sanitizeAttribute()` - Safe attribute value encoding
- `sanitizeUrl()` - Blocks javascript:/data: URLs
- `sanitizeFilePath()` - Prevents path traversal

**Files Updated:**
- `src/shared/sanitize.ts` (new)
- `src/views/healthDashboard.ts` - Uses centralized escapeHtml
- `src/views/welcomeView.ts` - Uses centralized escapeHtml

### 2-3. JSON Schema Validation & Error Recovery (P0) ✅ IMPLEMENTED

**Solution:** Added to `src/shared/sanitize.ts`:
- `validateUserProfile()` - Schema validation with sanitization
- `validateKnowledgeIndex()` - Index entry validation
- `safeJsonParse()` - JSON parsing with auto-recovery for:
  - BOM removal
  - Trailing comma cleanup
  - Unquoted key repair
- `createConfigBackup()` - Backup before destructive operations

**Files Updated:**
- `src/chat/tools.ts` - Profile loading now validates and recovers

### 4. Tool Annotations (P1 - Quick Win) ✅ IMPLEMENTED

**Goal:** Mark read-only tools for auto-approval in agent mode.

**Implementation:**
```json
// package.json - languageModelTools section
{
  "name": "alex_synapse_health",
  "annotations": {
    "readOnlyHint": true,
    "title": "Check Synapse Health"
  }
}
```

**Tools to annotate as read-only:**
- `alex_synapse_health` ✅
- `alex_memory_search` ✅
- `alex_global_knowledge_search` ✅
- `alex_global_knowledge_status` ✅
- `alex_architecture_status` ✅

**Tools requiring confirmation (NOT read-only):**
- `alex_dream_maintenance` — Modifies files
- `alex_cloud_sync` — Uploads data
- `alex_promote_knowledge` — Creates files
- `alex_save_insight` — Creates files
- `alex_self_actualization` — Modifies architecture

### 5. Tool Confirmation Messages (P1 - Quick Win)

**Goal:** Extend existing `prepareInvocation()` to remaining mutating tools.

**Current State:** `SynapseHealthTool` already has confirmation. Need to add to:
- `DreamMaintenanceTool`
- `CloudSyncTool`
- `PromoteKnowledgeTool`
- `SaveInsightTool`
- `SelfActualizationTool`

**Implementation Pattern (already exists in tools.ts):**
```typescript
// src/chat/tools.ts - prepareInvocation method
async prepareInvocation(
  options: vscode.LanguageModelToolInvocationPrepareOptions<IDreamParams>,
  token: vscode.CancellationToken
) {
  return {
    invocationMessage: 'Running dream maintenance...',
    confirmationMessages: {
      title: 'Alex: Dream Maintenance',
      message: new vscode.MarkdownString(
        `**This will:**\n` +
        `- Validate synapse connections\n` +
        `- Repair broken links\n` +
        `- Generate health report\n\n` +
        `Proceed?`
      ),
    },
  };
}
```

### 6. Participant Detection (P1 - Partial)

**Goal:** Add `epistemic` category to existing disambiguation config.

**Current State:** `package.json` already has `cognitive_architecture`, `azure_development`, `m365_development` categories.

**What to Add:**
```json
// package.json - ADD to existing disambiguation array
{
  "category": "epistemic",
  "description": "Questions about confidence, verification, appropriate reliance",
  "examples": [
    "How confident should I be in this?",
    "Should I verify this?",
    "What's your confidence level?"
  ]
}
```

**Existing Implementation (for reference):**
```json
// package.json - chatParticipants section (ALREADY EXISTS)
{
  "id": "alex-cognitive-architecture.alex",
  "name": "alex",
  "fullName": "Alex Cognitive Architecture",
  "description": "Your AI learning partner with meta-cognitive awareness",
  "disambiguation": [
    {
      "category": "cognitive_architecture",
      "description": "Questions about learning, memory consolidation, knowledge management, neural maintenance, synapses, meditation, dreams, or cognitive processes",
      "examples": [
        "How do I consolidate my learnings?",
        "Can you help me meditate on what I learned?",
        "Run a health check on the architecture",
        "What insights have I saved?",
        "Search my global knowledge"
      ]
    },
    {
      "category": "epistemic",
      "description": "Questions about confidence, verification, appropriate reliance, or when to trust AI output",
      "examples": [
        "How confident should I be in this?",
        "Should I verify this?",
        "Is this something I should double-check?",
        "What's your confidence level?"
      ]
    }
  ]
}
```

### 7. Follow-up Provider (P1 - ✅ ALREADY COMPLETE)

**Status:** Fully implemented in `src/chat/participant.ts` lines 1607-1735.

**Existing Implementation:**
- 15+ command-specific follow-up templates
- Covers: meditate, dream, learn, azure, m365, profile, selfactualize, knowledge, saveinsight, promote, knowledgestatus, greeting, general
- Already registered via `alex.followupProvider = alexFollowupProvider`

**Reference (no changes needed):**
```typescript
// src/chat/participant.ts - ALREADY EXISTS
alex.followupProvider = {
  provideFollowups(
    result: IAlexChatResult,
    context: vscode.ChatContext,
    token: vscode.CancellationToken
  ): vscode.ChatFollowup[] {
    const followups: vscode.ChatFollowup[] = [];

    // After knowledge-related responses
    if (result.metadata?.category === 'knowledge') {
      followups.push({
        prompt: 'Would you like to save this as an insight?',
        label: '💡 Save as Insight'
      });
    }

    // After code-related responses
    if (result.metadata?.category === 'code') {
      followups.push({
        prompt: 'Should I search my knowledge for related patterns?',
        label: '🔍 Find Related Patterns'
      });
    }

    // After health check
    if (result.metadata?.command === 'health') {
      followups.push({
        prompt: 'Run dream maintenance to fix issues?',
        label: '🌙 Run Dream Maintenance'
      });
    }

    // Epistemic follow-ups (groundwork for v4.0)
    if (result.metadata?.containsUncertainty) {
      followups.push({
        prompt: 'Would you like me to verify this?',
        label: '✓ Request Verification'
      });
    }

    return followups;
  }
};
```

### 8c. Setup Environment Command (P1 - User Experience) ✅ IMPLEMENTED

**Goal:** Provide a safe, opt-in way to optimize VS Code settings for Alex functionality.

**Problem Addressed:**
- New users often have suboptimal VS Code settings for AI/Copilot workflows
- Essential settings like `chat.instructionsFilesLocations` must be enabled for Alex
- Users don't want their existing settings modified without consent

**Solution:** Created `src/commands/setupEnvironment.ts` with:

**Tiered Settings:**
```typescript
// Essential (Required for Alex)
const ESSENTIAL_SETTINGS = {
  'chat.instructionsFilesLocations': { '.github/instructions': true },
  'chat.useAgentSkills': true,
  'chat.useNestedAgentsMdFiles': true,
  'github.copilot.chat.tools.memory.enabled': true
};

// Recommended (Improves Experience)
const RECOMMENDED_SETTINGS = {
  'github.copilot.chat.agent.thinkingTool': true,
  'chat.agent.maxRequests': 50,
  'chat.experimental.detectParticipant.enabled': true,
  'github.copilot.chat.followUps': 'always',
  'chat.agent.todoList': { 'position': 'panel' }
};

// Nice-to-Have (Quality of Life)
const NICE_TO_HAVE_SETTINGS = {
  'chat.tools.autoRun': true,
  'chat.tools.fileSystem.autoApprove': true,
  'github.copilot.chat.localeOverride': 'en',
  'chat.commandCenter.enabled': true
};
```

**Safety Guarantees:**
1. **Additive only** — Never modifies or removes existing settings
2. **Preview first** — Shows exact JSON before applying
3. **User choice** — Multi-select for which categories to apply
4. **Skip detection** — Ignores settings already configured

**Integration Points:**
- Command Palette: `Alex: Setup Environment`
- Status bar quick actions menu
- Auto-offered during `alex.initialize` (after installation)
- Auto-offered during `alex.upgrade` (after version upgrade)

**Files Created/Updated:**
- `src/commands/setupEnvironment.ts` (new)
- `src/extension.ts` — Command registration + status bar menu
- `src/commands/initialize.ts` — Offer after init
- `src/commands/upgrade.ts` — Offer after upgrade
- `package.json` — New command `alex.setupEnvironment`
- `.github/domain-knowledge/DK-RECOMMENDED-ENVIRONMENT.md` (new)
- `.github/prompts/alex-initialization.prompt.md` — Phase 5 added

**Analysis Artifacts:** Archived in `archive/analysis/environment-audit-2026-01-29/`

### 9. Configurable Storage Paths (P2 - User Request)

**Goal:** Allow users to store global knowledge in cloud-synced folders.

**Settings Schema:**
```json
{
  "alex.storagePath": {
    "type": "string",
    "default": "",
    "description": "Custom path for Alex global knowledge storage. Leave empty for default (~/.alex/). Supports OneDrive, Dropbox, iCloud paths."
  },
  "alex.storage.autoDetectCloud": {
    "type": "boolean",
    "default": true,
    "description": "Automatically detect and offer cloud storage locations (OneDrive, Dropbox, iCloud, Google Drive)."
  }
}
```

**Implementation:**
```typescript
// src/shared/globalKnowledge.ts
export function getAlexGlobalPath(): string {
  const configPath = vscode.workspace.getConfiguration('alex').get<string>('storagePath');

  if (configPath && configPath.trim() !== '') {
    // Validate the path exists and is writable
    if (fs.existsSync(configPath)) {
      return configPath;
    }
    // Create if doesn't exist
    fs.mkdirpSync(configPath);
    return configPath;
  }

  // Default: ~/.alex/
  return path.join(os.homedir(), ALEX_GLOBAL_HOME);
}

// Auto-detection helper
export function detectCloudStoragePaths(): CloudStorageOption[] {
  const options: CloudStorageOption[] = [];
  const home = os.homedir();

  // OneDrive (Windows)
  const oneDrive = process.env.OneDrive || path.join(home, 'OneDrive');
  if (fs.existsSync(oneDrive)) {
    options.push({ name: 'OneDrive', path: path.join(oneDrive, 'Alex-Knowledge') });
  }

  // Dropbox
  const dropbox = path.join(home, 'Dropbox');
  if (fs.existsSync(dropbox)) {
    options.push({ name: 'Dropbox', path: path.join(dropbox, 'Alex-Knowledge') });
  }

  // iCloud (macOS)
  const iCloud = path.join(home, 'Library/Mobile Documents/com~apple~CloudDocs');
  if (fs.existsSync(iCloud)) {
    options.push({ name: 'iCloud Drive', path: path.join(iCloud, 'Alex-Knowledge') });
  }

  // Google Drive
  const gDrive = path.join(home, 'Google Drive');
  if (fs.existsSync(gDrive)) {
    options.push({ name: 'Google Drive', path: path.join(gDrive, 'Alex-Knowledge') });
  }

  return options;
}
```

### 10. `/forget <topic>` Command (P2 - User Request)

**Goal:** Selective memory cleanup with user approval.

**Implementation:**
```typescript
// src/chat/commands/forget.ts
export async function handleForgetCommand(
  topic: string,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<IAlexChatResult> {
  // Search for related content
  const patterns = await searchGlobalKnowledge(topic, 'patterns');
  const insights = await searchGlobalKnowledge(topic, 'insights');

  if (patterns.length === 0 && insights.length === 0) {
    stream.markdown(`No knowledge found matching "${topic}".`);
    return { metadata: { command: 'forget', found: 0 } };
  }

  // Show what will be affected
  stream.markdown(`## Found ${patterns.length + insights.length} items matching "${topic}":\n\n`);

  for (const p of patterns) {
    stream.markdown(`- 📚 Pattern: **${p.title}**\n`);
  }
  for (const i of insights) {
    stream.markdown(`- 💡 Insight: **${i.title}** (${i.timestamp})\n`);
  }

  // Add confirmation button
  stream.button({
    command: 'alex.confirmForget',
    title: '🗑️ Confirm Deletion',
    arguments: [{ topic, patterns, insights }]
  });

  stream.button({
    command: 'alex.cancelForget',
    title: '❌ Cancel',
    arguments: []
  });

  return { metadata: { command: 'forget', found: patterns.length + insights.length } };
}
```

---

## 📊 Effort Summary

| Priority | Items | Total Effort | Notes |
|----------|-------|--------------|-------|
| P0 Critical | 3 | 3 days | |
| P1 Quick Wins | 5 | **4 days** | ⬇️ Reduced: Follow-up already done, others partially done |
| P2 User Requests | 5 | 10 days | |
| P3 Tech Debt | 5 | 7 days | |
| P4 Documentation | 4 | 3.5 days | |
| **Total** | **22** | **~27.5 days** | Saved 3 days from fact-check |

**Suggested Release Timeline:**
- **Week 1:** P0 + P1 (Critical fixes + Quick wins) → v3.5.0-beta.1 *(7 days)*
- **Week 2-3:** P2 (User requests) → v3.5.0-beta.2 *(10 days)*
- **Week 4:** P3 + P4 (Tech debt + Docs) → v3.5.0 Final *(10.5 days)*

> **Note:** Timeline reduced by ~1 week after fact-check discovered P1.7 already implemented.

---

## 🔄 Migration Notes

### From v3.4.x to v3.5.0

**Automatic:**
- All existing functionality preserved
- New settings default to backward-compatible values
- Tool annotations add functionality without breaking changes

**User Action (Optional):**
- Configure `alex.storagePath` for cloud storage
- Review participant detection settings
- Enable auto-detection for cloud storage

### Preparing for v4.0.0

v3.5.0 lays groundwork for v4.0 by:
1. Adding follow-up provider infrastructure (used for verification prompts in v4.0)
2. Documenting confidence expression patterns
3. Updating DK-APPROPRIATE-RELIANCE with preliminary AETHER concepts
4. Adding epistemic category to participant detection

---

## 🔗 Related Documents

- [ROADMAP-VSCODE-V4.0.md](ROADMAP-VSCODE-V4.0.md) — Next major version (Epistemic Integrity)
- [CHANGELOG.md](CHANGELOG.md) — Version history
- [article/appropriate-reliance/APPROPRIATE-RELIANCE-V5.md](article/appropriate-reliance/APPROPRIATE-RELIANCE-V5.md) — Research foundation for v4.0

---

*Alex Cognitive Architecture — v3.5.0 TRITRSEPTIUM-PENT-HEX: Bridge to Epistemic Integrity*
