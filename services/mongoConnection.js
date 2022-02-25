const { MongoClient } = require('mongodb');
const { mongodbUri } = require('../config/config'); 
const mongoClient = new MongoClient(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.mongoClient = mongoClient;