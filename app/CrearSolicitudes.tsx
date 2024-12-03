import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SolicitudesScreen = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  // Obtener el token de autorización
  const getAuthToken = async () => {
    return await AsyncStorage.getItem('@auth_token');
  };

  // Obtener los tipos de solicitudes desde el servidor
  const fetchSolicitudes = async () => {
    const token = await getAuthToken();
    try {
      const response = await fetch('https://uasdapi.ia3x.com/tipos_solicitudes', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSolicitudes(data.data);
      } else {
        Alert.alert('Error', data.message || 'No se pudieron cargar las solicitudes');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  // Manejar la selección de una solicitud
  const handleSelectSolicitud = (solicitud) => {
    setSelectedSolicitud({
      tipo: solicitud.codigo,
      descripcion: solicitud.descripcion,
    });
  };

  // Enviar la solicitud seleccionada
  const handleGuardar = async () => {
    if (!selectedSolicitud) {
      Alert.alert('Error', 'Por favor selecciona una solicitud');
      return;
    }

    const token = await getAuthToken();
    try {
      const response = await fetch('https://uasdapi.ia3x.com/crear_solicitud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedSolicitud),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Éxito', 'La solicitud se ha creado correctamente');
        setSelectedSolicitud(null);
      } else {
        Alert.alert('Error', data.message || 'No se pudo crear la solicitud');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Selecciona una Solicitud</Text>

      {solicitudes.length > 0 ? (
        <FlatList
          data={solicitudes}
          keyExtractor={(item) => item.codigo.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.solicitudItem,
                selectedSolicitud?.tipo === item.codigo && styles.selectedItem,
              ]}
              onPress={() => handleSelectSolicitud(item)}
            >
              <Text style={styles.solicitudText}>{item.descripcion}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.loadingText}>Cargando solicitudes...</Text>
      )}

      <Button title="Guardar" onPress={handleGuardar} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  solicitudItem: {
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedItem: {
    backgroundColor: '#cce5ff',
    borderColor: '#007bff',
  },
  solicitudText: {
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default SolicitudesScreen;
