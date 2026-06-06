// src/api/foodItemsApi.js
import apiClient from './apiClient.mjs';

/**
 * Ambil semua produk
 */
export const getProducts = async () => {
  const { data } = await apiClient.get('/products/getProduct');
  return data; // { message, data: FoodItem[] }
};

/**
 * Ambil produk terdekat berdasarkan geolokasi
 * @param {number} lat
 * @param {number} lng
 * @param {number} radius - dalam meter, default 5000
 */
export const getProductsByGeolocation = async (lat, lng, radius = 5000) => {
  const { data } = await apiClient.get('/products/nearby', {
    params: { lat, lng, radius },
  });
  return data; // { message, count, data: FoodItem[] }
};

/**
 * Cek stok produk
 * @param {number} productID
 */
export const getProductStock = async (productID) => {
  const { data } = await apiClient.get(`/products/stock/${productID}`);
  return data; // { success, data: { productID, name, stock, status, can_buy } }
};

/**
 * Tambah produk baru
 */
export const addProduct = async (payload) => {
  const { data } = await apiClient.post('/products/addProduct', payload);
  return data; // { message, productID }
};