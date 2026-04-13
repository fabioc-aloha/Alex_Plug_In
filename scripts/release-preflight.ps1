# Release Preflight Checklist Script
# Validates release readiness -- read-only checks, no builds or packaging.
# Expects build-extension-package.ps1 to have already produced the VSIX.
#
# Responsibility: verify artifacts, version consistency, git state, credentials.
# Does NOT: compile, lint, test, package, or modify any files.

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

$pkg = Get-Content "package.json" | ConvertFrom-Json
$pkgVersion = $pkg.version

# 1. Version Synchronization
Write-Host "1. Checking version synchronization..." -ForegroundColor Yellow
Write-Host "   package.json: $pkgVersion" -ForegroundColor Gray

# CHANGELOG version
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
            Write-Host "   [OK] CHANGELOG version matches" -ForegroundColor Green
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

# BUILD-MANIFEST freshness
$manifestPath = Join-Path $extensionPath ".github\BUILD-MANIFEST.json"
if (Test-Path $manifestPath) {
    $manifest = Get-Content $manifestPath | ConvertFrom-Json
    $buildTimestamp = $manifest.generatedAt
    if ($buildTimestamp) {
        $buildTime = [DateTime]::Parse($buildTimestamp)
        $hoursSinceBuild = ((Get-Date) - $buildTime).TotalHours
        Write-Host "   BUILD-MANIFEST: $buildTimestamp" -ForegroundColor Gray
        if ($hoursSinceBuild -gt 24) {
            Write-Host "   [WARN] Build is $([math]::Round($hoursSinceBuild)) hours old -- re-run build-extension-package.ps1?" -ForegroundColor Yellow
        }
        else {
            Write-Host "   [OK] Build is recent ($([math]::Round($hoursSinceBuild, 1)) hours ago)" -ForegroundColor Green
        }
    }
    else {
        Write-Host "   [WARN] BUILD-MANIFEST.json missing timestamp" -ForegroundColor Yellow
    }
}
else {
    $errors += "BUILD-MANIFEST.json missing -- run build-extension-package.ps1"
    Write-Host "   [ERROR] BUILD-MANIFEST.json missing!" -ForegroundColor Red
}

# README skill count
$readmePath = Join-Path $rootPath "README.md"
$masterSkillsPath = Join-Path $rootPath ".github\skills"
if ((Test-Path $readmePath) -and (Test-Path $masterSkillsPath)) {
    $actualSkillCount = (Get-ChildItem $masterSkillsPath -Directory).Count
    $readmeContent = Get-Content $readmePath -Raw
    if ($readmeContent -match '\|\s*\*\*Intelligence\*\*\s*\|\s*(\d+) skills') {
        $readmeSkillCount = [int]$matches[1]
        if ($readmeSkillCount -ne $actualSkillCount) {
            $errors += "Skill count mismatch: README ($readmeSkillCount) != actual ($actualSkillCount)"
            Write-Host "   [ERROR] README skill count: $readmeSkillCount (actual: $actualSkillCount)" -ForegroundColor Red
        }
        else {
            Write-Host "   [OK] README skill count: $actualSkillCount" -ForegroundColor Green
        }
    }
}

# 2. VSIX Package Verification
Write-Host "`n2. Checking VSIX package..." -ForegroundColor Yellow
$vsix = Get-ChildItem "*.vsix" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $vsix) {
    $errors += "No .vsix file found -- run build-extension-package.ps1"
    Write-Host "   [ERROR] No .vsix file found" -ForegroundColor Red
}
else {
    $vsixSizeMB = [math]::Round($vsix.Length / 1MB, 2)
    Write-Host "   Found: $($vsix.Name) ($vsixSizeMB MB)" -ForegroundColor Gray
    $vsixVersion = $null
    if ($vsix.Name -match '(\d+\.\d+\.\d+)') {
        $vsixVersion = $matches[1]
    }
    if ($vsixVersion -and $vsixVersion -ne $pkgVersion) {
        $errors += "VSIX version ($vsixVersion) != package.json ($pkgVersion) -- rebuild"
        Write-Host "   [ERROR] Version mismatch: VSIX=$vsixVersion, package.json=$pkgVersion" -ForegroundColor Red
    }
    else {
        Write-Host "   [OK] VSIX version: $vsixVersion" -ForegroundColor Green
    }
}

# 3. Git Status (from root)
Push-Location $rootPath
Write-Host "`n3. Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "   [WARN] Uncommitted changes:" -ForegroundColor Yellow
    $gitStatus | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
}
else {
    Write-Host "   [OK] Working directory clean" -ForegroundColor Green
}

# 4. Git Tag Check
Write-Host "`n4. Checking git tags..." -ForegroundColor Yellow
$existingTag = git tag -l "v$pkgVersion"
if ($existingTag) {
    Write-Host "   [WARN] Tag v$pkgVersion already exists" -ForegroundColor Yellow
}
else {
    Write-Host "   [OK] Tag v$pkgVersion available" -ForegroundColor Green
}
Pop-Location

# 5. PAT Configuration
Write-Host "`n5. Checking PAT configuration..." -ForegroundColor Yellow
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

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "  [OK] PREFLIGHT PASSED - Ready to publish!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "Next: .\scripts\release-vscode.ps1 [-PreRelease]" -ForegroundColor Gray
}
else {
    Write-Host "  [ERROR] PREFLIGHT FAILED - Fix issues before publishing" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "Issues found:" -ForegroundColor White
    $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    exit 1
}

Pop-Location
