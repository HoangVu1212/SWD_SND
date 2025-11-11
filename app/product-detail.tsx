import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../api/axiosConfig";

export default function ProductDetail() {
  const { id } = useLocalSearchParams(); // lấy id sản phẩm từ params
  const [product, setProduct] = useState<any>(null);
  const [similar, setSimilar] = useState([]);
  const [selectedSize, setSelectedSize] = useState("7 UK");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);

      // Gợi ý sản phẩm cùng category
      const simRes = await api.get(`/products?category=${res.data.category}`);
      setSimilar(simRes.data.filter((p: any) => p._id !== id));
    } catch (err: any) {
      console.log("❌ Error loading product:", err.message);
    }
  };

  if (!product)
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
          <Ionicons name="cart-outline" size={26} />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      {/* Size selection */}
      <Text style={styles.sizeLabel}>Size: {selectedSize}</Text>
      <View style={styles.sizeRow}>
        {["6 UK", "7 UK", "8 UK", "9 UK", "10 UK"].map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.sizeBtn,
              selectedSize === s && { backgroundColor: "#F83A57" },
            ]}
            onPress={() => setSelectedSize(s)}
          >
            <Text
              style={[
                styles.sizeText,
                selectedSize === s && { color: "#fff" },
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product info */}
      <View style={{ marginTop: 10 }}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.subtitle}>
          {product.description.slice(0, 50)}...
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" color="#FFD700" size={18} />
          <Ionicons name="star" color="#FFD700" size={18} />
          <Ionicons name="star" color="#FFD700" size={18} />
          <Ionicons name="star" color="#FFD700" size={18} />
          <Ionicons name="star-half" color="#FFD700" size={18} />
          <Text style={styles.reviewCount}> 56,890</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>₹2,999</Text>
          <Text style={styles.price}>₹{(product.price / 1000).toFixed(3)}</Text>
          <Text style={styles.discount}>50% OFF</Text>
        </View>
      </View>

      {/* Product details */}
      <View style={{ marginTop: 10 }}>
        <Text style={styles.sectionTitle}>Product Details</Text>
        <Text style={styles.details}>
          {product.description.length > 200
            ? product.description.slice(0, 200) + "..."
            : product.description}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {/* 🛒 Go to Cart */}
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token)
                return Alert.alert("⚠️ Login required", "Please login first!");
              await api.post(
                "/orders/cart",
                { productId: id, qty: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              Alert.alert("✅ Success", "Product added to cart!");
              router.push("/(tabs)/cart"); // 👉 mở tab Cart ngay sau khi thêm
            } catch (err: any) {
              console.log("❌ Add to cart failed:", err.message);
              Alert.alert("Error", "Could not add to cart. Please try again.");
            }
          }}
        >
          <Ionicons name="cart" color="#fff" size={18} />
          <Text style={styles.cartText}> Go to Cart</Text>
        </TouchableOpacity>

        {/* ⚡ Buy Now */}
        <TouchableOpacity
  style={styles.buyBtn}
  onPress={async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("📦 Token before checkout:", token);

      if (!token)
        return Alert.alert("⚠️ Login required", "Please login first!");

      const res = await api.post(
        "/orders/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Checkout success:", res.data);
      Alert.alert("✅ Success", "Your order has been placed!");

      // 👉 Dùng replace để không reset session
      router.push("/(tabs)/index");
    } catch (err: any) {
      console.log("❌ Checkout failed:", err.message);
      Alert.alert("Error", "Checkout failed, please try again!");
    }
  }}
>
  <Ionicons name="flash" color="#fff" size={18} />
  <Text style={styles.buyText}> Buy Now</Text>
</TouchableOpacity>

      </View>

      {/* Delivery info */}
      <View style={styles.deliveryBox}>
        <Text style={styles.deliveryTitle}>Delivery in</Text>
        <Text style={styles.deliveryTime}>1 within Hour</Text>
      </View>

      {/* Similar products */}
      <View style={styles.similarHeader}>
        <Text style={styles.similarTitle}>Similar To</Text>
        <Text style={{ color: "#999" }}>{similar.length}+ Items</Text>
      </View>

      <FlatList
        data={similar.slice(0, 4)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.similarCard}
            onPress={() =>
              router.push({
                pathname: "/product-detail",
                params: { id: item._id },
              })
            }
          >
            <Image source={{ uri: item.imageUrl }} style={styles.similarImg} />
            <Text numberOfLines={1} style={styles.similarName}>
              {item.name}
            </Text>
            <Text style={styles.similarPrice}>
              ₹{(item.price / 1000).toFixed(3)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Footer spacing */}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginTop: 15,
  },
  sizeLabel: { marginTop: 10, fontWeight: "600" },
  sizeRow: { flexDirection: "row", marginTop: 10 },
  sizeBtn: {
    borderWidth: 1,
    borderColor: "#F83A57",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 8,
  },
  sizeText: { color: "#F83A57", fontWeight: "600" },
  name: { fontSize: 20, fontWeight: "800", marginTop: 10 },
  subtitle: { color: "#888", fontSize: 14 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  reviewCount: { color: "#666", fontSize: 13 },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  oldPrice: { textDecorationLine: "line-through", color: "#999", marginRight: 6 },
  price: { color: "#F83A57", fontWeight: "700", fontSize: 16 },
  discount: { color: "#1cc57a", fontWeight: "600", marginLeft: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 15 },
  details: { color: "#444", marginTop: 6, lineHeight: 20 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cartBtn: {
    backgroundColor: "#F83A57",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "48%",
    height: 45,
  },
  cartText: { color: "#fff", fontWeight: "600" },
  buyBtn: {
    backgroundColor: "#1cc57a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "48%",
    height: 45,
  },
  buyText: { color: "#fff", fontWeight: "600" },
  deliveryBox: {
    backgroundColor: "#FFE4E9",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  deliveryTitle: { color: "#444", fontWeight: "600" },
  deliveryTime: { color: "#F83A57", fontWeight: "800" },
  similarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },
  similarTitle: { fontSize: 16, fontWeight: "700" },
  similarCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    padding: 8,
  },
  similarImg: { width: "100%", height: 120, borderRadius: 8 },
  similarName: { marginTop: 6, fontWeight: "600" },
  similarPrice: { color: "#F83A57", fontWeight: "600", marginTop: 3 },
});
