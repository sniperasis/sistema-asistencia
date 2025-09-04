@echo off
echo ========================================
echo    INICIANDO SISTEMA DE ASISTENCIA
echo    VERSION SIMPLIFICADA - SIN CORREO
echo ========================================
echo.

cd /d "%~dp0"
echo Directorio actual: %CD%
echo.

echo [1/2] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo.
echo [2/2] Construyendo panel web...
cd web
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias del panel web
        pause
        exit /b 1
    )
)

call npm run build
if %errorlevel% neq 0 (
    echo ERROR: No se pudo construir el panel web
    pause
    exit /b 1
)
cd ..

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

echo Iniciando servidor...
node servidor-simple.js
