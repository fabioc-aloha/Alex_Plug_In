# fix-fence-bug.ps1
# Detects and fixes the VS Code create_file wrapping fence bug
# Usage: pwsh -File fix-fence-bug.ps1 [-Fix] [-FullRepo] [-Path <specific-file>]

param(
    [switch]$Fix,           # Actually fix the files (default: report only)
    [switch]$FullRepo,      # Scan entire repo, not just .github/
    [string]$Path = "",     # Specific file to check (default: scan .github/)
    [switch]$Verbose
)

$script:issuesFound = 0
$script:issuesFixed = 0

function Test-WrappingFence {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
    if (-not $content) { return $false }
    
    # Pattern: starts with ```something and ends with ```
    $startsWithFence = $content -match '^```\w*\r?\n'
    $endsWithFence = $content -match '\r?\n```\s*$'
    
    return $startsWithFence -and $endsWithFence
}

function Get-FenceLanguage {
    param([string]$Content)
    
    if ($Content -match '^```(\w+)') {
        return $matches[1]
    }
    return "unknown"
}

function Remove-WrappingFence {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw
    $language = Get-FenceLanguage $content
    
    # Remove opening fence (```language + newline)
    $content = $content -replace '^```\w*\r?\n', ''
    
    # Remove closing fence (newline + ``` + optional whitespace at end)
    $content = $content -replace '\r?\n```\s*$', ''
    
    # Trim any trailing newlines and add single newline
    $content = $content.TrimEnd() + "`n"
    
    Set-Content $FilePath -Value $content -NoNewline
    
    return $language
}

function Test-FileImpact {
    param([string]$FilePath)
    
    $ext = [System.IO.Path]::GetExtension($FilePath)
    $name = [System.IO.Path]::GetFileName($FilePath)
    
    switch -Regex ($name) {
        'SKILL\.md$' { return @{ Severity = "Critical"; Reason = "Frontmatter parsing breaks" } }
        '\.instructions\.md$' { return @{ Severity = "Critical"; Reason = "VS Code won't load instruction" } }
        '\.prompt\.md$' { return @{ Severity = "Critical"; Reason = "Prompt command won't register" } }
        'synapses\.json$' { return @{ Severity = "Critical"; Reason = "Invalid JSON" } }
        'copilot-instructions\.md$' { return @{ Severity = "Critical"; Reason = "Core personality broken" } }
        '\.json$' { return @{ Severity = "Critical"; Reason = "Invalid JSON" } }
        '\.md$' { return @{ Severity = "Medium"; Reason = "Visual noise in rendering" } }
        default { return @{ Severity = "Low"; Reason = "Unknown impact" } }
    }
}

function Format-Severity {
    param([string]$Severity)
    
    switch ($Severity) {
        "Critical" { return "🔴 Critical" }
        "Medium" { return "🟡 Medium" }
        "Low" { return "🟢 Low" }
        default { return "⚪ Unknown" }
    }
}

# Main execution
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       Wrapping Fence Bug Detector/Fixer                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$targetFiles = @()

if ($Path) {
    # Single file mode
    if (Test-Path $Path) {
        $targetFiles += Get-Item $Path
    }
    else {
        Write-Host "❌ File not found: $Path" -ForegroundColor Red
        exit 1
    }
}
else {
    # Determine scan root
    if ($FullRepo) {
        # Find repo root (go up from .github/muscles/ to repo root)
        $scanRoot = (Get-Item $PSScriptRoot).Parent.Parent.FullName
        Write-Host "📁 Scanning full repo: $scanRoot" -ForegroundColor Gray
    }
    else {
        # Default: just .github/ folder
        $scanRoot = Join-Path $PSScriptRoot ".."
        Write-Host "📁 Scanning: $scanRoot" -ForegroundColor Gray
    }
    Write-Host ""
    
    # Get all .md and .json files
    $targetFiles = Get-ChildItem $scanRoot -Recurse -Include "*.md", "*.json" -File |
    Where-Object { $_.FullName -notmatch 'node_modules|\.git\\' }
}

$results = @()

foreach ($file in $targetFiles) {
    if (Test-WrappingFence $file.FullName) {
        $script:issuesFound++
        $impact = Test-FileImpact $file.FullName
        $repoRoot = (Get-Item $PSScriptRoot).Parent.Parent.FullName
        $relativePath = $file.FullName -replace [regex]::Escape($repoRoot + "\"), ''
        
        $result = [PSCustomObject]@{
            File     = $relativePath
            Severity = $impact.Severity
            Reason   = $impact.Reason
            Fixed    = $false
        }
        
        if ($Fix) {
            $language = Remove-WrappingFence $file.FullName
            $result.Fixed = $true
            $script:issuesFixed++
            Write-Host "✅ Fixed: $relativePath (was ``````$language)" -ForegroundColor Green
        }
        else {
            $content = Get-Content $file.FullName -Raw
            $language = Get-FenceLanguage $content
            Write-Host "$(Format-Severity $impact.Severity): $relativePath" -ForegroundColor Yellow
            Write-Host "   Wrapped in: ``````$language" -ForegroundColor Gray
            Write-Host "   Impact: $($impact.Reason)" -ForegroundColor Gray
        }
        
        $results += $result
    }
    elseif ($Verbose) {
        $repoRoot = (Get-Item $PSScriptRoot).Parent.Parent.FullName
        $relativePath = $file.FullName -replace [regex]::Escape($repoRoot + "\"), ''
        Write-Host "✓ Clean: $relativePath" -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($script:issuesFound -eq 0) {
    Write-Host "✅ No wrapping fence bugs found!" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "📊 Summary:" -ForegroundColor Cyan
    Write-Host "   Issues found: $($script:issuesFound)" -ForegroundColor Yellow
    
    if ($Fix) {
        Write-Host "   Issues fixed: $($script:issuesFixed)" -ForegroundColor Green
        Write-Host ""
        Write-Host "💡 Run 'npm run sync-architecture' to propagate fixes to heir" -ForegroundColor Cyan
    }
    else {
        $critical = ($results | Where-Object { $_.Severity -eq "Critical" }).Count
        Write-Host "   Critical: $critical" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Run with -Fix to automatically repair:" -ForegroundColor Cyan
        Write-Host "   pwsh -File .github/muscles/fix-fence-bug.ps1 -Fix" -ForegroundColor White
    }
    
    exit 1
}
