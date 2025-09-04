@echo off
echo ================================================
echo   DEPLOY SÚPER SIMPLE A NETLIFY DROP
echo ================================================
echo.

echo ===============================================
echo  PREPARANDO ARCHIVOS
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
echo 2. Creando carpeta para Netlify...
if exist netlify-deploy rmdir /s /q netlify-deploy
mkdir netlify-deploy

echo.
echo 3. Copiando archivos del frontend...
xcopy /E /I /Y web\dist\* netlify-deploy\

echo.
echo 4. Copiando archivos públicos...
xcopy /E /I /Y public\* netlify-deploy\

echo.
echo 5. Creando index.html principal...
echo ^<!DOCTYPE html^> > netlify-deploy\index.html
echo ^<html^> >> netlify-deploy\index.html
echo ^<head^> >> netlify-deploy\index.html
echo     ^<title^>Sistema de Asistencia^</title^> >> netlify-deploy\index.html
echo     ^<meta charset="utf-8"^> >> netlify-deploy\index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1"^> >> netlify-deploy\index.html
echo     ^<style^> >> netlify-deploy\index.html
echo         body { font-family: Arial, sans-serif; margin: 40px; text-align: center; } >> netlify-deploy\index.html
echo         .button { display: inline-block; padding: 15px 30px; margin: 10px; background: #007cba; color: white; text-decoration: none; border-radius: 5px; } >> netlify-deploy\index.html
echo         .button:hover { background: #005a87; } >> netlify-deploy\index.html
echo     ^</style^> >> netlify-deploy\index.html
echo ^</head^> >> netlify-deploy\index.html
echo ^<body^> >> netlify-deploy\index.html
echo     ^<h1^>🏢 Sistema de Asistencia^</h1^> >> netlify-deploy\index.html
echo     ^<p^>Sistema completo para toma de asistencia con lectura QR^</p^> >> netlify-deploy\index.html
echo     ^<br^>^<br^> >> netlify-deploy\index.html
echo     ^<a href="app-movil-funcional.html" class="button"^>📱 App Móvil^</a^> >> netlify-deploy\index.html
echo     ^<br^>^<br^> >> netlify-deploy\index.html
echo     ^<a href="panel.html" class="button"^>📊 Panel Administrativo^</a^> >> netlify-deploy\index.html
echo     ^<br^>^<br^> >> netlify-deploy\index.html
echo     ^<p^>^<small^>Nota: Para funcionalidad completa, necesitas el backend ejecutándose^</small^>^</p^> >> netlify-deploy\index.html
echo ^</body^> >> netlify-deploy\index.html
echo ^</html^> >> netlify-deploy\index.html

echo.
echo ===============================================
echo  ARCHIVOS LISTOS PARA NETLIFY DROP
echo ===============================================
echo.
echo Siguiente paso:
echo.
echo 1. Ve a https://app.netlify.com/drop
echo 2. Arrastra la carpeta 'netlify-deploy' a la zona de drop
echo 3. ¡Listo! Tu sitio estará disponible en internet
echo.
echo Tu sistema estara disponible en:
echo - URL principal: https://[nombre-aleatorio].netlify.app
echo - App movil: https://[nombre-aleatorio].netlify.app/app-movil-funcional.html
echo - Panel admin: https://[nombre-aleatorio].netlify.app/panel.html
echo.
echo Abriendo carpeta...
explorer netlify-deploy

pause
