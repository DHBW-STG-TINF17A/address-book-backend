const { check } = require('express-validator/check');

const post = [
  check('name')
    .isLength({ min: 1, max: 20 })
    .withMessage('Group name must contain between 1 and 20 characters'),
];

const put = [
  check('name')
    .custom((value) => {
      const v = (value === '' || value === undefined || (value.length >= 1 && value.length <= 20));
      return v;
    }).withMessage('Group name must contain between 1 and 20 characters'),
];

module.exports = { post, put };
