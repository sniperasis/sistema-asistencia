const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'), false);
    }
  }
});

// Inicializar base de datos SQLite
const db = new sqlite3.Database('asistencia.db');

// Crear tablas si no existen
db.serialize(() => {
  // Tabla para empleados
  db.run(`CREATE TABLE IF NOT EXISTS empleados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rut TEXT UNIQUE NOT NULL,
    apellido1 TEXT NOT NULL,
    apellido2 TEXT,
    nombres TEXT NOT NULL,
    especialidad TEXT,
    descripcion1 TEXT,
    descripcion2 TEXT,
    nomnave TEXT,
    grupo INTEGER,
    fecha TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabla para asistencias
  db.run(`CREATE TABLE IF NOT EXISTS asistencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    empleado_id INTEGER,
    fecha DATE NOT NULL,
    hora TIME,
    tipo_marcado TEXT DEFAULT 'manual',
    estado TEXT DEFAULT 'pendiente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados (id)
  )`);
});

// Función para extraer RUT de QR de cédula chilena
function extraerRutDeQR(qrData) {
  const rutPattern = /(\d{1,2}\.\d{3}\.\d{3}-[\dkK])/i;
  const match = qrData.match(rutPattern);
  
  if (match) {
    return match[1].replace(/\./g, '').toUpperCase();
  }
  
  const numberPattern = /(\d{7,8}[\dkK])/i;
  const numberMatch = qrData.match(numberPattern);
  
  if (numberMatch) {
    return numberMatch[1].toUpperCase();
  }
  
  return null;
}

// Función para procesar archivo Excel
function procesarExcel(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    return data.map(row => ({
      rut: row.compute_0003 || '',
      apellido1: row.apellido1 || '',
      apellido2: row.apellido2 || '',
      nombres: row.compute_0006 || '',
      especialidad: row.desc_especialidad || '',
      descripcion1: row.descripcion_1 || '',
      descripcion2: row.descripcion_2 || '',
      nomnave: row.nomnave || '',
      grupo: row.grupo || 0,
      fecha: row.fecha || ''
    }));
  } catch (error) {
    throw new Error('Error al procesar el archivo Excel: ' + error.message);
  }
}

// Rutas de la API

// Subir y procesar archivo Excel
app.post('/api/upload-excel', upload.single('excel'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  try {
    const empleados = procesarExcel(req.file.path);
    
    // Limpiar empleados existentes
    db.run('DELETE FROM empleados', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al limpiar datos existentes' });
      }
      
      // Insertar nuevos empleados
      const stmt = db.prepare(`INSERT INTO empleados 
        (rut, apellido1, apellido2, nombres, especialidad, descripcion1, descripcion2, nomnave, grupo, fecha)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      
      empleados.forEach(empleado => {
        stmt.run([
          empleado.rut,
          empleado.apellido1,
          empleado.apellido2,
          empleado.nombres,
          empleado.especialidad,
          empleado.descripcion1,
          empleado.descripcion2,
          empleado.nomnave,
          empleado.grupo,
          empleado.fecha
        ]);
      });
      
      stmt.finalize();
      
      // Eliminar archivo temporal
      fs.unlinkSync(req.file.path);
      
      res.json({ 
        message: 'Archivo procesado correctamente',
        empleados: empleados.length
      });
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener lista de empleados
app.get('/api/empleados', (req, res) => {
  const fecha = req.query.fecha || new Date().toISOString().split('T')[0];
  
  // Obtener empleados con su estado de asistencia para la fecha
  const query = `
    SELECT 
      e.id,
      e.rut,
      e.nombres,
      e.apellido1,
      e.apellido2,
      e.especialidad,
      e.nomnave,
      e.descripcion2,
      COALESCE(a.estado, 'pendiente') as estado,
      COALESCE(a.hora, '-') as hora,
      COALESCE(a.tipo_marcado, '-') as tipo
    FROM empleados e
    LEFT JOIN asistencias a ON e.id = a.empleado_id AND a.fecha = ?
    ORDER BY e.apellido1, e.apellido2, e.nombres
  `;
  
  db.all(query, [fecha], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Error al obtener empleados' });
    }
    
    // Formatear datos para la app móvil
    const empleados = rows.map(row => ({
      id: row.id,
      rut: row.rut,
      nombres: row.nombres,
      apellidos: `${row.apellido1} ${row.apellido2}`.trim(),
      especialidad: row.especialidad,
      nomnave: row.nomnave || '',
      descripcion2: row.descripcion2 || '',
      estado: row.estado.toUpperCase(),
      hora: row.hora,
      tipo: row.tipo
    }));
    
    res.json({ success: true, empleados: empleados });
  });
});

