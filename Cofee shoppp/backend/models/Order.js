// backend/models/Order.js
const mongoose = require('mongoose');

// ADD THIS LINE — THIS IS THE FIX FOR "Cannot overwrite model"
if (mongoose.models.Order) {
  module.exports = mongoose.models.Order;
} else {
  const orderItemSchema = new mongoose.Schema({
    coffee: { type: mongoose.Schema.Types.ObjectId, ref: 'Coffee', required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    price: { type: Number, required: true }
  });

  const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card'], default: 'cash' },
    status: { type: String, enum: ['pending', 'preparing', 'ready', 'delivered'], default: 'pending' }
  }, { timestamps: true });

  module.exports = mongoose.model('Order', orderSchema);
}