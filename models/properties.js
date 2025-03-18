const mongoose = require('mongoose');

const PropertiesSchema = new mongoose.Schema({
    owner_name: { type: String },
    agent_name: { type: String },
    image: { type: [String] },
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    purpose: { type: String, required: true },
    amenities: { type: [String] },
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    sqft: { type: String, required: true },
    location: { type: String, required: true },
    furnished: { type: String, required: true },
    mapLink: { type: String, required: true },
    availablefrom: { type: Date },
    addedDate: { type: Date, default: Date.now },
    buildingName: { type: String },
    yearofcompletion: { type: String },
    floors: { type: String },
    permitNo: { type: String, required: true },
    DED: { type: String, required: true },
    RERA: { type: String, required: true },
    BRN: { type: String, required: true },
    RefId: { type: String },
    QRcode: { type: String },
    visibility: { type: String, enum: ['Private', 'Public'], required: true },
    base_price: { type: Number, },
    status: { type: String, enum: ['Available', 'Sold', 'Rented', 'Under management', 'pending', 'approved', 'rejected'], required: true },
}, {
    timestamps: true,  
});

module.exports = mongoose.model('Property', PropertiesSchema);
