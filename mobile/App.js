import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.1.100:3000/api'; // Cambiar por tu IP local

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('lista'); // 'lista' o 'camera'
  const [asistencias, setAsistencias] = useState({});

  useEffect(() => {
    getCameraPermissions();
    cargarEmpleados();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const cargarEmpleados = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/empleados`);
      setEmpleados(response.data);
      
      // Cargar asistencias del día
      const hoy = new Date().toISOString().split('T')[0];
      const reporteResponse = await axios.get(`${API_BASE_URL}/reporte-asistencias?fecha=${hoy}`);
      const reporte = reporteResponse.data;
      
      const asistenciasMap = {};
      reporte.forEach(item => {
        asistenciasMap[item.rut] = item.estado;
      });
      setAsistencias(asistenciasMap);
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la lista de empleados');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/marcar-asistencia-qr`, {
        qrData: data
      });
      
      if (response.data.empleado) {
        const empleado = response.data.empleado;
        Alert.alert(
          '✅ Asistencia Registrada',
          `${empleado.nombres} ${empleado.apellido1} ${empleado.apellido2}\nRUT: ${empleado.rut}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setScanned(false);
                cargarEmpleados(); // Recargar para actualizar estado
              }
            }
          ]
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al procesar el QR';
      Alert.alert('❌ Error', errorMessage, [
        {
          text: 'OK',
          onPress: () => setScanned(false)
        }
      ]);
    }
  };

  const marcarAsistenciaManual = async (empleado) => {
    try {
      await axios.post(`${API_BASE_URL}/marcar-asistencia`, {
        empleado_id: empleado.id,
        tipo_marcado: 'manual'
      });
      
      Alert.alert(
        '✅ Asistencia Registrada',
        `${empleado.nombres} ${empleado.apellido1} ${empleado.apellido2}`,
        [{ text: 'OK', onPress: () => cargarEmpleados() }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo marcar la asistencia');
    }
  };

  const getEstadoColor = (rut) => {
    const estado = asistencias[rut];
    switch (estado) {
      case 'presente':
        return '#28a745';
      case 'ausente':
        return '#dc3545';
      default:
        return '#ffc107';
    }
  };

  const getEstadoIcon = (rut) => {
    const estado = asistencias[rut];
    switch (estado) {
      case 'presente':
        return 'checkmark-circle';
      case 'ausente':
        return 'close-circle';
      default:
        return 'time';
    }
  };

  const renderEmpleado = ({ item }) => {
    const estado = asistencias[item.rut] || 'pendiente';
    const yaMarcado = estado === 'presente';
    
    return (
      <View style={[styles.empleadoCard, { borderLeftColor: getEstadoColor(item.rut) }]}>
        <View style={styles.empleadoInfo}>
          <View style={styles.empleadoHeader}>
            <Text style={styles.empleadoNombre}>
              {item.nombres} {item.apellido1} {item.apellido2}
            </Text>
            <Ionicons 
              name={getEstadoIcon(item.rut)} 
              size={24} 
              color={getEstadoColor(item.rut)} 
            />
          </View>
          <Text style={styles.empleadoRut}>RUT: {item.rut}</Text>
          <Text style={styles.empleadoEspecialidad}>{item.especialidad}</Text>
        </View>
        
        {!yaMarcado && (
          <TouchableOpacity
            style={styles.btnMarcar}
            onPress={() => marcarAsistenciaManual(item)}
          >
            <Ionicons name="checkmark" size={20} color="white" />
            <Text style={styles.btnMarcarText}>Marcar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se otorgaron permisos de cámara</Text>
        <TouchableOpacity style={styles.btn} onPress={getCameraPermissions}>
          <Text style={styles.btnText}>Solicitar Permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando empleados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Sistema de Asistencia</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerBtn, currentView === 'lista' && styles.headerBtnActive]}
            onPress={() => setCurrentView('lista')}
          >
            <Ionicons name="list" size={24} color="white" />
            <Text style={styles.headerBtnText}>Lista</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerBtn, currentView === 'camera' && styles.headerBtnActive]}
            onPress={() => setCurrentView('camera')}
          >
            <Ionicons name="qr-code" size={24} color="white" />
            <Text style={styles.headerBtnText}>QR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {currentView === 'lista' ? (
        <View style={styles.listaContainer}>
          <FlatList
            data={empleados}
            renderItem={renderEmpleado}
            keyExtractor={(item) => item.id.toString()}
            style={styles.lista}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barCodeScannerSettings={{
              barCodeTypes: ['qr'],
            }}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.scanArea}>
                <View style={styles.scanCorner} />
                <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
                <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
                <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
              </View>
              <Text style={styles.scanText}>
                Apunta la cámara al código QR de la cédula
              </Text>
              {scanned && (
                <TouchableOpacity
                  style={styles.btnScanAgain}
                  onPress={() => setScanned(false)}
                >
                  <Text style={styles.btnScanAgainText}>Escanear de nuevo</Text>
                </TouchableOpacity>
              )}
            </View>
          </Camera>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  headerBtnText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  listaContainer: {
    flex: 1,
    padding: 20,
  },
  lista: {
    flex: 1,
  },
  empleadoCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    borderLeftWidth: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  empleadoInfo: {
    flex: 1,
  },
  empleadoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  empleadoNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  empleadoRut: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  empleadoEspecialidad: {
    fontSize: 14,
    color: '#888',
  },
  btnMarcar: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnMarcarText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#667eea',
    borderWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  scanCornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  scanCornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  scanCornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  btnScanAgain: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  btnScanAgainText: {
    color: 'white',
    fontWeight: '500',
  },
  btn: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    fontSize: 16,
  },
});
