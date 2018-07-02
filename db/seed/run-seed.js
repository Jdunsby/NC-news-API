const mongoose = require('mongoose');
const seedDB = require('./seed');
const { DB_URL } = require('../../config');
const seedData = require('./devData');

mongoose.connect(DB_URL)
  .then(() => seedDB(seedData))
  .then(() => {
    console.log('DB seeded successfully');
    mongoose.disconnect();
  })
  .catch(console.error);