const mongoose = require('mongoose');
const shortId = require('shortid');

const { Schema } = mongoose;

// Create Book schema and model.
const BookSchema = new Schema({
  _id: {
    type: String,
    default: shortId.generate,
  },
  name: {
    // minlength: 1,
    // maxlength: 20,
    type: String,
    // required: [true, 'Name field is required.'],
  },
  color: {
    type: String,
    // required: [true, 'Color field is required.'],
    default: '#D3D3D3',
    // validate: {
    //   validator: (v) => {
    //     const hexPattern = /^#([A-Fa-f0-9]{6})$/;
    //     return hexPattern.test(v);
    //   },
    //   message: 'Provided hex color code is invalid.',
    // },
  },
  contacts: {
    type: [String],
  },
  groups: {
    type: [String],
  },
});

const Book = mongoose.model('book', BookSchema);

module.exports = Book;
