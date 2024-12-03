import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Alert,
    Modal,
    TouchableOpacity,
    Button,
} from 'react-native';
import { useAuth } from './AuthContext';
import { ActivityIndicator } from 'react-native';

const PreseleccionarMateria = () => {
    const [preseleccion, setPreseleccion] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPreseleccion, setSelectedPreseleccion] = useState<any | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchPreseleccion = async () => {
            try {
                const response = await fetch('https://uasdapi.ia3x.com/materias_disponibles', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Verifica si es un arreglo
                if (Array.isArray(data)) {
                    setPreseleccion(data);
                } else {
                    throw new Error('La API devolvió un formato inesperado.');
                }
            } catch (error) {
                Alert.alert('Error', 'No se pudieron cargar las materias disponibles.');
            } finally {
                setLoading(false);
            }
        };

        fetchPreseleccion();
    }, [authToken]);



    const handleAgregarMateria = async (materia: any) => {
        try {
            console.log('Materia enviada:', materia.nombre); // Verificar el nombre enviado

            const response = await fetch('https://uasdapi.ia3x.com/preseleccionar_materia', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(materia.codigo),
            });

            console.log('Response status:', response.status);

            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok && data.success) {
                Alert.alert('Éxito', `La materia "${materia.nombre}" fue preseleccionada exitosamente.`);
            } else if (data.error === "La materia ya está preseleccionada") {
                Alert.alert('Atención', 'La materia ya ha sido preseleccionada.');
            } else {
                Alert.alert('Error', data.message || 'No se pudo preseleccionar la materia.');
            }
        } catch (error) {

        } finally {
            setIsModalVisible(false);
        }
    };



    const renderPreseleccion = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                style={styles.eventoCard}
                onPress={() => {
                    setSelectedPreseleccion(item);
                    setIsModalVisible(true);
                }}
            >
                <Text style={styles.titulo}>{item.nombre}</Text>
                <Text style={styles.descripcion}>Horario: {item.horario}</Text>
                <Text style={styles.descripcion}>Aula: {item.aula}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={preseleccion}
                    renderItem={renderPreseleccion}
                    keyExtractor={(item) => item.codigo}
                />
            )}

            {selectedPreseleccion && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>¿Deseas agregar esta materia?</Text>
                            <Text style={styles.modalText}>Materia: {selectedPreseleccion.nombre}</Text>
                            <View style={styles.modalActions}>
                                <Button
                                    title="Cancelar"
                                    onPress={() => setIsModalVisible(false)}
                                    color="red"
                                />
                                <Button
                                    title="Aceptar"
                                    onPress={() => handleAgregarMateria(selectedPreseleccion)}
                                    color="green"
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default PreseleccionarMateria;
