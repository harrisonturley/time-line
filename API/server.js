const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const docs = require("express-mongoose-docs");

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
server.use('/api', require('./controller/lineupController'));
server.use('/api', require('./controller/searchController'));
server.use('/api', require('./controller/notificationController'));

// error handling middleware
server.use(function (err, req, res, _) {
    console.log(err);
    res.status(422).send({error: err.message});
});

// API docs
docs(server, mongoose);

server.listen(4000, function () {
    console.log('API is up');
});