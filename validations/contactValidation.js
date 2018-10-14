const { check } = require('express-validator/check');

// const base64Format = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const eMailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const urlFormat = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
const phoneNumberFormat = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
const birthdayFormat = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

const post = [
  check('firstName')
    .isLength({ min: 1, max: 30 })
    .withMessage('First name must contain between 1 and 30 characters'),
  check('lastName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must contain between 1 and 20 characters'),
  check('alias')
    .isLength({ max: 20 }),
  check('phoneNumber')
    .matches(phoneNumberFormat)
    .withMessage('Phone Number is not valid'),
  check('eMailAddress')
    .custom((value) => {
      const v = (value === '' || value === undefined || value.match(eMailFormat));
      return v;
    })
    .withMessage('E-Mail address is not valid'),
  check('address1')
    .isLength({ max: 80 }).withMessage('Address line can only contain up to 80 characters'),
  check('address2')
    .isLength({ max: 80 }).withMessage('Address line can only contain up to 80 characters'),
  check('birthday')
    .custom((value) => {
      const v = ((value === '') || value === undefined || value.match(birthdayFormat));
      return v;
    })
    .withMessage('Date is not valid'),
  check('company')
    .isLength({ max: 40 }).withMessage('Company name can only contain up to 40 characters'),
  check('homepage')
    .custom((value) => {
      if (value === '' || value === undefined || value.match(urlFormat)) {
        return true;
      }
      if (!value.includes('http://' || 'https://')) {
        const vNew = `https://${value}`;
        if (vNew.match(urlFormat)) {
          return true;
        }
        return false;
      }
      return false;
    })
    .withMessage('Homepage is not a valid URL'),
  check('isFavorite')
    .isBoolean().withMessage('Favorite flag must be of boolean value'),
];

const put = [
  check('firstName')
    .custom((value) => {
      const v = (value === '' || value === undefined || (value.length >= 1 && value.length <= 30));
      return v;
    })
    .withMessage('First name must contain between 1 and 30 characters'),
  check('lastName')
    .custom((value) => {
      const v = (value === '' || value === undefined || (value.length >= 1 && value.length <= 50));
      return v;
    })
    .withMessage('Last name must contain between 1 and 20 characters'),
  check('alias')
    .isLength({ max: 20 }),
  check('phoneNumber')
    .custom((value) => {
      const v = (value === '' || value === undefined || value.match(phoneNumberFormat));
      return v;
    }).withMessage('Phone Number is not valid'),
  check('eMailAddress')
    .custom((value) => {
      const v = (value === '' || value === undefined || value.match(eMailFormat));
      return v;
    })
    .withMessage('E-Mail address is not valid'),
  check('address1')
    .isLength({ max: 80 }).withMessage('Address line can only contain up to 80 characters'),
  check('address2')
    .isLength({ max: 80 }).withMessage('Address line can only contain up to 80 characters'),
  check('birthday')
    .custom((value) => {
      const v = (value === '' || value === undefined || value.match(birthdayFormat));
      return v;
    })
    .withMessage('Date is not valid'),
  check('company')
    .isLength({ max: 40 }).withMessage('Company name can only contain up to 40 characters'),
  check('homepage')
    .custom((value) => {
      if (value === '' || value === undefined || value.match(urlFormat)) {
        return true;
      }
      if (!value.includes('http://' || 'https://')) {
        const vHttps = `https://${value}`;
        if (vHttps.match(urlFormat)) {
          return true;
        }
        return false;
      }
      return false;
    })
    .withMessage('Homepage is not a valid URL'),
  check('isFavorite')
    .isBoolean().withMessage('Favorite flag must be of boolean value'),
];

module.exports = { post, put };
