$ErrorActionPreference = 'Stop'
$repoRoot = (Get-Location).Path
New-Item -ItemType Directory -Force -Path 'build' | Out-Null
Add-Type -AssemblyName System.Drawing
# Build a deterministic, valid tactical BREACH mark. The checked-in JPG preview is malformed,
# so the release pipeline must not fail or ship a corrupt icon while that source is replaced.
$bmp = New-Object System.Drawing.Bitmap 512,512
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(13,18,17))
$bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28,38,34))
$g.FillRectangle($bg,0,0,512,512)
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(166,151,112),8)
$points = [System.Drawing.Point[]]@(
  (New-Object System.Drawing.Point(256,44)),
  (New-Object System.Drawing.Point(430,118)),
  (New-Object System.Drawing.Point(408,330)),
  (New-Object System.Drawing.Point(256,458)),
  (New-Object System.Drawing.Point(104,330)),
  (New-Object System.Drawing.Point(82,118))
)
$g.DrawPolygon($pen,$points)
$font = New-Object System.Drawing.Font('Arial',190,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(232,231,215))
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString('B',$font,$brush,(New-Object System.Drawing.RectangleF(70,80,372,340)),$format)
$bmp.Save((Join-Path $repoRoot 'build/icon.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$hicon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hicon)
$stream = [System.IO.File]::Open((Join-Path $repoRoot 'build/icon.ico'),[System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Dispose()
$icon.Dispose()
$format.Dispose();$brush.Dispose();$font.Dispose();$pen.Dispose();$bg.Dispose();$g.Dispose();$bmp.Dispose()
Write-Host 'Generated valid BREACH application icon.'
