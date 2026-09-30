Write-Host "================================================================" -ForegroundColor Green
Write-Host "          KRISHINETRA - KOSMONYX (SIH 2026)" -ForegroundColor Cyan
Write-Host "    AI-Powered Hyper-Local Weather Intelligence Platform" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

Set-Location "$PSScriptRoot\frontend"

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/"
    Pause
    Exit
}

# Install dependencies if missing
if (-not (Test-Path "node_modules")) {
    Write-Host "[1/2] Installing dependencies in frontend..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "[1/2] Dependencies found." -ForegroundColor Green
}

# Launch browser and dev server
Write-Host "[2/2] Launching KrishiNetra at http://localhost:5173..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"
npm run dev
