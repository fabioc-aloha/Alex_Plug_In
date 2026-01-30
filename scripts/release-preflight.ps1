# Release Preflight Checklist Script
# Run this BEFORE every release

param(
    [switch]$SkipTests,
    [switch]$Package
)

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent $scriptPath

Push-Location $rootPath

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RELEASE PREFLIGHT CHECKLIST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$errors = @()

# 1. Version Synchronization Check
Write-Host "1. Checking version synchronization..." -ForegroundColor Yellow

$pkg = Get-Content "package.json" | ConvertFrom-Json
$pkgVersion = $pkg.version
Write-Host "   package.json: $pkgVersion" -ForegroundColor Gray

$changelogContent = Get-Content "CHANGELOG.md" -Raw
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

# 2. Build Check
Write-Host "`n2. Checking build..." -ForegroundColor Yellow
npm run compile 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    $errors += "Build failed"
    Write-Host "   ❌ Build failed" -ForegroundColor Red
}
else {
    Write-Host "   ✅ Build successful" -ForegroundColor Green
}

# 3. Lint Check
Write-Host "`n3. Checking lint..." -ForegroundColor Yellow
$lintOutput = npm run lint 2>&1
if ($LASTEXITCODE -ne 0) {
    $errors += "Lint errors found"
    Write-Host "   ❌ Lint errors" -ForegroundColor Red
}
else {
    Write-Host "   ✅ Lint clean" -ForegroundColor Green
}

# 4. Test Check
if (-not $SkipTests) {
    Write-Host "`n4. Running tests..." -ForegroundColor Yellow
    npm test 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        $errors += "Tests failed"
        Write-Host "   ❌ Tests failed" -ForegroundColor Red
    }
    else {
        Write-Host "   ✅ Tests passed" -ForegroundColor Green
    }
}
else {
    Write-Host "`n4. Skipping tests (use -SkipTests:$false to run)" -ForegroundColor Gray
}

# 5. Git Status
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
    Write-Host "  1. git add -A && git commit -m 'chore: release v$pkgVersion'" -ForegroundColor Gray
    Write-Host "  2. git tag v$pkgVersion" -ForegroundColor Gray
    Write-Host "  3. git push && git push --tags" -ForegroundColor Gray
    Write-Host "  4. vsce publish" -ForegroundColor Gray
}
else {
    Write-Host "  ❌ PREFLIGHT FAILED - Fix issues before publishing" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
    Write-Host "Issues found:" -ForegroundColor White
    $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}

Pop-Location
