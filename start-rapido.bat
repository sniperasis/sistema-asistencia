@echo off
echo ========================================
echo    INICIANDO SISTEMA DE ASISTENCIA
echo    METODO RAPIDO - SIN CONFIGURACION
echo ========================================
echo.

cd /d "%~dp0"
echo Directorio actual: %CD%

echo [1/3] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

echo.
echo [2/3] Construyendo panel web...
cd web
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias del panel web
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo ERROR: No se pudo construir el panel web
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Iniciando servidor...
echo.
echo ========================================
echo    SISTEMA LISTO - ACCESOS RAPIDOS:
echo ========================================
echo.
echo 📊 Panel Principal: http://localhost:3000
echo 🌐 Panel de Control: http://localhost:3000/web
echo 📱 App Móvil Web: http://localhost:19006
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

start http://localhost:3000
start http://localhost:3000/web

call npm start
