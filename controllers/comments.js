const mongoose = require('mongoose');
const { notFound, badRequest } = require('boom');
const { Comment, Article, User } = require('../models');

const getCommentsByArticleId = async (req, res) => {
  const { article_id } = req.params;
  const comments = await Comment.find({ belongs_to: article_id })
    .populate('created_by');
  if(!comments.length) throw notFound(`There are no comments for article: ${article_id}`);
  res.status(200).send({ comments });
};


const postComment = async (req, res) => {
  const { article_id: belongs_to } = req.params;
  const { created_by, body } = req.body;
  if(!mongoose.Types.ObjectId.isValid(created_by)) {
    throw badRequest(`'created_by' value '${created_by}' is an invalid user ID`);
  }
  let [article, user] = await Promise.all([
    Article.findById(belongs_to),
    User.findById(created_by)
  ]);
  if(!article) throw notFound(`Article with ID ${belongs_to} does not exist`);
  if(!user) throw notFound(`User with ID ${created_by} does not exist`);
  const newComment = new Comment({
    body,
    created_by,
    belongs_to
  });
  let comment = await newComment.save();
  comment = await Comment.populate(comment, 'created_by');
  comment = comment.toObject();
  res.status(201).send({ comment });
};


const voteOnComment = async (req, res) => {
  const { comment_id } = req.params;
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
  const comment = await Comment.findByIdAndUpdate(comment_id, { $inc: { votes: voteVal } }, {new: true});
  if(!comment) throw notFound('Comment not found');
  res.status(200).send({ comment });
};


const deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  const comment = await Comment.findByIdAndRemove(comment_id);
  if(!comment) throw notFound('Comment not found');
  res.status(204).send({});
};


module.exports = {
  getCommentsByArticleId,
  postComment,
  voteOnComment,
  deleteComment
};