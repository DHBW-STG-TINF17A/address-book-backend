/**
 *  @fileOverview Group-related validation schema.
 *
 *  @author       Oliver Rudzinski <inf17068@lehre.dhbw-stuttgart.de>
 *
 *  @requires     NPM:express-validator/check Input validation.
 */

// Import external modules.
const { check } = require('express-validator/check');

const post = [
  check('name')
    .isLength({ min: 1, max: 20 })
    .withMessage('Group name must contain between 1 and 20 characters'),
];

/* Since required attributes have already been created, the PUT request does not
necessarily need to require those but needs to check their validity if they exist. */
const put = [
  check('name')
    .custom((value) => {
      const v = (value === '' || value === undefined || (value.length >= 1 && value.length <= 20));
      return v;
    }).withMessage('Group name must contain between 1 and 20 characters'),
];

module.exports = { post, put };
