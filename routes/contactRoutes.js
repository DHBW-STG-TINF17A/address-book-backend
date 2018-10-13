const express = require('express');
const { check, validationResult } = require('express-validator/check');

const Book = require('../models/book');
const Contact = require('../models/contact');

const router = express.Router();

// const base64Format = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const eMailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlFormat = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
const phoneNumberFormat = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
const yyyymmddFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

const contactValidation = [
  check('firstName')
    .isLength({ min: 1, max: 30 })
    .withMessage('First name must contain between 1 and 30 characters'),
  check('lastName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must contain between 1 and 20 characters'),
  check('alias')
    .isLength({ max: 20 }),
  check('phoneNumber')
    .matches(phoneNumberFormat)
    .withMessage('Phone Number is not valid'),
  check('eMailAddress')
    .custom((value) => {
      const v = ((value === '') || value.match(eMailFormat));
      return v;
    })
    .withMessage('E-Mail address is not valid'),
  check('address1')
    .isLength({ max: 80 }).withMessage('Address line can only contain up to 80 characters'),
  check('address2')
    .isLength({ max: 80 }).withMessage('Address line can only contain up to 80 characters'),
  check('birthday')
    .custom((value) => {
      const v = ((value === '') || value.match(yyyymmddFormat));
      return v;
    })
    .withMessage('Date is not valid'),
  check('company')
    .isLength({ max: 40 }).withMessage('Company name can only contain up to 40 characters'),
  check('homepage')
    .custom((value) => {
      if ((value === '') || value.match(urlFormat)) {
        return true;
      }
      if (!value.includes('http://' || 'https://')) {
        const vNew = `https://${value}`;
        if (vNew.match(urlFormat)) {
          return true;
        }
        return false;
      }
      return false;
    })
    .withMessage('Homepage is not a valid URL'),
  check('isFavorite')
    .isBoolean().withMessage('Favorite flag must be of boolean value'),
];

// Retrieve all book-specific contacts from the data base.
router.get('/:bookId/contacts', (req, res, next) => {
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
});

// Retrieve a specific contact from the data base.
router.get('/:bookId/contacts/:contactId', (req, res, next) => {
  Contact.findOne({ _id: req.params.contactId }).then((contact) => {
    res.send(contact);
  }).catch(next);
});

// Create a book and save it inside the data base.
router.post('/:bookId/contacts', contactValidation, (req, res, next) => {
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
});

// Update a specific book inside the data base.
router.put('/:bookId/contacts/:contactId', contactValidation, (req, res, next) => {
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
});

// Delete a specific book from the data base.
router.delete('/:bookId/contacts/:contactId', (req, res, next) => {
  Contact.findByIdAndDelete({ _id: req.params.contactId }).then((contact) => {
    res.send(contact);
  }).catch(next);
});

module.exports = router;
