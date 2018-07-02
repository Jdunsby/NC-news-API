const app = require('./app');
const PORT = process.env.PORT || require('./config').PORT;

app.listen(PORT, (err) => {
  err ? 
    console.log(err) :
    console.log(`listening on port ${PORT}`);
});
