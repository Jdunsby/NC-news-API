const router = require('express').Router();
const { getArticles } = require('../controllers/articles');

router.get('/', getArticles);

module.exports = router;