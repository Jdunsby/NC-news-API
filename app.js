const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/api');
const { DB_URL } = require('./config');

mongoose.connect(DB_URL);

app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);

module.exports = app;