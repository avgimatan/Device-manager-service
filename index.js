// index.js
const express = require('express');
const bodyParser = require('body-parser');
const { mongoClient } = require('./services/mongoConnection');
const app = express();
const port = 3000;

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the MongoDB client
mongoClient.connect();
// Connect to cluster DB
const database = mongoClient.db("deviceManagerService");

// Routes files
require('./routes/routes.js')(app, database);

// Handle invalid routes
app.get("*", (req, res) => {
  res.status(404).send(`URL "${req.url}" not found`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})