# Alex VS Code Extension → v3.4.0 TRITRSEPTIUM-QUAD Roadmap

> **Enhanced Developer Experience: Visual Feedback & Quick Actions**

| | |
|---|---|
| **Target Version** | 3.4.0 TRITRSEPTIUM-QUAD |
| **Codename** | 🎯 **Focus** (Developer Productivity) |
| **Status** | 📋 Planning |
| **Foundation** | v3.3.7 TRITRSEPTIUM (Current) |
| **Created** | 2026-01-28 |
| **Author** | Alex Cognitive Architecture Team |

---

## 📋 Implementation Tracker

> Track progress on 🎯 Focus (v3.4.0) implementation

### ✅ Foundation Complete (v3.3.x)

| # | Feature | Status | Description |
|:-:|---------|:------:|-------------|
| - | @alex Chat Participant | ✅ | 16 slash commands |
| - | Language Model Tools | ✅ | 11 tools (synapse_health, memory_search, etc.) |
| - | Global Knowledge System | ✅ | search, save, promote, status |
| - | Cloud Sync | ✅ | GitHub Gists backup |
| - | Commands | ✅ | Initialize, Reset, Dream, Upgrade, Self-Actualize |
| - | Export for M365 | ✅ | Memory export for M365 Copilot |
| - | Keybindings | ✅ | Ctrl+Alt+D (dream), Ctrl+Alt+S (self-actualize), etc. |
| - | Walkthrough | ✅ | Getting started tutorial |

### v3.4.0 Quick Wins (Low Effort)

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 1 | Status Bar Health Indicator | ✅ | 2h | 🟢/🟡/🔴 in status bar, click for diagnostics |
| 2 | Context Menu Actions | ✅ | 2h | Right-click: "Save to Alex", "Ask Alex" |
| 3 | Knowledge Quick Pick | ✅ | 3h | Ctrl+Shift+K to search & insert knowledge |
| 4 | Session Timer | ✅ | 3h | Track learning sessions with Pomodoro option |
| 5 | Welcome View | ✅ | 4h | Activity Bar panel with quick actions |

### v3.4.0 Medium Effort

| # | Feature | Status | Effort | Description |
|:-:|---------|:------:|:------:|-------------|
| 6 | Learning Goals Widget | ✅ | 1d | Track daily/weekly goals with visual progress |
| 7 | Auto-Insights Detection | ✅ | 2d | Detect patterns, offer to save insights |
| 8 | Health Dashboard Webview | ✅ | 2d | Rich visualization of architecture |

### v3.5.0+ Future Features (from v5.0 Roadmap)

| # | Feature | Status | Description |
|:-:|---------|:------:|-------------|
| 9 | Test-Driven Learning | ⬜ | Interactive learning with test watching |
| 10 | Code Review Assist | ⬜ | PR analysis with knowledge correlation |
| 11 | Debug Memory | ⬜ | Context-aware debugging with knowledge |
| 12 | Goal Sessions | ⬜ | Focused work mode with auto-tracking |

**Legend:** ⬜ Not Started | 🔄 In Progress | ✅ Complete

**v3.4.0 Tasks: 8/8 complete** 🎉

---

## 🎯 Feature Specifications

### 1. Status Bar Health Indicator

**Goal:** Give users immediate visual feedback on Alex architecture health

```
┌──────────────────────────────────────────────────────────────────┐
│  VS Code Status Bar                                              │
│  ──────────────────────────────────────────────────────────────  │
│  ... other items ...    🦖 Alex 🟢    Ln 42, Col 8    UTF-8      │
└──────────────────────────────────────────────────────────────────┘

States:
  🟢 Healthy     - All synapses valid, architecture initialized
  🟡 Warning     - Some broken synapses or outdated version
  🔴 Error       - Architecture not initialized or critical issues
  ⚫ Not Init    - Architecture not deployed to workspace
```

**Implementation:**
- File: `src/extension.ts` (status bar already declared but not fully implemented)
- Add periodic health check (every 5 minutes)
- Click action → Run `alex.showStatus` or `alex.dream`
- Tooltip shows quick summary

**package.json additions:**
```json
{
  "contributes": {
    "commands": [
      {
        "command": "alex.statusBarClick",
        "title": "Alex: Show Health Details"
      }
    ]
  }
}
```

---

### 2. Context Menu Actions

**Goal:** Quick access to Alex from any code selection

