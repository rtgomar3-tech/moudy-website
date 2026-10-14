@echo off
title Moudy Alarbe - Local Server
cd /d "%~dp0"

echo.
echo ========================================
echo    Moudy Alarbe - Local Server
echo ========================================
echo.
echo Starting server...
echo URL: http://localhost:8000/MOUDY.html
echo.
echo DO NOT CLOSE THIS WINDOW
echo Press Ctrl+C to stop the server
echo.

where python >nul 2>nul
if %errorlevel%==0 (
    start "" "http://localhost:8000/MOUDY.html"
    python -m http.server 8000
) else (
    where py >nul 2>nul
    if %errorlevel%==0 (
        start "" "http://localhost:8000/MOUDY.html"
        py -m http.server 8000
    ) else (
        echo.
        echo ERROR: Python not found!
        echo Please install Python first.
        pause
    )
)

pause