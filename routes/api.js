const router = require('express').Router();
const usersRouter = require('./users');
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');

router.use('/users', usersRouter);
router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);

module.exports = router;