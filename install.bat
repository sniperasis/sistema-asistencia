@echo off
echo ========================================
echo    SISTEMA DE ASISTENCIA - INSTALADOR
echo ========================================
echo.

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
cd ..

echo.
echo [3/4] Instalando dependencias de la app movil...
cd mobile
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias de la app movil
    pause
    exit /b 1
)
cd ..

echo.
echo [4/4] Construyendo panel web...
cd web
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: No se pudo construir el panel web
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo    INSTALACION COMPLETADA EXITOSAMENTE
echo ========================================
echo.
echo Para iniciar el sistema:
echo   1. Ejecuta: npm start
echo   2. Abre: http://localhost:3000
echo   3. Para la app movil: cd mobile && expo start
echo.
echo CONFIGURACION OPCIONAL - CORREO ELECTRONICO:
echo   1. Lee: CONFIGURACION_CORREO.md
echo   2. Configura tu cuenta de Gmail
echo   3. Edita el archivo .env con tus credenciales
echo.
echo IMPORTANTE: Configura tu IP local en mobile/App.js
echo.
pause
