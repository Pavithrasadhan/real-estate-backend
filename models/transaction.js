
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    property_id:{
        type: String,
        required: true,
    },
    Buyer_id:{
        type: String,
        required: true,
    },
    seller_id:{
        type: String,
        required: true,
    },
    agent_id:{
        type: String,
        required: true,
    },
    transaction_type:{
        type: String,
        enum:['Sale', 'Rent'],
        required: true,
    },
    amount:{
        type: String,
        required: true,
    },
    transaction_date:{
        type: Date,
        required: true,
    }
},
{
    timestamps: true
},
);

module.exports = mongoose.model('Transaction', TransactionSchema);