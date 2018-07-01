const router = require('express').Router();
const { getArticles, getArticleById, voteOnArticle } = require('../controllers/articles');

router.get('/', getArticles);
router.route('/:article_id')
  .get(getArticleById)
  .put(voteOnArticle);

module.exports = router;