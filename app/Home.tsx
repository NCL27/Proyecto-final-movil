import React from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const Home: React.FC = () => {
  return (
    <ThemedView style={styles.container}>
      
      {/* Imagen Representativa */}
      <ThemedView style={styles.imageContainer}>
          <Image
            source={require('../assets/images/LOGO-UASD.jpg')} // Ruta relativa a la imagen en assets
            style={styles.image}
          />
        </ThemedView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <ThemedText type="title" style={styles.header}>
          Universidad Autónoma de Santo Domingo (UASD)
        </ThemedText>

        {/* Misión */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Misión
          </ThemedText>
          <ThemedText type="default" style={styles.sectionText}>
            Formar críticamente profesionales, investigadores y técnicos en las ciencias, las humanidades y las artes necesarias y eficientes para coadyuvar a las transformaciones que demanda el desarrollo nacional sostenible.
          </ThemedText>
        </ThemedView>

        {/* Visión */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Visión
          </ThemedText>
          <ThemedText type="default" style={styles.sectionText}>
            Ser una institución de excelencia y liderazgo académico, gestionada con eficiencia y acreditada nacional e internacionalmente.
          </ThemedText>
        </ThemedView>

        {/* Valores */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Valores
          </ThemedText>
          <ThemedText type="default" style={styles.sectionText}>
            Solidaridad, Transparencia, Verdad, Igualdad, Libertad, Equidad, Tolerancia, Responsabilidad, Convivencia, y Paz.
          </ThemedText>
        </ThemedView>

        {/* Imagen Representativa */}
        <ThemedView style={styles.imageContainer}>
          <Image
            source={require('../assets/images/UASD-13.jpg')} // Ruta relativa a la imagen en assets
            style={styles.image}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
  },
});
