const { validationResult } = require('express-validator/check');

const Book = require('../models/book');
const Group = require('../models/group');

// Retrieve all book-related groups from the data base.
function getGroups(req, res, next) {
  Book.findOne({ _id: req.params.bookId }).then((book) => {
    let groups = [];
    let counter = 0;
    if (book.groups.length !== 0) {
      book.groups.forEach((groupId) => {
        Group.findOne({ _id: groupId }).then((group) => {
          groups.push(group);
          counter += 1;
          if (counter === book.groups.length) {
            if (book.groups.length !== 0) {
              res.send(groups);
            }
          }
        });
      });
    } else {
      res.send([]);
    }
  }).catch(next);
}

// Retrieve a specific book-related group from the data base.
function getGroup(req, res, next) {
  Group.findOne({ _id: req.params.groupId }).then((group) => {
    res.send(group);
  }).catch(next);
}

// Create a book-related group and save it inside the data base.
function createGroup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  Group.create(req.body).then((group) => {
    Book.findOne({ _id: req.params.bookId }).then((book) => {
      book.update({ groups: book.groups.concat(group._id) }).then(() => {
        res.send(group);
      });
    });
  }).catch(next);

  return 0;
}

// Update a specific book-related group inside the data base.
function updateGroup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  Group.findOneAndUpdate({ _id: req.params.groupId }, req.body)
    .then(() => {
      Group.findOne({ _id: req.params.groupId }).then((group) => {
        res.send(group);
      });
    }).catch(next);

  return 0;
}

// Delete a specific book-related group from the data base.
function deleteGroup(req, res, next) {
  Group.findByIdAndRemove({ _id: req.params.groupId }).then((group) => {
    res.send(group);
  }).catch(next);
}

module.exports = {
  getGroups, getGroup, createGroup, updateGroup, deleteGroup,
};
