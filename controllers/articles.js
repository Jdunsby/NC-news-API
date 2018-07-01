const { notFound } = require('boom');
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


const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Article.findById(article_id)
    .populate('belongs_to')
    .populate('created_by')
    .lean()
    .then(article => {
      if(!article) throw notFound('Article not found');
      return addCommentCount(article, Comment);
    })
    .then(article => res.status(200).send({ article }))
    .catch(next);
};

const getArticlesByTopicId = (req, res, next) => {
  const { topic_id } = req.params;
  Article.find({ belongs_to: topic_id })
    .populate('belongs_to')
    .populate('created_by')
    .lean()
    .then(articles => {
      if(!articles || !articles.length) throw notFound(`Articles not found for topic: ${topic_id}`);
      return addCommentCount(articles, Comment);
    })
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};

// const postArticle = (req, res, next) => {

// };

// const voteOnArticle = (req, res, next) => {

// };

// const deleteArticle = (req, res, next) =>  {

// };

module.exports = {
  getArticles,
  getArticleById,
  getArticlesByTopicId,
  // postArticle,
  // voteOnArticle,
  // deleteArticle
};