// Obtener estadísticas detalladas por NOMNAVE y DESCRIPCION_2
app.get('/api/estadisticas-detalladas', (req, res) => {
  const fecha = req.query.fecha || new Date().toISOString().split('T')[0];
  
  const query = `
    SELECT 
      e.nomnave,
      e.descripcion2,
      COUNT(*) as total_empleados,
      SUM(CASE WHEN COALESCE(a.estado, 'pendiente') = 'presente' THEN 1 ELSE 0 END) as presentes,
      SUM(CASE WHEN COALESCE(a.estado, 'pendiente') = 'ausente' THEN 1 ELSE 0 END) as ausentes,
      SUM(CASE WHEN COALESCE(a.estado, 'pendiente') = 'pendiente' THEN 1 ELSE 0 END) as pendientes
    FROM empleados e
    LEFT JOIN asistencias a ON e.id = a.empleado_id AND a.fecha = ?
    GROUP BY e.nomnave, e.descripcion2
    ORDER BY e.nomnave, e.descripcion2
  `;
  
  db.all(query, [fecha], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Error al obtener estadísticas' });
    }
    
    const estadisticas = rows.map(row => ({
      nomnave: row.nomnave || 'Sin Nave',
      descripcion2: row.descripcion2 || 'Sin Descripción',
      total: row.total_empleados,
      presentes: row.presentes,
      ausentes: row.ausentes,
      pendientes: row.pendientes,
      porcentajeAsistencia: row.total_empleados > 0 ? Math.round((row.presentes / row.total_empleados) * 100) : 0,
      faltantes: row.total_empleados - row.presentes
    }));
    
    res.json({ success: true, estadisticas: estadisticas });
  });
});

// Marcar asistencia manual
app.post('/api/marcar-asistencia', (req, res) => {
  const { id, estado, fecha } = req.body;
  const fechaActual = fecha || new Date().toISOString().split('T')[0];
  const hora = new Date().toTimeString().split(' ')[0];
  const tipo_marcado = 'manual';
  
  console.log('Marcando asistencia:', { id, estado, fecha: fechaActual, hora, tipo_marcado });
  
  // Verificar si ya existe una marca para hoy
  db.get('SELECT * FROM asistencias WHERE empleado_id = ? AND fecha = ?', 
    [id, fechaActual], (err, row) => {
    if (err) {
      console.error('Error al verificar asistencia:', err);
      return res.status(500).json({ success: false, error: 'Error al verificar asistencia: ' + err.message });
    }
    
    if (row) {
      // Actualizar asistencia existente
      db.run('UPDATE asistencias SET estado = ?, tipo_marcado = ?, hora = ? WHERE id = ?',
        [estado.toLowerCase(), tipo_marcado, hora, row.id], (err) => {
        if (err) {
          console.error('Error al actualizar asistencia:', err);
          return res.status(500).json({ success: false, error: 'Error al actualizar asistencia: ' + err.message });
        }
        res.json({ success: true, message: 'Asistencia actualizada correctamente' });
      });
    } else {
      // Crear nueva asistencia
      db.run('INSERT INTO asistencias (empleado_id, fecha, hora, tipo_marcado, estado) VALUES (?, ?, ?, ?, ?)',
        [id, fechaActual, hora, tipo_marcado, estado.toLowerCase()], function(err) {
        if (err) {
          console.error('Error al marcar asistencia:', err);
          return res.status(500).json({ success: false, error: 'Error al marcar asistencia: ' + err.message });
        }
        res.json({ success: true, message: 'Asistencia marcada correctamente' });
      });
    }
  });
});

