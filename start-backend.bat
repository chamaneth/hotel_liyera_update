@echo off
title Hotel Liyera - Flask Backend API
cd /d "%~dp0"
echo ========================================================
echo Starting Hotel Liyera Flask API Backend (Port 5000)
echo ========================================================
if exist "backend\venv\Scripts\python.exe" (
    "backend\venv\Scripts\python.exe" backend\app.py
) else (
    python backend\app.py
)
pause
