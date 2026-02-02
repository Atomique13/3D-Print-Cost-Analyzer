# Quick Docker rebuild and test script
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

Write-Host "`nBuilding Docker image..." -ForegroundColor Yellow
docker build -t 3d-print-cost-analyzer:local .

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nStarting container in background..." -ForegroundColor Green
    docker-compose up -d
    Start-Sleep -Seconds 2
    Write-Host "`nContainer started! Open http://localhost:8080 to test." -ForegroundColor Green
    Write-Host "To view logs: docker-compose logs -f" -ForegroundColor Cyan
    Write-Host "To stop: docker-compose down" -ForegroundColor Cyan
} else {
    Write-Host "`nBuild failed!" -ForegroundColor Red
}
