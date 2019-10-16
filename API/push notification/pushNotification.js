var firebaseAdmin = require('../server.js');
var admin = firebaseAdmin.admin;

// This registration token comes from the front end client FCM SDKs.
var registrationToken = 'YOUR_REGISTRATION_TOKEN';
//if wanna send to specific topic then just do this
var topic = 'highScores';
//pick one or other. im thinking everyone subscribes to a topic then 
// we can just broadcast like that.

var message = {
  data: {
    score: '850',
    time: '2:45'
  },
  topic: topic
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });