const mongoose = require('mongoose');
const GroupSchema = require('./groupSchema');

const { Schema } = mongoose;

// Create Contact schema and model.
const ContactSchema = new Schema({
  firstName: {
    length: 30,
    type: String,
    required: [true, 'firstName field is required.'],
  },
  lastName: {
    length: 50,
    type: String,
    required: [true, 'lastName field is required.'],
  },
  alias: {
    length: 20,
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    required: [true, 'phoneNumber field is required.'],
    validate: {
      validator: (v) => {
        const phoneNumberPattern = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
        return phoneNumberPattern.test(v);
      },
      message: 'Provided phone number is invalid.',
    },
  },
  eMailAddress: {
    length: 50,
    type: String,
    default: '',
    validate: {
      validator: (v) => {
        const eMailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (v === '' || eMailPattern.test(v));
      },
      message: 'Provided e-mail address is invalid.',
    },
  },
  birthday: {
    type: String,
    default: '',
    validate: {
      validator: (v) => {
        const datePattern = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/;
        return (v === '' || datePattern.test(v));
      },
      message: 'Provided birthday is invalid.',
    },
  },
  company: {
    length: 40,
    type: String,
    default: '',
  },
  homepage: {
    length: 100,
    type: String,
    default: '',
    validate: {
      validator: (v) => {
        const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
        return (v === '' || urlPattern.test(v));
      },
    },
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
  address1: {
    length: 80,
    type: String,
    default: '',
  },
  address2: {
    length: 80,
    type: String,
    default: '',
  },
});

const Contact = mongoose.model('contact', ContactSchema);

module.exports = Contact;
