@echo off
echo ========================================
echo   GENERANDO APK CON EAS BUILD
echo ========================================
echo.

echo [1/4] Instalando EAS CLI...
call npm install -g @expo/eas-cli

echo.
echo [2/4] Iniciando sesión en Expo...
echo NOTA: Necesitarás crear una cuenta en expo.dev
call eas login

echo.
echo [3/4] Configurando proyecto...
call eas build:configure

echo.
echo [4/4] Generando APK...
call eas build --platform android --profile preview

echo.
echo ========================================
echo   APK GENERADO EXITOSAMENTE
echo ========================================
echo.
echo El APK estará disponible en:
echo - Tu cuenta de Expo (expo.dev)
echo - En la sección "Builds" de tu proyecto
echo.
echo Para instalar en tu celular:
echo 1. Descarga el APK desde expo.dev
echo 2. Transfiere a tu celular
echo 3. Habilita "Fuentes desconocidas" en Android
echo 4. Instala el APK
echo.
pause
