const express = require('express');
const router = express.Router();
const { getCart, saveCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// Route for GET /api/cart
router.get('/', getCart);

// Route for POST /api/cart
router.post('/', saveCart);

module.exports = router;