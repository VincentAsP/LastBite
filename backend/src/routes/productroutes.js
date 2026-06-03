const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/addProduct', productController.addProduct);
router.post('/getProduct', productController.getProductsByGeolocation);
router.get('/stock/:productID', productController.getProductStock);

module.exports = router;