const router = require('express').Router();
const { getTopics, getTopicById } = require('../controllers/topics');
const { getArticlesByTopicId, postArticle } = require('../controllers/articles');

router.get('/', getTopics);
router.get('/:topic_id', getTopicById);
router.route('/:topic_id/articles')
  .get(getArticlesByTopicId)
  .post(postArticle);

module.exports = router;