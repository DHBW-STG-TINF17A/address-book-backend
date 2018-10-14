/**
 *  @fileOverview Specify routing.
 *
 *  @author       Oliver Rudzinski <inf17068@lehre.dhbw-stuttgart.de>
 *
 *  @requires     NPM:express-validator/check Input validation.
 *  @requires     ../models/book Contact book data model.
 *  @requires     ../models/contact Contact entry data model.
 */

// Import external models.
const express = require('express');

// Import routes.
const book = require('./bookRoutes');
const contact = require('./contactRoutes');
const group = require('./groupRoutes');

// Import validation schemas.
const bookValidation = require('../validation/bookValidation');
const contactValidation = require('../validation/contactValidation');
const groupValidation = require('../validation/groupValidation');

const router = express.Router();

// Specify routes for contact books.
router.get('/books', book.getBooks);
router.get('/books/:bookId', book.getBook);
router.post('/books/', bookValidation.post, book.createBook);
router.put('/books/:bookId', bookValidation.put, book.updateBook);
router.delete('/books/:bookId', book.deleteBook);

// Specify routes for contact entries.
router.get('/:bookId/contacts', contact.getContacts);
router.get('/:bookId/contacts/:contactId', contact.getContact);
router.post('/:bookId/contacts/', contactValidation.post, contact.createContact);
router.put('/:bookId/contacts/:contactId', contactValidation.put, contact.updateContact);
router.delete('/:bookId/contacts/:contactId', contact.deleteContact);

// Specify routes for groups.
router.get('/:bookId/groups', group.getGroups);
router.get('/:bookId/groups/:groupId', group.getGroup);
router.post('/:bookId/groups/', groupValidation.post, group.createGroup);
router.put('/:bookId/groups/:groupId', groupValidation.put, group.updateGroup);
router.delete('/:bookId/groups/:groupId', group.deleteGroup);

module.exports = router;
