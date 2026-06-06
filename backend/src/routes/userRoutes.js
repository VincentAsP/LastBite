const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const {
  deleteAccount,
  changePassword,
  updateProfile,
  getUserPoints,
} = require('../controllers/userController');


router.get('/nearby',                  productController.getProductsByGeolocation);
router.get('/points/:userID',          getUserPoints);
router.put('/profile',                 updateProfile);       
router.put('/change-password',         changePassword);      
router.delete('/delete/:userID',       deleteAccount);

module.exports = router;
