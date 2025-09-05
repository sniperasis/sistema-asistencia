# CÓMO CREAR APK PARA CELULAR

## MÉTODO 1: EXPO GO (MÁS RÁPIDO)
1. Instala **Expo Go** en tu celular desde Google Play
2. Ejecuta: `npx expo start`
3. Escanea el QR con Expo Go
4. ¡Listo! La app se abre directamente

## MÉTODO 2: APK BUILDER ONLINE
1. Ve a [expo.dev](https://expo.dev)
2. Crea una cuenta gratuita
3. Conecta tu repositorio de GitHub
4. Genera APK automáticamente
5. Descarga el APK

## MÉTODO 3: APK LOCAL SIMPLE
1. Ejecuta: `npx expo start`
2. Presiona 'a' para Android
3. Se abrirá en emulador o dispositivo conectado

## MÉTODO 4: APK CON EAS BUILD
1. Instala: `npm install -g @expo/eas-cli`
2. Ejecuta: `eas login`
3. Ejecuta: `eas build --platform android --profile preview`
4. Descarga el APK desde expo.dev

## RECOMENDACIÓN
**Usa el MÉTODO 1 (Expo Go)** porque es:
- ✅ Más rápido
- ✅ No necesita compilación
- ✅ Funciona inmediatamente
- ✅ Fácil de usar

## INSTALAR APK EN ANDROID
1. Habilita "Fuentes desconocidas" en Android
2. Transfiere el APK a tu celular
3. Instala el APK
4. ¡Listo!
