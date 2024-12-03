import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Hook para la navegación
import { useAuth } from './AuthContext';  // Usamos el hook para acceder al contexto

const SalirScreen = () => {
  const { logout } = useAuth();  // Función para cerrar sesión
  const navigation = useNavigation();  // Usamos el hook de navegación

  const handleLogout = async () => {
    try {
      await logout();  // Llama a la función de logout del contexto
      Alert.alert('Has cerrado sesión correctamente');
      // navigation.navigate("Login");  // Usamos `navigate` para ir al login
    } catch (error) {
      console.error('Error al cerrar sesión', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión correctamente');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Seguro que deseas cerrar sesión?</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default SalirScreen;
