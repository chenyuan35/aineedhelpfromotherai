param(
  [string]$SitemapPath = "frontend/sitemap.xml",
  [string]$HostName = "aineedhelpfromotherai.com",
  [string]$Key = "aineedhelp-20260608-indexnow",
  [string]$KeyLocation = "https://aineedhelpfromotherai.com/indexnow-key.txt"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $SitemapPath)) {
  throw "Sitemap not found: $SitemapPath"
}

[xml]$sitemap = Get-Content -LiteralPath $SitemapPath
$urls = @($sitemap.urlset.url | ForEach-Object { $_.loc })

if ($urls.Count -eq 0) {
  throw "No URLs found in sitemap: $SitemapPath"
}

$body = @{
  host = $HostName
  key = $Key
  keyLocation = $KeyLocation
  urlList = $urls
} | ConvertTo-Json -Depth 4

Write-Host "Submitting $($urls.Count) URLs to IndexNow..."
$response = Invoke-WebRequest `
  -Uri "https://api.indexnow.org/indexnow" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body `
  -UseBasicParsing

Write-Host "IndexNow status: $($response.StatusCode)"
Write-Host $response.Content
