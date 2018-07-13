const router = require('express').Router();
const { getUsers, getUserByUsername } = require('../controllers/users');
const { getArticlesByUser } = require('../controllers/articles');
const { withErrorHandling } = require('../utils/api');

router.get('/', withErrorHandling(getUsers));
router.get('/:username', withErrorHandling(getUserByUsername));
router.get('/:username/articles', withErrorHandling(getArticlesByUser));

module.exports = router;