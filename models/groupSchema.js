const mongoose = require('mongoose');
const shortId = require('shortid');

const { Schema } = mongoose;

// Create Book schema and model.
const GroupSchema = new Schema({
  _id: {
    type: String,
    default: shortId.generate,
  },
  name: { type: String },
});

module.exports = GroupSchema;
