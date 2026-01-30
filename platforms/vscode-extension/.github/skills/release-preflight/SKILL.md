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

## Platform-Specific Versioning

### VS Code Marketplace Requirements

| Requirement | Rule |
| ----------- | ---- |
| Format | SemVer (`major.minor.patch`) |
| Pre-release | Add `--pre-release` flag, NOT version suffix |
| Version collision | MUST increment; can't overwrite |
| Engine compatibility | `engines.vscode` must match target |

```powershell
# Pre-release (same version number, flag-based)
vsce publish --pre-release

# Stable release
vsce publish
```

### M365 Developer Portal Requirements

| Requirement | Rule |
| ----------- | ---- |
| Format | SemVer in manifest.json |
| App ID | GUID, immutable after creation |
| Validation | Must pass `teamsapp validate` |
| Submission | Manual upload to Developer Portal |
| Updates | New package upload, same App ID |

```json
// appPackage/manifest.json
{
  "version": "4.0.0",
  "id": "{{APP_ID}}"
}
```

### Version Independence

Heirs can version independently from Master Alex:

| Component | Current | Notes |
| --------- | ------- | ----- |
| Master Alex | 3.x.x | Architecture version |
| VS Code Extension | 3.x.x | Aligned with Master |
| M365 Agent | 4.x.x | Can diverge (different maturity) |

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

Run with: `.\scripts\release-preflight.ps1 -Package`

---

## Complete Release Scripts

### Full Release Script (VS Code Extension)

```powershell
# scripts/release-vscode.ps1
param(
    [Parameter(Mandatory)][ValidateSet("patch","minor","major")][string]$BumpType,
    [switch]$PreRelease,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
Push-Location (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))

Write-Host "`n🚀 Starting VS Code Extension Release" -ForegroundColor Cyan

# 1. Run preflight
Write-Host "`n📋 Running preflight checks..." -ForegroundColor Yellow
.\scripts\release-preflight.ps1 -Package
if ($LASTEXITCODE -ne 0) { throw "Preflight failed!" }

# 2. Bump version
Write-Host "`n📈 Bumping version ($BumpType)..." -ForegroundColor Yellow
npm version $BumpType --no-git-tag-version
$newVersion = (Get-Content package.json | ConvertFrom-Json).version
Write-Host "   New version: $newVersion" -ForegroundColor Green

# 3. Update CHANGELOG
Write-Host "`n📝 Updating CHANGELOG..." -ForegroundColor Yellow
$date = Get-Date -Format "yyyy-MM-dd"
$changelog = Get-Content CHANGELOG.md -Raw
$newEntry = "## [$newVersion] - $date`n`n### Added`n`n### Changed`n`n### Fixed`n`n"
$changelog = $changelog -replace '(# Changelog\s*\n)', "`$1`n$newEntry"
Set-Content CHANGELOG.md $changelog
Write-Host "   Added entry for $newVersion" -ForegroundColor Green

if ($DryRun) {
    Write-Host "`n⚠️ DRY RUN - Stopping before commit" -ForegroundColor Yellow
    Pop-Location
    exit 0
}

# 4. Commit and tag
Write-Host "`n📦 Committing and tagging..." -ForegroundColor Yellow
git add -A
git commit -m "chore: release v$newVersion"
git tag "v$newVersion"
Write-Host "   Tagged: v$newVersion" -ForegroundColor Green

# 5. Push
Write-Host "`n⬆️ Pushing to remote..." -ForegroundColor Yellow
git push
git push --tags

# 6. Publish
Write-Host "`n🎯 Publishing to marketplace..." -ForegroundColor Yellow
if (-not $env:VSCE_PAT) {
    $envFile = ".env"
    if (Test-Path $envFile) {
        $env:VSCE_PAT = (Get-Content $envFile | Select-String "VSCE_PAT").Line.Split("=",2)[1]
    } else {
        throw "VSCE_PAT not set and .env not found"
    }
}

if ($PreRelease) {
    vsce publish --pre-release
} else {
    vsce publish
}

