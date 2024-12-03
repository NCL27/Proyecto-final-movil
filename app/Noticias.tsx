import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, Alert , Linking } from 'react-native';
import { useAuth } from './AuthContext';  // Asegúrate de tener el contexto de autenticación

const Noticias = () => {
  const { authToken } = useAuth();  // Obtener el authToken desde el contexto de autenticación
  const [noticias, setNoticias] = useState([]);  // Estado para almacenar las noticias
  const [loading, setLoading] = useState(true);  // Estado para controlar la carga
  const [error, setError] = useState(null);  // Estado para manejar posibles errores

  // Hacer la llamada a la API
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await fetch('https://uasdapi.ia3x.com/noticias', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,  // Enviar el authToken en el header
            'Content-Type': 'application/json',
          },
        });

        const jsonResponse = await response.json();
         
        if (jsonResponse.success) {
          setNoticias(jsonResponse.data);  // Almacenar las noticias si la respuesta es exitosa
        
        } else {
          Alert.alert('Error', jsonResponse.message || 'Inicio de sesión fallido');
          console.log(jsonResponse.message)
          console.log(authToken);
        }
      } catch (err) {
        console.error('Error en la solicitud:', err);

      } finally {
        setLoading(false);  // Cambiar el estado de carga cuando termine la solicitud
      }
    };

    fetchNoticias();
  }, [authToken]);  // La llamada solo se hace si el authToken cambia

  // Si hay un error o está cargando
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  // Renderizar cada noticia
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.img }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.url} onPress={() => Linking.openURL(item.url)}>
        Leer más
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={noticias}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  url: {
    color: '#0066cc',
    fontSize: 16,
  },
});

export default Noticias;
