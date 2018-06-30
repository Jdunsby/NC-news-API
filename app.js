const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/api');
const { DB_URL } = require('./config');
const { handle400, handle404, handle500 } = require('./errors');

mongoose.connect(DB_URL);

//MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());

//ROUTES
app.use('/api', apiRouter);

//ERROR HANDLING
app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;