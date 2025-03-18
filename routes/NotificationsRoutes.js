
const express = require('express');
const router = express.Router();

const Notifications = require('../models/notification');

//get all notification
router.get('/', async(req, res) => {
    try{
        const notification = await Notifications.find();
        res.json(notification);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

//mark as read
router.post('/:id', async (req, res) => {
    try {
        const notification = await Notifications.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: "Notification not found" });

        notification.read = true;
        await notification.save();
        res.status(200).json({ message: "Notification marked as read" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//delete specific notification
router.delete('/:id', async(req, res) => {
    try{
        const notification = await Notifications.findById(req.params.id);
        if(!notification) return res.status(500).json({message: "Notification not found"});

        await notification.deleteOne();
        res.status(200).json({message: "Notification deleted successfully"});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

module.exports = router;


