import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [authToken, setAuthToken] = useState(null);  // Agregar el estado para el authToken

  // Verificar la sesión cuando el proveedor se monta
  const checkSession = async () => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      setIsLogged(true);
      setAuthToken(token);
    }
  };


  // Iniciar sesión
  const login = () => {
    setIsLogged(true);
     checkSession();

  };

  // Cerrar sesión
  const logout = async () => {
    await AsyncStorage.removeItem('@auth_token');
    setIsLogged(false);
    setAuthToken(null)
  };

  return (
    <AuthContext.Provider value={{ isLogged, login, logout, checkSession, authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => useContext(AuthContext);
