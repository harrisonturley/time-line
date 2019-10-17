
const express = require('express');
const router = express.Router();
var admin = require('firebase-admin');
var topic = 'globalTopic';

var message = {
  notification: {
    body: 'test',
    title: 'hello hello'
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
});

router.get('/notification/send', function (req, res, next) {
  console.log("in send message");
    
    admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      res.status(200).send();
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.status(422).send({error: err.message});
    });
});

module.exports = router;
module.exports.admin = admin;

  
