@echo off
echo ================================================
echo   DEPLOY A NETLIFY - SISTEMA ASISTENCIA
echo ================================================
echo.

echo Verificando instalacion de Netlify CLI...
where netlify >nul 2>nul
if %errorlevel% neq 0 (
    echo Instalando Netlify CLI...
    npm install -g netlify-cli
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
echo 2. Iniciando deployment a Netlify...
echo.

netlify deploy --prod --dir=web/dist

echo.
echo ===============================================
echo  DEPLOYMENT COMPLETADO
echo ===============================================
echo.
echo Tu sistema estara disponible en:
echo - URL principal: https://tu-proyecto.netlify.app
echo - App movil: https://tu-proyecto.netlify.app/app
echo - Panel web: https://tu-proyecto.netlify.app/panel
echo.
echo NOTA: 
echo - Netlify es ideal para el frontend
echo - Necesitaras un backend separado para las APIs
echo.

pause
