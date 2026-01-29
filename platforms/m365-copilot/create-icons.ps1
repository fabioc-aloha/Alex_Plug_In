Add-Type -AssemblyName System.Drawing

# ============================================
# ICON GENERATOR FOR M365 COPILOT AGENT
# Converts source image to required icon sizes
# ============================================

$sourcePath = "C:\Development\Alex_Plug_In\ideas\branding\nano\Hatching.png"
$outputDir = "c:\Development\Alex_Plug_In\platforms\m365-copilot\appPackage"

# Load source image
$sourceImage = [System.Drawing.Image]::FromFile($sourcePath)
Write-Host "Source image: $($sourceImage.Width)x$($sourceImage.Height)" -ForegroundColor Cyan

# ============================================
# COLOR ICON (192x192) - Full color with background
# ============================================
$colorPath = Join-Path $outputDir "color.png"
$size = 192

$bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Optional: Add gradient background (comment out for transparent)
# $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
#     [System.Drawing.Point]::new(0, 0),
#     [System.Drawing.Point]::new($size, $size),
#     [System.Drawing.Color]::FromArgb(255, 79, 70, 229),  # Indigo
#     [System.Drawing.Color]::FromArgb(255, 16, 185, 129)  # Emerald
# )
# $g.FillRectangle($brush, 0, 0, $size, $size)

# Clear with transparency
$g.Clear([System.Drawing.Color]::Transparent)

# Draw source image scaled to fit
$g.DrawImage($sourceImage, 0, 0, $size, $size)

$bmp.Save($colorPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Host "✅ Created color.png (192x192)" -ForegroundColor Green

# ============================================
# OUTLINE ICON (32x32) - White silhouette on transparent
# M365 requires: white pixels on transparent background
# ============================================
$outlinePath = Join-Path $outputDir "outline.png"
$size = 32

$bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::Transparent)

# First, draw the scaled image
$tempBmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$tempG = [System.Drawing.Graphics]::FromImage($tempBmp)
$tempG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$tempG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$tempG.Clear([System.Drawing.Color]::Transparent)
$tempG.DrawImage($sourceImage, 0, 0, $size, $size)
$tempG.Dispose()

# Convert to white silhouette (keep alpha, make RGB white)
for ($x = 0; $x -lt $size; $x++) {
    for ($y = 0; $y -lt $size; $y++) {
        $pixel = $tempBmp.GetPixel($x, $y)
        if ($pixel.A -gt 20) {  # If pixel is not nearly transparent
            # Make it white but keep the alpha for anti-aliasing
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($pixel.A, 255, 255, 255))
        }
    }
}

$tempBmp.Dispose()
$bmp.Save($outlinePath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Host "✅ Created outline.png (32x32 white on transparent)" -ForegroundColor Green

# ============================================
# Cleanup
# ============================================
$sourceImage.Dispose()

Write-Host "`n🦖 Icons ready for M365 Copilot!" -ForegroundColor Cyan
Write-Host "   color.png   - 192x192 full color" -ForegroundColor Gray
Write-Host "   outline.png - 32x32 white silhouette" -ForegroundColor Gray
