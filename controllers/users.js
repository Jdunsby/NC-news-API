const { notFound } = require('boom');
const { User } = require('../models');

const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).send({users});
};

const getUserById = async (req, res) => {
  const { user_id } = req.params;
  const user = await User.findById(user_id);
  if(!user) throw notFound('User not found');
  res.status(200).send({user});
};

module.exports = {
  getUsers,
  getUserById
};