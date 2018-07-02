const DB_URL = process.env.DB_URL || require('./config').DB_URL;
const API_URL = process.env.API_URL || require('./config').API_URL;
const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/api');
const { handle400, handle404, handle500 } = require('./errors');

mongoose.connect(DB_URL);

//MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());

//ROUTES
app.get('/', (req, res) => res.status(200).send({welcome: `${API_URL}/api`}));
app.use('/api', apiRouter);

//ERROR HANDLING
app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;