const express = require('express');
const router = express.Router();
const Expense = require('../models/incomeexpense');


router.get('/property/:property_name', async(req, res) => {
    try{
        const property_name = req.params.property_name;
            const expense = await Expense.find({ property_name: {$regex: new RegExp(property_name, 'i')}, 
            type: 'Expense'
         });

        if (!expense) {
            return res.status(404).json({ message: "Income Expense not found" });
        }

        res.json(expense);
    }catch(err){
        console.error("Error fetching income expense:", err);
        res.status(500).json({message: "Server error", error: err.message});
    }
});

// Add Expense
router.post('/', async(req, res) => {
    try {
        const {property_name, agent_name, amount, type} = req.body;
        const newExpense = new Expense({ property_name, agent_name, amount, type }); 
        await newExpense.save();
        res.status(201).json({ message: "Added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Expenses
router.get('/', async(req,res) => { 
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
                        
        const total = await Expense.countDocuments();
                
        const expense = await Expense.find({ type: 'Expense' })
        .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            expense,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

// Get expense by ID
router.get('/:id', async(req, res) => {
   try{
        const expense = await Expense.findOne({ _id: req.params.id, type: "Expense" });
        if(!expense) return res.status(404).json({ message: "Expense not found" });
        res.json(expense);
   } catch(err){
        res.status(500).json({ message: err.message });
   }
});

// Get expense by agent ID
router.get('/:agent_id', async(req, res) => {
    try{
        const expense = await Expense.find({ agent_id: req.params.agent_id, type: "Expense" });
        if(!expense || expense.length === 0) return res.status(404).json({ message: "Expense not found" });
        res.json(expense);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

// Update expense
router.put('/property/:property_name', async(req, res) => {
    try{
        const { property_name, agent_name, amount, type } = req.body;
        const expense = await Expense.findOne({property_name: req.params.property_name});
        if(!expense) return res.status(404).json({ message: "Expense not found" });

        expense.property_name = property_name;
        expense.agent_name = agent_name;
        expense.amount = amount;
        expense.type = type;

        await expense.save();
        res.status(200).json(expense);
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

// Delete expense
router.delete('/:id', async(req, res) => {
    try{
        const expense = await Expense.findById(req.params.id);
        if(!expense) return res.status(404).json({ message: "Expense not found" });

        await expense.deleteOne();
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch(err){
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
