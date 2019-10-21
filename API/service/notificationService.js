var firebaseAdmin = require('../controller/notificationController');
var admin = firebaseAdmin.admin;
const keyModule = require('../api_keys/yelpApiKey');
const API_KEY = keyModule.API_KEY;
const request = require('request-promise');

// everyone should already be subscribed to this topic
var topic = 'globalTopic';

// please note that this will throw an error
// if it is not given a valid yelp restaurant id
function checkToSendPushNotification(body, id) {
  
  getRestaurantsById(id).then(function (name) {

    if(body.lineupTime <= 5){

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
    else{
      console.log('No need for push notification.');
    }
  }).catch((error) => {
    console.log('Not a valid restaurant ID, no notification sent');
  });
};

// this also requires a valid yelp id
function getRestaurantsById(id) {
  const options = {
      uri: 'https://api.yelp.com/v3/businesses/' + id,
      headers: {
          'Authorization': 'Bearer ' + API_KEY
      },
      json: true
  };
  
  return request(options).then(function (searchResults) {
      return searchResults.name;
  });
}

module.exports = {checkToSendPushNotification, getRestaurantsById};
