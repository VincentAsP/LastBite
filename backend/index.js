require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const winston = require('winston');
const util = require('util');
const fs = require('fs');

if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }) 
    ]
});

const originalConsoleError = console.error;
console.error = function (...args) {
    const message = util.format(...args); 
    
    logger.error(message);
    
    originalConsoleError.apply(console, args);
};

// Import rute 

const authRoutes = require('./src/routes/authroutes');
const productRoutes = require('./src/routes/productroutes');
const orderRoutes = require('./src/routes/orderroutes');
const impactRoutes = require('./src/routes/impactroutes');
const reportRoutes = require('./src/routes/reportRoutes');
const userRoutes = require('./src/routes/userRoutes');
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
app.use('/api/report', reportRoutes);
app.use('/api/users', userRoutes);
 

startCronJobs();

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend running on port ${port}`);
});
