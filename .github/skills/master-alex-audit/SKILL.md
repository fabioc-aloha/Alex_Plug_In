# Master Alex Audit

> Comprehensive project audit with 22 automated checks across security, quality, and health

## Overview

**Extends:** [architecture-audit](../architecture-audit/SKILL.md)

Master Alex-specific audit procedures that leverage knowledge of:
- Exact folder structure and file locations
- Heir relationships (VS Code extension, M365 agent)
- Safety imperatives and protection mechanisms
- Build/release workflows
- Platform-specific configurations

**Total Audit Sections:** 22
- **Master-Only (1-9):** Version alignment, heir sync, safety imperatives, build artifacts
- **Inheritable (10-22):** UI, dependencies, security, tests, accessibility, localization, assets, config

## Triggers

- "master audit", "full audit"
- "heir sync check", "platform alignment"
- "pre-release master check"
- "dependency audit", "security audit", "ui audit"
- "test coverage", "accessibility audit", "bundle size"
- Before publishing heirs to marketplace

## Audit Quick Reference

| # | Section | Inheritable | Priority |
|---|---------|-------------|----------|
| 1-9 | Master-Specific | ❌ | 🔴 Critical |
| 10 | UI Audit | ✅ | 🟡 Medium |
| 11 | Dependency Health | ✅ | 🔴 High |
| 12 | TypeScript & Lint | ✅ | 🔴 High |
| 13 | Security | ✅ | 🔴 High |
| 14 | Bundle Size | ✅ | 🟡 Medium |
| 15 | Git Hygiene | ✅ | 🟡 Medium |
| 16 | Changelog | ✅ | 🟡 Medium |
| 17 | API Compatibility | ✅ | 🟡 Medium |
| 18 | Test Coverage | ✅ | 🟡 Medium |
| 19 | Accessibility | ✅ | 🟢 Low |
| 20 | Localization | ✅ | 🟢 Low |
| 21 | Asset Integrity | ✅ | 🟢 Low |
| 22 | Configuration Files | ✅ | 🟢 Low |

## Master-Specific Audit Points

### 1. Version Alignment Across Platforms

Master Alex must maintain version consistency across all platforms:

```powershell
# Canonical version sources
$versionFiles = @{
    "Master" = "platforms/vscode-extension/package.json"
    "Copilot Instructions" = ".github/copilot-instructions.md"
    "M365 Agent" = "platforms/m365-copilot/appPackage/declarativeAgent.json"
    "Changelog" = "CHANGELOG.md"
}

# Extract and compare versions
foreach ($source in $versionFiles.GetEnumerator()) {
    $content = Get-Content $source.Value -Raw
    $version = [regex]::Match($content, '(?:version["\s:]+|Version:\s*|##\s*\[?v?)(\d+\.\d+\.\d+)').Groups[1].Value
    Write-Host "$($source.Key): v$version"
}
```

**Expected State:** All show same version (currently v3.7.3)

### 2. Heir Folder Sync Status

Check that heirs have current copies of inheritable content:

```powershell
# Files that should be synced to heirs
$syncTargets = @(
    @{
        Source = ".github/copilot-instructions.md"
        Heirs = @(
            "platforms/vscode-extension/.github/copilot-instructions.md"
        )
    },
    @{
        Source = ".github/instructions/"
        Heirs = @(
            "platforms/vscode-extension/.github/instructions/"
        )
    },
    @{
        Source = ".github/prompts/"
        Heirs = @(
            "platforms/vscode-extension/.github/prompts/"
        )
    }
)

# Compare file counts and modification dates
foreach ($target in $syncTargets) {
    $sourceCount = (Get-ChildItem $target.Source -Recurse -File).Count
    foreach ($heir in $target.Heirs) {
        if (Test-Path $heir) {
            $heirCount = (Get-ChildItem $heir -Recurse -File).Count
            $diff = $sourceCount - $heirCount
            Write-Host "$($target.Source) -> $heir : $($diff) file difference"
        } else {
            Write-Host "$heir MISSING"
        }
    }
}
```

### 3. Skill Inheritance Audit

Verify inheritable skills are properly deployed to heirs:

```powershell
# Get inheritable skills from catalog
$catalog = Get-Content "alex_docs/SKILLS-CATALOG.md" -Raw
$inheritable = [regex]::Matches($catalog, '\|\s*(\w+-\w+(?:-\w+)*)\s*\|[^|]*\|[^|]*\|\s*✅\s*\|') |
    ForEach-Object { $_.Groups[1].Value }

Write-Host "Inheritable skills: $($inheritable.Count)"

# Check heir skill folders
$heirSkills = Get-ChildItem "platforms/vscode-extension/.github/skills" -Directory |
    Select-Object -ExpandProperty Name

$missing = $inheritable | Where-Object { $_ -notin $heirSkills }
if ($missing) {
    Write-Host "⚠️ Missing from heir: $($missing -join ', ')"
}
```

### 4. Safety Imperative Validation

Verify protection mechanisms are in place:

```powershell
# Critical protection files
$protectionChecks = @(
    @{
        File = ".github/config/MASTER-ALEX-PROTECTED.json"
        Check = '"protected": true'
        Purpose = "Kill switch marker"
    },
    @{
        File = ".vscode/settings.json"
        Check = '"alex.workspace.protectedMode": true'
        Purpose = "Workspace protection setting"
    },
    @{
        File = "platforms/vscode-extension/.vscodeignore"
        Check = "MASTER-ALEX-PROTECTED.json"
        Purpose = "Marker excluded from package"
    }
)

foreach ($check in $protectionChecks) {
    if (Test-Path $check.File) {
        $content = Get-Content $check.File -Raw
        $found = $content -match [regex]::Escape($check.Check)
        $status = if ($found) { "✅" } else { "❌ MISSING" }
        Write-Host "$status $($check.Purpose): $($check.File)"
    } else {
        Write-Host "❌ FILE MISSING: $($check.File)"
    }
}
```

### 5. Build Artifact Verification

Ensure extension package is buildable:

```powershell
cd "platforms/vscode-extension"

# Check TypeScript compiles
npm run compile 2>&1 | Select-Object -Last 5

# Check package.json validity
$pkg = Get-Content "package.json" | ConvertFrom-Json
Write-Host "Extension: $($pkg.name) v$($pkg.version)"
Write-Host "Commands: $($pkg.contributes.commands.Count)"
Write-Host "Tools: $($pkg.contributes.'languageModelTools'.Count)"

# Verify dist exists and is recent
$dist = Get-Item "dist/extension.js" -ErrorAction SilentlyContinue
if ($dist) {
    $age = (Get-Date) - $dist.LastWriteTime
    Write-Host "dist/extension.js age: $([int]$age.TotalMinutes) minutes"
} else {
    Write-Host "⚠️ dist/extension.js not found - run 'npm run compile'"
}
```

### 6. Documentation Cross-Reference Check

Validate key documentation references:

```powershell
# Key cross-references that must exist
$requiredRefs = @(
    @{ Doc = "README.md"; MustLink = "alex_docs/USER-MANUAL.md" },
    @{ Doc = "README.md"; MustLink = "CHANGELOG.md" },
    @{ Doc = ".github/copilot-instructions.md"; MustLink = "RISKS.md" },
    @{ Doc = "RISKS.md"; MustLink = "COMEBACK-PLAN.md" }
)

foreach ($ref in $requiredRefs) {
    $content = Get-Content $ref.Doc -Raw
    $found = $content -match [regex]::Escape($ref.MustLink)
    $status = if ($found) { "✅" } else { "⚠️" }
    Write-Host "$status $($ref.Doc) -> $($ref.MustLink)"
}
```

### 7. Synapse Network Health

Validate cognitive architecture connections:

```powershell
# Run built-in synapse validation
# In VS Code: "Alex: Dream (Neural Maintenance)"

# Or manual check
$synapseFiles = Get-ChildItem ".github/skills/*/synapses.json" -Recurse
Write-Host "Synapse files found: $($synapseFiles.Count)"

# Check for broken connections
$allSkills = Get-ChildItem ".github/skills" -Directory | Select-Object -ExpandProperty Name
foreach ($file in $synapseFiles) {
    $synapses = Get-Content $file | ConvertFrom-Json
    foreach ($conn in $synapses.connections) {
        if ($conn.target -notin $allSkills) {
            Write-Host "⚠️ Broken synapse in $($file.Directory.Name): $($conn.target)"
        }
    }
}
```

### 8. alex_docs Documentation Audit

Comprehensive check of the documentation folder:

