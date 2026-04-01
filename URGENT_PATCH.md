# URGENT PATCH: GCX Workspace Protection

**Priority**: Critical
**Date**: 2026-03-31
**Status**: All protection layers committed and verified

## Resolved Gaps

**Gap 1 (FIXED):** All `.github/config/*.json` marker files are now committed and git-tracked in GCX_Master, GCX_Copilot, and GCX_KB.

**Gap 2 (FIXED):** `.vscode/settings.json` removed from `.gitignore` in both GCX_Master and GCX_Copilot. The `alex.workspace.protectedMode: true` setting is now committed and survives fresh clones.

## Problem

GCX_Master and GCX_Copilot must be protected from TWO threats:

1. **Alex extension** (`alex.initialize`, `alex.upgrade`) could overwrite `.github/` with Alex identity
2. **Deploy-GCXCopilot.ps1** (new script) could accidentally target Master or Copilot

## Current Protection Status

### GCX_Master: PROTECTED (4 layers)

| Layer         | File/Setting                                                 | Status   | Blocks                            |
| ------------- | ------------------------------------------------------------ | -------- | --------------------------------- |
| Alex marker   | `.github/config/MASTER-ALEX-PROTECTED.json`                  | In place | `alex.initialize`, `alex.upgrade` |
| Alex setting  | `.vscode/settings.json` `alex.workspace.protectedMode: true` | In place | All Alex extension commands       |
| GCX marker    | `.github/config/GCX-MASTER-PROTECTED.json`                   | In place | `Deploy-GCXCopilot.ps1`           |
| Path failsafe | Script checks for `GCX_Master` in path                       | In plan  | `Deploy-GCXCopilot.ps1`           |

### GCX_Copilot: PROTECTED (4 layers)

| Layer         | File/Setting                                                 | Status   | Blocks                            |
| ------------- | ------------------------------------------------------------ | -------- | --------------------------------- |
| Alex marker   | `.github/config/MASTER-ALEX-PROTECTED.json`                  | In place | `alex.initialize`, `alex.upgrade` |
| Alex setting  | `.vscode/settings.json` `alex.workspace.protectedMode: true` | In place | All Alex extension commands       |
| GCX marker    | `.github/config/GCX-COPILOT-PROTECTED.json`                  | In place | `Deploy-GCXCopilot.ps1`           |
| Path failsafe | Script checks for `GCX_Copilot` in path                      | In plan  | `Deploy-GCXCopilot.ps1`           |

## File Inventory

### Files that MUST exist (do not delete):

**GCX_Master:**

```text
.github/config/MASTER-ALEX-PROTECTED.json     ← Blocks Alex extension
.github/config/GCX-MASTER-PROTECTED.json       ← Blocks Deploy script
.github/config/GCX-COPILOT-PROTECTED.json      ← Syncs to Copilot via Sync-ToHeir.ps1
.vscode/settings.json                           ← Contains alex.workspace.protectedMode: true
```

**GCX_Copilot:**

```text
.github/config/MASTER-ALEX-PROTECTED.json      ← Blocks Alex extension
.github/config/GCX-COPILOT-PROTECTED.json       ← Blocks Deploy script
.vscode/settings.json                            ← Contains alex.workspace.protectedMode: true
```

Note: `GCX-MASTER-PROTECTED.json` must NOT exist in GCX_Copilot. `Sync-ToHeir.ps1` removes it after sync (in `$MasterOnlyFiles` exclusion list).

### File contents (exact format required):

**MASTER-ALEX-PROTECTED.json** (both repos, identical):

```json
{
  "protected": true,
  "workspace": "master-alex",
  "description": "Blocks Alex extension commands (alex.initialize, alex.upgrade) from overwriting this workspace."
}
```

The Alex extension code checks `protected === true && workspace === "master-alex"` exactly. Any other values are ignored.

**GCX-MASTER-PROTECTED.json** (Master only):

```json
{
  "protected": true,
  "workspace": "gcx-master",
  "role": "source-of-truth"
}
```

**GCX-COPILOT-PROTECTED.json** (both repos; syncs from Master):

```json
{
  "protected": true,
  "workspace": "gcx-copilot",
  "role": "template-heir"
}
```

## Sync Safety

When `Sync-ToHeir.ps1` runs:

1. Master's `.github/config/` is copied to Copilot (includes all 3 JSON files)
2. `$MasterOnlyFiles` exclusion removes `GCX-MASTER-PROTECTED.json` from Copilot
3. Result: Copilot has `MASTER-ALEX-PROTECTED.json` + `GCX-COPILOT-PROTECTED.json` (correct)

**Verify after every sync:**

