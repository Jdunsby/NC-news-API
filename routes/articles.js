const router = require('express').Router();
const { getArticles, getArticleById, voteOnArticle, deleteArticle } = require('../controllers/articles');
const { getCommentsByArticleId } = require('../controllers/comments');

router.get('/', getArticles);

router.route('/:article_id')
  .get(getArticleById)
  .put(voteOnArticle)
  .delete(deleteArticle);

router.route('/:article_id/comments')
  .get(getCommentsByArticleId);

module.exports = router;