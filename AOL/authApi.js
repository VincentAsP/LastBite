// src/api/authApi.js
// Semua request terkait autentikasi (register, login, logout)

import apiClient from './apiClient';

/**
 * Daftar akun baru
 * @param {{ username: string, password: string }} credentials
 */
export const registerUser = async ({ username, password }) => {
  const { data } = await apiClient.post('/api/register', { username, password });
  return data; // { message }
};

/**
 * Login dan simpan token ke localStorage
 * @param {{ username: string, password: string }} credentials
 * @returns {{ message, token, user }}
 */
export const loginUser = async ({ username, password }) => {
  const { data } = await apiClient.post('/api/login', { username, password });

  // Simpan token & info user ke localStorage
  if (data.token) {
    localStorage.setItem('fw_token', data.token);
    localStorage.setItem('fw_user', JSON.stringify(data.user));
  }

  return data;
};

/**
 * Logout — hapus token dari localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('fw_token');
  localStorage.removeItem('fw_user');
};

/**
 * Ambil data user yang sedang login dari localStorage
 * @returns {object|null}
 */
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('fw_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Cek apakah user sudah login (ada token)
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('fw_token');
};
