const mongoose = require('mongoose');
const { Topic, User, Article } = require('../../models');
const { createRef, addRefs } = require('../../utils/seeding');

const seedDb = ({ topicData, userData, articleData }) => {
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })
    .then(([topics, users]) => {
      const topicRef = createRef(topics, 'slug', '_id');
      const userRef = createRef(users, 'username', '_id');
      articleData = addRefs(topicRef, articleData, 'belongs_to');
      articleData = addRefs(userRef, articleData, 'created_by');
      return Promise.all([
        topics,
        users,
        Article.insertMany(articleData)
      ]);
    });
};

module.exports = seedDb;