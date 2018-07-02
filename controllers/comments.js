const { notFound } = require('boom');
const { Comment } = require('../models');

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id })
    .then(comments => {
      if(!comments.length) throw notFound(`There are no comments for article: ${article_id}`);
      res.status(200).send({ comments });
    })
    .catch(next);
};

// const postComment = (req, res, next) => {

// };

// const voteOnComment = (req, res, next) => {

// };

// const deleteComment = (req, res, next) => {

// };

module.exports = {
  getCommentsByArticleId,
  // postComment,
  // voteOnComment,
  // deleteComment
};