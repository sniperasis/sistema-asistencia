# 🚀 GUÍA RÁPIDA - SISTEMA DE ASISTENCIA

## ⚡ MÉTODO MÁS RÁPIDO (SIN CONFIGURACIÓN)

### **1. Ejecutar Demo Completo (Recomendado)**
```bash
# Doble clic en:
demo-completo.bat
```
**Esto hace TODO automáticamente:**
- ✅ Instala dependencias
- ✅ Construye panel web
- ✅ Inicia servidor
- ✅ Abre app móvil
- ✅ Abre todas las ventanas

### **2. Accesos Automáticos**
Se abrirán automáticamente:
- 📊 **Panel Principal**: http://localhost:3000
- 🌐 **Panel de Control**: http://localhost:3000/web
- 📱 **App Móvil**: http://localhost:19006

## 🎯 PRUEBA RÁPIDA (5 MINUTOS)

### **Paso 1: Cargar Datos**
1. Ve a: http://localhost:3000
2. Pestaña "📁 Explorador de Archivos"
3. Haz clic para seleccionar archivo
4. **Usa el archivo**: `datos-prueba.xlsx` (ya incluido)

### **Paso 2: Simular Asistencia**
1. Ve a: http://localhost:19006 (App Móvil)
2. **Vista "Lista"**: Ve los 10 empleados
3. **Toca "Marcar"** en algunos empleados
4. **Observa** los cambios de color

### **Paso 3: Ver Reportes**
1. Ve a: http://localhost:3000/web
2. **Ve estadísticas** en tiempo real
3. **Cambia fecha** para ver diferentes días
4. **Exporta CSV** del reporte

## 📱 FUNCIONALIDADES DE PRUEBA

### **App Móvil (http://localhost:19006)**
- ✅ **Lista de empleados** con datos reales
- ✅ **Marcado manual** con botones táctiles
- ✅ **Estados visuales** (verde/rojo/amarillo)
- ✅ **Navegación** entre Lista y QR
- ❌ **Cámara QR**: No funciona en navegador

### **Panel Web (http://localhost:3000/web)**
- ✅ **Dashboard** con estadísticas
- ✅ **Filtro por fecha**
- ✅ **Tabla detallada** de empleados
- ✅ **Exportación CSV**
- ✅ **Actualización** en tiempo real

### **Panel Principal (http://localhost:3000)**
- ✅ **Subida de archivos** Excel
- ✅ **Procesamiento** automático
- ✅ **Confirmación** de carga
- ✅ **Enlaces** a otras secciones

## 🎨 DATOS DE PRUEBA INCLUIDOS

### **Archivo Excel**: `datos-prueba.xlsx`
- **10 empleados** de ejemplo
- **RUTs válidos** para pruebas
- **Especialidades** variadas
- **Formato correcto** para el sistema

### **Empleados de Prueba:**
1. **JUAN CARLOS GONZÁLEZ PÉREZ** - RUT: 12345678-9
2. **MARÍA ELENA MARTÍNEZ LÓPEZ** - RUT: 98765432-1
3. **CARLOS ALBERTO RODRÍGUEZ SÁNCHEZ** - RUT: 11223344-5
4. **ANA LUCÍA FERNÁNDEZ GARCÍA** - RUT: 55667788-9
5. **PEDRO ANTONIO HERRERA MORALES** - RUT: 99887766-5
6. **SOFÍA ALEJANDRA VARGAS CASTRO** - RUT: 44332211-7
7. **MIGUEL ÁNGEL TORRES RAMÍREZ** - RUT: 77665544-3
8. **CAROLINA PATRICIA JIMÉNEZ FLORES** - RUT: 33445566-1
9. **DIEGO SEBASTIÁN MORALES HERRERA** - RUT: 88990011-5
10. **VALENTINA ISABEL CASTRO VARGAS** - RUT: 11223344-7

## 🔧 SCRIPTS DISPONIBLES

### **demo-completo.bat** (Recomendado)
- Instala todo automáticamente
- Inicia sistema completo
- Abre todas las ventanas

### **start-rapido.bat**
- Solo servidor y panel web
- Sin app móvil

### **start-app-movil.bat**
- Solo app móvil
- Requiere servidor corriendo

## ⚠️ NOTAS IMPORTANTES

### **Sin Configuración:**
- ✅ **No necesitas** configurar correo
- ✅ **No necesitas** Android Studio
- ✅ **No necesitas** instalar nada más
- ✅ **Funciona** inmediatamente

### **Limitaciones:**
- ❌ **Cámara QR**: No funciona en navegador
- ❌ **Correo**: No configurado (opcional)
- ❌ **Persistencia**: Datos se pierden al reiniciar

### **Para Funcionalidad Completa:**
- 📱 **App real**: Usa Expo Go en teléfono
- 📧 **Correo**: Configura Gmail (opcional)
- 💾 **Persistencia**: Configura base de datos

## 🎯 FLUJO DE PRUEBA RECOMENDADO

1. **Ejecuta**: `demo-completo.bat`
2. **Espera**: 2-3 minutos para instalación
3. **Carga**: Archivo `datos-prueba.xlsx`
4. **Prueba**: Marcado en app móvil
5. **Observa**: Reportes en panel web
6. **Exporta**: CSV del reporte

## 🚀 RESULTADO ESPERADO

Después de 5 minutos tendrás:
- ✅ **Sistema funcionando** completamente
- ✅ **10 empleados** cargados
- ✅ **App móvil** simulando asistencia
- ✅ **Panel web** mostrando reportes
- ✅ **Exportación** de datos funcionando

---

**¿Problemas?** Revisa que no tengas otros servicios usando los puertos 3000 o 19006.
