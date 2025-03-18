
const mongoose = require('mongoose');

const IncomeExpenseSchema = new mongoose.Schema({
    property_name:{
        type: String,
        required: true,
    },
    agent_name:{
        type: String,
        required: true,
    },
    amount:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        enum: ['Income', 'Expense'],
        required: true,
    },
    
},{
    timestamps: true
},
);

module.exports = mongoose.model('Incomeexpense', IncomeExpenseSchema);