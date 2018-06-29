const mongoose = require('mongoose');
const { Topic, User, Article, Comment } = require('../../models');
const { createRef, addRefs } = require('../../utils/seeding');

const seedDb = ({ topicData, userData, articleData, commentData }) => {
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
        Article.insertMany(articleData),
        userRef
      ]);
    })
    .then(([topics, users, articles, userRef]) => {
      const articleRef = createRef(articles, 'title', '_id');
      commentData = addRefs(articleRef, commentData, 'belongs_to');
      commentData = addRefs(userRef, commentData, 'created_by');
      return Promise.all([
        topics,
        users,
        articles,
        Comment.insertMany(commentData)
      ]);
    });
};

module.exports = seedDb;