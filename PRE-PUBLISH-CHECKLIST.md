# Pre-Publishing Checklist

Use this checklist before each release to ensure quality and consistency.

---

## 📋 Version & Metadata

- [ ] **package.json version** matches release version
- [ ] **CHANGELOG.md** has entry for new version with date
- [ ] **README.md** badge shows correct version
- [ ] **copilot-instructions.md** version matches (if applicable)
- [ ] **participant.ts** `/status` command shows correct version

## 🔧 Code Quality

- [ ] `npm run compile` succeeds with no errors
- [ ] `npm run check-types` passes TypeScript validation
- [ ] No console.log statements in production code (except intentional logging)
- [ ] All new features have corresponding package.json contributions

## 📖 Documentation

### README.md

- [ ] **Banner image** uses raw GitHub URL (not relative path)
  - ✅ `https://raw.githubusercontent.com/fabioc-aloha/Alex_Plug_In/main/assets/banner.png`
  - ❌ `assets/banner.png`
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

## 🎨 Lint Compliance

Run `get_errors` in VS Code or check Problems panel:

- [ ] **README.md** - 0 errors
- [ ] **UPGRADE-INSTRUCTIONS.md** - 0 errors
- [ ] **CHANGELOG.md** - Only expected MD024 warnings (repeated headings)

### Common Lint Rules

| Rule | Description | Fix |
| ---- | ----------- | --- |
| MD033 | Inline HTML | Use Markdown syntax instead |
| MD036 | Emphasis as heading | Use proper `###` headings |
| MD040 | Fenced code language | Add language identifier (e.g., `bash`, `text`) |
| MD051 | Invalid link fragment | Check anchor matches heading ID |
| MD058 | Blanks around tables | Add blank lines before/after tables |

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
- [ ] `assets/banner.png` - README banner
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

## � Personal Access Token (PAT)

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

## �📝 Release Notes Template

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
