const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// URL: GET /api/products/nearby?lat=...&lng=...
router.get('/nearby', productController.getProductsByGeolocation);

module.exports = router;