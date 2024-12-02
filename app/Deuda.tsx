import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button , Linking} from 'react-native';
import { useAuth } from './AuthContext';  // Asegúrate de tener el hook de AuthContext para obtener el authToken

const DeudaScreen = () => {
  const { authToken } = useAuth();  // Obtener el authToken desde el contexto
  const [deuda, setDeuda] = useState('');  // Estado para almacenar la deuda
  const [loading, setLoading] = useState(true);  // Estado para controlar la carga
  const [error, setError] = useState(null);  // Estado para manejar errores

  // Hacer la llamada a la API
  useEffect(() => {
    const fetchDeuda = async () => {
      try {
        const response = await fetch('https://uasdapi.ia3x.com/deudas', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,  // Enviar el authToken en el header
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }

        const jsonResponse = await response.json();
        console.log(jsonResponse);
        // Almacenar los datos de la deuda si la respuesta es exitosa
        setDeuda(jsonResponse[0]);
      } catch (err) {
        console.error('Error en la solicitud:', err);
      } finally {
        setLoading(false);  // Terminar la carga cuando la solicitud termine
      }
    };

    fetchDeuda();
  }, [authToken]);  // Hacer la llamada cuando el authToken cambie

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Si hubo un error, mostrar el mensaje de error
  if (error) {
    return <Text>{error}</Text>;
  }

  // Si la deuda fue cargada exitosamente, mostrar los datos
  return (
    <View style={styles.container}>
      {deuda ? (
        <View style={styles.card}>
          <Text style={styles.title}>Deuda</Text>
          <Text style={styles.subtitles}>Usuario ID:  <Text style={styles.text}>{deuda.usuarioId} </Text> </Text>
          <Text style={styles.subtitles}>Monto: <Text style={styles.text}>{deuda.monto} </Text> </Text>
          <Text style={styles.subtitles}>Pagada: <Text style={styles.text}> {deuda.pagada ? 'Sí' : 'No'} </Text></Text>
          <Text style={styles.subtitles}>Última actualización:<Text style={styles.text}> {deuda.fechaActualizacion} </Text> </Text>
          <Button title='Pagar Ya !' onPress={() => Linking.openURL('https://uasd.edu.do/servicios/pago-en-linea/')} />
        </View>
      ) : (
        <Text>No se encontraron datos de deuda</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitles: {
    fontSize: 16,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    color: 'blue'
  },
});

export default DeudaScreen;
