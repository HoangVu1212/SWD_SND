import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../api/axiosConfig";

// 🧭 Danh mục
const categories = [
  { id: 1, name: "Beauty", icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
  { id: 2, name: "Fashion", icon: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png" },
  { id: 3, name: "Kids", icon: "https://cdn-icons-png.flaticon.com/512/2829/2829755.png" },
  { id: 4, name: "Mens", icon: "https://cdn-icons-png.flaticon.com/512/1077/1077063.png" },
  { id: 5, name: "Womens", icon: "https://cdn-icons-png.flaticon.com/512/6815/6815048.png" },
];

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  // 🧠 Lấy danh sách sản phẩm
  const fetchProducts = async (keyword?: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/products${keyword ? `?search=${keyword}` : ""}`);
      setProducts(res.data);
      setAllProducts(res.data); // lưu bản gốc để reset filter
    } catch (err: any) {
      console.log("❌ Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔍 Realtime Search
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  // 🧩 Sort Handler
  const handleSort = (type: "asc" | "desc") => {
    const sorted = [...products].sort((a, b) =>
      type === "asc" ? a.price - b.price : b.price - a.price
    );
    setProducts(sorted);
    setSortVisible(false);
  };

  // 🧩 Filter Handler
  const handleFilter = (range: string) => {
    let filtered = [...allProducts];
    if (range === "0-500") filtered = allProducts.filter((p) => p.price <= 500000);
    else if (range === "500-1M")
      filtered = allProducts.filter((p) => p.price > 500000 && p.price <= 1000000);
    else if (range === "1M+") filtered = allProducts.filter((p) => p.price > 1000000);

    setProducts(filtered);
    setFilterVisible(false);
  };

  // 🧹 Clear Filter
  const clearFilter = () => {
    setProducts(allProducts);
    setFilterVisible(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Stylish</Text>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          placeholder="Search any Product..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
        <Ionicons name="mic-outline" size={20} color="#999" />
      </View>

      {/* Section Title */}
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>All Featured</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.sortBtn} onPress={() => setSortVisible(true)}>
            <Ionicons name="swap-vertical" size={18} color="#333" />
            <Text style={styles.sortText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
            <Ionicons name="filter-outline" size={18} color="#333" />
            <Text style={styles.sortText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Modal */}
      <Modal visible={sortVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Sort by Price</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleSort("asc")}>
              <Text>⬆️ Ascending</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleSort("desc")}>
              <Text>⬇️ Descending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#F83A57" }]}
              onPress={() => setSortVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={filterVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Filter by Price Range</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleFilter("0-500")}>
              <Text>💸 Under ₹500K</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleFilter("500-1M")}>
              <Text>💰 ₹500K – ₹1M</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleFilter("1M+")}>
              <Text>💎 Over ₹1M</Text>
            </TouchableOpacity>

            {/* 🧹 Clear Filter */}
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#3B82F6" }]}
              onPress={clearFilter}
            >
              <Text style={{ color: "#fff" }}>Clear Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#F83A57" }]}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Categories */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.category}
            onPress={() =>
              router.push({ pathname: "/product-list", params: { category: item.name } })
            }
          >
            <View style={styles.categoryCircle}>
              <Image source={{ uri: item.icon }} style={{ width: 40, height: 40 }} />
            </View>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Banner */}
      <TouchableOpacity style={styles.banner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>50-40% OFF</Text>
          <Text style={styles.bannerDesc}>Now in (product)</Text>
          <TouchableOpacity style={styles.shopBtn}>
            <Text style={styles.shopText}>Shop Now →</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/3756042/pexels-photo-3756042.jpeg",
          }}
          style={styles.bannerImg}
        />
      </TouchableOpacity>

      {/* Products */}
      {loading ? (
        <ActivityIndicator size="large" color="#F83A57" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({ pathname: "/product-detail", params: { id: item._id } })
              }
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text numberOfLines={1} style={styles.name}>
                {item.name}
              </Text>
              <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 },
  header: { marginTop: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 22, fontWeight: "700", color: "#3B82F6" },
  avatar: { width: 34, height: 34, borderRadius: 17 },
  searchBar: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#ddd", borderRadius: 10,
    paddingHorizontal: 10, marginVertical: 15,
  },
  input: { flex: 1, padding: 8 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center" },
  sortBtn: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8 },
  filterBtn: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  sortText: { fontSize: 13, marginLeft: 4 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  modalBox: { backgroundColor: "#fff", width: "70%", borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, textAlign: "center" },
  modalBtn: { padding: 10, alignItems: "center", borderRadius: 8, marginVertical: 5, backgroundColor: "#f5f5f5" },
  category: { alignItems: "center", marginRight: 16 },
  categoryCircle: { backgroundColor: "#f8f8f8", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  categoryText: { marginTop: 6, fontSize: 13 },
  banner: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEE2E2", borderRadius: 12, padding: 16, marginVertical: 15 },
  bannerTitle: { fontSize: 20, fontWeight: "800", color: "#F83A57" },
  bannerDesc: { color: "#555", marginBottom: 8 },
  shopBtn: { backgroundColor: "#F83A57", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  shopText: { color: "#fff", fontWeight: "600" },
  bannerImg: { width: 120, height: 120, borderRadius: 10, marginLeft: 10 },
  card: { width: "48%", backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 12, elevation: 2 },
  image: { width: "100%", height: 120, borderRadius: 8 },
  name: { marginTop: 6, fontWeight: "600" },
  price: { color: "#F83A57", fontWeight: "700", marginTop: 4 },
});
