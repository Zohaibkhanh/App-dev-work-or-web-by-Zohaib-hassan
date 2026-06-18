// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const Order = require('./models/Order'); // ← THIS LINE WAS MISSING — NOW ADDED!

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SERVE IMAGES FROM assets FOLDER — 100% WORKING
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.use('/api/coffees', require('./routes/coffeeRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CoffeeShop API is LIVE!',
    endpoints: {
      coffees: 'http://192.168.100.12:5000/api/coffees',
      orders: 'http://192.168.100.12:5000/api/orders',
      images: 'http://192.168.100.12:5000/assets/cappuccino.jpg'
    }
  });
});

// DELETE ORDER — NOW WORKS 100%
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order cancelled & deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON http://localhost:${PORT}`);
  console.log(`IMAGES → http://192.168.100.12:5000/assets/cappuccino.jpg`);
  console.log(`CANCEL ORDER → DELETE /api/orders/your-order-id`);
});