const express = require('express');
const router = express.Router();
const { checkoutOrder, confirmPayment, getInvoice } = require('../controllers/orderController');

router.post('/checkout', checkoutOrder);
router.post('/confirm-payment', confirmPayment);
router.get('/invoice/:orderID', getInvoice);

module.exports = router;