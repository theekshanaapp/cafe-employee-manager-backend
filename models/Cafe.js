const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cafeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  logo: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Cafe', cafeSchema);
