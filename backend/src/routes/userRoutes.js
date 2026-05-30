const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { deleteAccount } = require('../controllers/userController');

router.get('/nearby', productController.getProductsByGeolocation);
router.delete('/delete/:userID', deleteAccount);

module.exports = router;