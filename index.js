const bodyParser = require('body-parser');
const express = require('express');
const db = require('mongoose');

const bookRoutes = require('./routes/bookRoutes');
const contactRoutes = require('./routes/contactRoutes');
const groupRoutes = require('./routes/groupRoutes');

const app = express();

const dbPath = 'mongodb://localhost/address-book';
const routePrefix = '/api';
const port = 4000;

// Connect to MongoDB.
db.connect(dbPath);
db.Promise = global.Promise;

app.use(bodyParser.json());

// Initialize routes.
app.use(routePrefix, bookRoutes);
app.use(routePrefix, contactRoutes);
app.use(routePrefix, groupRoutes)

// Error handling middleware.
app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

// Listen for requests.
app.listen(process.env.PORT || port, () => {
  console.log('Listening for requests...');
});
