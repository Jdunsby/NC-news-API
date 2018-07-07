const router = require('express').Router();
const { getArticles, getArticleById, voteOnArticle, deleteArticle } = require('../controllers/articles');
const { getCommentsByArticleId, postComment } = require('../controllers/comments');
const { withErrorHandling } = require('../utils/api');

router.get('/', withErrorHandling(getArticles));

router.route('/:article_id')
  .get(withErrorHandling(getArticleById))
  .put(withErrorHandling(voteOnArticle))
  .delete(withErrorHandling(deleteArticle));

router.route('/:article_id/comments')
  .get(withErrorHandling(getCommentsByArticleId))
  .post(withErrorHandling(postComment));

module.exports = router;