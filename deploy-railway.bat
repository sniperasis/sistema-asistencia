@echo off
echo ================================================
echo   DEPLOY A RAILWAY - SISTEMA ASISTENCIA
echo ================================================
echo.

echo Verificando instalacion de Railway CLI...
where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo Instalando Railway CLI...
    npm install -g @railway/cli
    echo.
)

echo ===============================================
echo  CONFIGURANDO PROYECTO
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
echo 2. Iniciando deployment a Railway...
echo.

railway login
railway init
railway up

echo.
echo ===============================================
echo  DEPLOYMENT COMPLETADO
echo ===============================================
echo.
echo Tu sistema estara disponible en:
echo - URL principal: https://tu-proyecto.railway.app
echo - App movil: https://tu-proyecto.railway.app/app
echo - Panel web: https://tu-proyecto.railway.app/panel
echo - Panel admin: https://tu-proyecto.railway.app/admin
echo.
echo VENTAJAS DE RAILWAY:
echo - Base de datos persistente
echo - Backend completo funcionando
echo - SSL automatico
echo.

pause
