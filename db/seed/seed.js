const mongoose = require('mongoose');
const { Topic } = require('../../models');

const seedDb = ({topicData}) => {
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Topic.insertMany(topicData);
    });
};

module.exports = seedDb;