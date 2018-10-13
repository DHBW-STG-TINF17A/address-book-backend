const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const { check, validationResult } = require('express-validator/check');

const config = require('config');

const bookValidation = [
  check('name')
    .isLength({ min: 1, max: 20 }).withMessage('Book name must contain between 1 and 20 characters'),
  check('color')
    .matches((/^#([A-Fa-f0-9]{6})$/)).withMessage('Book color must be provided as Hex Code'),
];

// const bookRoutes = require('./routes/bookRoutes');
const book = require('./routes/bookRoutes');
const contactRoutes = require('./routes/contactRoutes');
const groupRoutes = require('./routes/groupRoutes');

const app = express();

const routePrefix = '/api';
const port = 4000;

// Connect to MongoDB.
mongoose.connect(config.DBHost, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(cors());

app.use(express.static('uploads'));

app.use(bodyParser.json({ limit: '4mb' }));

// Initialize routes.
// app.use(routePrefix, bookRoutes);

app.route('/api/books')
  .get(book.getBooks)
  .post(bookValidation, book.createBook);
app.route('/api/books/:bookId')
  .get(book.getBook)
  .put(bookValidation, book.updateBook)
  .delete(book.deleteBook);

app.use(routePrefix, contactRoutes);
app.use(routePrefix, groupRoutes);

// Error handling middleware.
app.use((err, req, res) => {
  res.send({ error: err.message });
});

// Listen for requests.
app.listen(process.env.PORT || port, () => {
  console.log(`Listening for requests on port ${port}...`);
});

module.exports = app;