```powershell
# === alex_docs AUDIT ===
$alexDocs = "alex_docs"
$issues = @()

# 8a. Version references - should all match current version
Write-Host "`n--- Version References ---"
$currentVersion = "3.7.3"
$versionRefs = Select-String -Path "$alexDocs/*.md" -Pattern '\d+\.\d+\.\d+' -AllMatches
$wrongVersions = $versionRefs | Where-Object { $_.Matches.Value -ne $currentVersion -and $_.Matches.Value -match '^\d+\.\d+\.\d+$' }
if ($wrongVersions) {
    Write-Host "⚠️ Non-current versions found:"
    $wrongVersions | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber) - $($_.Matches.Value)" }
    $issues += "Version drift in alex_docs"
} else {
    Write-Host "✅ All version references current"
}

# 8b. Deprecated terminology
Write-Host "`n--- Deprecated Terms ---"
$deprecated = @(
    @{ Term = 'DK-\*.md'; Replacement = 'skills/*/SKILL.md' },
    @{ Term = 'domain-knowledge/'; Replacement = 'skills/' },
    @{ Term = 'domain knowledge'; Replacement = 'skills' }
)
foreach ($dep in $deprecated) {
    $found = Select-String -Path "$alexDocs/*.md" -Pattern $dep.Term -SimpleMatch
    if ($found) {
        Write-Host "⚠️ '$($dep.Term)' found (use '$($dep.Replacement)'):"
        $found | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber)" }
        $issues += "Deprecated term: $($dep.Term)"
    }
}
if ($issues.Count -eq 0) { Write-Host "✅ No deprecated terms" }

# 8c. Skill count accuracy in docs
Write-Host "`n--- Skill Count Accuracy ---"
$actualSkillCount = (Get-ChildItem ".github/skills" -Directory).Count
$docSkillCounts = Select-String -Path "$alexDocs/*.md" -Pattern '(\d+)\s*skills?' -AllMatches
$wrongCounts = $docSkillCounts | Where-Object {
    $_.Matches | Where-Object { [int]$_.Groups[1].Value -ne $actualSkillCount -and [int]$_.Groups[1].Value -gt 30 }
}
if ($wrongCounts) {
    Write-Host "⚠️ Incorrect skill counts (actual: $actualSkillCount):"
    $wrongCounts | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber) - $($_.Line.Trim())" }
    $issues += "Skill count mismatch"
} else {
    Write-Host "✅ Skill counts accurate"
}

# 8d. Broken internal links
Write-Host "`n--- Internal Links ---"
$mdFiles = Get-ChildItem "$alexDocs/*.md"
$brokenLinks = @()
foreach ($file in $mdFiles) {
    $content = Get-Content $file -Raw
    $links = [regex]::Matches($content, '\[([^\]]+)\]\(([^)]+)\)') | Where-Object { $_.Groups[2].Value -notmatch '^https?://' }
    foreach ($link in $links) {
        $target = $link.Groups[2].Value -replace '#.*$', ''  # Remove anchors
        if ($target -and -not (Test-Path (Join-Path $alexDocs $target)) -and -not (Test-Path $target)) {
            $brokenLinks += "$($file.Name): $($link.Groups[2].Value)"
        }
    }
}
if ($brokenLinks) {
    Write-Host "⚠️ Broken links:"
    $brokenLinks | ForEach-Object { Write-Host "  $_" }
    $issues += "Broken internal links"
} else {
    Write-Host "✅ All internal links valid"
}

# 8e. Diagram accuracy (Mermaid node counts)
Write-Host "`n--- Diagram Checks ---"
$catalogDiagram = Select-String -Path "$alexDocs/SKILLS-CATALOG.md" -Pattern '\[[\w-]+\]' -AllMatches
$diagramNodes = ($catalogDiagram.Matches | Select-Object -ExpandProperty Value | Sort-Object -Unique).Count
Write-Host "Skill network diagram nodes: $diagramNodes (actual skills: $actualSkillCount)"
if ([Math]::Abs($diagramNodes - $actualSkillCount) -gt 2) {
    Write-Host "⚠️ Diagram may be out of sync"
    $issues += "Diagram node count mismatch"
} else {
    Write-Host "✅ Diagram appears current"
}

# Summary
Write-Host "`n--- alex_docs SUMMARY ---"
if ($issues.Count -eq 0) {
    Write-Host "✅ All checks passed" -ForegroundColor Green
} else {
    Write-Host "⚠️ Issues found: $($issues.Count)" -ForegroundColor Yellow
    $issues | ForEach-Object { Write-Host "  - $_" }
}
```

### 9. Skill Network Diagram Audit

Deep validation of the Mermaid skill network diagram in SKILLS-CATALOG.md:

```powershell
# === SKILL NETWORK DIAGRAM AUDIT ===
$catalogFile = "alex_docs/SKILLS-CATALOG.md"
$catalogContent = Get-Content $catalogFile -Raw
$issues = @()

# 9a. Extract all actual skills
$actualSkills = Get-ChildItem ".github/skills" -Directory | Select-Object -ExpandProperty Name
Write-Host "Actual skills: $($actualSkills.Count)"

# 9b. Extract diagram nodes (format: ABBREV[skill-name])
$nodePattern = '(\w+)\[([\w-]+)\]'
$diagramNodes = [regex]::Matches($catalogContent, $nodePattern)
$nodeMap = @{}
foreach ($match in $diagramNodes) {
    $abbrev = $match.Groups[1].Value
    $skillName = $match.Groups[2].Value
    $nodeMap[$skillName] = $abbrev
}
Write-Host "Diagram nodes: $($nodeMap.Count)"

# 9c. Skills missing from diagram
$missingFromDiagram = $actualSkills | Where-Object { $_ -notin $nodeMap.Keys }
if ($missingFromDiagram) {
    Write-Host "`n⚠️ Skills MISSING from diagram:"
    $missingFromDiagram | ForEach-Object { Write-Host "  - $_" }
    $issues += "Missing from diagram: $($missingFromDiagram -join ', ')"
} else {
    Write-Host "✅ All skills have diagram nodes"
}

# 9d. Phantom nodes (in diagram but not actual skills)
$phantomNodes = $nodeMap.Keys | Where-Object { $_ -notin $actualSkills }
if ($phantomNodes) {
    Write-Host "`n⚠️ PHANTOM nodes (skill doesn't exist):"
    $phantomNodes | ForEach-Object { Write-Host "  - $_ ($($nodeMap[$_]))" }
    $issues += "Phantom nodes: $($phantomNodes -join ', ')"
} else {
    Write-Host "✅ No phantom nodes"
}

# 9e. Check class assignments match inheritance
# Extract class definitions
$masterClass = [regex]::Match($catalogContent, 'class\s+([\w,]+)\s+master').Groups[1].Value -split ','
$inheritableClass = [regex]::Match($catalogContent, 'class\s+([\w,]+)\s+inheritable').Groups[1].Value -split ','
$vscodeClass = [regex]::Match($catalogContent, 'class\s+([\w,]+)\s+vscode').Groups[1].Value -split ','
$m365Class = [regex]::Match($catalogContent, 'class\s+([\w,]+)\s+m365').Groups[1].Value -split ','

Write-Host "`nClass assignments:"
Write-Host "  Master: $($masterClass.Count) nodes"
Write-Host "  Inheritable: $($inheritableClass.Count) nodes"
Write-Host "  VS Code: $($vscodeClass.Count) nodes"
Write-Host "  M365: $($m365Class.Count) nodes"

# 9f. Verify master-only skills are in master class
$masterOnlySkills = @(
    'meditation', 'meditation-facilitation', 'knowledge-synthesis', 'global-knowledge',
    'architecture-refinement', 'llm-model-selection', 'self-actualization', 'heir-curation',
    'master-alex-audit'
)
$masterAbbrevs = $masterOnlySkills | ForEach-Object { $nodeMap[$_] } | Where-Object { $_ }
$missingMasterClass = $masterAbbrevs | Where-Object { $_ -notin $masterClass }
if ($missingMasterClass) {
    Write-Host "`n⚠️ Master-only skills not in master class:"
    $missingMasterClass | ForEach-Object { Write-Host "  - $_" }
    $issues += "Master class mismatch"
}

# 9g. Check for orphan nodes (no connections)
$connectionPattern = '(\w+)\s*(?:-->|<-->|-.->)\s*'
$connectedNodes = [regex]::Matches($catalogContent, $connectionPattern) |
    ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
