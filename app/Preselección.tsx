import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import { useAuth } from './AuthContext';
import MapView, { Marker } from 'react-native-maps';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Preseleccion = () => {
  const [preseleccion, setPreseleccion] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreseleccion, setSelectedPreseleccion] = useState<any | null>(null);
  const { authToken } = useAuth();
  const navigation = useNavigation();
  useEffect(() => {
    const fetchPreseleccion = async () => {
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
        Alert.alert('Error', 'No se pudieron cargar los eventos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreseleccion();
  }, [authToken]);

  // Función para renderizar cada item de la lista
  const renderPreseleccion = ({ item }: { item: any }) => {
    return (
      <View style={styles.eventoCard} onTouchEnd={() => setSelectedPreseleccion(item)}>
        <Text style={styles.titulo}>{item.nombre}</Text>
        <Text style={styles.descripcion}>Aula: {item.aula}</Text>
        <Text style={styles.lugar}>{item.ubicacion}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title="Ir a Preseleccionar Materia"
        onPress={() => navigation.navigate('PreseleccionarMateria' as never)}
      />
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
            <>
              <View style={styles.mapContainer}>
                <Text style={styles.mapTitle}>Ubicación de: {selectedPreseleccion.nombre}</Text>
                <MapView
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
            </>
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
  },
});

export default Preseleccion;
