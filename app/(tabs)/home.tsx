// app/(tabs)/home.tsx
// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();
  const { create } = useLocalSearchParams();

  const [viewMode, setViewMode] = useState("grid");
  const [reports, setReports] = useState([]);

  const [editModal, setEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#FF6B6B");

  const [createModal, setCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createColor, setCreateColor] = useState("#4ECDC4");

  useEffect(() => {
    if (create === "1") {
      setCreateModal(true);
      router.replace("/(tabs)/home");
    }
  }, [create]);

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

  const toggleView = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  const openEdit = (report: any) => {
    setSelectedReport(report);
    setNewName(report.name);
    setNewColor(report.color);
    setEditModal(true);
  };

  const saveEdit = () => {
    setReports((prev) =>
      prev.map((r: any) =>
        r.id === selectedReport?.id
          ? { ...r, name: newName || r.name, color: newColor }
          : r
      )
    );
    setEditModal(false);
  };

  const confirmDelete = () => {
    setConfirmDeleteModal(true);
  };

  const deleteReport = async () => {
    setReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
    await AsyncStorage.removeItem(`transactions_${selectedReport.id}`);
    setConfirmDeleteModal(false);
    setEditModal(false);
  };

  /* ==============================
     ✅ CRIAR RELATÓRIO (CORRIGIDO)
  ============================== */
  const saveCreate = async () => {
    const name = createName.trim() || "Seu Relatório";
    const id = Date.now().toString();
    const date = new Date();
    const month = date.toLocaleString("pt-BR", { month: "short" });
    const year = date.getFullYear();

    const report = {
      id,
      name,
      color: createColor,
      progress: 0,
      date: `${month} ${year}`,
    };

    // 🔥 cria storage exclusivo
    await AsyncStorage.setItem(
      `transactions_${id}`,
      JSON.stringify([])
    );

    // 🔥 define relatório ativo
    await AsyncStorage.setItem(
      "@active_report_id",
      id
    );

    setReports((prev) => [report, ...prev]);

    setCreateModal(false);
    setCreateName("");
    setCreateColor("#4ECDC4");

    router.push("/(tabs)/report");
  };

  /* ==============================
     ✅ ABRIR RELATÓRIO EXISTENTE
  ============================== */
  const handleReportPress = async (report: any) => {
    await AsyncStorage.setItem(
      "@active_report_id",
      report.id
    );

    router.push("/(tabs)/report");
  };

  const renderItem = ({ item }: any) => {
    if (viewMode === "grid") {
      return (
        <TouchableOpacity
          style={[styles.reportCardGrid, { backgroundColor: item.color }]}
          onPress={() => handleReportPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.reportHeader}>
            <Text style={styles.reportName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openEdit(item)}
            >
              <Ionicons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.dateText}>{item.date}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.reportCardList}
        onPress={() => handleReportPress(item)}
      >
        <View
          style={[styles.listColorIndicator, { backgroundColor: item.color }]}
        />
        <View style={styles.listContent}>
          <Text style={styles.listTitle}>{item.name}</Text>
          <Text style={styles.listDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { marginTop: 50 }]}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={toggleView} style={styles.iconButton}>
          <Ionicons
            name={viewMode === "grid" ? "list" : "grid"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* LISTAGEM */}
      {reports.length > 0 ? (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === "grid" ? 2 : 1}
          key={viewMode}
          contentContainerStyle={styles.list}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <Ionicons name="document-outline" size={80} color="#666" />
          <Text style={styles.emptyText}>
            Infelizmente não há nenhum relatório disponível...
          </Text>
          <Text style={styles.emptySubtext}>
            Toque no + para criar um relatório
          </Text>
        </ScrollView>
      )}

      {/* CREATE MODAL */}
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

            <Text style={styles.colorLabel}>Escolha uma cor:</Text>
            <View style={styles.colorPalette}>
              {colors.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: c,
                      borderWidth: createColor === c ? 3 : 1,
                      borderColor:
                        createColor === c ? "#fff" : "#555",
                    },
                  ]}
                  onPress={() => setCreateColor(c)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#4ECDC4" }]}
                onPress={saveCreate}
              >
                <Text style={styles.btnText}>Criar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#666" }]}
                onPress={() => setCreateModal(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#1a1a1a",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  iconButton: { padding: 8, backgroundColor: "#2b2b2b", borderRadius: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  reportCardGrid: {
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 16,
  },
  reportHeader: { flexDirection: "row", justifyContent: "space-between" },
  reportName: { color: "#fff", fontSize: 16, fontWeight: "700" },
  editButton: {
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 6,
  },
  dateText: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  reportCardList: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  listColorIndicator: {
    width: 6,
    height: 60,
    borderRadius: 3,
    marginRight: 12,
  },
  listContent: { flex: 1 },
  listTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  listDate: { color: "#888", fontSize: 12 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { color: "#fff", fontSize: 18, marginTop: 16 },
  emptySubtext: { color: "#888", marginTop: 8 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: { color: "#fff", fontSize: 20, marginBottom: 20 },
  input: {
    backgroundColor: "#2b2b2b",
    borderRadius: 10,
    color: "#fff",
    padding: 12,
    marginBottom: 20,
  },
  colorLabel: { color: "#fff", marginBottom: 12 },
  colorPalette: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },
  modalButtons: { flexDirection: "row", gap: 12 },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
