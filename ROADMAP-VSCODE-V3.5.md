# Alex VS Code Extension → v3.5.0 TRITRSEPTIUM-PENT-HEX Roadmap

> **Transition Phase: Stabilization & Quick Wins Before v4.0**

| | |
|---|---|
| **Target Version** | 3.5.0 TRITRSEPTIUM-PENT-HEX |
| **Codename** | 🌉 **Bridge** (Transition to Epistemic Integrity) |
| **Status** | 📋 Planning |
| **Foundation** | v3.4.3 TRITRSEPTIUM-PENT (Current) |
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

## 📋 Implementation Tracker

### 🔴 P0: Critical Fixes (Ship Immediately)

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 1 | Webview HTML Sanitization | ⬜ | 1d | Sanitize dream report data to prevent XSS |
| 2 | JSON Schema Validation | ⬜ | 1d | Validate user-profile.json and knowledge index |
| 3 | Error Recovery Improvements | ⬜ | 1d | Better handling of corrupted config files |

### 🟠 P1: High-Value Quick Wins (VS Code 1.108+ Features)

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 4 | Tool Annotations | ⬜ | 1d | Add `readOnlyHint` to read-only tools for auto-approval |
| 5 | Tool Confirmation Messages | ⬜ | 1d | Custom confirmations for dream, sync, promote |
| 6 | Participant Detection | ⬜ | 2d | Auto-route queries to @alex via disambiguation config |
| 7 | Follow-up Provider | ⬜ | 2d | Suggest contextual follow-up questions |
| 8 | Agent Skills Validation | ⬜ | 1d | Ensure .github/skills/ format matches VS Code spec |

### 🟡 P2: User-Requested Features

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 9 | Configurable Storage Paths | ⬜ | 3d | `alex.storagePath` setting for OneDrive/cloud storage |
| 10 | `/forget <topic>` Command | ⬜ | 2d | Selective memory cleanup (documented but not implemented) |
| 11 | `/help` Command | ⬜ | 1d | Discoverable command listing with descriptions |
| 12 | Knowledge Export | ⬜ | 2d | Export to Obsidian/plain markdown format |
| 13 | Insight Deduplication | ⬜ | 2d | Prevent similar insights from proliferating |

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

**v3.5.0 Tasks: 0/22 complete**

---

## 🎯 Feature Specifications

### 1. Webview HTML Sanitization (P0 - Security)

**Problem:** Dream report data rendered directly in webview without sanitization.

**Solution:**
```typescript
// src/shared/utils/sanitize.ts
import DOMPurify from 'dompurify';

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre', 'span', 'div', 'p', 'br', 'ul', 'li'],
    ALLOWED_ATTR: ['class']
  });
}
```

**Files:** `src/commands/dream.ts`, `src/views/healthDashboard.ts`

### 4. Tool Annotations (P1 - Quick Win)

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

**Goal:** Provide custom confirmation dialogs for mutating tools.

**Implementation:**
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

### 6. Participant Detection (P1 - Quick Win)

**Goal:** Auto-route epistemic/cognitive queries to @alex without explicit mention.

**Implementation:**
```json
// package.json - chatParticipants section
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

### 7. Follow-up Provider (P1 - Quick Win)

**Goal:** Suggest contextual follow-up questions after responses.

**Implementation:**
```typescript
// src/chat/chatParticipant.ts
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

| Priority | Items | Total Effort |
|----------|-------|--------------|
| P0 Critical | 3 | 3 days |
| P1 Quick Wins | 5 | 7 days |
| P2 User Requests | 5 | 10 days |
| P3 Tech Debt | 5 | 7 days |
| P4 Documentation | 4 | 3.5 days |
| **Total** | **22** | **~30.5 days** |

**Suggested Release Timeline:**
- **Week 1-2:** P0 + P1 (Critical fixes + Quick wins) → v3.5.0-beta.1
- **Week 3-4:** P2 (User requests) → v3.5.0-beta.2
- **Week 5:** P3 + P4 (Tech debt + Docs) → v3.5.0 Final

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
