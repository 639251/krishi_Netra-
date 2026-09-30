@echo off
title KrishiNetra Frontend Launcher
color 0A
echo ================================================================
echo           KRISHINETRA - FRONTEND (SIH 2026)
echo     AI-Powered Hyper-Local Weather Intelligence Platform
echo ================================================================
echo.

cd /d "%~dp0\frontend"

echo [1/3] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo Installing node_modules in frontend...
    call npm install
)

echo.
echo [3/3] Starting KrishiNetra Frontend Development Server...
timeout /t 2 >nul
start http://localhost:5173

call npm run dev
pause
