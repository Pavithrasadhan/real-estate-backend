
const mongoose = require('mongoose');

const PropertyPreferenceSchema = new mongoose.Schema({
    buyer_id:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    price_range:{
        type: String,
        required: true,
    },
    property_type:{
        type: String,
        required: true,
    }
},
{
    timestamps: true
},);

module.exports = mongoose.model('PropertyPreference', PropertyPreferenceSchema);