const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create Book schema and model.
const BookSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name field is required.'],
  },
  color: {
    type: String,
    required: [true],
    default: '#D3D3D3',
  },
});

const Book = mongoose.model('book', BookSchema);

module.exports = Book;
