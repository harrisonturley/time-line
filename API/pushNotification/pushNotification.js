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

function checkToSendPushNotification(body) {

  console.log("in here, body is: "+ body.lineupTime);

  if(body.lineupTime<=5){
    console.log("would send a message");
    admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  }
  else console.log("not updating body.");
}

module.exports = {checkToSendPushNotification};
