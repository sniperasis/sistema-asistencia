const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const imap = require('imap');
const { simpleParser } = require('mailparser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de correo electrónico
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

const imapConfig = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
  host: process.env.IMAP_HOST || 'imap.gmail.com',
  port: process.env.IMAP_PORT || 993,
  tls: true
};

// Configurar transportador de correo
const transporter = nodemailer.createTransport(emailConfig);

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
    tipo_marcado TEXT CHECK(tipo_marcado IN ('manual', 'qr')) DEFAULT 'manual',
    estado TEXT CHECK(estado IN ('presente', 'ausente', 'pendiente')) DEFAULT 'pendiente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados (id)
  )`);

  // Tabla para sesiones de asistencia
  db.run(`CREATE TABLE IF NOT EXISTS sesiones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activa BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabla para correos recibidos
  db.run(`CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    subject TEXT,
    received_at DATETIME NOT NULL,
    status TEXT CHECK(status IN ('pending', 'processed', 'error')) DEFAULT 'pending',
    file_path TEXT,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Función para extraer RUT de QR de cédula chilena
function extraerRutDeQR(qrData) {
  // Los QR de cédulas chilenas contienen información en formato específico
  // Buscamos patrones de RUT en el texto del QR
  const rutPattern = /(\d{1,2}\.\d{3}\.\d{3}-[\dkK])/i;
  const match = qrData.match(rutPattern);
  
  if (match) {
    return match[1].replace(/\./g, '').toUpperCase();
  }
  
  // Si no encuentra el patrón completo, busca solo números
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

// Función para verificar correos y procesar archivos Excel
function checkEmails() {
  const imapConnection = new imap(imapConfig);
  
  imapConnection.once('ready', () => {
    imapConnection.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('Error al abrir buzón:', err);
        return;
      }
      
      // Buscar correos no leídos con archivos Excel
      imapConnection.search(['UNSEEN', ['SUBJECT', 'Archivo de Asistencia']], (err, results) => {
        if (err) {
          console.error('Error al buscar correos:', err);
          return;
        }
        
        if (results.length === 0) {
          imapConnection.end();
          return;
        }
        
        const fetch = imapConnection.fetch(results, { bodies: '' });
        
        fetch.on('message', (msg, seqno) => {
          msg.on('body', (stream, info) => {
            simpleParser(stream, (err, parsed) => {
              if (err) {
                console.error('Error al parsear correo:', err);
                return;
              }
              
              // Guardar información del correo
              const emailData = {
                sender: parsed.from.text,
                subject: parsed.subject,
                receivedAt: parsed.date
              };
              
              // Buscar archivos Excel adjuntos
              const excelAttachments = parsed.attachments.filter(att => 
                att.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                att.contentType === 'application/vnd.ms-excel'
              );
              
              if (excelAttachments.length > 0) {
                const attachment = excelAttachments[0];
                const fileName = `uploads/email_${Date.now()}_${attachment.filename}`;
                
                // Guardar archivo adjunto
                fs.writeFileSync(fileName, attachment.content);
                
                // Registrar correo en base de datos
                db.run('INSERT INTO emails (sender, subject, received_at, file_path) VALUES (?, ?, ?, ?)',
                  [emailData.sender, emailData.subject, emailData.receivedAt, fileName], (err) => {
                  if (err) {
                    console.error('Error al guardar correo:', err);
                    return;
                  }
                  
                  // Procesar archivo Excel
                  try {
                    const empleados = procesarExcel(fileName);
                    
                    // Limpiar empleados existentes
                    db.run('DELETE FROM empleados', (err) => {
                      if (err) {
                        console.error('Error al limpiar empleados:', err);
                        return;
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
                      
                      // Actualizar estado del correo
                      db.run('UPDATE emails SET status = ? WHERE file_path = ?',
                        ['processed', fileName]);
                      
                      // Enviar correo de confirmación
                      enviarConfirmacion(emailData.sender, empleados.length);
                      
                      console.log(`✅ Archivo procesado desde correo: ${empleados.length} empleados`);
                    });
                  } catch (error) {
                    console.error('Error al procesar archivo:', error);
                    db.run('UPDATE emails SET status = ?, error_message = ? WHERE file_path = ?',
                      ['error', error.message, fileName]);
                  }
                });
              }
            });
          });
        });
        
        fetch.once('end', () => {
          imapConnection.end();
        });
      });
    });
  });
  
  imapConnection.once('error', (err) => {
    console.error('Error de conexión IMAP:', err);
  });
  
  imapConnection.connect();
}

// Función para enviar correo de confirmación
function enviarConfirmacion(destinatario, cantidadEmpleados) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: '✅ Archivo de Asistencia Procesado',
    html: `
      <h2>✅ Archivo Procesado Exitosamente</h2>
      <p>Tu archivo Excel ha sido procesado correctamente.</p>
      <p><strong>Empleados cargados:</strong> ${cantidadEmpleados}</p>
      <p>El sistema de asistencia está listo para usar.</p>
      <hr>
      <p><em>Sistema de Asistencia Automático</em></p>
    `
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar confirmación:', error);
    } else {
      console.log('✅ Confirmación enviada:', info.messageId);
    }
  });
}

// Verificar correos cada 5 minutos
setInterval(checkEmails, 5 * 60 * 1000);

// Rutas de la API

// Obtener lista de correos recibidos
app.get('/api/emails', (req, res) => {
  db.all('SELECT * FROM emails ORDER BY received_at DESC LIMIT 20', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener correos' });
    }
    res.json(rows);
  });
});


// Subir y procesar archivo Excel (método original)
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
  const { fecha } = req.query;
  const fechaActual = fecha || new Date().toISOString().split('T')[0];
  
  // Obtener empleados con su estado de asistencia del día
  const query = `
    SELECT 
      e.id,
      e.rut,
      e.nombres,
      e.apellido1,
      e.apellido2,
      e.especialidad,
      COALESCE(a.estado, 'PENDIENTE') as estado,
      COALESCE(a.hora, '-') as hora,
      COALESCE(a.tipo_marcado, '-') as tipo,
      ? as fecha,
      'TERCERO' as turno
    FROM empleados e
    LEFT JOIN asistencias a ON e.id = a.empleado_id AND a.fecha = ?
    ORDER BY e.apellido1, e.apellido2, e.nombres
  `;
  
  db.all(query, [fechaActual, fechaActual], (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener empleados: ' + err.message 
      });
    }
    
    // Formatear los datos para la app móvil
    const empleados = rows.map(emp => ({
      id: emp.id,
      rut: emp.rut,
      nombres: emp.nombres,
      apellidos: `${emp.apellido1} ${emp.apellido2}`.trim(),
      especialidad: emp.especialidad,
      estado: emp.estado,
      hora: emp.hora,
      tipo: emp.tipo,
      fecha: emp.fecha,
      turno: emp.turno
    }));
    
    res.json({
      success: true,
      empleados: empleados,
      total: empleados.length
    });
  });
});

// Marcar asistencia manual
app.post('/api/marcar-asistencia', (req, res) => {
  const { empleado_id, tipo_marcado = 'manual' } = req.body;
  const fecha = new Date().toISOString().split('T')[0];
  const hora = new Date().toTimeString().split(' ')[0];
  
  // Verificar si ya existe una marca para hoy
  db.get('SELECT * FROM asistencias WHERE empleado_id = ? AND fecha = ?', 
    [empleado_id, fecha], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al verificar asistencia' });
    }
    
    if (row) {
      // Actualizar asistencia existente
      db.run('UPDATE asistencias SET estado = ?, tipo_marcado = ?, hora = ? WHERE id = ?',
        ['presente', tipo_marcado, hora, row.id], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar asistencia' });
        }
        res.json({ message: 'Asistencia actualizada correctamente' });
      });
    } else {
      // Crear nueva asistencia
      db.run('INSERT INTO asistencias (empleado_id, fecha, hora, tipo_marcado, estado) VALUES (?, ?, ?, ?, ?)',
        [empleado_id, fecha, hora, tipo_marcado, 'presente'], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al marcar asistencia' });
        }
        res.json({ message: 'Asistencia marcada correctamente' });
      });
    }
  });
});

// Limpiar asistencia completa - Eliminar todos los empleados y asistencias
app.post('/api/limpiar-asistencia', (req, res) => {
  // Eliminar todas las asistencias
  db.run('DELETE FROM asistencias', function(err) {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al limpiar asistencias: ' + err.message 
      });
    }
    
    const asistenciasEliminadas = this.changes;
    
    // Eliminar todos los empleados
    db.run('DELETE FROM empleados', function(err) {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          error: 'Error al limpiar empleados: ' + err.message 
        });
      }
      
      const empleadosEliminados = this.changes;
      
      res.json({ 
        success: true, 
        message: `Sistema limpiado completamente. Se eliminaron ${empleadosEliminados} empleados y ${asistenciasEliminadas} registros de asistencia.`,
        empleadosEliminados: empleadosEliminados,
        asistenciasEliminadas: asistenciasEliminadas
      });
    });
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

// Servir archivos estáticos del panel web
app.use('/web', express.static(path.join(__dirname, 'web/dist')));
app.use('/panel', express.static(path.join(__dirname, 'web/dist')));
app.use('/assets', express.static(path.join(__dirname, 'web/dist/assets')));

// Ruta principal - Sistema de asistencia
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para app móvil funcional
app.get('/app-movil-funcional', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app-movil-funcional.html'));
});

// Ruta alternativa para app móvil
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app-movil-funcional.html'));
});

// Ruta para panel web de administración
app.get('/panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/dist', 'index.html'));
});

// Ruta para panel administrativo
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'panel.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌐 Acceso público en http://0.0.0.0:${PORT}`);
  console.log(`📱 App móvil en: http://localhost:${PORT}/app`);
  console.log(`📊 Panel web en: http://localhost:${PORT}/panel`);
  console.log(`⚙️  Panel admin en: http://localhost:${PORT}/admin`);
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
