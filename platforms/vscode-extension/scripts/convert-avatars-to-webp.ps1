# Convert Avatar PNGs to optimized WebP format
# Target: 144x144 (2x retina for 72px display)

param(
    [string]$InputDir = "..\assets\avatars",
    [int]$TargetSize = 144,
    [int]$Quality = 90
)

$ErrorActionPreference = "Stop"

Write-Host "Avatar WebP Conversion Utility" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Target size: ${TargetSize}x${TargetSize}"
Write-Host "Quality: $Quality%"
Write-Host ""

# Check if ImageMagick or cwebp is available
$hasImageMagick = Get-Command magick -ErrorAction SilentlyContinue
$hasCwebp = Get-Command cwebp -ErrorAction SilentlyContinue

if (-not $hasImageMagick -and -not $hasCwebp) {
    Write-Host "ERROR: Neither ImageMagick nor cwebp found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install one of:" -ForegroundColor Yellow
    Write-Host "  • ImageMagick: winget install ImageMagick.ImageMagick"
    Write-Host "  • cwebp: Download from https://developers.google.com/speed/webp/download"
    exit 1
}

$tool = if ($hasImageMagick) { "magick" } else { "cwebp" }
Write-Host "Using: $tool" -ForegroundColor Green
Write-Host ""

# Get all PNG files
$pngs = Get-ChildItem -Path $InputDir -Filter "*.png"

if ($pngs.Count -eq 0) {
    Write-Host "No PNG files found in $InputDir" -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($pngs.Count) PNG files to convert" -ForegroundColor Green
Write-Host ""

$converted = 0
$skipped = 0
$failed = 0

foreach ($png in $pngs) {
    $webpPath = $png.FullName -replace '\.png$', '.webp'
    $relativeName = $png.Name
    
    Write-Host "Processing: $relativeName" -NoNewline
    
    try {
        if ($tool -eq "magick") {
            # ImageMagick: resize + convert
            & magick convert $png.FullName -resize "${TargetSize}x${TargetSize}" -quality $Quality $webpPath 2>$null
        }
        else {
            # cwebp: resize via temp file (cwebp doesn't resize directly)
            & cwebp -q $Quality -resize $TargetSize $TargetSize $png.FullName -o $webpPath 2>$null
        }
        
        if ($LASTEXITCODE -eq 0) {
            $originalSize = [math]::Round($png.Length / 1KB, 1)
            $newSize = [math]::Round((Get-Item $webpPath).Length / 1KB, 1)
            $savings = [math]::Round((1 - ($newSize / $originalSize)) * 100, 0)
            
            Write-Host " ✓ ${originalSize}KB → ${newSize}KB (-${savings}%)" -ForegroundColor Green
            $converted++
        }
        else {
            Write-Host " ✗ Failed" -ForegroundColor Red
            $failed++
        }
    }
    catch {
        Write-Host " ✗ Error: $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Converted: $converted" -ForegroundColor Green
Write-Host "  Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($converted -gt 0) {
    Write-Host "✓ WebP avatars ready at ${TargetSize}x${TargetSize}" -ForegroundColor Green
}
