// app/(tabs)/settings.tsx
// @ts-nocheck
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { auth } from "../../services/firebase";
import { signOut } from "firebase/auth";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Encerrar sessão",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              // volta para a tela de login SEM deixar as tabs no histórico
              router.replace("/");
            } catch (err) {
              console.log("Erro ao encerrar sessão:", err);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Botão voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Configurações</Text>

        {/* Imagem / gráfico fake */}
        <View style={styles.chartFake} />

        {/* Botão PERFIL */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/profile")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="person-circle-outline" size={24} color="#fff" />
            <Text style={styles.optionText}>PERFIL</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Botão MINHAS METAS */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/(tabs)/goals")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="flag-outline" size={24} color="#1e90ff" />
            <Text style={styles.optionText}>MINHAS METAS</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Botão MINHAS CONQUISTAS */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/(tabs)/achievements")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="trophy-outline" size={24} color="#ffbf00" />
            <Text style={styles.optionText}>MINHAS CONQUISTAS</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Botão MUDAR TEMA (placeholder) */}
        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <Ionicons name="moon-outline" size={24} color="#1e90ff" />
            <Text style={styles.optionText}>MUDAR TEMA</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Botão SOBRE */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/about_us")}
        >
          <View style={styles.optionLeft}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#1e90ff"
            />
            <Text style={styles.optionText}>SOBRE</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Botão ENCERRAR SESSÃO */}
        <TouchableOpacity
          style={[styles.option, styles.logoutOption]}
          onPress={handleLogout}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="log-out-outline" size={24} color="#ff4d4d" />
            <Text style={[styles.optionText, { color: "#ff4d4d" }]}>
              ENCERRAR SESSÃO
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.version}>Versão • 22.10.25</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "#2b2b2b",
    borderRadius: 24,
    padding: 24,
    width: "90%",
  },
  backButton: {
    marginBottom: 8,
    padding: 4,
    width: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  chartFake: {
    width: 180,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#444",
    alignSelf: "center",
    marginBottom: 32,
  },
  option: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutOption: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ff4d4d55",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  version: {
    marginTop: 24,
    textAlign: "center",
    color: "#aaa",
  },
});