$allAbbrevs = $nodeMap.Values | Sort-Object -Unique
$orphans = $allAbbrevs | Where-Object { $_ -notin $connectedNodes -and $_ -ne 'BT' }  # BT is temp, may be orphan
if ($orphans) {
    Write-Host "`n⚠️ Orphan nodes (no connections):"
    $orphans | ForEach-Object {
        $skill = ($nodeMap.GetEnumerator() | Where-Object { $_.Value -eq $_ }).Key
        Write-Host "  - $_ ($skill)"
    }
    $issues += "Orphan nodes: $($orphans -join ', ')"
} else {
    Write-Host "✅ All nodes connected"
}

# Summary
Write-Host "`n--- DIAGRAM AUDIT SUMMARY ---"
if ($issues.Count -eq 0) {
    Write-Host "✅ Diagram is accurate" -ForegroundColor Green
} else {
    Write-Host "⚠️ Diagram issues: $($issues.Count)" -ForegroundColor Yellow
    $issues | ForEach-Object { Write-Host "  - $_" }
}
```

**Quick diagram check command:**

```powershell
# One-liner to compare skill count vs diagram nodes
$skills = (Get-ChildItem ".github/skills" -Directory).Count
$nodes = ([regex]::Matches((Get-Content "alex_docs/SKILLS-CATALOG.md" -Raw), '\w+\[[\w-]+\]') | Select-Object -ExpandProperty Value | Sort-Object -Unique).Count
Write-Host "Skills: $skills | Diagram nodes: $nodes | $(if($skills -eq $nodes){'✅ MATCH'}else{'⚠️ MISMATCH'})"
```

### 10. Extension UI Audit

Deep inspection of VS Code extension UI elements for dead buttons and non-functional features:

```powershell
# === EXTENSION UI AUDIT ===
$srcPath = "platforms/vscode-extension/src"
$issues = @()

Write-Host "=== UI AUDIT ===" -ForegroundColor Cyan

# 10a. WebView window.open() calls (don't work in WebViews)
Write-Host "`n--- Dead External Links ---"
$windowOpen = Select-String -Path "$srcPath/**/*.ts" -Pattern 'window\.open\(' -Recurse
if ($windowOpen) {
    Write-Host "⚠️ window.open() found (doesn't work in WebViews):"
    $windowOpen | ForEach-Object {
        Write-Host "  $($_.Filename):$($_.LineNumber)"
        $issues += "window.open in $($_.Filename)"
    }
} else {
    Write-Host "✅ No window.open() calls"
}

# 10b. location.reload() calls (don't work in WebViews)
Write-Host "`n--- Dead Reload Buttons ---"
$locationReload = Select-String -Path "$srcPath/**/*.ts" -Pattern 'location\.reload\(\)' -Recurse
if ($locationReload) {
    Write-Host "⚠️ location.reload() found (doesn't work in WebViews):"
    $locationReload | ForEach-Object {
        Write-Host "  $($_.Filename):$($_.LineNumber)"
        $issues += "location.reload in $($_.Filename)"
    }
} else {
    Write-Host "✅ No location.reload() calls"
}

# 10c. Duplicate QuickPick items (same handler, different labels)
Write-Host "`n--- Duplicate QuickPick Items ---"
$extensionTs = Get-Content "$srcPath/extension.ts" -Raw
$goalItems = [regex]::Matches($extensionTs, 'label:\s*"[^"]*Goals[^"]*"')
if ($goalItems.Count -gt 1) {
    Write-Host "⚠️ Multiple 'Goals' quick pick items:"
    $goalItems | ForEach-Object { Write-Host "  - $($_.Value)" }
    $issues += "Duplicate Goals items"
} else {
    Write-Host "✅ No duplicate quick pick items"
}

# 10d. Modal dialogs with buttons that don't do anything unique
Write-Host "`n--- Modal Button Analysis ---"
$modals = Select-String -Path "$srcPath/**/*.ts" -Pattern 'showInformationMessage|showWarningMessage|showErrorMessage' -Recurse
$modalCount = $modals.Count
Write-Host "Found $modalCount modal dialogs to review manually"

# 10e. Message handler coverage check
Write-Host "`n--- WebView Message Handlers ---"
$views = @(
    @{ Name = "welcomeView"; Pattern = "cmd\('(\w+)'\)" },
    @{ Name = "healthDashboard"; Pattern = "command:\s*'(\w+)'" }
)

foreach ($view in $views) {
    $viewFile = Get-ChildItem "$srcPath/views/$($view.Name).ts" -ErrorAction SilentlyContinue
    if ($viewFile) {
        $content = Get-Content $viewFile -Raw

        # Extract onclick commands from HTML
        $cmds = [regex]::Matches($content, $view.Pattern) |
            ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

        # Extract handled cases from switch statement
        $cases = [regex]::Matches($content, "case ['\"](\w+)['\"]") |
            ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

        $unhandled = $cmds | Where-Object { $_ -notin $cases }
        if ($unhandled) {
            Write-Host "⚠️ $($view.Name): Unhandled commands: $($unhandled -join ', ')"
            $issues += "Unhandled in $($view.Name): $($unhandled -join ', ')"
        } else {
            Write-Host "✅ $($view.Name): All commands handled"
        }
    }
}

# 10f. Commands registered but not implemented
Write-Host "`n--- Command Registration Check ---"
$pkgJson = Get-Content "platforms/vscode-extension/package.json" | ConvertFrom-Json
$registeredCmds = $pkgJson.contributes.commands | ForEach-Object { $_.command }
$implementedCmds = Select-String -Path "$srcPath/**/*.ts" -Pattern "registerCommand\(['\"]([^'\"]+)['\"]" -AllMatches -Recurse |
    ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value }

$notImplemented = $registeredCmds | Where-Object { $_ -notin $implementedCmds }
if ($notImplemented) {
    Write-Host "⚠️ Registered but not implemented:"
    $notImplemented | ForEach-Object { Write-Host "  - $_" }
    $issues += "Unimplemented commands: $($notImplemented -join ', ')"
} else {
    Write-Host "✅ All registered commands implemented"
}

# Summary
Write-Host "`n--- UI AUDIT SUMMARY ---"
if ($issues.Count -eq 0) {
    Write-Host "✅ No UI issues found" -ForegroundColor Green
} else {
    Write-Host "⚠️ UI issues: $($issues.Count)" -ForegroundColor Yellow
    $issues | ForEach-Object { Write-Host "  - $_" }
}
```

**Common UI Anti-Patterns to Check:**

| Anti-Pattern | Why It's Dead | Fix |
|--------------|---------------|-----|
| `window.open(url)` | WebViews are sandboxed | Use `vscode.postMessage({command: 'openExternal', url})` + `vscode.env.openExternal()` |
| `location.reload()` | No browser navigation in WebViews | Use `vscode.postMessage({command: 'refresh'})` + re-render HTML |
| `onclick="..."` without handler | Button does nothing | Add case in `onDidReceiveMessage` switch |
| Duplicate quick pick items | Confusing UX | Remove duplicates, keep most descriptive |
| Modal with single info button | Button does nothing useful | Remove button or use only Cancel |

**WebView Button Pattern (Correct):**

```typescript
// In HTML template
<button onclick="vscode.postMessage({command: 'doThing'})">Click Me</button>

// In provider
webview.onDidReceiveMessage(async (message) => {
    switch (message.command) {
        case 'doThing':
            // Actually do something
            vscode.commands.executeCommand('myCommand');
            break;
        case 'openExternal':
            vscode.env.openExternal(vscode.Uri.parse(message.url));
            break;
    }
});
```

**Key files to audit:**

| File | Key Checks |
|------|------------|
| `SKILLS-CATALOG.md` | Skill count, network diagram, inheritance table |
| `COGNITIVE-ARCHITECTURE.md` | Version, component counts |
| `USER-MANUAL.md` | Command list, feature descriptions |
| `PROJECT-STRUCTURE.md` | Folder structure accuracy |
| `MEMORY-SYSTEMS.md` | Memory type descriptions |

---

## Inheritable Audit Checks ✅

> These audit sections can be inherited by heirs (VS Code extension, M365 agent, future platforms).
> They use relative paths and generic patterns that work in any deployment.

### 11. Dependency Health Audit

Check for outdated packages, security vulnerabilities, and unused dependencies:

```powershell
# === DEPENDENCY HEALTH AUDIT ===
$extPath = "platforms/vscode-extension"
Push-Location $extPath

Write-Host "=== DEPENDENCY HEALTH ===" -ForegroundColor Cyan

