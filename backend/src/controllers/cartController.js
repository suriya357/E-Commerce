const redisClient = require('../config/redis');

// Get the user's cart from Redis
const getCart = async (req, res) => {
  try {
    // req.userId is attached by our authMiddleware
    const cart = await redisClient.get(`cart:${req.userId}`);
    res.status(200).json(cart ? JSON.parse(cart) : []);
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save the user's entire cart to Redis
const saveCart = async (req, res) => {
  // The frontend will send the entire cart array in the body
  const cartItems = req.body;
  try {
    // req.userId is attached by our authMiddleware
    await redisClient.set(`cart:${req.userId}`, JSON.stringify(cartItems));
    res.status(200).json({ message: 'Cart saved successfully' });
  } catch (error) {
    console.error('Error saving cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, saveCart };