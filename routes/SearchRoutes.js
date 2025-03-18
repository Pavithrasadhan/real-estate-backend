
const express = require('express');
const Properties = require('../models/properties');
const Assets = require('../models/propertyassets');
const Agents = require('../models/agents');
const Amenities = require('../models/amenities');
const IncomeExpense = require('../models/incomeexpense');
const Lead = require('../models/leads');
const Document = require('../models/propertydocuments');
const User = require('../models/user');
const Message = require('../models/messages');
const router = express.Router();

router.get('/properties', async (req, res) => {
  try {
    const { search, page = 1, limit = 3 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { purpose: { $regex: search, $options: 'i' } },
        { amenities: { $regex: search, $options: 'i' } },
        { buildingName: { $regex: search, $options: 'i' } },
        { permitNo: { $regex: search, $options: 'i' } },
        { DED: { $regex: search, $options: 'i' } },
        { RERA: { $regex: search, $options: 'i' } },
        { BRN: { $regex: search, $options: 'i' } },
        { RefId: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const total = await Properties.countDocuments(query);
    const properties = await Properties.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      properties,
      total,
      totalPages: Math.ceil(total / pageSize),
      page: pageNumber,
      limit: pageSize,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/assets', async (req, res)=> {
  try {
  const { search, page=1, limit = 5} = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { property_name: { $regex: search, $options: 'i'} },
      { type: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNumber = parseInt (page);
  const pageSize = parseInt (limit);

  const total = await Assets.countDocuments(query);
  const assets = await Assets.find(query)
  .skip((pageNumber - 1)* pageSize)
  .limit(pageSize);

  res.json({
    assets,
    total,
    totalPages: Math.ceil(total / pageSize),
    page: pageNumber,
    limit: pageSize,
  });
}catch (error){
  res.status(500).json({ message: error.message });
}
});

router.get('/agents', async (req, res)=> {
  try {
  const { search, page=1, limit = 5} = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { agent_name: { $regex: search, $options: 'i'} },
      { contact_info: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { yearofexperience: { $regex: search, $options: 'i' } },
      { languagespoken: { $regex: search, $options: 'i' } },
      { expertise: { $regex: search, $options: 'i' } },
      { BRN: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNumber = parseInt (page);
  const pageSize = parseInt (limit);

  const total = await Agents.countDocuments(query);
  const agents = await Agents.find(query)
  .skip((pageNumber - 1)* pageSize)
  .limit(pageSize);

  res.json({
    agents,
    total,
    totalPages: Math.ceil(total / pageSize),
    page: pageNumber,
    limit: pageSize,
  });
}catch (error){
  res.status(500).json({ message: error.message });
}
});

router.get('/amenities', async (req, res)=> {
  try {
  const { search, page=1, limit = 5} = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i'} },
    ];
  }

  const pageNumber = parseInt (page);
  const pageSize = parseInt (limit);

  const total = await Amenities.countDocuments(query);
  const amenities = await Amenities.find(query)
  .skip((pageNumber - 1)* pageSize)
  .limit(pageSize);

  res.json({
    amenities,
    total,
    totalPages: Math.ceil(total / pageSize),
    page: pageNumber,
    limit: pageSize,
  });
}catch (error){
  res.status(500).json({ message: error.message });
}
});

router.get('/incomeexpense', async (req, res)=> {
  try {
  const { search, page=1, limit = 5} = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { property_name: { $regex: search, $options: 'i' }},
      { agent_name: { $regex: search, $options: 'i'} },
      { amount: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNumber = parseInt (page);
  const pageSize = parseInt (limit);

  const total = await IncomeExpense.countDocuments(query);
  const incomeexpense = await IncomeExpense.find(query)
  .skip((pageNumber - 1)* pageSize)
  .limit(pageSize);

  res.json({
    incomeexpense,
    total,
    totalPages: Math.ceil(total / pageSize),
    page: pageNumber,
    limit: pageSize,
  });
}catch (error){
  res.status(500).json({ message: error.message });
}
});

router.get('/lead', async (req, res)=> {
  try {
  const { search, page=1, limit = 5} = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { property_name: { $regex: search, $options: 'i'} },
      { buyer_name: { $regex: search, $options: 'i' } },
      { agent_name: { $regex: search, $options: 'i' } },
      { status: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNumber = parseInt (page);
  const pageSize = parseInt (limit);

  const total = await Lead.countDocuments(query);
  const lead = await Lead.find(query)
  .skip((pageNumber - 1)* pageSize)
  .limit(pageSize);

  res.json({
    lead,
    total,
    totalPages: Math.ceil(total / pageSize),
    page: pageNumber,
    limit: pageSize,
  });
}catch (error){
  res.status(500).json({ message: error.message });
}
});

router.get('/documents', async (req, res)=> {
  try {
  const { search, page=1, limit = 5} = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { property_name: { $regex: search, $options: 'i'} },
      { document_name: { $regex: search, $options: 'i' } },
      { document_type: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNumber = parseInt (page);
  const pageSize = parseInt (limit);

  const total = await Document.countDocuments(query);
  const document = await Document.find(query)
  .skip((pageNumber - 1)* pageSize)
  .limit(pageSize);

  res.json({
    document,
    total,
    totalPages: Math.ceil(total / pageSize),
    page: pageNumber,
    limit: pageSize,
  });
}catch (error){
  res.status(500).json({ message: error.message });
}
});

router.get('/user', async (req, res) => {
  try {
    const { search, page = 1, limit = 5, role } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      users,
      total,
      totalPages: Math.ceil(total / pageSize),
      page: pageNumber,
      limit: pageSize,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/message', async (req, res) => {
  try {
    const { search, page = 1, limit = 5, role } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const total = await Message.countDocuments(query);
    const message = await Message.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      message,
      total,
      totalPages: Math.ceil(total / pageSize),
      page: pageNumber,
      limit: pageSize,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
