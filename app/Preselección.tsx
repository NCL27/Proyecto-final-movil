import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from './AuthContext';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Preseleccion = () => {
  const [preseleccion, setPreseleccion] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreseleccion, setSelectedPreseleccion] = useState<any | null>(null);
  const { authToken } = useAuth();
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  
  useFocusEffect(
    React.useCallback(() => {
      fetchPreseleccion();
    }, [])
  );

  const fetchPreseleccion = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://uasdapi.ia3x.com/ver_preseleccion', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setPreseleccion(data.data);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectPreseleccion = (item: any) => {
    setSelectedPreseleccion(item);

    // Si hay un mapa visible, navega automáticamente al aula seleccionada
    if (mapRef.current) {
      const [latitude, longitude] = item.ubicacion.split(',').map(Number);
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000 // Duración de la animación en milisegundos
      );
    }
  };

  const renderPreseleccion = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.eventoCard}
      onPress={() => handleSelectPreseleccion(item)}
    >
      <Text style={styles.titulo}>{item.nombre}</Text>
      <Text style={styles.descripcion}>Aula: {item.aula}</Text>
      <Text style={styles.lugar}>{item.ubicacion}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.crearButton}
        onPress={() => navigation.navigate('PreseleccionarMateria' as never)}
      >
        <Text style={styles.crearButtonText}>Ir a Preseleccionar Materia</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={preseleccion}
            renderItem={renderPreseleccion}
            keyExtractor={(item) => item.codigo}
          />
          {selectedPreseleccion && (
            <View style={styles.mapContainer}>
              <Text style={styles.mapTitle}>
                Ubicación de: {selectedPreseleccion.nombre}
              </Text>
              <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: parseFloat(selectedPreseleccion.ubicacion.split(',')[0]),
                  longitude: parseFloat(selectedPreseleccion.ubicacion.split(',')[1]),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(selectedPreseleccion.ubicacion.split(',')[0]),
                    longitude: parseFloat(selectedPreseleccion.ubicacion.split(',')[1]),
                  }}
                  title={selectedPreseleccion.nombre}
                  description={selectedPreseleccion.aula}
                />
              </MapView>
            </View>
          )}
        </>
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
  eventoCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 14,
    marginVertical: 5,
  },
  lugar: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  mapContainer: {
    marginTop: 20,
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapTitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },  crearButton: {
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
});

export default Preseleccion;
