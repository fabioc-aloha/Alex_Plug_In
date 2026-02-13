<#
.SYNOPSIS
    Unified path normalization for all Alex memory file types.
.DESCRIPTION
    Consolidates normalize-instruction-paths.ps1, normalize-skillmd-paths.ps1,
    and normalize-synapse-paths.ps1 into a single parameterized script.
    Ensures all references use canonical .github/ prefixed paths.
.PARAMETER Target
    Which file types to normalize: instructions, skills, synapses, or all (default)
.PARAMETER RepoRoot
    Repository root path. Defaults to parent of scripts/ directory.
.EXAMPLE
    .\normalize-paths.ps1                     # Normalize everything
    .\normalize-paths.ps1 -Target instructions # Only instruction/prompt files
    .\normalize-paths.ps1 -Target synapses     # Only synapses.json files
    .\normalize-paths.ps1 -Target skills       # Only SKILL.md files
#>
param(
    [ValidateSet('all', 'instructions', 'skills', 'synapses')]
    [string]$Target = 'all',
    
    # Now in .github/muscles/, go up 2 levels to repo root
    [string]$RepoRoot = (Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)))
)

$ErrorActionPreference = "Continue"
$instructionsPath = Join-Path $RepoRoot ".github\instructions"
$promptsPath = Join-Path $RepoRoot ".github\prompts"
$skillsPath = Join-Path $RepoRoot ".github\skills"

$totalUpdated = 0
$totalSkipped = 0

# ============================================================
# TARGET: instructions — Normalize .instructions.md and .prompt.md files
# ============================================================
function Normalize-InstructionPaths {
    Write-Host "`n📝 Normalizing instruction & prompt file paths..." -ForegroundColor Cyan
    $updated = 0; $skipped = 0

    # Process instruction files
    $files = Get-ChildItem $instructionsPath -Filter "*.md" -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        $original = $content

        # [file.instructions.md] → [.github/instructions/file.instructions.md]
        $content = $content -replace '\[([^\[\]]+\.instructions\.md)\](?!\()', '[.github/instructions/$1]'
        # [file.prompt.md] → [.github/prompts/file.prompt.md]
        $content = $content -replace '\[([^\[\]]+\.prompt\.md)\](?!\()', '[.github/prompts/$1]'
        # [skill-name/SKILL.md] → [.github/skills/skill-name/SKILL.md]
        $content = $content -replace '\[([^\[\]/]+)/SKILL\.md\](?!\()', '[.github/skills/$1/SKILL.md]'

        if ($content -ne $original) {
            Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "  Updated: instructions/$($file.Name)" -ForegroundColor Green
            $updated++
        }
        else { $skipped++ }
    }

    # Process prompt files
    if (Test-Path $promptsPath) {
        $files = Get-ChildItem $promptsPath -Filter "*.md" -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            $content = Get-Content $file.FullName -Raw
            $original = $content

            $content = $content -replace '\[([^\[\]]+\.instructions\.md)\](?!\()', '[.github/instructions/$1]'
            $content = $content -replace '\[([^\[\]]+\.prompt\.md)\](?!\()', '[.github/prompts/$1]'
            $content = $content -replace '\[([^\[\]/]+)/SKILL\.md\](?!\()', '[.github/skills/$1/SKILL.md]'

            if ($content -ne $original) {
                Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
                Write-Host "  Updated: prompts/$($file.Name)" -ForegroundColor Green
                $updated++
            }
            else { $skipped++ }
        }
    }

    Write-Host "  Instructions/Prompts: $updated updated, $skipped skipped" -ForegroundColor $(if ($updated -gt 0) { 'Green' } else { 'Gray' })
    return @{ Updated = $updated; Skipped = $skipped }
}

