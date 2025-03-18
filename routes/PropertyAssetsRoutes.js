const express = require('express');
const router = express.Router();
const Assets = require('../models/propertyassets');

// Add asset
router.post('/', async (req, res) => {
  const { property_name, type, description } = req.body;
  try {
    const newAssets = new Assets({ property_name, type, description });
    await newAssets.save();
    res.status(200).json({ newAssets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get assets with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const total = await Assets.countDocuments();
    const assets = await Assets.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      assets,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get asset by ID
router.get('/:id', async (req, res) => {
  try {
    const asset = await Assets.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get assets by property_name
router.get('/property/:property_name', async (req, res) => {
  try {
    const  property_name = req.params.property_name;
    const assets = await Assets.find({ property_name: {$regex: new RegExp (property_name, 'i')} });
    if (!assets || assets.length === 0) {
      return res.status(404).json({ message: 'Assets not found for this property' });
    }
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error: error.message });
  }
});

// Update asset by property_name
router.put('/property/:property_name', async (req, res) => {
  const { property_name, type, description } = req.body;
  try {
    const asset = await Assets.findOne({ property_name: req.params.property_name });

    if (!asset) return res.status(404).json({ message: "Assets not found" });

    asset.property_name = property_name;
    asset.type = type;
    asset.description = description;

    await asset.save();

    res.status(200).json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete asset
router.delete('/:id', async (req, res) => {
  try {
    const asset = await Assets.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    await asset.deleteOne();
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
