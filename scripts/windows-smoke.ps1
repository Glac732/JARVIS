$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$release = Join-Path $repoRoot 'release'
$installer = Join-Path $release 'BREACH-Setup-x64.exe'
$portable = Join-Path $release 'BREACH-Portable-x64.exe'
$log = Join-Path $release 'windows-smoke-report.txt'
New-Item -ItemType Directory -Force -Path $release | Out-Null
$results = [System.Collections.Generic.List[string]]::new()
function Record([string]$name,[string]$status,[string]$detail){$line="[$status] $name — $detail";$results.Add($line);Write-Host $line}
function Stop-BreachProcesses {Get-Process -Name 'BREACH','BREACH-Portable-x64' -ErrorAction SilentlyContinue|Stop-Process -Force -ErrorAction SilentlyContinue}
try {
 foreach($file in @($installer,$portable)){
  if(!(Test-Path $file)){throw "Missing release executable $file"}
  $item=Get-Item $file
  if($item.Length -lt 10MB){throw "Unexpectedly small artifact: $($item.Name)"}
  $hash=(Get-FileHash $file -Algorithm SHA256).Hash
  Record "Artifact hash $($item.Name)" 'PASS' "Bytes=$($item.Length); SHA256=$hash"
 }
 Stop-BreachProcesses
 $p=Start-Process -FilePath $portable -PassThru
 Start-Sleep 10
 $running=Get-Process -Name 'BREACH','BREACH-Portable-x64' -ErrorAction SilentlyContinue|Select-Object -First 1
 if(!$running -and $p.HasExited){throw "Portable executable exited with code $($p.ExitCode)"}
 Record 'Portable launch' 'PASS' 'Process remained active after 10 seconds.'
 Stop-BreachProcesses
 $i=Start-Process -FilePath $installer -ArgumentList '/S' -PassThru -Wait
 if($i.ExitCode -ne 0){throw "Installer returned $($i.ExitCode)"}
 $exe=Join-Path $env:LOCALAPPDATA 'Programs\BREACH\BREACH.exe'
 if(!(Test-Path $exe)){throw "Installed BREACH.exe missing at $exe"}
 Record 'Silent install' 'PASS' $exe
 $a=Start-Process -FilePath $exe -PassThru
 Start-Sleep 10
 if($a.HasExited){throw "Installed app exited with code $($a.ExitCode)"}
 Record 'Installed startup' 'PASS' 'Process remained active after 10 seconds.'
 Stop-BreachProcesses
 $un=Get-ChildItem (Split-Path $exe) -Filter '*uninstall*.exe'|Select-Object -First 1
 if(!$un){throw 'Uninstaller not found.'}
 $u=Start-Process -FilePath $un.FullName -ArgumentList '/S' -PassThru -Wait
 if($u.ExitCode -ne 0){throw "Uninstaller returned $($u.ExitCode)"}
 if(Test-Path $exe){throw 'BREACH.exe remains after uninstall.'}
 Record 'Silent uninstall' 'PASS' 'Installed executable removed.'
}catch{Record 'Windows smoke suite' 'FAIL' $_.Exception.Message;$results|Set-Content $log -Encoding UTF8;throw}
$results|Set-Content $log -Encoding UTF8