# ============================================================
# TARGET: skills — Normalize SKILL.md embedded synapses
# ============================================================
function Normalize-SkillPaths {
    Write-Host "`n📦 Normalizing SKILL.md paths..." -ForegroundColor Cyan
    $updated = 0; $skipped = 0

    $files = Get-ChildItem $skillsPath -Recurse -Filter "SKILL.md" -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        $original = $content

        # [Name](../skill-name/SKILL.md) → [Name](.github/skills/skill-name/SKILL.md)
        $content = $content -replace '\]\(\.\./([^/]+)/SKILL\.md\)', '](.github/skills/$1/SKILL.md)'
        # [Name](../instructions/file.md) → [Name](.github/instructions/file.md)
        $content = $content -replace '\]\(\.\./instructions/([^\)]+)\)', '](.github/instructions/$1)'

        if ($content -ne $original) {
            Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
            $relative = $file.FullName.Replace("$RepoRoot\", '')
            Write-Host "  Updated: $relative" -ForegroundColor Green
            $updated++
        }
        else { $skipped++ }
    }

    Write-Host "  SKILL.md files: $updated updated, $skipped skipped" -ForegroundColor $(if ($updated -gt 0) { 'Green' } else { 'Gray' })
    return @{ Updated = $updated; Skipped = $skipped }
}

# ============================================================
# TARGET: synapses — Normalize synapses.json target fields
# ============================================================
function Normalize-SynapsePaths {
    Write-Host "`n🧠 Normalizing synapses.json targets..." -ForegroundColor Cyan
    $updated = 0; $skipped = 0

    $files = Get-ChildItem $skillsPath -Recurse -Filter "synapses.json" -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        $json = $content | ConvertFrom-Json
        $modified = $false

        # Process both "connections" and "synapses" array formats
        foreach ($arrayName in @('connections', 'synapses')) {
            $array = $json.$arrayName
            if (-not $array) { continue }

            foreach ($entry in $array) {
                $target = $entry.target
                if (-not $target -or $target -match "^\.github/") { continue }

                # ../instructions/file.md → .github/instructions/file.md
                if ($target -match "^\.\./instructions/(.+)$") {
                    $entry.target = ".github/instructions/$($Matches[1])"
                    $modified = $true; continue
                }

                # skill-name/SKILL.md → .github/skills/skill-name/SKILL.md
                if ($target -match "^([^/]+)/SKILL\.md$") {
                    $entry.target = ".github/skills/$($Matches[1])/SKILL.md"
                    $modified = $true; continue
                }

                # Bare skill name → .github/skills/name/SKILL.md
                if ($target -notmatch "/" -and $target -notmatch "\.md$") {
                    $entry.target = ".github/skills/$target/SKILL.md"
                    $modified = $true; continue
                }
            }
        }

        if ($modified) {
            $json | ConvertTo-Json -Depth 10 | Set-Content $file.FullName -Encoding UTF8
            $relative = $file.FullName.Replace("$RepoRoot\", '')
            Write-Host "  Updated: $relative" -ForegroundColor Green
            $updated++
        }
        else { $skipped++ }
    }

    Write-Host "  synapses.json: $updated updated, $skipped skipped" -ForegroundColor $(if ($updated -gt 0) { 'Green' } else { 'Gray' })
    return @{ Updated = $updated; Skipped = $skipped }
}

# ============================================================
# MAIN: Execute selected targets
# ============================================================
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Alex Path Normalizer (Target: $Target)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Repo: $RepoRoot"

$targets = if ($Target -eq 'all') { @('instructions', 'skills', 'synapses') } else { @($Target) }

foreach ($t in $targets) {
    $result = switch ($t) {
        'instructions' { Normalize-InstructionPaths }
        'skills' { Normalize-SkillPaths }
        'synapses' { Normalize-SynapsePaths }
    }
    $totalUpdated += $result.Updated
    $totalSkipped += $result.Skipped
}

Write-Host "`n═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Total: $totalUpdated updated, $totalSkipped skipped" -ForegroundColor $(if ($totalUpdated -gt 0) { 'Green' } else { 'Gray' })
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
