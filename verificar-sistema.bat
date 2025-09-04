@echo off
echo ========================================
echo    VERIFICACION DEL SISTEMA
echo ========================================
echo.

cd /d "%~dp0"
echo Directorio actual: %CD%
echo.

echo Verificando archivos necesarios...
echo.

if exist "package.json" (
    echo ✅ package.json encontrado
) else (
    echo ❌ package.json NO encontrado
    echo ERROR: Ejecuta este script desde la carpeta del proyecto
    pause
    exit /b 1
)

if exist "server.js" (
    echo ✅ server.js encontrado
) else (
    echo ❌ server.js NO encontrado
    pause
    exit /b 1
)

if exist "web\package.json" (
    echo ✅ web/package.json encontrado
) else (
    echo ❌ web/package.json NO encontrado
    pause
    exit /b 1
)

if exist "mobile\package.json" (
    echo ✅ mobile/package.json encontrado
) else (
    echo ❌ mobile/package.json NO encontrado
    pause
    exit /b 1
)

if exist "datos-prueba.xlsx" (
    echo ✅ datos-prueba.xlsx encontrado
) else (
    echo ❌ datos-prueba.xlsx NO encontrado
    pause
    exit /b 1
)

echo.
echo ========================================
echo    SISTEMA VERIFICADO CORRECTAMENTE
echo ========================================
echo.
echo Ahora puedes ejecutar:
echo - demo-completo.bat (recomendado)
echo - start-rapido.bat
echo - start-app-movil.bat
echo.
pause
