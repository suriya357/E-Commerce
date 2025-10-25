const db = require('../config/db');
const redisClient = require('../config/redis');

const createOrder = async (req, res) => {
  const { cartItems, shippingAddress, totalPrice } = req.body;
  const userId = req.userId;

  const client = await db.getClient(); // Use a client for transactions

  try {
    await client.query('BEGIN'); // Start transaction

    // 1. Create the order
    const orderRes = await client.query(
      'INSERT INTO orders (user_id, total_price, shipping_address) VALUES ($1, $2, $3) RETURNING id',
      [userId, totalPrice, shippingAddress]
    );
    const orderId = orderRes.rows[0].id;

    // 2. Insert each cart item into order_items
    for (const item of cartItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    // 3. Clear the user's cart from Redis
    await redisClient.del(`cart:${userId}`);

    await client.query('COMMIT'); // Commit transaction
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    await client.query('ROLLBACK'); // Roll back on error
    console.error(error);
    res.status(500).json({ message: 'Server error during checkout' });
  } finally {
    client.release();
  }
};

// Add getClient to the db module export if you haven't already
// In backend/src/config/db.js -> module.exports = { query: ..., getClient: () => pool.connect() }
module.exports = { createOrder };