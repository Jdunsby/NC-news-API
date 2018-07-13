const mongoose = require('mongoose');
const { Topic, User, Article, Comment } = require('../../models');
const { createRef, addRefs } = require('../../utils/seeding');

const seedDB = async (userData, topicData, articleData, commentData) => {
  await mongoose.connection.dropDatabase();
  //Seed topic and user data
  const [topics, users] = await Promise.all([
    Topic.insertMany(topicData),
    User.insertMany(userData)
  ]);

  //Seed article data
  const articles = await Article.insertMany(articleData);

  //Create reference objects using user's and article's mongo IDs
  const userRef = createRef(users, 'username', '_id');
  const articleRef = createRef(articles, 'title', '_id');

  //Replace comment's references with corresponding mongo IDs
  commentData = addRefs(articleRef, commentData, 'belongs_to');
  commentData = addRefs(userRef, commentData, 'created_by');

  //Seed comment data and resolve as a nested array of data
  return Promise.all([
    topics,
    users,
    articles,
    Comment.insertMany(commentData)
  ]);
};

module.exports = seedDB;