const mongoose = require('mongoose');
const GroupSchema = require('./groupSchema');

const { Schema } = mongoose;

// Create Contact schema and model.
const ContactSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'firstName field is required.'],
  },
  lastName: {
    type: String,
    required: [true, 'lastName field is required.'],
  },
  alias: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    required: [true, 'phoneNumber field is required.'],
  },
  eMailAddress: {
    type: String,
    default: '',
  },
  birthday: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  homepage: {
    type: String,
    default: '',
  },
  groups: {
    type: [GroupSchema],
    default: [],
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    default: '',
  },
});

const Contact = mongoose.model('contact', ContactSchema);

module.exports = Contact;
