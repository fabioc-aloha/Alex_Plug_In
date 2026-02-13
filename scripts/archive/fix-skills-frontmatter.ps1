<#
.SYNOPSIS
    Auto-fixes Alex skills for VS Code 1.109 Agent Skills compliance.

.DESCRIPTION
    Adds required name and description fields to SKILL.md frontmatter.
    Extracts name from H1 heading and description from blockquote tagline.

.EXAMPLE
    .\fix-skills-frontmatter.ps1
#>

param(
    [string]$SkillsPath = ".\.github\skills",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Convert-ToDisplayName {
    param([string]$FolderName)
    # Convert kebab-case to Title Case
    $words = $FolderName -split '-'
    $titleCased = $words | ForEach-Object { 
        if ($_.Length -gt 0) {
            $_.Substring(0,1).ToUpper() + $_.Substring(1).ToLower()
        }
    }
    return $titleCased -join ' '
}

function Get-SkillMetadata {
    param([string]$Content, [string]$FolderName)
    
    $metadata = @{
        Name = ""
        Description = ""
        ApplyTo = ""
    }
    
    # Extract name from H1 (# Title)
    if ($Content -match '(?m)^#\s+(.+?)(?:\s*$|\r?\n)') {
        $rawName = $Matches[1].Trim()
        # Remove emojis and clean up
        $metadata.Name = $rawName -replace '[\p{So}\p{Cs}]+\s*', '' -replace '\s+', ' '
    } else {
        $metadata.Name = Convert-ToDisplayName $FolderName
    }
    
    # Extract description from blockquote (> tagline)
    if ($Content -match '(?m)^>\s*(.+?)(?:\s*$|\r?\n)') {
        $metadata.Description = $Matches[1].Trim()
    } else {
        $metadata.Description = "Skill for $($metadata.Name.ToLower())"
    }
    
    # Extract existing applyTo if present
    if ($Content -match 'applyTo:\s*[''"]?(.+?)[''"]?\s*(?:\r?\n|$)') {
        $metadata.ApplyTo = $Matches[1].Trim()
    }
    
    return $metadata
}

$skillDirs = Get-ChildItem -Path $SkillsPath -Directory | Where-Object { $_.Name -ne ".markdownlint.json" }
$fixed = 0
$skipped = 0

foreach ($dir in $skillDirs) {
    $skillFile = Join-Path $dir.FullName "SKILL.md"
    
    if (-not (Test-Path $skillFile)) {
        Write-Warning "No SKILL.md in: $($dir.Name)"
        continue
    }
    
    $content = Get-Content $skillFile -Raw
    $metadata = Get-SkillMetadata -Content $content -FolderName $dir.Name
    
    # Check if already has name and description
    $hasName = $content -match '(?m)^name:\s*[''"]?.+[''"]?\s*$'
    $hasDesc = $content -match '(?m)^description:\s*[''"]?.+[''"]?\s*$'
    
    if ($hasName -and $hasDesc) {
        Write-Host "  SKIP: $($dir.Name) (already compliant)" -ForegroundColor Gray
        $skipped++
        continue
    }
    
    # Build new frontmatter
    $hasFrontmatter = $content -match "^---\s*\r?\n([\s\S]*?)\r?\n---"
    
    if ($hasFrontmatter) {
        $existingFrontmatter = $Matches[1]
        $newFrontmatterLines = @()
        
        # Add name if missing
        if (-not $hasName) {
            $newFrontmatterLines += "name: `"$($metadata.Name)`""
        }
        # Add description if missing
        if (-not $hasDesc) {
            $newFrontmatterLines += "description: `"$($metadata.Description)`""
        }
        
        # Combine with existing
        $newFrontmatter = ($newFrontmatterLines -join "`n") + "`n" + $existingFrontmatter
        $newContent = $content -replace "^---\s*\r?\n[\s\S]*?\r?\n---", "---`n$newFrontmatter`n---"
    } else {
        # No frontmatter - create new
        $applyToLine = if ($metadata.ApplyTo) { "`napplyTo: `"$($metadata.ApplyTo)`"" } else { "" }
        $newFrontmatter = "---`nname: `"$($metadata.Name)`"`ndescription: `"$($metadata.Description)`"$applyToLine`n---`n`n"
        $newContent = $newFrontmatter + $content
    }
    
    if ($DryRun) {
        Write-Host "  DRY-RUN: $($dir.Name)" -ForegroundColor Yellow
        Write-Host "    Name: $($metadata.Name)"
        Write-Host "    Description: $($metadata.Description)"
    } else {
        Set-Content -Path $skillFile -Value $newContent -NoNewline -Encoding UTF8
        Write-Host "  FIXED: $($dir.Name)" -ForegroundColor Green
    }
    $fixed++
}

Write-Host "`n===== Fix Summary =====" -ForegroundColor Cyan
Write-Host "Fixed: $fixed"
Write-Host "Skipped (already compliant): $skipped"

if (-not $DryRun -and $fixed -gt 0) {
    Write-Host "`nRun validate-skills.ps1 to verify compliance." -ForegroundColor Yellow
}
