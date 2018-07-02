const PORT = process.env.PORT || require('./config').PORT;
const app = require('./app');

app.listen(PORT, (err) => {
  err ? 
    console.log(err) :
    console.log(`listening on port ${PORT}`);
});
