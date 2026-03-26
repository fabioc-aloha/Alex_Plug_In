# build-extension-package.ps1
# Builds Alex VS Code Extension package from Master Alex source
#
# This script copies the cognitive architecture from root .github/ to the
# extension's .github/ folder, applying appropriate exclusions for
# development-specific files.
#
# Usage: .\scripts\build-extension-package.ps1 [-SkipCompile] [-Verbose]

param(
    [switch]$SkipCompile,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# Paths
$RootPath = Split-Path $PSScriptRoot -Parent
$ExtensionPath = Join-Path $RootPath "platforms/vscode-extension"
$SourceGithub = Join-Path $RootPath ".github"
$TargetGithub = Join-Path $ExtensionPath ".github"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Alex Extension Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Source: $SourceGithub"
Write-Host "Target: $TargetGithub"
Write-Host ""

# Files/folders to EXCLUDE from heir (development-specific)
# NOTE: Skill exclusions are handled dynamically via synapses.json inheritance field
$Exclusions = @(
    # GitHub repo features (not needed in user projects)
    "ISSUE_TEMPLATE",
    "PULL_REQUEST_TEMPLATE.md",
    "FUNDING.yml",
    "dependabot.yml",
    "workflows",
    
    # Session-specific files (unique to Master Alex)
    "episodic/dream-report-*.md",
    "episodic/meditation-session-*.md",
    "episodic/meditation-*.md",
    "episodic/chronicle-*.md",
    "episodic/self-actualization-*.md",
    
    # Development config
    "config/cognitive-config.json",
    
    # Personal user profile (unique to each user - never copy to heirs)
    "config/user-profile.json",
    "config/USER-PROFILE.md",
    
    # Master-only protection marker (CRITICAL: never copy to heirs)
    "config/MASTER-ALEX-PROTECTED.json"
    
    # Skills are NOT hardcoded here - inheritance is read from synapses.json
)

# PERSONAL DATA PATTERNS - Fail build if found in heir
# These patterns detect content that should not be in a generic distribution
# Format: @{ Pattern = "regex"; Description = "what it detects"; AllowIn = @("file patterns to ignore") }
$ForbiddenPatterns = @(
    @{ 
        Pattern     = "Fabio\s+Correa|Fabio's"
        Description = "Developer's full name"
        AllowIn     = @()  # Never allowed
    },
    @{ 
        Pattern     = "correax@|fabiocorrea@"
        Description = "Developer's email patterns"
        AllowIn     = @()
    },
    @{
        Pattern     = "Charlotte"
        Description = "Personal location reference"
        AllowIn     = @()
    },
    @{
        Pattern     = "Alex\s*\+\s*Fabio"
        Description = "Personal collaboration credit"
        AllowIn     = @()
    },
    @{
        Pattern     = "The user's name is \*\*[^*]+\*\*"
        Description = "Hardcoded user name reference"
        AllowIn     = @()
    }
)

# Skills explicitly marked as inheritable (copy these)
# NOTE: Inheritance is read dynamically from synapses.json - not hardcoded

function Get-SkillInheritance {
    param([string]$SkillPath)
    
    $synapsePath = Join-Path $SkillPath "synapses.json"
    if (-not (Test-Path $synapsePath)) {
        # Default: inheritable if no synapses.json
        return "inheritable"
    }
    
    try {
        $synapse = Get-Content $synapsePath -Raw | ConvertFrom-Json
        if ($synapse.inheritance) {
            return $synapse.inheritance
        }
        return "inheritable"
    }
    catch {
        Write-Warning "Failed to parse $synapsePath - defaulting to inheritable"
        return "inheritable"
    }
}

function Test-ShouldExclude {
    param([string]$RelativePath)
    
    # Normalize path separators to forward slashes for consistent matching
    $normalizedPath = $RelativePath -replace '\\', '/'
    
    # Check skill inheritance from synapses.json (source of truth)
    if ($normalizedPath -match "^skills/([^/]+)") {
        $skillName = $Matches[1]
        $skillFolder = Join-Path $SourceGithub "skills/$skillName"
        
        if (Test-Path $skillFolder) {
            $inheritance = Get-SkillInheritance -SkillPath $skillFolder
            
            # Exclude master-only skills
            if ($inheritance -eq "master-only") {
                return $true
            }
            # For heir-specific skills, only include if targeting that heir
            # Build script targets vscode heir
            if ($inheritance -eq "heir:m365") {
                return $true  # Exclude M365-only skills from VS Code heir
            }
            # heir:vscode and inheritable/universal pass through
        }
    }
    
    # Check hardcoded exclusions (non-skill files)
    foreach ($pattern in $Exclusions) {
        # Handle wildcards
        if ($pattern -match '\*') {
            $regexPattern = "^" + ($pattern -replace '\*', '.*') + "$"
            if ($normalizedPath -match $regexPattern) {
                return $true
            }
        }
        # Handle exact matches and folder prefixes
        elseif ($normalizedPath -eq $pattern -or $normalizedPath.StartsWith("$pattern/")) {
            return $true
        }
    }
    return $false
}

# Step 1: Validate source and VERSION SYNCHRONIZATION
Write-Host "[1/7] Validating source and versions..." -ForegroundColor Yellow
if (-not (Test-Path $SourceGithub)) {
    Write-Error "Source .github/ not found at $SourceGithub"
    exit 1
}

# VERSION SYNCHRONIZATION CHECK (Critical for avoiding upgrade message bugs)
$pkg = Get-Content "$ExtensionPath/package.json" | ConvertFrom-Json
$pkgVersion = $pkg.version
Write-Host "  package.json version: $pkgVersion" -ForegroundColor Gray

$masterInstructionsPath = Join-Path $SourceGithub "copilot-instructions.md"
if (Test-Path $masterInstructionsPath) {
    $masterContent = Get-Content $masterInstructionsPath -Raw
    if ($masterContent -match '\*\*Version\*\*:\s*(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)') {
        $masterVersion = $matches[1]
        Write-Host "  Master copilot-instructions.md: $masterVersion" -ForegroundColor Gray
        
        if ($pkgVersion -ne $masterVersion) {
            Write-Host "" -ForegroundColor Red
            Write-Host "  ❌ VERSION MISMATCH DETECTED!" -ForegroundColor Red
            Write-Host "     package.json:              $pkgVersion" -ForegroundColor Red
            Write-Host "     copilot-instructions.md:   $masterVersion" -ForegroundColor Red
            Write-Host "" -ForegroundColor Red
            Write-Host "  Fix: Update .github/copilot-instructions.md **Version** to $pkgVersion" -ForegroundColor Yellow
            Write-Host "" -ForegroundColor Red
            
            if (-not $DryRun) {
                Write-Error "Build aborted due to version mismatch. The upgrade dialog will show incorrect 'from' version if not fixed."
                exit 1
            }
            else {
                Write-Host "  (Continuing due to -DryRun flag)" -ForegroundColor Yellow
            }
        }
        else {
            Write-Host "  ✅ Versions synchronized" -ForegroundColor Green
        }
    }
    else {
        Write-Host "  ⚠️ Could not parse version from copilot-instructions.md" -ForegroundColor Yellow
    }
}
else {
    Write-Error "Master copilot-instructions.md not found at $masterInstructionsPath"
    exit 1
}

$sourceFiles = Get-ChildItem $SourceGithub -Recurse -File
Write-Host "  Found $($sourceFiles.Count) files in source"

# Step 2: Clean target (if not dry run)
Write-Host "[2/7] Preparing target..." -ForegroundColor Yellow
if (-not $DryRun) {
    if (Test-Path $TargetGithub) {
        Write-Host "  Removing existing $TargetGithub"
        Remove-Item $TargetGithub -Recurse -Force
    }
    New-Item $TargetGithub -ItemType Directory -Force | Out-Null
}

# Step 3: Copy files with exclusions
Write-Host "[3/7] Copying files..." -ForegroundColor Yellow
$copied = 0
$excluded = 0

foreach ($file in $sourceFiles) {
    $relativePath = $file.FullName.Substring($SourceGithub.Length + 1)
    
    if (Test-ShouldExclude $relativePath) {
        $excluded++
        if ($VerbosePreference -eq 'Continue') {
            Write-Host "  SKIP: $relativePath" -ForegroundColor DarkGray
        }
        continue
    }
    
    $targetFile = Join-Path $TargetGithub $relativePath
    $targetDir = Split-Path $targetFile -Parent
    
    if (-not $DryRun) {
        if (-not (Test-Path $targetDir)) {
            New-Item $targetDir -ItemType Directory -Force | Out-Null
        }
        Copy-Item $file.FullName $targetFile -Force
    }
    
    $copied++
    if ($VerbosePreference -eq 'Continue') {
        Write-Host "  COPY: $relativePath" -ForegroundColor Green
    }
}

Write-Host "  Copied: $copied files"
Write-Host "  Excluded: $excluded files"

# Step 3.5: Create fresh template files (not copied from Master)
Write-Host "[3.5/7] Creating fresh template files..." -ForegroundColor Yellow
if (-not $DryRun) {
    # User Profile JSON - blank template
    $userProfileTemplate = @{
        name                 = ""
        nickname             = ""
        pronouns             = ""
        formality            = "balanced"
        detailLevel          = "balanced"
        explanationStyle     = "mixed"
        humor                = $true
        encouragement        = $true
        questionFrequency    = "moderate"
        proactiveSuggestions = $true
        primaryTechnologies  = @()
        learningGoals        = @()
        expertiseAreas       = @()
        currentProjects      = @()
        projectPersona       = @{
            id         = ""
            confidence = 0
            reasons    = @()
        }
    }
    $userProfilePath = Join-Path $TargetGithub "config/user-profile.json"
    $userProfileDir = Split-Path $userProfilePath -Parent
    if (-not (Test-Path $userProfileDir)) {
        New-Item $userProfileDir -ItemType Directory -Force | Out-Null
    }
    $userProfileTemplate | ConvertTo-Json -Depth 3 | Set-Content $userProfilePath
    Write-Host "  Created: config/user-profile.json (template)"
}
else {
    Write-Host "  Skipped (--DryRun flag)" -ForegroundColor DarkGray
}

# Step 4: Generate manifest
Write-Host "[4/7] Generating manifest..." -ForegroundColor Yellow
$manifest = @{
    generatedAt       = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    sourceCommit      = (git -C $RootPath rev-parse --short HEAD 2>$null) ?? "unknown"
    sourceVersion     = (Get-Content "$RootPath/platforms/vscode-extension/package.json" | ConvertFrom-Json).version
    filesCopied       = $copied
    filesExcluded     = $excluded
    exclusionPatterns = $Exclusions
}

$manifestPath = Join-Path $TargetGithub "BUILD-MANIFEST.json"
if (-not $DryRun) {
    $manifest | ConvertTo-Json -Depth 3 | Set-Content $manifestPath
    Write-Host "  Created: BUILD-MANIFEST.json"
}

# Step 5: Compile extension (unless skipped)
Write-Host "[5/7] Building extension..." -ForegroundColor Yellow
if ($SkipCompile) {
    Write-Host "  Skipped (--SkipCompile flag)" -ForegroundColor DarkGray
}
elseif ($DryRun) {
    Write-Host "  Skipped (--DryRun flag)" -ForegroundColor DarkGray
}
else {
    Push-Location $ExtensionPath
    try {
        Write-Host "  Running: npm run compile"
        npm run compile 2>&1 | ForEach-Object { Write-Host "    $_" }
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Compilation failed"
            exit 1
        }
        Write-Host "  Compilation successful" -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
}

# Step 6: Final version verification
Write-Host "[6/7] Verifying heir version..." -ForegroundColor Yellow
$heirInstructionsPath = Join-Path $TargetGithub "copilot-instructions.md"
if (Test-Path $heirInstructionsPath) {
    $heirContent = Get-Content $heirInstructionsPath -Raw
    if ($heirContent -match '\*\*Version\*\*:\s*(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)') {
        $heirVersion = $matches[1]
        if ($heirVersion -eq $pkgVersion) {
            Write-Host "  ✅ Heir version verified: $heirVersion" -ForegroundColor Green
        }
        else {
            Write-Host "  ❌ CRITICAL: Heir version ($heirVersion) != package.json ($pkgVersion)" -ForegroundColor Red
            Write-Host "     This should not happen - file copy may have failed!" -ForegroundColor Red
            exit 1
        }
    }
}

# Step 7: Personal data validation (CRITICAL for curation integrity)
Write-Host "[7/7] Scanning for personal data leakage..." -ForegroundColor Yellow
$violations = @()
$scannedFiles = 0

if (-not $DryRun) {
    $heirFiles = Get-ChildItem $TargetGithub -Recurse -File -Include "*.md", "*.json" | 
    Where-Object { $_.Name -ne "BUILD-MANIFEST.json" }
    
    foreach ($file in $heirFiles) {
        $scannedFiles++
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if (-not $content) { continue }
        
        $relativePath = $file.FullName.Substring($TargetGithub.Length + 1) -replace '\\', '/'
        
        foreach ($forbidden in $ForbiddenPatterns) {
            # Check if this file is in the allow list
            $isAllowed = $false
            foreach ($allowPattern in $forbidden.AllowIn) {
                if ($relativePath -like $allowPattern) {
                    $isAllowed = $true
                    break
                }
            }
            
            if (-not $isAllowed -and $content -match $forbidden.Pattern) {
                $matchedText = $matches[0]
                $violations += @{
                    File    = $relativePath
                    Pattern = $forbidden.Description
                    Match   = if ($matchedText.Length -gt 50) { $matchedText.Substring(0, 50) + "..." } else { $matchedText }
                }
            }
        }
    }
    
    Write-Host "  Scanned $scannedFiles files for personal data"
    
    if ($violations.Count -gt 0) {
        Write-Host ""
        Write-Host "  ❌ PERSONAL DATA DETECTED IN HEIR!" -ForegroundColor Red
        Write-Host "  =================================" -ForegroundColor Red
        Write-Host ""
        
        foreach ($v in $violations) {
            Write-Host "  📁 $($v.File)" -ForegroundColor Yellow
            Write-Host "     Pattern: $($v.Pattern)" -ForegroundColor Gray
            Write-Host "     Found:   '$($v.Match)'" -ForegroundColor Red
            Write-Host ""
        }
        
        Write-Host "  Fix: Edit the source files to remove personal data," -ForegroundColor Yellow
        Write-Host "       or add files to exclusion list if they shouldn't be in heir." -ForegroundColor Yellow
        Write-Host ""
        Write-Error "Build aborted: $($violations.Count) personal data violation(s) found"
        exit 1
    }
    else {
        Write-Host "  ✅ No personal data found - heir is clean" -ForegroundColor Green
    }
}
else {
    Write-Host "  Skipped (--DryRun flag)" -ForegroundColor DarkGray
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files copied:   $copied"
Write-Host "Files excluded: $excluded"
Write-Host "Target:         $TargetGithub"
Write-Host "Version:        $pkgVersion ✓"
Write-Host ""

if ($DryRun) {
    Write-Host "NOTE: This was a dry run. No files were modified." -ForegroundColor Yellow
}
else {
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run .\scripts\release-preflight.ps1 to verify release readiness" -ForegroundColor Gray
    Write-Host "  2. Run 'Alex: Validate Heir (LLM Curation Check)' in VS Code for semantic validation" -ForegroundColor Gray
    Write-Host ""
}
