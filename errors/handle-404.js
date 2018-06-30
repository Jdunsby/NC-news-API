const handle404 = (err, req, res, next) => {
  if(err.isBoom && err.output.statusCode === 404){
    const { statusCode, payload } = err.output;
    res.status(statusCode).send(payload);
  }
  else next(err);
};

module.exports = handle404;