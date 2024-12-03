import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from './AuthContext';

const Solicitudes = ({ navigation }: any) => {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://uasdapi.ia3x.com/mis_solicitudes', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setSolicitudes(data.data);
      } else {
        Alert.alert('Error', 'No se pudieron cargar las solicitudes.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  };

  // Usar useFocusEffect para recargar datos cuando la pantalla entra en foco
  useFocusEffect(
    React.useCallback(() => {
      fetchSolicitudes();
    }, [authToken])
  );

  const renderSolicitud = ({ item }: { item: any }) => {
    return (
      <View style={styles.solicitudCard}>
        <Text style={styles.tipo}>Tipo: {item.tipo}</Text>
        <Text style={styles.descripcion}>Descripción: {item.descripcion}</Text>
        <Text style={styles.estado}>Estado: {item.estado}</Text>
        <Text style={styles.fecha}>
          Fecha de Solicitud: {new Date(item.fechaSolicitud).toLocaleString()}
        </Text>
        {item.fechaRespuesta && (
          <>
            <Text style={styles.fecha}>
              Fecha de Respuesta: {new Date(item.fechaRespuesta).toLocaleString()}
            </Text>
            <Text style={styles.respuesta}>Respuesta: {item.respuesta}</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Botón para crear solicitudes */}
      <TouchableOpacity
        style={styles.crearButton}
        onPress={() => navigation.navigate('CrearSolicitudes')}
      >
        <Text style={styles.crearButtonText}>Crear Solicitudes</Text>
      </TouchableOpacity>

      {/* Lista de solicitudes */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={solicitudes}
          renderItem={renderSolicitud}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  crearButton: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  crearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  solicitudCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  tipo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 14,
    marginVertical: 5,
  },
  estado: {
    fontSize: 14,
    color: '#007bff',
  },
  fecha: {
    fontSize: 12,
    color: '#555',
  },
  respuesta: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default Solicitudes;
