// Arquivo: app/(tabs)/newgoals.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewGoalScreen() {
  const router = useRouter();

  const [goalTitle, setGoalTitle] = useState("");
  const [goalValue, setGoalValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  async function handleSave() {
    if (!goalTitle.trim()) {
      console.log("Título vazio!");
      return;
    }

    const newGoal = {
      titulo: goalTitle,
      valor_total: goalValue,
      valor_atual: currentValue,
      prazo: deadline,
      descricao: description,
    };

    try {
      const saved = await AsyncStorage.getItem("goals");
      const goals = saved ? JSON.parse(saved) : [];

      goals.push(newGoal);

      await AsyncStorage.setItem("goals", JSON.stringify(goals));

      router.back();
    } catch (err) {
      console.log("Erro ao salvar meta:", err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.content}>

          <Text style={styles.label}>Título da Meta *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Comprar um computador"
            placeholderTextColor="#777"
            value={goalTitle}
            onChangeText={setGoalTitle}
            autoFocus={true}
            keyboardAppearance="dark"
          />

          <Text style={styles.label}>Valor Total da Meta</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2500"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={goalValue}
            onChangeText={setGoalValue}
          />

          <Text style={styles.label}>Valor Atual</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 300"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={currentValue}
            onChangeText={setCurrentValue}
          />

          <Text style={styles.label}>Prazo (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 12/03/2025"
            placeholderTextColor="#777"
            value={deadline}
            onChangeText={setDeadline}
          />

          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={styles.inputBig}
            placeholder="Escreva mais detalhes..."
            placeholderTextColor="#777"
            multiline={true}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Meta</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  content: {
    padding: 20,
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    marginTop: 15,
  },

  input: {
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#444",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 17,
  },

  inputBig: {
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#444",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    minHeight: 90,
    fontSize: 17,
  },

  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
