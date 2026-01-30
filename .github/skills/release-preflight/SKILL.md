---
applyTo: "**/*release*,**/*publish*,**/*deploy*,**/*version*,**/package.json,**/CHANGELOG*"
---

# Release Preflight Skill

> Pre-checks, version consistency, and deployment discipline.

## The Golden Rule

> **NEVER publish without running the preflight checklist.**

## Version Locations (Must Stay Synchronized)

| Location | Field | Example |
| -------- | ----- | ------- |
| `package.json` | `version` | `"3.7.0"` |
| `CHANGELOG.md` | Latest heading | `## [3.7.0] - 2026-01-30` |
| README badge (if any) | Version badge | `v3.7.0` |
| Git tag | Tag name | `v3.7.0` |

## Preflight Checklist

Run BEFORE every release:

```powershell
# 1. Version check - are all locations synchronized?
$pkg = Get-Content package.json | ConvertFrom-Json
Write-Host "package.json version: $($pkg.version)"

$changelog = Get-Content CHANGELOG.md | Select-Object -First 20
Write-Host "CHANGELOG latest:`n$($changelog -join "`n")"

# 2. Build check - does it compile?
npm run compile
if ($LASTEXITCODE -ne 0) { throw "Build failed!" }

# 3. Lint check - any errors?
npm run lint
if ($LASTEXITCODE -ne 0) { throw "Lint failed!" }

# 4. Test check - do tests pass?
npm test
if ($LASTEXITCODE -ne 0) { throw "Tests failed!" }

# 5. Package check - does it package?
npx vsce package --no-dependencies
if ($LASTEXITCODE -ne 0) { throw "Package failed!" }

Write-Host "✅ Preflight complete - ready to publish"
```

## Version Bump Workflow

```powershell
# 1. Decide version type
$bumpType = "patch"  # patch | minor | major

# 2. Bump package.json
npm version $bumpType --no-git-tag-version

# 3. Get new version
$newVersion = (Get-Content package.json | ConvertFrom-Json).version

# 4. Update CHANGELOG (add new section at top)
# ## [$newVersion] - $(Get-Date -Format 'yyyy-MM-dd')

# 5. Commit
git add -A
git commit -m "chore: bump version to $newVersion"

# 6. Tag
git tag "v$newVersion"

# 7. Push
git push && git push --tags
```

## Publishing Workflow (VS Code Extension)

```powershell
# Ensure PAT is set
if (-not $env:VSCE_PAT) {
    $env:VSCE_PAT = (Get-Content .env | Select-String "VSCE_PAT").Line.Split("=",2)[1]
}

# Publish
vsce publish

# If version collision error:
# 1. npm version patch --no-git-tag-version
# 2. Update CHANGELOG
# 3. git commit + tag + push
# 4. Retry vsce publish
```

## Common Mistakes We've Made

| Mistake | Prevention |
| ------- | ---------- |
| Published without version bump | Run preflight checklist |
| CHANGELOG not updated | Include in version bump workflow |
| Forgot to push tags | `git push --tags` in workflow |
| Published broken build | `npm run compile` in preflight |
| Version mismatch between files | Single source of truth (package.json), derive others |

## Pre-Release vs Release

| Type | Tag Format | Marketplace |
| ---- | ---------- | ----------- |
| Pre-release | `3.7.0-beta.1` | Shows as pre-release |
| Release | `3.7.0` | Shows as stable |

```powershell
# Pre-release
vsce publish --pre-release

# Stable release
vsce publish
```

## M365 Agent Deployment

```powershell
# Package
npx teamsapp package --env local

# Validate
npx teamsapp validate --package-file appPackage/build/*.zip

# Upload to Developer Portal manually
```

## Rollback Plan

If a release is broken:

```powershell
# 1. Unpublish (VS Code Marketplace)
vsce unpublish fabioc-aloha.alex-cognitive-architecture

# 2. Or publish previous version quickly
git checkout v3.6.0
vsce publish

# 3. Investigate and fix
git checkout main
# Fix the issue
# Go through full release workflow again
```

## Automation Script Location

Create and maintain: `scripts/release-preflight.ps1`

## Synapses

See [synapses.json](synapses.json) for connections.
