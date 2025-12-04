// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Digite email e senha!");
      return;
    }

    try {
      setLoading(true);

      // Login REAL no Firebase
      await signInWithEmailAndPassword(auth, email.trim(), password);

      // LOGIN OK → Redirecionar sem permitir voltar para tela de login
      router.replace("/(tabs)/home");

    } catch (error: any) {
      console.log("❌ ERRO NO LOGIN:", error);

      let message = "Erro ao entrar. Tente novamente.";

      if (error.code === "auth/user-not-found") {
        message = "Usuário não encontrado!";
      } else if (error.code === "auth/wrong-password") {
        message = "Senha incorreta!";
      } else if (error.code === "auth/invalid-email") {
        message = "E-mail inválido!";
      }

      Alert.alert("Erro", message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Senha */}
        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Digite sua senha"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#000000ff"
            />
          </TouchableOpacity>
        </View>

        {/* Esqueci minha senha */}
        <TouchableOpacity onPress={() => router.push("/forgot_password")}>
          <Text style={styles.forgot}>Esqueci minha Senha</Text>
        </TouchableOpacity>

        {/* Botão conectar */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Conectando..." : "Conectar"}
          </Text>
        </TouchableOpacity>

        {/* Linha divisória */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.ou}>OU</Text>
          <View style={styles.line} />
        </View>

        {/* Google */}
        <TouchableOpacity style={styles.googleButton}>
          <Ionicons name="logo-google" size={18} color="#fff" />
          <Text style={styles.googleText}>Continuar com o google</Text>
        </TouchableOpacity>

        {/* Registro */}
        <Text style={styles.registerText}>
          Não possui uma conta?
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}> Registre-se aqui</Text>
          </TouchableOpacity>
        </Text>

        {/* Termos */}
        <Text style={styles.terms}>
          Ao continuar, afirmo que concordo com a{" "}
          <Text style={styles.link}>Política de privacidade</Text> e os{" "}
          <Text style={styles.link}>Termos de uso</Text> do My Finance.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#2b2b2b",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 25,
    width: "85%",
    alignItems: "center",
    elevation: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#d9d9d9",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginTop: 5,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  forgot: {
    color: "#0095ff",
    fontSize: 13,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: "#22aa22",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#999",
  },
  ou: {
    color: "#ccc",
    marginHorizontal: 10,
  },
  googleButton: {
    backgroundColor: "#4285F4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    width: "100%",
  },
  googleText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  registerText: {
    color: "#ccc",
    marginTop: 15,
  },
  registerLink: {
    color: "#0095ff",
    fontWeight: "bold",
  },
  terms: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  link: {
    color: "#0095ff",
  },
});
