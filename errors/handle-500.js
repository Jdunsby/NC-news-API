const handle500 = (error, req, res) => {
  console.error('>>>>>' , error, '<<<<<');
  const defaultError = { type: 'Internal server error', message: error.message};
  res.status(500).send({error: defaultError});
};

module.exports = handle500;