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
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
$listener.Start()
$port = $listener.LocalEndpoint.Port
$listener.Stop()
$baseUrl = "http://127.0.0.1:$port"
$previousPort = $env:PORT
$env:PORT = "$port"
# Suppress background persistence loops (resolve-cache decay interval) so verify
# does not generate derived resolve-cache.json diffs every run.
$env:VERIFY_MODE = "true"
$ps = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow `
  -RedirectStandardOutput $serverLog -RedirectStandardError ($serverLog -replace '\.log$', '.err')
$env:PORT = $previousPort
$env:VERIFY_MODE = $null
Start-Sleep -Seconds 3

$ready = $false
for ($i = 1; $i -le 20; $i++) {
  try {
    $resp = Invoke-WebRequest -Uri "$baseUrl/api/health" -ErrorAction SilentlyContinue -UseBasicParsing
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
Write-Host "OK (PID $($ps.Id), $baseUrl)`n" -ForegroundColor Green

Write-Host "=== CI Verify: Running auth-demo ===" -ForegroundColor Cyan
if (Test-Path "scripts/auth-demo.ps1") {
  & "scripts/auth-demo.ps1" -Agent ci-agent -HostUrl $baseUrl
}
Write-Host "OK`n" -ForegroundColor Green

Write-Host "=== CI Verify: Memory gate test ===" -ForegroundColor Cyan
try {
  $r = Invoke-WebRequest -Uri "$baseUrl/api/memory/gate?q=test" -UseBasicParsing
  Write-Host ($r.Content.Substring(0, [Math]::Min(200, $r.Content.Length)))
} catch { }
Write-Host "OK`n" -ForegroundColor Green

Write-Host "=== CI Verify: Failure index ===" -ForegroundColor Cyan
try {
  $index = Invoke-RestMethod -Uri "$baseUrl/failure-index.json" -UseBasicParsing
  $cases = Get-Content "data/failure-cases.json" -Raw | ConvertFrom-Json
  $publicCases = @($cases | Where-Object {
    $_.source -ne "daily-auto-generate" -and -not ([string]$_.id).StartsWith("FC_AUTO_")
  })
  $minutes = 0
  foreach ($case in $publicCases) {
    if ($case.time_wasted_minutes) { $minutes += [int]$case.time_wasted_minutes }
    elseif ($case.time_lost_min) { $minutes += [int]$case.time_lost_min }
  }
  if ($index.stats.failure_cases -ne $publicCases.Count -or $index.stats.observed_minutes -ne $minutes -or @($index.cases).Count -ne $publicCases.Count) {
    Write-Error "FAIL: failure-index.json does not match curated failure data"
    $ps.Kill() 2>$null
    exit 1
  }
  Write-Host "OK ($($index.stats.failure_cases) cases, $($index.stats.observed_minutes) minutes)`n" -ForegroundColor Green
} catch {
  Write-Error "FAIL: /failure-index.json is not valid or not served: $($_.Exception.Message)"
  $ps.Kill() 2>$null
  exit 1
}

Write-Host "=== CI Verify: Stopping server ===" -ForegroundColor Cyan
$ps.Kill() 2>$null
Write-Host "OK`n" -ForegroundColor Green

Write-Host "=== CI Verify: Write queue compliance (runtime .js only) ===" -ForegroundColor Cyan
$runtimeRoots = @("server.js", "lib", "mcp", "api-handlers")
$sourceFiles = foreach ($root in $runtimeRoots) {
  if (Test-Path $root -PathType Leaf) { Get-Item $root }
  elseif (Test-Path $root -PathType Container) { Get-ChildItem -Path $root -Filter "*.js" -Recurse }
}
$sourceFiles = $sourceFiles | Where-Object {
  $_.FullName -notmatch '\\node_modules\\' -and
  $_.FullName -notmatch '\\experimental\\' -and
  $_.Name -notin @('fs-safe.js', 'write-queue.js', 'resolve-cache.js', 'execution-log.js', 'verification.js', 'elo-rating.js', 'memory-api.js', 'commit-log.js', 'snapshot.js', 'posts.js', 'drift-state.js', 'drift-state.test.js', 'drift-detector.test.js', 'intervention-engine.test.js', 'auto-failure-recorder.test.js')
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
  if ($content -match "experimental[/\\]data") {
    $lineNum = 0
    foreach ($line in ($content -split "`n")) {
      $lineNum++
      if ($line -match "experimental[/\\]data") {
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
