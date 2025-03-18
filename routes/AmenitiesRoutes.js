const express= require('express');
const router=express.Router();

const Amenities = require('../models/amenities');

router.get('/', async(req,res) => { 
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
                
        const total = await Amenities.countDocuments();
                
        const amenities = await Amenities.find()
        .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            amenities,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/:id', async (req, res) => {
    try{
        const amenities = await Amenities.findById(req.params.id);
        if(!amenities) return res.status(404).json({message: "Amenities is not found"});
        res.json(amenities);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});


router.post('/', async(req, res) => {
    const { name, icon} = req.body;
    try{
        const newAmenities = new Amenities ({ name, icon});
        await newAmenities.save();
        res.status(200).json({newAmenities});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.put('/:id', async(req, res) => {
    const { name, icon} = req.body;
    try{
        const amenities = await Amenities.findById(req.params.id);
        if(!amenities) return res.status(500).json({message: "Amenities not found"});

        amenities.name = name;
        amenities.icon = icon;
        
        await amenities.save();
        res.status(200).json(amenities);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.delete('/:id', async(req, res) =>{
    try{
        const amenities = await Amenities.findById(req.params.id);
        if(!amenities) return res.status(500).json({message: "amenities not found"});

        await amenities.deleteOne();
        res.status(200).json({message: "amenities deleted successfully"});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});


module.exports = router;