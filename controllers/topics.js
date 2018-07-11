const { notFound } = require('boom');
const { Topic } = require('../models');

const getTopics = async (req, res) => {
  const topics = await Topic.find();
  res.status(200).send({ topics });
};

const getTopicById = async (req, res) => {
  const { topic_slug } = req.params;
  const topic = await Topic.findById(topic_slug);
  if(!topic) throw notFound('Topic not found');
  res.status(200).send({ topic });
};

module.exports = {
  getTopics,
  getTopicById
};