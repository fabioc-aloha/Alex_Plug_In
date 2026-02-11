# Pre-Publishing Checklist

Use this checklist before each release to ensure quality and consistency.

---

## 🔐 Authentication

⚠️ **PATs expire frequently** — Create a new one before EACH publish session.

- [ ] **Create fresh PAT** at [Azure DevOps Tokens](https://dev.azure.com/fabioc-aloha/_usersSettings/tokens)
  - Name: `VS Code Marketplace` (or any)
  - Organization: **All accessible organizations**
  - Expiration: **30 days** (or custom)
  - Scopes: **Custom defined** → **Marketplace** → ✅ **Manage**
- [ ] Update `.env` file in `platforms/vscode-extension/`:

  ```text
  VSCE_PAT=<paste-new-token-here>
  ```

**Publish command** (loads PAT from .env):

```powershell
$env:VSCE_PAT = (Get-Content .env | Select-String "VSCE_PAT" | ForEach-Object { $_.Line.Split("=",2)[1] }) ; npx vsce publish
```

**If you get 401 error**: Your PAT expired. Create a new one and update `.env`.

---

## 📋 Version & Metadata

**Version maintained in 3 locations only** (minimal overhead):

- [ ] **package.json** - `"version": "X.Y.Z"` (required for VS Code)
- [ ] **CHANGELOG.md** - `## [X.Y.Z] - YYYY-MM-DD` at top
- [ ] **copilot-instructions.md** - Header line 4: `**Version**: X.Y.Z`

**README badges**: No longer include version numbers - just link to marketplace.

**VS Code Marketplace Versioning:**
- Pre-release: odd minor (3.7.x, 3.9.x) with `--pre-release` flag
- Stable: even minor (3.6.x, 3.8.x) without flag
- Semver suffixes like `-beta.1` are **NOT supported** by marketplace

**Verify NO version in these locations** (removed to prevent drift):

- [ ] copilot-instructions.md "Version Compatibility" section - should have NO version
- [ ] copilot-instructions.md "Reference" section - should have NO version (only naming convention)
- [ ] README.md comparison table - should say "Latest" not specific version
- [ ] README.md footer - should have NO version number
- [ ] README.md badges - should NOT contain version numbers

## 🔧 Code Quality

- [ ] `npm run compile` succeeds with no errors
- [ ] `npm run check-types` passes TypeScript validation
- [ ] No console.log statements in production code (except intentional logging)
- [ ] All new features have corresponding package.json contributions

## ⏳ Temporary Skills (Beta Only)

**⚠️ IMPORTANT**: Temporary skills must be excluded from stable releases.

### For Beta Releases (`X.Y.Z-beta.N` or odd minor like 3.7.x)

- [ ] Temporary skills are **included** (they help beta testers)

### For Stable Releases (`X.Y.Z` or even minor like 3.6.x)

- [ ] Run check for temporary skills:

```powershell
Get-ChildItem .github/skills/*/synapses.json | ForEach-Object {
  $json = Get-Content $_ | ConvertFrom-Json
  if ($json.temporary -eq $true) {
    Write-Warning "EXCLUDE: $($_.Directory.Name)"
  }
}
```

- [ ] Verify temporary skills are **excluded** from package
- [ ] Or confirm all temporary skills have been removed/graduated

**Current Temporary Skills:** None (beta-tester removed for v4.0.7+ stable release)

## 🧠 Architecture Sync

**CRITICAL**: The cognitive architecture files live in the root `.github/` folder but must be synced to `platforms/vscode-extension/.github/` before packaging.

### Automatic Sync (Recommended)

The sync now runs **automatically** during `vscode:prepublish`:

```powershell
cd platforms/vscode-extension
npx vsce package --no-dependencies  # Triggers sync automatically
```

### Manual Sync (If Needed)

```powershell
cd platforms/vscode-extension
npm run sync-architecture
```

### Verify Skill Counts

- [ ] **After sync**, verify skill counts match expectations:

```powershell
# Quick count check
$master = (Get-ChildItem "../../.github/skills" -Directory).Count
$heir = (Get-ChildItem ".github/skills" -Directory).Count
Write-Host "Master: $master, Heir: $heir"

# Detailed check (shows what's excluded)
$missing = (Get-ChildItem "../../.github/skills" -Directory).Name |
  Where-Object { $_ -notin (Get-ChildItem ".github/skills" -Directory).Name }
$missing | ForEach-Object {
  $inh = (Get-Content "../../.github/skills/$_/synapses.json" | ConvertFrom-Json).inheritance
  Write-Host "  $_ : $inh"
}
```

**Expected exclusions** (should NOT be in heir):
- `master-only`: heir-curation, master-alex-audit, release-preflight, release-process
- `heir:m365`: m365-agent-debugging, teams-app-patterns

### What Gets Synced

| Source                                 | Destination                  | Rule                                 |
| -------------------------------------- | ---------------------------- | ------------------------------------ |
| Root `.github/skills/*`                | Heir `.github/skills/`       | Copy if `inheritable` or `universal` |
| Root `.github/instructions/`           | Heir `.github/instructions/` | Always copy                          |
| Root `.github/prompts/`                | Heir `.github/prompts/`      | Always copy                          |
| Root `.github/config/`                 | Heir `.github/config/`       | Always copy                          |
| Root `.github/agents/`                 | Heir `.github/agents/`       | Always copy                          |
| Root `.github/copilot-instructions.md` | Heir                         | Always copy                          |

## 📖 Documentation

### README.md

- [ ] **Banner image** uses raw GitHub URL (not relative path)
  - ✅ `https://raw.githubusercontent.com/fabioc-aloha/Alex_Plug_In/main/.github/assets/banner.svg`
  - ❌ `assets/banner.png` or relative paths
- [ ] **All external links** use full GitHub URLs
  - LICENSE.md → `https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/LICENSE.md`
  - CONTRIBUTING.md → `https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/CONTRIBUTING.md`
  - CHANGELOG.md → `https://github.com/fabioc-aloha/Alex_Plug_In/blob/main/CHANGELOG.md`
- [ ] **Navigation anchors** work (test with emoji headings)
- [ ] **Feature counts** are accurate (slash commands, tools, agents)
- [ ] **Upgrade section** documents migration from previous version

### CHANGELOG.md

- [ ] New version section at top
- [ ] All new features documented under "Added"
- [ ] Breaking changes documented under "Changed"
- [ ] Bug fixes documented under "Fixed"
- [ ] Date matches release date

### UPGRADE-INSTRUCTIONS.md

- [ ] Version number updated
- [ ] Schema version history table current
- [ ] Manifest example shows current version

### Landing Page (docs/index.html)

- [ ] **Version number** matches release version
- [ ] **Feature stats** are current (skills count, TTS languages, research sources)
- [ ] **Feature descriptions** reflect latest capabilities
- [ ] Push changes — site auto-deploys via GitHub Pages

## 🎨 Lint Compliance

Run `get_errors` in VS Code or check Problems panel:

- [ ] **README.md** - 0 errors
- [ ] **UPGRADE-INSTRUCTIONS.md** - 0 errors
- [ ] **CHANGELOG.md** - Only expected MD024 warnings (repeated headings)

### Common Lint Rules

| Rule  | Description           | Fix                                            |
| ----- | --------------------- | ---------------------------------------------- |
| MD033 | Inline HTML           | Use Markdown syntax instead                    |
| MD036 | Emphasis as heading   | Use proper `###` headings                      |
| MD040 | Fenced code language  | Add language identifier (e.g., `bash`, `text`) |
| MD051 | Invalid link fragment | Check anchor matches heading ID                |
| MD058 | Blanks around tables  | Add blank lines before/after tables            |

## 🔗 API Compliance (Microsoft Docs)

### Chat Participant API

- [ ] `chatParticipants` contribution has valid `id`, `name`, `description`
- [ ] Slash commands have `name` and `description`
- [ ] Handler returns proper `ChatResult`

### Language Model Tools API

- [ ] Each tool has `toolReferenceName` (for `#tool` references)
- [ ] Each tool has `name`, `displayName`, `description`
- [ ] `modelDescription` explains when AI should use the tool
- [ ] Input schema uses valid JSON Schema

### Custom Agents

- [ ] Agent files in `.github/agents/` folder
- [ ] Each agent has valid YAML frontmatter
- [ ] Tools and handoffs properly defined

## 📦 Package Contents

### Files Included

- [ ] `assets/icon.png` - Extension icon (128x128 or 256x256)
- [ ] `.github/assets/banner.svg` - README banner (animated)
- [ ] `dist/extension.js` - Bundled extension code
- [ ] `README.md` - Marketplace description
- [ ] `CHANGELOG.md` - Version history
- [ ] `LICENSE.md` - License file
- [ ] `.github/` - Cognitive architecture files
- [ ] `domain-knowledge/` - Domain knowledge files
- [ ] `config/` - Configuration templates

### Files Excluded (via .vscodeignore)

- [ ] `src/` - Source TypeScript files
- [ ] `node_modules/` - Dependencies
- [ ] `.git/` - Git history
- [ ] `*.ts` - TypeScript source
- [ ] Test files

## 🚀 Upgrade Path Testing

### From v1.5.x → v2.0.0

- [ ] `Alex: Upgrade Architecture` command works
- [ ] Backup created in `archive/upgrades/`
- [ ] System files updated
- [ ] User files preserved
- [ ] New folders created:
  - [ ] `.github/agents/` (5 agent files)
  - [ ] `config/` templates
- [ ] Migration tasks generated for schema changes

### Fresh Install

- [ ] `Alex: Initialize Architecture` deploys all files
- [ ] Chat participant `@alex` responds
- [ ] All 7 slash commands work
- [ ] All 5 Language Model Tools accessible
- [ ] `Alex: Dream` generates health report

## ✅ Final Verification

```powershell
# 1. Clean build
npm run compile

# 2. Package extension
vsce package

# 3. Test install locally
code --install-extension alex-cognitive-architecture-2.0.0.vsix

# 4. Open test workspace and verify:
#    - Initialize works
#    - @alex responds in chat
#    - /status shows correct version
#    - Dream protocol runs
```

## 🔑 Personal Access Token (PAT)

Before publishing, ensure your PAT is valid:

- [ ] **PAT not expired** - Check expiration date
- [ ] **Correct scope** - Must have "Marketplace > Manage" permission
- [ ] **Correct organization** - "All accessible organizations" or your specific org

### Check PAT Status

```powershell
# This will fail if PAT is expired
vsce verify-pat fabioc-aloha
```

### Create New PAT

1. Go to: [Azure DevOps Tokens](https://dev.azure.com/fabioc-aloha/_usersSettings/tokens)
2. Click **"+ New Token"**
3. Configure:
   - **Name**: `vsce-publish`
   - **Organization**: All accessible organizations
   - **Expiration**: 90 days (or custom)
   - **Scopes**: Marketplace → Manage (check the box)
4. Click **Create** and copy token immediately (won't be shown again)

### Login with New PAT

```powershell
# Option 1: Use PAT from .env file (recommended)
$env:VSCE_PAT = (Get-Content .env | Select-String "VSCE_PAT" | ForEach-Object { $_.Line.Split("=")[1] })
vsce publish -p $env:VSCE_PAT

# Option 2: Login once (stores token)
vsce login fabioc-aloha
# Paste PAT when prompted

# Option 3: One-time publish with PAT
vsce publish -p YOUR_PAT_HERE
```

> **Note**: Current PAT is stored in `.env` file (gitignored). Check expiration date before publishing.

### PAT Expiration Reminder

Set a calendar reminder 1 week before PAT expiration to renew it.

| PAT Created | Expires (90 days) | Reminder Date |
| ----------- | ----------------- | ------------- |
| 2026-01-19  | 2026-04-19        | 2026-04-12    |

## 📡 Post-Publishing Verification

After publishing, verify the release is live on the Marketplace:

### Quick Check

```powershell
# Show extension info including version and stats
vsce show fabioc-aloha.alex-cognitive-architecture
```

### Expected Output

```text
Alex Cognitive Architecture
fabioc-aloha | ↓ N installs | ★★★★★ (N)

  Version  Last Updated
  X.Y.Z    Month DD, YYYY    ← Should show new version
  ...

Statistics:
  install         N installs
  updateCount     N updates
  downloadCount   N downloads
```

### Propagation Time

- **Marketplace API**: 1-5 minutes
- **VS Code Extension Search**: 5-15 minutes
- **Extension Update Notification**: Up to 24 hours

### Additional Verification

- [ ] Visit [Marketplace page](https://marketplace.visualstudio.com/items?itemName=fabioc-aloha.alex-cognitive-architecture)
- [ ] Verify version number in "Version History" tab
- [ ] Test "Install" button downloads new version
- [ ] Check [Publisher Hub](https://marketplace.visualstudio.com/manage/publishers/fabioc-aloha/extensions/alex-cognitive-architecture/hub) for stats

### Troubleshooting

If version not showing after 15 minutes:

```powershell
# Check publish status
vsce show fabioc-aloha.alex-cognitive-architecture --json | ConvertFrom-Json | Select-Object -ExpandProperty versions | Select-Object -First 3
```

## 📝 Release Notes Template

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- Feature 1
- Feature 2

### Changed
- Change 1

### Fixed
- Bug fix 1

### Migration Notes
- Note for upgraders
```

---

Last updated: January 19, 2026 - v2.0.0 BINILNILIUM
