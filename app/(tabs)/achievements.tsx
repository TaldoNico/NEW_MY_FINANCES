// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AchievementsScreen() {
  const router = useRouter();

  const achievements = [
    // EXISTENTES
    { icon: "trophy", color: "#f8c200", text: "Faça seu primeiro registro de despesas" },
    { icon: "document-text", color: "#00c3ff", text: "Conclua seu primeiro relatório mensal" },
    { icon: "trending-up", color: "#1fbf5b", text: "Tenha um rendimento positivo" },
    { icon: "timer", color: "#ff884d", text: "Fique mais de 5 dias sem gastar com uma despesa" },
    { icon: "calendar", color: "#bd73ff", text: "Conclua seu primeiro relatório anual" },
    { icon: "wallet", color: "#ffd84d", text: "Deposite 200R$ em despesas da casa" },
    { icon: "checkmark-done", color: "#42ff9e", text: "Tenha um saldo positivo ao final do mês" },
    { icon: "cash", color: "#00d47c", text: "Deposite 300R$ em poupança" },
    { icon: "card", color: "#ff5f5f", text: "Não tenha gastos no cartão de crédito" },
    { icon: "fast-food", color: "#ffa97a", text: "Fique 2 dias sem gastar com a despesa (lanches)" },

    // NOVAS CONQUISTAS
    { icon: "stats-chart", color: "#4dd2ff", text: "Acompanhe suas despesas por 7 dias seguidos" },
    { icon: "rocket", color: "#ff7bf2", text: "Bata sua primeira meta financeira" },
    { icon: "gift", color: "#ffcc00", text: "Guarde 500R$ na poupança" },
    { icon: "shield-checkmark", color: "#48ff84", text: "Fique 30 dias sem atrasar contas" },
    { icon: "pie-chart", color: "#8c7bff", text: "Monte seu primeiro gráfico mensal" },
    { icon: "cash-outline", color: "#4fffcb", text: "Economize 50R$ em um único dia" },
    { icon: "leaf", color: "#66ff92", text: "Fique 3 dias sem gastos supérfluos" },
    { icon: "star", color: "#ffd93b", text: "Complete 5 conquistas" },
    { icon: "diamond", color: "#82e8ff", text: "Economize mais de 1000R$ no total" },
    { icon: "alarm", color: "#ff8e7b", text: "Registre uma despesa antes das 9h" },
    { icon: "analytics", color: "#00e2ff", text: "Revise seu relatório mensal completo" },
    { icon: "sunny", color: "#ffd966", text: "Comece um mês com saldo positivo" },
    { icon: "heart", color: "#ff7a7a", text: "Evite gastar com lanches por 7 dias" },
    { icon: "umbrella", color: "#a3b0ff", text: "Crie um fundo de emergência" },
    { icon: "library", color: "#caff7a", text: "Leia sobre educação financeira pela primeira vez" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Minhas Conquistas</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {achievements.map((item, index) => (
          <View key={index} style={styles.card}>
            <Ionicons name={item.icon} size={26} color={item.color} />
            <Text style={styles.cardText}>{item.text}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreButtonText}>Mostre mais</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginRight: 34,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    gap: 12,
  },
  cardText: {
    color: "#fff",
    fontSize: 15,
    flexShrink: 1,
  },
  moreButton: {
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#1fbf5b",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  moreButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
