const express = require('express');
const router = express.Router();

const Properties = require('../models/properties');
const Leads = require("../models/leads");

//get properties pending approval
router.get('/pending', async(req, res) => {
    try{
        const pendingproperties = await Properties.find({status: "pending"});
        res.json(pendingproperties);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

//approve property
router.post('/approve/:propertyid', async(req, res) => {
    try{
        const property = await Properties.findById(req.params.propertyid);
        if(!property) return res.status(404).json({message: 'property not found'});
        property.status = 'approved';
        await property.save();
        res.status(200).json({ message: "Property approved successfully"});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

//reject property
router.post('/reject/:propertyid', async(req, res) => {
    try{
        const property = await Properties.findById(req.params.propertyid);
        if(!property) return res.status(404).json({message: "property not found"});
        property.status = 'rejected';
        await property.save();
        res.status(200).json({ message: "Property rejected successfully"});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/leads', async(req, res) => {
    try{
        const lead = await Leads.find();
        res.status(200).json(lead);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;