// Marcar asistencia por QR
app.post('/api/marcar-asistencia-qr', (req, res) => {
  const { qrData } = req.body;
  
  const rut = extraerRutDeQR(qrData);
  if (!rut) {
    return res.status(400).json({ error: 'No se pudo extraer RUT del QR' });
  }
  
  // Buscar empleado por RUT
  db.get('SELECT * FROM empleados WHERE rut = ?', [rut], (err, empleado) => {
    if (err) {
      return res.status(500).json({ error: 'Error al buscar empleado' });
    }
    
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado en la lista' });
    }
    
    // Marcar asistencia
    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toTimeString().split(' ')[0];
    
    db.get('SELECT * FROM asistencias WHERE empleado_id = ? AND fecha = ?', 
      [empleado.id, fecha], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error al verificar asistencia' });
      }
      
      if (row) {
        db.run('UPDATE asistencias SET estado = ?, tipo_marcado = ?, hora = ? WHERE id = ?',
          ['presente', 'qr', hora, row.id], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error al actualizar asistencia' });
          }
          res.json({ 
            message: 'Asistencia actualizada correctamente',
            empleado: empleado
          });
        });
      } else {
        db.run('INSERT INTO asistencias (empleado_id, fecha, hora, tipo_marcado, estado) VALUES (?, ?, ?, ?, ?)',
          [empleado.id, fecha, hora, 'qr', 'presente'], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error al marcar asistencia' });
          }
          res.json({ 
            message: 'Asistencia marcada correctamente',
            empleado: empleado
          });
        });
      }
    });
  });
});

// Limpiar asistencia (resetear todos los empleados a pendiente)
app.post('/api/limpiar-asistencia', (req, res) => {
  const fecha = req.body.fecha || new Date().toISOString().split('T')[0];
  
  // Eliminar todas las asistencias del día
  db.run('DELETE FROM asistencias WHERE fecha = ?', [fecha], (err) => {
    if (err) {
      console.error('Error al limpiar asistencia:', err);
      return res.status(500).json({ success: false, error: 'Error al limpiar asistencia: ' + err.message });
    }
    
    console.log(`Asistencia limpiada para la fecha: ${fecha}`);
    res.json({ success: true, message: 'Asistencia limpiada correctamente' });
  });
});

// Obtener reporte de asistencias
app.get('/api/reporte-asistencias', (req, res) => {
  const { fecha } = req.query;
  const fechaConsulta = fecha || new Date().toISOString().split('T')[0];
  
  const query = `
    SELECT 
      e.rut,
      e.apellido1,
      e.apellido2,
      e.nombres,
      e.especialidad,
      a.estado,
      a.hora,
      a.tipo_marcado
    FROM empleados e
    LEFT JOIN asistencias a ON e.id = a.empleado_id AND a.fecha = ?
    ORDER BY e.apellido1, e.apellido2, e.nombres
  `;
  
  db.all(query, [fechaConsulta], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener reporte' });
    }
    
    const reporte = rows.map(row => ({
      ...row,
      estado: row.estado || 'pendiente'
    }));
    
    res.json(reporte);
  });
});

// Panel web simplificado
app.get('/web', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'panel.html'));
});

// Servir app móvil
app.get('/app-movil', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app-movil.html'));
});

// Servir app móvil funcional (versión sin servidor)
app.get('/app-movil-funcional', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app-movil-funcional.html'));
});

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📱 Panel web disponible en http://localhost:${PORT}/web`);
});

// Manejo de errores
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar la base de datos:', err.message);
    } else {
      console.log('✅ Base de datos cerrada correctamente');
    }
    process.exit(0);
  });
});
