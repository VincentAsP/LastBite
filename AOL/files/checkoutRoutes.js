// backend/routes/checkoutRoutes.js
// Flow checkout < 2 menit:
//   1. POST /api/checkout/initiate    → buat order, lock stok, set deadline 2 menit
//   2. POST /api/checkout/confirm     → konfirmasi pembayaran (dari payment gateway callback)
//   3. POST /api/checkout/cancel      → pembatalan manual sebelum deadline
//   4. GET  /api/checkout/status/:id  → cek status order real-time

const express = require('express');
const router  = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { syncProductStatus } = require('./productRoutes');
const { sendNotificationToUser } = require('../services/fcmService');

const CHECKOUT_DEADLINE_MS = 2 * 60 * 1000; // 2 menit dalam milidetik

// ---- Helper: kembalikan stok yang di-lock saat order dibatalkan/expire ----
const releaseOrderStock = async (conn, orderId) => {
  const [items] = await conn.query(
    'SELECT product_id, quantity FROM order_items WHERE order_id = ?', [orderId]
  );
  for (const item of items) {
    await conn.query(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [item.quantity, item.product_id]
    );
    await syncProductStatus(conn, item.product_id);
  }
};

// ============================================================
//  1. INITIATE CHECKOUT — buat order, lock stok, mulai timer 2 menit
// ============================================================
router.post('/initiate', authenticateToken, async (req, res) => {
  const { items, notes } = req.body;
  // items: [{ product_id, quantity }, ...]

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Keranjang belanja kosong.' });
  }

  const pool = req.app.locals.pool;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let totalPrice    = 0;
    const orderItems  = [];
    let restaurant_id = null;

    // --- Validasi stok setiap item ---
    for (const item of items) {
      const [[product]] = await conn.query(
        'SELECT * FROM products WHERE id = ? FOR UPDATE', // row-lock
        [item.product_id]
      );

      if (!product) {
        await conn.rollback();
        return res.status(404).json({ message: `Produk ID ${item.product_id} tidak ditemukan.` });
      }
      if (product.status !== 'available' || product.stock < item.quantity) {
        await conn.rollback();
        return res.status(409).json({
          message: `Stok "${product.name}" tidak cukup. Tersisa: ${product.stock}`,
          product_id: product.id,
        });
      }

      // Semua item harus dari restoran yang sama
      if (!restaurant_id) restaurant_id = product.restaurant_id;
      if (restaurant_id !== product.restaurant_id) {
        await conn.rollback();
        return res.status(400).json({ message: 'Semua item harus dari restoran yang sama.' });
      }

      totalPrice += product.price * item.quantity;
      orderItems.push({ product_id: product.id, quantity: item.quantity, price: product.price });
    }

    // --- Buat order dengan deadline 2 menit ---
    const deadline = new Date(Date.now() + CHECKOUT_DEADLINE_MS);
    const [orderResult] = await conn.query(
      `INSERT INTO orders (buyer_id, restaurant_id, total_price, status, payment_deadline, notes)
       VALUES (?, ?, ?, 'pending', ?, ?)`,
      [req.user.id, restaurant_id, totalPrice, deadline, notes || null]
    );
    const orderId = orderResult.insertId;

    // --- Insert order items & kurangi stok (lock) ---
    for (const item of orderItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
      await syncProductStatus(conn, item.product_id);
    }

    await conn.commit();

    // --- Kirim notifikasi ke pembeli ---
    await sendNotificationToUser(pool, req.user.id, {
      title: '⏱ Selesaikan Pembayaran',
      body:  `Bayar dalam 2 menit sebelum pesanan otomatis dibatalkan!`,
      data:  { type: 'checkout_reminder', order_id: String(orderId) },
    });

    res.status(201).json({
      message:          'Pesanan dibuat! Selesaikan pembayaran dalam 2 menit.',
      order_id:         orderId,
      total_price:      totalPrice,
      payment_deadline: deadline.toISOString(),
      seconds_left:     Math.floor(CHECKOUT_DEADLINE_MS / 1000),
    });
  } catch (err) {
    await conn.rollback();
    console.error('[checkout/initiate]', err);
    res.status(500).json({ message: 'Gagal membuat pesanan.' });
  } finally {
    conn.release();
  }
});

