/**
 *  @fileOverview Schema and Model definition for contact books.
 *
 *  @author       Oliver Rudzinski <inf17068@lehre.dhbw-stuttgart.de>
 *
 *  @requires     NPM:mongoose Data schema.
 *  @requires     NPM:shortId Short unique id for created entities.
 */

// Import external modules.
const mongoose = require('mongoose');
const shortId = require('shortid');

const { Schema } = mongoose;

// Create Book schema and model.
const BookSchema = new Schema({
  _id: {
    type: String,
    default: shortId.generate,
  },
  name: { type: String },
  color: {
    type: String,
    default: '#D3D3D3',
  },
  contacts: { type: [String] },
  groups: { type: [String] },
});

const Book = mongoose.model('book', BookSchema);

module.exports = Book;
