# 📱🌐 Guía: App para Celular y Acceso Web Público

## 🚀 **OPCIONES PARA EL CELULAR**

### ✅ **Opción 1: App Web Móvil (RECOMENDADA - MÁS RÁPIDA)**

**Estado**: ✅ **YA DISPONIBLE - FUNCIONA INMEDIATAMENTE**

1. **Iniciar el servidor**:
   ```bash
   # Ejecutar uno de estos scripts:
   .\iniciar-publico-www.bat     # Para acceso público puerto 80
   .\iniciar-publico.bat         # Para acceso local puerto 3000
   ```

2. **Usar en el celular**:
   - Abre el navegador del celular
   - Ve a: `http://[IP-DE-TU-PC]:3000/app`
   - O si usas puerto 80: `http://[IP-DE-TU-PC]/app`

3. **URLs disponibles**:
   - **App móvil**: `/app` o `/app-movil-funcional`
   - **Panel web**: `/panel` o `/web`  
   - **Panel admin**: `/admin`
   - **Sistema principal**: `/`

---

### ⚡ **Opción 2: App Nativa con Expo Go**

**Estado**: ✅ **LISTA PARA GENERAR**

1. **En el celular**:
   - Instala "**Expo Go**" desde Play Store/App Store

2. **En la PC**:
   ```bash
   cd mobile
   .\generar-app-celular.bat
   # Selecciona opción 1
   ```

3. **Conectar**:
   - Escanea el código QR que aparece
   - La app se abre automáticamente

---

### 🔨 **Opción 3: APK Nativa Compilada**

**Estado**: ✅ **DISPONIBLE (proceso más lento)**

1. **Ejecutar script**:
   ```bash
   cd mobile
   .\generar-app-celular.bat
   # Selecciona opción 2
   ```

2. **Proceso**:
   - Se compila un archivo .apk
   - Se puede descargar e instalar directamente
   - No requiere Expo Go

---

## 🌐 **ACCESO WEB PÚBLICO (WWW)**

### ✅ **Configuración Completada**

El servidor ya está configurado para acceso público:

#### **Scripts Disponibles**:

1. **Acceso Público Puerto 80**:
   ```bash
   .\iniciar-publico-www.bat
   ```
   - Acceso: `http://[TU-IP-PUBLICA]/`

2. **Acceso Local/Red Puerto 3000**:
   ```bash
   .\iniciar-publico.bat
   ```
   - Acceso: `http://[TU-IP-LOCAL]:3000/`

#### **URLs del Sistema**:

| Función | URL | Descripción |
|---------|-----|-------------|
| **App Móvil** | `/app` | Aplicación para celulares |
| **Panel Web** | `/panel` | Dashboard administrativo React |
| **Panel Admin** | `/admin` | Panel de administración |
| **Sistema** | `/` | Página principal |

---

## 📋 **INSTRUCCIONES RÁPIDAS**

### **Para usar INMEDIATAMENTE en celular**:

1. **Ejecutar**: `.\iniciar-publico.bat`
2. **Obtener IP**: Verificar la IP de tu PC
3. **En celular**: Ir a `http://[IP-PC]:3000/app`
4. **¡Listo!** Ya puedes escanear QR y marcar asistencia

### **Para acceso web público**:

1. **Ejecutar**: `.\iniciar-publico-www.bat`
2. **Configurar router**: Abrir puerto 80 hacia tu PC
3. **Acceso público**: `http://[TU-IP-PUBLICA]/`

---

## 🔧 **Ubicaciones de Archivos**

- **App Web Móvil**: `public/app-movil-funcional.html`
- **App React Native**: `mobile/` (Expo)
- **App Android Nativa**: `app/` (Kotlin/Compose)
- **Panel Web**: `web/dist/` (React/Vite)
- **Servidor**: `server.js` (Node.js/Express)

---

## 💡 **Recomendación**

**Para pruebas inmediatas**: Usa la **App Web Móvil** (Opción 1)
- ✅ Funciona inmediatamente
- ✅ No requiere instalación
- ✅ Acceso directo desde navegador
- ✅ Todas las funciones QR disponibles

**Para distribución**: Usa **Expo Go** (Opción 2)
- ✅ Experiencia más nativa
- ✅ Mejor rendimiento
- ✅ Fácil de compartir (código QR)
