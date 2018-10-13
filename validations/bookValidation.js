const check = require('express-validator/check');

const validation = [
  check('name')
    .isLength({ min: 1, max: 20 }).withMessage('Book name must contain between 1 and 20 characters'),
  check('color')
    .matches((/^#([A-Fa-f0-9]{6})$/)).withMessage('Book color must be provided as Hex Code'),
];

module.exports = validation;
