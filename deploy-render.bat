@echo off
echo ================================================
echo   DEPLOY A RENDER - SISTEMA ASISTENCIA
echo ================================================
echo.

echo ===============================================
echo  INSTRUCCIONES PARA RENDER
echo ===============================================
echo.
echo 1. Ve a https://render.com
echo 2. Crea una cuenta gratuita
echo 3. Conecta tu repositorio GitHub
echo 4. Configura el servicio:
echo.
echo    - Build Command: npm install && npm run build:web
echo    - Start Command: node server.js
echo    - Environment: Node
echo    - Plan: Free
echo.
echo 5. Variables de entorno (opcional):
echo    - NODE_ENV=production
echo    - PORT=10000
echo.
echo ===============================================
echo  PREPARANDO PROYECTO PARA RENDER
echo ===============================================
echo.

echo 1. Compilando frontend...
call npm run build:web
if %errorlevel% neq 0 (
    echo Error al compilar el frontend
    pause
    exit /b 1
)

echo.
echo 2. Creando archivo .gitignore si no existe...
if not exist .gitignore (
    echo node_modules/ > .gitignore
    echo .env >> .gitignore
    echo .vercel >> .gitignore
    echo uploads/ >> .gitignore
    echo asistencia.db >> .gitignore
)

echo.
echo ===============================================
echo  PROYECTO LISTO PARA RENDER
echo ===============================================
echo.
echo Siguiente paso:
echo 1. Sube este proyecto a GitHub
echo 2. Ve a https://render.com
echo 3. Conecta el repositorio
echo 4. Deploy automatico
echo.
echo Tu sistema estara disponible en:
echo - https://tu-proyecto.onrender.com
echo - App movil: https://tu-proyecto.onrender.com/app
echo - Panel web: https://tu-proyecto.onrender.com/panel
echo.

pause
