const bodyParser = require('body-parser');
const config = require('config');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

// Import routes.
const routes = require('./routes/routes');

const app = express();
const prefix = '/api';
const port = 4000;

// Connect to MongoDB.
mongoose.connect(config.DBHost, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(cors());

app.use(bodyParser.json({ limit: '4mb' }));

// Initialize routes.
app.use(prefix, routes);

// Additional error handling middleware.
app.use((err, req, res) => {
  res.send({ error: err.message });
});

// Listen for requests.
app.listen(process.env.PORT || port, () => {
  console.log(`Listening for requests on port ${port}...`);
});

module.exports = app;
