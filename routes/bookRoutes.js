const express = require('express');

const Book = require('../models/book');
const Contact = require('../models/contact');

const router = express.Router();

// Retrieve all books from the data base.
router.get('/books', (req, res, next) => {
  Book.find({}).then((books) => {
    res.send(books);
  }).catch(next);
});

// Retrieve a specific book from the data base.
router.get('/books/:bookId', (req, res, next) => {
  Book.findOne({ _id: req.params.bookId }).then((book) => {
    res.send(book);
  }).catch(next);
});

// Create a book and save it inside the data base.
router.post('/books', (req, res, next) => {
  Book.create(req.body).then((book) => {
    res.send(book);
  }).catch(next);
});

// Update a specific book inside the data base.
router.put('/books/:bookId', (req, res, next) => {
  Book.findOneAndUpdate({ _id: req.params.bookId }, { runValidators: true }, req.body).then(() => {
    Book.findOne({ _id: req.params.bookId }).then((book) => {
      res.send(book);
    });
  }).catch(next);
});

// Delete a specific book from the data base.
router.delete('/books/:bookId', (req, res, next) => {
  Book.findByIdAndRemove({ _id: req.params.bookId }).then((book) => {
    if (book.contacts.length !== 0) {
      let counter = 0;
      book.contacts.forEach((contactId) => {
        Contact.findByIdAndRemove({ _id: contactId });
        counter += 1;
        console.log(`Deleted contact ${contactId}`);
        if (counter === book.contacts.length) {
          res.send(book);
        }
      });
    } else {
      res.send(book);
    }
  }).catch(next);
});

module.exports = router;
