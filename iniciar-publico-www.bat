@echo off
echo ================================================
echo    SISTEMA DE ASISTENCIA - MODO PUBLICO WWW
echo ================================================
echo.
echo Configurando servidor para acceso publico...
echo.

REM Configurar el puerto para acceso publico
set PORT=80

echo ===============================================
echo  INICIANDO SERVIDOR EN MODO PUBLICO
echo ===============================================
echo.
echo ^> Puerto: %PORT%
echo ^> Acceso local: http://localhost:%PORT%
echo ^> Acceso publico: http://[TU-IP-PUBLICA]:%PORT%
echo.
echo URLS DISPONIBLES:
echo ----------------
echo App Movil:     http://localhost:%PORT%/app
echo Panel Web:     http://localhost:%PORT%/panel  
echo Panel Admin:   http://localhost:%PORT%/admin
echo Sistema:       http://localhost:%PORT%/
echo.
echo Presiona Ctrl+C para detener el servidor
echo ===============================================
echo.

REM Iniciar el servidor
node server.js

pause
