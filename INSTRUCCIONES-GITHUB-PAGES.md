# 🌐 Instrucciones para GitHub Pages

## ✅ **PASOS COMPLETADOS**

1. ✅ Repositorio Git inicializado
2. ✅ Frontend compilado correctamente
3. ✅ Branch `gh-pages` creado
4. ✅ Archivos preparados para GitHub Pages
5. ✅ Commit realizado

## 🚀 **SIGUIENTES PASOS**

### **Paso 1: Crear Repositorio en GitHub**

1. Ve a [github.com](https://github.com)
2. Haz clic en **"New repository"** (botón verde)
3. Nombre del repositorio: `sistema-asistencia`
4. Descripción: `Sistema de Asistencia con QR para Cédulas Chilenas`
5. **IMPORTANTE**: Marca como **Público** (necesario para GitHub Pages gratuito)
6. **NO** marques "Add README" (ya tenemos archivos)
7. Haz clic en **"Create repository"**

### **Paso 2: Conectar Repositorio Local**

Ejecuta estos comandos en tu terminal:

```bash
# Agregar el repositorio remoto (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/sistema-asistencia.git

# Subir el branch gh-pages
git push -u origin gh-pages

# Volver al branch main
git checkout main

# Subir el código principal
git push -u origin main
```

### **Paso 3: Activar GitHub Pages**

1. En tu repositorio de GitHub, ve a **Settings**
2. Busca **"Pages"** en el menú lateral
3. En **"Source"**, selecciona **"Deploy from a branch"**
4. En **"Branch"**, selecciona **"gh-pages"**
5. En **"Folder"**, selecciona **"/ (root)"**
6. Haz clic en **"Save"**

### **Paso 4: ¡Listo!**

Tu sistema estará disponible en:
- **URL**: `https://TU-USUARIO.github.io/sistema-asistencia`
- **App móvil**: `https://TU-USUARIO.github.io/sistema-asistencia/app-movil-funcional.html`
- **Panel admin**: `https://TU-USUARIO.github.io/sistema-asistencia/panel.html`

## 📱 **Para Usar en Celular**

1. Abre el navegador del celular
2. Ve a: `https://TU-USUARIO.github.io/sistema-asistencia`
3. Haz clic en **"App Móvil"**
4. ¡Listo! Puedes escanear QR y marcar asistencia

## ⚠️ **Nota Importante**

Esta es la versión **frontend** del sistema. Para funcionalidad completa (APIs, base de datos), necesitas ejecutar el servidor backend localmente o usar una de las otras opciones de deployment.

## 🔄 **Para Actualizar**

Cada vez que hagas cambios:

```bash
# Compilar frontend
npm run build:web

# Cambiar a branch gh-pages
git checkout gh-pages

# Copiar archivos actualizados
xcopy /E /I /Y web\dist\* .

# Commit y push
git add .
git commit -m "Actualizar frontend"
git push origin gh-pages

# Volver a main
git checkout main
```
