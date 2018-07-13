const { notFound } = require('boom');
const { User } = require('../models');

const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).send({users});
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if(!user) throw notFound('User not found');
  res.status(200).send({user});
};

module.exports = {
  getUsers,
  getUserByUsername
};