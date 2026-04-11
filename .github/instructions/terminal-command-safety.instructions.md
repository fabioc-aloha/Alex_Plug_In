---
description: "Prevent terminal command failures from shell metacharacter interpretation, output capture issues, and hanging commands"
applyTo: "**"
---

# Terminal Command Safety

## Backtick Hazard (Critical)

Backticks in terminal command arguments break across all shells:
- **bash/zsh**: backtick = command substitution (`echo "use `ls` here"` executes `ls`)
- **PowerShell**: backtick = escape character (`echo "use `n here"` inserts newline)

**Ref**: [vscode#295620](https://github.com/microsoft/vscode/issues/295620)

## Rules for run_in_terminal

1. **NEVER** place raw backticks inside double-quoted terminal arguments
2. When command arguments contain markdown, code snippets, or backticks: write content to a temp file first, then reference the file
3. For `gh` commands: use `--body-file` instead of `--body` when the body contains backticks or markdown code blocks
4. For `git commit`: use `-F <file>` instead of `-m` when the message contains backticks
5. For any CLI: prefer file-based input (`< file`, `--input-file`, `-F`) over inline arguments containing backticks

## Safe Pattern

```bash
# Write content to temp file (heredoc with single-quoted delimiter prevents interpolation)
cat > /tmp/body.md << 'EOF'
## Changes
- Added `MyClass` to the module
- Updated `config.py`
EOF

# Pass file to command
gh pr create --title "My PR" --body-file /tmp/body.md
rm /tmp/body.md
```

## PowerShell Equivalent

```powershell
$body = @'
## Changes
- Added `MyClass` to the module
'@
$body | Out-File -Encoding utf8 "$env:TEMP\body.md"
gh pr create --title "My PR" --body-file "$env:TEMP\body.md"
Remove-Item "$env:TEMP\body.md"
```

## Quick Reference: When to Use File-Based Input

| Content contains | Action |
|---|---|
| Backticks (`` ` ``) | Always use temp file |
| Multi-line text | Prefer temp file |
| Single quotes AND double quotes | Use temp file |
| Dollar signs (`$`) | Use single-quoted heredoc or temp file |
| Plain text, no special chars | Inline is safe |

## Output Capture Failures (run_in_terminal)

Terminal output can be silently lost or truncated when the agent reads results. Known causes:

**Refs**: [vscode#308610](https://github.com/microsoft/vscode/issues/308610), [vscode#308048](https://github.com/microsoft/vscode/issues/308048), [vscode#307173](https://github.com/microsoft/vscode/issues/307173)

### Mitigations

1. **Redirect output to a file, then read the file** instead of relying on terminal capture:
   ```powershell
   # Instead of: npm run build
   npm run build 2>&1 | Out-File -Encoding utf8 "$env:TEMP\build-output.txt"; Get-Content "$env:TEMP\build-output.txt" -Tail 50
   ```
2. **Pipe through `Out-String`** for commands that use pagers or progressive output:
   ```powershell
   git log --oneline -20 | Out-String
   ```
3. **Use `; echo DONE`** as a sentinel to confirm command completion when output seems missing:
   ```powershell
   npm test 2>&1; echo "EXIT_CODE:$LASTEXITCODE"
   ```
4. **Limit output volume**: Large outputs (>60KB) are truncated. Use `Select-Object -First`, `-Tail`, `head`, or `Format-Table` to keep output within bounds.
5. **Avoid alt-buffer programs** (`less`, `vim`, `man`, interactive TUIs). They write to an alternate screen buffer that the agent cannot capture. Use non-interactive equivalents:
   - `git log` not `git log | less` (git auto-pages; set `$env:GIT_PAGER="cat"`)
   - `Get-Help` not `man`
   - `gh issue view --json` not `gh issue view` (which opens a pager)

### If output capture returns empty

1. Re-read output with `get_terminal_output` using the terminal ID
2. If still empty, re-run the command with output redirected to a temp file
3. Check if the command wrote to stderr only (pipe stderr: `2>&1`)

## Terminal Hanging / Not Responding

Long-running or interactive commands can cause the terminal session to appear frozen.

**Refs**: [vscode#308610](https://github.com/microsoft/vscode/issues/308610), [vscode#306490](https://github.com/microsoft/vscode/issues/306490), [vscode-copilot-release#14124](https://github.com/microsoft/vscode-copilot-release/issues/14124)

### Mitigations

1. **Use `mode=async` with timeout** for commands expected to run longer than 15 seconds (servers, builds, tests):
   ```
   mode=async for: npm start, dotnet run, docker compose up, long test suites
   mode=sync with timeout=30000 for: npm install, git operations, single test files
   ```
2. **Never run interactive commands**: Anything requiring user input (Y/n prompts, `Read-Host`, `passwd`) will hang. Pre-answer with flags:
   - `npm install --yes`, `rm -rf` (not `rm -ri`), `az login --use-device-code`
   - `git commit --no-edit` for merge commits
3. **Set timeouts on network operations**:
   ```powershell
   # npm with timeout
   npm install --prefer-offline --no-audit
   # curl with timeout
   curl --max-time 30 --connect-timeout 10 $url
   ```
4. **Avoid heredoc blocks in terminal commands** (known to desync the terminal parser, especially on zsh). Instead, write multi-line content to a file first, then reference the file.
5. **One command at a time**: Do not chain unrelated commands with `&&` or `;` when any could hang. Run them as separate `run_in_terminal` calls so each can be independently monitored.
6. **Kill stuck terminals**: If a terminal stops responding, use `send_to_terminal` with Ctrl+C (`\x03`) to interrupt, or start a fresh terminal rather than waiting.
