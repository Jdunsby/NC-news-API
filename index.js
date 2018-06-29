const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, (err) => {
  err ? 
    console.log(err) :
    console.log(`listening on port ${PORT}`);
});