```
┌─────────────────────────────────────┐
│  // Some interesting code pattern   │
│  const memoize = (fn) => {          │  ← User selects this
│    const cache = new Map();         │
│    return (...args) => {            │
│      const key = JSON.stringify(... │
│  ──────────────────────────────────│
│  ┌───────────────────────────────┐  │
│  │ Cut                      Ctrl+X│  │
│  │ Copy                     Ctrl+C│  │
│  │ ─────────────────────────────│  │
│  │ 🦖 Ask Alex about this        │  │  ← NEW
│  │ 💡 Save to Alex Knowledge     │  │  ← NEW
│  │ 🔍 Search Alex for related    │  │  ← NEW
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**package.json additions:**
```json
{
  "contributes": {
    "menus": {
      "editor/context": [
        {
          "submenu": "alex.contextMenu",
          "group": "alex"
        }
      ]
    },
    "submenus": [
      {
        "id": "alex.contextMenu",
        "label": "🦖 Alex"
      }
    ],
    "commands": [
      {
        "command": "alex.askAboutSelection",
        "title": "Ask Alex about this"
      },
      {
        "command": "alex.saveSelectionAsInsight",
        "title": "Save to Alex Knowledge"
      },
      {
        "command": "alex.searchRelated",
        "title": "Search Alex for related"
      }
    ]
  }
}
```

---

### 3. Knowledge Quick Pick

**Goal:** Fast keyboard-driven access to knowledge

```
┌──────────────────────────────────────────────────────────────────┐
│  🔍 Search Alex Knowledge...                                     │
│  ────────────────────────────────────────────────────────────── │
│  📁 Patterns                                                     │
│     GK-ERROR-HANDLING - Consistent error handling patterns       │
│     GK-API-DESIGN - RESTful API design principles               │
│  📁 Recent Insights                                              │
│     GI-2026-01-28-MEMOIZATION - Caching function results        │
│     GI-2026-01-27-RETRY-LOGIC - Exponential backoff pattern     │
│  📁 Project Knowledge                                            │
│     DK-ALEX-ARCHITECTURE - Cognitive architecture patterns       │
└──────────────────────────────────────────────────────────────────┘
```

**Keybinding:** `Ctrl+Shift+K` (Mac: `Cmd+Shift+K`)

**Actions:**
- Enter → Insert knowledge reference/content at cursor
- Ctrl+Enter → Open knowledge file
- Right arrow → Preview content

---

### 4. Session Timer

**Goal:** Help users track focused learning time

```
┌──────────────────────────────────────────────────────────────────┐
│  🍅 Learning Session: 23:45 remaining                            │
│  ──────────────────────────────────────────────────────────────  │
│  Topic: "Understanding React hooks"                              │
│  Progress: ████████░░ 80%                                        │
│                                                                  │
│  [Pause] [End Session] [Add 5 min]                               │
└──────────────────────────────────────────────────────────────────┘
```

**Features:**
- Start via `@alex /session "topic" 25min`
- Status bar shows remaining time
- Notification when session ends
- Auto-prompt to consolidate learnings
- Optional Pomodoro mode (25min work, 5min break)

---

### 5. Welcome View

**Goal:** Visible entry point for new and returning users

```
┌──────────────────────────────────────────────────────────────────┐
│  🦖 ALEX COGNITIVE                                               │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  Health: 🟢 Healthy                                              │
│  Knowledge: 42 patterns, 127 insights                            │
│  Last sync: 5 minutes ago                                        │
│                                                                  │
│  ─────────────────────────────────────────────────────────────── │
│  QUICK ACTIONS                                                   │
│                                                                  │
│  ▶ Start Learning Session                                        │
│  🧘 Meditate (consolidate knowledge)                             │
│  💭 Dream (neural maintenance)                                   │
│  📊 View Health Dashboard                                        │
│  ☁️ Sync to Cloud                                                │
│                                                                  │
│  ─────────────────────────────────────────────────────────────── │
│  RECENT ACTIVITY                                                 │
│                                                                  │
│  • Saved insight: "Memoization pattern" (2h ago)                 │
│  • Searched: "error handling" (yesterday)                        │
│  • Completed session: "React hooks" (yesterday)                  │
└──────────────────────────────────────────────────────────────────┘
```

**package.json additions:**
```json
{
  "contributes": {
    "viewsContainers": {
      "activitybar": [
        {
          "id": "alex-sidebar",
          "title": "Alex Cognitive",
          "icon": "assets/icon.svg"
        }
      ]
    },
    "views": {
      "alex-sidebar": [
        {
          "id": "alex.welcome",
          "name": "Welcome",
          "type": "webview"
        },
        {
          "id": "alex.quickActions",
          "name": "Quick Actions"
        },
        {
          "id": "alex.recentActivity",
          "name": "Recent Activity"
        }
      ]
    }
  }
}
```

---

## 📅 Implementation Schedule

### Week 1: Foundation & Quick Wins

| Day | Task | Output |
|-----|------|--------|
| Mon | Status Bar Health Indicator | Feature #1 complete |
| Tue | Context Menu Actions | Feature #2 complete |
| Wed | Knowledge Quick Pick | Feature #3 complete |
| Thu | Session Timer (basic) | Feature #4 complete |
| Fri | Testing & polish | All quick wins tested |

### Week 2: Welcome View & Release

| Day | Task | Output |
|-----|------|--------|
| Mon | Welcome View - structure | View container working |
| Tue | Welcome View - webview | Rich UI complete |
| Wed | Welcome View - actions | All buttons working |
| Thu | Integration testing | Full regression test |
| Fri | Documentation & release | v3.4.0 published |

---

## 🔧 Technical Notes

### Files to Modify

| File | Changes |
|------|---------|
| `package.json` | New commands, menus, views, keybindings |
| `src/extension.ts` | Status bar implementation, new command registrations |
| `src/commands/session.ts` | NEW - Session timer logic |
| `src/views/welcome.ts` | NEW - Welcome view provider |
| `src/views/quickActions.ts` | NEW - Quick actions tree view |
| `src/views/recentActivity.ts` | NEW - Activity tracking |

### Dependencies to Add

```json
{
  "devDependencies": {
    "@vscode/codicons": "^0.0.33"
  }
}
```

### Testing Checklist

- [ ] Status bar updates correctly on architecture changes
- [ ] Context menu appears on text selection
- [ ] Quick pick searches global + local knowledge
- [ ] Session timer notifications work
- [ ] Welcome view loads without errors
- [ ] All existing functionality still works

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| Time to first meaningful action | < 10 seconds |
| Knowledge search latency | < 500ms |
| Status bar update frequency | Every 5 min + on events |
| Session completion rate | Track for future optimization |

---

## 🔗 Related Documents

- [ROADMAP-V5-PENTUNIUM.md](ROADMAP-V5-PENTUNIUM.md) - Future VS Code features
- [ROADMAP-M365-COPILOT.md](ROADMAP-M365-COPILOT.md) - M365 platform roadmap
- [CHANGELOG.md](CHANGELOG.md) - Version history

---

*Alex Cognitive Architecture - VS Code Extension Roadmap*
