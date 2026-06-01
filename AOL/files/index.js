// src/api/index.js
// Central export semua API service untuk frontend

export { default as apiClient }       from './apiClient';
export * from './authApi';
export * from './passwordApi';
export * from './productApi';
export * from './checkoutApi';
export * from './ordersApi';
export * from './notificationApi';

// ─────────────────────────────────────────────────────────────
// src/api/passwordApi.js — Reset Password Flow
// ─────────────────────────────────────────────────────────────

/**
 * 1. Minta link reset → dikirim ke email
 * @param {string} email
 */
export const requestPasswordReset = async (email) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.post('/api/password/request-reset', { email });
  return data;
};

/**
 * 2. Verifikasi apakah token valid (sebelum tampilkan form password baru)
 * @param {string} token
 */
export const verifyResetToken = async (token) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.post('/api/password/verify-token', { token });
  return data; // { valid: true/false }
};

/**
 * 3. Submit password baru
 * @param {{ token: string, new_password: string }}
 */
export const resetPassword = async ({ token, new_password }) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.post('/api/password/reset', { token, new_password });
  return data;
};

// ─────────────────────────────────────────────────────────────
// src/api/productApi.js — Produk & Stok
// ─────────────────────────────────────────────────────────────

/**
 * Ambil semua produk (filter opsional)
 * @param {{ restaurant_id?: number, status?: string }}
 */
export const getProducts = async (filters = {}) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.get('/api/products', { params: filters });
  return data;
};

/**
 * Cek stok real-time satu produk
 * Response includes: { can_buy: true/false, stock, status }
 * Frontend gunakan can_buy untuk enable/disable tombol "Beli"
 * @param {number} productId
 */
export const getProductStock = async (productId) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.get(`/api/products/${productId}/stock`);
  return data; // { data: { id, name, stock, status, can_buy } }
};

/**
 * Tambah produk baru (restoran)
 */
export const addProduct = async (payload) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.post('/api/products', payload);
  return data;
};

/**
 * Update produk (stok / info)
 */
export const updateProduct = async (id, payload) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.put(`/api/products/${id}`, payload);
  return data;
};

/**
 * Restock produk
 * @param {number} id
 * @param {number} addStock  jumlah yang ditambahkan
 */
export const restockProduct = async (id, addStock) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.patch(`/api/products/${id}/restock`, { add_stock: addStock });
  return data;
};

// ─────────────────────────────────────────────────────────────
// src/api/checkoutApi.js — Checkout < 2 Menit
// ─────────────────────────────────────────────────────────────

/**
 * Mulai checkout — buat order & mulai countdown 2 menit
 * @param {{ items: [{product_id, quantity}], notes?: string }}
 * @returns {{ order_id, total_price, payment_deadline, seconds_left }}
 */
export const initiateCheckout = async ({ items, notes }) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.post('/api/checkout/initiate', { items, notes });
  return data;
};

/**
 * Konfirmasi pembayaran (dari payment gateway callback)
 */
export const confirmPayment = async ({ order_id, payment_status, payment_token }) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.post('/api/checkout/confirm', { order_id, payment_status, payment_token });
  return data;
};

/**
 * Batalkan pesanan (sebelum deadline)
 * @param {number} order_id
 */
export const cancelOrder = async (order_id) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.post('/api/checkout/cancel', { order_id });
  return data;
};

/**
 * Cek status order + sisa waktu
 * @param {number} orderId
 */
export const getOrderStatus = async (orderId) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.get(`/api/checkout/status/${orderId}`);
  return data; // { data: { status, seconds_left, is_expired, ... } }
};

// ─────────────────────────────────────────────────────────────
// src/api/ordersApi.js — Riwayat Pesanan & Poin
// ─────────────────────────────────────────────────────────────

/**
 * Riwayat pesanan pembeli
 */
export const getMyOrders = async () => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.get('/api/orders/my');
  return data;
};

/**
 * Pesanan masuk (untuk restoran)
 * @param {{ status?: string }}
 */
export const getIncomingOrders = async (filters = {}) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.get('/api/orders/incoming', { params: filters });
  return data;
};

/**
 * Restoran tandai pesanan selesai → trigger tambah poin ke pembeli
 * @param {number} orderId
 */
export const completeOrder = async (orderId) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.post(`/api/orders/${orderId}/selesai`);
  return data; // { points_added, total_points }
};

/**
 * Ambil total poin & riwayat transaksi poin pembeli
 */
export const getMyPoints = async () => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.get('/api/orders/points');
  return data; // { data: { total_points, history } }
};

// ─────────────────────────────────────────────────────────────
// src/api/notificationApi.js — FCM Push Notification
// ─────────────────────────────────────────────────────────────

/**
 * Daftarkan FCM token device ke server (panggil saat login / app start)
 * @param {{ token: string, device?: 'android'|'ios'|'web' }}
 */
export const registerFcmToken = async ({ token, device = 'web' }) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.post('/api/notifications/register-token', { token, device });
  return data;
};

/**
 * Hapus FCM token (panggil saat logout)
 * @param {string} token
 */
export const unregisterFcmToken = async (token) => {
  const { default: api } = await import('./apiClient');
  const { data } = await api.delete('/api/notifications/unregister-token', { data: { token } });
  return data;
};
