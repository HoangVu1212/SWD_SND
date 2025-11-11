import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View,
} from "react-native";
import api from "../api/axiosConfig";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = async () => {
    if (password !== confirm) return Alert.alert("Lỗi", "Mật khẩu không trùng khớp!");
    try {
      const res = await api.post("/users/register", {
        name: email.split("@")[0],
        email,
        password,
      });
      if (res.status === 200 || res.status === 201) {
        Alert.alert("✅", "Đăng ký thành công!");
        router.replace("/");
      }
    } catch (err: any) {
      Alert.alert("Lỗi", err.response?.data?.message || "Không thể đăng ký!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an{"\n"}account</Text>

      <View style={styles.inputRow}>
        <Ionicons name="person-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons name={showPass ? "eye-outline" : "eye-off-outline"} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirm}
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons name={showConfirm ? "eye-outline" : "eye-off-outline"} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        By clicking the <Text style={{ color: "#F83A57" }}>Register</Text> button, you agree to the
        public offer
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>- OR Continue with -</Text>
      <View style={styles.socialRow}>
        <Ionicons name="logo-google" size={28} color="#F83A57" />
        <Ionicons name="logo-apple" size={28} color="#000" />
        <Ionicons name="logo-facebook" size={28} color="#1877F2" />
      </View>

      <Text style={styles.footer}>
        I Already Have an Account{" "}
        <Text style={styles.link} onPress={() => router.replace("/")}>
          Login
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
  note: { fontSize: 12, color: "#777", marginBottom: 15 },
  button: { backgroundColor: "#F83A57", borderRadius: 8, paddingVertical: 14 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600", fontSize: 16 },
  orText: { textAlign: "center", color: "#777", marginVertical: 20 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 30, marginBottom: 30 },
  footer: { textAlign: "center", color: "#444" },
  link: { color: "#F83A57", fontWeight: "700" },
});
