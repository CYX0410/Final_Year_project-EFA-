const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products/non-eco', productController.getNonEcoProducts);

module.exports = router;