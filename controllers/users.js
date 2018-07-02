const { notFound } = require('boom');
const { User } = require('../models');

const getUsers = (re, res, next) => {
  User.find()
    .then(users => res.status(200).send({users}))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { user_id } = req.params;
  User.findById(user_id)
    .then(user => {
      if(!user) throw notFound('User not found');
      res.status(200).send({user});
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById
};