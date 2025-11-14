// @ts-nocheck
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// @ts-nocheck
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      alert("Preencha todos os campos!");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    alert("Conta registrada com sucesso!");
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
              color="#ccc"
            />
          </TouchableOpacity>
        </View>

        {/* Confirmar Senha */}
        <Text style={styles.label}>Confirmar Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Confirme sua senha"
            placeholderTextColor="#aaa"
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirm(!showConfirm)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#ccc"
            />
          </TouchableOpacity>
        </View>

        {/* Botão Registrar */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar-se</Text>
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

        {/* Entrar */}
        <Text style={styles.registerText}>
          Já possui uma conta?
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.registerLink}> Entre aqui</Text>
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
