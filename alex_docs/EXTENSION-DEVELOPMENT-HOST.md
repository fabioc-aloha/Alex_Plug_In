# Extension Development Host (F5 Testing)

> **How to safely test the Alex VS Code extension without corrupting Master Alex**

---

## What is F5?

**F5** is VS Code's keyboard shortcut for "Start Debugging". For extension development, it launches a special **Extension Development Host** — a completely separate VS Code instance with your extension loaded.

This is the **safe way** to test extension changes.

---

## How It Works

```text
┌─────────────────────────────────────────────────────────────────────┐
│  YOUR MAIN VS CODE                                                  │
│  (where you write code)                                             │
│                                                                     │
│  Workspace: c:\Development\Alex_Plug_In\platforms\vscode-extension  │
│                                                                     │
│  Press F5 →  Compiles TypeScript                                    │
│              Launches new VS Code window                            │
│              Loads your extension in that window                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  EXTENSION DEVELOPMENT HOST                                         │
│  (separate VS Code instance)                                        │
│                                                                     │
│  • Your extension is loaded and active                              │
│  • Title bar shows "[Extension Development Host]"                   │
│  • You can open ANY folder here to test                             │
│  • Changes to main VS Code don't affect this instance               │
│  • Closing this window ends the debug session                       │
│                                                                     │
│  Open test folder: c:\Projects\TestProject                          │
│  Run: Alex: Initialize  ← Safe! Won't touch Master Alex             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Guide

### 1. Open the Extension Folder

Open this folder in VS Code:

```
c:\Development\Alex_Plug_In\platforms\vscode-extension
```

> **Important:** You must open the `vscode-extension` folder, not the root `Alex_Plug_In` folder.

### 2. Press F5

Or use the menu: **Run → Start Debugging**

VS Code will:
1. Run the pre-launch build task (compiles TypeScript)
2. Launch a new VS Code window (the Extension Development Host)

### 3. Wait for Compilation

You'll see in the terminal:
```
[watch] build started
[watch] build finished
```

### 4. New VS Code Window Opens

This is the **Extension Development Host**. You'll notice:
- Title bar shows `[Extension Development Host]`
- Your extension commands are available (Ctrl+Shift+P → "Alex:")
- This is a completely separate VS Code instance

### 5. Open a Test Folder

In the Development Host window:
1. **File → Open Folder**
2. Pick any folder that is **NOT** Master Alex
3. **Recommended:** Use the dedicated sandbox:
   ```
   C:\Development\Alex_Sandbox
   ```
4. Alternative locations:
   - `c:\Projects\TestProject`
   - `c:\Temp\AlexTest`
   - Any empty folder you create

### 6. Test Your Commands

Now you can safely run:
- `Alex: Initialize` — Creates `.github/` in your test folder
- `Alex: Dream` — Runs maintenance on test folder
- `Alex: Reset` — Resets test folder (not Master Alex!)

### 7. End the Session

When done testing:
- Close the Development Host window, OR
- Press **Shift+F5** in main VS Code, OR
- Click the red square (Stop) in the debug toolbar

---

## Why This Protects Master Alex

| Action | Main VS Code | Development Host |
|--------|--------------|------------------|
| Workspace | Master Alex source code | Your test project |
| Extension | Not installed (just source) | Your dev version loaded |
| `Alex: Initialize` | Would corrupt source! | Safe — uses test folder |
| `Alex: Reset` | Would delete your work! | Safe — affects test only |
| Code changes | Edit TypeScript here | Changes apply after restart |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **F5** | Start debugging (launch Development Host) |
| **Shift+F5** | Stop debugging (close Development Host) |
| **Ctrl+Shift+F5** | Restart debugging (rebuild and relaunch) |
| **F9** | Toggle breakpoint on current line |
| **F10** | Step over (debug) |
| **F11** | Step into (debug) |

---

## Debug Features

While F5 is running, you have full debugging capabilities:

### Breakpoints
- Click in the gutter (left of line numbers) to set breakpoints
- Code execution pauses at breakpoints
- Inspect variables, call stack, etc.

### Debug Console
- `console.log()` statements appear here
- You can evaluate expressions
- See runtime errors

### Variables Panel
- View local and global variables
- Expand objects to see properties
- Watch specific expressions

### Hot Reload (Partial)
- Some changes apply without full restart
- For most changes, use **Ctrl+Shift+F5** to restart

---

## Common Issues

### "Cannot find module" Errors

Run the build first:
```powershell
cd platforms/vscode-extension
npm run compile
```

### Extension Not Loading

Check that you opened the correct folder:
- ✅ `platforms/vscode-extension` (correct)
- ❌ `Alex_Plug_In` root (wrong)

### Changes Not Appearing

After editing TypeScript:
1. Save the file
2. Press **Ctrl+Shift+F5** to restart debugging

### Development Host Opens Empty

This is normal! You need to:
1. File → Open Folder
2. Select your test project folder

---

## The Kill Switch

Even with F5 testing, we have additional protection layers:

1. **`.vscode/settings.json`** in Master Alex root sets `protectedMode: true`
2. **Auto-detection** recognizes Master Alex by folder structure
3. **Double-confirmation** required to override protection

So even if you accidentally open Master Alex in the Development Host, the kill switch will block dangerous operations.

---

## Quick Reference Card

```text
┌────────────────────────────────────────────────────┐
│  EXTENSION TESTING QUICK REFERENCE                 │
├────────────────────────────────────────────────────┤
│                                                    │
│  SETUP                                             │
│  1. Open: platforms/vscode-extension               │
│  2. Press: F5                                      │
│  3. In Dev Host: Open test folder                  │
│                                                    │
│  TESTING                                           │
│  • Run commands with Ctrl+Shift+P                  │
│  • Set breakpoints by clicking gutter              │
│  • View logs in Debug Console                      │
│                                                    │
│  FINISH                                            │
│  • Close Dev Host window, or                       │
│  • Press Shift+F5                                  │
│                                                    │
│  RESTART (after code changes)                      │
│  • Press Ctrl+Shift+F5                             │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## See Also

- [COMEBACK-PLAN.md](../COMEBACK-PLAN.md) — P-1 Kill Switch documentation
- [USER-MANUAL.md](USER-MANUAL.md) — General Alex usage
- [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md) — Codebase organization
