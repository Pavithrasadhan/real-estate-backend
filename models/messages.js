
const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema(
    {
  name: { 
    type: String, 
    required: true 
},
phone: {
  type: String,
  require: true
},
  email: { 
    type: String,
     required: true 
    },
  message: { 
    type: String, 
    required: true 
  }
},
{
    timestamps: true
},

);

module.exports = mongoose.model('Messages', messagesSchema);