// ============================================================
//  2. CONFIRM PAYMENT — callback dari payment gateway (Midtrans, dll)
// ============================================================
router.post('/confirm', async (req, res) => {
  // Validasi signature dari payment gateway di production!
  // Contoh ini menerima: { order_id, payment_status, payment_token }
  const { order_id, payment_status, payment_token } = req.body;

  if (!order_id) return res.status(400).json({ message: 'order_id wajib diisi.' });

  const pool = req.app.locals.pool;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[order]] = await conn.query(
      'SELECT * FROM orders WHERE id = ? FOR UPDATE', [order_id]
    );

    if (!order) {
      await conn.rollback();
      return res.status(404).json({ message: 'Order tidak ditemukan.' });
    }

    // Cek apakah sudah expire
    if (new Date() > new Date(order.payment_deadline) && order.status === 'pending') {
      // Auto-expire order
      await conn.query('UPDATE orders SET status = "expired" WHERE id = ?', [order_id]);
      await releaseOrderStock(conn, order_id);
      await conn.commit();
      return res.status(410).json({ message: 'Order sudah kedaluwarsa (lebih dari 2 menit).' });
    }

    if (order.status !== 'pending') {
      await conn.rollback();
      return res.status(400).json({ message: `Order sudah berstatus "${order.status}".` });
    }

    const newStatus = payment_status === 'success' ? 'paid' : 'cancelled';

    await conn.query(
      'UPDATE orders SET status = ?, payment_token = ? WHERE id = ?',
      [newStatus, payment_token || null, order_id]
    );

    // Jika dibatalkan payment gateway → kembalikan stok
    if (newStatus === 'cancelled') {
      await releaseOrderStock(conn, order_id);
    }

    await conn.commit();

    // Notifikasi ke pembeli
    await sendNotificationToUser(pool, order.buyer_id, {
      title: newStatus === 'paid' ? '✅ Pembayaran Berhasil!' : '❌ Pembayaran Gagal',
      body:  newStatus === 'paid'
        ? 'Pesanan Anda sedang diproses restoran.'
        : 'Pesanan dibatalkan. Silakan coba lagi.',
      data: { type: 'payment_update', order_id: String(order_id), status: newStatus },
    });

    res.json({ message: `Order diperbarui ke status "${newStatus}".`, order_id, status: newStatus });
  } catch (err) {
    await conn.rollback();
    console.error('[checkout/confirm]', err);
    res.status(500).json({ message: 'Gagal konfirmasi pembayaran.' });
  } finally {
    conn.release();
  }
});

// ============================================================
//  3. CANCEL — pembatalan manual oleh pembeli sebelum deadline
// ============================================================
router.post('/cancel', authenticateToken, async (req, res) => {
  const { order_id } = req.body;
  if (!order_id) return res.status(400).json({ message: 'order_id wajib diisi.' });

  const pool = req.app.locals.pool;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[order]] = await conn.query(
      'SELECT * FROM orders WHERE id = ? AND buyer_id = ? FOR UPDATE',
      [order_id, req.user.id]
    );

    if (!order) {
      await conn.rollback();
      return res.status(404).json({ message: 'Order tidak ditemukan.' });
    }
    if (!['pending'].includes(order.status)) {
      await conn.rollback();
      return res.status(400).json({ message: `Order berstatus "${order.status}", tidak bisa dibatalkan.` });
    }

    await conn.query('UPDATE orders SET status = "cancelled" WHERE id = ?', [order_id]);
    await releaseOrderStock(conn, order_id);
    await conn.commit();

    res.json({ message: 'Pesanan berhasil dibatalkan.' });
  } catch (err) {
    await conn.rollback();
    console.error('[checkout/cancel]', err);
    res.status(500).json({ message: 'Gagal membatalkan pesanan.' });
  } finally {
    conn.release();
  }
});

// ============================================================
//  4. STATUS — cek status order + sisa waktu
// ============================================================
router.get('/status/:id', authenticateToken, async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const [[order]] = await pool.query(
      `SELECT o.*, 
        TIMESTAMPDIFF(SECOND, NOW(), o.payment_deadline) AS seconds_left
       FROM orders o WHERE o.id = ? AND o.buyer_id = ?`,
      [req.params.id, req.user.id]
    );

    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan.' });

    res.json({
      data: {
        ...order,
        seconds_left: Math.max(0, order.seconds_left || 0),
        is_expired:   order.status === 'expired' || (order.seconds_left <= 0 && order.status === 'pending'),
      }
    });
  } catch (err) {
    console.error('[checkout/status]', err);
    res.status(500).json({ message: 'Gagal mengambil status pesanan.' });
  }
});

module.exports = router;
