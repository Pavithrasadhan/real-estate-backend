const express = require('express');
const multer = require('multer');
const router = express.Router();
const Documents = require('../models/propertydocuments');
const Upload = require('../middleware/Multer');

// Create new document
router.post('/', Upload.single('documentFile'), async (req, res) => {
  const { property_name, document_name, document_type } = req.body;
  const documentFilePath = req.file ? req.file.path : null;

  try {
    if (!property_name || !document_name || !document_type || !documentFilePath) {
      return res.status(400).json({ message: 'All fields and file upload are required' });
    }

    const newDocument = new Documents({
      property_name,
      document_name,
      document_type,
      document_path: documentFilePath,
    });

    await newDocument.save();
    res.status(200).json({
      id: newDocument._id,
      property_name: newDocument.property_name,
      document_name: newDocument.document_name,
      document_type: newDocument.document_type,
      document_path: newDocument.document_path,
    });
  } catch (err) {
    console.error('Document upload error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Update document by property_name
router.put("/property/:property_name", Upload.single("documentFile"), async (req, res) => {
  try {
    const updatedData = {
      property_name: req.body.property_name,
      document_name: req.body.document_name,
      document_type: req.body.document_type,
    };

    if (req.file) {
      updatedData.document_path = req.file.path;
    }

    const updatedDocument = await Documents.findOneAndUpdate(
      { property_name: req.params.property_name },
      updatedData,
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found for the given property name" });
    }

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).send("Error updating document: " + error.message);
  }
});

// Get all documents
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
                    
    const total = await Documents.countDocuments();
            
    const documents = await Documents.find()
    .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            documents,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get document by ID
router.get("/:id", async (req, res) => {
  try {
    const document = await Documents.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(document);
  } catch (error) {
    res.status(500).send("Error fetching document");
  }
});

// Get documents by property name
router.get('/property/:property_name', async (req, res) => {
  try {
    const property_name = req.params.property_name;
    const documents = await Documents.find({ property_name: {$regex: new RegExp (property_name, 'i')} });

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: "No documents found for this property" });
    }

    documents.forEach(doc => {
      doc.document_url = `http://localhost:3007/uploads/${doc.document_path}`;
    });

    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a document by ID
router.delete('/:id', async (req, res) => {
  try {
    const document = await Documents.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await document.deleteOne();
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
