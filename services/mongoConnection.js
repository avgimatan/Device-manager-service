const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Mavgi-prod:14736925@cluster0.eibpm.mongodb.net/deviceManagerService?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.mongoClient = mongoClient;