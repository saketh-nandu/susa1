# Create Placeholder Assets for SUSA Installer
# This script creates basic placeholder images for testing

Write-Host "Creating placeholder assets for SUSA installer..." -ForegroundColor Cyan

# Create assets directory
$assetsDir = "assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir | Out-Null
}

# Function to create a simple BMP file
function Create-SimpleBMP {
    param(
        [string]$Path,
        [int]$Width,
        [int]$Height,
        [byte]$R = 0,
        [byte]$G = 120,
        [byte]$B = 215
    )
    
    $rowSize = [Math]::Floor(($Width * 3 + 3) / 4) * 4
    $pixelArraySize = $rowSize * $Height
    $fileSize = 54 + $pixelArraySize
    
    $bmp = New-Object byte[] $fileSize
    
    # BMP Header
    $bmp[0] = 0x42  # 'B'
    $bmp[1] = 0x4D  # 'M'
    [BitConverter]::GetBytes([int32]$fileSize).CopyTo($bmp, 2)
    [BitConverter]::GetBytes([int32]54).CopyTo($bmp, 10)
    
    # DIB Header
    [BitConverter]::GetBytes([int32]40).CopyTo($bmp, 14)
    [BitConverter]::GetBytes([int32]$Width).CopyTo($bmp, 18)
    [BitConverter]::GetBytes([int32]$Height).CopyTo($bmp, 22)
    [BitConverter]::GetBytes([int16]1).CopyTo($bmp, 26)
    [BitConverter]::GetBytes([int16]24).CopyTo($bmp, 28)
    
    # Pixel data (BGR format)
    for ($y = 0; $y -lt $Height; $y++) {
        for ($x = 0; $x -lt $Width; $x++) {
            $offset = 54 + $y * $rowSize + $x * 3
            $bmp[$offset] = $B
            $bmp[$offset + 1] = $G
            $bmp[$offset + 2] = $R
        }
    }
    
    [System.IO.File]::WriteAllBytes($Path, $bmp)
}

# Create header BMP (150x57)
Write-Host "Creating header image (150x57)..." -ForegroundColor Yellow
Create-SimpleBMP -Path "$assetsDir\susa_header.bmp" -Width 150 -Height 57 -R 70 -G 130 -B 180

# Create sidebar BMP (164x314)
Write-Host "Creating sidebar image (164x314)..." -ForegroundColor Yellow
Create-SimpleBMP -Path "$assetsDir\susa_sidebar.bmp" -Width 164 -Height 314 -R 50 -G 100 -B 150

# Create a simple ICO file (32x32 for simplicity)
Write-Host "Creating icon (32x32)..." -ForegroundColor Yellow
$iconSize = 32
$iconData = New-Object byte[] (6 + 16 + 40 + ($iconSize * $iconSize * 4))

# ICO Header
$iconData[0] = 0
$iconData[1] = 0
$iconData[2] = 1
$iconData[3] = 0
$iconData[4] = 1
$iconData[5] = 0

# ICO Directory Entry
$iconData[6] = $iconSize
$iconData[7] = $iconSize
$iconData[8] = 0
$iconData[9] = 0
$iconData[10] = 1
$iconData[11] = 0
$iconData[12] = 32
$iconData[13] = 0
[BitConverter]::GetBytes([int32](40 + $iconSize * $iconSize * 4)).CopyTo($iconData, 14)
[BitConverter]::GetBytes([int32]22).CopyTo($iconData, 18)

# BMP Info Header
[BitConverter]::GetBytes([int32]40).CopyTo($iconData, 22)
[BitConverter]::GetBytes([int32]$iconSize).CopyTo($iconData, 26)
[BitConverter]::GetBytes([int32]($iconSize * 2)).CopyTo($iconData, 30)
[BitConverter]::GetBytes([int16]1).CopyTo($iconData, 34)
[BitConverter]::GetBytes([int16]32).CopyTo($iconData, 36)

# Fill with blue color (BGRA format)
for ($i = 0; $i -lt ($iconSize * $iconSize); $i++) {
    $offset = 62 + $i * 4
    $iconData[$offset] = 215      # B
    $iconData[$offset + 1] = 120  # G
    $iconData[$offset + 2] = 0    # R
    $iconData[$offset + 3] = 255  # A
}

[System.IO.File]::WriteAllBytes("$assetsDir\susa_icon.ico", $iconData)

Write-Host ""
Write-Host "Placeholder assets created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Created files:" -ForegroundColor Cyan
Write-Host "  - $assetsDir\susa_icon.ico (32x32)" -ForegroundColor White
Write-Host "  - $assetsDir\susa_header.bmp (150x57)" -ForegroundColor White
Write-Host "  - $assetsDir\susa_sidebar.bmp (164x314)" -ForegroundColor White
Write-Host ""
Write-Host "Note: These are basic placeholders. Replace with professional assets before release." -ForegroundColor Yellow
