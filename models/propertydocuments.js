const mongoose = require('mongoose');

const PropertydocumentsSchema = new mongoose.Schema({
    property_name:{
        type: String,
    },
    document_name:{
        type: String,
        required: true,
    },
    document_type:{
        type: String,
        required: true,
    },
    document_path:{
        type: String,
    }
 }, {
        timestamps: true
    },
);

module.exports = mongoose.model('PropertyDocuments', PropertydocumentsSchema);