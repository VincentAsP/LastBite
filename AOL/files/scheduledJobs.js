// backend/jobs/scheduledJobs.js
// Cron jobs yang berjalan di background:
//   1. Setiap 30 detik : expire order yang melewati deadline 2 menit
//   2. Setiap hari 08:00: kirim reminder ke pembeli (produk favorit hampir habis, dll)
//   3. Setiap hari 10:00: notifikasi flash sale / produk baru dari restoran

const cron = require('node-cron');
const { sendNotificationToUser, broadcastNotification } = require('../services/fcmService');
const { syncProductStatus } = require('../routes/productRoutes');

// ============================================================
//  JOB 1: Auto-expire order yang melewati deadline 2 menit
//  Jalan setiap 30 detik
// ============================================================
const startExpireOrdersJob = (pool) => {
  cron.schedule('*/30 * * * * *', async () => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Cari semua order pending yang sudah melewati deadline
      const [expiredOrders] = await conn.query(
        `SELECT * FROM orders
         WHERE status = 'pending' AND payment_deadline < NOW()`
      );

      for (const order of expiredOrders) {
        // Update status order → expired
        await conn.query(
          'UPDATE orders SET status = "expired" WHERE id = ?', [order.id]
        );

        // Kembalikan stok produk
        const [items] = await conn.query(
          'SELECT product_id, quantity FROM order_items WHERE order_id = ?', [order.id]
        );
        for (const item of items) {
          await conn.query(
            'UPDATE products SET stock = stock + ? WHERE id = ?',
            [item.quantity, item.product_id]
          );
          await syncProductStatus(conn, item.product_id);
        }

        // Notifikasi ke pembeli bahwa order expired
        await sendNotificationToUser(pool, order.buyer_id, {
          title: '⌛ Pesanan Kedaluwarsa',
          body:  'Pesanan Anda dibatalkan karena melebihi batas waktu pembayaran 2 menit.',
          data:  { type: 'order_expired', order_id: String(order.id) },
        });

        console.log(`[ExpireJob] Order #${order.id} expired dan stok dikembalikan.`);
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      console.error('[ExpireJob] Error:', err.message);
    } finally {
      conn.release();
    }
  });

  console.log('✅ Job: Auto-expire orders aktif (setiap 30 detik)');
};

// ============================================================
//  JOB 2: Notifikasi harian ke pembeli — reminder produk
//  Jalan setiap hari jam 08:00 WIB (01:00 UTC)
// ============================================================
const startDailyReminderJob = (pool) => {
  cron.schedule('0 1 * * *', async () => {
    console.log('[DailyReminder] Mengirim notifikasi pengingat harian...');
    try {
      // Ambil user pembeli yang aktif (pernah pesan dalam 30 hari terakhir)
      const [activeBuyers] = await pool.query(
        `SELECT DISTINCT buyer_id FROM orders
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
           AND status IN ('paid','selesai')`
      );

      // Cek produk yang stoknya hampir habis (stok <= 3)
      const [lowStockProducts] = await pool.query(
        `SELECT p.name, p.stock, u.username AS restaurant_name
         FROM products p
         JOIN users u ON u.id = p.restaurant_id
         WHERE p.stock <= 3 AND p.status = 'available'
         LIMIT 3`
      );

      if (lowStockProducts.length > 0 && activeBuyers.length > 0) {
        const productNames = lowStockProducts.map((p) => p.name).join(', ');
        const buyerIds     = activeBuyers.map((b) => b.buyer_id);

        await broadcastNotification(pool, buyerIds, {
          title: '🔥 Stok Hampir Habis!',
          body:  `Buruan, ${productNames} hampir sold out! Pesan sekarang sebelum kehabisan.`,
          data:  { type: 'low_stock_reminder', products: productNames },
        });

        console.log(`[DailyReminder] Notifikasi dikirim ke ${buyerIds.length} pembeli.`);
      }
    } catch (err) {
      console.error('[DailyReminder] Error:', err.message);
    }
  });

  console.log('✅ Job: Daily reminder aktif (setiap hari 08:00 WIB)');
};

// ============================================================
//  JOB 3: Notifikasi flash sale produk baru dari restoran
//  Jalan setiap hari jam 10:00 WIB (03:00 UTC)
// ============================================================
const startNewProductsNotificationJob = (pool) => {
  cron.schedule('0 3 * * *', async () => {
    console.log('[NewProducts] Memeriksa produk baru...');
    try {
      // Produk yang baru ditambahkan dalam 24 jam terakhir
      const [newProducts] = await pool.query(
        `SELECT p.name, u.username AS restaurant_name
         FROM products p
         JOIN users u ON u.id = p.restaurant_id
         WHERE p.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
           AND p.status = 'available'`
      );

      if (newProducts.length === 0) return;

      // Ambil semua pembeli yang punya FCM token
      const [buyers] = await pool.query(
        `SELECT DISTINCT user_id FROM fcm_tokens`
      );

      if (buyers.length > 0) {
        const restaurantNames = [...new Set(newProducts.map((p) => p.restaurant_name))].join(', ');
        await broadcastNotification(
          pool,
          buyers.map((b) => b.user_id),
          {
            title: '🍱 Produk Baru Tersedia!',
            body:  `${restaurantNames} baru saja menambahkan makanan surplus. Cek sekarang!`,
            data:  { type: 'new_products' },
          }
        );
        console.log(`[NewProducts] Notifikasi dikirim ke ${buyers.length} pengguna.`);
      }
    } catch (err) {
      console.error('[NewProducts] Error:', err.message);
    }
  });

  console.log('✅ Job: New products notification aktif (setiap hari 10:00 WIB)');
};

// ============================================================
//  Start semua jobs
// ============================================================
const startAllJobs = (pool) => {
  startExpireOrdersJob(pool);
  startDailyReminderJob(pool);
  startNewProductsNotificationJob(pool);
};

module.exports = { startAllJobs };
