// src/api/apiClient.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const BASE_URL = 'https://backpack-outcast-upfront.ngrok-free.dev';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  async (config) => {
    // ✅ AsyncStorage instead of localStorage
    const token = await AsyncStorage.getItem('fw_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // ✅ AsyncStorage instead of localStorage
      await AsyncStorage.removeItem('fw_token');
      await AsyncStorage.removeItem('fw_user');
      // ✅ expo-router instead of window.location
      router.replace('/login');
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan. Coba lagi.';

    return Promise.reject(new Error(message));
  }
);

export default apiClient;