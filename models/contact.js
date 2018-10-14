const mongoose = require('mongoose');
const shortId = require('shortid');

const { Schema } = mongoose;

// Create Contact schema and model.
const ContactSchema = new Schema({
  _id: {
    type: String,
    default: shortId.generate,
  },
  firstName: { ype: String },
  lastName: { type: String },
  alias: { ype: String },
  phoneNumber: { type: String },
  eMailAddress: { type: String },
  birthday: { type: String },
  company: { type: String },
  homepage: { type: String },
  groups: { type: [String] },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  imageUrl: { type: String },
  address1: { type: String },
  address2: { type: String },
});

const Contact = mongoose.model('contact', ContactSchema);

module.exports = Contact;
