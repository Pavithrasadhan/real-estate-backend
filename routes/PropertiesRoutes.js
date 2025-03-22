const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Properties = require('../models/properties');
const Upload = require('../middleware/Multer');

router.post('/', Upload.fields([
    { name: 'image', maxCount: 20 },
    { name: 'QRcode', maxCount: 1 },
  ]), async (req, res) => {
    try {
      const {
        owner_name, agent_name, name, description, type, purpose, amenities, beds, baths, sqft, location,
        furnished, mapLink, availablefrom, addedDate, buildingName, yearofcompletion, floors,
        permitNo, DED, RERA, BRN, RefId, visibility, base_price, status
      } = req.body;
  
      const uniqueFiles = req.files?.image
        ? req.files.image.filter(
            (file, index, self) =>
              index === self.findIndex((f) => f.path === file.path)
          )
        : [];
      const image = uniqueFiles.map((file) => file.path);
      const QRcode = req.files?.QRcode ? req.files.QRcode[0].path : null;
  
      const newProperty = new Properties({
        owner_name, agent_name, name, description, image, type, purpose,
        amenities: Array.isArray(amenities) ? amenities : amenities?.split(',').map(item => item.trim()) || [],
        beds, baths, sqft, location, furnished, mapLink, availablefrom, addedDate,
        buildingName, yearofcompletion, floors, permitNo, DED, RERA, BRN, RefId, QRcode,
        visibility, base_price, status
      });
  
      await newProperty.save();
      res.status(201).json({ message: 'Property added successfully', property: newProperty });
    } catch (err) {
      console.error('Error creating property:', err);
      res.status(500).json({ message: 'Error creating property', error: err.message });
    }
  });


  router.put('/:id', Upload.fields([
    { name: 'image', maxCount: 20 },
    { name: 'QRcode', maxCount: 1 },
  ]), async (req, res) => {
    try {
      const { id } = req.params;
      const property = await Properties.findById(id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
  
      if (req.files?.image) {
        const newImages = req.files.image.map(file => file.path);
        if (req.body.replaceImages === 'true') {
          property.image = newImages;
        } else {
          property.image = [...property.image, ...newImages];
        }
      }
  
      if (req.files?.QRcode) {
        const newQRPath = req.files.QRcode[0].path;
        if (property.QRcode) {
          const oldQRPath = path.join(__dirname, '..', property.QRcode);
          if (fs.existsSync(oldQRPath)) {
            fs.unlinkSync(oldQRPath);
          }
        }
        property.QRcode = newQRPath;
      }
  
      if (req.body.amenities !== undefined) {
        try {
          let newAmenities;
          if (typeof req.body.amenities === 'string' && req.body.amenities.startsWith('[')) {
            newAmenities = JSON.parse(req.body.amenities);
          } else if (Array.isArray(req.body.amenities)) {
            newAmenities = req.body.amenities;
          } else if (typeof req.body.amenities === 'string') {
            newAmenities = req.body.amenities.split(',').map(item => item.trim());
          }
  
          if (newAmenities && JSON.stringify(newAmenities) !== JSON.stringify(property.amenities)) {
            property.amenities = newAmenities;
          }
        } catch (error) {
          console.error('Error parsing amenities:', error);
        }
      }

      const { amenities, ...updateData } = req.body;
      Object.assign(property, updateData);
  
      const updatedProperty = await property.save();
      res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (err) {
      console.error('Property update error:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  });

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const total = await Properties.countDocuments();
        const properties = await Properties.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            properties,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (err) {
        console.error('Error fetching properties:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

router.get('/search/:property_name', async (req, res) => {
    try {
        const property_name = req.params.property_name;
        const property = await Properties.find({ name: { $regex: new RegExp(property_name, 'i') } });

        if (!property || property.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching property', error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const property = await Properties.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching property', error: error.message });
    }
});

  
router.get('/owner/:name', async (req, res) => {
    try {
        const ownerName = req.params.name;
        const properties = await Properties.find({ 
            owner_name: {$regex: new RegExp(ownerName, 'i')} });
        if (!properties || properties.length === 0) {
            return res.status(404).json({ message: 'No properties found for this owner' });
        }
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties', error: error.message });
    }
});


router.get('/agent/:name', async (req, res) => {
    try {
        const agentName = req.params.name;
        const properties = await Properties.find({
            agent_name: { $regex: new RegExp(agentName, 'i') } 
        });
        if (!properties || properties.length === 0) {
            return res.status(404).json({ message: 'No properties found for this Agent' });
        }
        res.json(properties);
    } catch (error) {
        console.error('Full error:', error); 
        res.status(500).json({ message: 'Error fetching properties', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const property = await Properties.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        await property.deleteOne();
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete('/:id/image', async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;
  
      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required' });
      }
  
      const property = await Properties.findById(id);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
  
      const imageIndex = property.image.indexOf(imageUrl);
      if (imageIndex === -1) {
        return res.status(404).json({ message: 'Image not found in the property' });
      }
  
      property.image.splice(imageIndex, 1);
  
      const imagePath = path.join(__dirname, '..', imageUrl);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); 
        }
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
  
      await property.save();
      res.status(200).json({ message: 'Image deleted successfully', property });
    } catch (err) {
      console.error('Error deleting image:', err);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  });

module.exports = router;
