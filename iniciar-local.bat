@echo off
echo ========================================
echo    SISTEMA DE ASISTENCIA - VERSION LOCAL
echo ========================================
echo.

echo Iniciando servidor local...
echo.
echo ACCESOS DISPONIBLES:
echo - Panel Principal: http://localhost:3000
echo - App Movil: http://localhost:3000/app-movil-funcional
echo - Panel Web: http://localhost:3000/web
echo.
echo Para acceso desde otros dispositivos en la misma red:
echo - Reemplaza 'localhost' con la IP de esta computadora
echo - Ejemplo: http://192.168.1.100:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

node server.js

pause
