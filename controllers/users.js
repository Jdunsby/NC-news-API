const { User } = require('../models');

const getUsers = (re, res, next) => {
  User.find()
    .then(users => res.status(200).send({users}))
    .catch(next);
};

module.exports = {
  getUsers
};