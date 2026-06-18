const express = require('express');
const router = express.Router();
const Coffee = require('../models/Coffee');

// GET all coffees
router.get('/', async (req, res) => {
  try {
    const coffees = await Coffee.find({ isAvailable: true }).sort({ createdAt: -1 });
    res.json(coffees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single coffee by ID
router.get('/:id', async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id);
    if (!coffee) return res.status(404).json({ message: 'Coffee not found' });
    res.json(coffee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;