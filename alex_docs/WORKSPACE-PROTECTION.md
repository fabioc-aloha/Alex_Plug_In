# 🛡️ Workspace Protection System

> **Version**: 3.5.3 | **Status**: ✅ Validated 2026-01-30
> **Purpose**: Protect critical workspaces from accidental corruption

---

## Overview

The Workspace Protection System is a **5-layer kill switch** that prevents dangerous commands (`Initialize`, `Reset`, `Upgrade`) from running in protected workspaces. This is essential for protecting the Master Alex source workspace from accidental corruption.

---

## Why Protection Matters

### The Risk

Some Alex commands can modify or delete the entire `.github/` folder:

| Command | Risk |
|---------|------|
| `Alex: Initialize Architecture` | Overwrites `.github/` with packaged template |
| `Alex: Reset Architecture` | Deletes entire `.github/` folder |
| `Alex: Upgrade Architecture` | Modifies architecture files |

If run in the wrong workspace (like the extension source code), these commands could corrupt the living cognitive architecture.

### The Solution

A **defense-in-depth** approach with multiple independent protection layers. If any single layer fails, others still protect the workspace.

---

## The 5 Protection Layers

```
┌─────────────────────────────────────────────────────────┐
│                    DANGEROUS COMMAND                     │
│              (Initialize, Reset, Upgrade)                │
└─────────────────────────────────────────────────────────┘
                           │
                           v
┌─────────────────────────────────────────────────────────┐
│  LAYER 0: Hardcoded Path Check                          │
│  ─────────────────────────────────────────────────────  │
│  Checks if path contains 'alex_plug_in'                 │
│  Cannot be bypassed by any configuration                │
└─────────────────────────────────────────────────────────┘
                           │
                           v
┌─────────────────────────────────────────────────────────┐
│  LAYER 0.5: Marker File Detection                       │
│  ─────────────────────────────────────────────────────  │
│  Checks for MASTER-ALEX-PROTECTED.json                  │
│  File excluded from extension package                   │
└─────────────────────────────────────────────────────────┘
                           │
                           v
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: Protected Mode Setting                        │
│  ─────────────────────────────────────────────────────  │
│  alex.workspace.protectedMode = true                    │
│  Configured in .vscode/settings.json                    │
└─────────────────────────────────────────────────────────┘
                           │
                           v
┌─────────────────────────────────────────────────────────┐
│  LAYER 2: Auto-Detect Extension Development             │
│  ─────────────────────────────────────────────────────  │
│  Checks for platforms/vscode-extension folder           │
│  Recognizes extension source workspace                  │
└─────────────────────────────────────────────────────────┘
                           │
                           v
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: Workspace Settings File                       │
│  ─────────────────────────────────────────────────────  │
│  .vscode/settings.json with protection enabled          │
│  Standard VS Code configuration                         │
└─────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              v                         v
       ┌─────────────┐          ┌─────────────┐
       │  PROTECTED  │          │   ALLOWED   │
       │   🛑 BLOCK  │          │   ✅ RUN    │
       └─────────────┘          └─────────────┘
```

---

## Master Alex Marker File

### Location

```
.github/config/MASTER-ALEX-PROTECTED.json
```

### Purpose

The marker file uniquely identifies Master Alex (the extension source workspace). It provides protection that:

- **Cannot be spoofed by the extension** - Excluded from package via `.vscodeignore`
- **Is independent of settings** - Works even if settings fail to load
- **Is physically present** - Not a configuration, but an actual file

### Contents

```json
{
  "protected": true,
  "workspace": "master-alex",
  "description": "This marker file identifies Master Alex source workspace",
  "warning": "NEVER copy this file to other workspaces",
  "safetyImperatives": ["I1", "I2", "I3", "I4", "I5"]
}
```

### Why a Marker File?

| Protection Method | Weakness |
|-------------------|----------|
| Settings-based | Old extension code might ignore settings |
| Path-based | User might have similar paths elsewhere |
| **Marker file** | ✅ Definitive, physical, cannot be packaged |

---

## Enabling Protection for Your Workspace

If you want to protect a workspace from accidental initialization:

### Option 1: Settings (Recommended)

Add to `.vscode/settings.json`:

```json
{
  "alex.workspace.protectedMode": true
}
```

### Option 2: Marker File (Strongest)

Create `.github/config/MASTER-ALEX-PROTECTED.json`:

```json
{
  "protected": true,
  "workspace": "my-protected-workspace",
  "description": "Protection for my critical workspace"
}
```

> ⚠️ **Note**: Only use the marker file for workspaces that truly need maximum protection. For most cases, the settings approach is sufficient.

---

## What Happens When Protected

When a dangerous command runs in a protected workspace:

1. **Detection**: Protection layers check the workspace
2. **Logging**: Decision logged to "Alex Kill Switch" output channel
3. **Dialog**: Error modal appears with explanation
4. **Block**: Single "I Understand" button - no way to proceed
5. **Return**: Command exits without making any changes

### Example Log Output

```
🛡️ isWorkspaceProtected() called for: C:\Development\Alex_Plug_In
🚨 HARDCODED FAILSAFE TRIGGERED: Path contains 'alex_plug_in'
📁 Marker file found: C:\Development\Alex_Plug_In\.github\config\MASTER-ALEX-PROTECTED.json
⚙️ Setting check: protectedMode = true
🏗️ Auto-detect: Has platforms/vscode-extension folder
✅ Final result: PROTECTED
🛑 Alex: Initialize BLOCKED for protected workspace
```

---

## Related Files

| File | Purpose |
|------|---------|
| `.github/config/MASTER-ALEX-PROTECTED.json` | Marker file (Master Alex only) |
| `.vscode/settings.json` | Workspace settings with protection |
| `platforms/vscode-extension/.vscodeignore` | Excludes marker from package |
| `platforms/vscode-extension/src/shared/utils.ts` | Protection implementation |

---

## For Extension Developers

### Testing Safely

1. **Use F5 (Run Extension)** - Opens Extension Development Host
2. **Open sandbox workspace** - `C:\Development\Alex_Sandbox` or similar
3. **Test commands there** - Never in Master Alex

### Key Functions

```typescript
// Check if workspace is protected
isWorkspaceProtected(): Promise<boolean>

// Show warning and always block
checkProtectionAndWarn(commandName: string): Promise<boolean>
// Always returns false - command should not proceed
```

### Safety Imperatives

| # | Rule |
|---|------|
| I1 | NEVER test extension in Master Alex workspace |
| I2 | ALWAYS use F5 + Sandbox for testing |
| I3 | NEVER run Initialize on Master Alex |
| I4 | NEVER run Reset on Master Alex |
| I5 | COMMIT before risky operations |

---

## Troubleshooting

### Commands Not Being Blocked

1. Check "Alex Kill Switch" output channel for logs
2. Verify marker file exists and contains `"protected": true`
3. Check `.vscode/settings.json` has `protectedMode: true`
4. Ensure you're running the latest extension version

### False Positives (Blocking When Shouldn't)

1. Remove marker file if workspace shouldn't be protected
2. Set `alex.workspace.protectedMode: false` in settings
3. Ensure path doesn't contain 'alex_plug_in'

---

*For full contingency plans if protection fails, see [RISKS.md](../RISKS.md).*
