const router = require('express').Router();
const { getTopics, getTopicById } = require('../controllers/topics');
const { getArticlesByTopic, postArticle } = require('../controllers/articles');
const { withErrorHandling } = require('../utils/api');

router.get('/', withErrorHandling(getTopics));
router.get('/:topic_slug', withErrorHandling(getTopicById));
router.route('/:topic_slug/articles')
  .get(withErrorHandling(getArticlesByTopic))
  .post(withErrorHandling(postArticle));

module.exports = router;