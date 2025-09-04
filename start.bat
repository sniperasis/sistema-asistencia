@echo off
echo ========================================
echo    INICIANDO SISTEMA DE ASISTENCIA
echo ========================================
echo.

echo Iniciando servidor...
echo Panel web: http://localhost:3000
echo Panel de control: http://localhost:3000/web
echo.

start http://localhost:3000

call npm start
