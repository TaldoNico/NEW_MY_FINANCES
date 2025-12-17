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
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";

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
              router.replace("/");
            } catch (err) {
              console.log("Erro ao sair:", err);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Configurações</Text>

        {/* PERFIL */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/profile")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="person-circle-outline" size={26} color="#fff" />
            <Text style={styles.optionText}>Perfil</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        {/* MINHAS METAS */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/(tabs)/goals")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="flag" size={22} color="#1e90ff" />
            <Text style={styles.optionText}>Minhas Metas</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        {/* MINHAS CONQUISTAS */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/(tabs)/achievements")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="trophy" size={22} color="#FFD700" />
            <Text style={styles.optionText}>Minhas Conquistas</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        {/* SOBRE */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push("/about_us")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="information-circle-outline" size={22} color="#fff" />
            <Text style={styles.optionText}>Sobre</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        {/* ENCERRAR SESSÃO */}
        <TouchableOpacity
          style={[styles.option, styles.logout]}
          onPress={handleLogout}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="log-out-outline" size={22} color="#ff4d4d" />
            <Text style={[styles.optionText, { color: "#ff4d4d" }]}>
              Encerrar Sessão
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  option: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logout: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ff4d4d55",
  },
  version: {
    marginTop: 24,
    textAlign: "center",
    color: "#aaa",
  },
});
