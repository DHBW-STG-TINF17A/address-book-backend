const express = require('express');
const { check, validationResult } = require('express-validator/check');

const Book = require('../models/book');
const Contact = require('../models/contact');

const router = express.Router();

const phoneNumberFormat = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
const yyyymmdd = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

const postValidation = [
  check('firstName')
    .not().isEmpty().withMessage('First name must not be empty')
    .isLength({ min: 1, max: 30 })
    .withMessage('First name must contain between 1 and 30 characters'),
  check('lastName')
    .not().isEmpty().withMessage('Last name must not be empty')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must contain between 1 and 20 characters'),
  check('alias')
    .isLength({ max: 20 }),
  check('phoneNumber')
    .not().isEmpty().withMessage('Phone number must not be empty')
    .matches(phoneNumberFormat)
    .withMessage('Phone Number is not valid'),
  check('eMailAddress')
    .isEmail().withMessage('E-Mail address is not valid'),
  check('address1')
    .isLength({ max: 80 }).withMessage('Address line can only contain up to 80 characters'),
  check('address2')
    .isLength({ max: 80 }).withMessage('Address line can only contain up to 80 characters'),
  check('birthday')
    .matches(yyyymmdd).withMessage('Date is not valid'),
  check('company')
    .isLength({ max: 40 }).withMessage('Company name can only contain up to 40 characters'),
  check('homepage')
    .isURL().withMessage('Homepage is not a valid URL'),
  check('imageUrl')
    .isBase64().withMessage('Image is not a valid Base64'),
  check('isFavorite')
    .isBoolean().withMessage('Favorite flag must be of boolean value'),
];

const putValidation = [
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
    .isEmail().withMessage('E-Mail address is not valid'),
  check('address1')
    .isLength({ max: 80 }).withMessage('Address line can only contain up to 80 characters'),
  check('address2')
    .isLength({ max: 80 }).withMessage('Address line can only contain up to 80 characters'),
  check('birthday')
    .matches(yyyymmdd).withMessage('Date is not valid'),
  check('company')
    .isLength({ max: 40 }).withMessage('Company name can only contain up to 40 characters'),
  check('homepage')
    .isURL().withMessage('Homepage is not a valid URL'),
  check('imageUrl')
    .isBase64().withMessage('Image is not a valid Base64'),
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
router.post('/:bookId/contacts', postValidation, (req, res, next) => {
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
router.put('/:bookId/contacts/:contactId', putValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  Contact.findOneAndUpdate({ _id: req.params.contactId }, { runValidators: true }, req.body)
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
