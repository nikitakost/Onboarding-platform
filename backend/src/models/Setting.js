const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true 
  },
  content: {
    type: String,
    required: true 
  },
  videoUrl: {       
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);