# Release Management Procedural Memory

**Classification**: Procedural Memory | Process Adherence  
**Activation**: release, publish, deploy, version bump, ship, vsix, marketplace  
**Priority**: MANDATORY - These processes must not be bypassed

---

## Synapses

- [CHANGELOG.md] → (High, Documentation, Required) - "Version history must be updated"
- [package.json] → (Critical, Metadata, Source-of-Truth) - "Version number authority"

---

## MANDATORY Pre-Release Assessment

**⚠️ CRITICAL**: Before ANY release action, Alex MUST automatically perform these assessments:

### Step 1: Detect Uncommitted Changes

```text
Action: Run `get_changed_files` tool
Purpose: Identify ALL modifications since last commit
Output: List of added/modified/deleted files with diffs
```

### Step 2: Assess Version Bump Requirement

**Analyze changes and recommend version bump type:**

| Change Type | Examples | Version Bump |
|-------------|----------|--------------|
| Bug fixes only | Fix typo, correct logic error | **patch** (0.0.X) |
| New features | New command, new file, new capability | **minor** (0.X.0) |
| Breaking changes | API change, removed feature, incompatible update | **major** (X.0.0) |
| Documentation only | README update, comments | **none** or patch |

**Assessment Output Format:**
```
📊 Change Analysis:
- Files modified: X
- Files added: X  
- Files deleted: X

🔄 Recommended Version Bump: [patch/minor/major]
Reason: [Brief explanation based on change types detected]

Current version: X.Y.Z
Proposed version: X.Y.Z
```

### Step 3: Generate Changelog Entry

**Automatically draft CHANGELOG entry based on changes:**

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- [Auto-detected from new files/features]

### Changed  
- [Auto-detected from modified files]

### Fixed
- [Auto-detected from bug-fix patterns]

