@echo off
echo ========================================
echo    INICIO RAPIDO - SISTEMA DE ASISTENCIA
echo ========================================
echo.

cd /d "%~dp0"
echo Directorio actual: %CD%
echo.

echo [1/3] Instalando dependencias del servidor...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias del servidor
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
echo [3/3] Iniciando sistema...
echo.
echo ========================================
echo    SISTEMA LISTO
echo ========================================
echo.
echo 🚀 ACCESOS:
echo.
echo 📊 Panel Principal: http://localhost:3000
echo 🌐 Panel de Control: http://localhost:3000/web
echo.
echo 📋 INSTRUCCIONES:
echo.
echo 1. Ve a http://localhost:3000
echo 2. Sube el archivo datos-prueba.xlsx
echo 3. Ve a http://localhost:3000/web para ver reportes
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

start http://localhost:3000
start http://localhost:3000/web

call npm start
