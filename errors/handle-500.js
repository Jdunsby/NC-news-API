const { internal } = require('boom');

const handle500 = (err, req, res) => {
  const defaultError = internal(err.message);
  res.status(500).send({error: defaultError});
};

module.exports = handle500;