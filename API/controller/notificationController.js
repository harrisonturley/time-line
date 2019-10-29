
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
    res.status(200).send();
  })
  .catch(function(error) {
    res.status(422).send({error});
  });
});

// this endpoint is just to purely test sending a push notification without the sending logic
router.get("/notification/send", function (req, res, next) {

    admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      res.status(200).send();
    })
    .catch((error) => {
      res.status(422).send({error});
    });
});

module.exports = router;
module.exports.admin = admin;

  
