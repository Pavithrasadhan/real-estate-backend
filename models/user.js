const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
        unique: true,
    },

    last_name: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    phone: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
        enum: ['Owner', 'Agent', 'Buyer'],
    },
    image:{
        type: String,
        
      },

}, {
    timestamps: true
},
);

module.exports = mongoose.model('User', UserSchema);