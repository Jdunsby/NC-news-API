const mongoose = require('mongoose');
const { notFound, badRequest } = require('boom');
const { Article, Topic, User } = require('../models');
const { addCommentCount } = require('../utils/api');


const getArticles = async (_, res) => {
  let articles = await Article.find()
    .populate('belongs_to')
    .populate('created_by')
    .lean();
  articles = await addCommentCount(articles);
  res.status(200).send({ articles });
};


const getArticleById = async (req, res) => {
  const { article_id } = req.params;
  let article = await Article.findById(article_id)
    .populate('belongs_to')
    .populate('created_by')
    .lean();
  if(!article) throw notFound('Article not found');
  [article] = await addCommentCount([article]);
  res.status(200).send({ article });
};


const getArticlesByTopicId = async (req, res) => {
  const { topic_id } = req.params;
  let articles = await Article.find({ belongs_to: topic_id })
    .populate('belongs_to')
    .populate('created_by')
    .lean();
  if(!articles || !articles.length) throw notFound(`Articles not found for topic: ${topic_id}`);
  articles =  await addCommentCount(articles);
  res.status(200).send({ articles });
};


const postArticle = async (req, res) => {
  const { topic_id: belongs_to } = req.params;
  const { title, body, created_by } = req.body;
  if(!mongoose.Types.ObjectId.isValid(created_by)) {
    throw badRequest(`"created_by" value '${created_by}' is an invalid user ID`);
  }

  const [topic, user] = await Promise.all([
    Topic.findById(belongs_to),
    User.findById(created_by)
  ]);
  if(!topic) throw notFound(`Topic with ID ${belongs_to} does not exist`);
  if(!user) throw notFound(`User with ID ${created_by} does not exist`);
  const newArticle = new Article({
    title,
    body,
    created_by,
    belongs_to
  });
  let article = await newArticle.save();
  article = await Article.populate(article, 'belongs_to');
  article = await Article.populate(article, 'created_by');
  article = {...article.toObject(), comment_count: 0};
  res.status(201).send({ article });
};


const voteOnArticle = async (req, res) => {
  const { article_id } = req.params;
  const { vote } = req.query;
  const voteVal = vote === 'up' ? 1 
    : vote === 'down' ? -1 
      : 0;
  if(!vote) {
    throw badRequest('PUT request must include vote query with value \'up\' or \'down\'');
  }
  else if(!voteVal) {
    throw badRequest(`Value '${vote}' for vote query is invalid. Use 'up' or 'down' instead`);
  }
  const article = await Article.findByIdAndUpdate(article_id, { $inc: { votes: voteVal } }, {new: true});
  if(!article) throw notFound('Article not found');
  res.status(200).send({ article });
};


const deleteArticle = async (req, res) =>  {
  const { article_id } = req.params;
  await Article.findByIdAndRemove(article_id);
  res.status(204).send({});
};

module.exports = {
  getArticles,
  getArticleById,
  getArticlesByTopicId,
  postArticle,
  voteOnArticle,
  deleteArticle
};