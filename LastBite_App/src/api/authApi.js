// src/api/authApi.js
// Semua request terkait autentikasi (register, login, logout)
import apiClient from './apiClient'
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Daftar akun baru
 * @param {object} userData
 */
export const registerUser = async ({ full_name, birth_date, email, password, address }) => {
  const { data } = await apiClient.post('/auth/register', { 
    full_name, 
    birth_date, 
    email, 
    password, 
    address 
  });
  return data; 
};

/**
 * Login dan simpan token ke AsyncStorage
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ message, token, user }>}
 */
export const loginUser = async ({ email, password }) => {
  const { data } = await apiClient.post('/auth/login', { email, password });

  // Simpan token & info user ke AsyncStorage
  if (data.token) {
    await AsyncStorage.setItem('fw_token', data.token);
    await AsyncStorage.setItem('fw_user', JSON.stringify(data.user));
  }

  return data;
};

/**
 * Logout — hapus token dari AsyncStorage
 */
export const logoutUser = async () => {
  await AsyncStorage.removeItem('fw_token');
  await AsyncStorage.removeItem('fw_user');
};

/**
 * Ambil data user yang sedang login dari AsyncStorage
 * @returns {Promise<object|null>}
 */
export const getCurrentUser = async () => {
  try {
    const raw = await AsyncStorage.getItem('fw_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Cek apakah user sudah login (ada token)
 * @returns {Promise<boolean>}
 */
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('fw_token');
    return !!token;
  } catch {
    return false;
  }
};