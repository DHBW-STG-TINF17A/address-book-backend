const express = require('express');
const Group = require('../models/group');

const router = express.Router();

// Retrieve all book-related groups from the data base.
router.get('/:bookId/groups', (req, res, next) => {
  Group.find({}).then((groups) => {
    res.send(groups);
  }).catch(next);
});

// Retrieve a specific book-related group from the data base.
router.get('/:bookId/groups/:groupId', (req, res, next) => {
  Group.findOne({ _id: req.params.groupId }).then((group) => {
    res.send(group);
  }).catch(next);
});

// Create a book-related group and save it inside the data base.
router.post('/:bookId/groups', (req, res, next) => {
  Group.create(req.body).then((group) => {
    res.send(group);
  }).catch(next);
});

// Update a specific book-related group inside the data base.
router.put('/:bookId/groups/:groupId', (req, res, next) => {
  Group.findByIdAndUpdate({ _id: req.params.groupId }, req.body).then(() => {
    Group.findOne({ _id: req.params.groupId }).then((group) => {
      res.send(group);
    });
  }).catch(next);
});

// Delete a specific book-related group from the data base.
router.delete('/:bookId/groups/:groupId', (req, res, next) => {
  Group.findByIdAndRemove({ _id: req.params.groupId }).then((group) => {
    res.send(group);
  }).catch(next);
});

/* // Not working.
// Add a group to a contact.
router.post('/:bookId/groups/:groupId/:contactId', (req, res, next) => {
  Contact.findById({ _id: req.params.contactId }).then((contact) => {
    console.log(contact);
    var currentGroups = contact.groups;
    console.log(contact.groups);
    Group.findById({ _id: req.params.groupId }).then((group) => {
      console.log(group)
      if (currentGroups.includes(group) === false) {
      contact.update({ groups: currentGroups.concat(group) }).then(() => {
        Contact.findOne({ _id: req.params.contactId }).then((updatedContact) => {
          res.send(updatedContact);
        });
      });
      }
    });
  });
}); */

module.exports = router;
