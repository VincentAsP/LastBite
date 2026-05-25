require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import rute 
const authRoutes = require('./src/routes/authroutes');
const productRoutes = require('./src/routes/productroutes');

const app = express();
const port = 3000;

// Middleware Global
app.use(cors());
app.use(express.json());

// Karena kita pasang '/api' di sini, maka URL akhirnya menjadi /api/register dan /api/login
app.use('/lastbite', authRoutes);
app.use('/product', productRoutes)
app.use('/user', )


// Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${port}`);
});