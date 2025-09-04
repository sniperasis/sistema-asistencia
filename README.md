# 📋 Sistema de Asistencia

Sistema completo de toma de asistencia con lectura de códigos QR de cédulas chilenas, diseñado para tablets y con panel web de seguimiento.

## 🚀 Características

- **📊 Procesamiento de Excel**: Extrae automáticamente datos de archivos Excel con información de empleados
- **📁 Explorador de Archivos**: Sube archivos Excel únicamente desde explorador de archivos
- **📧 Correo Automático**: Recibe archivos Excel por correo y los procesa automáticamente
- **📱 Lectura QR**: Escanea códigos QR de cédulas de identidad chilenas para marcar asistencia automáticamente
- **👆 Marcado Manual**: Interfaz táctil para marcar asistencia manualmente
- **🌐 Panel Web**: Dashboard en tiempo real para seguimiento y reportes
- **📈 Reportes**: Exportación de datos en CSV y visualización de estadísticas
- **💾 Base de Datos**: Almacenamiento local con SQLite

## 🏗️ Arquitectura

```
sistema-asistencia/
├── server.js              # Backend Node.js con Express
├── package.json           # Dependencias del servidor
├── public/                # Archivos estáticos
│   └── index.html         # Interfaz de subida de Excel
├── web/                   # Panel web (React + Vite)
│   ├── src/
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Punto de entrada
│   └── package.json       # Dependencias del frontend web
├── mobile/                # App móvil (React Native + Expo)
│   ├── App.js             # Aplicación principal
│   └── package.json       # Dependencias móviles
└── asistencia.db          # Base de datos SQLite (se crea automáticamente)
```

## 📋 Requisitos

- Node.js 16+ 
- npm o yarn
- Para la app móvil: Expo CLI
- Para desarrollo: Android Studio / Xcode (opcional)

## 🛠️ Instalación

### 1. Clonar e instalar dependencias

```bash
# Instalar dependencias del servidor
npm install

# Instalar dependencias del panel web
cd web && npm install && cd ..

# Instalar dependencias de la app móvil
cd mobile && npm install && cd ..
```

### 2. Configurar Correo Electrónico (Opcional)

**Para recibir archivos Excel por correo:**

1. Sigue la guía completa en [CONFIGURACION_CORREO.md](CONFIGURACION_CORREO.md)
2. O configura variables de entorno básicas:

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar configuración (opcional si no usas correo)
nano .env
```

**Configuración mínima requerida:**
```env
PORT=3000
# Correo electrónico (opcional)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
```

### 3. Iniciar el servidor

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📱 Configuración de la App Móvil

### 1. Instalar Expo CLI

```bash
npm install -g @expo/cli
```

### 2. Configurar IP del servidor

Edita `mobile/App.js` y cambia la variable `API_BASE_URL`:

```javascript
const API_BASE_URL = 'http://TU_IP_LOCAL:3000/api';
```

### 3. Iniciar la app móvil

```bash
cd mobile
expo start
```

### 4. Instalar en tablet

- Escanea el código QR con la app Expo Go
- O genera APK: `expo build:android`

## 🌐 Panel Web

El panel web se construye automáticamente y está disponible en:

- **Desarrollo**: `http://localhost:3000/web`
- **Producción**: Se sirve desde el servidor principal

### Características del Panel:

- 📊 Dashboard con estadísticas en tiempo real
- 📅 Filtro por fecha
- 📈 Exportación a CSV
- 🔄 Actualización automática
- 📱 Diseño responsive

## 📁 Opciones para Subir Archivos Excel

### Opción 1: Explorador de Archivos 📁
- **Directo**: Selecciona archivos desde explorador de archivos
- **Seguro**: Solo se permite selección manual
- **Rápido**: Sin configuración adicional
- **Temporal**: Se procesa y elimina automáticamente

### Opción 2: Envío por Correo 📧
- **Automático**: Envía archivo Excel por correo
- **Remoto**: Funciona desde cualquier lugar
- **Confirmación**: Recibe confirmación por correo
- **Monitoreo**: Ve el estado de correos procesados

## 📊 Formato del Archivo Excel

El sistema espera un archivo Excel con las siguientes columnas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| `compute_0003` | RUT del empleado | 12345678-9 |
| `apellido1` | Primer apellido | GONZÁLEZ |
| `apellido2` | Segundo apellido | PÉREZ |
| `compute_0006` | Nombres | JUAN CARLOS |
| `desc_especialidad` | Especialidad | OPERADOR |
| `descripcion_1` | Descripción 1 | MUELLE |
| `descripcion_2` | Descripción 2 | SITIO 01 |
| `nomnave` | Nombre nave | BUQUE CARGO |
| `grupo` | Grupo | 5 |
| `fecha` | Fecha | 02/09/2025 00 TERCERO |

## 🔧 API Endpoints

### Empleados
- `GET /api/empleados` - Obtener lista de empleados
- `POST /api/upload-excel` - Subir y procesar archivo Excel (explorador)

### Asistencia
- `POST /api/marcar-asistencia` - Marcar asistencia manual
- `POST /api/marcar-asistencia-qr` - Marcar asistencia por QR
- `GET /api/reporte-asistencias?fecha=YYYY-MM-DD` - Obtener reporte

### Correo Electrónico
- `GET /api/emails` - Obtener lista de correos recibidos
- Procesamiento automático cada 5 minutos

## 📱 Uso de la App Móvil

### Vista de Lista
- Muestra todos los empleados
- Estado visual (presente/ausente/pendiente)
- Botón para marcar asistencia manual

### Vista de Cámara
- Escanea códigos QR de cédulas chilenas
- Extrae automáticamente el RUT
- Marca asistencia si el RUT está en la lista

## 🔍 Lectura de QR

El sistema extrae RUTs de códigos QR de cédulas chilenas usando patrones:

1. **Formato completo**: `12.345.678-9`
2. **Formato simple**: `12345678-9`
3. **Solo números**: `123456789`

## 🚀 Despliegue

### Servidor Local
```bash
npm start
```

### Servidor en la Nube
1. Subir código a servidor (Heroku, DigitalOcean, etc.)
2. Configurar variables de entorno (incluyendo correo electrónico)
3. Instalar dependencias
4. Iniciar con `npm start`

**Importante**: Para correo en producción, configura las credenciales de correo en las variables de entorno.

### App Móvil
```bash
cd mobile
expo build:android  # Para Android
expo build:ios      # Para iOS
```

## 🔧 Solución de Problemas

### Error de conexión en app móvil
- Verificar que la IP del servidor sea correcta
- Asegurar que el servidor esté corriendo
- Verificar firewall/antivirus

### Error al procesar Excel
- Verificar formato de columnas
- Asegurar que el archivo no esté corrupto
- Revisar permisos de escritura

### Problemas con cámara
- Verificar permisos de cámara
- Reiniciar la aplicación
- Verificar que la tablet tenga cámara

## 📞 Soporte

Para soporte técnico o consultas:
- Revisar logs del servidor
- Verificar configuración de red
- Consultar documentación de Expo/React Native

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

**Desarrollado con ❤️ para facilitar la gestión de asistencias**
