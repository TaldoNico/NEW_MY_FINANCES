// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

  const deleteReport = () => {
    setReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
    setConfirmDeleteModal(false);
    setEditModal(false);
  };

  const saveCreate = () => {
    const name = createName.trim() || "Seu Relatorio";
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

    setReports((prev) => [report, ...prev]);
    setCreateModal(false);

    setCreateName("");
    setCreateColor("#4ECDC4");

    router.push("/(tabs)/report");
  };

  const handleReportPress = (report: any) => {
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
            <TouchableOpacity style={styles.editButton} onPress={() => openEdit(item)}>
              <Ionicons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${item.progress}%`,
                    backgroundColor: "rgba(255,255,255,0.9)",
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>

          <Text style={styles.dateText}>{item.date}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.reportCardList}
          onPress={() => handleReportPress(item)}
          activeOpacity={0.8}
        >
          <View style={[styles.listColorIndicator, { backgroundColor: item.color }]} />

          <View style={styles.listContent}>
            <Text style={styles.listTitle}>{item.name}</Text>

            <View style={styles.listInfo}>
              <Text style={styles.listDate}>{item.date}</Text>

              <View style={styles.listProgressBar}>
                <View
                  style={[
                    styles.listProgressFill,
                    { width: `${item.progress}%`, backgroundColor: item.color },
                  ]}
                />
              </View>

              <Text style={styles.listProgress}>{item.progress}%</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => openEdit(item)} style={styles.listEditButton}>
            <Ionicons name="pencil" size={20} color={item.color} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { marginTop: 50 }]}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={toggleView} style={styles.iconButton}>
          <Ionicons name={viewMode === "grid" ? "list" : "grid"} size={24} color="#fff" />
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
          columnWrapperStyle={viewMode === "grid" ? { gap: 16 } : undefined}
          scrollEnabled={false}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <Ionicons name="document-outline" size={80} color="#666" />
          <Text style={styles.emptyText}>Infelizmente não há nenhum relatório disponível...</Text>
          <Text style={styles.emptySubtext}>Toque no + para criar um relatório</Text>
        </ScrollView>
      )}

      {/* EDIT MODAL */}
      <Modal visible={editModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Relatório</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do relatório"
              placeholderTextColor="#aaa"
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.colorLabel}>Selecione uma cor:</Text>
            <View style={styles.colorPalette}>
              {colors.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: c,
                      borderWidth: newColor === c ? 3 : 1,
                      borderColor: newColor === c ? "#fff" : "#555",
                    },
                  ]}
                  onPress={() => setNewColor(c)}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: "#4ECDC4" }]} onPress={saveEdit}>
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, { backgroundColor: "#666" }]} onPress={() => setEditModal(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>

            {/* BOTÃO DE EXCLUIR MODIFICADO */}
            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: "#b71c1c",
                padding: 14,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 12,
              }}
              onPress={confirmDelete}
            >
              <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <Modal visible={confirmDeleteModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>

            <Text style={{ color: "#fff", marginBottom: 20, fontSize: 16 }}>
              Tem certeza que deseja excluir este relatório?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#b71c1c" }]}
                onPress={deleteReport}
              >
                <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#666" }]}
                onPress={() => setConfirmDeleteModal(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
                      borderColor: createColor === c ? "#fff" : "#555",
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

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#1a1a1a",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  iconButton: { padding: 8, backgroundColor: "#2b2b2b", borderRadius: 8 },

  list: { paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 100 },

  reportCardGrid: {
    borderRadius: 12,
    padding: 16,
    width: "48%",
    minHeight: 160,
    justifyContent: "space-between",
    marginBottom: 16,
  },

  reportHeader: { flexDirection: "row", justifyContent: "space-between" },
  reportName: { color: "#fff", fontSize: 16, fontWeight: "700" },
  editButton: {
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 6,
    marginLeft: 8,
  },

  progressSection: { marginVertical: 12 },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: { height: "100%", borderRadius: 3 },
  progressText: { color: "#fff", fontSize: 12, fontWeight: "600" },

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
  listTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 8 },
  listInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  listDate: { color: "#888", fontSize: 12 },
  listProgressBar: {
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    width: 60,
    overflow: "hidden",
  },
  listProgressFill: { height: "100%" },
  listProgress: { color: "#0095ff", fontSize: 12, fontWeight: "600", minWidth: 35 },
  listEditButton: { padding: 8 },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#fff", fontSize: 18, marginTop: 16 },
  emptySubtext: { color: "#888", marginTop: 8 },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: { backgroundColor: "#1e1e1e", borderRadius: 16, padding: 24 },
  modalTitle: { color: "#fff", fontSize: 20, marginBottom: 20 },

  input: {
    backgroundColor: "#2b2b2b",
    borderRadius: 10,
    color: "#fff",
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  colorLabel: { color: "#fff", marginBottom: 12 },
  colorPalette: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },

  modalButtons: { flexDirection: "row", gap: 12 },
  btn: { flex: 1, padding: 12, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold" },
});
