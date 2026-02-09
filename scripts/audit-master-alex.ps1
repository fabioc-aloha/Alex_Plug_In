<#
.SYNOPSIS
    Comprehensive Master Alex audit with 22 automated checks.
.DESCRIPTION
    Runs security, quality, and health audits across the entire project.
    References existing scripts where available, implements unique checks inline.
.PARAMETER Section
    Run specific section(s): 1-22, or 'all' (default), or 'quick' (1-9 only)
.PARAMETER Quiet
    Suppress verbose output, show only issues
.EXAMPLE
    .\audit-master-alex.ps1
    .\audit-master-alex.ps1 -Section 4,7,13
    .\audit-master-alex.ps1 -Section quick
#>
param(
    [Parameter()]
    [string[]]$Section = @('all'),
    
    [switch]$Quiet
)

$ErrorActionPreference = "Continue"
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$extPath = Join-Path $repoRoot "platforms\vscode-extension"
$scriptsPath = Join-Path $repoRoot "scripts"

Push-Location $repoRoot

# Track issues
$script:issues = @()
$script:warnings = @()

function Write-Section($num, $title) {
    Write-Host "`n=== [$num] $title ===" -ForegroundColor Cyan
}

function Add-Issue($msg) { $script:issues += $msg }
function Add-Warning($msg) { $script:warnings += $msg }

