import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, ScrollView, StyleSheet } from 'react-native';

const ResetPassword = () => {
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!usuario || !email) {
      Alert.alert("Error", "Los campos de usuario y email no pueden estar vacíos");
      return;
    }

    const data = {
      usuario: usuario,
      email: email
    };

    try {
      const response = await fetch('https://uasdapi.ia3x.com/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'La solicitud de restablecimiento de contraseña fue exitosa.');
        Alert.alert(`${responseData.message}`)
      } else {
        Alert.alert('Error', responseData.message || 'Hubo un problema con la solicitud.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un error al enviar la solicitud.');
      console.error('Error al hacer la solicitud', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Restablecer Contraseña</Text>

      <Text style={styles.label}>Usuario</Text>
      <TextInput
        value={usuario}
        onChangeText={setUsuario}
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <Button title="Restablecer Contraseña" onPress={handleResetPassword} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
});

export default ResetPassword;
