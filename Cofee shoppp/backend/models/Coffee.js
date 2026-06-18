// backend/models/Coffee.js
const mongoose = require('mongoose');

if (mongoose.models.Coffee) {
  module.exports = mongoose.models.Coffee;
} else {
  const coffeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    size: [{ type: String, default: ['Small', 'Medium', 'Large'] }],
    isAvailable: { type: Boolean, default: true }
  }, { timestamps: true });

  module.exports = mongoose.model('Coffee', coffeeSchema);
}