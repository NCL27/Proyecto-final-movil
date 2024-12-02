import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Usando createDrawerNavigator directamente
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack'; // Importamos StackNavigator


import { useColorScheme } from '@/hooks/useColorScheme';
import Noticias from './Noticias';
import Horarios from './Horarios';
import Preseleccion from './Preselección';
import Deuda from './Deuda';
import Solicitudes from './Solicitudes';
import MisTareas from './Mis Tareas';
import Eventos from './Eventos';
import Videos from './Videos';
import Acercade from './Acerca de';
import SalirScreen from './Salir';
import Home from './Home';
import Login from './Login';
import Registrate from './Registrate';
import { AuthProvider, useAuth } from './AuthContext'; 
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();  // Creamos el Stack Navigator

// var isLogged: boolean = false;
SplashScreen.preventAutoHideAsync();

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};


 function AppNavigator() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { isLogged, checkSession } = useAuth();

  useEffect(() => {
    checkSession();  // Verificar si hay sesión cuando la app se monta
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isLogged ? (
        <Drawer.Navigator>
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{
              title: 'Home',
            }}
          />          
          <Drawer.Screen
            name="Noticias"
            component={Noticias}
            options={{
              title: 'Noticias',
            }}
          />
          <Drawer.Screen
            name="Horarios"
            component={Horarios}
            options={{
              title: 'Horarios',
            }}
          />
          <Drawer.Screen
            name="Preseleccion"
            component={Preseleccion}
            options={{
              title: 'Preselección',
            }}
          />
          <Drawer.Screen
            name="Deuda"
            component={Deuda}
            options={{
              title: 'Deuda',
            }}
          />
          <Drawer.Screen
            name="Solicitudes"
            component={Solicitudes}
            options={{
              title: 'Solicitudes',
            }}
          />
          <Drawer.Screen
            name="Mis Tareas"
            component={MisTareas}
            options={{
              title: 'Mis Tareas',
            }}
          />
          <Drawer.Screen
            name="Eventos"
            component={Eventos}
            options={{
              title: 'Eventos',
            }}
          />
          <Drawer.Screen
            name="Videos"
            component={Videos}
            options={{
              title: 'Videos',
            }}
          />
          <Drawer.Screen
            name="Acerca de"
            component={Acercade}
            options={{
              title: 'Acerca de',
            }}
          />
          <Drawer.Screen
            name="Salir"
            component={SalirScreen}
            options={{
              title: 'Salir',
            }}
          />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registrate" component={Registrate} />
      </Stack.Navigator>
      )}
      <StatusBar style="auto" />
      </ThemeProvider>
  );
}

export default App;