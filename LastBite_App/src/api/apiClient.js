// src/api/apiClient.js
// Base Axios instance — semua request ke backend melewati file ini.

import axios from 'axios';

// ---- Konfigurasi Base URL ----
// Gunakan HTTPS_URL jika sudah ada SSL, fallback ke HTTP
const BASE_URL =
  process.env.NEXT_PUBLIC_API_HTTPS_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://backpack-outcast-upfront.ngrok-free.dev' || 
  'http://localhost:3000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Kirim cookies jika menggunakan session (opsional)
  withCredentials: false,
});

// ============================================================
//  REQUEST INTERCEPTOR — sisipkan JWT token ke setiap request
// ============================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fw_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
//  RESPONSE INTERCEPTOR — handle token expired & error global
// ============================================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token expired / invalid → logout otomatis
    if (status === 401 || status === 403) {
      localStorage.removeItem('fw_token');
      localStorage.removeItem('fw_user');
      // Redirect ke login (gunakan window agar bisa di luar React tree)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Bentuk error yang konsisten ke seluruh aplikasi
    const message =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan. Coba lagi.';

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
