// backend/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Coffee = require('./models/Coffee');
const Order = require('./models/Order'); // Add this line

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // CLEAR OLD DATA
    await Coffee.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared old coffees & orders');

    // SEED NEW COFFEES
    const coffees = [
      { name: 'Espresso', price: 4.99, image: 'espresso.jpg', category: 'Hot', description: 'Strong and bold espresso shot' },
      { name: 'Cappuccino', price: 5.99, image: 'cappuccino.jpg', category: 'Hot', description: 'Espresso with steamed milk foam' },
      { name: 'Latte', price: 6.49, image: 'latte.jpg', category: 'Hot', description: 'Smooth espresso with steamed milk' },
      { name: 'Ice Coffee', price: 5.49, image: 'icecoffee.jpg', category: 'Cold', description: 'Refreshing cold brewed coffee' },
      { name: 'Croissant', price: 3.99, image: 'croissants.jpg', category: 'Pastry', description: 'Buttery French croissant' },
      { name: 'Muffin', price: 4.49, image: 'muffins.jpg', category: 'Pastry', description: 'Fresh baked blueberry muffin' }
    ];

    await Coffee.insertMany(coffees);
    console.log('Seeded 6 coffees successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();