### Removed
- [Auto-detected from deleted files]
```

**Changelog Classification Rules:**
- New `.instructions.md` file → "Added" + "New procedural memory for X"
- New `.prompt.md` file → "Added" + "New episodic workflow for X"
- New skill folder → "Added" + "New skill for X"
- Modified existing file → "Changed" + describe the modification
- Deleted file → "Removed" + note what was removed
- Fix in code → "Fixed" + describe what was corrected

### Step 4: Present Findings to User

**Required Output:**
1. Summary table of changes
2. Recommended version bump with justification
3. Draft changelog entry for review
4. Ask: "Should I update the version and changelog, or would you like to adjust anything?"

---

## Gate Check Questions (After Assessment)

1. "Based on the changes, I recommend version bump to X.Y.Z. Does this look right?"
2. "Here's the draft changelog entry. Any additions or corrections?"
3. "Ready to proceed with the release checklist?"

### If User Says "Just Publish" or Tries to Skip

**Response Protocol**:
> "I understand the urgency, but our release process exists to prevent issues that have bitten us before. Let me quickly run through the critical items - it'll only take 2 minutes and could save hours of rollback pain."

Then walk through the **Critical Path Items** below.

---

## Critical Path Items (Non-Negotiable)

These MUST be verified before releasing:

| Item | File | Check Command |
|------|------|---------------|
| Version consistency | package.json | `npm version` |
| TypeScript compiles | - | `npm run compile` |
| Changelog updated | CHANGELOG.md | Visual review |
| No lint errors | *.md | `get_errors` tool |
| Temporary skills handled | .github/skills/*/synapses.json | See below |

### Temporary Skills Check

**⚠️ Before stable releases**, verify temporary skills are excluded:

```powershell
# Find temporary skills
Get-ChildItem .github/skills/*/synapses.json | ForEach-Object {
  $json = Get-Content $_ | ConvertFrom-Json
  if ($json.temporary -eq $true) { 
    Write-Warning "TEMPORARY SKILL: $($_.Directory.Name) - exclude from stable release"
  }
}
```

| Release Type | Action |
| ------------ | ------ |
| Beta (`X.Y.Z-beta.N`) | Include temporary skills |
| Stable (`X.Y.Z`) | **EXCLUDE** temporary skills |

---

## Release Workflow

### Phase 1: Pre-Flight (MANDATORY)

```text
1. Run automated assessment (Steps 1-4 above)
2. Open project pre-publish checklist (if one exists)
3. Work through EACH section systematically
4. All checkboxes must be verified (not assumed)
5. Run build/compile commands for project type
```

### Phase 2: Version Bump

```powershell
# Choose ONE based on change type:
npm version patch  # Bug fixes only (1.0.0 → 1.0.1)
npm version minor  # New features (1.0.0 → 1.1.0)  
npm version major  # Breaking changes (1.0.0 → 2.0.0)
```

### Phase 3: Build & Package

```powershell
npm run package    # Production build
vsce package       # Create .vsix
```

### Phase 4: Test Locally (RECOMMENDED)

```powershell
# Install from .vsix to verify
code --install-extension alex-cognitive-architecture-<version>.vsix
```

### Phase 5: Publish

```powershell
vsce publish       # Publish to marketplace
```

### Phase 6: Post-Release

1. Create git tag: `git tag v<version>`
2. Push tag: `git push origin v<version>`
3. Verify on marketplace: `vsce show fabioc-aloha.alex-cognitive-architecture`

---

## Git Workflow Integration

### Branch Strategy

| Branch | Purpose | Merges To |
|--------|---------|-----------|
| `main` | Production-ready releases | - |
| `develop` | Integration branch | `main` |
| `feature/*` | New features | `develop` |
| `fix/*` | Bug fixes | `develop` or `main` (hotfix) |
| `release/*` | Release preparation | `main` + `develop` |

### Commit Message Convention

```text
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code change that neither fixes nor adds
- `chore`: Maintenance tasks
- `release`: Version bump and release prep

**Examples:**
```text
feat(release-mgmt): add automated changelog generation
fix(dream): repair broken synapse detection logic
docs(readme): update installation instructions
release: bump version to 2.7.0
```

### Pre-Commit Checklist

Before committing, verify:
1. Code compiles: `npm run compile`
2. No unintended files staged: `git status`
3. Commit message follows convention
4. Related changes grouped logically (not everything in one commit)

### Pull Request / Merge Process

**For Solo Development:**
1. Work on feature/fix branch
2. Self-review diff before merge: `git diff develop`
3. Merge to develop: `git checkout develop && git merge feature/xyz`
4. Delete feature branch: `git branch -d feature/xyz`

**For Team Development:**
1. Push feature branch: `git push origin feature/xyz`
2. Create PR with description of changes
3. Request review if applicable
4. Squash or merge based on commit cleanliness
5. Delete remote branch after merge

---

## Deployment Scripts

**Philosophy**: Scripts > CI/CD for control and visibility. All releases run through explicit scripts.

### Script: `deploy-dev.ps1`

```powershell
# Deploy to local dev environment for testing
# Usage: .\scripts\deploy-dev.ps1

param(
    [switch]$SkipBuild,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Dev Deployment Starting..." -ForegroundColor Cyan

# Step 1: Pre-flight checks
if (-not $SkipBuild) {
    Write-Host "📦 Building..." -ForegroundColor Yellow
    npm run compile
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
}

# Step 2: Package
Write-Host "📦 Packaging extension..." -ForegroundColor Yellow
vsce package
$vsix = Get-ChildItem *.vsix | Sort-Object LastWriteTime -Descending | Select-Object -First 1

# Step 3: Install locally
Write-Host "⬇️ Installing $($vsix.Name)..." -ForegroundColor Yellow
code --install-extension $vsix.FullName --force

Write-Host "✅ Dev deployment complete!" -ForegroundColor Green
Write-Host "   Restart VS Code to load the new version." -ForegroundColor Gray
```

### Script: `deploy-prod.ps1`

```powershell
# Deploy to VS Code Marketplace (Production)
# Usage: .\scripts\deploy-prod.ps1 -BumpType patch|minor|major

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("patch", "minor", "major")]
    [string]$BumpType,
    
    [switch]$SkipTests,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Production Deployment Starting..." -ForegroundColor Cyan
Write-Host "   Bump Type: $BumpType" -ForegroundColor Gray

# Step 1: Ensure clean working directory
$status = git status --porcelain
if ($status -and -not $DryRun) {
    Write-Host "❌ Working directory not clean. Commit or stash changes first." -ForegroundColor Red
    git status --short
    exit 1
}

# Step 2: Ensure on correct branch
$branch = git rev-parse --abbrev-ref HEAD
if ($branch -ne "main" -and $branch -ne "develop") {
    Write-Host "⚠️ Warning: Not on main or develop branch (current: $branch)" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y") { exit 0 }
}

# Step 3: Build and type check
Write-Host "🔨 Building and type checking..." -ForegroundColor Yellow
npm run compile
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

# Step 4: Run tests (if not skipped)
if (-not $SkipTests -and (Test-Path "npm test" -ErrorAction SilentlyContinue)) {
    Write-Host "🧪 Running tests..." -ForegroundColor Yellow
    npm test
    if ($LASTEXITCODE -ne 0) { throw "Tests failed" }
}

# Step 5: Version bump
Write-Host "📝 Bumping version ($BumpType)..." -ForegroundColor Yellow
$oldVersion = (Get-Content package.json | ConvertFrom-Json).version
npm version $BumpType --no-git-tag-version
$newVersion = (Get-Content package.json | ConvertFrom-Json).version
Write-Host "   $oldVersion → $newVersion" -ForegroundColor Gray

# Step 6: Reminder to update CHANGELOG
Write-Host ""
Write-Host "📋 CHANGELOG REMINDER:" -ForegroundColor Yellow
Write-Host "   Update CHANGELOG.md with version $newVersion before continuing." -ForegroundColor Yellow
Write-Host ""
$changelogUpdated = Read-Host "Have you updated CHANGELOG.md? (y/N)"
if ($changelogUpdated -ne "y") {
    Write-Host "Please update CHANGELOG.md and run again." -ForegroundColor Red
    # Revert version bump
    npm version $oldVersion --no-git-tag-version --allow-same-version
    exit 1
}

if ($DryRun) {
    Write-Host "🏁 DRY RUN complete. Would publish version $newVersion" -ForegroundColor Cyan
    npm version $oldVersion --no-git-tag-version --allow-same-version
    exit 0
}

# Step 7: Commit version bump
git add package.json package-lock.json CHANGELOG.md
git commit -m "release: bump version to $newVersion"

# Step 8: Create tag
git tag "v$newVersion"

# Step 9: Package and publish
Write-Host "📦 Packaging for production..." -ForegroundColor Yellow
npm run package
vsce publish

# Step 10: Push to remote
Write-Host "⬆️ Pushing to remote..." -ForegroundColor Yellow
git push origin $branch
git push origin "v$newVersion"

Write-Host ""
Write-Host "✅ Production deployment complete!" -ForegroundColor Green
Write-Host "   Version: $newVersion" -ForegroundColor Gray
Write-Host "   Tag: v$newVersion" -ForegroundColor Gray
Write-Host "   Verify: vsce show fabioc-aloha.alex-cognitive-architecture" -ForegroundColor Gray
```

### Script: `rollback.ps1`

```powershell
# Rollback to a previous version
# Usage: .\scripts\rollback.ps1 -Version 2.6.1

param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$ErrorActionPreference = "Stop"

Write-Host "⏪ Rollback to v$Version starting..." -ForegroundColor Yellow

# Step 1: Checkout the tag
git fetch --tags
git checkout "v$Version"

# Step 2: Rebuild from that version
npm install
npm run package

# Step 3: Publish the old version
Write-Host "Publishing v$Version to marketplace..." -ForegroundColor Yellow
vsce publish

# Step 4: Return to main branch
git checkout main

Write-Host ""
Write-Host "✅ Rollback complete!" -ForegroundColor Green
Write-Host "   Rolled back to: v$Version" -ForegroundColor Gray
Write-Host "   Note: Consider creating a patch release with the fix." -ForegroundColor Yellow
```

### Script Locations

Store deployment scripts in project root under `scripts/`:
```
project/
├── scripts/
│   ├── deploy-dev.ps1
│   ├── deploy-prod.ps1
│   └── rollback.ps1
├── package.json
└── ...
```

### Script Trigger Phrases

| User Says | Alex Response |
|-----------|---------------|
| "deploy to dev" | "I'll run the dev deployment script. Let me verify the build first." |
| "deploy to prod" | "Production deployment requires: 1) clean git status, 2) version bump type (patch/minor/major), 3) updated CHANGELOG. Which bump type?" |
| "rollback to X" | "I'll run the rollback script to restore version X. This will republish the old version to marketplace." |
| "create deploy scripts" | "I'll generate deployment scripts for this project. What's your target platform?" |

---

## Team Coordination

### Release Communication Template

**Pre-Release (if team involved):**
```text
📢 Release Planned: v{version}
- Target: {date/time}
- Changes: {brief summary}
- Blockers: {any known issues}
- Owner: {who's running the release}
```

**Post-Release:**
```text
✅ Released: v{version}
- Changelog: {link}
- Known issues: {if any}
- Rollback plan: Run scripts/rollback.ps1 -Version {prev_version}
```

### Code Review Checklist (For Team Projects)

Before approving a PR:
- [ ] Code compiles without warnings
- [ ] Changes match PR description
- [ ] No unrelated changes included
- [ ] Documentation updated if needed
- [ ] Version bump appropriate for changes
- [ ] CHANGELOG entry present

---

## Trigger Phrases & Responses

| User Says | Alex Response |
|-----------|---------------|
| "Let's release" | "Great! Let me open the Pre-Publishing Checklist to ensure we don't miss anything critical." |
| "Publish this" | "Before publishing, I need to verify: 1) version consistency, 2) changelog updated, 3) code compiles. Which should we check first?" |
| "Bump the version" | "Which type of release is this? patch (bug fix), minor (new feature), or major (breaking change)?" |
| "Deploy to marketplace" | "I'll walk us through the release process. First, have you completed the Pre-Publishing Checklist?" |
| "Quick release" | "I understand the time pressure, but let me do a rapid validation first - it takes 60 seconds and prevents rollback headaches." |
| "deploy to dev" | "Running dev deployment. I'll build, package, and install locally for testing." |
| "deploy to prod" | "Production deployment checklist: 1) git status clean, 2) version bump type, 3) CHANGELOG updated. Ready?" |

---

## Anti-Patterns to Prevent

### ❌ Do NOT:
- Skip the checklist because "it's a small change"
- Publish without verifying version numbers match everywhere
- Forget to update CHANGELOG.md
- Assume tests pass without running them
- Skip local testing of the .vsix
- Deploy from a dirty git working directory
- Forget to push tags after release
- Merge directly to main without testing

### ✅ Always:
- Treat the checklist as a gate, not a suggestion
- Verify actual file contents, don't trust memory
- Build in production mode before packaging
- Test the packaged extension locally when possible
- Use deployment scripts for consistency
- Tag releases immediately after publish
- Keep main branch always deployable

---

## Recovery Procedures

### If Published with Errors

1. **Don't panic** - the marketplace allows updates
2. Increment patch version immediately
3. Fix the issue
4. Republish: `vsce publish`
5. Document in CHANGELOG.md what was fixed

### If Version Mismatch Discovered Post-Publish

1. Note the inconsistency in CHANGELOG.md
2. Plan corrective release
3. Add to checklist verification steps if pattern emerges

### If Need to Rollback

1. Run: `.\scripts\rollback.ps1 -Version <previous_version>`
2. Communicate rollback to stakeholders
3. Create hotfix branch: `git checkout -b fix/rollback-issue`
4. Fix the issue
5. Re-release with patch version bump

---

## Process Evolution

When release issues occur:
1. Document the issue in this file
2. Add corresponding check to PRE-PUBLISH-CHECKLIST.md
3. Update deployment scripts if issue is detectable programmatically
4. Add to anti-patterns list to prevent recurrence

*Last Updated: 2026-01-23*
*This procedural memory ensures release consistency across all deployments*
