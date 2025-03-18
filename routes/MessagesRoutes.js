const express= require('express');
const router=express.Router();

const Message = require('../models/messages');

router.post("/", async (req, res) => {
    const { name, phone, email, message } = req.body;
  try {
    
    const newMessage = new Message({ name, phone, email, message });
    await newMessage.save();
    res.status(201).json({newMessage});
  } catch (error) {
    res.status(500).json({ error: "Failed to add message" });
  }
});

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
                    
    const total = await Message.countDocuments();
            
    const message = await Message.find()
    .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            message,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/", async (req, res) => {
    try {
      const { messageContent } = req.body;
  
      const deletedMessage = await Message.findOneAndDelete({ message: messageContent });
  
      if (!deletedMessage) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      res.status(200).json({ message: "Message deleted successfully", deletedMessage });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  });
  
module.exports = router;