# 11a. Security vulnerabilities
Write-Host "`n--- Security Audit ---"
$auditResult = npm audit --json 2>$null | ConvertFrom-Json
if ($auditResult.metadata) {
    $vulns = $auditResult.metadata.vulnerabilities
    $total = $vulns.info + $vulns.low + $vulns.moderate + $vulns.high + $vulns.critical
    Write-Host "Vulnerabilities: $total total"
    Write-Host "  Critical: $($vulns.critical) | High: $($vulns.high) | Moderate: $($vulns.moderate)"
    if ($vulns.critical -gt 0 -or $vulns.high -gt 0) {
        Write-Host "⚠️ ACTION REQUIRED: Run 'npm audit fix'" -ForegroundColor Red
    } else {
        Write-Host "✅ No critical/high vulnerabilities" -ForegroundColor Green
    }
} else {
    Write-Host "✅ No vulnerabilities found"
}

# 11b. Outdated packages
Write-Host "`n--- Outdated Packages ---"
$outdated = npm outdated --json 2>$null | ConvertFrom-Json
$outdatedCount = ($outdated.PSObject.Properties | Measure-Object).Count
if ($outdatedCount -gt 0) {
    Write-Host "⚠️ $outdatedCount packages outdated:"
    $outdated.PSObject.Properties | ForEach-Object {
        $pkg = $_.Name
        $curr = $_.Value.current
        $latest = $_.Value.latest
        $type = if ($_.Value.type -eq 'devDependencies') { 'dev' } else { 'prod' }
        Write-Host "  $pkg : $curr → $latest ($type)"
    }
} else {
    Write-Host "✅ All packages up to date"
}

# 11c. Unused dependencies (requires depcheck)
Write-Host "`n--- Unused Dependencies ---"
if (Get-Command depcheck -ErrorAction SilentlyContinue) {
    $unused = npx depcheck --json 2>$null | ConvertFrom-Json
    if ($unused.dependencies.Count -gt 0) {
        Write-Host "⚠️ Possibly unused:"
        $unused.dependencies | ForEach-Object { Write-Host "  - $_" }
    } else {
        Write-Host "✅ No unused dependencies detected"
    }
} else {
    Write-Host "ℹ️ Install depcheck for unused dependency detection: npm i -g depcheck"
}

Pop-Location
```

### 12. TypeScript & Lint Audit

Check for compile errors, ESLint warnings, and code quality issues:

```powershell
# === TYPESCRIPT & LINT AUDIT ===
$extPath = "platforms/vscode-extension"
Push-Location $extPath

Write-Host "=== CODE QUALITY ===" -ForegroundColor Cyan

# 12a. TypeScript compilation
Write-Host "`n--- TypeScript Compile Check ---"
$tscOutput = npm run compile 2>&1
$errors = $tscOutput | Select-String -Pattern 'error TS\d+' -AllMatches
if ($errors) {
    Write-Host "❌ Compile errors found:" -ForegroundColor Red
    $errors | Select-Object -First 10 | ForEach-Object { Write-Host "  $_" }
    if ($errors.Count -gt 10) { Write-Host "  ... and $($errors.Count - 10) more" }
} else {
    Write-Host "✅ TypeScript compiles successfully" -ForegroundColor Green
}

