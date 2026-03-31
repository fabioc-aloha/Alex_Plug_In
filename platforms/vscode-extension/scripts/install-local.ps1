<#
.SYNOPSIS
    Install the VS Code extension locally from a .vsix package.
.DESCRIPTION
    Packages the extension (if needed) and installs it to VS Code.
    Handles output properly and verifies installation success.
.PARAMETER Package
    Build a fresh .vsix before installing (default: use existing if recent)
.PARAMETER Force
    Force reinstall even if same version is installed
.EXAMPLE
    .\install-local.ps1              # Install existing vsix
    .\install-local.ps1 -Package     # Build and install
    .\install-local.ps1 -Force       # Force reinstall
#>
param(
    [switch]$Package,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$extensionDir = Split-Path -Parent $scriptDir

Push-Location $extensionDir
try {
    Write-Host "`n----------------------------------------" -ForegroundColor Cyan
    Write-Host "  Alex Local Installation" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Cyan

    # Get version from package.json
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $version = $pkg.version
    $extensionId = "$($pkg.publisher).$($pkg.name)"
    $vsixName = "$($pkg.name)-$version.vsix"
    $vsixPath = Join-Path $extensionDir $vsixName

    Write-Host "`n[PKG] Extension: $extensionId" -ForegroundColor Gray
    Write-Host "   Version:   $version" -ForegroundColor Gray

    # Check for existing vsix
    $existingVsix = Get-ChildItem -Filter "*.vsix" -ErrorAction SilentlyContinue | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -First 1

    $needsPackage = $Package
    if (-not $existingVsix) {
        Write-Host "`n[WARN]  No .vsix found - packaging required" -ForegroundColor Yellow
        $needsPackage = $true
    }
    elseif ($existingVsix.Name -ne $vsixName) {
        Write-Host "`n[WARN]  Found $($existingVsix.Name) but package.json is $version" -ForegroundColor Yellow
        $needsPackage = $true
    }
    else {
        $ageMinutes = ((Get-Date) - $existingVsix.LastWriteTime).TotalMinutes
        Write-Host "   Found:     $($existingVsix.Name) ($([math]::Round($ageMinutes)) min ago)" -ForegroundColor Gray
    }

    # Package if needed
    if ($needsPackage) {
        Write-Host "`n Building package..." -ForegroundColor Yellow
        
        # Clean old vsix files
        Get-ChildItem -Filter "*.vsix" | ForEach-Object {
            Remove-Item $_.FullName -Force
            Write-Host "   Removed old: $($_.Name)" -ForegroundColor DarkGray
        }

        # Run vsce package
        $packageOutput = & npx vsce package 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERROR] Package failed!" -ForegroundColor Red
            Write-Host $packageOutput -ForegroundColor Red
            exit 1
        }

        # Find the new vsix
        $vsixPath = Get-ChildItem -Filter "*.vsix" | Select-Object -First 1
        if (-not $vsixPath) {
            Write-Host "[ERROR] No .vsix file created!" -ForegroundColor Red
            exit 1
        }
        $vsixPath = $vsixPath.FullName
        Write-Host "   [OK] Created: $(Split-Path $vsixPath -Leaf)" -ForegroundColor Green
    }
    else {
        $vsixPath = $existingVsix.FullName
    }

    # Check currently installed version
    Write-Host "`n Checking installed extensions..." -ForegroundColor Yellow
    $installedExtensions = & code --list-extensions --show-versions 2>&1
    $installedVersion = $null
    
    foreach ($ext in $installedExtensions) {
        if ($ext -match "^$extensionId@(.+)$") {
            $installedVersion = $Matches[1]
            break
        }
    }

    if ($installedVersion) {
        Write-Host "   Currently installed: v$installedVersion" -ForegroundColor Gray
        if ($installedVersion -eq $version -and -not $Force) {
            Write-Host "   [OK] Same version already installed" -ForegroundColor Green
            Write-Host "`n Use -Force to reinstall" -ForegroundColor DarkGray
            exit 0
        }
    }
    else {
        Write-Host "   Not currently installed" -ForegroundColor Gray
    }

    # Install the extension
    Write-Host "`n[INSTALL] Installing extension..." -ForegroundColor Yellow
    Write-Host "   File: $(Split-Path $vsixPath -Leaf)" -ForegroundColor Gray
    
    $installArgs = @("--install-extension", $vsixPath)
    if ($Force) {
        $installArgs += "--force"
    }

    # Use Start-Process to capture output properly
    $pinfo = New-Object System.Diagnostics.ProcessStartInfo
    $pinfo.FileName = "code"
    $pinfo.Arguments = $installArgs -join " "
    $pinfo.RedirectStandardOutput = $true
    $pinfo.RedirectStandardError = $true
    $pinfo.UseShellExecute = $false
    $pinfo.CreateNoWindow = $true

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $pinfo
    $process.Start() | Out-Null
    
    $stdout = $process.StandardOutput.ReadToEnd()
    $stderr = $process.StandardError.ReadToEnd()
    $process.WaitForExit()

    if ($stdout) { Write-Host "   $stdout" -ForegroundColor DarkGray }
    if ($stderr -and $process.ExitCode -ne 0) { 
        Write-Host "   $stderr" -ForegroundColor Red 
    }

    if ($process.ExitCode -ne 0) {
        Write-Host "[ERROR] Installation failed (exit code: $($process.ExitCode))" -ForegroundColor Red
        exit 1
    }

    # Verify installation
    Write-Host "`n[OK] Verifying installation..." -ForegroundColor Yellow
    Start-Sleep -Milliseconds 500  # Give VS Code a moment
    
    # Primary: Check extensions directory (reliable)
    $extensionsDir = Join-Path $env:USERPROFILE ".vscode\extensions"
    $installedDir = Join-Path $extensionsDir "$extensionId-$version"
    
    if (Test-Path $installedDir) {
        Write-Host "   [OK] $extensionId@$version installed successfully" -ForegroundColor Green
        Write-Host "`n Installation complete!" -ForegroundColor Cyan
        Write-Host "   Reload VS Code window to activate: Ctrl+Shift+P -> 'Reload Window'" -ForegroundColor Gray
    }
    else {
        # Fallback: Try CLI (may not work if VS Code is running)
        $verifyExtensions = & code --list-extensions --show-versions 2>&1
        $verified = $false
        
        foreach ($ext in $verifyExtensions) {
            if ($ext -match "^$extensionId@$version$") {
                $verified = $true
                break
            }
        }
        
        if ($verified) {
            Write-Host "   [OK] $extensionId@$version installed successfully" -ForegroundColor Green
            Write-Host "`n Installation complete!" -ForegroundColor Cyan
            Write-Host "   Reload VS Code window to activate: Ctrl+Shift+P -> 'Reload Window'" -ForegroundColor Gray
        }
        else {
            Write-Host "   [WARN] Could not verify installation" -ForegroundColor Yellow
            Write-Host "   Extension folder: $installedDir" -ForegroundColor Gray
            Write-Host "   Try: Ctrl+Shift+P -> 'Reload Window'" -ForegroundColor Gray
        }
    }
}
finally {
    Pop-Location
}
