require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const HTTP_PORT = 5000;
const HTTPS_PORT = 5443;

// --- CORS CONFIG ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// --- DATABASE CONNECTION POOL ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then(() => console.log('✅ Connected to MySQL Database!'))
  .catch((err) => console.error('❌ MySQL Connection Error:', err.message));

// --- JWT MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// ============================================================
//  AUTH ROUTES
// ============================================================

// 1. REGISTRATION
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username already taken!' });
    }
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const user = users[0];
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful!', token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ============================================================
//  FOOD ITEMS ROUTES  (Protected)
// ============================================================

// GET all food items milik user yang login
app.get('/api/food-items', authenticateToken, async (req, res) => {
  try {
    const [items] = await pool.query(
      'SELECT * FROM food_items WHERE user_id = ? ORDER BY expiry_date ASC',
      [req.user.id]
    );
    res.json({ data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch food items' });
  }
});

// POST tambah food item baru
app.post('/api/food-items', authenticateToken, async (req, res) => {
  const { name, category, quantity, unit, expiry_date, status } = req.body;
  if (!name || !expiry_date) {
    return res.status(400).json({ message: 'Name and expiry_date are required.' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO food_items (user_id, name, category, quantity, unit, expiry_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, category || 'Other', quantity || 1, unit || 'pcs', expiry_date, status || 'active']
    );
    res.status(201).json({ message: 'Food item added!', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add food item' });
  }
});

// PUT update food item
app.put('/api/food-items/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, unit, expiry_date, status } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE food_items SET name=?, category=?, quantity=?, unit=?, expiry_date=?, status=?
       WHERE id=? AND user_id=?`,
      [name, category, quantity, unit, expiry_date, status, id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found or not authorized.' });
    }
    res.json({ message: 'Food item updated!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update food item' });
  }
});

// DELETE food item
app.delete('/api/food-items/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM food_items WHERE id=? AND user_id=?',
      [id, req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found or not authorized.' });
    }
    res.json({ message: 'Food item deleted!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete food item' });
  }
});

// ============================================================
//  LAPORAN & STATISTIK ROUTES  (Protected)
// ============================================================

// GET ringkasan statistik waste
app.get('/api/reports/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM food_items WHERE user_id=?', [userId]
    );
    const [[{ wasted }]] = await pool.query(
      'SELECT COUNT(*) as wasted FROM food_items WHERE user_id=? AND status="wasted"', [userId]
    );
    const [[{ expired }]] = await pool.query(
      'SELECT COUNT(*) as expired FROM food_items WHERE user_id=? AND expiry_date < ? AND status="active"',
      [userId, today]
    );
    const [[{ donated }]] = await pool.query(
      'SELECT COUNT(*) as donated FROM food_items WHERE user_id=? AND status="donated"', [userId]
    );

    res.json({
      data: {
        total_items: total,
        wasted_items: wasted,
        expired_items: expired,
        donated_items: donated,
        waste_rate: total > 0 ? ((wasted / total) * 100).toFixed(1) : '0.0',
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch report summary' });
  }
});

// GET waste per kategori (untuk chart)
app.get('/api/reports/by-category', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT category, status, COUNT(*) as count
       FROM food_items WHERE user_id=?
       GROUP BY category, status`,
      [req.user.id]
    );
    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch category report' });
  }
});

// GET waste per bulan (trend)
app.get('/api/reports/monthly-trend', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, status, COUNT(*) as count
       FROM food_items WHERE user_id=?
       GROUP BY month, status
       ORDER BY month DESC
       LIMIT 12`,
      [req.user.id]
    );
    res.json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch monthly trend' });
  }
});

// ============================================================
//  HTTPS CONFIG
// ============================================================
const startServer = () => {
  // HTTP Server (selalu jalan)
  app.listen(HTTP_PORT, '0.0.0.0', () => {
    console.log(`🚀 HTTP  server running on port ${HTTP_PORT}`);
  });

  // HTTPS Server (jika cert tersedia)
  const sslKeyPath  = process.env.SSL_KEY_PATH  || './ssl/key.pem';
  const sslCertPath = process.env.SSL_CERT_PATH || './ssl/cert.pem';

  if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    const httpsOptions = {
      key:  fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
    };
    https.createServer(httpsOptions, app).listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log(`🔒 HTTPS server running on port ${HTTPS_PORT}`);
    });
  } else {
    console.warn('⚠️  SSL certs not found. HTTPS server skipped. Run: npm run generate-ssl');
  }
};

startServer();
