const router = require('express').Router();
const { getArticles, getArticleById } = require('../controllers/articles');

router.get('/', getArticles);
router.get('/:article_id', getArticleById);

module.exports = router;