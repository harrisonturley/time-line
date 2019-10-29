var firebaseAdmin = require("../controller/notificationController");
var admin = firebaseAdmin.admin;
const API_KEY = "rw0fMRw0_c05_ankeAlpIBhpuejV80QfLKT8Ktx7Mywhj8gw1R8a8_sqmYYvt2HBvaXus2kB7xrwiWreoSXHtNqW0ASxeM4GVsWEfZKaYNI9JT7IrmGBa4owV8WoXXYx";
const request = require("request-promise");

// everyone should already be subscribed to this topic
var globalTopic = "globalTopic";

// requires a valid yelp id
function getRestaurantsById(id) {
  const options = {
      uri: "https://api.yelp.com/v3/businesses/" + id,
      headers: {
          "Authorization": "Bearer " + API_KEY
      },
      json: true
  };
  
  return request(options).then(function (searchResults) {
      return searchResults.name;
  });
}

// requires a valid yelp restaurant id
function checkToSendPushNotification(body, id) {
  
  getRestaurantsById(id).then(function (name) {

    if(body.lineupTime <= 5){

      var message = {
        notification: {
          body: name + " has under a 5 minute wait time!",
          title: "Notification from Time Line"
        },
        topic: globalTopic
      };
      
      admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
    }
  }).catch((error) => {
    console.log("Not a valid restaurant ID, no notification sent", error);
  });
}

module.exports = {checkToSendPushNotification, getRestaurantsById};
