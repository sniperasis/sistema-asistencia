@echo off
echo ========================================
echo   GENERANDO APK LOCAL
echo ========================================
echo.

echo [1/3] Instalando dependencias...
call npm install

echo.
echo [2/3] Iniciando servidor de desarrollo...
echo NOTA: Mantén esta ventana abierta
echo.
echo [3/3] Generando APK...
echo.
echo INSTRUCCIONES:
echo 1. Abre otra ventana de terminal
echo 2. Ejecuta: npx expo start
echo 3. Presiona 'a' para abrir en Android
echo 4. O escanea el QR con Expo Go
echo.
echo ========================================
echo   ALTERNATIVA: USAR EXPO GO
echo ========================================
echo.
echo 1. Instala "Expo Go" en tu celular
echo 2. Ejecuta: npx expo start
echo 3. Escanea el QR con Expo Go
echo 4. La app se abrirá directamente
echo.
pause
