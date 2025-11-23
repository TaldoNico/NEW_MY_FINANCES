// Arquivo: app/(tabs)/newgoals.tsx

import React, { useState } from 'react';
// IMPORTANTE: StyleSheet precisa ser importado
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. O OBJETO 'styles' DEVE SER DEFINIDO AQUI!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', 
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  inputArea: {
    fontSize: 18,
    color: '#A9A9A9', 
  },
  hintText: {
    fontSize: 16,
    color: '#A9A9A9', 
    marginTop: -5, 
  }
});

export default function NewGoalScreen() { 
  const [goalTitle, setGoalTitle] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.titleLabel}>*Título da Meta*</Text>
        
        <TextInput
          style={styles.inputArea} // <--- SEU COMPONENTE ESTÁ USANDO 'styles.inputArea'
          placeholder="Digite aqui"
          placeholderTextColor="#A9A9A9"
          value={goalTitle}
          onChangeText={setGoalTitle}
          multiline={true} 
          autoFocus={true} 
          keyboardAppearance="dark" 
        />
      </View>
    </SafeAreaView>
  );
}