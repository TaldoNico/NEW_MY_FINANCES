// Arquivo: app/(tabs)/goals.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalsScreen() {
  const [goals, setGoals] = useState([]);

  // Carregar metas sempre que abrir a tela
  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  const loadGoals = async () => {
    try {
      const saved = await AsyncStorage.getItem("goals");
      if (saved) {
        setGoals(JSON.parse(saved));
      }
    } catch (err) {
      console.log("Erro ao carregar metas:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      
      <Text style={styles.headerTitle}>Minhas Metas</Text>

      <View style={styles.content}>
        
        {/* Card para adicionar nova meta */}
        <Link href="/newgoals" asChild>
          <TouchableOpacity style={styles.addButtonContainer}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </Link>

        {/* Lista de metas */}
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalCard}>
            <Text style={styles.goalText}>{goal.titulo}</Text>
          </View>
        ))}

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    marginBottom: 15,
  },

  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },

  addButtonContainer: {
    width: 110,
    height: 110,
    backgroundColor: "#2F2F2F",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },

  addButtonText: {
    fontSize: 55,
    color: "#FFFFFF",
    marginTop: -4,
  },

  goalCard: {
    width: 110,
    height: 110,
    backgroundColor: "#3A3A3A",
    borderRadius: 12,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },

  goalText: {
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  }
});
