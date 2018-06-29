const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/api');

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRouter);

module.exports = app;