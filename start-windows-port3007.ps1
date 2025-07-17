Write-Host "========================================"
Write-Host "SUPNOA Startup Script (Port 3007)" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""

Write-Host "[1/3] Setting environment variables..." -ForegroundColor Yellow
$env:PORT = "3007"
$env:NEXTAUTH_URL = "http://localhost:3007"

Write-Host ""
Write-Host "[2/3] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "[3/3] Starting development server on port 3007..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================"
Write-Host "Application starting on PORT 3007!" -ForegroundColor Green
Write-Host "URL: http://localhost:3007"
Write-Host ""
Write-Host "Test accounts:"
Write-Host "  Doctor: doctor@supnoa.com / doctor123"
Write-Host "  Patient: patient1@example.com / patient123"
Write-Host "========================================"
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Red
Write-Host ""

npx next dev -p 3007