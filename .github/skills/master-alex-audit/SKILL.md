# Master Alex Audit

> Master-specific audit extensions building on generic architecture-audit skill

## Overview

**Extends:** [architecture-audit](../architecture-audit/SKILL.md)

Master Alex-specific audit procedures that leverage knowledge of:
- Exact folder structure and file locations
- Heir relationships (VS Code extension, M365 agent)
- Safety imperatives and protection mechanisms
- Build/release workflows
- Platform-specific configurations

**NOT INHERITABLE** - Contains Master-specific paths and configurations.

## Triggers

- "master audit", "full audit"
- "heir sync check", "platform alignment"
- "pre-release master check"
- Before publishing heirs to marketplace

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
