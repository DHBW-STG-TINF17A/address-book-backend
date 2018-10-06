const fs = require('fs');
const express = require('express');
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

const router = express.Router();

const upload = multer({ storage });

// Upload an image and save it to the file system.
router.post('/images/:contactId', upload.single('image'), (req, res, next) => {
  console.log(req.file);
  Contact.findOne({ _id: req.params.contactId }).then((contact) => {
    contact.update({ imageUrl: req.file.path }).then(() => {
      Contact.findOne({ _id: req.params.contactId }).then((contactWithImage) => {
        res.send(contactWithImage);
      })
    });
  });
});

router.delete('/images/:contactId', (req, res, next) => {
  Contact.findOne({ _id: req.params.contactId }).then((contact) => {
    fs.unlinkSync(contact.imageUrl);
    contact.update({ imageUrl: '' }).then(() => {
      Contact.findOne({ _id: req.params.contactId }).then((contactWithoutImage) => {
        res.send(contactWithoutImage);
      });
    });
  });
});

module.exports = router;
