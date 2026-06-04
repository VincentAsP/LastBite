// src/api/foodItemsApi.js
// CRUD operations untuk food items

import apiClient from "./apiClient.mjs";

/**
 * Ambil semua food items milik user yang login
 * @returns {{ data: FoodItem[] }}
 */
export const getFoodItems = async () => {
  const { data } = await apiClient.get("/products/getProduct");
  return data;
};

/**
 * Tambah food item baru
 * @param {{
 *   name: string,
 *   category: string,
 *   quantity: number,
 *   unit: string,
 *   expiry_date: string,  // format: YYYY-MM-DD
 *   status?: string
 * }} payload
 */
export const addFoodItem = async (payload) => {
  const { data } = await apiClient.post("/products/addProduct", payload);
  return data; // { message, id }
};

/**
 * Update food item yang sudah ada
 * @param {number} id - ID food item
 * @param {object} payload - field yang ingin diubah
 */
export const updateFoodItem = async (id, payload) => {
  const { data } = await apiClient.put(`/api/food-items/${id}`, payload);
  return data; // { message }
};

/**
 * Tandai item sebagai "wasted"
 * @param {number} id
 */
export const markAsWasted = async (id) => {
  return updateFoodItem(id, { status: "wasted" });
};

/**
 * Tandai item sebagai "donated"
 * @param {number} id
 */
export const markAsDonated = async (id) => {
  return updateFoodItem(id, { status: "donated" });
};

/**
 * Tandai item sebagai "consumed"
 * @param {number} id
 */
export const markAsConsumed = async (id) => {
  return updateFoodItem(id, { status: "consumed" });
};

/**
 * Hapus food item
 * @param {number} id
 */
export const deleteFoodItem = async (id) => {
  const { data } = await apiClient.delete(`/api/food-items/${id}`);
  return data; // { message }
};

export const getProducts = async (payload) => {
  const { data } = await apiClient.post("/products/getProduct");

  return data;
};

export const getProductStock = async (productID) => {
  const { data } = await apiClient.get(`/products/stock/${productID}`);
  return data;
};
