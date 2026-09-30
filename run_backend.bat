@echo off
title KrishiNetra Backend - AI Weather Intelligence Server Launcher
color 0B
echo ================================================================
echo           KRISHINETRA BACKEND API - KOSMONYX (SIH 2026)
echo     AI-Powered Hyper-Local Weather Intelligence Platform (FastAPI)
echo ================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Python installation...
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ and try again.
    pause
    exit /b 1
)
python --version

echo.
echo [2/3] Checking & installing requirements...
pip install -r backend\requirements.txt

echo.
echo [3/3] Starting KrishiNetra FastAPI Backend Server...
echo Opening http://localhost:8000/docs in default browser...
start http://localhost:8000/docs

python backend\main.py
pause
