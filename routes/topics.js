const router = require('express').Router();
const { getTopics, getTopicById } = require('../controllers/topics');
const { getArticlesByTopicId } = require('../controllers/articles');

router.get('/', getTopics);
router.get('/:topic_id', getTopicById);
router.get('/:topic_id/articles', getArticlesByTopicId);

module.exports = router;