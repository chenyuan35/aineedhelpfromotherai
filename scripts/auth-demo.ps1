param(
  [string]$Agent = 'demo-agent',
  [string]$HostUrl = 'http://localhost:3000'
)

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node.js not found in PATH. Install Node.js to run this demo.'; exit 1
}

 $out = node scripts/generate-agent-signature-json.js $Agent | Out-String
 # Extract the last line that looks like JSON object (handles injected logs)
 $jsonLine = ($out -split "`n" | Where-Object { $_ -match '^{' } | Select-Object -Last 1)
 if (-not $jsonLine) { Write-Error "Failed to find JSON in output: $out"; exit 1 }
 try {
  $data = $jsonLine | ConvertFrom-Json
 } catch {
  Write-Error "Failed to parse signature JSON: $jsonLine"; exit 1
 }

$signature = $data.signature
$timestamp = $data.timestamp

Write-Host "Generated signature:" -ForegroundColor Cyan; Write-Host $signature -ForegroundColor Yellow
Write-Host "Timestamp:" -ForegroundColor Cyan; Write-Host $timestamp -ForegroundColor Yellow

# Print a ready-to-run curl command
 $curlExample = "curl -i -X GET '{0}/mcp' -H 'X-Agent-Signature: {1}' -H 'X-Agent-Id: {2}' -H 'X-Agent-Timestamp: {3}'" -f $HostUrl, $signature, $Agent, $timestamp
Write-Host "`nExample curl:`n" -ForegroundColor Green; Write-Host $curlExample -ForegroundColor White

# Use curl.exe if available for full headers; otherwise use Invoke-RestMethod
$curlCmd = Get-Command curl -ErrorAction SilentlyContinue
if ($curlCmd -and (Split-Path $curlCmd.Source -Leaf) -eq 'curl.exe') {
  & curl.exe -i -X GET "$HostUrl/mcp" -H "X-Agent-Signature: $signature" -H "X-Agent-Id: $Agent" -H "X-Agent-Timestamp: $timestamp"
} else {
  try {
    $resp = Invoke-RestMethod -Uri "$HostUrl/mcp" -Headers @{ 'X-Agent-Signature'=$signature; 'X-Agent-Id'=$Agent; 'X-Agent-Timestamp'=$timestamp } -Method Get -ErrorAction Stop
    $resp | ConvertTo-Json -Depth 5
  } catch {
    Write-Error $_.Exception.Message
  }
}
