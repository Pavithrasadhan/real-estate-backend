
const mongoose = require('mongoose');

const AgentsSchema = new mongoose.Schema({
    image:{
        type: String,
    },
    agent_name:{
        type: String,
        
    },
    contact_info:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    yearofexperience:{
        type: String,
        required: true,
    },
    languagespoken:{
        type: String,
        required: true,
    },
    expertise:{
        type: String,
        required: true,
    },
    BRN:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
},{
        timestamps: true
    },
);

module.exports = mongoose.model('Agents', AgentsSchema);