/**
 *  @fileOverview Group routing functions.
 *
 *  @author       Oliver Rudzinski <inf17068@lehre.dhbw-stuttgart.de>
 *
 *  @requires     NPM:express-validator/check Input validation.
 *  @requires     ../models/book Contact book data model.
 *  @requires     ../models/group Group entry data model.
 */

// Import external modules.
const { validationResult } = require('express-validator/check');

// Import relevant data models.
const Book = require('../models/book');
const Group = require('../models/group');

/**
 * Retrieve all book-related groups from the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {undefined}
 */
function getGroups(req, res, next) {
  Book.findOne({ _id: req.params.bookId }).then((book) => {
    let groups = [];
    let counter = 0;
    if (book.groups.length !== 0) {
      // Display book-related groups only.
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

/**
 * Retrieve a specific book-related group from the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {undefined}
 */
function getGroup(req, res, next) {
  Group.findOne({ _id: req.params.groupId }).then((group) => {
    res.send(group);
  }).catch(next);
}

/**
 * Add a book-related contact to the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {any} Message on validation error, 0 on success.
 */
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

/**
 * Update a specific book-related contact inside the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {any} Message on validation error, 0 on success.
 */
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

/**
 * Delete a specific book-related contact from the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {undefined}
 */
function deleteGroup(req, res, next) {
  Group.findByIdAndRemove({ _id: req.params.groupId }).then((group) => {
    res.send(group);
  }).catch(next);
}

module.exports = {
  getGroups, getGroup, createGroup, updateGroup, deleteGroup,
};
