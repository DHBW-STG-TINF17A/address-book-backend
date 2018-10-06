const express = require('express');
const fs = require('fs');
const multer = require('multer');
const Contact = require('../models/contact');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

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
    res.send(contact);
  }).catch(next);
});

// Create a book and save it inside the data base.
router.post('/:bookId/contacts', upload.single('image'), (req, res, next) => {
  console.log(req.file);
  Contact.create(req.body).then((contact) => {
    contact.updateOne({ imageUrl: req.file.path }).then(() => {
      Contact.findOne({ _id: contact._id }).then((contactWithImage) => {
        res.send(contactWithImage);
      });
    });
    req.file.filename = 'image_' + contact._id;
  }).catch(next);
});


// Update a specific book inside the data base.
router.put('/:bookId/contacts/:contactId', upload.single('image'), (req, res, next) => {
  Contact.findById({ _id: req.params.contactId }).then((contact) => {
    fs.unlinkSync(contact.imageUrl);
  })
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