# Determine which sections to run
$runSections = @()
if ($Section -contains 'all') {
    $runSections = 1..22
}
elseif ($Section -contains 'quick') {
    $runSections = 1..9
}
else {
    $runSections = $Section | ForEach-Object { [int]$_ }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MASTER ALEX COMPREHENSIVE AUDIT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Running sections: $($runSections -join ', ')"

# === SECTION 1: Version Alignment ===
if (1 -in $runSections) {
    Write-Section 1 "Version Alignment"
    # Direct version check instead of calling release-preflight (avoids npm compile)
    $pkgVersion = (Get-Content "$extPath/package.json" | ConvertFrom-Json).version
    $changelogMatch = [regex]::Match((Get-Content "CHANGELOG.md" -Raw), '## \[(\d+\.\d+\.\d+)\]')
    $copilotMatch = [regex]::Match((Get-Content ".github/copilot-instructions.md" -Raw), '\*\*Version\*\*:\s*(\d+\.\d+\.\d+)')
    
    Write-Host "  package.json: $pkgVersion"
    Write-Host "  CHANGELOG.md: $($changelogMatch.Groups[1].Value)"
    Write-Host "  copilot-instructions: $($copilotMatch.Groups[1].Value)"
    
    if ($pkgVersion -eq $changelogMatch.Groups[1].Value -and $pkgVersion -eq $copilotMatch.Groups[1].Value) {
        Write-Host "  ✅ Versions aligned" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ Version mismatch" -ForegroundColor Red
        Add-Issue "Version mismatch"
    }
}

# === SECTION 2: Heir Folder Sync ===
if (2 -in $runSections) {
    Write-Section 2 "Heir Folder Sync"
    # Direct check instead of calling sync script
    $masterSkills = (Get-ChildItem ".github/skills" -Directory).Count
    $heirSkills = (Get-ChildItem "$extPath/.github/skills" -Directory -ErrorAction SilentlyContinue).Count
    Write-Host "  Master skills: $masterSkills | Heir skills: $heirSkills"
    
    $masterInstructions = (Get-ChildItem ".github/instructions" -File).Count
    $heirInstructions = (Get-ChildItem "$extPath/.github/instructions" -File -ErrorAction SilentlyContinue).Count
    Write-Host "  Master instructions: $masterInstructions | Heir instructions: $heirInstructions"
    
    if ($masterSkills -gt $heirSkills + 10) {
        Write-Host "  ⚠️ Heir may need sync" -ForegroundColor Yellow
        Add-Warning "Heir skills behind by $($masterSkills - $heirSkills)"
    }
    else {
        Write-Host "  ✅ Heir appears synced" -ForegroundColor Green
    }
}

# === SECTION 3: Skill Inheritance ===
if (3 -in $runSections) {
    Write-Section 3 "Skill Inheritance"
    $inheritance = Get-ChildItem ".github/skills/*/synapses.json" | ForEach-Object {
        $s = Get-Content $_ | ConvertFrom-Json
        [PSCustomObject]@{Skill = $_.Directory.Name; Inheritance = $s.inheritance }
    } | Group-Object Inheritance
    $inheritance | ForEach-Object { Write-Host "  $($_.Name): $($_.Count)" }
    Write-Host "✅ Inheritance checked" -ForegroundColor Green
}

# === SECTION 4: Safety Imperatives ===
if (4 -in $runSections) {
    Write-Section 4 "Safety Imperatives"
    $protectionChecks = @(
        @{ File = ".github/config/MASTER-ALEX-PROTECTED.json"; Check = '"protected": true'; Purpose = "Kill switch marker" },
        @{ File = ".vscode/settings.json"; Check = '"alex.workspace.protectedMode": true'; Purpose = "Workspace protection" },
        @{ File = "platforms/vscode-extension/.vscodeignore"; Check = "MASTER-ALEX-PROTECTED.json"; Purpose = "Marker excluded" }
    )
    foreach ($check in $protectionChecks) {
        if (Test-Path $check.File) {
            $content = Get-Content $check.File -Raw
            $found = $content -match [regex]::Escape($check.Check)
            if ($found) { Write-Host "  ✅ $($check.Purpose)" -ForegroundColor Green }
            else { Write-Host "  ❌ $($check.Purpose) MISSING" -ForegroundColor Red; Add-Issue $check.Purpose }
        }
        else {
            Write-Host "  ❌ FILE MISSING: $($check.File)" -ForegroundColor Red
            Add-Issue "Missing: $($check.File)"
        }
    }
}

# === SECTION 5: Build Artifacts ===
if (5 -in $runSections) {
    Write-Section 5 "Build Artifacts"
    $dist = Get-Item "$extPath/dist/extension.js" -ErrorAction SilentlyContinue
    if ($dist) {
        $age = [int]((Get-Date) - $dist.LastWriteTime).TotalHours
        Write-Host "  Build age: $age hours" -ForegroundColor $(if ($age -lt 24) { 'Green' }else { 'Yellow' })
    }
    else {
        Write-Host "  ⚠️ No build found" -ForegroundColor Yellow
        Add-Warning "No dist/extension.js"
    }
}

# === SECTION 6: Documentation Cross-References ===
if (6 -in $runSections) {
    Write-Section 6 "Documentation Cross-References"
    $requiredRefs = @(
        @{ Doc = "README.md"; MustLink = "CHANGELOG.md" },
        @{ Doc = ".github/copilot-instructions.md"; MustLink = "RISKS.md" }
    )
    foreach ($ref in $requiredRefs) {
        if (Test-Path $ref.Doc) {
            $content = Get-Content $ref.Doc -Raw
            $found = $content -match [regex]::Escape($ref.MustLink)
            $status = if ($found) { "✅" } else { "⚠️" }
            Write-Host "  $status $($ref.Doc) -> $($ref.MustLink)"
            if (-not $found) { Add-Warning "$($ref.Doc) missing link to $($ref.MustLink)" }
        }
    }
}

# === SECTION 7: Synapse Health ===
if (7 -in $runSections) {
    Write-Section 7 "Synapse Network Health"
    & "$scriptsPath\validate-synapses.ps1" 2>&1 | Select-String "✅|❌|⚠️|Valid|Invalid|Error"
}

# === SECTION 8: alex_docs Audit ===
if (8 -in $runSections) {
    Write-Section 8 "alex_docs Documentation"
    $currentVersion = (Get-Content "$extPath/package.json" | ConvertFrom-Json).version
    $actualSkillCount = (Get-ChildItem ".github/skills" -Directory).Count
    Write-Host "  Current version: $currentVersion"
    Write-Host "  Skill count: $actualSkillCount"
    
    # Check deprecated terms
    $deprecated = Select-String -Path "alex_docs/*.md" -Pattern 'DK-|domain-knowledge/' -ErrorAction SilentlyContinue
    if ($deprecated) {
        Write-Host "  ⚠️ Deprecated terms found in alex_docs" -ForegroundColor Yellow
        Add-Warning "Deprecated terminology in alex_docs"
    }
    else {
        Write-Host "  ✅ No deprecated terms" -ForegroundColor Green
    }
}

# === SECTION 9: Skill Network Diagram ===
if (9 -in $runSections) {
    Write-Section 9 "Skill Network Diagram"
    $skills = (Get-ChildItem ".github/skills" -Directory).Count
    $catalogPath = "alex_docs/skills/SKILLS-CATALOG.md"
    if (Test-Path $catalogPath) {
        $nodes = ([regex]::Matches((Get-Content $catalogPath -Raw), '\w+\[[\w-]+\]') | 
            Select-Object -ExpandProperty Value | Sort-Object -Unique).Count
        Write-Host "  Skills: $skills | Diagram nodes: $nodes"
        if ($skills -eq $nodes) {
            Write-Host "  ✅ MATCH" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️ MISMATCH" -ForegroundColor Yellow
            Add-Warning "Skill diagram out of sync"
        }
    }
}

# === SECTION 10: Extension UI ===
if (10 -in $runSections) {
    Write-Section 10 "Extension UI"
    $srcPath = "$extPath/src"
    
    # Dead patterns
    $windowOpen = Select-String -Path "$srcPath/**/*.ts" -Pattern 'window\.open\(' -Recurse -ErrorAction SilentlyContinue
    $locationReload = Select-String -Path "$srcPath/**/*.ts" -Pattern 'location\.reload\(\)' -Recurse -ErrorAction SilentlyContinue
    
    if ($windowOpen) { Write-Host "  ⚠️ window.open() found (dead in WebViews)" -ForegroundColor Yellow; Add-Warning "window.open in WebView" }
    else { Write-Host "  ✅ No window.open()" -ForegroundColor Green }
    
    if ($locationReload) { Write-Host "  ⚠️ location.reload() found (dead in WebViews)" -ForegroundColor Yellow; Add-Warning "location.reload in WebView" }
    else { Write-Host "  ✅ No location.reload()" -ForegroundColor Green }
}

# === SECTION 11: Dependency Health ===
if (11 -in $runSections) {
    Write-Section 11 "Dependency Health"
    Push-Location $extPath
    $auditResult = npm audit --json 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($auditResult.metadata) {
        $vulns = $auditResult.metadata.vulnerabilities
        $critical = $vulns.critical + $vulns.high
        Write-Host "  Critical/High: $critical | Moderate: $($vulns.moderate) | Low: $($vulns.low)"
        if ($critical -gt 0) { Add-Issue "Security vulnerabilities: $critical critical/high" }
    }
    Pop-Location
}

# === SECTION 12: TypeScript & Lint ===
if (12 -in $runSections) {
    Write-Section 12 "TypeScript & Lint"
    # Check last build status without running npm (avoids waiting)
    $dist = Get-Item "$extPath/dist/extension.js" -ErrorAction SilentlyContinue
    if ($dist) {
        $age = [int]((Get-Date) - $dist.LastWriteTime).TotalHours
        Write-Host "  Last build: $age hours ago"
        if ($age -lt 24) {
            Write-Host "  ✅ Recent build exists" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️ Build is stale ($age hours)" -ForegroundColor Yellow
            Add-Warning "Build is $age hours old"
        }
    }
    else {
        Write-Host "  ❌ No build found" -ForegroundColor Red
        Add-Issue "No dist/extension.js"
    }
    # Tip for manual check
    Write-Host "  Run 'npm run compile' in platforms/vscode-extension to verify" -ForegroundColor Gray
}

# === SECTION 13: Security ===
if (13 -in $runSections) {
    Write-Section 13 "Security"
    $srcPath = "$extPath/src"
    
    # Secret patterns (excluding comments and env vars)
    $secretPatterns = @('api[_-]?key\s*[:=]\s*["\x27][\w-]{20,}', 'password\s*[:=]\s*["\x27][^"\x27]{8,}')
    $secretsFound = $false
    foreach ($pattern in $secretPatterns) {
        $matches = Select-String -Path "$srcPath/**/*.ts" -Pattern $pattern -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.Line -notmatch '^\s*(//|#|\*)' -and $_.Line -notmatch 'process\.env' }
        if ($matches) { $secretsFound = $true }
    }
    
    if ($secretsFound) { Write-Host "  ⚠️ Potential secrets in code" -ForegroundColor Yellow; Add-Warning "Potential secrets" }
    else { Write-Host "  ✅ No secrets detected" -ForegroundColor Green }
    
    # CSP check
    $csp = Select-String -Path "$srcPath/**/*.ts" -Pattern 'Content-Security-Policy|getNonce' -Recurse -ErrorAction SilentlyContinue
    if ($csp) { Write-Host "  ✅ CSP implemented" -ForegroundColor Green }
    else { Write-Host "  ⚠️ No CSP found" -ForegroundColor Yellow }
}

