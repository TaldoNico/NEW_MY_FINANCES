// ...existing code...
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ===== utilitários ===== */
function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function seededRandom(seed) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967295;
}

/* ===== constantes ===== */
const REPORTS = [2025];
const STORAGE_KEY = "missionDismissedWeek";
const SCREEN_WIDTH = Dimensions.get("window").width;

/* ===== CardItem ===== */
function CardItem({ year, isActive, onPress, viewMode }) {
  const isGrid = viewMode === "grid";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        isGrid ? styles.gridCard : styles.listCard,
        isActive && styles.activeCard,
      ]}
    >
      {isActive && <View style={styles.greenDot} />}
      <Text
        style={[
          styles.cardText,
          isGrid && { fontSize: 15, textAlign: "center" },
        ]}
      >
        Relatorio Anual ({year})
      </Text>
      <Ionicons
        name="pencil-outline"
        size={18}
        color="#fff"
        style={[styles.pencil, isGrid && { right: 8, bottom: 8, top: "auto" }]}
      />
    </TouchableOpacity>
  );
}

/* ===== MissionBox ===== */
function MissionBox() {
  const [loading, setLoading] = useState(true);
  const [dismissedThisWeek, setDismissedThisWeek] = useState(false);

  const today = useMemo(() => new Date(), []);
  const week = useMemo(() => getWeekNumber(today), [today]);
  const year = today.getFullYear();
  const currentWeekKey = `${year}-W${String(week).padStart(2, "0")}`;
  const todayIdx = today.getDay();

  const { showToday, type } = useMemo(() => {
    const pickDay = Math.floor(seededRandom(week) * 7);
    const pickType = seededRandom(week + 1) > 0.5 ? "mission" : "goal";
    return { showToday: pickDay === todayIdx, type: pickType };
  }, [week, todayIdx]);

  React.useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!mounted) return;
        setDismissedThisWeek(value === currentWeekKey);
      })
      .catch(() => setDismissedThisWeek(false))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [currentWeekKey]);

  const dismissForWeek = React.useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, currentWeekKey);
    } finally {
      setDismissedThisWeek(true);
    }
  }, [currentWeekKey]);

  if (loading || !showToday || dismissedThisWeek) return null;

  const missionContent =
    type === "mission"
      ? {
          title: "Missão de Hoje",
          text: "Deposite 50R$ na caixinha do seu banco!!",
          icon: <MaterialCommunityIcons name="account-cash" size={20} color="#fff" />,
        }
      : {
          title: "Minha Meta",
          text: "Não gastar mais de 100R$ em lanches",
          icon: <MaterialCommunityIcons name="star-outline" size={20} color="#fff" />,
        };

  return (
    <View style={styles.missionBox}>
      <View style={styles.missionHeader}>
        <View style={styles.missionHeaderLeft}>
          {missionContent.icon}
          <Text style={[styles.missionTitle, { marginLeft: 8 }]}>
            {missionContent.title}
          </Text>
        </View>
        <Pressable onPress={dismissForWeek}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <Text style={styles.missionText}>{missionContent.text}</Text>

      <TouchableOpacity style={styles.finishButton} onPress={dismissForWeek}>
        <Text style={styles.finishText}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ===== HomeScreen ===== */
export default function HomeScreen() {
  const [selectedYear, setSelectedYear] = useState(REPORTS[0]);
  const [viewMode, setViewMode] = useState("list");

  const toggleView = useCallback(
    () => setViewMode((m) => (m === "list" ? "grid" : "list")),
    []
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity onPress={toggleView}>
          <Ionicons
            name={viewMode === "list" ? "grid-outline" : "reorder-three-outline"}
            size={26}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View
          style={
            viewMode === "list" ? styles.listContainer : styles.gridContainer
          }
        >
          {REPORTS.map((year) => (
            <CardItem
              key={year}
              year={year}
              isActive={selectedYear === year}
              onPress={() => setSelectedYear(year)}
              viewMode={viewMode}
            />
          ))}
        </View>
      </ScrollView>

      {/* Missão de Hoje */}
      <MissionBox />

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <Ionicons name="home" size={22} color="#fff" />
        <MaterialCommunityIcons name="trophy-outline" size={22} color="#fff" />
        <Ionicons name="add-circle" size={32} color="#00FF7F" />
        <Ionicons name="settings-outline" size={22} color="#fff" />
        <Ionicons name="cog-outline" size={22} color="#fff" />
      </View>
    </View>
  );
}

/* ===== estilos ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
  },
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scroll: {
    alignItems: "center",
    paddingVertical: 15,
  },
  listContainer: {
    width: "90%",
    gap: 12,
  },
  gridContainer: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  card: {
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 16,
  },
  gridCard: {
    width: (SCREEN_WIDTH * 0.9 - 12) / 2, // 2 colunas
    height: 120,
    padding: 12,
  },
  activeCard: {
    backgroundColor: "#567f9c",
  },
  cardText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  pencil: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  greenDot: {
    width: 12,
    height: 12,
    backgroundColor: "#00FF00",
    borderRadius: 50,
    position: "absolute",
    left: 10,
    top: 10,
  },
  missionBox: {
    backgroundColor: "#2b2b2b",
    marginHorizontal: 15,
    marginBottom: 85,
    padding: 14,
    borderRadius: 10,
  },
  missionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  missionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  missionTitle: {
    color: "#aaa",
    fontWeight: "600",
  },
  closeText: {
    color: "#aaa",
    padding: 6,
    fontSize: 16,
  },
  missionText: {
    color: "#fff",
    marginTop: 8,
    fontSize: 14,
  },
  finishButton: {
    backgroundColor: "#00FF7F",
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 6,
  },
  finishText: {
    color: "#000",
    fontWeight: "bold",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#2b2b2b",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 55,
    borderTopWidth: 0.5,
    borderTopColor: "#333",
  },
});
