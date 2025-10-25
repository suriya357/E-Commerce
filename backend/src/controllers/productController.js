const db = require('../config/db');

// Updated to handle both category and search filtering
const getAllProducts = async (req, res) => {
  const { category, search } = req.query; // Get category and search from query params
  try {
    let query = 'SELECT * FROM products';
    const params = [];
    const whereClauses = [];
    let paramIndex = 1;

    if (category) {
      whereClauses.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    if (search) {
      // Use ILIKE for case-insensitive matching
      whereClauses.push(`name ILIKE $${paramIndex++}`);
      params.push(`%${search}%`); // Add wildcards for partial matching
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Unchanged functions
const getProductById = async (req, res) => {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (rows.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(rows[0]);
};

const getCategories = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT category, COUNT(*) as product_count FROM products GROUP BY category ORDER BY category'
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
};