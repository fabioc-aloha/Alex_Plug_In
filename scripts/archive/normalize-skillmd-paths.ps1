# Normalize embedded synapses in SKILL.md files
# Convert: ../skill-name/SKILL.md → .github/skills/skill-name/SKILL.md
# Also: ../instructions/file.md → .github/instructions/file.md

$skillsPath = "c:\Development\Alex_Plug_In\.github\skills"
$skillFiles = Get-ChildItem $skillsPath -Recurse -Filter "SKILL.md"

$updated = 0
$skipped = 0

foreach ($file in $skillFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Pattern 1: [Name](../skill-name/SKILL.md) → [Name](.github/skills/skill-name/SKILL.md)
    $content = $content -replace '\]\(\.\./([^/]+)/SKILL\.md\)', '](.github/skills/$1/SKILL.md)'
    
    # Pattern 2: [Name](../instructions/file.md) → [Name](.github/instructions/file.md)
    $content = $content -replace '\]\(\.\./instructions/([^\)]+)\)', '](.github/instructions/$1)'
    
    # Pattern 3: Bare markdown links - `skill-name/SKILL.md` without full path (not URL)
    # Skip if already has .github/ prefix
    # Note: This handles backtick-wrapped references in Synapses section
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.FullName.Replace('c:\Development\Alex_Plug_In\', ''))" -ForegroundColor Green
        $updated++
    }
    else {
        $skipped++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Updated: $updated files" -ForegroundColor Green
Write-Host "  Skipped: $skipped files (no changes needed)" -ForegroundColor Yellow
