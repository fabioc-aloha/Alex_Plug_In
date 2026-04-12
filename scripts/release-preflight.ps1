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
    Write-Host "[ERROR] Extension path not found: $extensionPath" -ForegroundColor Red
    exit 1
}

Push-Location $extensionPath

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RELEASE PREFLIGHT CHECKLIST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$errors = @()

# 0. PAT Check
Write-Host "0. Checking PAT configuration..." -ForegroundColor Yellow
$envFile = Join-Path $rootPath ".env"
$patFound = $false

if ($env:VSCE_PAT) {
    Write-Host "   [OK] VSCE_PAT set in environment" -ForegroundColor Green
    $patFound = $true
}
elseif (Test-Path $envFile) {
    $patLine = Get-Content $envFile | Where-Object { $_ -match '^VSCE_PAT=' }
    if ($patLine) {
        Write-Host "   [OK] VSCE_PAT found in .env" -ForegroundColor Green
        $patFound = $true
    }
}

if (-not $patFound) {
    $errors += "VSCE_PAT not configured (set env var or add VSCE_PAT to root .env)"
    Write-Host "   [ERROR] VSCE_PAT not found" -ForegroundColor Red
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
            Write-Host "   [ERROR] MISMATCH!" -ForegroundColor Red
        }
        else {
            Write-Host "   [OK] Versions match" -ForegroundColor Green
        }
    }
    else {
        $errors += "Could not parse version from CHANGELOG.md"
        Write-Host "   [WARN] Could not parse CHANGELOG version" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   [WARN] CHANGELOG.md not found at root" -ForegroundColor Yellow
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
            Write-Host "   [WARN] Build manifest is $([math]::Round($hoursSinceBuild)) hours old - consider re-running build-extension-package.ps1" -ForegroundColor Yellow
        }
        else {
            Write-Host "   [OK] Build manifest is recent ($([math]::Round($hoursSinceBuild, 1)) hours ago)" -ForegroundColor Green
        }
    }
    else {
        Write-Host "   [WARN] BUILD-MANIFEST.json missing timestamp" -ForegroundColor Yellow
    }
}
else {
    $errors += "BUILD-MANIFEST.json not found. Run build-extension-package.ps1 to generate."
    Write-Host "   [ERROR] BUILD-MANIFEST.json missing! Run build-extension-package.ps1" -ForegroundColor Red
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
            Write-Host "   [ERROR] MISMATCH! Update README.md skill count" -ForegroundColor Red
        }
        else {
            Write-Host "   [OK] README skill count matches" -ForegroundColor Green
        }
    }
}

# 2. Build Check
Write-Host "`n2. Checking build..." -ForegroundColor Yellow
$prevEAP = $ErrorActionPreference; $ErrorActionPreference = "Continue"
$buildOutput = npm run compile 2>&1
$buildExitCode = $LASTEXITCODE
$ErrorActionPreference = $prevEAP
if ($buildExitCode -ne 0) {
    $errors += "Build failed"
    Write-Host "   [ERROR] Build failed" -ForegroundColor Red
}
else {
    Write-Host "   [OK] Build successful" -ForegroundColor Green
}

# 3. Lint Check
Write-Host "`n3. Checking lint..." -ForegroundColor Yellow
$prevEAP = $ErrorActionPreference; $ErrorActionPreference = "Continue"
$lintOutput = npm run lint 2>&1
$lintExitCode = $LASTEXITCODE
$ErrorActionPreference = $prevEAP
if ($lintExitCode -ne 0) {
    $errors += "Lint errors found"
    Write-Host "   [ERROR] Lint errors" -ForegroundColor Red
}
else {
    Write-Host "   [OK] Lint clean" -ForegroundColor Green
}

# 4. Test Check
if (-not $SkipTests) {
    Write-Host "`n4. Running tests..." -ForegroundColor Yellow
    $prevEAP = $ErrorActionPreference; $ErrorActionPreference = "Continue"
    $testOutput = npm test 2>&1
    $testExitCode = $LASTEXITCODE
    $ErrorActionPreference = $prevEAP
    if ($testExitCode -ne 0) {
        $errors += "Tests failed"
        Write-Host "   [ERROR] Tests failed" -ForegroundColor Red
    }
    else {
        Write-Host "   [OK] Tests passed" -ForegroundColor Green
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
    Write-Host "   [WARN] Uncommitted changes:" -ForegroundColor Yellow
    $gitStatus | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
}
else {
    Write-Host "   [OK] Working directory clean" -ForegroundColor Green
}

# 6. Git Tag Check
Write-Host "`n6. Checking git tags..." -ForegroundColor Yellow
$existingTag = git tag -l "v$pkgVersion"
if ($existingTag) {
    Write-Host "   [WARN] Tag v$pkgVersion already exists" -ForegroundColor Yellow
}
else {
    Write-Host "   [OK] Tag v$pkgVersion available" -ForegroundColor Green
}
Pop-Location

# 7. Package Check (optional)
if ($Package) {
    Write-Host "`n7. Creating package..." -ForegroundColor Yellow
    # Remove stale VSIX files to avoid picking up old versions
    Get-ChildItem "*.vsix" -ErrorAction SilentlyContinue | Remove-Item -Force
    npx vsce package --no-dependencies 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        $errors += "Package creation failed"
        Write-Host "   [ERROR] Package failed" -ForegroundColor Red
    }
    else {
        $vsix = Get-ChildItem "*.vsix" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        Write-Host "   [OK] Package created: $($vsix.Name)" -ForegroundColor Green
    }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "  [OK] PREFLIGHT PASSED - Ready to publish!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "  Run: .\scripts\release-vscode.ps1 [-PreRelease]" -ForegroundColor Gray
}
else {
    Write-Host "  [ERROR] PREFLIGHT FAILED - Fix issues before publishing" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "Issues found:" -ForegroundColor White
    $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

Pop-Location
