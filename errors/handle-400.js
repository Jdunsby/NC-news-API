const handle400 = (err, req, res, next) => {
  if(err.isBoom && err.output.statusCode === 400){
    res.status(err.output.statusCode).send(err.output.payload);
  }
  else if(err.name === 'CastError' || err.name === 'ValidationError'){
    const error = {
      statusCode: 400,
      error: err.name,
      message: err.message
    };
    res.status(400).send(error);
  }
  else next(err);
};

module.exports = handle400;