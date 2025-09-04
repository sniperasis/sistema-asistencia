@echo off
echo ========================================
echo    SISTEMA DE ASISTENCIA - VERSION PUBLICA
echo ========================================
echo.

echo [1/3] Iniciando servidor local...
start /B node server.js

echo [2/3] Esperando que el servidor se inicie...
timeout /t 3 /nobreak > nul

echo [3/3] Configurando acceso publico con ngrok...
echo.
echo IMPORTANTE: 
echo - El servidor local estara en: http://localhost:3000
echo - La URL publica se mostrara a continuacion
echo - Comparte la URL publica para acceso desde internet
echo - Presiona Ctrl+C para detener ngrok
echo.

REM Verificar si ngrok esta instalado
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: ngrok no esta instalado
    echo.
    echo Para instalar ngrok:
    echo 1. Ve a https://ngrok.com/download
    echo 2. Descarga e instala ngrok
    echo 3. Ejecuta este script nuevamente
    echo.
    pause
    exit /b 1
)

echo Iniciando tunel publico...
ngrok http 3000

pause
