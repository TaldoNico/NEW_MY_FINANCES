import { Ionicons } from "@expo/vector-icons";
// @ts-nocheck
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Header com Botão Voltar e Título */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Configurações</Text>

        {/* Espaço para manter alinhamento */}
        <View style={{ width: 28 }} />
      </View>

      {/* Logo */}
      <View style={styles.chartContainer}>
        <Image
          source={require("@/assets/images/MYFINANCES-LOGO.png")}
          style={styles.pieChart}
          resizeMode="contain"
        />
      </View>

      {/* Menu Principal */}
      <View style={styles.menuContainer}>

        {/* PERFIL */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/profile")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="person-circle" size={20} color="#0095ff" />
            <Text style={styles.menuText}>PERFIL</Text>
          </View>
        </TouchableOpacity>

        {/* Minhas Metas */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/goals")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="flag" size={20} color="#0095ff" />
            <Text style={styles.menuText}>MINHAS METAS</Text>
          </View>
        </TouchableOpacity>

        {/* Minhas Conquistas */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/achievements")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="trophy" size={20} color="#ffa500" />
            <Text style={styles.menuText}>MINHAS CONQUISTAS</Text>
          </View>
        </TouchableOpacity>

        {/* Mudar Tema */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="contrast" size={20} color="#0095ff" />
            <Text style={styles.menuText}>MUDAR TEMA</Text>
          </View>
        </TouchableOpacity>

        {/* Sobre */}
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="information-circle" size={20} color="#0095ff" />
            <Text style={styles.menuText}>SOBRE</Text>
          </View>
        </TouchableOpacity>

      </View>

      <Text style={styles.version}>Versão • 22.10.25</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#2b2b2b",
    paddingBottom: 40,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  pieChart: {
    width: 180,
    height: 150,
  },
  menuContainer: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  menuText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  version: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 30,
  },
});
