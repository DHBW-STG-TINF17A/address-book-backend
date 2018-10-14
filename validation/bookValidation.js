/**
 *  @fileOverview Contact book-related validation schema.
 *
 *  @author       Oliver Rudzinski <inf17068@lehre.dhbw-stuttgart.de>
 *
 *  @requires     NPM:express-validator/check Input validation.
 */

const { check } = require('express-validator/check');

const hexColorFormat = /^#([A-Fa-f0-9]{6})$/;

const post = [
  check('name')
    .isLength({ min: 1, max: 20 }).withMessage('Book name must contain between 1 and 20 characters'),
  check('color')
    .matches(hexColorFormat).withMessage('Book color must be provided as Hex Code'),
];


/* Since required attributes have already been created, the PUT request does not
necessarily need to require those but needs to check their validity if they exist. */
const put = [
  check('name')
    .custom((value) => {
      const v = (value === '' || value === undefined || (value.length >= 1 && value.length <= 20));
      return v;
    })
    .withMessage('Book name must contain between 1 and 20 characters'),
  check('color')
    .custom((value) => {
      const v = (value === '' || value === undefined || value.match(hexColorFormat));
      return v;
    }).withMessage('Book color must be provided as Hex Code'),
];

module.exports = { put, post };
