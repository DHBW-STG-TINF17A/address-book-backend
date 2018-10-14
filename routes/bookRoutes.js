/**
 *  @fileOverview Contact entry routing functions.
 *
 *  @author       Oliver Rudzinski <inf17068@lehre.dhbw-stuttgart.de>
 *
 *  @requires     NPM:express-validator/check Input validation.
 *  @requires     ../models/book Contact book data model.
 *  @requires     ../models/contact Contact entry data model.
 *  @requires     ../models/group Group entry data model.
 */

// Import external modules.
const { validationResult } = require('express-validator/check');

// Import relevant data models.
const Book = require('../models/book');
const Contact = require('../models/contact');
const Group = require('../models/group');

/**
 * Retrieve all contact books from the data base.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {undefined}
 */
function getBooks(res, next) {
  Book.find({}).then((books) => {
    res.send(books);
  }).catch(next);
}

/**
 * Retrieve a specific contact book from the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {undefined}
 */
function getBook(req, res, next) {
  Book.findOne({ _id: req.params.bookId }).then((book) => {
    res.send(book);
  }).catch(next);
}

/**
 * Add a contact book to the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {any} Message on validation error, 0 on success.
 */
function createBook(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  Book.create(req.body).then((book) => {
    res.send(book);
  }).catch(next);

  return 0;
}

/**
 * Update a contact book inside the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {any} Message on validation error, 0 on success.
 */
function updateBook(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  Book.findOneAndUpdate({ _id: req.params.bookId }, req.body).then(() => {
    Book.findOne({ _id: req.params.bookId }).then((book) => {
      res.send(book);
    });
  }).catch(next);

  return 0;
}

/**
 * Delete a contact book inside the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {undefined}
 */
function deleteBook(req, res, next) {
  Book.findByIdAndRemove({ _id: req.params.bookId }).then((book) => {
    if (book.contacts.length !== 0 && book.groups.length !== 0) {
      let contactCounter = 0;
      let groupCounter = 0;
      // Loop for finding and removing all book-related contacts from the data base.
      book.contacts.forEach((contactId) => {
        Contact.findByIdAndRemove({ _id: contactId });
        contactCounter += 1;
        if (contactCounter === book.contacts.length) {
          // Loop for finding and removing all book-related groups from the data base.
          book.groups.forEach((groupId) => {
            Group.findByIdAndRemove(groupId);
            groupCounter += 1;
            if (groupCounter === book.groups.length) {
              res.send(book);
            }
          });
        }
      });
    } else {
      res.send(book);
    }
  }).catch(next);
}

module.exports = {
  getBooks, getBook, createBook, updateBook, deleteBook,
};
