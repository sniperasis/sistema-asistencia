@echo off
echo ========================================
echo    INICIANDO APP MOVIL - METODO RAPIDO
echo ========================================
echo.

cd /d "%~dp0"
echo Directorio actual: %CD%

echo [1/2] Instalando dependencias de la app móvil...
cd mobile
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

echo.
echo [2/2] Iniciando app móvil en navegador...
echo.
echo ========================================
echo    APP MOVIL LISTA:
echo ========================================
echo.
echo 📱 App Móvil Web: http://localhost:19006
echo 📊 Panel Principal: http://localhost:3000
echo 🌐 Panel de Control: http://localhost:3000/web
echo.
echo IMPORTANTE: El servidor principal debe estar corriendo
echo Presiona Ctrl+C para detener la app móvil
echo.

start http://localhost:19006

call expo start --web
