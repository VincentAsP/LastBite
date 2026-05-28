require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import rute 
const authRoutes = require('./src/routes/authroutes');
const productRoutes = require('./src/routes/productroutes');
const orderRoutes = require('./src/routes/orderroutes');
const { startCronJobs } = require('./src/utils/cron')

const app = express();
const port = 3000;

// Middleware Global
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'src/public/uploads')));

// app.use('/', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/impact', impactRoutes);
 

startCronJobs();

// Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend running on port ${port}`);
});
