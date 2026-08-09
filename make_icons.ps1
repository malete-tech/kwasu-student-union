Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path (Get-Location) "public\logo.png"
$srcImg = [System.Drawing.Image]::FromFile($srcPath)
$w = $srcImg.Width
$h = $srcImg.Height
$maxDim = [Math]::Max($w, $h)

Write-Host "Original logo dimensions: $w x $h"

function MakeSquareIcon($outRelativePath, $targetSize) {
    $outPath = Join-Path (Get-Location) $outRelativePath
    $bmp = New-Object System.Drawing.Bitmap $targetSize, $targetSize
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # White background
    $g.Clear([System.Drawing.Color]::White)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Fit image inside square while maintaining aspect ratio
    $scale = [Math]::Min($targetSize / $w, $targetSize / $h)
    $newW = [int]($w * $scale)
    $newH = [int]($h * $scale)
    $posX = [int](($targetSize - $newW) / 2)
    $posY = [int](($targetSize - $newH) / 2)

    $g.DrawImage($srcImg, $posX, $posY, $newW, $newH)
    $g.Dispose()

    # Save PNG
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Successfully created square PWA icon: $outRelativePath ($targetSize x $targetSize)"
}

MakeSquareIcon "public\icon-192.png" 192
MakeSquareIcon "public\icon-512.png" 512
MakeSquareIcon "public\icon-maskable.png" 512
MakeSquareIcon "public\apple-touch-icon.png" 180

$srcImg.Dispose()
