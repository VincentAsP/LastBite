const express = require('express');
const router = express.Router();
const { checkoutOrder, confirmPayment } = require('../controllers/orderController');

router.post('/checkout', checkoutOrder);
router.post('/confirm-payment', confirmPayment);

module.exports = router;