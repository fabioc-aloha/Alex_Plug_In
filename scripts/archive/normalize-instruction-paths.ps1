# Normalize embedded synapses in .instructions.md and .prompt.md files
# Convert: [file.instructions.md] → [.github/instructions/file.instructions.md]
# Convert: [file.prompt.md] → [.github/prompts/file.prompt.md]

$instructionsPath = "c:\Development\Alex_Plug_In\.github\instructions"
$promptsPath = "c:\Development\Alex_Plug_In\.github\prompts"

$updated = 0
$skipped = 0

# Process instruction files
$files = Get-ChildItem $instructionsPath -Filter "*.md"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Pattern: [name.instructions.md] → [.github/instructions/name.instructions.md]
    # Only match if not already prefixed with .github/
    $content = $content -replace '\[([^\[\]]+\.instructions\.md)\](?!\()', '[.github/instructions/$1]'
    
    # Pattern: [name.prompt.md] → [.github/prompts/name.prompt.md]
    $content = $content -replace '\[([^\[\]]+\.prompt\.md)\](?!\()', '[.github/prompts/$1]'
    
    # Pattern: [SKILL.md] references in embedded synapses (rare in instruction files)
    # [skill-name/SKILL.md] → [.github/skills/skill-name/SKILL.md]
    $content = $content -replace '\[([^\[\]/]+)/SKILL\.md\](?!\()', '[.github/skills/$1/SKILL.md]'
    
    if ($content -ne $originalContent) {
        Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $updated++
    } else {
        $skipped++
    }
}

# Process prompt files
if (Test-Path $promptsPath) {
    $files = Get-ChildItem $promptsPath -Filter "*.md"
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        $originalContent = $content
        
        # Same patterns
        $content = $content -replace '\[([^\[\]]+\.instructions\.md)\](?!\()', '[.github/instructions/$1]'
        $content = $content -replace '\[([^\[\]]+\.prompt\.md)\](?!\()', '[.github/prompts/$1]'
        $content = $content -replace '\[([^\[\]/]+)/SKILL\.md\](?!\()', '[.github/skills/$1/SKILL.md]'
        
        if ($content -ne $originalContent) {
            Set-Content $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "Updated: prompts/$($file.Name)" -ForegroundColor Green
            $updated++
        } else {
            $skipped++
        }
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Updated: $updated files" -ForegroundColor Green
Write-Host "  Skipped: $skipped files (no changes needed)" -ForegroundColor Yellow
