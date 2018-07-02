const { notFound } = require('boom');
const { Topic } = require('../models');

const getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => res.status(200).send({topics}))
    .catch(next);
};

const getTopicById = (req, res, next) => {
  const { topic_id } = req.params;
  Topic.findById(topic_id)
    .then(topic => {
      if(!topic) throw notFound('Topic not found');
      res.status(200).send({topic});
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getTopicById
};