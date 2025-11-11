import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import api from "../api/axiosConfig";

export default function ProductList() {
  const { category } = useLocalSearchParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [category]);

  const fetchCategoryProducts = async () => {
    try {
      const res = await api.get(`/products?category=${category}`);
      setProducts(res.data);
    } catch (err) {
      console.log("❌ Error loading category products:", err.message);
    }
  };

  return (
    
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{category}</Text>
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingVertical: 20 }}
        renderItem={({ item }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() =>
      router.push({ pathname: "/product-detail", params: { id: item._id } })
    }
  >
    <Image source={{ uri: item.imageUrl }} style={styles.image} />
    <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
    <Text style={styles.price}>${item.price}</Text>
  </TouchableOpacity>
)}
      />

      {products.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 50, color: "#888" }}>
          No products found in {category}
        </Text>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 },
  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  back: { fontSize: 16, color: "#F83A57", fontWeight: "600" },
  title: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "700" },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    padding: 8,
  },
  image: { width: "100%", height: 120, borderRadius: 10 },
  name: { marginTop: 6, fontWeight: "600", fontSize: 14 },
  price: { color: "#F83A57", marginTop: 2, fontWeight: "500" },
});
