const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const docs = require("express-mongoose-docs");
var admin = require('firebase-admin');

// mongoose Promise is deprecated; cast it to global.Promise
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/time-line', {useNewUrlParser: true, useUnifiedTopology: true});

const server = express();

// initialize firebase for push notifications
// TODO figure out what is up with data base url
// in google they had it as'https://<DATABASE_NAME>.firebaseio.com'
// is this not necessary tho since we just need for FCM not using
// FB as actual database?
// https://firebase.google.com/docs/admin/setup#add_the_sdk
// also is best place for all this code here or somewhere else?
admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });

module.admin = admin;

// parsing middleware
const jsonParser = bodyParser.json();
server.use(jsonParser);

// routing middleware
// TODO add routes
server.use('/api', require('./controller/userController'));
server.use('/api', require('./controller/lineupController'));
// server.use('/api', require('./controller/searchController'));

// error handling middleware
server.use(function (err, req, res, _) {
    console.log(err);
    res.status(422).send({error: err.message});
});

// API docs
docs(server, mongoose);

server.listen(4000, function () {
    console.log('API is up!');
});