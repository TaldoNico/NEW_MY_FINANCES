// Arquivo: app/goal_detail.tsx
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

const getGoalsStorageKey = () => {
  const user = auth.currentUser;
  if (!user) {
    return "goals_guest";
  }
  return `goals_${user.uid}`;
};

export default function GoalDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const indexParam = Array.isArray(params.index)
    ? params.index[0]
    : params.index;
  const index = Number(indexParam);

  // ESTADOS EDITÁVEIS
  const [title, setTitle] = useState(
    params.titulo ? String(params.titulo) : ""
  );
  const [totalValue, setTotalValue] = useState(
    params.valor_total ? String(params.valor_total) : ""
  );
  const [deadline, setDeadline] = useState(
    params.prazo ? String(params.prazo) : ""
  );
  const [description, setDescription] = useState(
    params.descricao ? String(params.descricao) : ""
  );
  const [currentValue, setCurrentValue] = useState(
    params.valor_atual ? String(params.valor_atual) : "0"
  );
  const [amountToAdd, setAmountToAdd] = useState("");
  const [movements, setMovements] = useState<any[]>([]); // histórico

  // carregar histórico da meta ao abrir
  useEffect(() => {
    const loadMovements = async () => {
      try {
        const storageKey = getGoalsStorageKey();
        const saved = await AsyncStorage.getItem(storageKey);
        const goals = saved ? JSON.parse(saved) : [];

        if (
          Array.isArray(goals) &&
          goals[index] &&
          Array.isArray(goals[index].movimentos)
        ) {
          setMovements(goals[index].movimentos);
        }
      } catch (err) {
        console.log("Erro ao carregar movimentos:", err);
      }
    };

    if (!isNaN(index) && index >= 0) {
      loadMovements();
    }
  }, [index]);

  // cálculo de progresso
  const totalNumber = Number(
    String(totalValue || "0").replace(",", ".")
  );
  const currentNumber = Number(
    String(currentValue || "0").replace(",", ".")
  );

  const hasTotal = totalNumber > 0;
  const rawProgress = hasTotal ? (currentNumber / totalNumber) * 100 : 0;
  const progress = Math.max(0, Math.min(100, rawProgress)); // 0–100

  const progressText = hasTotal
    ? `${progress.toFixed(1).replace(".", ",")}% concluído`
    : "Defina o valor total para ver o progresso";

  // SALVAR ALTERAÇÕES DA META (título, total, prazo, descrição)
  const handleSaveMeta = async () => {
    if (!title.trim()) {
      Alert.alert("Atenção", "O nome da meta não pode ficar vazio.");
      return;
    }

    // Se tiver valor total preenchido, tenta validar
    if (totalValue.trim()) {
      const n = Number(totalValue.replace(",", "."));
      if (isNaN(n) || n <= 0) {
        Alert.alert("Erro", "Valor total inválido.");
        return;
      }
    }

    try {
      const storageKey = getGoalsStorageKey();
      const saved = await AsyncStorage.getItem(storageKey);
      const goals = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(goals) || !goals[index]) {
        Alert.alert("Erro", "Não foi possível atualizar essa meta.");
        return;
      }

      goals[index].titulo = title;
      goals[index].valor_total = totalValue;
      goals[index].prazo = deadline;
      goals[index].descricao = description;

      await AsyncStorage.setItem(storageKey, JSON.stringify(goals));

      Alert.alert("Sucesso", "Meta atualizada com sucesso!");
    } catch (err) {
      console.log("Erro ao salvar meta:", err);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  // ADICIONAR VALOR NA META
  const handleAddValue = async () => {
    if (isNaN(index) || index < 0) {
      Alert.alert("Erro", "Meta inválida.");
      return;
    }

    if (!amountToAdd.trim()) {
      Alert.alert("Atenção", "Digite um valor para adicionar.");
      return;
    }

    const addNumber = Number(amountToAdd.replace(",", "."));
    const currentNumberLocal = Number(
      String(currentValue || "0").replace(",", ".")
    );

    if (isNaN(addNumber)) {
      Alert.alert("Erro", "Valor para adicionar inválido.");
      return;
    }

    const newValueNumber = currentNumberLocal + addNumber;
    const newValueString = String(newValueNumber);

    const movement = {
      valor: String(addNumber),
      data: new Date().toISOString(),
    };

    try {
      const storageKey = getGoalsStorageKey();
      const saved = await AsyncStorage.getItem(storageKey);
      const goals = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(goals) || !goals[index]) {
        Alert.alert("Erro", "Não foi possível atualizar essa meta.");
        return;
      }

      // Atualiza o valor_atual da meta
      goals[index].valor_atual = newValueString;

      // Garante que existe o array de movimentos
      if (!Array.isArray(goals[index].movimentos)) {
        goals[index].movimentos = [];
      }

      // Adiciona o novo movimento
      goals[index].movimentos.push(movement);

      await AsyncStorage.setItem(storageKey, JSON.stringify(goals));

      // Atualiza na tela
      setCurrentValue(newValueString);
      setAmountToAdd("");
      setMovements((prev) => [...prev, movement]);
    } catch (err) {
      console.log("Erro ao atualizar meta:", err);
      Alert.alert("Erro", "Não foi possível salvar o valor.");
    }
  };

  // formata data em pt-BR
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString("pt-BR");
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>{title || "Meta"}</Text>

        {/* Card de informações principais (EDITÁVEIS) */}
        <View style={styles.card}>
          <Text style={styles.label}>Título da meta</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Comprar um computador"
            placeholderTextColor="#777"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Valor total da meta</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 15000"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={totalValue}
            onChangeText={setTotalValue}
          />

          <Text style={styles.label}>Prazo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 12/03/2026"
            placeholderTextColor="#777"
            value={deadline}
            onChangeText={setDeadline}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, { minHeight: 70, textAlignVertical: "top" }]}
            placeholder="Escreva mais detalhes..."
            placeholderTextColor="#777"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity style={styles.saveMetaButton} onPress={handleSaveMeta}>
            <Text style={styles.saveMetaButtonText}>Salvar alterações da meta</Text>
          </TouchableOpacity>
        </View>

        {/* Progresso da meta */}
        <View style={styles.progressCard}>
          <Text style={styles.label}>Progresso</Text>

          {hasTotal ? (
            <>
              <Text style={styles.progressText}>
                {`R$ ${currentNumber || 0} de R$ ${totalNumber}`}
              </Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressPercent}>{progressText}</Text>
            </>
          ) : (
            <Text style={styles.progressHint}>
              Informe um valor total da meta para acompanhar o progresso.
            </Text>
          )}
        </View>

        {/* Área para adicionar valor */}
        <View style={styles.addContainer}>
          <Text style={styles.label}>Adicionar valor na meta</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 200"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={amountToAdd}
            onChangeText={setAmountToAdd}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddValue}>
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {/* Histórico de movimentações */}
        <View style={styles.historyContainer}>
          <Text style={styles.label}>Histórico de movimentações</Text>

          {movements.length === 0 ? (
            <Text style={styles.historyEmpty}>
              Nenhum valor adicionado ainda.
            </Text>
          ) : (
            [...movements]
              .slice()
              .reverse()
              .map((mov, idx) => (
                <View key={idx} style={styles.historyItem}>
                  <Text style={styles.historyAmount}>+ R$ {mov.valor}</Text>
                  <Text style={styles.historyDate}>
                    {mov.data ? formatDate(mov.data) : ""}
                  </Text>
                </View>
              ))
          )}
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
    paddingBottom: 40,
  },
  backButton: {
    width: 32,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  label: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: "#fff",
    marginTop: 2,
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
    color: "#fff",
    padding: 10,
    marginTop: 4,
  },
  saveMetaButton: {
    backgroundColor: "#3B82F6",
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveMetaButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  progressCard: {
    marginTop: 24,
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 18,
  },
  progressText: {
    color: "#fff",
    marginTop: 6,
    marginBottom: 8,
  },
  progressBarBackground: {
    width: "100%",
    height: 14,
    borderRadius: 999,
    backgroundColor: "#444",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#4CAF50",
  },
  progressPercent: {
    color: "#fff",
    marginTop: 6,
    fontWeight: "600",
  },
  progressHint: {
    color: "#ccc",
    marginTop: 8,
  },
  addContainer: {
    marginTop: 24,
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 18,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  historyContainer: {
    marginTop: 24,
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 18,
  },
  historyEmpty: {
    color: "#ccc",
    marginTop: 8,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  historyAmount: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  historyDate: {
    color: "#ccc",
    fontSize: 12,
  },
});
