// index.js
const express = require('express');
const bodyParser = require('body-parser');
const { mongoClient } = require('./services/mongoConnection');
const app = express();
const { port } = require('./config/config');

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the MongoDB client
mongoClient.connect();
// Connect to the cluster DB
const database = mongoClient.db("deviceManagerService");
const router = require('./routes/devices')(database);

// Routes files
app.use('/devices',router);

// Handle invalid routes
app.get("*", (req, res) => {
  res.status(404).send(`URL "${req.url}" not found`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})