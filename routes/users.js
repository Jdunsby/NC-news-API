const router = require('express').Router();
const { getUsers, getUserByUsername } = require('../controllers/users');
const { withErrorHandling } = require('../utils/api');

router.get('/', withErrorHandling(getUsers));
router.get('/:username', withErrorHandling(getUserByUsername));

module.exports = router;