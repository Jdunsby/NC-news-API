const mongoose = require('mongoose');
const seedDB = require('./seed');
const { DB_URL } = require('../../config');
const { userData, topicData, articleData, commentData } = require('./devData');

mongoose.connect(DB_URL)
  .then(() => seedDB(userData, topicData, articleData, commentData))
  .then(() => {
    console.log('DB seeded successfully');
    mongoose.disconnect();
  })
  .catch(console.error);