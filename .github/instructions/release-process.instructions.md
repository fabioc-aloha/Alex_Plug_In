---
description: "Version control, changelog generation, and publish workflows for software releases"
application: "When preparing releases, managing versions, or publishing packages"
applyTo: "**/*release*,**/*publish*,**/*version*,**/*changelog*"
---

# Release Process

Quick-reference for software releases. See [release-process skill](.github/skills/release-process/SKILL.md) for detailed procedures.

## Release Commands

```powershell
# VS Code Extension
.\scripts\release-vscode.ps1 -BumpType patch              # Stable
.\scripts\release-vscode.ps1 -BumpType minor -PreRelease  # Pre-release
.\scripts\release-vscode.ps1 -BumpType patch -DryRun      # Test mode

# Manual (from platforms/vscode-extension)
npx vsce publish                # Stable
npx vsce publish --pre-release  # Pre-release
```

## Pre-Release Checklist

| Check | Command | Pass Criteria |
|-------|---------|---------------|
| Tests | `npm test` | All pass |
| Build | `npm run compile` | Zero errors |
| Lint | `npm run lint` | Zero warnings |
| Git | `git status` | Clean working tree |
| Version | Check package.json | Matches CHANGELOG |
| PAT | Check `$env:VSCE_PAT` | Set and not expired |

## Versioning (SemVer)

```text
MAJOR.MINOR.PATCH
  │     │     └── Bug fixes, docs
  │     └──────── New features, non-breaking
  └────────────── Breaking changes
```

| Change Type | Example | Version Bump |
|-------------|---------|--------------|
| Breaking API change | Removed command | Major (X.0.0) |
| New feature | Added skill | Minor (x.X.0) |
| Bug fix | Fixed crash | Patch (x.x.X) |

## Release Flow

```text
1. Preflight → 2. Version Bump → 3. CHANGELOG → 4. Commit+Tag → 5. Push → 6. Publish
```

### Files to Update

| File | Field | Automation |
|------|-------|------------|
| `package.json` | `version` | Script handles |
| `CHANGELOG.md` | `## [X.Y.Z]` section | Manual entry |
| Heir `copilot-instructions.md` | `**Version**:` | Script handles |

## PAT Setup (VS Code Marketplace)

1. Go to marketplace.visualstudio.com/manage/publishers
2. Click publisher → "..." → "Generate new token"
3. Copy immediately (shown once)
4. Set: `$env:VSCE_PAT = "your-token"`

**PAT Scope**: Marketplace → Manage

## Common Issues

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | PAT expired | Create new PAT |
| Version exists | Same version published | Bump version |
| Preflight fails | Tests/lint errors | Fix before release |
| Tag exists | Tag already pushed | Delete or bump |

### Retry After PAT Fix

```powershell
# Skip full rebuild, use existing VSIX
$env:VSCE_PAT = "new-token"
npx vsce publish --packagePath alex-cognitive-architecture-X.Y.Z.vsix
```

## Definition of Done

- [ ] Builds clean (zero errors)
- [ ] Tests pass
- [ ] No dead code
- [ ] Counts match reality (skills, commands)
- [ ] Version aligned across files
- [ ] Heir sync clean
- [ ] CHANGELOG documents delta
- [ ] F5 smoke test passes

## Rollback

```powershell
# Unpublish if critical issue found
npx vsce unpublish <publisher>.<extension>@X.Y.Z

# Or publish previous version
npx vsce publish --packagePath <previous-version>.vsix
```

## Anti-Patterns

| Bad Practice | Consequence | Instead |
|--------------|-------------|---------|
| Skip tests | Ship bugs | Always run preflight |
| Manual version edits | Drift/mismatch | Use release script |
| No tags | Can't rollback | Always tag releases |
| Skip changelog | Users confused | Document every change |
| Expired PAT | 401 at publish | Fresh PAT each release |
