const check = require('express-validator/check');

const validation = [
  check('name')
    .isLength({ min: 1, max: 20 })
    .withMessage('Group name must contain between 1 and 20 characters'),
];

module.exports = validation;
