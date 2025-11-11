import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot{"\n"}password?</Text>

      <View style={styles.inputRow}>
        <Ionicons name="mail-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <Text style={styles.note}>
        * We will send you a message to set or reset your new password
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.btnText}>Submit</Text>
      </TouchableOpacity>
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
  note: { fontSize: 12, color: "#777", marginBottom: 20 },
  button: { backgroundColor: "#F83A57", borderRadius: 8, paddingVertical: 14 },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600", fontSize: 16 },
});
