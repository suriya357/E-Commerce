const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/orders/checkout
router.post('/checkout', protect, createOrder);

module.exports = router;