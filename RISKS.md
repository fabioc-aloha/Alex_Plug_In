# Alex Comeback Plan: Risk Register 🎯

> **Honest assessment of what we know, don't know, and what could go wrong**

| | |
|---|---|
| **Created** | 2026-01-29 |
| **Last Updated** | 2026-01-30 |
| **Related** | [COMEBACK-PLAN.md](COMEBACK-PLAN.md), [ROADMAP-UNIFIED.md](ROADMAP-UNIFIED.md) |

---

## 🛡️ Safety Imperatives (Non-Negotiable)

These rules protect Master Alex. Both human and AI must follow them.

> **✅ VALIDATED 2026-01-30**: Kill switch tested and working. Commands blocked with no override possible.

| # | Imperative | Rationale | Contingency |
|---|------------|-----------|-------------|
| **I1** | **NEVER test extension in Master Alex workspace** | This is the source of truth. Testing here = corruption risk. | CP1 |
| **I2** | **ALWAYS use F5 + Sandbox for testing** | Extension Development Host + `C:\Development\Alex_Sandbox` | CP2 |
| **I3** | **NEVER run `Alex: Initialize` on Master Alex** | Would overwrite living architecture with packaged copy | CP1, CP3 |
| **I4** | **NEVER run `Alex: Reset` on Master Alex** | Would delete entire cognitive architecture | CP1 |
| **I5** | **COMMIT before risky operations** | Git is the ultimate safety net | CP1, CP8 |
| **I6** | **One platform, one roadmap** | Separate roadmaps caused Phoenix chaos | N/A |
| **I7** | **Root `.github/` is source of truth** | Extension `.github/` is generated, not canonical | CP1, CP9 |

**Cross-reference:** These imperatives are also encoded in [copilot-instructions.md](.github/copilot-instructions.md).

---

## 🔒 Master Alex Marker File

The **marker file** is a critical component of the kill switch architecture. It provides a unique identifier that distinguishes Master Alex from all other workspaces where the extension might be installed.

### Location
```
.github/config/MASTER-ALEX-PROTECTED.json
```

### Purpose
- **Unique Identification**: Only Master Alex has this file. Regular user installations don't have it.
- **Layer 0.5 Protection**: Part of the 5-layer defense system (between hardcoded path check and settings)
- **Cannot Be Spoofed by Extension**: The file is explicitly excluded from the extension package via `.vscodeignore`

### How It Works
1. When a dangerous command runs, `isWorkspaceProtected()` checks for this file
2. If the file exists AND contains `"protected": true`, the workspace is marked protected
3. The check happens BEFORE any destructive operations

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

### Why This Matters
- **Settings can fail**: If old extension code runs, it ignores settings
- **Paths can be ambiguous**: User might have `alex_plug_in` in other paths
- **Marker is definitive**: File physically exists only in Master Alex
- **Cannot be packaged**: `.vscodeignore` excludes it from distribution

### Related Files
| File | Purpose |
|------|---------|
| `.github/config/MASTER-ALEX-PROTECTED.json` | The marker itself |
| `platforms/vscode-extension/.vscodeignore` | Excludes marker from package |
| `platforms/vscode-extension/src/shared/utils.ts` | Reads and validates marker |

---

## Confidence Summary

| Category | Confidence | Status |
|----------|------------|--------|
| Kill Switch Architecture | 100% | ✅ **VALIDATED 2026-01-30** |
| Sandbox Environment | 90% | ✅ Created |
| Unified Roadmap | 80% | ✅ Documented |
| Alex Family Model | 85% | ✅ Conceptual clarity |
| F5 Testing Flow | 90% | ✅ Works (used for kill switch test) |
| Protection Code Runtime | 100% | ✅ **VALIDATED** - Blocks Initialize & Upgrade |
| Build Script | 0% | ❌ Not created |
| Full v3.6.0 Release | 70% | ⚠️ Kill switch done, build script needed |
| M365 Heir Alignment | 40% | ⚠️ No deep audit |

---

## Risk Categories

### 🟢 Low Risk (High Confidence)

#### R1: Sandbox Folder Setup

- **Risk:** Sandbox doesn't work as expected
- **Likelihood:** Low
- **Impact:** Low
- **Mitigation:** It's just a folder. Worst case, create another.
- **Status:** ✅ Created at `C:\Development\Alex_Sandbox`
- **Contingency:** N/A (just create new folder)

