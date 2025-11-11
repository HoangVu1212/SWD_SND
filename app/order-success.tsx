import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OrderSuccess() {
  return (
    <View style={styles.container}>
      {/* 🎉 Success Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={100} color="#1cc57a" />
      </View>

      {/* ✅ Title & Message */}
      <Text style={styles.title}>Order Placed Successfully!</Text>
      <Text style={styles.subtitle}>
        Thank you for your purchase.{"\n"}Your order has been confirmed and will
        be delivered soon.
      </Text>

      {/* 🛍 Illustration */}
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/992/992700.png",
        }}
        style={styles.image}
      />

      {/* Buttons */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Ionicons name="home-outline" size={20} color="#fff" />
        <Text style={styles.btnText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => router.push("/(tabs)/orders")}
      >
        <Ionicons name="receipt-outline" size={20} color="#F83A57" />
        <Text style={styles.secondaryText}>View My Orders</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  iconContainer: {
    backgroundColor: "#E9FFF1",
    borderRadius: 100,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  image: {
    width: 160,
    height: 160,
    marginTop: 25,
  },
  primaryBtn: {
    backgroundColor: "#F83A57",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "100%",
    height: 50,
    marginTop: 30,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryBtn: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryText: {
    color: "#F83A57",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 5,
  },
});
