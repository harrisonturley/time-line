var firebaseAdmin = require('./notificationController');
var admin = firebaseAdmin.admin;
const searchService = require('../service/searchService');

// everyone should already be subscribed to this topic
var topic = 'globalTopic';

function checkToSendPushNotification(body, id) {
  
  searchService.getRestaurantsById(id).then(function (name) {

    if(body.lineupTime<=5){

      var message = {
        notification: {
          body: name + ' has under a 5 minute wait time!',
          title: 'Notification from Time Line'
        },
        topic: topic
      };
      
      admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });

    }
  });
};

module.exports = {checkToSendPushNotification};
