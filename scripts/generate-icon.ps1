$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force -Path 'build' | Out-Null
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 256,256
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(7,12,20))
$rect = New-Object System.Drawing.Rectangle 24,24,208,208
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect,[System.Drawing.Color]::FromArgb(24,95,145),[System.Drawing.Color]::FromArgb(7,20,36),45)
$g.FillEllipse($brush,$rect)
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100,190,235),3)
$g.DrawEllipse($pen,36,36,184,184)
$font = New-Object System.Drawing.Font('Segoe UI',112,[System.Drawing.FontStyle]::Light,[System.Drawing.GraphicsUnit]::Pixel)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString('J',$font,[System.Drawing.Brushes]::White,(New-Object System.Drawing.RectangleF 0,0,256,256),$sf)
$bmp.Save((Join-Path (Get-Location) 'build/icon.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$hicon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hicon)
$stream = [System.IO.File]::Open((Join-Path (Get-Location) 'build/icon.ico'),[System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Dispose()
$icon.Dispose()
[void][System.Runtime.InteropServices.Marshal]::ZeroFreeCoTaskMemUnicode([IntPtr]::Zero)
$g.Dispose();$brush.Dispose();$pen.Dispose();$font.Dispose();$bmp.Dispose()
Write-Host 'Generated original JARVIS application icon.'
