const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/muber', { useMongoClient: true });
}

app.use(bodyParser.json());
routes(app);

// this error handler middleware needs to be placed after 'routes' middleware
// err - is defined if the previous middleware in the chain threw an error
// err in our app could be something related to going wrong in our mongoose/mongo world
// next - is a function, used to go to the new middleware in the chain
app.use((err, req, res, next) => {
  // console.log(err);
  res.status(422).send({ error: err.message });
});

module.exports = app;
