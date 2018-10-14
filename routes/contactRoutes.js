const { validationResult } = require('express-validator/check');

const Book = require('../models/book');
const Contact = require('../models/contact');

// Retrieve all book-specific contacts from the data base.
function getContacts(req, res, next) {
  Book.findOne({ _id: req.params.bookId }).then((book) => {
    let contacts = [];
    let counter = 0;
    if (book.contacts.length !== 0) {
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

// Retrieve a specific contact from the data base.
function getContact(req, res, next) {
  Contact.findOne({ _id: req.params.contactId }).then((contact) => {
    res.send(contact);
  }).catch(next);
}

// Create a book and save it inside the data base.
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

// Update a specific book inside the data base.
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

// Delete a specific book from the data base.
function deleteContact(req, res, next) {
  Contact.findByIdAndDelete({ _id: req.params.contactId }).then((contact) => {
    res.send(contact);
  }).catch(next);
}

module.exports = {
  getContacts, getContact, createContact, updateContact, deleteContact,
};
