@echo off
echo ================================================
echo   EXPONER SISTEMA A INTERNET CON NGROK
echo ================================================
echo.

echo Verificando instalacion de ngrok...
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo Instalando ngrok...
    echo.
    echo 1. Ve a https://ngrok.com/download
    echo 2. Descarga ngrok para Windows
    echo 3. Extrae ngrok.exe en esta carpeta
    echo 4. Ejecuta este script nuevamente
    echo.
    pause
    exit /b 1
)

echo ===============================================
echo  INICIANDO SERVIDOR LOCAL
echo ===============================================
echo.

echo 1. Compilando frontend web...
call npm run build:web
if %errorlevel% neq 0 (
    echo Error al compilar el frontend
    pause
    exit /b 1
)

echo.
echo 2. Iniciando servidor en segundo plano...
start /B node server.js

echo.
echo 3. Esperando 3 segundos para que el servidor inicie...
timeout /t 3 /nobreak >nul

echo.
echo 4. Exponiendo a internet con ngrok...
echo.
echo ===============================================
echo  TU SISTEMA ESTA DISPONIBLE EN:
echo ===============================================
echo.
echo Abriendo ngrok...
ngrok http 3000

echo.
echo ===============================================
echo  INSTRUCCIONES:
echo ===============================================
echo.
echo 1. Copia la URL que aparece arriba (ej: https://abc123.ngrok.io)
echo 2. Comparte esa URL con quien necesite acceso
echo 3. URLs disponibles:
echo    - App movil: [URL]/app
echo    - Panel web: [URL]/panel
echo    - Panel admin: [URL]/admin
echo.
echo 4. Para detener: Presiona Ctrl+C
echo.

pause
