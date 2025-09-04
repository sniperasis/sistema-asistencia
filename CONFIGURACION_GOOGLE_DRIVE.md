# 🔧 Configuración de Google Drive

Esta guía te ayudará a configurar Google Drive para subir y procesar archivos Excel de forma gratuita.

## 📋 Pasos para Configurar Google Drive API

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Seleccionar proyecto" → "Nuevo proyecto"
4. Nombra tu proyecto: `Sistema Asistencia`
5. Haz clic en "Crear"

### 2. Habilitar Google Drive API

1. En el menú lateral, ve a "APIs y servicios" → "Biblioteca"
2. Busca "Google Drive API"
3. Haz clic en "Google Drive API"
4. Haz clic en "Habilitar"

### 3. Crear Credenciales OAuth 2.0

1. Ve a "APIs y servicios" → "Credenciales"
2. Haz clic en "Crear credenciales" → "ID de cliente OAuth 2.0"
3. Selecciona "Aplicación web"
4. Configura:
   - **Nombre**: Sistema de Asistencia
   - **Orígenes JavaScript autorizados**: 
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
   - **URI de redirección autorizados**:
     - `http://localhost:3000/auth/google/callback`
     - `http://127.0.0.1:3000/auth/google/callback`

5. Haz clic en "Crear"
6. **IMPORTANTE**: Copia el **ID de cliente** y **Secreto de cliente**

### 4. Configurar Variables de Entorno

1. Copia el archivo `env.example` a `.env`:
```bash
cp env.example .env
```

2. Edita el archivo `.env` y agrega tus credenciales:
```env
# Configuración de Google Drive
GOOGLE_DRIVE_CLIENT_ID=tu_id_de_cliente_aqui
GOOGLE_DRIVE_CLIENT_SECRET=tu_secreto_de_cliente_aqui
GOOGLE_DRIVE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### 5. Reiniciar el Servidor

```bash
npm start
```

## 🚀 Cómo Usar Google Drive

### Opción 1: Subir Archivo Local a Drive
1. Ve a `http://localhost:3000`
2. Haz clic en la pestaña "☁️ Google Drive"
3. Haz clic en "🔗 Conectar Google Drive"
4. Autoriza la aplicación
5. Sube tu archivo Excel local
6. El archivo se subirá automáticamente a Drive y se procesará

### Opción 2: Usar Archivo Existente en Drive
1. Sube tu archivo Excel manualmente a Google Drive
2. Ve a la pestaña "☁️ Google Drive" en la aplicación
3. Haz clic en "🔗 Conectar Google Drive"
4. Verás la lista de archivos Excel en tu Drive
5. Haz clic en "📊 Procesar" en el archivo que quieras usar

## 🔒 Seguridad

- Los archivos se almacenan en la carpeta privada de la aplicación (`appDataFolder`)
- Solo tu aplicación puede acceder a estos archivos
- Los tokens de acceso se almacenan localmente
- No se comparten datos con terceros

## 🆓 Límites Gratuitos

Google Drive API tiene límites generosos para uso gratuito:
- **100,000 requests por día**
- **1,000 requests por 100 segundos por usuario**
- **Almacenamiento**: 15 GB gratuitos

Para un sistema de asistencia, estos límites son más que suficientes.

## 🔧 Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verifica que la URI de redirección en Google Cloud Console coincida exactamente con la del archivo `.env`
- Asegúrate de incluir `http://localhost:3000/auth/google/callback`

### Error: "invalid_client"
- Verifica que el ID de cliente y secreto estén correctos en el archivo `.env`
- Asegúrate de que no haya espacios extra

### Error: "access_denied"
- El usuario canceló la autorización
- Intenta nuevamente el proceso de autenticación

### No aparecen archivos en la lista
- Verifica que los archivos sean de tipo Excel (.xlsx, .xls)
- Asegúrate de que estén en la carpeta de la aplicación
- Haz clic en "🔄 Actualizar Lista"

## 📱 Alternativas Gratuitas

Si prefieres no usar Google Drive, también puedes usar:

### Dropbox
- API gratuita con 500 MB de almacenamiento
- Configuración similar a Google Drive

### OneDrive
- 5 GB gratuitos
- Integración con Microsoft 365

### Almacenamiento Local
- El sistema también funciona subiendo archivos directamente
- No requiere configuración adicional

## 🎯 Recomendación

**Google Drive es la mejor opción** porque:
- ✅ Es completamente gratuito
- ✅ Fácil de configurar
- ✅ Integración nativa con Google Workspace
- ✅ Acceso desde cualquier dispositivo
- ✅ Respaldo automático de archivos

---

**¿Necesitas ayuda?** Revisa los logs del servidor para más detalles sobre errores específicos.
