const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/Multer');
const Agent = require('../models/agents');

// GET all agents with pagination
// GET all agents with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await Agent.countDocuments();
    const agent = await Agent.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      agent,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single agent by ID
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new agent with a single image upload
router.post('/', upload.single('image'), async (req, res) => {
    const { agent_name, contact_info, email, yearofexperience, languagespoken, expertise, BRN, description } = req.body;
  
    try {
      if (!agent_name || !contact_info || !email || !yearofexperience || !languagespoken || !expertise || !BRN || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newAgent = new Agent({
        agent_name,
        contact_info,
        email,
        yearofexperience,
        languagespoken,
        expertise,
        BRN,
        description,
        image: req.file ? req.file.path : null,
      });
  
      await newAgent.save();
      res.status(201).json({ newAgent });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
// PUT (update) an agent by ID with optional image upload
router.put('/:id', upload.single('image'), async (req, res) => {
  const { agent_name, contact_info, email, yearofexperience, languagespoken, expertise, BRN, description } = req.body;

  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    agent.agent_name = agent_name;
    agent.contact_info = contact_info;
    agent.email = email;
    agent.yearofexperience = yearofexperience;
    agent.languagespoken = languagespoken;
    agent.expertise = expertise;
    agent.BRN = BRN;
    agent.description = description;

    if (req.file) {
      if (agent.image && fs.existsSync(agent.image)) {
        try {
          fs.unlinkSync(agent.image);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      agent.image = req.file.path;
    }

    await agent.save();
    res.status(200).json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE an agent by ID
router.delete('/:id/image', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    if (agent.image && fs.existsSync(agent.image)) {
      try {
        fs.unlinkSync(agent.image);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    await agent.deleteOne();
    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async(req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);
        if (!agent) {
            return res.status(404).json({ message: 'user not found'});
        }

        await agent.deleteOne();
        res.status(200).json({ message: 'user deleted successfully'});
    }catch(err) {
        res.status(500).json({ message: err.message});
    }
});


// GET agents by property name
router.get('/property/:property_name', async (req, res) => {
  try {
    const property_name = req.params.property_name;
    const agent = await Agent.find({ property_name: { $regex: new RegExp(property_name, 'i') } });

    if (!agent || agent.length === 0) {
      return res.status(404).json({ message: 'No agent found for this property' });
    }
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET agent by name
router.get('/name/:agent_name', async (req, res) => {
  try {
    const agent = await Agent.findOne({ agent_name: { $regex: new RegExp(req.params.agent_name, 'i') } });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
