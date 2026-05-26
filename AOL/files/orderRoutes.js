// backend/routes/orderRoutes.js
// Trigger "Pesanan Selesai" → tambah poin otomatis ke pembeli
//   - POST /api/orders/:id/selesai   → restoran tandai pesanan selesai
//   - GET  /api/orders/my            → riwayat pesanan pembeli
//   - GET  /api/orders/incoming      → pesanan masuk untuk restoran

const express = require('express');
const router  = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { sendNotificationToUser } = require('../services/fcmService');

// ---- Konfigurasi poin ----
const POINTS_PER_ORDER = 10;        // poin per pesanan selesai
const POINTS_PER_10K   = 1;         // bonus: 1 poin per Rp10.000 belanja

const calculatePoints = (totalPrice) => {
  return POINTS_PER_ORDER + Math.floor(totalPrice / 10000) * POINTS_PER_10K;
};

// ============================================================
//  POST /api/orders/:id/selesai
//  Restoran menandai pesanan selesai → trigger tambah poin ke pembeli
// ============================================================
router.post('/:id/selesai', authenticateToken, async (req, res) => {
  const pool = req.app.locals.pool;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Ambil order, pastikan milik restoran yang login & status = 'paid' atau 'processing'
    const [[order]] = await conn.query(
      `SELECT * FROM orders WHERE id = ? AND restaurant_id = ? FOR UPDATE`,
      [req.params.id, req.user.id]
    );

    if (!order) {
      await conn.rollback();
      return res.status(404).json({ message: 'Order tidak ditemukan atau bukan milik restoran Anda.' });
    }
    if (!['paid', 'processing'].includes(order.status)) {
      await conn.rollback();
      return res.status(400).json({
        message: `Order berstatus "${order.status}". Hanya paid/processing yang bisa diselesaikan.`
      });
    }
    if (order.points_awarded) {
      await conn.rollback();
      return res.status(400).json({ message: 'Poin sudah pernah diberikan untuk order ini.' });
    }

    // ---- Update status order → selesai ----
    await conn.query(
      'UPDATE orders SET status = "selesai", points_awarded = 1 WHERE id = ?',
      [order.id]
    );

    // ---- Hitung dan tambahkan poin ke pembeli ----
    const pointsToAdd = calculatePoints(order.total_price);

    // Upsert: update jika sudah ada, insert jika belum
    await conn.query(
      `INSERT INTO user_points (user_id, total_points)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE total_points = total_points + ?`,
      [order.buyer_id, pointsToAdd, pointsToAdd]
    );

    // Catat transaksi poin
    await conn.query(
      `INSERT INTO point_transactions (user_id, order_id, change, reason)
       VALUES (?, ?, ?, 'order_selesai')`,
      [order.buyer_id, order.id, pointsToAdd]
    );

    // Ambil total poin terbaru untuk notifikasi
    const [[pointsRow]] = await conn.query(
      'SELECT total_points FROM user_points WHERE user_id = ?',
      [order.buyer_id]
    );

    await conn.commit();

    // ---- Kirim notifikasi ke pembeli ----
    await sendNotificationToUser(pool, order.buyer_id, {
      title: '🎉 Pesanan Selesai!',
      body:  `+${pointsToAdd} poin ditambahkan! Total poin Anda: ${pointsRow?.total_points ?? pointsToAdd}`,
      data:  {
        type:         'order_selesai',
        order_id:     String(order.id),
        points_added: String(pointsToAdd),
        total_points: String(pointsRow?.total_points ?? pointsToAdd),
      },
    });

    res.json({
      message:      'Pesanan selesai! Poin berhasil ditambahkan ke pembeli.',
      order_id:     order.id,
      buyer_id:     order.buyer_id,
      points_added: pointsToAdd,
      total_points: pointsRow?.total_points ?? pointsToAdd,
    });
  } catch (err) {
    await conn.rollback();
    console.error('[orders/selesai]', err);
    res.status(500).json({ message: 'Gagal menyelesaikan pesanan.' });
  } finally {
    conn.release();
  }
});

// ============================================================
//  GET /api/orders/my — riwayat pesanan pembeli
// ============================================================
router.get('/my', authenticateToken, async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const [orders] = await pool.query(
      `SELECT o.*,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'name',       p.name,
            'quantity',   oi.quantity,
            'price',      oi.price
          )
        ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN products    p  ON p.id = oi.product_id
       WHERE o.buyer_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({ data: orders });
  } catch (err) {
    console.error('[orders/my]', err);
    res.status(500).json({ message: 'Gagal mengambil riwayat pesanan.' });
  }
});

// ============================================================
//  GET /api/orders/incoming — pesanan masuk untuk restoran
// ============================================================
router.get('/incoming', authenticateToken, async (req, res) => {
  const { status } = req.query;
  const pool = req.app.locals.pool;
  try {
    let query  = `SELECT o.*, u.username AS buyer_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'name',       p.name,
            'quantity',   oi.quantity,
            'price',      oi.price
          )
        ) AS items
       FROM orders o
       LEFT JOIN users        u  ON u.id = o.buyer_id
       LEFT JOIN order_items  oi ON oi.order_id = o.id
       LEFT JOIN products     p  ON p.id = oi.product_id
       WHERE o.restaurant_id = ?`;
    const params = [req.user.id];

    if (status) { query += ' AND o.status = ?'; params.push(status); }
    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const [orders] = await pool.query(query, params);
    res.json({ data: orders });
  } catch (err) {
    console.error('[orders/incoming]', err);
    res.status(500).json({ message: 'Gagal mengambil pesanan masuk.' });
  }
});

// ============================================================
//  GET /api/orders/points — total poin pembeli
// ============================================================
router.get('/points', authenticateToken, async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const [[points]] = await pool.query(
      'SELECT total_points FROM user_points WHERE user_id = ?', [req.user.id]
    );
    const [history] = await pool.query(
      `SELECT pt.*, o.total_price FROM point_transactions pt
       LEFT JOIN orders o ON o.id = pt.order_id
       WHERE pt.user_id = ?
       ORDER BY pt.created_at DESC LIMIT 20`,
      [req.user.id]
    );

    res.json({
      data: {
        total_points: points?.total_points ?? 0,
        history,
      }
    });
  } catch (err) {
    console.error('[orders/points]', err);
    res.status(500).json({ message: 'Gagal mengambil data poin.' });
  }
});

module.exports = router;
