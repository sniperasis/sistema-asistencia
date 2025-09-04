@echo off
echo ================================================
echo   DEPLOY A GITHUB PAGES - FRONTEND
echo ================================================
echo.

echo ===============================================
echo  PREPARANDO PROYECTO
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
echo 2. Creando branch gh-pages...
git checkout -b gh-pages

echo.
echo 3. Moviendo archivos compilados...
xcopy /E /I /Y web\dist\* .

echo.
echo 4. Creando index.html principal...
echo ^<!DOCTYPE html^> > index.html
echo ^<html^> >> index.html
echo ^<head^> >> index.html
echo     ^<title^>Sistema de Asistencia^</title^> >> index.html
echo     ^<meta charset="utf-8"^> >> index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1"^> >> index.html
echo ^</head^> >> index.html
echo ^<body^> >> index.html
echo     ^<h1^>Sistema de Asistencia^</h1^> >> index.html
echo     ^<p^>^<a href="app-movil-funcional.html"^>📱 App Móvil^</a^>^</p^> >> index.html
echo     ^<p^>^<a href="panel.html"^>📊 Panel Administrativo^</a^>^</p^> >> index.html
echo     ^<p^>^<a href="index.html"^>🏠 Sistema Principal^</a^>^</p^> >> index.html
echo ^</body^> >> index.html
echo ^</html^> >> index.html

echo.
echo 5. Agregando archivos al git...
git add .
git commit -m "Deploy frontend a GitHub Pages"

echo.
echo 6. Subiendo a GitHub...
git push origin gh-pages

echo.
echo ===============================================
echo  DEPLOYMENT COMPLETADO
echo ===============================================
echo.
echo Tu frontend estara disponible en:
echo - https://[tu-usuario].github.io/[nombre-repo]
echo - App movil: https://[tu-usuario].github.io/[nombre-repo]/app-movil-funcional.html
echo - Panel admin: https://[tu-usuario].github.io/[nombre-repo]/panel.html
echo.
echo NOTA: 
echo - Solo el frontend estara disponible
echo - Para el backend necesitas usar Heroku o similar
echo.

git checkout main

pause
