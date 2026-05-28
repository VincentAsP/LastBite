const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
});

pool.getConnection()
  .then(() => console.log('Connected to MySQL Database!'))
  .catch((err) => console.error('MySQL Connection Error:', err.message));

module.exports = pool;