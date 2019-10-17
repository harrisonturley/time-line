var firebaseAdmin = require('../server.js');
var admin = firebaseAdmin.admin;

// everyone should already be subscribed to this topic
var topic = 'globalTopic';

var message = {
  data: {
    score: '850',
    time: '2:45'
  },
  topic: topic
};

// LOGIC NEEDED: when do we send messages? 
// Send a message to the device corresponding to the topic
admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });