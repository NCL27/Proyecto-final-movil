import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useAuth } from './AuthContext'; // Asegúrate de importar el contexto
import { WebView } from 'react-native-webview'; // Usamos WebView para incrustar el iframe de YouTube
import { ActivityIndicator } from 'react-native';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null); // Video seleccionado para mostrar

  const { authToken } = useAuth(); // Obtener el token del contexto de autenticación

  useEffect(() => {
    // Función para obtener los videos
    const fetchVideos = async () => {
      try {
        const response = await fetch('https://uasdapi.ia3x.com/videos', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`, // Enviar el authToken en el header
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setVideos(data); // Establecer los videos
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos(); // Llamada a la API
  }, [authToken]);

  // Función para renderizar cada video de la lista
  const renderVideo = ({ item }) => {
    return (
      <View style={styles.videoCard} onTouchEnd={() => setSelectedVideo(item)}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.fecha}>{new Date(item.fechaPublicacion).toLocaleString()}</Text>
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
            data={videos}
            renderItem={renderVideo}
            keyExtractor={(item) => item.id.toString()}
          />
          {selectedVideo && (
            <View style={styles.videoContainer}>
              <Text style={styles.videoTitle}>{selectedVideo.titulo}</Text>
              <WebView
                source={{
                  uri: `https://www.youtube.com/embed/${selectedVideo.url}`, // URL de video con embed
                }}
                style={styles.webView}
              />
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
  videoCard: {
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
  fecha: {
    fontSize: 12,
    color: '#888',
  },
  videoContainer: {
    marginTop: 20,
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoTitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  webView: {
    width: '100%',
    height: '100%',
  },
});

export default Videos;
