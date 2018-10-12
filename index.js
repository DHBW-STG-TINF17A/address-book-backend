const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('mongoose');
const express = require('express');
const validator = require('express-validator');

const bookRoutes = require('./routes/bookRoutes');
const contactRoutes = require('./routes/contactRoutes');
const groupRoutes = require('./routes/groupRoutes');

const app = express();

const dbPath = 'mongodb://localhost/address-book';
const routePrefix = '/api';
const port = 4000;

// Connect to MongoDB.
db.connect(dbPath, { useNewUrlParser: true });
db.Promise = global.Promise;

app.use(cors());

app.use(express.static('uploads'));

app.use(bodyParser.json({ limit: '4mb' }));

app.use(validator());

// Initialize routes.
app.use(routePrefix, bookRoutes);
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
