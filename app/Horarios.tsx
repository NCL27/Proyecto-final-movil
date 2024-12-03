import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { ActivityIndicator } from 'react-native';
import { useAuth } from './AuthContext';

const Horarios = () => {
  const [horarios, setHorarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHorario, setSelectedHorario] = useState<any | null>(null);
  const { authToken } = useAuth();
  const mapRef = useRef<MapView>(null);

  const mapStyle = [
    {
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#616161' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#c9c9c9' }],
    },
  ];

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await fetch('https://uasdapi.ia3x.com/horarios', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setHorarios(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los horarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchHorarios();
  }, [authToken]);

  const handlePressHorario = (horario: any) => {
    setSelectedHorario(horario);

    // Si hay un mapa visible, navega al aula automáticamente
    if (mapRef.current) {
      const [latitude, longitude] = horario.ubicacion.split(',').map(Number);
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000 // Duración de la animación (1 segundo)
      );
    }
  };

  const renderHorario = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.horarioCard}
      onPress={() => handlePressHorario(item)}
    >
      <Text style={styles.materia}>Materia: {item.materia}</Text>
      <Text style={styles.aula}>Aula: {item.aula}</Text>
      <Text style={styles.fecha}>
        Fecha y Hora: {new Date(item.fechaHora).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Lista de horarios */}
          <FlatList
            data={horarios}
            renderItem={renderHorario}
            keyExtractor={(item) => item.id.toString()}
          />

          {/* Mapa con la ubicación del aula */}
          {selectedHorario && (
            <View style={styles.mapContainer}>
              <Text style={styles.mapTitle}>
                Ubicación de: {selectedHorario.materia}
              </Text>
              <MapView
                ref={mapRef}
                style={styles.map}
                customMapStyle={mapStyle}
                initialRegion={{
                  latitude: parseFloat(selectedHorario.ubicacion.split(',')[0]),
                  longitude: parseFloat(selectedHorario.ubicacion.split(',')[1]),
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(selectedHorario.ubicacion.split(',')[0]),
                    longitude: parseFloat(selectedHorario.ubicacion.split(',')[1]),
                  }}
                  title={selectedHorario.materia}
                  description={`Aula: ${selectedHorario.aula}`}
                />
              </MapView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedHorario(null)}
              >
                <Text style={styles.closeButtonText}>Cerrar Mapa</Text>
              </TouchableOpacity>
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
  horarioCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  materia: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  aula: {
    fontSize: 14,
    marginVertical: 5,
  },
  fecha: {
    fontSize: 12,
    color: '#555',
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
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
export default Horarios;
