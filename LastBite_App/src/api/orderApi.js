import apiClient from './apiClient.mjs';

export const checkoutOrder = async (payload) => {
  const { data } = await apiClient.post(
    '/orders/checkout',
    payload
  );
  return data;
};

export const confirmPayment = async (orderID) => {
  const { data } = await apiClient.post(
    '/orders/confirm-payment',
    { orderID }
  );
  return data;
};

export const getInvoice = async (orderID) => {
  const { data } = await apiClient.get(
    `/orders/invoice/${orderID}`
  );
  return data;
};

export const cancelOrder = async (orderID) => {
  const { data } = await apiClient.post(
    '/orders/cancel',
    { orderID }
  );
  return data;
};

