// backend/routes/productRoutes.js
// Fitur:
//   - CRUD produk oleh restoran
//   - Auto-disable tombol "Beli" + update status "Habis" saat stok = 0
//   - Endpoint khusus untuk cek stok real-time (dipakai frontend sebelum checkout)

const express = require('express');
const router  = express.Router();
const { authenticateToken } = require('../middleware/auth');

// ---- Helper: sync status produk berdasarkan stok ----
// Dipanggil setiap kali stok berubah (tambah/kurang)
const syncProductStatus = async (conn, productId) => {
  const [[product]] = await conn.query(
    'SELECT stock, status FROM products WHERE id = ?', [productId]
  );
  if (!product) return;

  let newStatus = product.status;

  if (product.stock <= 0 && product.status === 'available') {
    // Stok habis → otomatis "habis" (frontend disable tombol Beli)
    newStatus = 'habis';
    await conn.query(
      'UPDATE products SET status = "habis", stock = 0 WHERE id = ?', [productId]
    );
  } else if (product.stock > 0 && product.status === 'habis') {
    // Stok diisi ulang → kembalikan ke available
    newStatus = 'available';
    await conn.query(
      'UPDATE products SET status = "available" WHERE id = ?', [productId]
    );
  }

  return newStatus;
};

// ============================================================
//  GET semua produk (publik — untuk halaman browse pembeli)
// ============================================================
router.get('/', async (req, res) => {
  const { restaurant_id, status } = req.query;
  const pool = req.app.locals.pool;
  try {
    let query  = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (restaurant_id) { query += ' AND restaurant_id = ?'; params.push(restaurant_id); }
    if (status)        { query += ' AND status = ?';        params.push(status); }

    query += ' ORDER BY created_at DESC';
    const [products] = await pool.query(query, params);
    res.json({ data: products });
  } catch (err) {
    console.error('[products/GET]', err);
    res.status(500).json({ message: 'Gagal mengambil produk.' });
  }
});

// ============================================================
//  GET stok real-time satu produk (dipakai frontend sebelum Beli)
//  Response juga memberi tahu apakah tombol Beli harus di-disable
// ============================================================
router.get('/:id/stock', async (req, res) => {
  const pool = req.app.locals.pool;
  try {
    const [[product]] = await pool.query(
      'SELECT id, name, stock, status FROM products WHERE id = ?',
      [req.params.id]
    );
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

    res.json({
      data: {
        ...product,
        // Flag eksplisit untuk frontend: disable tombol "Beli"
        can_buy: product.stock > 0 && product.status === 'available',
      }
    });
  } catch (err) {
    console.error('[products/stock]', err);
    res.status(500).json({ message: 'Gagal cek stok.' });
  }
});

// ============================================================
//  POST tambah produk baru (restoran)
// ============================================================
router.post('/', authenticateToken, async (req, res) => {
  const { name, description, price, stock, image_url } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ message: 'name, price, dan stock wajib diisi.' });
  }

  const pool   = req.app.locals.pool;
  const conn   = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const status = stock > 0 ? 'available' : 'habis';
    const [result] = await conn.query(
      `INSERT INTO products (restaurant_id, name, description, price, stock, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, description || '', price, stock, status, image_url || null]
    );

    await conn.commit();
    res.status(201).json({ message: 'Produk ditambahkan!', id: result.insertId, status });
  } catch (err) {
    await conn.rollback();
    console.error('[products/POST]', err);
    res.status(500).json({ message: 'Gagal menambahkan produk.' });
  } finally {
    conn.release();
  }
});

// ============================================================
//  PUT update stok/info produk (restoran)
//  Auto-sync status "habis" / "available" setelah stok berubah
// ============================================================
router.put('/:id', authenticateToken, async (req, res) => {
  const { name, description, price, stock, image_url } = req.body;
  const pool = req.app.locals.pool;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Pastikan produk milik restoran yang login
    const [[product]] = await conn.query(
      'SELECT * FROM products WHERE id = ? AND restaurant_id = ?',
      [req.params.id, req.user.id]
    );
    if (!product) {
      await conn.rollback();
      return res.status(404).json({ message: 'Produk tidak ditemukan atau bukan milik Anda.' });
    }

    const newStock = stock != null ? stock : product.stock;

    await conn.query(
      `UPDATE products SET
        name        = COALESCE(?, name),
        description = COALESCE(?, description),
        price       = COALESCE(?, price),
        stock       = ?,
        image_url   = COALESCE(?, image_url)
       WHERE id = ?`,
      [name, description, price, newStock, image_url, req.params.id]
    );

    // Auto-sync status berdasarkan stok terbaru
    const newStatus = await syncProductStatus(conn, req.params.id);

    await conn.commit();
    res.json({
      message: 'Produk diperbarui!',
      status:  newStatus,
      can_buy: newStatus === 'available',
    });
  } catch (err) {
    await conn.rollback();
    console.error('[products/PUT]', err);
    res.status(500).json({ message: 'Gagal memperbarui produk.' });
  } finally {
    conn.release();
  }
});

// ============================================================
//  PATCH restock — restoran isi ulang stok
// ============================================================
router.patch('/:id/restock', authenticateToken, async (req, res) => {
  const { add_stock } = req.body;
  if (!add_stock || add_stock <= 0) {
    return res.status(400).json({ message: 'add_stock harus lebih dari 0.' });
  }

  const pool = req.app.locals.pool;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[product]] = await conn.query(
      'SELECT * FROM products WHERE id = ? AND restaurant_id = ?',
      [req.params.id, req.user.id]
    );
    if (!product) {
      await conn.rollback();
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    await conn.query(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [add_stock, req.params.id]
    );

    const newStatus = await syncProductStatus(conn, req.params.id);
    await conn.commit();

    res.json({
      message:   `Stok berhasil ditambah ${add_stock} porsi.`,
      new_stock: product.stock + add_stock,
      status:    newStatus,
      can_buy:   newStatus === 'available',
    });
  } catch (err) {
    await conn.rollback();
    console.error('[products/restock]', err);
    res.status(500).json({ message: 'Gagal restock produk.' });
  } finally {
    conn.release();
  }
});

module.exports = { router, syncProductStatus };
