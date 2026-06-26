@echo off
cd /d "%~dp0"
echo.
echo === Most Computers App ===
echo.
npx expo login
echo.
npx expo start --tunnel
pause
