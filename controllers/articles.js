const { Article, Comment } = require('../models');

const getArticles = (req, res, next) => {
  Article.find()
    .populate('belongs_to')
    .populate('created_by')
    .lean()
    .then(articles => {
      const commentCounts = articles.map(article => {
        return Comment.find({belongs_to: article._id}).count();
      });
      return Promise.all([
        articles,
        ...commentCounts
      ]);
    })
    .then(([articles, ...commentCounts]) => {
      articles.forEach((article, i) => article.comment_count = commentCounts[i]);
      res.status(200).send({ articles });
    })
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