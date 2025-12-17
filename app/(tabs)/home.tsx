// app/(tabs)/home.tsx
// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import { db } from "@/services/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

export default function Home() {
  const router = useRouter();
  const { create } = useLocalSearchParams();
  const { user, loading } = useAuth();

  const [reports, setReports] = useState([]);

  const [createModal, setCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createColor, setCreateColor] = useState("#4ECDC4");

  // 🔹 SELEÇÃO
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  /* 🔐 PROTEÇÃO */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/index");
    }
  }, [loading, user]);

  /* ➕ ABRIR MODAL PELO + */
  useEffect(() => {
    if (create === "1") {
      setCreateModal(true);
      router.replace("/(tabs)/home");
    }
  }, [create]);

  /* 🔥 LISTENER FIRESTORE */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "reports"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setReports(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [user]);

  if (loading || !user) {
    return <View style={{ flex: 1, backgroundColor: "#111" }} />;
  }

  /* ☑️ SELECIONAR */
  const toggleSelect = (id: string) => {
    setSelectedReports((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  /* 🗑️ EXCLUIR */
  const deleteSelected = () => {
    Alert.alert(
      "Excluir relatórios",
      `Deseja excluir ${selectedReports.length} relatório(s)?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              for (const id of selectedReports) {
                await deleteDoc(
                  doc(db, "users", user.uid, "reports", id)
                );
              }

              setSelectedReports([]);
              setSelectionMode(false);
            } catch (err) {
              console.log("Erro ao excluir:", err);
            }
          },
        },
      ]
    );
  };

  const colors = [
    "#E63946",
    "#F94144",
    "#F3722C",
    "#F8961E",
    "#F9C74F",
    "#90BE6D",
    "#43AA8B",
    "#4D908E",
    "#577590",
  ];

  const saveCreate = async () => {
    const name = createName.trim() || "Seu Relatório";
    const date = new Date();

    const ref = await addDoc(
      collection(db, "users", user.uid, "reports"),
      {
        name,
        color: createColor,
        date: date.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        }),
        createdAt: new Date(),
      }
    );

    await AsyncStorage.setItem("@active_report_id", ref.id);

    setCreateModal(false);
    setCreateName("");
    setCreateColor("#4ECDC4");

    router.push("/(tabs)/report");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>

        {selectionMode && (
          <TouchableOpacity onPress={deleteSelected}>
            <Ionicons name="trash" size={26} color="#ff4d4d" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const selected = selectedReports.includes(item.id);

          return (
            <TouchableOpacity
              style={[
                styles.reportCard,
                { backgroundColor: item.color },
              ]}
              onLongPress={() => {
                setSelectionMode(true);
                toggleSelect(item.id);
              }}
              onPress={() => {
                if (selectionMode) {
                  toggleSelect(item.id);
                } else {
                  AsyncStorage.setItem("@active_report_id", item.id);
                  router.push("/(tabs)/report");
                }
              }}
            >
              {selectionMode && (
                <Ionicons
                  name={selected ? "checkbox" : "square-outline"}
                  size={22}
                  color="#fff"
                  style={styles.checkbox}
                />
              )}

              <Text style={styles.reportName}>{item.name}</Text>
              <Text style={styles.reportDate}>{item.date}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* MODAL CRIAR RELATÓRIO */}
      <Modal visible={createModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Relatório</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do relatório"
              placeholderTextColor="#aaa"
              value={createName}
              onChangeText={setCreateName}
            />

            <View style={styles.colorPalette}>
              {colors.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: c,
                      borderWidth: createColor === c ? 3 : 1,
                      borderColor: "#fff",
                    },
                  ]}
                  onPress={() => setCreateColor(c)}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.createBtn} onPress={saveCreate}>
              <Text style={styles.createText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  header: {
    paddingTop: 50,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "bold" },

  list: { padding: 10 },

  reportCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    padding: 16,
    position: "relative",
  },
  checkbox: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  reportName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  reportDate: { color: "#eee", marginTop: 8 },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 20,
    width: "85%",
  },
  modalTitle: { color: "#fff", fontSize: 20, marginBottom: 12 },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  colorPalette: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 6,
  },
  createBtn: {
    backgroundColor: "#4ECDC4",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  createText: { color: "#000", fontWeight: "bold" },
});
