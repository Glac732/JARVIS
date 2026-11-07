$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force -Path 'build' | Out-Null
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 256,256
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(8,11,10))
$rect = New-Object System.Drawing.Rectangle 16,16,224,224
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect,[System.Drawing.Color]::FromArgb(57,65,53),[System.Drawing.Color]::FromArgb(10,15,13),45)
$g.FillRectangle($brush,$rect)
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(196,69,48),12)
$g.DrawLine($pen,176,38,76,218)
$edge = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(177,174,153),3)
$g.DrawRectangle($edge,18,18,220,220)
$font = [System.Drawing.Font]::new('Arial',[single]154,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString('B',$font,[System.Drawing.Brushes]::White,(New-Object System.Drawing.RectangleF -12,-8,220,250),$sf)
$bmp.Save((Join-Path (Get-Location) 'build/icon.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$hicon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hicon)
$stream = [System.IO.File]::Open((Join-Path (Get-Location) 'build/icon.ico'),[System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Dispose()
$icon.Dispose();$g.Dispose();$brush.Dispose();$pen.Dispose();$edge.Dispose();$font.Dispose();$bmp.Dispose()
Write-Host 'Generated BREACH application icon.'
