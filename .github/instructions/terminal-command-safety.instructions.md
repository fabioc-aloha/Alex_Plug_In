---
description: "Prevent terminal command failures from shell metacharacter interpretation (backticks, quotes, special chars)"
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
