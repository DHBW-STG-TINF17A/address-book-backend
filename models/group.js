const mongoose = require('mongoose');
const shortId = require('shortid');

const { Schema } = mongoose;

const GroupSchema = new Schema({
  _id: {
    type: String,
    default: shortId.generate,
  },
  name: { type: String },
});

const Group = mongoose.model('group', GroupSchema);

module.exports = Group;
