// src/api/userApi.js
import apiClient from './apiClient';
import { logoutUser, getCurrentUser } from './authApi';

export const updateProfile = async (profileData) => {
  const { data } = await apiClient.put('/user/profile', profileData);
  return data;
};

export const changePassword = async ({ current_password, new_password }) => {
  const { data } = await apiClient.put('/user/change-password', {
    current_password,
    new_password,
  });
  return data;
};

export const deleteAccount = async () => {
  const user = await getCurrentUser();         // ambil userID dari AsyncStorage
  const { data } = await apiClient.delete(`/user/account/${user.userID}`);
  await logoutUser();
  return data;
};