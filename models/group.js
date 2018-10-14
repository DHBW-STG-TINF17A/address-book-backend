/**
 *  @fileOverview Schema and Model definition for groups.
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

const GroupSchema = new Schema({
  _id: {
    type: String,
    default: shortId.generate,
  },
  name: { type: String },
});

const Group = mongoose.model('group', GroupSchema);

module.exports = Group;