```powershell
# Should be True, True, False
Write-Host (Test-Path "C:\Development\GCX_Copilot\.github\config\MASTER-ALEX-PROTECTED.json")
Write-Host (Test-Path "C:\Development\GCX_Copilot\.github\config\GCX-COPILOT-PROTECTED.json")
Write-Host (Test-Path "C:\Development\GCX_Copilot\.github\config\GCX-MASTER-PROTECTED.json")
```

## Emergency Recovery

If protection files are accidentally deleted:

```powershell
# Restore Alex extension protection (both repos)
@("C:\Development\GCX_Master", "C:\Development\GCX_Copilot") | ForEach-Object {
    $path = Join-Path $_ ".github" "config" "MASTER-ALEX-PROTECTED.json"
    @{ protected = $true; workspace = "master-alex"; description = "Blocks Alex extension commands" } |
        ConvertTo-Json | Set-Content $path -Encoding utf8
    Write-Host "[OK] Restored $path" -ForegroundColor Green
}

# Restore VS Code setting (both repos)
@("C:\Development\GCX_Master", "C:\Development\GCX_Copilot") | ForEach-Object {
    $settingsPath = Join-Path $_ ".vscode" "settings.json"
    if (Test-Path $settingsPath) {
        $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json
        $settings | Add-Member -NotePropertyName "alex.workspace.protectedMode" -NotePropertyValue $true -Force
        $settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath -Encoding utf8
        Write-Host "[OK] Restored protectedMode in $settingsPath" -ForegroundColor Green
    }
}
```

## Quick Verification Script

Run this to confirm all protection layers are active:

```powershell
$repos = @(
    @{ Name = "GCX_Master"; Path = "C:\Development\GCX_Master"; ExpectMasterProtected = $true }
    @{ Name = "GCX_Copilot"; Path = "C:\Development\GCX_Copilot"; ExpectMasterProtected = $false }
)

$allPassed = $true
foreach ($repo in $repos) {
    Write-Host "`n=== $($repo.Name) ===" -ForegroundColor Cyan

    # Alex marker
    $alexMarker = Join-Path $repo.Path ".github" "config" "MASTER-ALEX-PROTECTED.json"
    $hasAlex = Test-Path $alexMarker
    if ($hasAlex) {
        $data = Get-Content $alexMarker -Raw | ConvertFrom-Json
        $valid = ($data.protected -eq $true) -and ($data.workspace -eq "master-alex")
        Write-Host "  Alex marker: $(if ($valid) { '[OK]' } else { '[BAD FORMAT]' })" -ForegroundColor $(if ($valid) { 'Green' } else { 'Red' })
        if (-not $valid) { $allPassed = $false }
    } else {
        Write-Host "  Alex marker: [MISSING]" -ForegroundColor Red
        $allPassed = $false
    }

    # VS Code setting
    $settingsPath = Join-Path $repo.Path ".vscode" "settings.json"
    if (Test-Path $settingsPath) {
        $settings = Get-Content $settingsPath -Raw
        $hasProtected = $settings -match '"alex\.workspace\.protectedMode":\s*true'
        Write-Host "  VS Code protectedMode: $(if ($hasProtected) { '[OK]' } else { '[MISSING]' })" -ForegroundColor $(if ($hasProtected) { 'Green' } else { 'Red' })
        if (-not $hasProtected) { $allPassed = $false }
    } else {
        Write-Host "  VS Code settings: [FILE MISSING]" -ForegroundColor Red
        $allPassed = $false
    }

    # GCX marker (repo-specific)
    $gcxMarkerName = if ($repo.Name -eq "GCX_Master") { "GCX-MASTER-PROTECTED.json" } else { "GCX-COPILOT-PROTECTED.json" }
    $gcxMarker = Join-Path $repo.Path ".github" "config" $gcxMarkerName
    $hasGCX = Test-Path $gcxMarker
    Write-Host "  GCX marker ($gcxMarkerName): $(if ($hasGCX) { '[OK]' } else { '[MISSING]' })" -ForegroundColor $(if ($hasGCX) { 'Green' } else { 'Red' })
    if (-not $hasGCX) { $allPassed = $false }

    # GCX-MASTER-PROTECTED should NOT be in Copilot
    if (-not $repo.ExpectMasterProtected) {
        $leaked = Test-Path (Join-Path $repo.Path ".github" "config" "GCX-MASTER-PROTECTED.json")
        if ($leaked) {
            Write-Host "  GCX-MASTER-PROTECTED.json: [LEAKED - should not exist here]" -ForegroundColor Red
            $allPassed = $false
        }
    }
}

Write-Host "`n$(if ($allPassed) { '[OK] All protection layers verified' } else { '[FAIL] Protection gaps detected' })" -ForegroundColor $(if ($allPassed) { 'Green' } else { 'Red' })
```
