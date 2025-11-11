import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../../api/axiosConfig";

export default function CartScreen() {
  const [cart, setCart] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
      if (storedToken) {
        fetchCart(storedToken);
      }
    };
    loadData();
  }, []);

  const fetchCart = async (token: string) => {
    try {
      const res = await api.get("/orders/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err: any) {
      console.log("❌ Load cart failed:", err.message);
    }
  };

  const removeItem = async (productId: string) => {
    if (!token) return;
    try {
      await api.delete(`/orders/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("🗑 Removed", "Item deleted from cart!");
      fetchCart(token);
    } catch (err) {
      Alert.alert("Error", "Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await api.delete("/orders/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("🧹 Cart cleared");
      fetchCart(token);
    } catch (err) {
      Alert.alert("Error", "Failed to clear cart");
    }
  };

  const handleCheckout = async () => {
  if (!token) return Alert.alert("Please login first!");
  try {
    const res = await api.post("/orders/checkout", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    Alert.alert("✅ Order Success", "Your order has been completed!");
    router.push("/order-success");
  } catch (err) {
    Alert.alert("Error", "Checkout failed");
  }
};


  if (!cart)
    return (
      <View style={styles.loading}>
        <Text>Loading your cart...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>

      <FlatList
        data={cart.orderItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.product?.imageUrl }}
              style={styles.image}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.product?.name}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <Text style={styles.qty}>Qty: {item.qty}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.product._id)}>
              <Ionicons name="trash-outline" size={22} color="#F83A57" />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>${cart.totalPrice}</Text>
      </View>

      <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.checkoutBtn, { backgroundColor: "#F83A57" }]}
        onPress={clearCart}
      >
        <Text style={styles.checkoutText}>Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginTop: 40, marginBottom: 10 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 10 },
  name: { fontWeight: "600", fontSize: 15 },
  price: { color: "#F83A57", fontWeight: "700", marginTop: 4 },
  qty: { fontSize: 12, color: "#777" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 15,
  },
  totalLabel: { fontSize: 18, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#F83A57" },
  checkoutBtn: {
    backgroundColor: "#1cc57a",
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
  },
  checkoutText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