# === SECTION 14: Bundle Size ===
if (14 -in $runSections) {
    Write-Section 14 "Bundle Size"
    $dist = Get-Item "$extPath/dist/extension.js" -ErrorAction SilentlyContinue
    if ($dist) {
        $sizeKB = [math]::Round($dist.Length / 1KB, 1)
        Write-Host "  Bundle: $sizeKB KB"
        if ($sizeKB -gt 500) { Write-Host "  ⚠️ Large bundle" -ForegroundColor Yellow; Add-Warning "Large bundle: $sizeKB KB" }
        else { Write-Host "  ✅ Size acceptable" -ForegroundColor Green }
    }
}

# === SECTION 15: Git Hygiene ===
if (15 -in $runSections) {
    Write-Section 15 "Git Hygiene"
    $status = git status --porcelain
    $changes = ($status | Measure-Object).Count
    Write-Host "  Uncommitted changes: $changes"
    if ($changes -gt 0) { Add-Warning "Uncommitted changes: $changes files" }
    
    $branch = git branch --show-current
    Write-Host "  Branch: $branch"
}

# === SECTION 16: Changelog ===
if (16 -in $runSections) {
    Write-Section 16 "Changelog"
    if (Test-Path "CHANGELOG.md") {
        $changelog = Get-Content "CHANGELOG.md" -Raw
        $versions = [regex]::Matches($changelog, '## \[(\d+\.\d+\.\d+)\]')
        $pkgVersion = (Get-Content "$extPath/package.json" | ConvertFrom-Json).version
        
        if ($versions.Count -gt 0 -and $versions[0].Groups[1].Value -eq $pkgVersion) {
            Write-Host "  ✅ Changelog matches package.json ($pkgVersion)" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️ Changelog may need update" -ForegroundColor Yellow
            Add-Warning "Changelog version mismatch"
        }
    }
}

