import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importar Picker desde el paquete
import { useAuth } from './AuthContext';
import { useNavigation } from '@react-navigation/native';

const CrearSolicitudes = ({ navigation }: any) => {
  const [tiposSolicitudes, setTiposSolicitudes] = useState<any[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchTiposSolicitudes = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://uasdapi.ia3x.com/tipos_solicitudes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setTiposSolicitudes(data.data);
        } else {
          Alert.alert('Error', 'No se pudieron cargar los tipos de solicitudes.');
        }
      } catch (error) {
        Alert.alert('Error', 'Hubo un problema al cargar los tipos de solicitudes.');
      } finally {
        setLoading(false);
      }
    };

    fetchTiposSolicitudes();
  }, [authToken]);

  const enviarSolicitud = async () => {
    if (!selectedTipo || !descripcion.trim()) {
      Alert.alert('Error', 'Debes seleccionar un tipo de solicitud y llenar la descripción.');
      return;
    }

    try {
      const response = await fetch('https://uasdapi.ia3x.com/crear_solicitud', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: selectedTipo,
          descripcion: descripcion.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        Alert.alert('Éxito', 'La solicitud fue creada exitosamente.');
        navigation.navigate('Solicitudes' as never);
      } else {
        Alert.alert('Error', data.message || 'No se pudo crear la solicitud.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al enviar la solicitud.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.label}>Tipo de Solicitud</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTipo}
              onValueChange={(itemValue) => setSelectedTipo(itemValue)}
            >
              <Picker.Item label="Seleccione un tipo" value={null} />
              {tiposSolicitudes.map((tipo) => (
                <Picker.Item key={tipo.codigo} label={tipo.descripcion} value={tipo.codigo} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe la descripción"
            multiline
            value={descripcion}
            onChangeText={setDescripcion}
          />

          <TouchableOpacity style={styles.enviarButton} onPress={enviarSolicitud}>
            <Text style={styles.enviarButtonText}>Enviar Solicitud</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  enviarButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  enviarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CrearSolicitudes;
