const express = require('express');
const router = express.Router();

const Leads = require("../models/leads"); 

//create new leads
router.post('/', async(req, res) => {
    const {property_name, buyer_name, agent_name, status} = req.body;
    try{
        const newLeads = new Leads({property_name, buyer_name, agent_name, status});
        await newLeads.save();
        res.status(200).json({newLeads});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

//get all leads
router.get('/', async(req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
                        
        const total = await Leads.countDocuments();
                
        const leads = await Leads.find()
        .skip((page - 1) * limit)
        .limit(limit);

    res.json({
        leads,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    });
    }catch(err){
        res.status(500).json({message : err.message});
    }
});

//get leads using id
router.get('/:id', async(req, res) => {
    try{
        const lead = await Leads.findById(req.params.id);
        if(!lead) return res.status(500).json({message : "lead not found"});
        res.json(lead);
    }catch(err){
        res.status(500).json({message : err.message});
    }
});

//update leads using id
router.put('/property/:property_name', async(req, res)=> {
    const { property_name, buyer_name, agent_name, status} = req.body;
    try{
        const lead = await Leads.findOne( { property_name: req.params.property_name });
        if(!lead) return res.status(500).json({message : "lead not found"});

        lead.property_name = property_name;
        lead.buyer_name = buyer_name;
        lead.agent_name = agent_name;
        lead.status = status;

        await lead.save();
        res.status(200).json(lead);
    }catch(err){
        res.status(500).json({message : err.message});
    }
});

//delete lead using id
router.delete('/:id', async(req, res) => {
    try{
        const lead = await Leads.findById(req.params.id);
        if(!lead) return res.status(500).json({message : "lead not found"});

        await lead.deleteOne();
        res.status(200).json({message : "Lead deleted successfully"});
    }catch(err){
        res.status(500).json({message : err.message});
    }
});

router.get('/property/:property_name', async (req, res) => {
  try {
    const property_name = req.params.property_name;
    const lead = await Leads.find({ property_name: {$regex: new RegExp (property_name, 'i')} });

    if (!lead || lead.length === 0) {
      return res.status(404).json({ message: "No lead found for this property" });
    }

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;