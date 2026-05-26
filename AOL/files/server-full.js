// backend/server.js  (versi lengkap — gabungkan dengan server.js sebelumnya)
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');
const mysql   = require('mysql2/promise');
const https   = require('https');
const fs      = require('fs');

const app         = express();
const HTTP_PORT   = process.env.PORT      || 5000;
const HTTPS_PORT  = process.env.HTTPS_PORT || 5443;

// ---- Middleware global ----
app.use(cors({
  origin:         process.env.FRONTEND_URL || 'http://localhost:3000',
  methods:        ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials:    true,
}));
app.use(express.json());

// ---- Database pool ----
const pool = mysql.createPool({
  host:             process.env.DB_HOST,
  user:             process.env.DB_USER,
  password:         process.env.DB_PASSWORD,
  database:         process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:  10,
});

pool.getConnection()
  .then(() => console.log('✅ Connected to MySQL Database!'))
  .catch((err) => console.error('❌ MySQL Connection Error:', err.message));

// Expose pool ke semua routes via app.locals
app.locals.pool = pool;

// ============================================================
//  ROUTES
// ============================================================
const { authenticateToken } = require('./middleware/auth');
const { registerTokenRoute, unregisterTokenRoute } = require('./services/fcmService');

// Auth (dari server.js sebelumnya)
const authRoutes = require('./routes/authRoutes');       // register + login
app.use('/api', authRoutes);

// Password reset
const passwordRoutes = require('./routes/passwordRoutes');
app.use('/api/password', passwordRoutes);

// Products
const { router: productRouter } = require('./routes/productRoutes');
app.use('/api/products', productRouter);

// Checkout
const checkoutRoutes = require('./routes/checkoutRoutes');
app.use('/api/checkout', checkoutRoutes);

// Orders
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', authenticateToken, orderRoutes);

// FCM token management
app.post('/api/notifications/register-token',   authenticateToken, (req, res) => registerTokenRoute(pool)(req, res));
app.delete('/api/notifications/unregister-token', authenticateToken, (req, res) => unregisterTokenRoute(pool)(req, res));

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ============================================================
//  SCHEDULED JOBS
// ============================================================
const { startAllJobs } = require('./jobs/scheduledJobs');
startAllJobs(pool);

// ============================================================
//  SERVER START
// ============================================================
app.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`🚀 HTTP  server running on port ${HTTP_PORT}`);
});

const sslKey  = process.env.SSL_KEY_PATH  || './ssl/key.pem';
const sslCert = process.env.SSL_CERT_PATH || './ssl/cert.pem';
if (fs.existsSync(sslKey) && fs.existsSync(sslCert)) {
  https.createServer({ key: fs.readFileSync(sslKey), cert: fs.readFileSync(sslCert) }, app)
    .listen(HTTPS_PORT, '0.0.0.0', () => console.log(`🔒 HTTPS server running on port ${HTTPS_PORT}`));
} else {
  console.warn('⚠️  SSL cert tidak ditemukan. Jalankan: bash generate-ssl.sh');
}
