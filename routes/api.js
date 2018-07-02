const router = require('express').Router();
const usersRouter = require('./users');
const topicsRouter = require('./topics');
const articlesRouter = require('./articles');
const commentsRouter = require('./comments');
const apiRootData = require('../db/api-root-data.js');

router.use('/users', usersRouter);
router.use('/topics', topicsRouter);
router.use('/articles', articlesRouter);
router.use('/comments', commentsRouter);

router.get('/', (req, res) => res.status(200).send(apiRootData));

module.exports = router;