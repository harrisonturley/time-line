
const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
var globalTopic = "globalTopic";

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
    console.log("Successfully subscribed to topic:");
    res.status(200).send();
  })
  .catch(function(error) {
    console.log("Error subscribing to topic:");
    res.status(422).send({error: error.message});
  });
});

module.exports = router;
module.exports.admin = admin;

  
