const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/addProduct', productController.addProduct);
router.get('/getProduct', productController.getAllProducts);
router.get('/stock/:productID', productController.getProductStock);

module.exports = router;