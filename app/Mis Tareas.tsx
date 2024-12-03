import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useAuth } from './AuthContext';
import * as Notifications from 'expo-notifications';

const MisTareas = () => {
  const [tareas, setTareas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await fetch('https://uasdapi.ia3x.com/tareas', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setTareas(data);
        programarNotificaciones(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las tareas.');
      } finally {
        setLoading(false);
      }
    };

    fetchTareas();
  }, [authToken]);

  const programarNotificaciones = async (tareas: any[]) => {
    for (let tarea of tareas) {
      if (!tarea.completada) {
        const fechaVencimiento = new Date(tarea.fechaVencimiento);
        const ahora = new Date();
        const diferencia = fechaVencimiento.getTime() - ahora.getTime();
        
        // Si la tarea vence en las próximas 24 horas
        if (diferencia > 0 && diferencia <= 24 * 60 * 60 * 1000) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Recordatorio de Tarea',
              body: `La tarea "${tarea.titulo}" está próxima a vencer.`,
            },
            trigger: fechaVencimiento,
          });
        }
      }
    }
  };

  const renderTarea = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={[
          styles.tareaCard,
          item.completada ? styles.tareaCompletada : styles.tareaPendiente,
        ]}
        onPress={() =>
          Alert.alert(
            'Enlace al Aula Virtual',
            'Abrirás el aula virtual para esta tarea.',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'Abrir',
                onPress: () => {
                  Linking.openURL('https://plataformavirtual.itla.edu.do/')
                    .catch(() => {
                      Alert.alert('Error', 'No se pudo abrir el enlace al aula virtual.');
                    });
                },
              },
            ]
          )
        }
      >
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={styles.fecha}>
          {new Date(item.fechaVencimiento).toLocaleString()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={tareas}
          renderItem={renderTarea}
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
  tareaCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  tareaPendiente: {
    backgroundColor: '#f5f5f5',
  },
  tareaCompletada: {
    backgroundColor: '#d3ffd3',
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
    fontStyle: 'italic',
    color: '#555',
  },
});

export default MisTareas;
