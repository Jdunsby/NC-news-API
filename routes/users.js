const router = require('express').Router();
const { getUsers, getUserById } = require('../controllers/users');
const { withErrorHandling } = require('../utils/api');

router.get('/', withErrorHandling(getUsers));
router.get('/:user_id', withErrorHandling(getUserById));

module.exports = router;