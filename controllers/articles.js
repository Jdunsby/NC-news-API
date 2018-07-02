const mongoose = require('mongoose');
const { notFound, badRequest } = require('boom');
const { Article, Topic, User } = require('../models');
const { addCommentCount } = require('../utils/api');


const getArticles = (req, res, next) => {
  Article.find()
    .populate('belongs_to')
    .populate('created_by')
    .lean()
    .then(articles => addCommentCount(articles))
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
      return addCommentCount([article]);
    })
    .then(([article]) => res.status(200).send({ article }))
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
      return addCommentCount(articles);
    })
    .then(articles => res.status(200).send({ articles }))
    .catch(next);
};


const postArticle = (req, res, next) => {
  const { topic_id: belongs_to } = req.params;
  const { title, body, created_by } = req.body;
  if(!mongoose.Types.ObjectId.isValid(created_by)) {
    throw badRequest(`"created_by" value '${created_by}' is an invalid user ID`);
  }

  Promise.all([
    Topic.findById(belongs_to),
    User.findById(created_by)
  ])
    .then(([topic, user]) => {
      if(!topic) throw notFound(`Topic with ID ${belongs_to} does not exist`);
      if(!user) throw notFound(`User with ID ${created_by} does not exist`);
      const newArticle = new Article({
        title,
        body,
        created_by,
        belongs_to
      });
      return newArticle.save();
    })
    .then(article => Article.populate(article, 'belongs_to'))
    .then(article => Article.populate(article, 'created_by'))
    .then(article => {
      article = {...article.toObject(), comment_count: 0};
      res.status(201).send({ article });
    })
    .catch(next);
};


const voteOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { vote } = req.query;
  const voteVal = vote === 'up' ? 1 : vote === 'down' ? -1 : 0;
  if(!vote) {
    throw badRequest('PUT request must include vote query with value \'up\' or \'down\'');
  }
  else if(!voteVal) {
    throw badRequest(`Value '${vote}' for vote query is invalid. Use 'up' or 'down' instead`);
  }
  Article.findByIdAndUpdate(article_id, { $inc: { votes: voteVal } }, {new: true})
    .then(article => {
      if(!article) throw notFound('Article not found');
      res.status(200).send({ article });
    })
    .catch(next);
};


const deleteArticle = (req, res, next) =>  {
  const { article_id } = req.params;
  Article.findByIdAndRemove(article_id)
    .then(() => res.status(204).send({}))
    .catch(next);
};

module.exports = {
  getArticles,
  getArticleById,
  getArticlesByTopicId,
  postArticle,
  voteOnArticle,
  deleteArticle
};