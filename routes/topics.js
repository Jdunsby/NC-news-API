const router = require('express').Router();
const { getTopics, getTopicById } = require('../controllers/topics');

router.get('/', getTopics);
router.get('/:topic_id', getTopicById);

module.exports = router;