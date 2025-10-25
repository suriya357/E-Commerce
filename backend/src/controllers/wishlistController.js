const db = require('../config/db');

const getWishlist = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT p.* FROM products p JOIN wishlist w ON p.id = w.product_id WHERE w.user_id = $1',
      [req.userId]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    await db.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.userId, productId]
    );
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  try {
    await db.query(
      'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [req.userId, productId]
    );
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };