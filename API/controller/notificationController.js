
const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
var globalTopic = "globalTopic";

var message = {
  notification: {
    body: "test",
    title: "hello hello"
  },
  topic: globalTopic
};

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

module.admin = admin;

// subscribes users to a general topic
router.post("/notification/subscribe", function (req, res, next) {
    
  admin.messaging().subscribeToTopic(req.body.registrationToken, globalTopic)
  .then(function(response) {
  // See the MessagingTopicManagementResponse reference documentation
  // for the contents of response.
    console.log("Successfully subscribed to topic:", response);
    res.status(200).send();
  })
  .catch(function(error) {
    console.log("Error subscribing to topic:", error);
    res.status(422).send({error: error.message});
  });
});

// this endpoint is just to purely test sending a push notification without the sending logic
router.get("/notification/send", function (req, res, next) {

    admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
      res.status(200).send();
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.status(422).send({error: error.message});
    });
});

module.exports = router;
module.exports.admin = admin;

  
