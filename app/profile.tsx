import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router"; // ⚡ điều hướng Expo Router
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
import api from "../api/axiosConfig";
// đường dẫn đúng tới axiosConfig.tsx

export default function ProfileScreen() {
  const [email, setEmail] = useState("aashifa@gmail.com");
  const [password, setPassword] = useState("**********");
  const [pincode, setPincode] = useState("450116");
  const [address, setAddress] = useState("216 St Paul's Rd,");
  const [city, setCity] = useState("London");
  const [state, setState] = useState("N1 2LL,");
  const [country, setCountry] = useState("United Kingdom");
  const [accountNumber, setAccountNumber] = useState("204356XXXXXX");
  const [holderName, setHolderName] = useState("Abhiraj Sisodiya");
  const [ifsc, setIfsc] = useState("SBIN00428");

  // 📡 Cập nhật hồ sơ
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token)
        return Alert.alert("⚠️ Login required", "Please login to continue");

      const res = await api.put(
        "/users/update-profile",
        {
          email,
          password,
          pincode,
          address,
          city,
          state,
          country,
          accountNumber,
          holderName,
          ifsc,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("✅ Success", "Your profile has been updated!", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/index"), // 👉 Quay về Home
        },
      ]);
    } catch (err: any) {
      console.error("❌ Update profile failed:", err.message);
      Alert.alert("Error", "Could not update profile, please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="checkmark" size={26} color="#F83A57" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/4140/4140037.png",
          }}
          style={styles.avatar}
        />
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => Alert.alert("🖼 Feature coming soon", "Change photo")}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Personal Details */}
      <Text style={styles.sectionTitle}>Personal Details</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email Address"
      />
      <TextInput
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        placeholder="Password"
      />

      <View style={styles.line} />

      {/* Address Section */}
      <Text style={styles.sectionTitle}>Business Address</Text>
      <TextInput
        style={styles.input}
        value={pincode}
        onChangeText={setPincode}
        placeholder="Pincode"
      />
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
      />
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="City"
      />
      <TextInput
        style={styles.input}
        value={state}
        onChangeText={setState}
        placeholder="State"
      />
      <TextInput
        style={styles.input}
        value={country}
        onChangeText={setCountry}
        placeholder="Country"
      />

      <View style={styles.line} />

      {/* Bank Details */}
      <Text style={styles.sectionTitle}>Bank Account Details</Text>
      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholder="Bank Account Number"
      />
      <TextInput
        style={styles.input}
        value={holderName}
        onChangeText={setHolderName}
        placeholder="Account Holder Name"
      />
      <TextInput
        style={styles.input}
        value={ifsc}
        onChangeText={setIfsc}
        placeholder="IFSC Code"
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  avatarContainer: {
    alignSelf: "center",
    marginVertical: 25,
    position: "relative",
  },
  avatar: { width: 100, height: 100, borderRadius: 100 },
  editIcon: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "#F83A57",
    borderRadius: 15,
    padding: 5,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  line: { height: 1, backgroundColor: "#eee", marginVertical: 15 },
  saveBtn: {
    backgroundColor: "#F83A57",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginVertical: 25,
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
