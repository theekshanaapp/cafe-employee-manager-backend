const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 10
  },
  email_address: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  phone_number: {
    type: String,
    required: true,
    match: [/^[89]\d{7}$/, 'Phone number must start with 8 or 9 and have 8 digits']
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  cafe: {
    type: Schema.Types.ObjectId,
    ref: 'Cafe',
    required: false
  },
  start_date: {
    type: Date,
    required: true
  },
  id: {
    type: String,
    unique: true,
    default: uuidv4
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
