const mongoose = require('mongoose');

const { Schema } = mongoose;

// Create Book schema and model.
const GroupSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name field is required.'],
  },
});

module.exports = GroupSchema;
