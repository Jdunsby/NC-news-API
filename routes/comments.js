const router = require('express').Router();
const { voteOnComment, deleteComment } = require('../controllers/comments');
const { withErrorHandling } = require('../utils/api');

router.route('/:comment_id')
  .put(withErrorHandling(voteOnComment))
  .delete(withErrorHandling(deleteComment));

module.exports = router;