# 12b. ESLint (if configured)
Write-Host "`n--- ESLint Check ---"
if (Test-Path ".eslintrc*" -or (Get-Content "package.json" | Select-String '"eslint"')) {
    $eslintOutput = npx eslint src --format compact 2>&1
    $warnings = ($eslintOutput | Select-String -Pattern 'Warning' -AllMatches).Matches.Count
    $errs = ($eslintOutput | Select-String -Pattern 'Error' -AllMatches).Matches.Count
    Write-Host "Errors: $errs | Warnings: $warnings"
    if ($errs -gt 0) {
        Write-Host "❌ ESLint errors need fixing" -ForegroundColor Red
    } elseif ($warnings -gt 5) {
        Write-Host "⚠️ Consider fixing warnings" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Code quality good" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️ ESLint not configured"
}

# 12c. Unused exports (dead code)
Write-Host "`n--- Unused Exports ---"
$exports = Select-String -Path "src/**/*.ts" -Pattern 'export (function|class|const|interface|type|enum) (\w+)' -Recurse
$exportNames = $exports | ForEach-Object { $_.Matches[0].Groups[2].Value } | Sort-Object -Unique
$unusedExports = @()
foreach ($name in $exportNames) {
    $usages = Select-String -Path "src/**/*.ts" -Pattern "\b$name\b" -Recurse
    if ($usages.Count -le 1) {  # Only the export itself
        $unusedExports += $name
    }
}
if ($unusedExports.Count -gt 0 -and $unusedExports.Count -lt 20) {
    Write-Host "⚠️ Possibly unused exports: $($unusedExports -join ', ')"
} else {
    Write-Host "✅ No obviously unused exports"
}

Pop-Location
```

### 13. Security Audit

Check for secrets in code, CSP compliance, and input sanitization:

```powershell
# === SECURITY AUDIT ===
$extPath = "platforms/vscode-extension"
Write-Host "=== SECURITY ===" -ForegroundColor Cyan

# 13a. Secrets in code
Write-Host "`n--- Secret Scanning ---"
$secretPatterns = @(
    @{ Name = 'API Key'; Pattern = '(?i)(api[_-]?key|apikey)\s*[:=]\s*["\x27]?[\w-]{20,}' },
    @{ Name = 'Password'; Pattern = '(?i)(password|passwd|pwd)\s*[:=]\s*["\x27][^"\x27]{4,}' },
    @{ Name = 'Token'; Pattern = '(?i)(token|secret|bearer)\s*[:=]\s*["\x27][\w-]{20,}' },
    @{ Name = 'Private Key'; Pattern = '-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----' },
    @{ Name = 'Connection String'; Pattern = '(?i)(connection[_-]?string|connstr)\s*[:=]' }
)

$secretsFound = @()
foreach ($pattern in $secretPatterns) {
    $matches = Select-String -Path "$extPath/src/**/*.ts" -Pattern $pattern.Pattern -Recurse
    if ($matches) {
        $secretsFound += "$($pattern.Name): $($matches.Count) potential matches"
        $matches | Select-Object -First 2 | ForEach-Object {
            Write-Host "  ⚠️ $($_.Filename):$($_.LineNumber)" -ForegroundColor Yellow
        }
    }
}
if ($secretsFound.Count -eq 0) {
    Write-Host "✅ No secrets detected in code" -ForegroundColor Green
} else {
    Write-Host "⚠️ Review potential secrets: $($secretsFound -join '; ')" -ForegroundColor Yellow
}

# 13b. WebView CSP (Content Security Policy)
Write-Host "`n--- WebView CSP Check ---"
$webviews = Get-ChildItem "$extPath/src/**/*.ts" -Recurse |
    Select-String -Pattern 'createWebviewPanel|WebviewViewProvider' -List
$cspUsage = Get-ChildItem "$extPath/src/**/*.ts" -Recurse |
    Select-String -Pattern 'Content-Security-Policy|cspSource|getNonce' -List

if ($webviews.Count -gt 0) {
    Write-Host "WebViews found: $($webviews.Count)"
    if ($cspUsage.Count -gt 0) {
        Write-Host "✅ CSP implementation detected" -ForegroundColor Green
    } else {
        Write-Host "⚠️ No CSP found - WebViews may be vulnerable to XSS" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️ No WebViews detected"
}

# 13c. Input sanitization for user data
Write-Host "`n--- Input Sanitization ---"
$userInputs = Select-String -Path "$extPath/src/**/*.ts" -Pattern 'showInputBox|showQuickPick.*editable' -Recurse
$sanitization = Select-String -Path "$extPath/src/**/*.ts" -Pattern 'sanitize|escape|encode|validate' -Recurse
Write-Host "User input points: $($userInputs.Count)"
Write-Host "Sanitization calls: $($sanitization.Count)"
if ($userInputs.Count -gt $sanitization.Count * 2) {
    Write-Host "⚠️ Consider adding input validation" -ForegroundColor Yellow
} else {
    Write-Host "✅ Input handling appears reasonable"
}
```

### 14. Bundle Size & Performance Audit

Check extension size, activation time, and bundle efficiency:

```powershell
# === BUNDLE SIZE AUDIT ===
$extPath = "platforms/vscode-extension"
Write-Host "=== BUNDLE & PERFORMANCE ===" -ForegroundColor Cyan

# 14a. Extension bundle size
Write-Host "`n--- Bundle Size ---"
$distFile = Get-Item "$extPath/dist/extension.js" -ErrorAction SilentlyContinue
if ($distFile) {
    $sizeKB = [math]::Round($distFile.Length / 1KB, 1)
    $sizeMB = [math]::Round($distFile.Length / 1MB, 2)
    Write-Host "Bundle: $sizeKB KB ($sizeMB MB)"
    if ($sizeKB -gt 500) {
        Write-Host "⚠️ Bundle is large - consider code splitting" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Bundle size acceptable" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️ No bundle found - run 'npm run compile'"
}

# 14b. Source map size
$mapFile = Get-Item "$extPath/dist/extension.js.map" -ErrorAction SilentlyContinue
if ($mapFile) {
    $mapSizeKB = [math]::Round($mapFile.Length / 1KB, 1)
    Write-Host "Source map: $mapSizeKB KB"
}

# 14c. node_modules size (dev environment)
Write-Host "`n--- Dependencies Size ---"
$nodeModules = Get-ChildItem "$extPath/node_modules" -Recurse -File -ErrorAction SilentlyContinue |
    Measure-Object -Property Length -Sum
$nmSizeMB = [math]::Round($nodeModules.Sum / 1MB, 1)
Write-Host "node_modules: $nmSizeMB MB"

# 14d. Package size estimate (what gets published)
Write-Host "`n--- Published Package Estimate ---"
$vscodeignore = Get-Content "$extPath/.vscodeignore" -ErrorAction SilentlyContinue
$includedPatterns = @('dist/', 'package.json', 'README.md', 'CHANGELOG.md', 'LICENSE.md', '.github/')
$estimatedFiles = Get-ChildItem $extPath -Recurse -File | Where-Object {
    $path = $_.FullName.Replace("$extPath\", "").Replace('\', '/')
    $included = $false
    foreach ($p in $includedPatterns) {
        if ($path -like "$p*" -or $path -eq $p.TrimEnd('/')) { $included = $true; break }
    }
    $included
}
$pkgSizeKB = [math]::Round(($estimatedFiles | Measure-Object Length -Sum).Sum / 1KB, 1)
Write-Host "Estimated package: ~$pkgSizeKB KB"
if ($pkgSizeKB -gt 1000) {
    Write-Host "⚠️ Package may be large for marketplace" -ForegroundColor Yellow
}
```

### 15. Git Hygiene Audit

Check repository health, uncommitted changes, and branch status:

```powershell
# === GIT HYGIENE AUDIT ===
Write-Host "=== GIT HYGIENE ===" -ForegroundColor Cyan

# 15a. Uncommitted changes
Write-Host "`n--- Working Directory ---"
$status = git status --porcelain
$staged = ($status | Where-Object { $_ -match '^[MADRCU]' }).Count
$unstaged = ($status | Where-Object { $_ -match '^.[MADRCU?]' }).Count
Write-Host "Staged: $staged | Unstaged: $unstaged"
if ($staged -gt 0 -or $unstaged -gt 0) {
    Write-Host "⚠️ Uncommitted changes exist" -ForegroundColor Yellow
    $status | Select-Object -First 10 | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "✅ Working directory clean" -ForegroundColor Green
}

# 15b. Branch status
Write-Host "`n--- Branch Status ---"
$branch = git branch --show-current
$ahead = git rev-list --count '@{u}..HEAD' 2>$null
$behind = git rev-list --count 'HEAD..@{u}' 2>$null
Write-Host "Branch: $branch"
if ($ahead -and $behind) {
    Write-Host "Ahead: $ahead | Behind: $behind"
    if ($behind -gt 0) {
        Write-Host "⚠️ Pull recommended" -ForegroundColor Yellow
    }
    if ($ahead -gt 5) {
        Write-Host "⚠️ Consider pushing commits" -ForegroundColor Yellow
    }
}

# 15c. Large files
Write-Host "`n--- Large Files Check ---"
$largeFiles = Get-ChildItem -Recurse -File |
    Where-Object { $_.Length -gt 1MB -and $_.FullName -notmatch 'node_modules|\.git|dist' } |
    Sort-Object Length -Descending | Select-Object -First 5
if ($largeFiles) {
    Write-Host "⚠️ Large files (>1MB):"
    $largeFiles | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        Write-Host "  $($_.Name): $sizeMB MB"
    }
} else {
    Write-Host "✅ No unexpectedly large files"
}

# 15d. .gitignore effectiveness
Write-Host "`n--- Gitignore Check ---"
$trackedGenerated = git ls-files | Where-Object {
    $_ -match '(node_modules|dist/|\.vsix$|\.log$)'
}
if ($trackedGenerated) {
    Write-Host "⚠️ Generated files tracked in git:"
    $trackedGenerated | Select-Object -First 5 | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "✅ .gitignore working correctly"
}
```

### 16. Changelog Consistency Audit

Validate changelog format and version alignment:

```powershell
# === CHANGELOG AUDIT ===
Write-Host "=== CHANGELOG ===" -ForegroundColor Cyan
$changelogPath = "CHANGELOG.md"

if (Test-Path $changelogPath) {
    $changelog = Get-Content $changelogPath -Raw

    # 16a. Format check (Keep a Changelog format)
    Write-Host "`n--- Format Validation ---"
    $hasUnreleased = $changelog -match '## \[Unreleased\]'
    $hasVersions = [regex]::Matches($changelog, '## \[(\d+\.\d+\.\d+)\]')
    $hasDates = $changelog -match '## \[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}'

    Write-Host "Unreleased section: $(if($hasUnreleased){'✅'}else{'⚠️ Missing'})"
    Write-Host "Version entries: $($hasVersions.Count)"
    Write-Host "Dates format: $(if($hasDates){'✅'}else{'⚠️ Check format'})"

    # 16b. Version order (should be descending)
    Write-Host "`n--- Version Order ---"
    $versions = $hasVersions | ForEach-Object { [version]$_.Groups[1].Value }
    $sorted = $versions | Sort-Object -Descending
    $isOrdered = ($versions -join ',') -eq ($sorted -join ',')
    Write-Host "Chronological order: $(if($isOrdered){'✅'}else{'❌ Out of order'})"

    # 16c. Latest version matches package.json
    Write-Host "`n--- Version Alignment ---"
    $latestChangelog = $hasVersions[0].Groups[1].Value
    $pkgVersion = (Get-Content "platforms/vscode-extension/package.json" | ConvertFrom-Json).version
    Write-Host "Changelog latest: v$latestChangelog"
    Write-Host "Package.json: v$pkgVersion"
    if ($latestChangelog -eq $pkgVersion) {
        Write-Host "✅ Versions match" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Version mismatch - update changelog?" -ForegroundColor Yellow
    }

    # 16d. Change categories (Added, Changed, Fixed, etc.)
    Write-Host "`n--- Change Categories ---"
    $categories = @('Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security')
    $usedCategories = $categories | Where-Object { $changelog -match "### $_" }
    Write-Host "Categories used: $($usedCategories -join ', ')"

} else {
    Write-Host "❌ CHANGELOG.md not found!" -ForegroundColor Red
}
```

### 17. VS Code API Compatibility Audit

Check for deprecated APIs and engine version alignment:

```powershell
# === API COMPATIBILITY AUDIT ===
$extPath = "platforms/vscode-extension"
Write-Host "=== API COMPATIBILITY ===" -ForegroundColor Cyan

# 17a. Engine version
Write-Host "`n--- Engine Version ---"
$pkg = Get-Content "$extPath/package.json" | ConvertFrom-Json
$engineVersion = $pkg.engines.vscode -replace '\^', ''
Write-Host "Required VS Code: $engineVersion"

# Current VS Code version (if running in VS Code terminal)
$currentVSCode = code --version 2>$null | Select-Object -First 1
if ($currentVSCode) {
    Write-Host "Installed VS Code: $currentVSCode"
}

# 17b. Deprecated API usage
Write-Host "`n--- Deprecated APIs ---"
$deprecatedAPIs = @(
    @{ API = 'workspace.rootPath'; Replacement = 'workspace.workspaceFolders' },
    @{ API = 'window.showQuickPick.*canPickMany'; Replacement = 'QuickPickOptions.canPickMany' },
    @{ API = 'ExtensionContext.storagePath'; Replacement = 'ExtensionContext.globalStorageUri' },
    @{ API = 'ExtensionContext.globalStoragePath'; Replacement = 'ExtensionContext.globalStorageUri' },
    @{ API = 'TreeItem.resourceUri'; Replacement = 'TreeItem.resourceUri (check usage)' }
)

$deprecatedFound = @()
foreach ($api in $deprecatedAPIs) {
    $matches = Select-String -Path "$extPath/src/**/*.ts" -Pattern $api.API -Recurse -SimpleMatch
    if ($matches) {
        $deprecatedFound += "$($api.API) → $($api.Replacement)"
    }
}

if ($deprecatedFound.Count -gt 0) {
    Write-Host "⚠️ Deprecated APIs found:"
    $deprecatedFound | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "✅ No deprecated APIs detected"
}

# 17c. Proposed API usage (requires enabledApiProposals)
Write-Host "`n--- Proposed APIs ---"
$proposedAPIs = Select-String -Path "$extPath/src/**/*.ts" -Pattern '@proposed|enableProposedApi' -Recurse
if ($proposedAPIs) {
    Write-Host "⚠️ Proposed APIs in use - ensure enabledApiProposals in package.json"
} else {
    Write-Host "✅ No proposed APIs"
}

# 17d. Activation events
Write-Host "`n--- Activation Events ---"
$activationEvents = $pkg.activationEvents
if ($activationEvents -contains '*') {
    Write-Host "⚠️ Using '*' activation - consider more specific events" -ForegroundColor Yellow
} else {
    Write-Host "Activation events: $($activationEvents.Count)"
    Write-Host "✅ Specific activation events configured"
}
```

### 18. Test Coverage Audit

Check for test files, coverage gaps, and test health:

```powershell
# === TEST COVERAGE AUDIT ===
$extPath = "platforms/vscode-extension"
Write-Host "=== TEST COVERAGE ===" -ForegroundColor Cyan

# 18a. Test file inventory
Write-Host "`n--- Test Files ---"
$testFiles = Get-ChildItem "$extPath" -Recurse -Include "*.test.ts", "*.spec.ts", "*_test.ts" -File
$srcFiles = Get-ChildItem "$extPath/src" -Recurse -Include "*.ts" -File |
    Where-Object { $_.Name -notmatch '\.(test|spec)\.ts$' }

Write-Host "Source files: $($srcFiles.Count)"
Write-Host "Test files: $($testFiles.Count)"

if ($testFiles.Count -eq 0) {
    Write-Host "⚠️ No test files found" -ForegroundColor Yellow
} else {
    $ratio = [math]::Round($testFiles.Count / $srcFiles.Count * 100, 1)
    Write-Host "Test ratio: $ratio%"
}

# 18b. Check for test framework
Write-Host "`n--- Test Framework ---"
$pkg = Get-Content "$extPath/package.json" | ConvertFrom-Json
$testFrameworks = @('mocha', 'jest', 'vitest', '@vscode/test-electron')
$foundFramework = $testFrameworks | Where-Object {
    $pkg.devDependencies.$_ -or $pkg.dependencies.$_
}
if ($foundFramework) {
    Write-Host "✅ Test framework: $($foundFramework -join ', ')"
} else {
    Write-Host "⚠️ No test framework detected"
}

# 18c. Files without tests
Write-Host "`n--- Coverage Gaps ---"
$testedModules = $testFiles | ForEach-Object {
    $_.BaseName -replace '\.(test|spec)$', ''
}
$untestedFiles = $srcFiles | Where-Object {
    $baseName = $_.BaseName
    $baseName -notin $testedModules -and
    $baseName -notmatch '^(index|types|constants|interfaces)$'
} | Select-Object -First 10

if ($untestedFiles.Count -gt 0) {
    Write-Host "Files potentially missing tests:"
    $untestedFiles | ForEach-Object { Write-Host "  - $($_.Name)" }
} else {
    Write-Host "✅ Good test coverage"
}

# 18d. Run tests if available
Write-Host "`n--- Test Execution ---"
if ($pkg.scripts.test) {
    Write-Host "Test command available: npm test"
    Write-Host "ℹ️ Run 'npm test' to execute tests"
} else {
    Write-Host "⚠️ No test script in package.json"
}
```

### 19. Accessibility Audit

Check WebViews for accessibility compliance:

```powershell
# === ACCESSIBILITY AUDIT ===
$extPath = "platforms/vscode-extension"
Write-Host "=== ACCESSIBILITY ===" -ForegroundColor Cyan

# 19a. ARIA labels in WebViews
Write-Host "`n--- ARIA Labels ---"
$webviewFiles = Get-ChildItem "$extPath/src/**/*.ts" -Recurse |
    Select-String -Pattern 'html\s*[`=]|getWebviewContent|<button|<input' -List

$ariaUsage = Select-String -Path "$extPath/src/**/*.ts" -Pattern 'aria-|role=' -Recurse
$ariaCount = $ariaUsage.Count

Write-Host "WebView files: $($webviewFiles.Count)"
Write-Host "ARIA attributes: $ariaCount"

if ($webviewFiles.Count -gt 0 -and $ariaCount -lt $webviewFiles.Count * 2) {
    Write-Host "⚠️ Consider adding more ARIA labels for screen readers" -ForegroundColor Yellow
} else {
    Write-Host "✅ ARIA usage appears adequate"
}

# 19b. Keyboard navigation
Write-Host "`n--- Keyboard Navigation ---"
$tabindex = Select-String -Path "$extPath/src/**/*.ts" -Pattern 'tabindex|tabIndex' -Recurse
$keyHandlers = Select-String -Path "$extPath/src/**/*.ts" -Pattern 'onkeydown|onkeyup|onkeypress|addEventListener.*key' -Recurse

Write-Host "Tabindex usage: $($tabindex.Count)"
Write-Host "Key handlers: $($keyHandlers.Count)"

if ($webviewFiles.Count -gt 0 -and $keyHandlers.Count -eq 0) {
    Write-Host "⚠️ No keyboard handlers - buttons may not be keyboard accessible" -ForegroundColor Yellow
}

# 19c. Color contrast (check for hardcoded colors)
Write-Host "`n--- Color Usage ---"
$hardcodedColors = Select-String -Path "$extPath/src/**/*.ts" -Pattern '#[0-9a-fA-F]{3,6}|rgb\(|rgba\(' -Recurse
$cssVariables = Select-String -Path "$extPath/src/**/*.ts" -Pattern 'var\(--vscode-' -Recurse

Write-Host "Hardcoded colors: $($hardcodedColors.Count)"
Write-Host "VS Code CSS variables: $($cssVariables.Count)"

if ($hardcodedColors.Count -gt $cssVariables.Count) {
    Write-Host "⚠️ Prefer VS Code CSS variables for theme compatibility" -ForegroundColor Yellow
} else {
    Write-Host "✅ Good use of theme-aware colors"
}

# 19d. Alt text for images
Write-Host "`n--- Image Alt Text ---"
$images = Select-String -Path "$extPath/src/**/*.ts" -Pattern '<img' -Recurse
$altText = Select-String -Path "$extPath/src/**/*.ts" -Pattern '<img[^>]*alt=' -Recurse

if ($images.Count -gt 0) {
    Write-Host "Images: $($images.Count) | With alt: $($altText.Count)"
    if ($altText.Count -lt $images.Count) {
        Write-Host "⚠️ Some images missing alt text" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ No images requiring alt text"
}
```

### 20. Localization Audit

Check for i18n readiness and hardcoded strings:

```powershell
# === LOCALIZATION AUDIT ===
$extPath = "platforms/vscode-extension"
Write-Host "=== LOCALIZATION ===" -ForegroundColor Cyan

# 20a. Check for l10n setup
Write-Host "`n--- i18n Configuration ---"
$hasL10n = Test-Path "$extPath/l10n" -or Test-Path "$extPath/package.nls.json"
$hasVscodeL10n = Select-String -Path "$extPath/src/**/*.ts" -Pattern 'vscode\.l10n|nls\.' -Recurse

Write-Host "l10n folder/nls file: $(if($hasL10n){'✅ Found'}else{'⚠️ Not configured'})"
Write-Host "l10n API usage: $($hasVscodeL10n.Count) instances"

# 20b. Hardcoded user-facing strings
Write-Host "`n--- Hardcoded Strings ---"
$userFacingPatterns = @(
    'showInformationMessage\s*\(\s*[`''"]',
    'showWarningMessage\s*\(\s*[`''"]',
    'showErrorMessage\s*\(\s*[`''"]',
    'label:\s*[''"]',
    'title:\s*[''"]',
    'description:\s*[''"]',
    'placeHolder:\s*[''"]'
)

$hardcodedStrings = @()
foreach ($pattern in $userFacingPatterns) {
    $matches = Select-String -Path "$extPath/src/**/*.ts" -Pattern $pattern -Recurse
    $hardcodedStrings += $matches
}

Write-Host "Hardcoded UI strings: $($hardcodedStrings.Count)"
if ($hardcodedStrings.Count -gt 50) {
    Write-Host "ℹ️ Many hardcoded strings - consider l10n for internationalization"
} else {
    Write-Host "✅ Manageable string count"
}

# 20c. Command titles in package.json
Write-Host "`n--- Command Localization ---"
$pkg = Get-Content "$extPath/package.json" | ConvertFrom-Json
$commandCount = $pkg.contributes.commands.Count
$nlsFile = "$extPath/package.nls.json"

if (Test-Path $nlsFile) {
    $nls = Get-Content $nlsFile | ConvertFrom-Json
    $nlsKeys = ($nls.PSObject.Properties).Count
    Write-Host "Commands: $commandCount | NLS keys: $nlsKeys"
    Write-Host "✅ Localization file exists"
} else {
    Write-Host "Commands: $commandCount (not localized)"
    Write-Host "ℹ️ Create package.nls.json for marketplace localization"
}
```

### 21. Asset Integrity Audit

Check for unused assets, missing icons, and broken references:

```powershell
# === ASSET INTEGRITY AUDIT ===
$extPath = "platforms/vscode-extension"
Write-Host "=== ASSET INTEGRITY ===" -ForegroundColor Cyan

# 21a. Icon files
Write-Host "`n--- Extension Icons ---"
$pkg = Get-Content "$extPath/package.json" | ConvertFrom-Json
$iconPath = $pkg.icon
if ($iconPath) {
    $iconExists = Test-Path "$extPath/$iconPath"
    Write-Host "Icon: $iconPath $(if($iconExists){'✅'}else{'❌ MISSING'})"

    if ($iconExists) {
        $iconFile = Get-Item "$extPath/$iconPath"
        $sizeKB = [math]::Round($iconFile.Length / 1KB, 1)
        Write-Host "Size: $sizeKB KB $(if($sizeKB -gt 100){'⚠️ Large'}else{'✅'})"
    }
} else {
    Write-Host "⚠️ No icon defined in package.json"
}

# 21b. Asset folder inventory
Write-Host "`n--- Asset Files ---"
$assetFolders = @('assets', 'images', 'icons', 'media', 'resources')
foreach ($folder in $assetFolders) {
    $path = "$extPath/$folder"
    if (Test-Path $path) {
        $files = Get-ChildItem $path -Recurse -File
        $totalSize = ($files | Measure-Object Length -Sum).Sum / 1KB
        Write-Host "$folder/: $($files.Count) files, $([math]::Round($totalSize, 1)) KB"
    }
}

# 21c. Referenced but missing assets
Write-Host "`n--- Asset References ---"
$assetRefs = Select-String -Path "$extPath/src/**/*.ts" -Pattern '\.(png|jpg|jpeg|gif|svg|ico)' -Recurse
$referencedAssets = $assetRefs | ForEach-Object {
    [regex]::Match($_.Line, '[''"`]([^''"`]*\.(png|jpg|jpeg|gif|svg|ico))[''"`]').Groups[1].Value
} | Where-Object { $_ } | Sort-Object -Unique

$missingAssets = @()
foreach ($asset in $referencedAssets) {
    $assetPath = Join-Path $extPath $asset
    if (-not (Test-Path $assetPath) -and $asset -notmatch '^https?://') {
        $missingAssets += $asset
    }
}

if ($missingAssets.Count -gt 0) {
    Write-Host "❌ Missing referenced assets:"
    $missingAssets | ForEach-Object { Write-Host "  - $_" }
} else {
    Write-Host "✅ All referenced assets exist"
}

# 21d. Unused assets
Write-Host "`n--- Unused Assets ---"
$allAssets = Get-ChildItem "$extPath" -Recurse -Include "*.png","*.jpg","*.svg","*.ico" -File |
    Where-Object { $_.FullName -notmatch 'node_modules' }
$codeContent = Get-ChildItem "$extPath/src" -Recurse -Include "*.ts" -File | Get-Content -Raw
$pkgContent = Get-Content "$extPath/package.json" -Raw

$unusedAssets = $allAssets | Where-Object {
    $name = $_.Name
    -not ($codeContent -match [regex]::Escape($name)) -and
    -not ($pkgContent -match [regex]::Escape($name))
}

if ($unusedAssets.Count -gt 0) {
    Write-Host "⚠️ Possibly unused assets:"
    $unusedAssets | ForEach-Object { Write-Host "  - $($_.Name)" }
} else {
    Write-Host "✅ No obviously unused assets"
}
```

### 22. Configuration Files Audit

Check launch.json, tasks.json, tsconfig alignment:

```powershell
# === CONFIGURATION FILES AUDIT ===
$extPath = "platforms/vscode-extension"
Write-Host "=== CONFIGURATION FILES ===" -ForegroundColor Cyan

# 22a. launch.json validation
Write-Host "`n--- launch.json ---"
$launchPath = "$extPath/.vscode/launch.json"
if (Test-Path $launchPath) {
    try {
        $launch = Get-Content $launchPath -Raw | ConvertFrom-Json
        $configs = $launch.configurations.Count
        Write-Host "✅ Valid JSON with $configs configuration(s)"

        # Check for Extension Development Host config
        $extDevHost = $launch.configurations | Where-Object { $_.type -eq 'extensionHost' }
        if ($extDevHost) {
            Write-Host "✅ Extension Development Host configured"
        } else {
            Write-Host "⚠️ No extensionHost configuration - F5 won't work"
        }
    } catch {
        Write-Host "❌ Invalid JSON: $_" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ No launch.json found"
}

# 22b. tasks.json validation
Write-Host "`n--- tasks.json ---"
$tasksPath = "$extPath/.vscode/tasks.json"
if (Test-Path $tasksPath) {
    try {
        $tasks = Get-Content $tasksPath -Raw | ConvertFrom-Json
        Write-Host "✅ Valid JSON with $($tasks.tasks.Count) task(s)"

        # Check for watch task
        $watchTask = $tasks.tasks | Where-Object { $_.label -match 'watch' -or $_.script -eq 'watch' }
        if ($watchTask) {
            Write-Host "✅ Watch task configured"
        }
    } catch {
        Write-Host "❌ Invalid JSON: $_" -ForegroundColor Red
    }
} else {
    Write-Host "ℹ️ No tasks.json (optional)"
}

# 22c. tsconfig.json validation
Write-Host "`n--- tsconfig.json ---"
$tsconfigPath = "$extPath/tsconfig.json"
if (Test-Path $tsconfigPath) {
    try {
        # tsconfig may have comments, use a simple check
        $content = Get-Content $tsconfigPath -Raw
        if ($content -match '"compilerOptions"') {
            Write-Host "✅ tsconfig.json exists"

            # Check key settings
            $strict = $content -match '"strict"\s*:\s*true'
            $esModule = $content -match '"esModuleInterop"\s*:\s*true'
            $outDir = [regex]::Match($content, '"outDir"\s*:\s*"([^"]+)"').Groups[1].Value

            Write-Host "Strict mode: $(if($strict){'✅'}else{'⚠️ Not enabled'})"
            Write-Host "ES Module Interop: $(if($esModule){'✅'}else{'⚠️'})"
            Write-Host "Output dir: $outDir"
        }
    } catch {
        Write-Host "⚠️ Could not parse tsconfig"
    }
} else {
    Write-Host "❌ No tsconfig.json found!" -ForegroundColor Red
}

# 22d. .vscodeignore validation
Write-Host "`n--- .vscodeignore ---"
$ignorePath = "$extPath/.vscodeignore"
if (Test-Path $ignorePath) {
    $ignoreContent = Get-Content $ignorePath
    $requiredIgnores = @('src/', 'node_modules/', '.vscode/', '*.ts', 'tsconfig.json')
    $missing = $requiredIgnores | Where-Object {
        $pattern = $_
        -not ($ignoreContent | Where-Object { $_ -eq $pattern -or $_ -eq "$pattern*" })
    }

    if ($missing.Count -gt 0) {
        Write-Host "⚠️ Consider adding to .vscodeignore: $($missing -join ', ')"
    } else {
        Write-Host "✅ .vscodeignore properly configured"
    }

    # Check package size impact
    $lines = $ignoreContent.Count
    Write-Host "Ignore rules: $lines"
} else {
    Write-Host "⚠️ No .vscodeignore - extension may be bloated"
}

# 22e. esbuild/webpack config
Write-Host "`n--- Build Config ---"
$buildConfigs = @('esbuild.js', 'esbuild.config.js', 'webpack.config.js', 'rollup.config.js')
$foundBuild = $buildConfigs | Where-Object { Test-Path "$extPath/$_" }
if ($foundBuild) {
    Write-Host "✅ Build config: $($foundBuild -join ', ')"
} else {
    Write-Host "ℹ️ No custom build config (using npm scripts)"
}
```

---

## Inheritable Audit Summary

| # | Audit Area | Checks | Severity |
|---|------------|--------|----------|
| 10 | UI Audit | Dead buttons, window.open, location.reload | 🟡 Medium |
| 11 | Dependency Health | npm audit, outdated, unused | 🔴 High |
| 12 | TypeScript & Lint | Compile errors, ESLint, dead code | 🔴 High |
| 13 | Security | Secrets, CSP, input sanitization | 🔴 High |
| 14 | Bundle Size | Extension size, package estimate | 🟡 Medium |
| 15 | Git Hygiene | Uncommitted, large files, branch | 🟡 Medium |
| 16 | Changelog | Format, versions, categories | 🟡 Medium |
| 17 | API Compatibility | Deprecated APIs, engine version | 🟡 Medium |
| 18 | Test Coverage | Test files, framework, gaps | 🟡 Medium |
| 19 | Accessibility | ARIA, keyboard, colors, alt text | 🟢 Low |
| 20 | Localization | i18n setup, hardcoded strings | 🟢 Low |
| 21 | Asset Integrity | Icons, missing/unused assets | 🟢 Low |
| 22 | Configuration | launch.json, tsconfig, vscodeignore | 🟢 Low |

---

## Consistency Reference (What Must Match)

### Version Numbers
These locations must all show the same version:

| Location | File | Pattern |
|----------|------|---------|
| Package.json | `platforms/vscode-extension/package.json` | `"version": "X.Y.Z"` |
| Copilot Instructions | `.github/copilot-instructions.md` | `**Version**: X.Y.Z` |
| M365 Agent | `platforms/m365-copilot/appPackage/declarativeAgent.json` | `"version": "X.Y.Z"` |
| Changelog | `CHANGELOG.md` | `## [X.Y.Z]` (latest) |
| Quick Reference | `alex_docs/QUICK-REFERENCE.md` | Version table |

**Note:** Historical files (`UPGRADE-MIGRATION-PLAN.md`, `VSCODE-EXTENSIONS-ANALYSIS.md`) may have old versions - that's OK if they're documenting history.

### Skill Count
These locations must show the actual skill count:

| Location | File | Pattern |
|----------|------|---------|
| Copilot Instructions | `.github/copilot-instructions.md` | In stats section |
| Skills Catalog | `alex_docs/SKILLS-CATALOG.md` | `## Skill Count: N` |
| Cognitive Architecture | `alex_docs/COGNITIVE-ARCHITECTURE.md` | Skills mention |
| Quick Reference | `alex_docs/QUICK-REFERENCE.md` | Skills summary |
| Network Diagram | `alex_docs/SKILLS-CATALOG.md` | Mermaid nodes |

**Current:** 47 skills (check with `(Get-ChildItem ".github/skills" -Directory).Count`)

### MCP Tool Count
| Location | File | Pattern |
|----------|------|---------|
| Package.json | `platforms/vscode-extension/package.json` | `contributes.languageModelTools` |
| User Manual | `alex_docs/USER-MANUAL.md` | Tools section |
| Copilot Instructions | `.github/copilot-instructions.md` | Stats |

**Current:** 11 tools

### Command Count
| Location | File | Pattern |
|----------|------|---------|
| Package.json | `platforms/vscode-extension/package.json` | `contributes.commands` |
| User Manual | `alex_docs/USER-MANUAL.md` | Commands section |

**Current:** Check with `(Get-Content "platforms/vscode-extension/package.json" | ConvertFrom-Json).contributes.commands.Count`

### Identity/Name Consistency
| Term | Correct Form | Incorrect Forms |
|------|--------------|-----------------|
| Product name | Alex Cognitive Architecture | Alex Extension, Alex Plugin |
| Short name | Alex | ALEX, alex (in headings) |
| Extension ID | `fabioc-aloha.alex-cognitive-architecture` | Any variation |
| Publisher | fabioc-aloha | fabioc, aloha |

### Deprecated Terms (Never Use)
| Deprecated | Replacement | Reason |
|------------|-------------|--------|
| `DK-*.md` | `skills/*/SKILL.md` | Format migration 2026-01 |
| `domain-knowledge/` | `skills/` | Folder rename |
| `domain knowledge files` | `skills` | Terminology update |

**Exception:** Historical documentation (migration guides, upgrade plans) may reference deprecated terms when explaining the migration.

### File Path Consistency
| Logical Location | Actual Path |
|------------------|-------------|
| Master copilot instructions | `.github/copilot-instructions.md` |
| Skills folder | `.github/skills/` |
| Instructions folder | `.github/instructions/` |
| Prompts folder | `.github/prompts/` |
| VS Code extension | `platforms/vscode-extension/` |
| M365 agent | `platforms/m365-copilot/` |
| Documentation | `alex_docs/` |
| Protection marker | `.github/config/MASTER-ALEX-PROTECTED.json` |

### Diagram Node Abbreviations
The skill network diagram uses these abbreviations:

| Abbrev | Skill |
|--------|-------|
| BL | bootstrap-learning |
| LP | learning-psychology |
| CL | cognitive-load |
| AR | appropriate-reliance |
| AH | architecture-health |
| AAU | architecture-audit |
| MAA | master-alex-audit |
| HC | heir-curation |
| MED | meditation |
| SA | self-actualization |
| ... | (see SKILLS-CATALOG.md for full list) |

## Master Audit Report Template

```markdown
# Master Alex Audit Report
**Date:** {{DATE}}
**Version:** {{VERSION}}
**Auditor:** Alex + {{USER}}

## Summary
| Check | Status | Notes |
|-------|--------|-------|
| Version Alignment | ✅/⚠️/❌ | |
| Heir Sync | ✅/⚠️/❌ | |
| Skill Inheritance | ✅/⚠️/❌ | |
| Safety Imperatives | ✅/⚠️/❌ | |
| Build Artifacts | ✅/⚠️/❌ | |
| Documentation Refs | ✅/⚠️/❌ | |
| Synapse Health | ✅/⚠️/❌ | |
| alex_docs Audit | ✅/⚠️/❌ | |

## Detailed Findings

### Critical Issues (Must Fix)
-

### Warnings (Should Fix)
-

### Observations (Nice to Have)
-

## Actions Taken
1.
2.

## Next Steps
-
```

## Quick Master Audit Commands

Copy-paste ready audit sequence:

```powershell
# === MASTER ALEX QUICK AUDIT ===
cd "C:\Development\Alex_Plug_In"

# 1. Git status
Write-Host "`n=== GIT STATUS ===" -ForegroundColor Cyan
git status --short

# 2. Version check
Write-Host "`n=== VERSION CHECK ===" -ForegroundColor Cyan
$pkgVersion = (Get-Content "platforms/vscode-extension/package.json" | ConvertFrom-Json).version
$copilotVersion = [regex]::Match((Get-Content ".github/copilot-instructions.md" -Raw), '\*\*Version\*\*:\s*(\d+\.\d+\.\d+)').Groups[1].Value
Write-Host "Package: v$pkgVersion"
Write-Host "Copilot: v$copilotVersion"
if ($pkgVersion -eq $copilotVersion) { Write-Host "✅ Versions match" -ForegroundColor Green }
else { Write-Host "❌ Version mismatch!" -ForegroundColor Red }

# 3. Protection check
Write-Host "`n=== PROTECTION CHECK ===" -ForegroundColor Cyan
$protected = Test-Path ".github/config/MASTER-ALEX-PROTECTED.json"
Write-Host "Kill switch marker: $(if($protected){'✅'}else{'❌'})"

# 4. Skill count
Write-Host "`n=== SKILL COUNT ===" -ForegroundColor Cyan
$skillCount = (Get-ChildItem ".github/skills" -Directory).Count
Write-Host "Skills: $skillCount"

# 5. Build freshness
Write-Host "`n=== BUILD STATUS ===" -ForegroundColor Cyan
$dist = Get-Item "platforms/vscode-extension/dist/extension.js" -ErrorAction SilentlyContinue
if ($dist) {
    $age = [int]((Get-Date) - $dist.LastWriteTime).TotalHours
    Write-Host "Build age: $age hours"
} else {
    Write-Host "⚠️ No build found"
}

Write-Host "`n=== AUDIT COMPLETE ===" -ForegroundColor Green
```

## Synapses

See [synapses.json](synapses.json) for connections to:
- `architecture-audit` (extends) - Generic audit foundation
- `release-preflight` - Pre-release verification
- `heir-curation` - Heir management
- `architecture-health` - Structural integrity
- `vscode-extension-patterns` - Extension-specific knowledge
