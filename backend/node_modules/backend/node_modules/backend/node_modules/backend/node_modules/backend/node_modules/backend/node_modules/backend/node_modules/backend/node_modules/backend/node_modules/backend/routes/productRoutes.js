const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/non-eco', productController.getNonEcoProducts);

module.exports = router;