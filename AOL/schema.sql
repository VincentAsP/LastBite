-- ============================================================
--  FOOD WASTE APP - DATABASE SCHEMA
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  name        VARCHAR(150) NOT NULL,
  category    ENUM('Sayuran','Buah','Daging','Susu','Roti','Minuman','Bumbu','Other') DEFAULT 'Other',
  quantity    DECIMAL(10,2) DEFAULT 1,
  unit        VARCHAR(20) DEFAULT 'pcs',
  expiry_date DATE NOT NULL,
  status      ENUM('active','wasted','donated','consumed') DEFAULT 'active',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expiry_date (expiry_date),
  INDEX idx_status (status)
);
