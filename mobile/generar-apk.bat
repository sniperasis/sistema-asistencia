@echo off
echo ========================================
echo   GENERANDO APK PARA CELULAR
echo ========================================
echo.

echo [1/4] Instalando dependencias...
call npm install

echo.
echo [2/4] Configurando proyecto...
call npx expo install --fix

echo.
echo [3/4] Generando APK...
echo NOTA: Esto puede tomar varios minutos...
call npx expo build:android --type apk

echo.
echo [4/4] Descargando APK...
echo El APK se descargará automáticamente cuando esté listo.
echo.

echo ========================================
echo   APK GENERADO EXITOSAMENTE
echo ========================================
echo.
echo El archivo APK estará disponible en:
echo - Tu cuenta de Expo (expo.dev)
echo - O en la carpeta de descargas
echo.
echo Para instalar en tu celular:
echo 1. Transfiere el APK a tu celular
echo 2. Habilita "Fuentes desconocidas" en Android
echo 3. Instala el APK
echo.
pause