Write-Host "`n✅ Release v$newVersion complete!" -ForegroundColor Green
Pop-Location
```

### M365 Agent Release Script

```powershell
# scripts/release-m365.ps1
param([switch]$Validate)

$ErrorActionPreference = "Stop"
Push-Location "platforms/m365-copilot"

Write-Host "`n🚀 M365 Copilot Agent Release" -ForegroundColor Cyan

# 1. Package
Write-Host "`n📦 Packaging agent..." -ForegroundColor Yellow
npx teamsapp package --env local

# 2. Validate
Write-Host "`n✅ Validating package..." -ForegroundColor Yellow
$pkg = Get-ChildItem "appPackage/build/*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
npx teamsapp validate --package-file $pkg.FullName

if ($Validate) {
    Write-Host "`n⚠️ Validation only - stopping here" -ForegroundColor Yellow
    Pop-Location
    exit 0
}

Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Go to https://dev.teams.microsoft.com/apps" -ForegroundColor Gray
Write-Host "   2. Upload package: $($pkg.Name)" -ForegroundColor Gray
Write-Host "   3. Test in Teams/M365 Copilot" -ForegroundColor Gray
Write-Host "   4. Submit for approval if ready" -ForegroundColor Gray

Pop-Location
```

---

## Pre-Check Methodology

### The 5-Gate Model

Every release must pass through 5 gates:

```text
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ GATE 1  │ → │ GATE 2  │ → │ GATE 3  │ → │ GATE 4  │ → │ GATE 5  │
│ Version │   │  Build  │   │  Test   │   │ Package │   │  Human  │
│  Sync   │   │  Check  │   │  Check  │   │  Check  │   │ Review  │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
     ↓             ↓             ↓             ↓             ↓
  Automatic    Automatic    Automatic    Automatic     Manual
```

### Gate 1: Version Synchronization

```powershell
function Test-VersionSync {
    $pkg = (Get-Content package.json | ConvertFrom-Json).version
    $changelog = (Select-String -Path CHANGELOG.md -Pattern '\[(\d+\.\d+\.\d+)\]' |
                  Select-Object -First 1).Matches.Groups[1].Value

    if ($pkg -ne $changelog) {
        throw "Version mismatch: package.json ($pkg) != CHANGELOG ($changelog)"
    }
    Write-Host "✅ Versions synchronized: $pkg"
}
```

### Gate 2: Build Verification

```powershell
function Test-Build {
    npm run compile 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
    Write-Host "✅ Build successful"
}
```

### Gate 3: Test Execution

```powershell
function Test-Tests {
    npm test 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Tests failed" }
    Write-Host "✅ Tests passed"
}
```

### Gate 4: Package Creation

```powershell
function Test-Package {
    npx vsce package --no-dependencies 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Package failed" }
    Write-Host "✅ Package created"
}
```

### Gate 5: Human Review

- [ ] CHANGELOG has meaningful entries
- [ ] README is current
- [ ] No debug code left in
- [ ] No secrets in codebase
- [ ] Breaking changes documented

---

## Version Rationalization

### Single Source of Truth

```text
package.json  ←─── THE SOURCE
     │
     ├──→ CHANGELOG.md (derived)
     ├──→ Git tag (derived)
     └──→ README badge (derived)
```

### Automated Sync Script

```powershell
# scripts/sync-versions.ps1
$version = (Get-Content package.json | ConvertFrom-Json).version

# Check CHANGELOG has this version
if (-not (Select-String -Path CHANGELOG.md -Pattern "\[$version\]" -Quiet)) {
    Write-Host "⚠️ CHANGELOG missing entry for $version" -ForegroundColor Yellow
}

# Check git tag exists
$tag = git tag -l "v$version"
if (-not $tag) {
    Write-Host "⚠️ Git tag v$version not found" -ForegroundColor Yellow
}

Write-Host "Version: $version"
```

## Synapses

See [synapses.json](synapses.json) for connections.
