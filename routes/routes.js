const express = require('express');

const book = require('./bookRoutes');
const contact = require('./contactRoutes');
const group = require('./groupRoutes');

const bookValidation = require('../validations/bookValidation');
const contactValidation = require('../validations/contactValidation');
const groupValidation = require('../validations/groupValidation');

const router = express.Router();

router.get('/books', book.getBooks);
router.get('/books/:bookId', book.getBook);
router.post('/books/', bookValidation.post, book.createBook);
router.put('/books/:bookId', bookValidation.put, book.updateBook);
router.delete('/books/:bookId', book.deleteBook);

router.get('/:bookId/contacts', contact.getContacts);
router.get('/:bookId/contacts/:contactId', contact.getContact);
router.post('/:bookId/contacts/', contactValidation.post, contact.createContact);
router.put('/:bookId/contacts/:contactId', contactValidation.put, contact.updateContact);
router.delete('/:bookId/contacts/:contactId', contact.deleteContact);

router.get('/:bookId/groups', group.getGroups);
router.get('/:bookId/groups/:groupId', group.getGroup);
router.post('/:bookId/groups/', groupValidation.post, group.createGroup);
router.put('/:bookId/groups/:groupId', groupValidation.put, group.updateGroup);
router.delete('/:bookId/groups/:groupId', group.deleteGroup);

module.exports = router;
