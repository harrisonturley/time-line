const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// mongoose Promise is deprecated; cast it to global.Promise
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/time-line', {useNewUrlParser: true, useUnifiedTopology: true});

const server = express();

// parsing middleware
const jsonParser = bodyParser.json();
server.use(jsonParser);

// routing middleware
// TODO add routes
server.use('/api', require('./controller/userController'));

// error handling middleware
server.use(function (err, req, res, _) {
    console.log(err);
    res.status(422).send({error: err.message});
});

server.listen(process.env.port || 4000, function () {
    console.log('API is up');
});