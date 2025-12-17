// app/goal_detail.tsx
// @ts-nocheck

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../services/firebase";
import { useStats } from "@/context/StatsContext";

const getGoalsStorageKey = () => {
  const user = auth.currentUser;
  if (!user) return "goals_guest";
  return `goals_${user.uid}`;
};

export default function GoalDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { stats, updateStats } = useStats();

  const index = Number(
    Array.isArray(params.index) ? params.index[0] : params.index
  );

  const [title, setTitle] = useState(String(params.titulo || ""));
  const [totalValue, setTotalValue] = useState(String(params.valor_total || ""));
  const [deadline, setDeadline] = useState(String(params.prazo || ""));
  const [description, setDescription] = useState(String(params.descricao || ""));
  const [currentValue, setCurrentValue] = useState(
    String(params.valor_atual || "0")
  );
  const [amountToAdd, setAmountToAdd] = useState("");
  const [movements, setMovements] = useState<any[]>([]);

  useEffect(() => {
    const loadMovements = async () => {
      const saved = await AsyncStorage.getItem(getGoalsStorageKey());
      const goals = saved ? JSON.parse(saved) : [];
      if (goals[index]?.movimentos) {
        setMovements(goals[index].movimentos);
      }
    };
    if (!isNaN(index)) loadMovements();
  }, [index]);

  const totalNumber = Number(totalValue.replace(",", "."));
  const currentNumber = Number(currentValue.replace(",", "."));
  const progress =
    totalNumber > 0
      ? Math.min(100, Math.max(0, (currentNumber / totalNumber) * 100))
      : 0;

  const handleSaveMeta = async () => {
    if (!title.trim()) {
      Alert.alert("Erro", "O título não pode ficar vazio.");
      return;
    }

    const saved = await AsyncStorage.getItem(getGoalsStorageKey());
    const goals = saved ? JSON.parse(saved) : [];

    if (!goals[index]) return;

    goals[index] = {
      ...goals[index],
      titulo: title,
      valor_total: totalValue,
      prazo: deadline,
      descricao: description,
    };

    await AsyncStorage.setItem(getGoalsStorageKey(), JSON.stringify(goals));
    Alert.alert("Sucesso", "Meta atualizada.");
  };

  const handleAddValue = async () => {
    if (!amountToAdd.trim()) return;

    const add = Number(amountToAdd.replace(",", "."));
    if (isNaN(add)) return;

    const newValue = currentNumber + add;

    const saved = await AsyncStorage.getItem(getGoalsStorageKey());
    const goals = saved ? JSON.parse(saved) : [];

    if (!goals[index]) return;

    const wasCompleted = currentNumber >= totalNumber;
    const willComplete = newValue >= totalNumber && totalNumber > 0;

    goals[index].valor_atual = String(newValue);
    goals[index].movimentos = goals[index].movimentos || [];
    goals[index].movimentos.push({
      valor: String(add),
      data: new Date().toISOString(),
    });

    await AsyncStorage.setItem(getGoalsStorageKey(), JSON.stringify(goals));

    setCurrentValue(String(newValue));
    setAmountToAdd("");
    setMovements((prev) => [...prev, { valor: String(add), data: new Date().toISOString() }]);

    if (!wasCompleted && willComplete) {
      updateStats({
        metasFinanceirasBatidas: stats.metasFinanceirasBatidas + 1,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>{title || "Meta"}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Título</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Valor total</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={totalValue}
            onChangeText={setTotalValue}
          />

          <Text style={styles.label}>Prazo</Text>
          <TextInput style={styles.input} value={deadline} onChangeText={setDeadline} />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveMeta}>
            <Text style={styles.saveText}>Salvar meta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.label}>Progresso</Text>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>
        </View>

        <View style={styles.addCard}>
          <Text style={styles.label}>Adicionar valor</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amountToAdd}
            onChangeText={setAmountToAdd}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddValue}>
            <Text style={styles.addText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.history}>
          <Text style={styles.label}>Histórico</Text>
          {movements
            .slice()
            .reverse()
            .map((m, i) => (
              <Text key={i} style={styles.historyItem}>
                + R$ {m.valor}
              </Text>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E" },
  content: { padding: 20 },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold", marginVertical: 16 },
  card: { backgroundColor: "#2A2A2A", padding: 16, borderRadius: 14 },
  label: { color: "#aaa", marginTop: 10 },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  saveBtn: {
    backgroundColor: "#3B82F6",
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold" },
  progressCard: {
    backgroundColor: "#2A2A2A",
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
  },
  progressBg: {
    height: 12,
    backgroundColor: "#444",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: { height: "100%", backgroundColor: "#4CAF50" },
  progressText: { color: "#fff", marginTop: 6 },
  addCard: {
    backgroundColor: "#2A2A2A",
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
  },
  addBtn: {
    backgroundColor: "#4CAF50",
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "bold" },
  history: {
    backgroundColor: "#2A2A2A",
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
  },
  historyItem: { color: "#4CAF50", marginTop: 6 },
});
