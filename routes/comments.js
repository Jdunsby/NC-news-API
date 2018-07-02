const router = require('express').Router();
const { voteOnComment, deleteComment } = require('../controllers/comments');

router.route('/:comment_id')
  .put(voteOnComment)
  .delete(deleteComment);

module.exports = router;