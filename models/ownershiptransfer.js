const mongoose = require('mongoose');

const OwnershipTransferSchema = new mongoose.Schema({
    property_id:{
        type: String,
        required: true,
    },
    previous_owner_id:{
        type: String,
        required: true,
    },
    new_owner_id:{
        type: String,
        required: true,
    },
    transfer_date:{
        type: Date,
        required: true,
    }
},{
    timestamps: true
},
);

module.exports = mongoose.model('OwnershipTransfer', OwnershipTransferSchema);