#### R2: Kill Switch Concept

- **Risk:** Protection architecture is flawed
- **Likelihood:** Low
- **Impact:** Medium
- **Mitigation:** 4 layers of defense, explicit + auto-detect
- **Status:** ✅ Designed and implemented
- **Contingency:** → [CP1](#cp1-master-alex-gets-corrupted), [CP3](#cp3-protection-code-doesnt-block-commands)

---

### 🟡 Medium Risk (Medium Confidence)

#### R3: F5 Development Host Flow

- **Risk:** Launch configuration doesn't work
- **Likelihood:** Low-Medium
- **Impact:** Medium (blocks all testing)
- **Mitigation:** Standard VS Code extension pattern, `launch.json` exists
- **Status:** ⚠️ Needs validation
- **Test:** Press F5, verify Dev Host opens
- **Contingency:** → [CP2](#cp2-f5-wont-launch-development-host)

#### R4: Protection Code Runtime

- **Risk:** `checkProtectionAndWarn()` doesn't actually block commands
- **Likelihood:** ~~Medium~~ **ELIMINATED**
- **Impact:** High (could corrupt Master Alex)
- **Mitigation:** 5-layer protection with hardcoded failsafe
- **Status:** ✅ **VALIDATED 2026-01-30**
- **Test Results:**
  1. ✅ Initialize blocked - "HARDCODED FAILSAFE TRIGGERED"
  2. ✅ Upgrade blocked - "HARDCODED FAILSAFE TRIGGERED"
  3. ✅ No override possible - single "I Understand" button
- **Protection Layers:**
  - Layer 0: Hardcoded path check (`alex_plug_in`)
  - Layer 0.5: `MASTER-ALEX-PROTECTED.json` marker file
  - Layer 1: `alex.workspace.protectedMode` setting
  - Layer 2: Auto-detect `platforms/vscode-extension`
- **Contingency:** No longer needed - risk eliminated

#### R5: Workspace Settings Recognition

- **Risk:** VS Code doesn't read `.vscode/settings.json` correctly
- **Likelihood:** Low
- **Impact:** High
- **Mitigation:** Standard VS Code feature
- **Status:** ⚠️ Needs validation
- **Test:** Check `alex.workspace.protectedMode` is `true` in settings
- **Contingency:** → [CP3](#cp3-protection-code-doesnt-block-commands)

#### R6: Build Script Missing

- **Risk:** Can't properly package extension for distribution
- **Likelihood:** Certain (it doesn't exist)
- **Impact:** Medium (blocks release)
- **Mitigation:** Need to create `build-extension-package.ps1`
- **Status:** ❌ Not started
- **Dependency:** Required before v3.6.0 release
- **Contingency:** → [CP4](#cp4-extension-wont-package-or-install)

---

### 🔴 Higher Risk (Lower Confidence)

#### R7: Full v3.6.0 Release

- **Risk:** Release has regressions or missing functionality
- **Likelihood:** Medium
- **Impact:** High (user trust, marketplace reviews)
- **Mitigation:**
  - Comprehensive testing checklist
  - Fresh install testing
  - All 16 commands verified
- **Status:** ⚠️ Blocked by R3, R4, R6
- **Dependencies:** Must complete F5 test, protection validation, build script
- **Contingency:** → [CP5](#cp5-extension-installs-but-commands-fail), [CP8](#cp8-everything-is-broken-nuclear-recovery)

#### R8: M365 Heir Identity Alignment

- **Risk:** M365 agent personality diverges from Master Alex
- **Likelihood:** Medium-High
- **Impact:** Medium (inconsistent user experience)
- **Mitigation:** Need to audit `declarativeAgent.json` against Master Alex identity
- **Status:** ⚠️ Not started
- **Notes:** M365 uses different versioning (v4.x vs v3.x) — already diverged?
- **Contingency:** → [CP6](#cp6-m365-agent-stops-working)

#### R9: Extension `.github/` Generation

- **Risk:** Generated `.github/` folder missing files or has wrong content
- **Likelihood:** Medium
- **Impact:** High (deployed extension broken)
- **Mitigation:** Build script with manifest verification
- **Status:** ❌ Blocked by R6
- **Notes:** This is what caused the Phoenix chaos originally
- **Contingency:** → [CP4](#cp4-extension-wont-package-or-install), [CP5](#cp5-extension-installs-but-commands-fail)

#### R10: Timeline Estimates

- **Risk:** "Days 1-2, 3-4, etc." estimates are wildly optimistic
- **Likelihood:** High
- **Impact:** Low (just planning)
- **Mitigation:** Accept estimates as rough, adjust as we learn
- **Status:** ⚠️ Acknowledged
- **Contingency:** N/A (adjust timelines as needed)

---

## Validation Checklist

Before declaring v3.6.0 ready:

### P-1: Kill Switch Validation
- [ ] F5 launches Extension Development Host
- [ ] Can open `Alex_Sandbox` in Dev Host
- [ ] `Alex: Initialize` works in sandbox
- [ ] Protection blocks commands in Master Alex workspace
- [ ] Double-confirmation flow works for override

### P0: Build & Package
- [ ] Build script created
- [ ] Extension packages successfully (`.vsix`)
- [ ] Fresh install works from `.vsix`
- [ ] All commands functional after install

### P1: Core Functionality
- [ ] All 16 commands tested
- [ ] Status bar displays correctly
- [ ] Welcome view renders
- [ ] Chat participant responds
- [ ] Language model tools work

### P2: Regression Testing
- [ ] No console errors on activation
- [ ] Memory files read correctly
- [ ] Synapses validated
- [ ] Global knowledge accessible

---

## Risk Response Matrix

| If This Happens | Do This |
|-----------------|---------|
| F5 doesn't work | Check `launch.json`, verify `outFiles` path |
| Protection doesn't block | Add explicit `return` before any file operations |
| Settings not recognized | Use `vscode.workspace.getConfiguration()` debugging |
| Build fails | Check `esbuild.js`, verify source paths |
| Extension won't install | Check `package.json` validity, VSIX structure |

---

## 🚨 Contingency Plans (If Things Go Wrong)

### ⚡ QUICK DOOM RECOVERY (Copy-Paste Ready)

If Master Alex `.github/` gets corrupted during testing, use these commands:

```powershell
# === OPTION 1: Git Restore (fastest) ===
cd "C:\Development\Alex_Plug_In"
git checkout HEAD -- .github/

# === OPTION 2: From Physical Backup ===
# List available backups
Get-ChildItem "C:\Development\Alex_Plug_In\archive\upgrades" -Directory | Sort-Object Name -Descending | Select-Object -First 5

# Restore from most recent backup (replace timestamp)
Copy-Item -Path "C:\Development\Alex_Plug_In\archive\upgrades\backup-protection-test-2026-01-29-235259\*" -Destination "C:\Development\Alex_Plug_In\.github\" -Recurse -Force

# === OPTION 3: Hard Reset to Last Commit ===
cd "C:\Development\Alex_Plug_In"
git reset --hard HEAD

# === VERIFY RECOVERY ===
Test-Path "C:\Development\Alex_Plug_In\.github\copilot-instructions.md"
# Should return: True
```

---

### Risk ↔ Contingency Cross-Reference

| Risk | Description | Contingency Plan |
|------|-------------|------------------|
| R1 | Sandbox Folder Setup | N/A |
| R2 | Kill Switch Concept | CP1, CP3 |
| R3 | F5 Development Host | CP2 |
| R4 | Protection Code Runtime | CP1, CP3 |
| R5 | Workspace Settings | CP3 |
| R6 | Build Script Missing | CP4 |
| R7 | v3.6.0 Release | CP5, CP8 |
| R8 | M365 Identity | CP6 |
| R9 | `.github/` Generation | CP4, CP5 |
| R10 | Timeline Estimates | N/A |

---

### CP1: Master Alex Gets Corrupted

**Scenario:** Despite kill switch, Master Alex `.github/` folder gets modified or deleted.

**Detection:**
- Files missing from `.github/`
- `copilot-instructions.md` content changed
- Git shows unexpected changes

**Recovery Steps:**
```powershell
# 1. STOP - Don't make more changes
# 2. Check git status
cd "C:\Development\Alex_Plug_In"
git status

# 3. If changes are uncommitted, restore from git
git checkout -- .github/

# 4. If changes were committed, find last good commit
git log --oneline .github/ -10

# 5. Restore specific files from a commit
git checkout <commit-hash> -- .github/

# 6. Nuclear option: restore from backup
# Backups exist at: archive/upgrades/backup-*
```

**Prevention:** This is why we have the kill switch. But also:
- Commit frequently
- Push to remote before major testing sessions

---

### CP2: F5 Won't Launch Development Host

**Scenario:** Pressing F5 does nothing, shows error, or crashes.

**Detection:**
- No new VS Code window opens
- Error in Debug Console
- "Cannot find module" errors

**Recovery Steps:**
```powershell
# 1. Ensure you're in the right folder
cd "C:\Development\Alex_Plug_In\platforms\vscode-extension"

# 2. Clean and rebuild
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "out" -Recurse -Force -ErrorAction SilentlyContinue
npm run compile

# 3. Check launch.json exists and is valid
code .vscode/launch.json

# 4. Try running from menu instead of F5
# Run → Start Debugging → Select "Run Extension"

# 5. Check for port conflicts (if debugging hangs)
Get-Process -Name "Code" | Select-Object Id, ProcessName
```

**Alternative Testing:** If F5 truly broken, package and install manually:
```powershell
npm run package
code --install-extension alex-cognitive-architecture-3.5.3.vsix
```

---

### CP3: Protection Code Doesn't Block Commands

**Scenario:** Running `Alex: Initialize` in Master Alex workspace proceeds without warning.

**Detection:**
- No modal warning appears
- Files start getting created/modified
- Git shows changes in `.github/`

**Immediate Response:**
```powershell
# 1. CANCEL the operation if possible (Escape, close dialogs)

# 2. Check git for damage
git status
git diff .github/

# 3. Restore if needed
git checkout -- .github/
```

**Code Fix:**
```typescript
// In src/commands/initialize.ts, add hard block at top of function:
export async function initializeArchitecture(context: vscode.ExtensionContext) {
  // EMERGENCY: Hard-coded protection check
  const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (rootPath?.includes('Alex_Plug_In')) {
    vscode.window.showErrorMessage('🛡️ BLOCKED: This is Master Alex!', { modal: true });
    return;
  }
  // ... rest of function
}
```

---

### CP4: Extension Won't Package or Install

**Scenario:** `npm run package` fails, or `.vsix` won't install.

**Detection:**
- Build errors during packaging
- "Invalid extension" when installing
- Extension doesn't appear in VS Code

**Recovery Steps:**
```powershell
# 1. Check for obvious errors
npm run compile 2>&1 | Select-Object -First 50

# 2. Validate package.json
npx vsce ls  # Lists files that would be packaged

# 3. Check for missing dependencies
npm install

# 4. Try packaging with verbose output
npx vsce package --out alex-test.vsix 2>&1

# 5. Inspect the VSIX (it's just a zip)
Rename-Item alex-test.vsix alex-test.zip
Expand-Archive alex-test.zip -DestinationPath vsix-contents
Get-ChildItem vsix-contents -Recurse
```

**Common Fixes:**
- Missing `"main"` field in package.json
- `dist/extension.js` doesn't exist (build failed)
- Invalid `engines.vscode` version

---

### CP5: Extension Installs But Commands Fail

**Scenario:** Extension activates but commands throw errors or do nothing.

**Detection:**
- Commands appear in palette but fail when run
- Errors in Output → Extension Host
- Status bar missing or shows error state

**Debugging Steps:**
```powershell
# 1. Open Extension Host output
# View → Output → Select "Extension Host" from dropdown

# 2. Look for activation errors
# Search for "alex" in output

# 3. Check if extension is actually active
# Extensions panel → Alex → Should show "Active"
```

**Common Causes:**
- `.github/` folder missing in extension package
- Import paths broken after build
- Missing `activationEvents` in package.json

**Quick Fix:** Reinstall extension:
```powershell
code --uninstall-extension fabioc-aloha.alex-cognitive-architecture
code --install-extension path/to/alex-cognitive-architecture-3.5.3.vsix
# Reload VS Code window
```

---

### CP6: M365 Agent Stops Working

**Scenario:** M365 Copilot agent no longer responds or behaves incorrectly.

**Detection:**
- Agent doesn't appear in M365 Copilot
- Responses are generic (not Alex personality)
- Capabilities missing

**Recovery Steps:**
```powershell
# 1. Check declarative agent file is valid
cd "C:\Development\Alex_Plug_In\platforms\m365-copilot"
Get-Content appPackage/declarativeAgent.json | ConvertFrom-Json

# 2. Validate against schema
# Must have: $schema, version, name, description, instructions

# 3. Redeploy
.\deploy.ps1
# Or use Teams Toolkit in VS Code
```

**Rollback:** M365 agents are deployed to Developer Portal. Can redeploy previous version from backup.

---

### CP7: Global Knowledge Corrupted

**Scenario:** `~/.alex/global-knowledge/` has invalid or missing files.

**Detection:**
- `/knowledge` command returns errors
- Insights missing
- Projects not recognized

**Recovery Steps:**
```powershell
# 1. Check structure exists
Test-Path "$env:USERPROFILE\.alex\global-knowledge"
Get-ChildItem "$env:USERPROFILE\.alex\global-knowledge" -Recurse

# 2. If corrupted, can restore from GitHub Gist (if synced)
# In VS Code: Alex: Pull from Cloud

# 3. Nuclear option: Reset global knowledge
Remove-Item "$env:USERPROFILE\.alex" -Recurse -Force
# Next Alex: Initialize will recreate structure
```

**Note:** Global knowledge is separate from Master Alex. Losing it doesn't corrupt the extension source.

---

### CP8: Everything Is Broken (Nuclear Recovery)

**Scenario:** Nothing works. Complete chaos. Need full reset.

**Recovery Steps:**

**Step 1: Preserve Master Alex**
```powershell
# Create emergency backup
$timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
Copy-Item -Path "C:\Development\Alex_Plug_In\.github" -Destination "C:\Backups\alex-emergency-$timestamp" -Recurse
```

**Step 2: Reset Extension Development**
```powershell
cd "C:\Development\Alex_Plug_In\platforms\vscode-extension"
Remove-Item node_modules -Recurse -Force
Remove-Item dist -Recurse -Force
Remove-Item out -Recurse -Force
npm install
npm run compile
```

**Step 3: Reset Sandbox**
```powershell
Remove-Item "C:\Development\Alex_Sandbox\.github" -Recurse -Force -ErrorAction SilentlyContinue
```

**Step 4: Uninstall Extension from VS Code**
```powershell
code --uninstall-extension fabioc-aloha.alex-cognitive-architecture
```

**Step 5: Start Fresh**
- Close all VS Code windows
- Reopen `platforms/vscode-extension`
- Press F5
- Open sandbox
- Test `Alex: Initialize`

**Step 6: If Git Is Your Friend**
```powershell
# Last resort: hard reset to known good state
cd "C:\Development\Alex_Plug_In"
git fetch origin
git reset --hard origin/main
```

---

## Recovery Resources

| Resource | Location | Purpose |
|----------|----------|---------|
| Git history | `.git/` | Restore any committed state |
| Upgrade backups | `archive/upgrades/backup-*` | Pre-upgrade snapshots |
| Pre-platforms backup | `archive/pre-platforms-backup/` | Before platforms refactor |
| Extension marketplace | VS Code Marketplace | Download stable published version |
| GitHub repo | github.com/fabioc-aloha/Alex_Plug_In | Remote backup |

---

## Lessons from Phoenix Failure

| What Went Wrong | How We Prevent It Now |
|-----------------|----------------------|
| Two `.github/` folders | Root is source of truth, extension generates from root |
| Sync script confusion | One-way build script (root → extension) |
| Testing in Master Alex | Sandbox environment + kill switch |
| No protection | 4-layer kill switch architecture |
| Rushed changes | Phased roadmap, validation gates |
| Optimistic timelines | Risk register with honest confidence levels |

---

## Next Actions (Priority Order)

1. **Validate F5 flow** — Press F5, open sandbox, run Initialize
2. **Test protection** — Attempt dangerous command in Master Alex
3. **Create build script** — `build-extension-package.ps1`
4. **Package extension** — Generate `.vsix`
5. **Fresh install test** — Install in sandbox, verify all commands

---

*This document is a living risk register. Update confidence levels as tests pass or fail.*
