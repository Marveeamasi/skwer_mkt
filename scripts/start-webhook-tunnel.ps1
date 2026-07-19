param([int]$Port = 3000)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$config = Join-Path $root '.ngrok.yml'
if (-not (Test-Path -LiteralPath $config)) { throw 'Missing .ngrok.yml. Configure ngrok before starting the tunnel.' }
$existing = Get-Process ngrok -ErrorAction SilentlyContinue
if ($existing) { throw 'An ngrok process is already running. Stop it before starting another tunnel.' }
$app = Start-Process -FilePath 'npm.cmd' -ArgumentList @('run','dev','--','--hostname','127.0.0.1','--port',"$Port") -WorkingDirectory $root -WindowStyle Hidden -PassThru
try {
  $ready = $false
  for ($i = 0; $i -lt 30; $i++) {
    try { Invoke-WebRequest -Uri "http://127.0.0.1:$Port" -UseBasicParsing -TimeoutSec 2 | Out-Null; $ready = $true; break } catch { Start-Sleep -Milliseconds 500 }
  }
  if (-not $ready) { throw "The local app did not start on port $Port." }
  $tunnel = Start-Process -FilePath 'ngrok' -ArgumentList @('http',"$Port",'--config',$config,'--log',(Join-Path $root '.ngrok.log'),'--log-format','json') -WorkingDirectory $root -WindowStyle Hidden -PassThru
  $publicUrl = $null
  for ($i = 0; $i -lt 30; $i++) {
    try {
      $api = Invoke-RestMethod -Uri 'http://127.0.0.1:4040/api/tunnels' -TimeoutSec 2
      $publicUrl = ($api.tunnels | Where-Object { $_.proto -eq 'https' } | Select-Object -First 1).public_url
      if ($publicUrl) { break }
    } catch { Start-Sleep -Milliseconds 500 }
  }
  if (-not $publicUrl) { throw 'ngrok did not create an HTTPS tunnel. Check .ngrok.log and your authtoken.' }
  Write-Output "App PID: $($app.Id)"
  Write-Output "ngrok PID: $($tunnel.Id)"
  Write-Output "Public app: $publicUrl"
  Write-Output "Paystack webhook: $publicUrl/api/webhooks/paystack"
  Write-Output 'Keep both processes running while testing. The free ngrok URL may change after restart.'
} catch {
  if ($app -and -not $app.HasExited) { Stop-Process -Id $app.Id -Force }
  throw
}