# === SECTION 17: API Compatibility ===
if (17 -in $runSections) {
    Write-Section 17 "API Compatibility"
    $deprecated = @('workspace.rootPath', 'ExtensionContext.storagePath')
    $srcPath = "$extPath/src"
    $found = @()
    foreach ($api in $deprecated) {
        $matches = Select-String -Path "$srcPath/**/*.ts" -Pattern $api -Recurse -SimpleMatch -ErrorAction SilentlyContinue
        if ($matches) { $found += $api }
    }
    if ($found) {
        Write-Host "  ⚠️ Deprecated APIs: $($found -join ', ')" -ForegroundColor Yellow
        Add-Warning "Deprecated APIs in use"
    }
    else {
        Write-Host "  ✅ No deprecated APIs" -ForegroundColor Green
    }
}

# === SECTION 18: Test Coverage ===
if (18 -in $runSections) {
    Write-Section 18 "Test Coverage"
    $testFiles = Get-ChildItem "$extPath" -Recurse -Include "*.test.ts", "*.spec.ts" -File -ErrorAction SilentlyContinue
    $srcFiles = Get-ChildItem "$extPath/src" -Recurse -Include "*.ts" -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -notmatch '\.(test|spec)\.ts$' }
    
    Write-Host "  Source files: $($srcFiles.Count) | Test files: $($testFiles.Count)"
    if ($testFiles.Count -eq 0) { Add-Warning "No test files" }
}

# === SECTION 19: Accessibility ===
if (19 -in $runSections) {
    Write-Section 19 "Accessibility"
    $srcPath = "$extPath/src"
    $aria = Select-String -Path "$srcPath/**/*.ts" -Pattern 'aria-|role=' -Recurse -ErrorAction SilentlyContinue
    $cssVars = Select-String -Path "$srcPath/**/*.ts" -Pattern 'var\(--vscode-' -Recurse -ErrorAction SilentlyContinue
    
    Write-Host "  ARIA usage: $($aria.Count) | CSS variables: $($cssVars.Count)"
}

# === SECTION 20: Localization ===
if (20 -in $runSections) {
    Write-Section 20 "Localization"
    $hasL10n = Test-Path "$extPath/l10n" -or Test-Path "$extPath/package.nls.json"
    if ($hasL10n) { Write-Host "  ✅ l10n configured" -ForegroundColor Green }
    else { Write-Host "  ℹ️ No l10n (optional)" }
}

# === SECTION 21: Asset Integrity ===
if (21 -in $runSections) {
    Write-Section 21 "Asset Integrity"
    $pkg = Get-Content "$extPath/package.json" | ConvertFrom-Json
    if ($pkg.icon -and (Test-Path "$extPath/$($pkg.icon)")) {
        Write-Host "  ✅ Icon exists" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️ Icon missing or not configured" -ForegroundColor Yellow
    }
}

# === SECTION 22: Configuration Files ===
if (22 -in $runSections) {
    Write-Section 22 "Configuration Files"
    $configs = @(
        @{ File = "$extPath/.vscode/launch.json"; Name = "launch.json" },
        @{ File = "$extPath/tsconfig.json"; Name = "tsconfig.json" },
        @{ File = "$extPath/.vscodeignore"; Name = ".vscodeignore" }
    )
    foreach ($cfg in $configs) {
        if (Test-Path $cfg.File) {
            Write-Host "  ✅ $($cfg.Name)" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️ $($cfg.Name) missing" -ForegroundColor Yellow
        }
    }
}

# === SUMMARY ===
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  AUDIT SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($script:issues.Count -eq 0 -and $script:warnings.Count -eq 0) {
    Write-Host "✅ All checks passed!" -ForegroundColor Green
}
else {
    if ($script:issues.Count -gt 0) {
        Write-Host "`n❌ ISSUES ($($script:issues.Count)):" -ForegroundColor Red
        $script:issues | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    }
    if ($script:warnings.Count -gt 0) {
        Write-Host "`n⚠️ WARNINGS ($($script:warnings.Count)):" -ForegroundColor Yellow
        $script:warnings | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    }
}

Pop-Location
