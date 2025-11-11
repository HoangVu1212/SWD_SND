import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from "react-native";
import api from "../api/axiosConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await api.post("/users/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      Alert.alert("🎉", "Đăng nhập thành công!");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Lỗi", err.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to{"\n"}Stylish!</Text>

      <View style={styles.inputRow}>
        <Ionicons name="person-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons name={showPass ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push("/forgot-password")}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>- OR Continue with -</Text>
      <View style={styles.socialRow}>
        <Ionicons name="logo-google" size={28} color="#F83A57" />
        <Ionicons name="logo-apple" size={28} color="#000" />
        <Ionicons name="logo-facebook" size={28} color="#1877F2" />
      </View>

      <Text style={styles.footer}>
        Create An Account{" "}
        <Text style={styles.link} onPress={() => router.push("/register")}>
          Sign Up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "800", marginBottom: 30 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 15,
  },
  input: { flex: 1, marginLeft: 8 },
  forgot: { color: "#F83A57", alignSelf: "flex-end", marginBottom: 20 },
  button: { backgroundColor: "#F83A57", borderRadius: 8, paddingVertical: 14 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600", fontSize: 16 },
  orText: { textAlign: "center", color: "#777", marginVertical: 20 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 30, marginBottom: 30 },
  footer: { textAlign: "center", color: "#444" },
  link: { color: "#F83A57", fontWeight: "700" },
});
