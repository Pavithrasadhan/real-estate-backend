
const mongoose = require('mongoose');

const leadsSchema = new mongoose.Schema({
    property_name:{
        type: String,
        
    },
    buyer_name:{
        type: String,
        required: true,
    },
    agent_name:{
        type: String,
        
    },
    status:{
        type: String,
        enum:['New', 'Open', 'Closed'],
        required: true,
    },
 }, {
        timestamps: true
    },
);

module.exports = mongoose.model('Leads', leadsSchema);