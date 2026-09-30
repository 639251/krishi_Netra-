@echo off
title KrishiNetra Full Stack Launcher (Backend + Frontend)
color 0A
echo ================================================================
echo           KRISHINETRA - FULL STACK LAUNCHER (SIH 2026)
echo     Frontend (React 19) + Backend (FastAPI + AI Downscaler)
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting KrishiNetra FastAPI Backend Server on port 8000...
start "KrishiNetra Backend API (Port 8000)" cmd /k "cd /d ""%~dp0"" && python backend\main.py"

echo [2/3] Starting KrishiNetra Frontend Dashboard on port 5173...
start "KrishiNetra Frontend Dashboard (Port 5173)" cmd /k "cd /d ""%~dp0\frontend"" && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo Opening browser windows...
start http://localhost:5173
start http://localhost:8000/docs

echo.
echo ================================================================
echo  SUCCESS! Both servers are now running:
echo  - Frontend Web App:  http://localhost:5173
echo  - Backend API Docs:  http://localhost:8000/docs
echo ================================================================
echo.
echo If your browser showed 404 earlier, please REFRESH (Ctrl + F5) now!
echo You can keep these terminal windows open while testing.
pause
