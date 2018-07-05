const router = require('express').Router();
const { getTopics, getTopicById } = require('../controllers/topics');
const { getArticlesByTopicId, postArticle } = require('../controllers/articles');
const { withErrorHandling } = require('../utils/api');

router.get('/', withErrorHandling(getTopics));
router.get('/:topic_id', withErrorHandling(getTopicById));
router.route('/:topic_id/articles')
  .get(withErrorHandling(getArticlesByTopicId))
  .post(withErrorHandling(postArticle));

module.exports = router;