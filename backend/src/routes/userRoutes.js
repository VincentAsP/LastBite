const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { deleteAccount } = require('../controllers/userController');
const { getUserPoints } = require('../controllers/userController');

router.get('/nearby', productController.getProductsByGeolocation);
router.delete('/delete/:userID', deleteAccount);
router.get('/points/:userID', getUserPoints);

module.exports = router;