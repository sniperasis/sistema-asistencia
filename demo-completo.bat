@echo off
echo ========================================
echo    DEMO COMPLETO - SISTEMA DE ASISTENCIA
echo ========================================
echo.

cd /d "%~dp0"
echo Directorio actual: %CD%

echo [1/4] Instalando dependencias del servidor...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias del servidor
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando dependencias del panel web...
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
echo [3/4] Instalando dependencias de la app móvil...
cd mobile
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias de la app móvil
    pause
    exit /b 1
)
cd ..

echo.
echo [4/4] Iniciando sistema completo...
echo.
echo ========================================
echo    SISTEMA COMPLETO LISTO
echo ========================================
echo.
echo 🚀 ACCESOS AUTOMATICOS:
echo.
echo 📊 Panel Principal: http://localhost:3000
echo 🌐 Panel de Control: http://localhost:3000/web
echo 📱 App Móvil Web: http://localhost:19006
echo.
echo 📋 INSTRUCCIONES DE PRUEBA:
echo.
echo 1. Panel Principal: Sube archivo Excel
echo 2. Panel de Control: Ve reportes en tiempo real
echo 3. App Móvil: Simula toma de asistencia
echo.
echo Presiona Ctrl+C para detener todo
echo.

start http://localhost:3000
start http://localhost:3000/web
timeout /t 3 /nobreak >nul
start http://localhost:19006

echo Iniciando servidor principal...
start /b npm start

echo Esperando 5 segundos para que el servidor inicie...
timeout /t 5 /nobreak >nul

echo Iniciando app móvil...
cd mobile
start /b expo start --web

echo.
echo ✅ SISTEMA COMPLETO FUNCIONANDO
echo.
echo Para detener todo, cierra esta ventana
pause
