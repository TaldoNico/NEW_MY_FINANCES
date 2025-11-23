// Arquivo: app/(tabs)/goals.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Importe SafeAreaView e Link do Expo Router
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  // Mantenha os estilos da resposta anterior
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', 
  },
  content: {
    padding: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
    marginTop: 5,
  },
  addButtonContainer: {
    marginTop: 20,
    width: 100,
    height: 100,
    backgroundColor: '#3A3A3A', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  addButtonText: {
    fontSize: 50,
    color: '#FFFFFF',
  },
});

export default function GoalsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Text style={styles.headerTitle}>Minhas Metas</Text>

      <View style={styles.content}>
        {/*
          Usamos o componente <Link> para navegar.
          O caminho é baseado no nome do arquivo: newgoals.tsx -> /newgoals
          Se o arquivo estivesse em (tabs)/newgoals.tsx, o caminho seria /newgoals.
          Se o arquivo estiver na raiz (app/newgoals.tsx), o caminho é /newgoals.
        */}
        <Link 
            href="/newgoals" // Ajuste o caminho se newgoals.tsx estiver em outra pasta
            asChild // Necessário para usar TouchableOpacity como filho
        >
            <TouchableOpacity style={styles.addButtonContainer}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}