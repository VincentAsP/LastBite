-- ============================================================
--  FOOD WASTE MARKETPLACE — Schema Extension
--  Tambahan tabel untuk fitur baru
-- ============================================================

-- Tabel password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  token      VARCHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used       TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id)
);

-- Tabel produk makanan restoran
CREATE TABLE IF NOT EXISTS products (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT NOT NULL,
  name         VARCHAR(150) NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2) NOT NULL,
  stock        INT NOT NULL DEFAULT 0,
  status       ENUM('available','habis','disabled') DEFAULT 'available',
  image_url    VARCHAR(255),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_stock (stock)
);

-- Tabel orders / pesanan
CREATE TABLE IF NOT EXISTS orders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  buyer_id        INT NOT NULL,
  restaurant_id   INT NOT NULL,
  total_price     DECIMAL(10,2) NOT NULL,
  status          ENUM('pending','paid','processing','selesai','cancelled','expired') DEFAULT 'pending',
  payment_token   VARCHAR(255),              -- Midtrans / payment gateway token
  payment_deadline DATETIME,                -- deadline < 2 menit dari created_at
  points_awarded  TINYINT(1) DEFAULT 0,     -- flag apakah poin sudah diberikan
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_buyer_id (buyer_id),
  INDEX idx_payment_deadline (payment_deadline)
);

-- Tabel item per order
CREATE TABLE IF NOT EXISTS order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT NOT NULL,
  price      DECIMAL(10,2) NOT NULL,        -- harga saat transaksi (snapshot)
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabel poin (sudah ada — pastikan kolom ini tersedia)
-- Jika strukturnya berbeda, sesuaikan di pointsRoutes.js
CREATE TABLE IF NOT EXISTS user_points (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL UNIQUE,
  total_points INT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Riwayat transaksi poin
CREATE TABLE IF NOT EXISTS point_transactions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  order_id    INT,
  change      INT NOT NULL,                 -- positif = tambah, negatif = kurang
  reason      VARCHAR(100),                 -- 'order_selesai', 'redeem', dll
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- FCM tokens untuk push notification
CREATE TABLE IF NOT EXISTS fcm_tokens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  token      VARCHAR(255) NOT NULL,
  device     VARCHAR(50),                   -- 'android','ios','web'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_token (user_id, token),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
