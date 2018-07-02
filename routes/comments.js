const router = require('express').Router();
const { voteOnComment } = require('../controllers/comments');

router.route('/:comment_id')
  .put(voteOnComment);

module.exports = router;