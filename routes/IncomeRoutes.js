const express = require('express');
const router = express.Router();
const Income = require('../models/incomeexpense');

// Add income
router.post('/', async (req, res) => {
    try {
        const { property_name, agent_name, amount, type } = req.body;
        const newIncome = new Income({ property_name, agent_name, amount, type });
        await newIncome.save();
        res.status(201).json({ message: "Income added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all incomes
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const total = await Income.countDocuments({ type: 'Income' });
        const income = await Income.find({ type: 'Income' })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            income,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get income by ID
router.get('/:id', async (req, res) => {
    try {
        const income = await Income.findOne({ _id: req.params.id, type: "Income" });
        if (!income) return res.status(404).json({ message: "Income not found" });
        res.json(income);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get income by agent ID
router.get('/agent/:agent_id', async (req, res) => {
    try {
        const income = await Income.find({ agent_id: req.params.agent_id, type: "Income" });
        if (!income || income.length === 0) return res.status(404).json({ message: "Income not found" });
        res.json(income);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get income for a specific property name
router.get('/property/:property_name', async (req, res) => {
    try {
        const { property_name } = req.params;
        const income = await Income.find({ property_name: property_name, type: 'Income'});
        if (!income){
            return res.status(404).json({ message: "Income Expense not found"});
        }
        res.json(income);
    }catch(err){
        console.error("Error fetching income expense: ", err);
        res.status(500).json({message: "server error", error: err.message});
    }
});

// Update income
router.put('/property/:property_name', async (req, res) => {
    try {
        const { property_name, agent_name, amount, type } = req.body;
        const income = await Income.findOne({ property_name: req.params.property_name });
        if (!income) return res.status(404).json({ message: "Income not found" });

        income.property_name = property_name;
        income.agent_name = agent_name;
        income.amount = amount;
        income.type = type;

        await income.save();
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete income
router.delete('/:id', async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        if (!income) return res.status(404).json({ message: "Income not found" });

        await income.deleteOne();
        res.status(200).json({ message: "Income deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;