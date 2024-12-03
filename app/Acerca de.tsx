import React from 'react';
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const developers = [
  {
    name: 'Nicol Cuello',
    matricula: '2021-1853',
    bio: 'Ingeniera de software enfocada en el desarrollo de soluciones eficientes y escalables. Siempre buscando nuevos desafíos.',
    photo: require('../assets/images/nicol.jpg'), 
  },
  {
    name: 'Jeison Infante',
    matricula: '2022-0250',
    bio: 'Entusiasta de la inteligencia artificial y el machine learning. Disfruta de la programación y la enseñanza.',
     photo: require('../assets/images/jeison2.jpg'), 
  },

  { 
    name: 'Jandy Mercedes',
    matricula: '2022-0294',
    bio: 'Desarrollador móvil con experiencia en React Native. Apasionado por la tecnología y el aprendizaje continuo.',
    photo: require('../assets/images/jandy.jpg'), 
  },
  {
    name: 'Edward Sánchez',
    matricula: '2021-0081',
    bio: 'Especialista en interfaces de usuario y diseño de experiencias. Comprometido con crear aplicaciones accesibles y funcionales.',
    photo: require('../assets/images/edward.jpg'), 
  },
];

export default function Acercade() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Acerca de Nosotros
      </ThemedText>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {developers.map((dev, index) => (
          <View key={index} style={styles.card}>
            <Image source={dev.photo} style={styles.photo} />
            <Text style={styles.name}>{dev.name}</Text>
            <Text style={styles.matricula}>Matrícula: {dev.matricula}</Text>
            <Text style={styles.bio}>{dev.bio}</Text>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#005BAC', // Azul de la UASD
    padding: 16,
  },
  title: {
    color: '#FFFFFF', // Blanco
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF', // Blanco
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005BAC',
    marginBottom: 5,
  },
  matricula: {
    fontSize: 16,
    color: '#005BAC',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
});