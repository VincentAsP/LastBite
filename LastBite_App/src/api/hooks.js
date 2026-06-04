// src/hooks/useAuth.js
// Custom hook untuk manajemen autentikasi

import { useState, useCallback, useRef, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser, isAuthenticated } from '../api/authApi';
import { getProductStock } from './foodItemsApi';
import { getUserEcoImpact, getMyPoints } from './impactApi';

export const useAuth = () => {
  const [user, setUser]       = useState(getCurrentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(credentials);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  return { user, loading, error, login, register, logout, isAuthenticated: isAuthenticated() };
};

// ============================================================

// src/hooks/useFoodItems.js
// Custom hook untuk CRUD food items


import {
  getFoodItems,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
  markAsWasted,
  markAsDonated,
  markAsConsumed,
} from '../api/foodItemsApi';

export const useFoodItems = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getFoodItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch saat hook pertama dipakai
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = async (payload) => {
    const result = await addFoodItem(payload);
    await fetchItems(); // refresh list
    return result;
  };

  const updateItem = async (id, payload) => {
    const result = await updateFoodItem(id, payload);
    await fetchItems();
    return result;
  };

  const deleteItem = async (id) => {
    const result = await deleteFoodItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    return result;
  };

  const wasteItem  = (id) => markAsWasted(id).then(fetchItems);
  const donateItem = (id) => markAsDonated(id).then(fetchItems);
  const consumeItem = (id) => markAsConsumed(id).then(fetchItems);

  // Items yang sudah expired tapi belum di-update statusnya
  const expiredItems = items.filter(
    (i) => i.status === 'active' && new Date(i.expiry_date) < new Date()
  );

  return {
    items,
    expiredItems,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    wasteItem,
    donateItem,
    consumeItem,
  };
};

// ============================================================

// src/hooks/useReports.js
// Custom hook untuk laporan statistik

import { getReportSummary, getReportByCategory, getMonthlyTrend } from '../api/reportsApi';

export const useReports = () => {
  const [summary, setSummary]         = useState(null);
  const [byCategory, setByCategory]   = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [s, c, m] = await Promise.all([
          getReportSummary(),
          getReportByCategory(),
          getMonthlyTrend(),
        ]);
        setSummary(s.data);
        setByCategory(c.data);
        setMonthlyTrend(m.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { summary, byCategory, monthlyTrend, loading, error };
};

export const useProductStock = (productID, pollIntervalMs = 15000) => {
  const [canBuy, setCanBuy]   = useState(true);
  const [stock, setStock]     = useState(null);
  const [status, setStatus]   = useState('available');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const intervalRef           = useRef(null);
 
  const fetchStock = useCallback(async () => {
    if (!productID){
      setLoading(false)
      return;
    } 
    try {
      const result = await getProductStock(productID);
      if (result.data) {
        setCanBuy(result.data.can_buy);
        setStock(result.data.stock);
        setStatus(result.data.status);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productID]);
 
  useEffect(() => {
    fetchStock();
 
    intervalRef.current = setInterval(fetchStock, pollIntervalMs);
 
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchStock, pollIntervalMs]);
 
  return { canBuy, stock, status, loading, error, refresh: fetchStock };
};

export const useEcoImpact = (userID) => {
    const [metrics, setMetrics]             = useState(null);
    const [weeklyChart, setWeeklyChart]     = useState([]);
    const [recentHistory, setRecentHistory] = useState([]);
    const [points, setPoints]               = useState({ total_points: 0, history: [] });
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);
 
    const fetchAll = useCallback(async () => {
        if (!userID) return;
        setLoading(true);
        setError(null);
        try {
            // Panggil kedua endpoint paralel untuk efisiensi
            const [impactResult, pointsResult] = await Promise.all([
                getUserEcoImpact(userID),
                getMyPoints(userID),
            ]);
 
            setMetrics(impactResult.data.metrics);
            setWeeklyChart(impactResult.data.weekly_chart);
            setRecentHistory(impactResult.data.recent_history);
            setPoints(pointsResult.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userID]);
 
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);
 
    return { metrics, weeklyChart, recentHistory, points, loading, error, refresh: fetchAll 
    };
  };