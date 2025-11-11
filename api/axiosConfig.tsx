import axios from "axios";
import { Alert } from "react-native";

// ⚠️ Thay bằng IPv4 thật (chạy ipconfig để lấy)
const api = axios.create({
  baseURL: "http://10.12.48.57:5000/api",
});

// 🧩 Interceptor để xử lý token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response && err.response.status === 401) {
      console.log("⚠️ Token invalid or expired — but keeping AsyncStorage");
      Alert.alert("Session expired", "Please login again.");
      // ❌ KHÔNG xoá token ở đây — để user không bị out giữa chừng
    }
    return Promise.reject(err);
  }
);

export default api;
