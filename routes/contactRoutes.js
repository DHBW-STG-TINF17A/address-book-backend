const express = require('express');

const Book = require('../models/book');
const Contact = require('../models/contact');

const router = express.Router();

// Retrieve all books from the data base.
router.get('/:bookId/contacts', (req, res, next) => {
  Book.findOne({ _id: req.params.bookId }).then((book) => {
    const bookContacts = book.contacts;
    let contacts = [];
    let counter = 0;
    bookContacts.forEach((contactId) => {
      Contact.findOne({ _id: contactId }).then((contact) => {
        console.log(contactId);
        contacts.push(contact);
        counter++;
        if (counter === bookContacts.length) {
          res.send(contacts);
        }
      });
    });
  });
});

// Retrieve a specific contact from the data base.
router.get('/:bookId/contacts/:contactId', (req, res, next) => {
  Contact.findOne({ _id: req.params.contactId }).then((contact) => {
    res.send(contact);
  }).catch(next);
});

// Create a book and save it inside the data base.
router.post('/:bookId/contacts', (req, res, next) => {
  Contact.create(req.body).then((contact) => {
    Book.findOne({ _id: req.params.bookId }).then((book) => {
      let currentContactIds = book.contacts;
      console.log(book.contacts);
      let contactId = contact._id;
      let newContactIds = currentContactIds.concat(contactId);
      console.log(contactId);

      book.update({ contacts: newContactIds }).then(() => {
        res.send(contact);
      });
    });
  }).catch(next);
});


// Update a specific book inside the data base.
router.put('/:bookId/contacts/:contactId', (req, res, next) => {
  Contact.findByIdAndUpdate({ _id: req.params.contactId }, req.body).then(() => {
    Contact.findOne({ _id: req.params.contactId }).then((contact) => {
      res.send(contact);
    });
  }).catch(next);
});

// Delete a specific book from the data base.
router.delete('/:bookId/contacts/:contactId', (req, res, next) => {
  Contact.findByIdAndDelete({ _id: req.params.contactId }).then((contact) => {
    res.send(contact);
  }).catch(next);
});

module.exports = router;
