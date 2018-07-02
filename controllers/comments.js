const mongoose = require('mongoose');
const { notFound, badRequest } = require('boom');
const { Comment, Article, User } = require('../models');

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Comment.find({ belongs_to: article_id })
    .then(comments => {
      if(!comments.length) throw notFound(`There are no comments for article: ${article_id}`);
      res.status(200).send({ comments });
    })
    .catch(next);
};


const postComment = (req, res, next) => {
  const { article_id: belongs_to } = req.params;
  const { created_by, body } = req.body;
  if(!mongoose.Types.ObjectId.isValid(created_by)) {
    throw badRequest(`'created_by' value '${created_by}' is an invalid user ID`);
  }

  Promise.all([
    Article.findById(belongs_to),
    User.findById(created_by)
  ])
    .then(([article, user]) => {
      if(!article) throw notFound(`Article with ID ${belongs_to} does not exist`);
      if(!user) throw notFound(`User with ID ${created_by} does not exist`);
      const newComment = new Comment({
        body,
        created_by,
        belongs_to
      });
      return newComment.save();
    })
    .then(comment => Comment.populate(comment, 'created_by'))
    .then(comment => {
      comment = comment.toObject();
      res.status(201).send({ comment });
    })
    .catch(next);
};


// const voteOnComment = (req, res, next) => {

// };


// const deleteComment = (req, res, next) => {

// };


module.exports = {
  getCommentsByArticleId,
  postComment,
  // voteOnComment,
  // deleteComment
};