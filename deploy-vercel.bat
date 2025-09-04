@echo off
echo ================================================
echo   DEPLOY A VERCEL - SISTEMA ASISTENCIA
echo ================================================
echo.

echo Verificando instalacion de Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Instalando Vercel CLI...
    npm install -g vercel
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
echo 2. Iniciando deployment a Vercel...
echo.

vercel --prod

echo.
echo ===============================================
echo  DEPLOYMENT COMPLETADO
echo ===============================================
echo.
echo Tu sistema estara disponible en:
echo - URL principal: https://tu-proyecto.vercel.app
echo - App movil: https://tu-proyecto.vercel.app/app
echo - Panel web: https://tu-proyecto.vercel.app/panel
echo - Panel admin: https://tu-proyecto.vercel.app/admin
echo.
echo IMPORTANTE: 
echo - La base de datos SQLite se reiniciara en cada deployment
echo - Para persistencia, considera usar una DB externa
echo.

pause
