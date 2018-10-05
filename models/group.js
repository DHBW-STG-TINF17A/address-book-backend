const mongoose = require('mongoose');
const GroupSchema = require('./groupSchema');

const Group = mongoose.model('group', GroupSchema);

module.exports = Group;
