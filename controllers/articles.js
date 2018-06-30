const { Article, Comment } = require('../models');
const { addCommentCount } = require('../utils/api');


const getArticles = (req, res, next) => {
  Article.find()
    .populate('belongs_to')
    .populate('created_by')
    .lean()
    .then(articles => addCommentCount(articles, Comment))
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};

// const getArticleById = (req, res, next) => {

// };

// const getArticlesByTopicId = (req, res, next) => {
  
// };

// const postArticle = (req, res, next) => {

// };

// const voteOnArticle = (req, res, next) => {

// };

// const deleteArticle = (req, res, next) =>  {

// };

module.exports = {
  getArticles,
  // getArticleById,
  // getArticlesByTopicId,
  // postArticle,
  // voteOnArticle,
  // deleteArticle
};