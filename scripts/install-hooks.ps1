#!/usr/bin/env pwsh
# install-hooks.ps1 — Install git hooks for this repo
# Run once after clone: pwsh scripts/install-hooks.ps1

$repoRoot = Split-Path -Parent $PSScriptRoot
$hooksDir = Join-Path $repoRoot ".git" "hooks"
$hookPath = Join-Path $hooksDir "pre-push"

if (-not (Test-Path $hooksDir)) {
  Write-Error ".git/hooks directory not found — are you in the repo root?"
  exit 1
}

# Write a .bat wrapper (PowerShell can't execute shebang scripts directly on Windows)
@"
@echo off
pwsh -NoProfile -ExecutionPolicy Bypass -File "%~dp0pre-push.ps1" %*
if %errorlevel% neq 0 exit /b %errorlevel%
"@ | Out-File -FilePath $hookPath -Encoding ascii

# Write the actual PowerShell hook logic as .ps1
@"
# pre-push.ps1 — Auto-verify before git push
# Installed by: scripts/install-hooks.ps1
# Skip with: git push --no-verify

Write-Host "`e[96mRunning pre-push verification...`e[0m" -ForegroundColor Cyan

`$branch = git rev-parse --abbrev-ref HEAD
if (`$branch -ne 'main' -and `$branch -ne 'master') {
  Write-Host "Skipping verify (branch: `$branch)" -ForegroundColor Yellow
  exit 0
}

Write-Host "Running npm run verify..." -ForegroundColor Cyan
& npm run verify:win
if (-not `$?) {
  Write-Host ""
  Write-Host "`e[91mPRE-PUSH FAILED: CI verification did not pass.`e[0m" -ForegroundColor Red
  Write-Host "Fix the issues above, then push again." -ForegroundColor Yellow
  Write-Host "To skip: git push --no-verify" -ForegroundColor Yellow
  exit 1
}
Write-Host "`e[92mPre-push verification passed`e[0m" -ForegroundColor Green
"@ | Out-File -FilePath (Join-Path $hooksDir "pre-push.ps1") -Encoding ascii

Write-Host "✅ Pre-push hook installed" -ForegroundColor Green
Write-Host "  Hook: $hookPath (.bat wrapper -> pre-push.ps1)" -ForegroundColor Cyan
Write-Host "  Runs: npm run verify:win before every main/master push" -ForegroundColor Cyan
Write-Host "  Skip: git push --no-verify" -ForegroundColor Yellow
