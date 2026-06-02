// src/api/reportsApi.js
// Endpoint laporan & statistik waste

import apiClient from './apiClient';

/**
 * Ambil ringkasan statistik (total, wasted, expired, donated)
 * @returns {{ data: ReportSummary }}
 */
export const getReportSummary = async () => {
  const { data } = await apiClient.get('/api/reports/summary');
  return data;
};

/**
 * Ambil data waste per kategori (untuk pie/bar chart)
 * @returns {{ data: CategoryReport[] }}
 */
export const getReportByCategory = async () => {
  const { data } = await apiClient.get('/api/reports/by-category');
  return data;
};

/**
 * Ambil tren waste per bulan (untuk line chart)
 * @returns {{ data: MonthlyTrend[] }}
 */
export const getMonthlyTrend = async () => {
  const { data } = await apiClient.get('/api/reports/monthly-trend');
  return data;
};

export const getReports = async () => {
  const { data } = await apiClient.get('/report/list');
  return data;
};

export const submitReport = async (payload) => {
  const { data } = await apiClient.post('/report/submit', payload);
  return data;
};


export const resolveReport = async (reportID) => {
  const { data } = await apiClient.put(
    `/report/resolve/${reportID}`
  );
  return data;
};


export const suspendSeller = async (payload) => {
  const { data } = await apiClient.post(
    '/report/suspend',
    payload
  );
  return data;
};