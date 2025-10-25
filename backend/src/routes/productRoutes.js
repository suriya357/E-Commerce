const express = require('express');
const router = express.Router();
// Make sure to import getCategories
const { getAllProducts, getProductById, getCategories } = require('../controllers/productController');

// GET /api/products -> Get all products (can be filtered by ?category=...)
router.get('/', getAllProducts);

// GET /api/categories -> Get all categories
router.get('/categories', getCategories); // Add this new route

// GET /api/products/:id -> Get single product
router.get('/:id', getProductById);

module.exports = router;