Add-Type -AssemblyName System.Drawing

# ============================================
# COLOR ICON (192x192) - Polished T-Rex
# ============================================
$colorPath = "c:\Development\alex-m365-agent\appPackage\color.png"
$size = 192

$bmp = New-Object System.Drawing.Bitmap($size, $size)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Gradient background (Alex purple to teal)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.Point]::new(0, 0),
    [System.Drawing.Point]::new($size, $size),
    [System.Drawing.Color]::FromArgb(255, 102, 51, 153),  # Purple
    [System.Drawing.Color]::FromArgb(255, 0, 150, 136)    # Teal
)
$g.FillRectangle($brush, 0, 0, $size, $size)

# White dino silhouette
$white = [System.Drawing.Brushes]::White

# Head (circle)
$g.FillEllipse($white, 85, 30, 60, 50)
# Snout
$snout = @([System.Drawing.Point]::new(85, 45), [System.Drawing.Point]::new(50, 55), 
           [System.Drawing.Point]::new(50, 75), [System.Drawing.Point]::new(95, 75))
$g.FillPolygon($white, $snout)
# Body
$g.FillEllipse($white, 70, 65, 80, 70)
# Tail
$tail = @([System.Drawing.Point]::new(140, 85), [System.Drawing.Point]::new(175, 60),
          [System.Drawing.Point]::new(180, 75), [System.Drawing.Point]::new(150, 105))
$g.FillPolygon($white, $tail)
# Legs
$g.FillRectangle($white, 85, 125, 18, 35)
$g.FillRectangle($white, 120, 125, 18, 35)
# Feet
$g.FillEllipse($white, 80, 152, 28, 15)
$g.FillEllipse($white, 115, 152, 28, 15)
# Tiny arm
$g.FillEllipse($white, 72, 82, 18, 10)
# Eye (purple)
$eyeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 102, 51, 153))
$g.FillEllipse($eyeBrush, 108, 42, 14, 14)
# Teeth
for ($i = 0; $i -lt 4; $i++) {
    $tx = 55 + ($i * 10)
    $tooth = @([System.Drawing.Point]::new($tx, 75), [System.Drawing.Point]::new($tx+5, 85),
               [System.Drawing.Point]::new($tx+10, 75))
    $g.FillPolygon($white, $tooth)
}

$bmp.Save($colorPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Host "Created color.png (192x192)" -ForegroundColor Green

# ============================================
# OUTLINE ICON (32x32) - White on Transparent
# ============================================
$outlinePath = "c:\Development\alex-m365-agent\appPackage\outline.png"
$size = 32

$bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

$white = [System.Drawing.Brushes]::White

# Scaled down T-Rex (same proportions)
# Head
$g.FillEllipse($white, 14, 4, 10, 9)
# Snout  
$snout = @([System.Drawing.Point]::new(14, 7), [System.Drawing.Point]::new(8, 9),
           [System.Drawing.Point]::new(8, 13), [System.Drawing.Point]::new(16, 13))
$g.FillPolygon($white, $snout)
# Body
$g.FillEllipse($white, 11, 11, 14, 12)
# Tail
$tail = @([System.Drawing.Point]::new(23, 14), [System.Drawing.Point]::new(29, 10),
          [System.Drawing.Point]::new(30, 13), [System.Drawing.Point]::new(25, 18))
$g.FillPolygon($white, $tail)
# Legs
$g.FillRectangle($white, 14, 21, 3, 6)
$g.FillRectangle($white, 20, 21, 3, 6)
# Feet
$g.FillEllipse($white, 13, 25, 5, 3)
$g.FillEllipse($white, 19, 25, 5, 3)
# Arm
$g.FillEllipse($white, 12, 14, 3, 2)

$bmp.Save($outlinePath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Host "Created outline.png (32x32 transparent)" -ForegroundColor Green

Write-Host "`nIcons ready!" -ForegroundColor Cyan
