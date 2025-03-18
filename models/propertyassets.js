
const mongoose = require('mongoose');

const PropertyassetsSchema = new mongoose.Schema({
    property_name:{
        type: String,
    },
    type:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },

},{
    timestamps: true
},);
module.exports = mongoose.model('PropertyAssets', PropertyassetsSchema);