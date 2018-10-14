/**
 *  @fileOverview Contact book routing functions.
 *
 *  @author       Oliver Rudzinski <inf17068@lehre.dhbw-stuttgart.de>
 *
 *  @requires     NPM:express-validator/check Input validation.
 *  @requires     ../models/book Contact book data model.
 *  @requires     ../models/contact Contact entry data model.
 */

// Import external modules.
const { validationResult } = require('express-validator/check');

// Import relevant data models.
const Book = require('../models/book');
const Contact = require('../models/contact');

/**
 * Retrieve all book-related contacts from the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {undefined}
 */
function getContacts(req, res, next) {
  Book.findOne({ _id: req.params.bookId }).then((book) => {
    let contacts = [];
    let counter = 0;
    if (book.contacts.length !== 0) {
      // Display book-related contacts only.
      book.contacts.forEach((contactId) => {
        Contact.findOne({ _id: contactId }).then((contact) => {
          contacts.push(contact);
          counter += 1;
          if (counter === book.contacts.length) {
            if (book.contacts.length !== 0) {
              res.send(contacts);
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
 * Retrieve a specific book-related contact from the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {undefined}
 */
function getContact(req, res, next) {
  Contact.findOne({ _id: req.params.contactId }).then((contact) => {
    res.send(contact);
  }).catch(next);
}

/**
 * Add a book-related contact to the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {any} Message on validation error, 0 on success.
 */
function createContact(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  Contact.create(req.body).then((contact) => {
    Book.findOne({ _id: req.params.bookId }).then((book) => {
      book.update({ contacts: book.contacts.concat(contact._id) }).then(() => {
        res.send(contact);
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
function updateContact(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  Contact.findOneAndUpdate({ _id: req.params.contactId }, req.body)
    .then(() => {
      Contact.findOne({ _id: req.params.contactId }).then((contact) => {
        res.send(contact);
      });
    }).catch(next);
  return 0;
}

/**
 * Delete a specific book-related contact inside the data base.
 * @param {object} req Received request.
 * @param {object} res Response to be sent back.
 * @param {function} next Middleware function for additional error handling (see index.js).
 * @returns {any} Message on validation error, 0 on success.
 */
function deleteContact(req, res, next) {
  Contact.findByIdAndDelete({ _id: req.params.contactId }).then((contact) => {
    res.send(contact);
  }).catch(next);
}

module.exports = {
  getContacts, getContact, createContact, updateContact, deleteContact,
};
