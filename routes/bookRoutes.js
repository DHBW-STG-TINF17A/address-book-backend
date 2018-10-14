const { validationResult } = require('express-validator/check');

const Book = require('../models/book');
const Contact = require('../models/contact');
const Group = require('../models/group');

function getBooks(req, res, next) {
  Book.find({}).then((books) => {
    res.send(books);
  }).catch(next);
}

function getBook(req, res, next) {
  Book.findOne({ _id: req.params.bookId }).then((book) => {
    res.send(book);
  }).catch(next);
}

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

function deleteBook(req, res, next) {
  Book.findByIdAndRemove({ _id: req.params.bookId }).then((book) => {
    if (book.contacts.length !== 0 && book.groups.length !== 0) {
      let contactCounter = 0;
      let groupCounter = 0;
      book.contacts.forEach((contactId) => {
        Contact.findByIdAndRemove({ _id: contactId });
        contactCounter += 1;
        if (contactCounter === book.contacts.length) {
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
