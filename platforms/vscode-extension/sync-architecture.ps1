# sync-architecture.ps1
# Syncs cognitive architecture files from root .github/ to the extension's .github/ folder
# This ensures the extension package includes all architecture files for deployment to user workspaces
#
# IMPORTANT: This script syncs TEMPLATE files only, not session-specific data.
# - Episodic folder gets only .prompt.md files (templates), not session reports
# - Config folder gets templates only, not user-specific config
# - Domain knowledge includes all DK-*.md files

param(
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

# Paths
$rootPath = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$extensionPath = $PSScriptRoot
$sourceGithub = Join-Path $rootPath ".github"
$destGithub = Join-Path $extensionPath ".github"

Write-Host "`n🧠 Alex Architecture Sync" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "Source: $sourceGithub" -ForegroundColor DarkGray
Write-Host "Dest:   $destGithub" -ForegroundColor DarkGray

# Architecture folders to sync (these deploy to user workspaces)
# Note: skills/ is maintained directly in the extension folder, not synced from root
$foldersToSync = @(
    @{ Name = "instructions"; Filter = "*.md" },
    @{ Name = "prompts"; Filter = "*.prompt.md" },
    @{ Name = "domain-knowledge"; Filter = "*.md" },
    @{ Name = "agents"; Filter = "*.agent.md" }
)

# Episodic folder - only sync TEMPLATE prompts, not session-specific files
$episodicTemplates = @(
    "consolidation-framework-integration-meditation.prompt.md",
    "dual-mode-processing-meditation.prompt.md",
    "unified-consciousness-integration-meditation.prompt.md"
)

# Config templates only (not user-specific config)
$configTemplates = @(
    "cognitive-config-template.json",
    "USER-PROFILE-TEMPLATE.md"
)

# Core files to sync (root-level .md files, excluding repo meta files)
$filesToSync = @(
    "copilot-instructions.md",
    "alex-cognitive-architecture.md",
    "ALEX-INTEGRATION.md",
    "ASSISTANT-COMPATIBILITY.md",
    "PROJECT-TYPE-TEMPLATES.md",
    "VALIDATION-SUITE.md"
)

# Validate source exists
if (-not (Test-Path $sourceGithub)) {
    Write-Host "❌ Source .github folder not found: $sourceGithub" -ForegroundColor Red
    exit 1
}

# Ensure destination .github exists
if (-not (Test-Path $destGithub)) {
    New-Item -ItemType Directory -Path $destGithub -Force | Out-Null
    Write-Host "📁 Created: $destGithub" -ForegroundColor Green
}

# Sync folders with filters
$syncedFolders = 0
foreach ($folder in $foldersToSync) {
    $srcFolder = Join-Path $sourceGithub $folder.Name
    $destFolder = Join-Path $destGithub $folder.Name
    
    if (Test-Path $srcFolder) {
        # Remove existing destination folder to ensure clean sync
        if (Test-Path $destFolder) {
            Remove-Item -Path $destFolder -Recurse -Force
        }
        New-Item -ItemType Directory -Path $destFolder -Force | Out-Null
        
        # Copy files matching filter
        $files = Get-ChildItem -Path $srcFolder -Filter $folder.Filter -File
        foreach ($file in $files) {
            Copy-Item -Path $file.FullName -Destination $destFolder -Force
        }
        $fileCount = (Get-ChildItem -Path $destFolder -File -ErrorAction SilentlyContinue).Count
        Write-Host "  ✓ $($folder.Name)/ ($fileCount files)" -ForegroundColor Green
        $syncedFolders++
    } else {
        if ($Verbose) {
            Write-Host "  ⊘ $($folder.Name)/ (not found in source)" -ForegroundColor DarkGray
        }
    }
}

# Sync episodic templates only (not session-specific files)
$srcEpisodic = Join-Path $sourceGithub "episodic"
$destEpisodic = Join-Path $destGithub "episodic"
if (Test-Path $srcEpisodic) {
    if (Test-Path $destEpisodic) {
        Remove-Item -Path $destEpisodic -Recurse -Force
    }
    New-Item -ItemType Directory -Path $destEpisodic -Force | Out-Null
    
    $episodicCount = 0
    foreach ($template in $episodicTemplates) {
        $srcFile = Join-Path $srcEpisodic $template
        if (Test-Path $srcFile) {
            Copy-Item -Path $srcFile -Destination $destEpisodic -Force
            $episodicCount++
        }
    }
    Write-Host "  ✓ episodic/ ($episodicCount templates - session files excluded)" -ForegroundColor Green
    $syncedFolders++
}

# Sync config templates only
$srcConfig = Join-Path $sourceGithub "config"
$destConfig = Join-Path $destGithub "config"
if (Test-Path $srcConfig) {
    if (Test-Path $destConfig) {
        Remove-Item -Path $destConfig -Recurse -Force
    }
    New-Item -ItemType Directory -Path $destConfig -Force | Out-Null
    
    $configCount = 0
    foreach ($template in $configTemplates) {
        $srcFile = Join-Path $srcConfig $template
        if (Test-Path $srcFile) {
            Copy-Item -Path $srcFile -Destination $destConfig -Force
            $configCount++
        }
    }
    Write-Host "  ✓ config/ ($configCount templates - user config excluded)" -ForegroundColor Green
    $syncedFolders++
}

# Sync individual files
$syncedFiles = 0
foreach ($file in $filesToSync) {
    $srcFile = Join-Path $sourceGithub $file
    $destFile = Join-Path $destGithub $file
    
    if (Test-Path $srcFile) {
        Copy-Item -Path $srcFile -Destination $destFile -Force
        Write-Host "  ✓ $file" -ForegroundColor Green
        $syncedFiles++
    } else {
        Write-Host "  ⚠ $file (not found in source)" -ForegroundColor Yellow
    }
}

# Report skills folder (maintained separately)
$skillsFolder = Join-Path $destGithub "skills"
if (Test-Path $skillsFolder) {
    $skillCount = (Get-ChildItem -Path $skillsFolder -Directory).Count
    Write-Host "  ✓ skills/ ($skillCount skills - maintained in extension)" -ForegroundColor Cyan
}

Write-Host "`n✅ Sync complete: $syncedFolders folders, $syncedFiles files" -ForegroundColor Green
Write-Host "⚠️  Session-specific files (dream reports, meditation sessions) excluded" -ForegroundColor Yellow
Write-Host ""
