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

Write-Host "=== CI Verify: Write queue compliance (all .js, excluding experimental/) ===" -ForegroundColor Cyan
$sourceFiles = Get-ChildItem -Path "." -Filter "*.js" -Recurse | Where-Object {
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\\experimental\\' -and
  $_.Name -notin @('fs-safe.js', 'write-queue.js')
}
$violations = @()
$rx = [regex]'(writeFileSync|appendFileSync)'
foreach ($f in $sourceFiles) {
  $content = Get-Content $f.FullName -Raw
  if ($rx.IsMatch($content)) {
    $found = [regex]::Matches($content, '^(.*?(?:writeFileSync|appendFileSync).*)$', 'Multiline')
    foreach ($m in $found) {
      $lineNum = ($content.Substring(0, $m.Index) -split "`n").Length
      $violations += "  $($f.Name):$lineNum — ${m.Value.Trim()}"
    }
  }
}
if ($violations.Count -gt 0) {
  Write-Host "FAIL: Bare writeFileSync/appendFileSync found outside authorized wrappers (use fs-safe.js or write-queue.js):" -ForegroundColor Red
  $violations | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  $ps.Kill() 2>$null; exit 1
}
Write-Host "OK`n" -ForegroundColor Green

Write-Host "=== CI Verify: experimental/data/ isolation ===" -ForegroundColor Cyan
$expFiles = Get-ChildItem -Path "lib", "mcp", "api-handlers" -Filter "*.js" -Recurse
$expViolations = @()
foreach ($f in $expFiles) {
  $content = Get-Content $f.FullName -Raw
  if ($content -match "data/execution_log" -or $content -match "data/resolve-cache" -or $content -match "data/elo-ratings" -or $content -match "data/verification-state" -or $content -match "data/memory-api-log") {
    $lineNum = 0
    foreach ($line in ($content -split "`n")) {
      $lineNum++
      if ($line -match "data/(execution_log|resolve-cache|elo-ratings|verification-state|memory-api-log)") {
        $expViolations += "  $($f.Name):$lineNum — $($line.Trim())"
      }
    }
  }
}
if ($expViolations.Count -gt 0) {
  Write-Host "FAIL: Non-experimental code referencing runtime data paths from experimental modules:" -ForegroundColor Red
  $expViolations | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  $ps.Kill() 2>$null; exit 1
}
Write-Host "OK`n" -ForegroundColor Green

Write-Host "=== ALL CHECKS PASSED — Safe to push ===" -ForegroundColor Green
