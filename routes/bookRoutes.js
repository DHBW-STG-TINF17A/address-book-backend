const express = require('express');
const { check, validationResult } = require('express-validator/check');

const Book = require('../models/book');
const Contact = require('../models/contact');

const router = express.Router();

const postValidation = [
  check('name')
    .not().isEmpty()
    .isLength({ min: 1, max: 20 }),
  check('color')
    .not().isEmpty()
    .matches(/^#([A-Fa-f0-9]{6})$/),
];

const putValidation = [
  check('name')
    .isLength({ min: 1, max: 20 }),
  check('color')
    .matches((/^#([A-Fa-f0-9]{6})$/)),
];

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
router.post('/books', postValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  Book.create(req.body).then((book) => {
    res.send(book);
  }).catch(next);

  return 0;
});

// Update a specific book inside the data base.
router.put('/books/:bookId', putValidation, (req, res, next) => {
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
