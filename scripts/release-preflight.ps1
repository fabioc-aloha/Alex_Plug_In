# Release Preflight Checklist Script
# Run this BEFORE every release
# Updated for platforms/vscode-extension structure

param(
    [switch]$SkipTests,
    [switch]$Package
)

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent $scriptPath
$extensionPath = Join-Path $rootPath "platforms\vscode-extension"

# Validate extension path exists
if (-not (Test-Path $extensionPath)) {
    Write-Host "❌ Extension path not found: $extensionPath" -ForegroundColor Red
    exit 1
}

Push-Location $extensionPath

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RELEASE PREFLIGHT CHECKLIST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$errors = @()

# 0. PAT Check
Write-Host "0. Checking PAT configuration..." -ForegroundColor Yellow
$envFile = Join-Path $extensionPath ".env"
$patFound = $false

if ($env:VSCE_PAT) {
    Write-Host "   ✅ VSCE_PAT set in environment" -ForegroundColor Green
    $patFound = $true
}
elseif (Test-Path $envFile) {
    $patLine = Get-Content $envFile | Where-Object { $_ -match '^VSCE_PAT=' }
    if ($patLine) {
        Write-Host "   ✅ VSCE_PAT found in .env" -ForegroundColor Green
        $patFound = $true
    }
}

if (-not $patFound) {
    $errors += "VSCE_PAT not configured (set env var or add to platforms/vscode-extension/.env)"
    Write-Host "   ❌ VSCE_PAT not found" -ForegroundColor Red
}

# 1. Version Synchronization Check
Write-Host "`n1. Checking version synchronization..." -ForegroundColor Yellow

$pkg = Get-Content "package.json" | ConvertFrom-Json
$pkgVersion = $pkg.version
Write-Host "   package.json: $pkgVersion" -ForegroundColor Gray

