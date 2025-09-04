import React, { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import axios from 'axios'

function App() {
  const [reporte, setReporte] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fecha, setFecha] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [stats, setStats] = useState({
    total: 0,
    presentes: 0,
    ausentes: 0,
    pendientes: 0
  })

  const cargarReporte = async (fechaConsulta = fecha) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`/api/reporte-asistencias?fecha=${fechaConsulta}`)
      const datos = response.data
      
      setReporte(datos)
      
      // Calcular estadísticas
      const total = datos.length
      const presentes = datos.filter(item => item.estado === 'presente').length
      const ausentes = datos.filter(item => item.estado === 'ausente').length
      const pendientes = datos.filter(item => item.estado === 'pendiente').length
      
      setStats({ total, presentes, ausentes, pendientes })
    } catch (err) {
      setError('Error al cargar el reporte: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarReporte()
  }, [])

  const handleFechaChange = (e) => {
    const nuevaFecha = e.target.value
    setFecha(nuevaFecha)
    cargarReporte(nuevaFecha)
  }

  const exportarExcel = () => {
    // Crear datos para exportar
    const datosExport = reporte.map(item => ({
      'RUT': item.rut,
      'Apellido 1': item.apellido1,
      'Apellido 2': item.apellido2,
      'Nombres': item.nombres,
      'Especialidad': item.especialidad,
      'Estado': item.estado,
      'Hora': item.hora || '',
      'Tipo Marcado': item.tipo_marcado || ''
    }))

    // Convertir a CSV
    const headers = Object.keys(datosExport[0] || {})
    const csvContent = [
      headers.join(','),
      ...datosExport.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n')

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `asistencia_${fecha}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'presente':
        return <CheckCircle className="presente" size={20} />
      case 'ausente':
        return <XCircle className="ausente" size={20} />
      default:
        return <Clock className="pendiente" size={20} />
    }
  }

  const getStatusClass = (estado) => {
    return `status-badge status-${estado}`
  }

  return (
    <div className="container">
      <div className="header">
        <h1>📊 Panel de Control</h1>
        <p>Sistema de Asistencia - Seguimiento en Tiempo Real</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Empleados</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number presente">{stats.presentes}</div>
          <div className="stat-label">Presentes</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-number ausente">{stats.ausentes}</div>
          <div className="stat-label">Ausentes</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-number pendiente">{stats.pendientes}</div>
          <div className="stat-label">Pendientes</div>
        </div>
      </div>

      <div className="controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={20} />
          <input
            type="date"
            value={fecha}
            onChange={handleFechaChange}
            className="input"
          />
        </div>
        <button onClick={() => cargarReporte()} className="btn">
          <RefreshCw size={16} style={{ marginRight: '5px' }} />
          Actualizar
        </button>
        <button onClick={exportarExcel} className="btn btn-secondary">
          <Download size={16} style={{ marginRight: '5px' }} />
          Exportar CSV
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading">
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <p>Cargando reporte...</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>RUT</th>
                <th>Apellidos</th>
                <th>Nombres</th>
                <th>Especialidad</th>
                <th>Hora</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {reporte.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(item.estado)}
                      <span className={getStatusClass(item.estado)}>
                        {item.estado}
                      </span>
                    </div>
                  </td>
                  <td>{item.rut}</td>
                  <td>{item.apellido1} {item.apellido2}</td>
                  <td>{item.nombres}</td>
                  <td>{item.especialidad}</td>
                  <td>{item.hora || '-'}</td>
                  <td>
                    {item.tipo_marcado === 'qr' ? '📱 QR' : 
                     item.tipo_marcado === 'manual' ? '👆 Manual' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && reporte.length === 0 && (
        <div className="loading">
          <Users size={48} style={{ color: '#ccc', marginBottom: '15px' }} />
          <p>No hay datos disponibles para la fecha seleccionada</p>
        </div>
      )}
    </div>
  )
}

export default App
