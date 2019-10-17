
const express = require('express');
const router = express.Router();
//var firebaseAdmin = require('../server.js');
//var admin = firebaseAdmin.admin;
var admin = require('firebase-admin');
var topic = 'globalTopic';

var message = {
  data: {
    score: '850',
    time: '2:45'
  },
  topic: topic
};

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

module.admin = admin;

//how to handle req res next?
//can only test this once i have a registration token
router.post('/notification/subscribe', function (req, res, next) {
    console.log("user token is:"+ req.body.registrationToken);

  // Subscribe the devices corresponding to the registration tokens to the
  // topic.
  
  admin.messaging().subscribeToTopic(req.body.registrationToken, topic)
  .then(function(response) {
  // See the MessagingTopicManagementResponse reference documentation
  // for the contents of response.
    console.log('Successfully subscribed to topic:', response);
    res.status(200).send();
  })
  .catch(function(error) {
    console.log('Error subscribing to topic:', error);
    res.status(422).send({error: err.message});
  });

    /*userService.getUserByEmail(req.params.email, res).then(function (user) {
      res.send(user);
    }).catch(next);

    searchService.getRestaurantsByKeywordAndCoordinates(
        req.query.keyword, {latitude: req.query.latitude, longitude: req.query.longitude}
    ).then(function (searchResults) {
        res.send(searchResults);
    }).catch(next);*/
});

router.get('/notification/send', function (req, res, next) {
  console.log("in send message");
    
    admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
});

module.exports = router;

  
