import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import api from "../../api/axiosConfig"; // ⚠️ Đảm bảo đúng đường dẫn tới api config

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  // 📦 Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err: any) {
      console.log("❌ Fetch products error:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 💾 Thêm hoặc cập nhật sản phẩm
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return Alert.alert("⚠️ Login required", "Please login first!");

      if (!form.name || !form.price || !form.description)
        return Alert.alert("⚠️ Missing data", "Please fill all required fields");

      if (selectedId) {
        // Update product
        await api.put(`/products/${selectedId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("✅ Updated", "Product updated successfully!");
      } else {
        // Create product
        await api.post("/products", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("✅ Created", "Product added successfully!");
      }

      setForm({ name: "", category: "", price: "", description: "", imageUrl: "" });
      setSelectedId(null);
      fetchProducts();
    } catch (err: any) {
      console.log("❌ Save product error:", err.message);
      Alert.alert("Error", "Could not save product.");
    }
  };

  // 🗑️ Xóa sản phẩm
  const handleDelete = async (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await api.delete(`/products/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
          } catch (err: any) {
            Alert.alert("Error", "Could not delete product!");
          }
        },
      },
    ]);
  };

  // ✏️ Sửa sản phẩm
  const handleEdit = (item: any) => {
    setSelectedId(item._id);
    setForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      description: item.description,
      imageUrl: item.imageUrl,
    });
  };

  // 🔄 Reset form
  const handleCancel = () => {
    setForm({ name: "", category: "", price: "", description: "", imageUrl: "" });
    setSelectedId(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>🛒 Manage Products</Text>

      {/* Form thêm / sửa */}
      <View style={styles.form}>
        <TextInput
          placeholder="Product Name"
          style={styles.input}
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
        />
        <TextInput
          placeholder="Category"
          style={styles.input}
          value={form.category}
          onChangeText={(v) => setForm({ ...form, category: v })}
        />
        <TextInput
          placeholder="Price"
          keyboardType="numeric"
          style={styles.input}
          value={form.price}
          onChangeText={(v) => setForm({ ...form, price: v })}
        />
        <TextInput
          placeholder="Description"
          style={styles.input}
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
        />
        <TextInput
          placeholder="Image URL"
          style={styles.input}
          value={form.imageUrl}
          onChangeText={(v) => setForm({ ...form, imageUrl: v })}
        />

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="save" color="#fff" size={18} />
            <Text style={styles.btnText}>
              {selectedId ? "Update" : "Add"}
            </Text>
          </TouchableOpacity>
          {selectedId && (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Ionicons name="close" color="#F83A57" size={18} />
              <Text style={{ color: "#F83A57", fontWeight: "700", marginLeft: 5 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.img} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.category}</Text>
              <Text style={{ color: "#F83A57", fontWeight: "600" }}>
                ₹{item.price}
              </Text>
            </View>

            {/* Action buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => handleEdit(item)}
                style={styles.iconBtn}
              >
                <Ionicons name="create-outline" size={20} color="#1cc57a" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item._id)}
                style={styles.iconBtn}
              >
                <Ionicons name="trash-outline" size={20} color="#F83A57" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  form: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  btnRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  saveBtn: {
    backgroundColor: "#F83A57",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  btnText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#f2f2f2",
  },
  name: { fontWeight: "700", fontSize: 15 },
  actionRow: { flexDirection: "row", alignItems: "center" },
  iconBtn: { marginHorizontal: 5 },
});
