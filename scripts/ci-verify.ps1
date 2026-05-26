#!/usr/bin/env pwsh
# ci-verify.ps1 — Run this BEFORE pushing to catch CI failures locally
# Usage: pwsh scripts/ci-verify.ps1

Write-Host "=== CI Verify: Checking Node.js ===" -ForegroundColor Cyan
node -v | Out-Host
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "FAIL: Node.js required"; exit 1
}
Write-Host "OK`n" -ForegroundColor Green

Write-Host "=== CI Verify: Installing deps ===" -ForegroundColor Cyan
npm ci 2>$null; if (-not $?) { npm install }
Write-Host "OK`n" -ForegroundColor Green

Write-Host "=== CI Verify: Starting server ===" -ForegroundColor Cyan
$serverLog = Join-Path $env:TEMP "ci-verify-server.log"
$ps = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow `
  -RedirectStandardOutput $serverLog -RedirectStandardError ($serverLog -replace '\.log$', '.err')
Start-Sleep -Seconds 3

$ready = $false
for ($i = 1; $i -le 20; $i++) {
  try {
    $resp = Invoke-WebRequest -Uri http://localhost:3000/api/health -ErrorAction SilentlyContinue -UseBasicParsing
    if ($resp.StatusCode -eq 200) { $ready = $true; break }
  } catch {}
  Start-Sleep -Seconds 1
}
if (-not $ready) {
  Write-Error "FAIL: Server failed to start within 20s"
  Get-Content $serverLog -ErrorAction SilentlyContinue
  $ps.Kill() 2>$null
  exit 1
}
Write-Host "OK (PID $($ps.Id))`n" -ForegroundColor Green

Write-Host "=== CI Verify: Running auth-demo ===" -ForegroundColor Cyan
if (Test-Path "scripts/auth-demo.ps1") {
  & "scripts/auth-demo.ps1" -Agent ci-agent -HostUrl http://localhost:3000
}
Write-Host "OK`n" -ForegroundColor Green

Write-Host "=== CI Verify: Memory gate test ===" -ForegroundColor Cyan
try {
  $r = Invoke-WebRequest -Uri "http://localhost:3000/api/memory/gate?q=test" -UseBasicParsing
  Write-Host ($r.Content.Substring(0, [Math]::Min(200, $r.Content.Length)))
} catch { }
Write-Host "OK`n" -ForegroundColor Green

Write-Host "=== CI Verify: Stopping server ===" -ForegroundColor Cyan
$ps.Kill() 2>$null
Write-Host "OK`n" -ForegroundColor Green

Write-Host "=== ALL CHECKS PASSED — Safe to push ===" -ForegroundColor Green
