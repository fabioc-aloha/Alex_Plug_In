# Polish Mermaid Setup

Interactive configuration helper for Mermaid diagram rendering in VS Code.

## Goal

Configure markdown preview and Mermaid diagrams for optimal rendering based on the user's specific VS Code environment.

## Process

### Step 1: Audit Current Environment

Run these commands to understand the user's setup:

```powershell
# Check installed markdown/mermaid extensions
code --list-extensions | Select-String -Pattern "mermaid|markdown"

# Check current mermaid-related settings
$settings = Get-Content "$env:APPDATA\Code\User\settings.json" -Raw | ConvertFrom-Json
$settings.PSObject.Properties | Where-Object { $_.Name -like "*mermaid*" -or $_.Name -like "*markdown*" } | ForEach-Object { Write-Host "$($_.Name) = $($_.Value)" }
```

### Step 2: Resolve Extension Conflicts

**Common conflict**: `bierner.markdown-mermaid` vs `shd101wyy.markdown-preview-enhanced`

| Extension | Preview Type | Settings Prefix |
|-----------|--------------|-----------------|
| `bierner.markdown-mermaid` | Native VS Code (`Ctrl+Shift+V`) | `markdown-mermaid.*` |
| `shd101wyy.markdown-preview-enhanced` | Separate preview (`Ctrl+K V`) | `markdown-preview-enhanced.*` + `~/.mume/style.less` |

**Recommendation**: Keep only ONE. `bierner.markdown-mermaid` integrates better with native VS Code.

```powershell
# Uninstall the conflicting extension if present
code --uninstall-extension shd101wyy.markdown-preview-enhanced
```

### Step 3: Apply Mermaid Settings

For `bierner.markdown-mermaid` (recommended):

```json
{
  "markdown-mermaid.lightModeTheme": "neutral",
  "markdown-mermaid.darkModeTheme": "dark",
  "markdown-mermaid.languages": ["mermaid"],
  "markdown-mermaid.maxTextSize": 50000
}
```

**Theme options**: `default`, `neutral`, `dark`, `forest`, `base`
- `neutral` is closest to GitHub's rendering style
- `default` has more colorful nodes

### Step 4: Custom CSS (Optional)

For additional styling control, copy the CSS from this skill:

```powershell
# Copy markdown-light.css to workspace
$skillPath = ".github/skills/markdown-mermaid/markdown-light.css"
$targetPath = ".vscode/markdown-light.css"

if (Test-Path $skillPath) {
    Copy-Item $skillPath $targetPath -Force
    Write-Host "Copied CSS to $targetPath"
}
```

Then add to settings:
```json
{
  "markdown.styles": [".vscode/markdown-light.css"]
}
```

### Step 5: Test Rendering

Create a test diagram to verify:

```markdown
` ` `mermaid
flowchart LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
` ` `
```

Open with native preview (`Ctrl+Shift+V`) and verify:
- [ ] Diagram renders (not showing code block)
- [ ] Colors match expected theme
- [ ] Text is readable
- [ ] Links/arrows display correctly

## Troubleshooting

### Diagram Shows as Code Block
- Ensure `bierner.markdown-mermaid` is installed
- Reload VS Code window after installation
- Check that code block uses ` ` `mermaid` (lowercase)

### Wrong Colors
- Check `markdown-mermaid.lightModeTheme` setting
- Try different themes: `neutral`, `default`, `forest`
- Reload after changing settings

### Preview Not Updating
- Use `Ctrl+Shift+P` → "Developer: Reload Window"
- Close and reopen the preview pane

## Settings Reference

| Setting | Values | Default | Purpose |
|---------|--------|---------|---------|
| `lightModeTheme` | default, neutral, dark, forest, base | default | Theme for light mode |
| `darkModeTheme` | default, neutral, dark, forest, base | dark | Theme for dark mode |
| `languages` | array of strings | ["mermaid"] | Code block language identifiers |
| `maxTextSize` | number | 50000 | Max characters before truncation |
