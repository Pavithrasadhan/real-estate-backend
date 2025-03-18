const express = require('express');
const Properties = require('../models/properties'); 

const router = express.Router();

const paginate = async (model, query, options) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  
  const results = await model.find(query)
    .skip(skip)
    .limit(limit)
    .exec();
  
  const total = await model.countDocuments(query);
  
  return {
    results,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

// GET /filter/properties
router.get('/properties', async (req, res) => {
  try {
    const {
      status,
      purpose,
      type,
      location,
      beds,
      baths,
      furnished,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (purpose) {
      query.purpose = purpose;
    }

    if (type) {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (beds) {
      query.beds = { $gte: parseInt(beds) };
    }

    if (baths) {
      query.baths = { $gte: parseInt(baths) };
    }

    if (furnished) {
      query.furnished = furnished;
    }

    if (minPrice || maxPrice) {
      query.base_price = {};
      if (minPrice) {
        query.base_price.$gte = parseFloat(minPrice); 
      }
      if (maxPrice) {
        query.base_price.$lte = parseFloat(maxPrice);
      }
    }

    const result = await paginate(Properties, query, { page, limit });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
