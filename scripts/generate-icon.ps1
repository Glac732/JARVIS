$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force -Path 'build' | Out-Null
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 256,256
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(7,12,20))
$rect = New-Object System.Drawing.Rectangle 20,20,216,216
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect,[System.Drawing.Color]::FromArgb(24,95,145),[System.Drawing.Color]::FromArgb(7,20,36),45)
$g.FillEllipse($brush,$rect)
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100,190,235),3)
$g.DrawEllipse($pen,32,32,192,192)
# BREACH identity: a bold, centered B with a clean diagonal breach cut.
$font = [System.Drawing.Font]::new('Segoe UI',[single]132,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString('B',$font,[System.Drawing.Brushes]::White,(New-Object System.Drawing.RectangleF 0,-2,256,256),$sf)
$slash = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(7,12,20),9)
$g.DrawLine($slash,145,70,112,184)
$accent = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100,210,245),4)
$g.DrawLine($accent,151,70,118,184)
$bmp.Save((Join-Path (Get-Location) 'build/icon.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$hicon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hicon)
$stream = [System.IO.File]::Open((Join-Path (Get-Location) 'build/icon.ico'),[System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Dispose()
$icon.Dispose()
$g.Dispose();$brush.Dispose();$pen.Dispose();$font.Dispose();$slash.Dispose();$accent.Dispose();$bmp.Dispose()
Write-Host 'Generated BREACH application icon.'
