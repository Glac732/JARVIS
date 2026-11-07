$ErrorActionPreference = 'Stop'
$repoRoot = (Get-Location).Path
$assetPath = Join-Path $repoRoot 'assets/breach-icon.jpg'
if (!(Test-Path $assetPath)) { throw "Official BREACH artwork is missing: $assetPath" }
New-Item -ItemType Directory -Force -Path 'build' | Out-Null
Add-Type -AssemblyName System.Drawing
$source = [System.Drawing.Image]::FromFile($assetPath)
$bmp = New-Object System.Drawing.Bitmap 256,256
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($source,0,0,256,256)
$bmp.Save((Join-Path $repoRoot 'build/icon.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$hicon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hicon)
$stream = [System.IO.File]::Open((Join-Path $repoRoot 'build/icon.ico'),[System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Dispose()
$icon.Dispose()
$g.Dispose()
$bmp.Dispose()
$source.Dispose()
Write-Host 'Generated Windows BREACH icon from supplied original artwork.'
