const mongoose = require('mongoose');
const { Topic, User } = require('../../models');

const seedDb = ({topicData, userData}) => {
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    });
};

module.exports = seedDb;