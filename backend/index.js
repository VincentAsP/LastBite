require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import rute 
const authRoutes = require('./src/routes/authroutes');

const app = express();
const port = 3000;

// Middleware Global
app.use(cors());
app.use(express.json());

// Karena kita pasang '/api' di sini, maka URL akhirnya menjadi /api/register dan /api/login
app.use('/api', authRoutes);

// Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${port}`);
});