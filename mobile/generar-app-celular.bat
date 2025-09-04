@echo off
echo ================================================
echo   GENERAR APP PARA CELULAR - SISTEMA ASISTENCIA
echo ================================================
echo.
echo Opciones disponibles:
echo.
echo 1. Expo Go (Recomendado - mas rapido)
echo    - Instala "Expo Go" desde Play Store
echo    - Escanea el codigo QR que aparecera
echo.
echo 2. Compilar APK nativa
echo    - Genera archivo .apk para instalar
echo    - Proceso mas lento pero no requiere Expo Go
echo.
set /p opcion="Selecciona opcion (1 o 2): "

if "%opcion%"=="1" (
    echo.
    echo ===============================================
    echo   INICIANDO EXPO GO
    echo ===============================================
    echo.
    echo INSTRUCCIONES:
    echo 1. Instala "Expo Go" en tu celular desde Play Store
    echo 2. Asegurate de estar en la misma red WiFi
    echo 3. Escanea el codigo QR que aparecera
    echo 4. La app se abrira automaticamente
    echo.
    echo Iniciando servidor Expo...
    echo.
    
    npx expo start --tunnel
    
) else if "%opcion%"=="2" (
    echo.
    echo ===============================================
    echo   COMPILANDO APK NATIVA
    echo ===============================================
    echo.
    echo Este proceso puede tomar varios minutos...
    echo.
    
    echo Instalando dependencias EAS...
    npm install -g eas-cli
    
    echo.
    echo Iniciando compilacion...
    npx eas build --platform android --profile preview
    
    echo.
    echo ===============================================
    echo El archivo APK se generara y se podra descargar
    echo desde la URL que aparecera al final del proceso
    echo ===============================================
    
) else (
    echo.
    echo Opcion no valida. Ejecuta el script nuevamente.
)

echo.
pause
