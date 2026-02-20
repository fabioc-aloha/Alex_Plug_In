# Check that all references in .github/ are self-contained
param(
    [string]$Root = "c:\Development\Alex_Plug_In\.github"
)

$issues = @()
$warnings = @()
$intentional = @()   # Known-OK exceptions with documented reason

# Paths excluded from self-containment check with documented reasons
$excludeFromCheck = @{
    'episodic'   = 'Episodic memory is session-specific and cleared (emptied) on every heir deployment — absolute paths in past session records are harmless'
    'SUPPORT.md' = 'GitHub Community Health File — designed to link to project-level files; only appears on GitHub, never loaded as cognitive instructions or routing'
}

# Helper: resolve a relative path from a base file — returns $null if it stays in $Root, else the escaped path
function Resolve-AndCheck {
    param([string]$baseFile, [string]$target, [string]$root)
    if ($target -match '^https?://|^#|^mailto:|^external:|^global-knowledge://' ) { return $null }
    if ($target -match '^\.github/') { return $null }  # explicit .github/ prefix — OK
    if ($target -notmatch '[/\\]' -and $target -notmatch '\.') { return $null }  # bare skill name — OK
    # Absolute paths are always issues
    if ($target -match '^[a-zA-Z]:\\|^/') { return $target }
    # Relative path — resolve from file's directory
    $baseDir = Split-Path $baseFile -Parent
    $resolved = [System.IO.Path]::GetFullPath((Join-Path $baseDir $target))
    # Check if it stays within $Root
    if ($resolved.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) { return $null }
    return $target  # escapes root — real issue
}

# ─── 1. Synapses.json: check all 'target' fields ───────────────────────────
Write-Host "`n=== SYNAPSE TARGETS ===" -ForegroundColor Cyan
$synapseFiles = Get-ChildItem $Root -Recurse -Filter "synapses.json"
Write-Host "Files scanned: $($synapseFiles.Count)"
foreach ($f in $synapseFiles) {
    try {
        $j = Get-Content $f.FullName -Raw | ConvertFrom-Json
        foreach ($conn in $j.connections) {
            $t = $conn.target
            if (-not $t -or $t.Trim() -eq '') { continue }
            $escaped = Resolve-AndCheck -baseFile $f.FullName -target $t -root $Root
            if ($null -ne $escaped) {
                $short = $f.FullName -replace [regex]::Escape($Root + "\"), ""
                $issues += [pscustomobject]@{ Type = "SYNAPSE_TARGET"; File = $short; Value = $escaped }
            }
        }
    }
    catch {
        $issues += [pscustomobject]@{ Type = "PARSE_ERROR"; File = $f.Name; Value = $_.Exception.Message }
    }
}

# ─── 2. Markdown files: check relative file links [...](...) ────────────────
Write-Host "`n=== MARKDOWN FILE LINKS ===" -ForegroundColor Cyan
$mdFiles = Get-ChildItem $Root -Recurse -Include "*.md"
Write-Host "Files scanned: $($mdFiles.Count)"
$linkPattern = '\[([^\]]*)\]\(([^)]+)\)'
foreach ($f in $mdFiles) {
    $content = Get-Content $f.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    # Ignore links inside code fences
    $stripped = $content -replace '(?ms)```[^`]*```', ''
    $stripped = $stripped -replace '(?ms)`[^`]+`', ''
    $matches = [regex]::Matches($stripped, $linkPattern)
    foreach ($m in $matches) {
        $href = $m.Groups[2].Value
        if ($href -match '^https?://|^#|^mailto:') { continue }
        $escaped = Resolve-AndCheck -baseFile $f.FullName -target $href -root $Root
        if ($null -ne $escaped) {
            $short = $f.FullName -replace [regex]::Escape($Root + "\"), ""
            # Check if this file is in a known-OK excluded path
            $excluded = $false
            foreach ($excl in $excludeFromCheck.Keys) {
                if ($short -match [regex]::Escape($excl)) {
                    $intentional += [pscustomobject]@{ File = $short; Value = $escaped; Reason = $excludeFromCheck[$excl] }
                    $excluded = $true; break
                }
            }
            if (-not $excluded) {
                $issues += [pscustomobject]@{ Type = "MD_LINK_ESCAPES"; File = $short; Value = $escaped }
            }
        }
    }
}

# ─── 3. JSON files: check for absolute paths or external repo refs ──────────
Write-Host "`n=== JSON FILES: ABSOLUTE/EXTERNAL PATHS ===" -ForegroundColor Cyan
$jsonFiles = Get-ChildItem $Root -Recurse -Include "*.json" -Exclude "synapses.json"
Write-Host "Files scanned: $($jsonFiles.Count)"
foreach ($f in $jsonFiles) {
    $content = Get-Content $f.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    if ($content -match 'Alex_Plug_In\\\\' -or $content -match 'Alex_Plug_In/') {
        $short = $f.FullName -replace [regex]::Escape($Root + "\"), ""
        $issues += [pscustomobject]@{ Type = "HARDCODED_PATH"; File = $short; Value = "Contains hardcoded Alex_Plug_In path" }
    }
    if ($content -match 'Alex-Global-Knowledge') {
        $short = $f.FullName -replace [regex]::Escape($Root + "\"), ""
        $warnings += [pscustomobject]@{ Type = "GLOBAL_KNOWLEDGE_REF"; File = $short; Value = "References Alex-Global-Knowledge repo" }
    }
}

# ─── 4. Instruction/prompt files: already covered by section 2 ──────────────
# (instructions/ and prompts/ are .md files already scanned above)
Write-Host "`n=== INSTRUCTION/PROMPT FILES ===" -ForegroundColor Cyan
Write-Host "Covered by markdown link scan above"

# ─── Summary ────────────────────────────────────────────────────────────────
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "ISSUES (must fix): $($issues.Count)" -ForegroundColor Red
if ($issues.Count -gt 0) { $issues | Format-Table -AutoSize -Wrap }

Write-Host "`nWARNINGS (review): $($warnings.Count)" -ForegroundColor Yellow
if ($warnings.Count -gt 0) { $warnings | Format-Table -AutoSize -Wrap }

Write-Host "`nINTENTIONAL EXCEPTIONS (documented, not errors): $($intentional.Count)" -ForegroundColor DarkGray
if ($intentional.Count -gt 0) {
    $intentional | Group-Object File | ForEach-Object {
        Write-Host "  $($_.Name)" -ForegroundColor DarkGray
        Write-Host "    Reason: $(($_.Group[0].Reason -split ' — ')[0])" -ForegroundColor DarkGray
    }
}

Write-Host "`n========================================" -ForegroundColor Yellow
if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✅ .github/ is fully self-contained" -ForegroundColor Green
}
elseif ($issues.Count -eq 0) {
    Write-Host "⚠️  Self-contained with warnings — review relative uplinks" -ForegroundColor Yellow
}
else {
    Write-Host "❌ External references detected — fix before shipping" -ForegroundColor Red
}
