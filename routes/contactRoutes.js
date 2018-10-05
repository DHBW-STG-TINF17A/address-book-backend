const express = require('express');
const Contact = require('../models/contact');

const router = express.Router();

// Retrieve all books from the data base.
router.get('/:bookId/contacts', (req, res, next) => {
  Contact.find({}).then((contacts) => {
    res.send(contacts);
  }).catch(next);
});

// Retrieve a specific contact from the data base.
router.get('/:bookId/contacts/:contactId', (req, res, next) => {
  Contact.findOne({ _id: req.params.contactId }).then((contact) => {
    res.send(book);
  }).catch(next);
});

// Create a book and save it inside the data base.
router.post('/:bookId/contacts', (req, res, next) => {
  Contact.create(req.body).then((book) => {
    res.send(book);
  }).catch(next);
});

// Update a specific book inside the data base.
router.put('/:bookId/contacts/:contactId', (req, res, next) => {
  Contact.findByIdAndUpdate({ _id: req.params.contactId }, req.body).then(() => {
    Book.findOne({ _id: req.params.contactId }).then((book) => {
      res.send(book);
    });
  }).catch(next);
});

// Delete a specific book from the data base.
router.delete('/:bookId/contacts/:contactId', (req, res, next) => {
  Contact.findByIdAndDelete({ _id: req.params.contactId}).then((book) => {
    res.send(book);
  }).catch(next);
});

module.exports = router;
