# Normalize all synapse targets to exact paths
# Pattern: .github/skills/{name}/SKILL.md or .github/instructions/{name}

$skillsPath = "c:\Development\Alex_Plug_In\.github\skills"
$synapseFiles = Get-ChildItem $skillsPath -Recurse -Filter "synapses.json"

$updated = 0
$skipped = 0

foreach ($file in $synapseFiles) {
    $content = Get-Content $file.FullName -Raw
    $json = $content | ConvertFrom-Json
    $modified = $false
    
    # Handle "connections" array format
    if ($json.connections) {
        foreach ($conn in $json.connections) {
            $target = $conn.target
            
            # Skip if already has .github/ prefix (already normalized)
            if ($target -match "^\.github/") {
                continue
            }
            
            # Handle relative instruction paths (../instructions/...)
            if ($target -match "^\.\./instructions/(.+)$") {
                $conn.target = ".github/instructions/$($Matches[1])"
                $modified = $true
                continue
            }
            
            # Handle skill-name/SKILL.md format
            if ($target -match "^([^/]+)/SKILL\.md$") {
                $skillName = $Matches[1]
                $conn.target = ".github/skills/$skillName/SKILL.md"
                $modified = $true
                continue
            }
            
            # Handle plain skill name (no path, no SKILL.md)
            if ($target -notmatch "/" -and $target -notmatch "\.md$") {
                $conn.target = ".github/skills/$target/SKILL.md"
                $modified = $true
                continue
            }
        }
    }
    
    # Handle "synapses" array format (some files use this)
    if ($json.synapses) {
        foreach ($syn in $json.synapses) {
            $target = $syn.target
            
            # Skip if already has .github/ prefix
            if ($target -match "^\.github/") {
                continue
            }
            
            # Handle relative instruction paths
            if ($target -match "^\.\./instructions/(.+)$") {
                $syn.target = ".github/instructions/$($Matches[1])"
                $modified = $true
                continue
            }
            
            # Handle skill-name/SKILL.md format
            if ($target -match "^([^/]+)/SKILL\.md$") {
                $skillName = $Matches[1]
                $syn.target = ".github/skills/$skillName/SKILL.md"
                $modified = $true
                continue
            }
            
            # Handle plain skill name
            if ($target -notmatch "/" -and $target -notmatch "\.md$") {
                $syn.target = ".github/skills/$target/SKILL.md"
                $modified = $true
                continue
            }
        }
    }
    
    if ($modified) {
        $json | ConvertTo-Json -Depth 10 | Set-Content $file.FullName -Encoding UTF8
        Write-Host "Updated: $($file.FullName.Replace('c:\Development\Alex_Plug_In\', ''))" -ForegroundColor Green
        $updated++
    }
    else {
        $skipped++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Updated: $updated files" -ForegroundColor Green
Write-Host "  Skipped: $skipped files (already normalized)" -ForegroundColor Yellow
