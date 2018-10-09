const fs = require('fs');
const express = require('express');
const multer = require('multer');

const Contact = require('../models/contact');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    switch (file.mimetype) {
      case 'image/jpeg':
        cb(null, `${file.filename}.jpg`);
        break;
      case 'image/png':
        cb(null, `${file.filename}.png`);
        break;
      default:
        cb(new Error('PNG or JPEG file required.'));
    }
  },
});

const router = express.Router();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== ('image/png' || 'image/jpeg')) {
      req.fileValidationError = 'Expected PNG or JPEG file.';
      cb(null, false, new Error('Exprected PNG or JPEG file.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
});

// Upload an image and save it to the file system.
router.post('/images/:contactId', upload.single('image'), (req, res, next) => {
  console.log(req.file);
  Contact.findOne({ _id: req.params.contactId }).then((contact) => {
    contact.update({ imageUrl: req.file.path }).then(() => {
      Contact.findOne({ _id: req.params.contactId }).then((contactWithImage) => {
        res.send(contactWithImage);
      });
    });
  }).catch(next);
});

// Delete an image from the file system and unlink it from the corresponding contact.
router.delete('/images/:contactId', (req, res, next) => {
  Contact.findOne({ _id: req.params.contactId }).then((contact) => {
    fs.unlinkSync(contact.imageUrl);
    contact.update({ imageUrl: '' }).then(() => {
      Contact.findOne({ _id: req.params.contactId }).then((contactWithoutImage) => {
        res.send(contactWithoutImage);
      });
    });
  }).catch(next);
});

module.exports = router;
