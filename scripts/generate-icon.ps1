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
# Classic 32-bit DIB-backed ICO frame. NSIS accepts this format consistently.
$size = 32
$iconBitmap = [System.Drawing.Bitmap]::new($size,$size,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$ig = [System.Drawing.Graphics]::FromImage($iconBitmap)
$ig.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$ig.Clear([System.Drawing.Color]::FromArgb(13,18,17))
$ip = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(166,151,112),1.2)
$ig.DrawPolygon($ip,[System.Drawing.Point[]]@((New-Object System.Drawing.Point(16,2)),(New-Object System.Drawing.Point(29,8)),(New-Object System.Drawing.Point(27,23)),(New-Object System.Drawing.Point(16,30)),(New-Object System.Drawing.Point(5,23)),(New-Object System.Drawing.Point(3,8))))
$ifont = New-Object System.Drawing.Font('Arial',21,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
$ibrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(232,231,215))
$ifmt = New-Object System.Drawing.StringFormat
$ifmt.Alignment=[System.Drawing.StringAlignment]::Center;$ifmt.LineAlignment=[System.Drawing.StringAlignment]::Center
$ig.DrawString('B',$ifont,$ibrush,(New-Object System.Drawing.RectangleF(3,3,26,26)),$ifmt)
$rect = New-Object System.Drawing.Rectangle(0,0,$size,$size)
$data = $iconBitmap.LockBits($rect,[System.Drawing.Imaging.ImageLockMode]::ReadOnly,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$xor = New-Object byte[] ($size*$size*4)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0,$xor,0,$xor.Length)
$iconBitmap.UnlockBits($data)
# DIB pixels must be bottom-up.
for($y=0;$y -lt [int]($size/2);$y++){for($x=0;$x -lt $size*4;$x++){ $a=$y*$size*4+$x;$b=($size-1-$y)*$size*4+$x;$tmp=$xor[$a];$xor[$a]=$xor[$b];$xor[$b]=$tmp }}
$mask = New-Object byte[] ($size*4*$size)
$dib = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($dib)
$bw.Write([UInt32]40);$bw.Write([Int32]$size);$bw.Write([Int32]($size*2));$bw.Write([UInt16]1);$bw.Write([UInt16]32)
$bw.Write([UInt32]0);$bw.Write([UInt32]($xor.Length+$mask.Length));$bw.Write([Int32]0);$bw.Write([Int32]0);$bw.Write([UInt32]0);$bw.Write([UInt32]0)
$bw.Write($xor);$bw.Write($mask);$bw.Flush();$dibBytes=$dib.ToArray()
$ico = [System.IO.File]::Open((Join-Path $repoRoot 'build/icon.ico'),[System.IO.FileMode]::Create)
$iw = New-Object System.IO.BinaryWriter($ico)
$iw.Write([UInt16]0);$iw.Write([UInt16]1);$iw.Write([UInt16]1)
$iw.Write([Byte]$size);$iw.Write([Byte]$size);$iw.Write([Byte]0);$iw.Write([Byte]0);$iw.Write([UInt16]1);$iw.Write([UInt16]32)
$iw.Write([UInt32]$dibBytes.Length);$iw.Write([UInt32]22);$iw.Write($dibBytes);$iw.Flush();$iw.Dispose();$ico.Dispose()
$dib.Dispose();$ig.Dispose();$ip.Dispose();$ifmt.Dispose();$ibrush.Dispose();$ifont.Dispose();$iconBitmap.Dispose()
$format.Dispose();$brush.Dispose();$font.Dispose();$pen.Dispose();$bg.Dispose();$g.Dispose();$bmp.Dispose()
Write-Host 'Generated valid BREACH application icon.'
