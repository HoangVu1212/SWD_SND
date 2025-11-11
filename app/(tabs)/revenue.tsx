import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import api from "../../api/axiosConfig";

export default function RevenueScreen() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("month"); // "day" | "month" | "year"
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await api.get(`/orders/revenue?type=${filter}`, { headers });
      setData(res.data);

      // Nếu không có nhóm thì lấy total chung
      if (res.data.length === 1 && res.data[0]._id === null)
        setTotal(res.data[0].totalRevenue);
      else
        setTotal(res.data.reduce((sum: number, i: any) => sum + i.totalRevenue, 0));
    } catch (err: any) {
      console.log("❌ Revenue fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [filter]);

  const chartWidth = Dimensions.get("window").width - 40;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Revenue Statistics</Text>

      {/* Bộ lọc */}
      <View style={styles.filterRow}>
        {["day", "month", "year"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.activeBtn]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && { color: "#fff", fontWeight: "700" },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tổng doanh thu */}
      <View style={styles.summaryBox}>
        <Ionicons name="cash-outline" size={28} color="#1cc57a" />
        <View>
          <Text style={styles.summaryLabel}>Total Revenue</Text>
          <Text style={styles.summaryValue}>₹{total.toLocaleString()}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#F83A57" style={{ marginTop: 40 }} />
      ) : data.length > 0 ? (
        <BarChart
          data={{
            labels: data.map((d) => d._id?.toString() || "All"),
            datasets: [{ data: data.map((d) => d.totalRevenue) }],
          }}
          width={chartWidth}
          height={220}
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(248, 58, 87, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{ marginVertical: 20, borderRadius: 8 }}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 30, color: "#777" }}>
          No revenue data found.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, fontWeight: "800", marginTop: 40, marginBottom: 15 },
  filterRow: { flexDirection: "row", justifyContent: "space-around" },
  filterBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  activeBtn: { backgroundColor: "#F83A57", borderColor: "#F83A57" },
  filterText: { color: "#555", fontWeight: "500" },
  summaryBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#E8FFF2",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  summaryLabel: { fontSize: 14, color: "#555" },
  summaryValue: { fontSize: 22, fontWeight: "700", color: "#1cc57a" },
});
