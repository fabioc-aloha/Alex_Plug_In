#Requires -Version 7.0
# New Skill Scaffold - Create properly structured skill with frontmatter
# Location: .github/muscles/new-skill.ps1

param(
    [Parameter(Mandatory = $true)]
    [string]$SkillName,
    
    [ValidateSet("inheritable", "universal", "master-only", "heir:vscode", "heir:m365")]
    [string]$Inheritance = "inheritable",
    
    [string]$Description = "",
    [string]$Domain = ""
)

$ErrorActionPreference = "Stop"

# Normalize skill name (kebab-case)
$skillName = $SkillName -replace '\s+', '-' -replace '_', '-' -replace '[^a-zA-Z0-9-]', '' | 
ForEach-Object { $_.ToLower() }

# Paths
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootPath = Split-Path -Parent (Split-Path -Parent $scriptDir)
$templatePath = Join-Path $rootPath ".github\templates\skill-template"
$skillsPath = Join-Path $rootPath ".github\skills"
$newSkillPath = Join-Path $skillsPath $skillName

# Validation
if (Test-Path $newSkillPath) {
    Write-Host "[ERROR] Skill already exists: $skillName" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $templatePath)) {
    Write-Host "[ERROR] Skill template not found: $templatePath" -ForegroundColor Red
    exit 1
}

# Create skill directory
Write-Host "Creating skill: $skillName" -ForegroundColor Cyan
Copy-Item -Recurse $templatePath $newSkillPath

# Update SKILL.md frontmatter
$skillMdPath = Join-Path $newSkillPath "SKILL.md"
$content = Get-Content $skillMdPath -Raw

# Replace name
$displayName = ($SkillName -split '-' | ForEach-Object { 
        $_.Substring(0, 1).ToUpper() + $_.Substring(1) 
    }) -join ' '
$content = $content -replace 'name: "Skill Name"', "name: `"$displayName`""

# Replace description
if ($Description) {
    $content = $content -replace 'description: "Brief description of what this skill provides"', 
    "description: `"$Description`""
}

# Replace domain
if ($Domain) {
    $content = $content -replace '\*\*Domain\*\*: Primary domain.*', "**Domain**: $Domain"
}

# Update date
$today = Get-Date -Format "yyyy-MM-dd"
$content = $content -replace '\*\*Created\*\*: YYYY-MM-DD', "**Created**: $today"
$content = $content -replace '\*\*Last Updated\*\*: YYYY-MM-DD', "**Last Updated**: $today"

# Replace placeholders in headings
$content = $content -replace '# Skill Name', "# $displayName"

Set-Content $skillMdPath $content -NoNewline

# Update synapses.json
$synapsePath = Join-Path $newSkillPath "synapses.json"
$synapseContent = Get-Content $synapsePath -Raw
$synapseContent = $synapseContent -replace '"skillId": "skill-name"', "`"skillId`": `"$skillName`""
Set-Content $synapsePath $synapseContent -NoNewline

# Register non-inheritable skills in SKILL_EXCLUSIONS
$syncArchPath = Join-Path $rootPath ".github\muscles\sync-architecture.cjs"
if ($Inheritance -ne "inheritable" -and $Inheritance -ne "universal") {
    if (Test-Path $syncArchPath) {
        $syncContent = Get-Content $syncArchPath -Raw
        # Find insertion point: last entry before closing brace of SKILL_EXCLUSIONS
        $pattern = "(const SKILL_EXCLUSIONS = \{[\s\S]*?)(\n\};)"
        if ($syncContent -match $pattern) {
            $categoryComment = switch ($Inheritance) {
                'master-only' { 'master-only' }
                'heir:m365'   { 'heir:m365' }
                'heir:vscode' { 'heir:vscode' }
            }
            $newEntry = "`n    '$skillName':$(' ' * [Math]::Max(1, 33 - $skillName.Length))'$Inheritance',"
            $syncContent = $syncContent -replace $pattern, "`$1$newEntry`$2"
            Set-Content $syncArchPath $syncContent -NoNewline
            Write-Host "[LIST] Registered in SKILL_EXCLUSIONS as '$Inheritance'" -ForegroundColor Cyan
        } else {
            Write-Host "[WARN]  Could not find SKILL_EXCLUSIONS in sync-architecture.cjs" -ForegroundColor Yellow
            Write-Host "   Manually add: '$skillName': '$Inheritance'" -ForegroundColor Yellow
        }
    }
}

Write-Host "[OK] Created skill: $skillName" -ForegroundColor Green
Write-Host "   Location: .github/skills/$skillName/" -ForegroundColor Gray
if ($Inheritance -eq "inheritable" -or $Inheritance -eq "universal") {
    Write-Host "   Inheritance: $Inheritance (syncs to all heirs automatically)" -ForegroundColor Gray
} else {
    Write-Host "   Inheritance: $Inheritance (registered in SKILL_EXCLUSIONS)" -ForegroundColor Gray
}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Edit .github/skills/$skillName/SKILL.md" -ForegroundColor Gray
Write-Host "  2. Update synapses.json with connections" -ForegroundColor Gray
Write-Host "  3. Run: .\.github\muscles\brain-qa.ps1 -Mode schema" -ForegroundColor Gray
Write-Host "  4. Add to memory-activation index if user-facing" -ForegroundColor Gray
if ($Inheritance -ne "inheritable" -and $Inheritance -ne "universal") {
    Write-Host "  5. If creating trifecta siblings (.instructions.md, .prompt.md):" -ForegroundColor Yellow
    Write-Host "     Add 'inheritance: $Inheritance' to their YAML frontmatter" -ForegroundColor Yellow
    Write-Host "     to keep them excluded from the same heirs as the skill." -ForegroundColor Yellow
}

# Open in VS Code if available
if (Get-Command code -ErrorAction SilentlyContinue) {
    Write-Host ""
    Write-Host "Opening in VS Code..." -ForegroundColor Cyan
    code "$skillMdPath"
}
