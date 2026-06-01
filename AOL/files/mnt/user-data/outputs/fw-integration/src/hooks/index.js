// src/hooks/index.js
// Custom hooks siap pakai untuk semua fitur baru

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  requestPasswordReset, verifyResetToken, resetPassword,
  getProducts, getProductStock,
  initiateCheckout, confirmPayment, cancelOrder, getOrderStatus,
  getMyOrders, getIncomingOrders, completeOrder, getMyPoints,
  registerFcmToken, unregisterFcmToken,
} from '../api/index';

// ============================================================
//  usePasswordReset — flow reset password 3 langkah
// ============================================================
export const usePasswordReset = () => {
  const [step, setStep]       = useState('request'); // 'request' | 'verify' | 'reset' | 'done'
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [tokenValid, setTokenValid] = useState(null);

  const requestReset = async (email) => {
    setLoading(true); setError(null);
    try {
      await requestPasswordReset(email);
      setStep('verify');
      return true;
    } catch (e) { setError(e.message); return false; }
    finally { setLoading(false); }
  };

  const verifyToken = async (token) => {
    setLoading(true); setError(null);
    try {
      const result = await verifyResetToken(token);
      setTokenValid(result.valid);
      if (result.valid) setStep('reset');
      return result.valid;
    } catch (e) { setError(e.message); setTokenValid(false); return false; }
    finally { setLoading(false); }
  };

  const doReset = async (token, newPassword) => {
    setLoading(true); setError(null);
    try {
      await resetPassword({ token, new_password: newPassword });
      setStep('done');
      return true;
    } catch (e) { setError(e.message); return false; }
    finally { setLoading(false); }
  };

  return { step, loading, error, tokenValid, requestReset, verifyToken, doReset };
};

// ============================================================
//  useProductStock — polling stok real-time
//  Auto-update can_buy → frontend disable/enable tombol "Beli"
// ============================================================
export const useProductStock = (productId, pollIntervalMs = 10000) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading]     = useState(true);

  const fetchStock = useCallback(async () => {
    if (!productId) return;
    try {
      const result = await getProductStock(productId);
      setStockData(result.data);
    } catch (e) {
      console.error('useProductStock error:', e.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchStock();
    const interval = setInterval(fetchStock, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchStock, pollIntervalMs]);

  return {
    stock:    stockData?.stock ?? 0,
    status:   stockData?.status ?? 'habis',
    canBuy:   stockData?.can_buy ?? false,  // ← pakai ini untuk disable tombol "Beli"
    loading,
    refresh:  fetchStock,
  };
};

// ============================================================
//  useCheckout — flow checkout dengan countdown 2 menit
// ============================================================
export const useCheckout = () => {
  const [orderId, setOrderId]       = useState(null);
  const [deadline, setDeadline]     = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const timerRef                    = useRef(null);
  const pollRef                     = useRef(null);

  // Countdown timer lokal (UI)
  const startCountdown = (seconds) => {
    let remaining = seconds;
    setSecondsLeft(remaining);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setOrderStatus('expired');
      }
    }, 1000);
  };

  // Poll status order dari server setiap 5 detik
  const startStatusPolling = (id) => {
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const result = await getOrderStatus(id);
        const s = result.data.status;
        setOrderStatus(s);
        if (['paid','cancelled','expired','selesai'].includes(s)) {
          clearInterval(pollRef.current);
          clearInterval(timerRef.current);
        }
      } catch (e) { /* silent */ }
    }, 5000);
  };

  // Bersihkan interval saat component unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
    };
  }, []);

  const startCheckout = async (items, notes) => {
    setLoading(true); setError(null);
    try {
      const result = await initiateCheckout({ items, notes });
      setOrderId(result.order_id);
      setDeadline(result.payment_deadline);
      setOrderStatus('pending');
      startCountdown(result.seconds_left);
      startStatusPolling(result.order_id);
      return result;
    } catch (e) { setError(e.message); throw e; }
    finally { setLoading(false); }
  };

  const cancel = async () => {
    if (!orderId) return;
    await cancelOrder(orderId);
    setOrderStatus('cancelled');
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);
  };

  // Format MM:SS untuk ditampilkan di UI
  const timeDisplay = `${String(Math.floor(secondsLeft / 60)).padStart(2,'0')}:${String(secondsLeft % 60).padStart(2,'0')}`;

  return {
    orderId, deadline, secondsLeft, timeDisplay,
    orderStatus, loading, error,
    startCheckout, cancel,
    isExpired: orderStatus === 'expired' || secondsLeft <= 0,
    isPaid:    orderStatus === 'paid',
  };
};

// ============================================================
//  useOrders — riwayat dan manajemen pesanan
// ============================================================
export const useOrders = (role = 'buyer') => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchOrders = useCallback(async (filters = {}) => {
    setLoading(true); setError(null);
    try {
      const result = role === 'buyer'
        ? await getMyOrders()
        : await getIncomingOrders(filters);
      setOrders(result.data ?? []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [role]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Restoran: tandai selesai → poin langsung ke pembeli
  const markAsSelesai = async (orderId) => {
    try {
      const result = await completeOrder(orderId);
      await fetchOrders();
      return result; // { points_added, total_points }
    } catch (e) { setError(e.message); throw e; }
  };

  return { orders, loading, error, fetchOrders, markAsSelesai };
};

// ============================================================
//  usePoints — poin pembeli
// ============================================================
export const usePoints = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [history, setHistory]         = useState([]);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getMyPoints();
        setTotalPoints(result.data.total_points);
        setHistory(result.data.history);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return { totalPoints, history, loading };
};

// ============================================================
//  useFcmNotification — setup FCM di React (web)
//  Panggil sekali di _app.js atau layout utama setelah login
// ============================================================
export const useFcmNotification = (firebaseMessaging) => {
  useEffect(() => {
    if (!firebaseMessaging) return;

    const setup = async () => {
      try {
        // Minta izin notifikasi dari browser
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // Ambil token FCM device
        const { getToken, onMessage } = await import('firebase/messaging');
        const token = await getToken(firebaseMessaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          await registerFcmToken({ token, device: 'web' });
        }

        // Handle notifikasi saat app sedang terbuka (foreground)
        onMessage(firebaseMessaging, (payload) => {
          const { title, body } = payload.notification || {};
          if (title) {
            // Tampilkan sebagai native browser notification
            new Notification(title, { body, icon: '/icon.png' });
          }
        });
      } catch (err) {
        console.error('[FCM setup]', err.message);
      }
    };

    setup();

    // Cleanup: hapus token saat user logout (simpan token di closure)
    return () => {
      // unregisterFcmToken(token) — panggil manual saat logout
    };
  }, [firebaseMessaging]);
};
