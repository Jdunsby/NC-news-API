const { notFound, badRequest } = require('boom');
const { Article, Topic, User } = require('../models');
const { addCommentCount } = require('../utils/api');


const getArticles = async (req, res) => {
  let articles = await Article.find()
    .populate('topic')
    .populate('user')
    .lean();
  articles = await addCommentCount(articles);
  res.status(200).send({ articles });
};


const getArticleById = async (req, res) => {
  const { article_id } = req.params;
  let article = await Article.findById(article_id)
    .populate('topic')
    .populate('user')
    .lean();
  if(!article) throw notFound('Article not found');
  [article] = await addCommentCount([article]);
  res.status(200).send({ article });
};


const getArticlesByTopicId = async (req, res) => {
  const { topic_slug } = req.params;
  let articles = await Article.find({ belongs_to: topic_slug })
    .populate('topic')
    .populate('user')
    .lean();
  if(!articles || !articles.length) throw notFound(`Articles not found for topic: ${topic_slug}`);
  articles =  await addCommentCount(articles);
  res.status(200).send({ articles });
};


const postArticle = async (req, res) => {
  const { topic_slug } = req.params;
  const { title, body, created_by } = req.body;

  if (!title || !body || !created_by) {
    throw badRequest('Request body must contain valid title, body and created_by properties');
  }
  else if(typeof created_by !== 'string') {
    throw badRequest('Request body\'s created_by property must be a string');
  }

  const [topic, user] = await Promise.all([
    Topic.findOne({ slug: topic_slug }),
    User.findOne({ username: created_by })
  ]);

  if(!topic) throw notFound(`Topic with slug ${topic_slug} does not exist`);
  if(!user) throw notFound(`User with username ${created_by} does not exist`);
  const newArticle = new Article({
    title,
    body,
    created_by,
    belongs_to: topic._id
  });
  let article = await newArticle.save();
  article = {
    ...article.toObject(),
    comment_count: 0,
    topic: topic.toObject(),
    user: user.toObject()
  };
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