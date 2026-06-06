// src/api/apiClient.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router"; // Import router dari expo untuk navigasi

// ---- Konfigurasi Base URL ----
// Catatan: NEXT_PUBLIC_ itu untuk framework web Next.js.
// Kalau di Expo, gunakan EXPO_PUBLIC_
const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://backpack-outcast-upfront.ngrok-free.dev";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// ============================================================
//  REQUEST INTERCEPTOR — sisipkan JWT token ke setiap request
// ============================================================
apiClient.interceptors.request.use(
  async (config) => {
    // WAJIB tambahkan async
    try {
      // Gunakan AsyncStorage dan ditunggu dengan await
      const token = await AsyncStorage.getItem("fw_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (e) {
      console.log("Gagal mengambil token dari storage", e);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================
//  RESPONSE INTERCEPTOR — handle token expired & error global
// ============================================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // Hanya 401 (token expired) yang auto-logout
    // 403 JANGAN di-handle di sini — biarkan tiap screen yang handle
    if (status === 401) {
      try {
        await AsyncStorage.removeItem("fw_token");
        await AsyncStorage.removeItem("fw_user");
        router.replace("/");
      } catch (e) {
        console.log("Gagal menghapus token", e);
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan. Coba lagi.";

    return Promise.reject(error); 
  },
);
export default apiClient;