# Check CHANGELOG in root
$changelogPath = Join-Path $rootPath "CHANGELOG.md"
if (Test-Path $changelogPath) {
    $changelogContent = Get-Content $changelogPath -Raw
    if ($changelogContent -match '\[(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)\]') {
        $changelogVersion = $matches[1]
        Write-Host "   CHANGELOG.md: $changelogVersion" -ForegroundColor Gray
        
        if ($pkgVersion -ne $changelogVersion) {
            $errors += "Version mismatch: package.json ($pkgVersion) != CHANGELOG ($changelogVersion)"
            Write-Host "   ❌ MISMATCH!" -ForegroundColor Red
        }
        else {
            Write-Host "   ✅ Versions match" -ForegroundColor Green
        }
    }
    else {
        $errors += "Could not parse version from CHANGELOG.md"
        Write-Host "   ⚠️ Could not parse CHANGELOG version" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   ⚠️ CHANGELOG.md not found at root" -ForegroundColor Yellow
}

# Check MASTER copilot-instructions.md version (SOURCE OF TRUTH)
$masterInstructions = Join-Path $rootPath ".github\copilot-instructions.md"
if (Test-Path $masterInstructions) {
    $masterContent = Get-Content $masterInstructions -Raw
    if ($masterContent -match '# Alex v(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)') {
        $masterVersion = $matches[1]
        Write-Host "   Master copilot-instructions.md: $masterVersion" -ForegroundColor Gray
        if ($pkgVersion -ne $masterVersion) {
            $errors += "Version mismatch: package.json ($pkgVersion) != Master copilot-instructions ($masterVersion)"
            Write-Host "   ❌ MISMATCH! Update .github/copilot-instructions.md version" -ForegroundColor Red
        }
        else {
            Write-Host "   ✅ Master version matches" -ForegroundColor Green
        }
    }
    else {
        $errors += "Could not parse version from Master .github/copilot-instructions.md"
        Write-Host "   ⚠️ Could not parse Master version" -ForegroundColor Yellow
    }
}
else {
    $errors += "Master .github/copilot-instructions.md not found"
    Write-Host "   ❌ Master copilot-instructions.md not found" -ForegroundColor Red
}

# Check heir copilot-instructions.md version (should match after build)
$heirInstructions = Join-Path $extensionPath ".github\copilot-instructions.md"
if (Test-Path $heirInstructions) {
    $heirContent = Get-Content $heirInstructions -Raw
    if ($heirContent -match '# Alex v(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)') {
        $heirVersion = $matches[1]
        Write-Host "   Heir copilot-instructions.md: $heirVersion" -ForegroundColor Gray
        if ($pkgVersion -ne $heirVersion) {
            $errors += "Version mismatch: package.json ($pkgVersion) != heir copilot-instructions ($heirVersion). Run build-extension-package.ps1 to sync."
            Write-Host "   ❌ MISMATCH! Run build-extension-package.ps1" -ForegroundColor Red
        }
        else {
            Write-Host "   ✅ Heir version matches" -ForegroundColor Green
        }
    }
}

# Check BUILD-MANIFEST.json exists and is recent (indicates build script was run)
$manifestPath = Join-Path $extensionPath ".github\BUILD-MANIFEST.json"
if (Test-Path $manifestPath) {
    $manifest = Get-Content $manifestPath | ConvertFrom-Json
    $buildTimestamp = $manifest.generatedAt
    if ($buildTimestamp) {
        $buildTime = [DateTime]::Parse($buildTimestamp)
        $hoursSinceBuild = ((Get-Date) - $buildTime).TotalHours
        Write-Host "   BUILD-MANIFEST.json: $buildTimestamp" -ForegroundColor Gray
        if ($hoursSinceBuild -gt 24) {
            Write-Host "   ⚠️ Build manifest is $([math]::Round($hoursSinceBuild)) hours old - consider re-running build-extension-package.ps1" -ForegroundColor Yellow
        }
        else {
            Write-Host "   ✅ Build manifest is recent ($([math]::Round($hoursSinceBuild, 1)) hours ago)" -ForegroundColor Green
        }
    }
    else {
        Write-Host "   ⚠️ BUILD-MANIFEST.json missing timestamp" -ForegroundColor Yellow
    }
}
else {
    $errors += "BUILD-MANIFEST.json not found. Run build-extension-package.ps1 to generate."
    Write-Host "   ❌ BUILD-MANIFEST.json missing! Run build-extension-package.ps1" -ForegroundColor Red
}

# Check ROADMAP-UNIFIED.md version
$roadmapPath = Join-Path $rootPath "ROADMAP-UNIFIED.md"
if (Test-Path $roadmapPath) {
    $roadmapContent = Get-Content $roadmapPath -Raw
    if ($roadmapContent -match 'Current Master Version\*\*\s*\|\s*(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)') {
        $roadmapVersion = $matches[1]
        Write-Host "   ROADMAP-UNIFIED.md: $roadmapVersion" -ForegroundColor Gray
        if ($pkgVersion -ne $roadmapVersion) {
            Write-Host "   ⚠️ ROADMAP version differs (update recommended)" -ForegroundColor Yellow
        }
        else {
            Write-Host "   ✅ ROADMAP version matches" -ForegroundColor Green
        }
    }
}

# Check README.md skill count matches actual
$readmePath = Join-Path $rootPath "README.md"
$masterSkillsPath = Join-Path $rootPath ".github\skills"
if ((Test-Path $readmePath) -and (Test-Path $masterSkillsPath)) {
    $actualSkillCount = (Get-ChildItem $masterSkillsPath -Directory).Count
    $readmeContent = Get-Content $readmePath -Raw
    # Match patterns like "77 skills" in README
    if ($readmeContent -match '\|\s*\*\*Intelligence\*\*\s*\|\s*(\d+) skills') {
        $readmeSkillCount = [int]$matches[1]
        Write-Host "   README.md skills: $readmeSkillCount (actual: $actualSkillCount)" -ForegroundColor Gray
        if ($readmeSkillCount -ne $actualSkillCount) {
            $errors += "Skill count mismatch: README ($readmeSkillCount) != actual ($actualSkillCount)"
            Write-Host "   ❌ MISMATCH! Update README.md skill count" -ForegroundColor Red
        }
        else {
            Write-Host "   ✅ README skill count matches" -ForegroundColor Green
        }
    }
}

# 2. Build Check
Write-Host "`n2. Checking build..." -ForegroundColor Yellow
$buildOutput = npm run compile 2>&1
$buildExitCode = $LASTEXITCODE
if ($buildExitCode -ne 0) {
    $errors += "Build failed"
    Write-Host "   ❌ Build failed" -ForegroundColor Red
}
else {
    Write-Host "   ✅ Build successful" -ForegroundColor Green
}

# 3. Lint Check
Write-Host "`n3. Checking lint..." -ForegroundColor Yellow
$lintOutput = npm run lint 2>&1
$lintExitCode = $LASTEXITCODE
if ($lintExitCode -ne 0) {
    $errors += "Lint errors found"
    Write-Host "   ❌ Lint errors" -ForegroundColor Red
}
else {
    Write-Host "   ✅ Lint clean" -ForegroundColor Green
}

# 4. Test Check
if (-not $SkipTests) {
    Write-Host "`n4. Running tests..." -ForegroundColor Yellow
    $testOutput = npm test 2>&1
    $testExitCode = $LASTEXITCODE
    if ($testExitCode -ne 0) {
        $errors += "Tests failed"
        Write-Host "   ❌ Tests failed" -ForegroundColor Red
    }
    else {
        Write-Host "   ✅ Tests passed" -ForegroundColor Green
    }
}
else {
    Write-Host "`n4. Skipping tests (use -SkipTests:`$false to run)" -ForegroundColor Gray
}

# 5. Git Status (from root)
Push-Location $rootPath
Write-Host "`n5. Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "   ⚠️ Uncommitted changes:" -ForegroundColor Yellow
    $gitStatus | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
}
else {
    Write-Host "   ✅ Working directory clean" -ForegroundColor Green
}

# 6. Git Tag Check
Write-Host "`n6. Checking git tags..." -ForegroundColor Yellow
$existingTag = git tag -l "v$pkgVersion"
if ($existingTag) {
    Write-Host "   ⚠️ Tag v$pkgVersion already exists" -ForegroundColor Yellow
}
else {
    Write-Host "   ✅ Tag v$pkgVersion available" -ForegroundColor Green
}
Pop-Location

# 7. Package Check (optional)
if ($Package) {
    Write-Host "`n7. Creating package..." -ForegroundColor Yellow
    npx vsce package --no-dependencies 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        $errors += "Package creation failed"
        Write-Host "   ❌ Package failed" -ForegroundColor Red
    }
    else {
        $vsix = Get-ChildItem "*.vsix" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        Write-Host "   ✅ Package created: $($vsix.Name)" -ForegroundColor Green
    }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "  ✅ PREFLIGHT PASSED - Ready to publish!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "  Run: .\scripts\release-vscode.ps1 -BumpType patch [-PreRelease]" -ForegroundColor Gray
}
else {
    Write-Host "  ❌ PREFLIGHT FAILED - Fix issues before publishing" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "Issues found:" -ForegroundColor White
    $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

Pop-Location
