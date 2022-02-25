const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  mongodbUri: process.env.MONGO_URI,
  port: process.env.PORT
};