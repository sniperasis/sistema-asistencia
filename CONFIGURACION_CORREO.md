# 📧 Configuración de Correo Electrónico

Esta guía te ayudará a configurar el sistema para recibir archivos Excel por correo electrónico de forma automática.

## 📋 Pasos para Configurar Gmail

### 1. Crear Contraseña de Aplicación

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Ve a "Seguridad" → "Contraseñas de aplicaciones"
3. Selecciona "Correo" y "Otro (nombre personalizado)"
4. Escribe: "Sistema de Asistencia"
5. **IMPORTANTE**: Copia la contraseña generada (16 caracteres)

### 2. Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp env.example .env
```

2. Edita el archivo `.env`:
```env
# Configuración de correo electrónico
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_16_caracteres
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Configuración IMAP
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
```

### 3. Reiniciar el Servidor

```bash
npm start
```

## 🚀 Cómo Usar el Sistema de Correo

### **Opción 1: Explorador de Archivos** 📁
- Ve a `http://localhost:3000`
- Pestaña "📁 Explorador de Archivos"
- Haz clic para seleccionar archivo Excel
- **Solo se permite selección desde explorador**

### **Opción 2: Envío por Correo** 📧
1. **Envía tu archivo Excel al correo:**
   ```
   asistencia@tudominio.com
   ```

2. **Formato del correo:**
   - **Para**: asistencia@tudominio.com
   - **Asunto**: "Archivo de Asistencia"
   - **Adjunto**: Tu archivo Excel (.xlsx o .xls)

3. **El sistema automáticamente:**
   - ✅ Recibe el correo cada 5 minutos
   - ✅ Extrae el archivo Excel adjunto
   - ✅ Procesa los datos de empleados
   - ✅ Envía confirmación por correo
   - ✅ Actualiza la base de datos

## 📊 Monitoreo de Correos

### **Ver Estado de Correos:**
1. Ve a la pestaña "📧 Envío por Correo"
2. Sección "📊 Estado de Correos Recibidos"
3. Verás la lista de correos procesados

### **Estados Posibles:**
- **🟡 PENDING**: Correo recibido, procesando
- **🟢 PROCESSED**: Archivo procesado exitosamente
- **🔴 ERROR**: Error al procesar archivo

## ⚙️ Configuración Avanzada

### **Cambiar Frecuencia de Verificación:**
En `server.js`, línea 326:
```javascript
// Verificar correos cada 5 minutos (300000 ms)
setInterval(checkEmails, 5 * 60 * 1000);

// Para verificar cada 1 minuto:
setInterval(checkEmails, 1 * 60 * 1000);
```

### **Filtrar por Asunto:**
En `server.js`, línea 184:
```javascript
// Buscar correos con asunto específico
imapConnection.search(['UNSEEN', ['SUBJECT', 'Archivo de Asistencia']], ...)

// Para aceptar cualquier asunto:
imapConnection.search(['UNSEEN'], ...)
```

### **Personalizar Correo de Confirmación:**
En `server.js`, función `enviarConfirmacion()`:
```javascript
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: destinatario,
  subject: '✅ Archivo de Asistencia Procesado',
  html: `
    <h2>✅ Archivo Procesado Exitosamente</h2>
    <p>Tu archivo Excel ha sido procesado correctamente.</p>
    <p><strong>Empleados cargados:</strong> ${cantidadEmpleados}</p>
    <!-- Personaliza aquí -->
  `
};
```

## 🔒 Seguridad

### **Contraseña de Aplicación:**
- ✅ Usa contraseña de aplicación, no tu contraseña normal
- ✅ La contraseña es de 16 caracteres
- ✅ Se genera específicamente para esta aplicación
- ✅ Se puede revocar en cualquier momento

### **Acceso IMAP:**
- ✅ Solo lee correos no leídos
- ✅ No modifica correos existentes
- ✅ Procesa solo archivos Excel adjuntos
- ✅ Elimina archivos temporales después de procesar

## 🆓 Límites de Gmail

Gmail tiene límites generosos para uso personal:
- **100 correos por día** (más que suficiente)
- **25 MB por archivo adjunto**
- **15 GB de almacenamiento**

Para un sistema de asistencia, estos límites son más que suficientes.

## 🔧 Solución de Problemas

### **Error: "Invalid login"**
- Verifica que la contraseña de aplicación sea correcta
- Asegúrate de que no haya espacios extra
- Verifica que el correo esté bien escrito

### **Error: "Connection timeout"**
- Verifica tu conexión a internet
- Revisa que los puertos 587 y 993 estén abiertos
- Verifica la configuración del firewall

### **No se procesan correos**
- Verifica que el asunto sea exactamente "Archivo de Asistencia"
- Asegúrate de que el archivo sea Excel (.xlsx o .xls)
- Revisa los logs del servidor para errores

### **Error al procesar archivo Excel**
- Verifica el formato del archivo Excel
- Asegúrate de que tenga las columnas correctas
- Revisa que no esté corrupto

## 📱 Alternativas de Correo

### **Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
IMAP_HOST=outlook.office365.com
IMAP_PORT=993
```

### **Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
IMAP_HOST=imap.mail.yahoo.com
IMAP_PORT=993
```

### **Correo Corporativo:**
Consulta con tu administrador de IT para:
- Servidor SMTP
- Servidor IMAP
- Configuración de seguridad

## 🎯 Recomendación

**Gmail es la mejor opción** porque:
- ✅ Fácil de configurar
- ✅ Contraseñas de aplicación seguras
- ✅ Límites generosos
- ✅ Acceso desde cualquier lugar
- ✅ Gratuito

---

**¿Necesitas ayuda?** Revisa los logs del servidor para más detalles sobre errores específicos.
