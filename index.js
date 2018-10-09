const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('mongoose');
const express = require('express');

const bookRoutes = require('./routes/bookRoutes');
const contactRoutes = require('./routes/contactRoutes');
const groupRoutes = require('./routes/groupRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

const dbPath = 'mongodb://localhost/address-book';
const routePrefix = '/api';
const port = 4000;

// Connect to MongoDB.
db.connect(dbPath, { useNewUrlParser: true });
db.Promise = global.Promise;

app.use(cors());

app.use(express.static('uploads'));

app.use(bodyParser.json());

// Initialize routes.
app.use(routePrefix, bookRoutes);
app.use(routePrefix, contactRoutes);
app.use(routePrefix, groupRoutes);
app.use(routePrefix, imageRoutes);

// Error handling middleware.
app.use((err, req, res) => {
  res.send({ error: err.message });
});

// Listen for requests.
app.listen(process.env.PORT || port, () => {
  console.log(`Listening for requests on port ${port}...`);
});
