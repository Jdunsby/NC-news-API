const router = require('express').Router();
const { getArticles, getArticleById, voteOnArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getArticles);
router.route('/:article_id')
  .get(getArticleById)
  .put(voteOnArticle)
  .delete(deleteArticle);

module.exports = router;