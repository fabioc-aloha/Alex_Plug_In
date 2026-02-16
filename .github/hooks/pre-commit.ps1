#!/usr/bin/env pwsh
#Requires -Version 7.0
# Git Pre-Commit Hook - Quality Gates for Alex Architecture
# Location: .git/hooks/pre-commit (copy from .github/hooks/pre-commit.ps1)

$ErrorActionPreference = "Stop"

Write-Host "🧠 Running Alex quality gates..." -ForegroundColor Cyan

# Get staged files
$stagedFiles = git diff --cached --name-only --diff-filter=ACM

# Categorize changes
$changedSkills = $stagedFiles | Where-Object { $_ -match '^\.github/skills/[^/]+/SKILL\.md$' }
$changedSynapses = $stagedFiles | Where-Object { $_ -match '\.github/skills/[^/]+/synapses\.json$' }
$changedEpisodic = $stagedFiles | Where-Object { $_ -match '^\.github/episodic/' }
$changedInstructions = $stagedFiles | Where-Object { $_ -match '^\.github/instructions/' }

$errors = @()
$warnings = @()

# ============================================================
# CHECK 1: SKILL.md YAML frontmatter
# ============================================================
if ($changedSkills) {
    Write-Host "  Validating SKILL.md frontmatter..." -ForegroundColor Gray
    foreach ($file in $changedSkills) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            if ($content -notmatch '^---\s*\n') {
                $errors += "${file}: Missing YAML frontmatter (must start with ---)"
            }
            elseif ($content -match '^---\s*\n([\s\S]*?)\n---') {
                $fm = $matches[1]
                if ($fm -notmatch 'name:\s*[''"]?[\w\-\s]+') {
                    $errors += "${file}: Missing 'name:' in frontmatter"
                }
                if ($fm -notmatch 'description:\s*[''"]?.+') {
                    $errors += "${file}: Missing 'description:' in frontmatter"
                }
            }
            else {
                $errors += "${file}: Malformed YAML frontmatter (missing closing ---)"
            }
        }
    }
}

# ============================================================
# CHECK 2: synapses.json structure
# ============================================================
if ($changedSynapses) {
    Write-Host "  Validating synapses.json..." -ForegroundColor Gray
    foreach ($file in $changedSynapses) {
        if (Test-Path $file) {
            try {
                $syn = Get-Content $file -Raw | ConvertFrom-Json
                if (-not $syn.inheritance) {
                    $errors += "${file}: Missing 'inheritance' field"
                }
                if (-not $syn.skillId) {
                    $errors += "${file}: Missing 'skillId' field"
                }
            }
            catch {
                $errors += "${file}: Invalid JSON - $($_.Exception.Message)"
            }
        }
    }
}

# ============================================================
# CHECK 3: Episodic file naming
# ============================================================
if ($changedEpisodic) {
    Write-Host "  Validating episodic naming..." -ForegroundColor Gray
    foreach ($file in $changedEpisodic) {
        $fileName = Split-Path -Leaf $file
        
        # Reject legacy .prompt.md format
        if ($fileName -match '\.prompt\.md$') {
            $errors += "${file}: Legacy .prompt.md format not allowed. Use .md instead."
        }
        
        # Enforce naming conventions
        if ($fileName -ne '.markdownlint.json' -and 
            $fileName -notmatch '^(dream-report-|dream-|meditation-|self-actualization-|session-|chronicle-)') {
            $warnings += "${file}: Non-standard naming (should start with dream-, meditation-, session-, etc.)"
        }
        
        # Require dates
        if ($fileName -notmatch '\d{4}-\d{2}-\d{2}' -and $fileName -ne '.markdownlint.json') {
            $warnings += "${file}: Missing date in filename (YYYY-MM-DD)"
        }
    }
}

# ============================================================
# CHECK 4: Master-only contamination prevention
# ============================================================
if ($changedSynapses -or $changedInstructions) {
    Write-Host "  Checking for master-only references..." -ForegroundColor Gray
    foreach ($file in ($changedSynapses + $changedInstructions)) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            
            # Check for master-only paths in inheritable skills
            if ($file -match 'synapses\.json$') {
                try {
                    $syn = Get-Content $file -Raw | ConvertFrom-Json
                    if ($syn.inheritance -in @('inheritable', 'universal')) {
                        foreach ($conn in $syn.connections) {
                            $target = $conn.target
                            if ($target -match '(ROADMAP-UNIFIED|alex_docs/|platforms/(?!vscode-extension)|MASTER-ALEX-PROTECTED)') {
                                $warnings += "${file}: Inheritable skill references master-only path: $target"
                            }
                        }
                    }
                }
                catch { }
            }
        }
    }
}

# ============================================================
# REPORT & DECISION
# ============================================================
if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  WARNINGS ($($warnings.Count)):" -ForegroundColor Yellow
    $warnings | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
}

if ($errors.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ COMMIT BLOCKED - Fix these errors:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "   $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Run this to validate:" -ForegroundColor Yellow
    Write-Host "  .\.github\muscles\brain-qa.ps1 -Mode schema" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ Quality gates passed" -ForegroundColor Green
exit 0
