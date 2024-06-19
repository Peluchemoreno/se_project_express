const mongoose = require('mongoose');

const validator = require('validator');

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 2,
    max: 30,
    required: true
  },
  weather: {
    type: String,
    required: true,
    enum: ['hot', 'warm', 'cold']
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: "You must enter a valid URL",
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: '',
  }]
})

module.exports.clothingItem = mongoose.model('clothingItem', clothingItemSchema);