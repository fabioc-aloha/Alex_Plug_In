# VS Code Extension Manifest Validation Script
# Validates that configuration updates and command registrations match package.json

param(
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$extensionRoot = Split-Path -Parent $scriptDir

Write-Host "🔍 Validating VS Code Extension Manifest..." -ForegroundColor Cyan

# Load package.json
$packageJsonPath = Join-Path $extensionRoot "package.json"
if (-not (Test-Path $packageJsonPath)) {
    Write-Host "❌ package.json not found at: $packageJsonPath" -ForegroundColor Red
    exit 1
}

$manifest = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

# Extract registered configuration properties
$registeredConfigs = @{}
if ($manifest.contributes.configuration.properties) {
    $manifest.contributes.configuration.properties.PSObject.Properties | ForEach-Object {
        $registeredConfigs[$_.Name] = $true
    }
}

# Extract registered commands
$registeredCommands = @{}
if ($manifest.contributes.commands) {
    $manifest.contributes.commands | ForEach-Object {
        $registeredCommands[$_.command] = $true
    }
}

Write-Host "✓ Found $($registeredConfigs.Count) registered configuration properties" -ForegroundColor Green
Write-Host "✓ Found $($registeredCommands.Count) registered commands" -ForegroundColor Green

# Validation results
$configIssues = @()
$commandIssues = @()
$warnings = @()

# 1. Validate Configuration Updates
Write-Host "`n🔎 Checking configuration.update() calls..." -ForegroundColor Yellow

$srcPath = Join-Path $extensionRoot "src"
$configUpdatePattern = 'getConfiguration\([''"]([^''"]+)[''"].*?\.update\([''"]([^''"]+)'

Get-ChildItem -Path $srcPath -Filter "*.ts" -Recurse | ForEach-Object {
    $filePath = $_.FullName
    $relativePath = $filePath.Substring($extensionRoot.Length + 1)
    $content = Get-Content $filePath -Raw
    
    # Find all config.update() calls
    $matches = [regex]::Matches($content, $configUpdatePattern)
    
    foreach ($match in $matches) {
        $context = $match.Groups[1].Value
        $key = $match.Groups[2].Value
        $fullKey = "$context.$key"
        
        # Check if registered
        if (-not $registeredConfigs.ContainsKey($fullKey)) {
            # Check if this line is within a try-catch block
            $lineNumber = ($content.Substring(0, $match.Index) -split "`n").Count
            $contextLines = Get-Content $filePath | Select-Object -Skip ([Math]::Max(0, $lineNumber - 10)) -First 20
            $contextText = $contextLines -join "`n"
            
            if ($contextText -match '\btry\s*\{[\s\S]*?\}[\s\S]*?\bcatch\b') {
                $warnings += @{
                    File     = $relativePath
                    Line     = $lineNumber
                    Key      = $fullKey
                    Severity = "Warning"
                    Message  = "Unregistered config with try-catch (OK if intentional)"
                }
                if ($Verbose) {
                    Write-Host "  ⚠️  $fullKey in $relativePath (line $lineNumber) - has try-catch" -ForegroundColor Yellow
                }
            }
            else {
                $configIssues += @{
                    File     = $relativePath
                    Line     = $lineNumber
                    Key      = $fullKey
                    Severity = "Error"
                    Message  = "Configuration key not registered and missing try-catch"
                }
            }
        }
        elseif ($Verbose) {
            Write-Host "  ✓ $fullKey - registered" -ForegroundColor Gray
        }
    }
}

# 2. Validate Command Registrations
Write-Host "`n🔎 Checking registerCommand() calls..." -ForegroundColor Yellow

$commandPattern = 'registerCommand\([''"]([^''"]+)[''"]'

Get-ChildItem -Path $srcPath -Filter "*.ts" -Recurse | ForEach-Object {
    $filePath = $_.FullName
    $relativePath = $filePath.Substring($extensionRoot.Length + 1)
    $content = Get-Content $filePath -Raw
    
    # Find all registerCommand() calls
    $matches = [regex]::Matches($content, $commandPattern)
    
    foreach ($match in $matches) {
        $command = $match.Groups[1].Value
        
        # Only check alex.* commands
        if ($command -match '^alex\.') {
            if (-not $registeredCommands.ContainsKey($command)) {
                $lineNumber = ($content.Substring(0, $match.Index) -split "`n").Count
                $commandIssues += @{
                    File     = $relativePath
                    Line     = $lineNumber
                    Command  = $command
                    Severity = "Error"
                    Message  = "Command not declared in package.json"
                }
            }
            elseif ($Verbose) {
                Write-Host "  ✓ $command - registered" -ForegroundColor Gray
            }
        }
    }
}

# 3. Report Results
Write-Host "`n" -NoNewline

if ($configIssues.Count -gt 0) {
    Write-Host "❌ Configuration Registration Issues ($($configIssues.Count)):" -ForegroundColor Red
    foreach ($issue in $configIssues) {
        Write-Host "  • $($issue.Key)" -ForegroundColor Red
        Write-Host "    File: $($issue.File):$($issue.Line)" -ForegroundColor Gray
        Write-Host "    Fix: Add property to package.json or wrap in try-catch" -ForegroundColor Gray
    }
    Write-Host ""
}

if ($commandIssues.Count -gt 0) {
    Write-Host "❌ Command Registration Issues ($($commandIssues.Count)):" -ForegroundColor Red
    foreach ($issue in $commandIssues) {
        Write-Host "  • $($issue.Command)" -ForegroundColor Red
        Write-Host "    File: $($issue.File):$($issue.Line)" -ForegroundColor Gray
        Write-Host "    Fix: Add command to package.json contributes.commands" -ForegroundColor Gray
    }
    Write-Host ""
}

if ($warnings.Count -gt 0) {
    Write-Host "⚠️  Warnings ($($warnings.Count)):" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  • $($warning.Key) - unregistered but has try-catch" -ForegroundColor Yellow
        Write-Host "    File: $($warning.File):$($warning.Line)" -ForegroundColor Gray
    }
    Write-Host ""
}

# Summary
$totalIssues = $configIssues.Count + $commandIssues.Count

if ($totalIssues -eq 0) {
    Write-Host "✅ All validations passed!" -ForegroundColor Green
    if ($warnings.Count -gt 0) {
        Write-Host "   Note: $($warnings.Count) warning(s) - review for intentional use" -ForegroundColor Yellow
    }
    exit 0
}
else {
    Write-Host "❌ Found $totalIssues issue(s) that must be fixed before release" -ForegroundColor Red
    Write-Host "`nSee .github/skills/vscode-configuration-validation/SKILL.md for guidance" -ForegroundColor Cyan
    exit 1
}
