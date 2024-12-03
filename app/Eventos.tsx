import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useAuth } from './AuthContext'; // Asegúrate de importar el contexto
import MapView, { Marker } from 'react-native-maps'; // Importar el MapView y Marker de react-native-maps
import { ActivityIndicator } from 'react-native';

const EventosScreen = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null); // Para mostrar el mapa solo cuando el evento es seleccionado

  const { authToken } = useAuth(); // Obtener el token del contexto de autenticación

  useEffect(() => {
    // Función para obtener los eventos
    const fetchEventos = async () => {
      try {
        const response = await fetch('https://uasdapi.ia3x.com/eventos', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`, // Enviar el authToken en el header
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setEventos(data); // Establecer los eventos
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los eventos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventos(); // Llamada a la API
  }, [authToken]);

  // Función para renderizar cada item de la lista
  const renderEvento = ({ item }) => {
    return (
      <View style={styles.eventoCard} onTouchEnd={() => setSelectedEvent(item)}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={styles.fecha}>{new Date(item.fechaEvento).toLocaleString()}</Text>
        <Text style={styles.lugar}>{item.lugar}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={eventos}
            renderItem={renderEvento}
            keyExtractor={(item) => item.id.toString()}
          />
          {selectedEvent && (
            <View style={styles.mapContainer}>
              <Text style={styles.mapTitle}>Ubicación de: {selectedEvent.titulo}</Text>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: parseFloat(selectedEvent.coordenadas.split(',')[0]),
                  longitude: parseFloat(selectedEvent.coordenadas.split(',')[1]),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(selectedEvent.coordenadas.split(',')[0]),
                    longitude: parseFloat(selectedEvent.coordenadas.split(',')[1]),
                  }}
                  title={selectedEvent.titulo}
                  description={selectedEvent.descripcion}
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
  fecha: {
    fontSize: 12,
    color: '#888',
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
  },
});

export default EventosScreen;
