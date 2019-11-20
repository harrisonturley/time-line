
const express = require("express");
const router = express.Router();
const notificationService = require("../service/notificationService");

router.post("/notification/subscribe", function (req, res, next) {
    
  notificationService.subscribe(req.body.registrationToken, req.body.restaurantId)
  .then(function(response) {
    console.log("Successfully subscribed to topic");
    res.status(200).send();
  })
  .catch(function(error) {
    console.log("Error subscribing to topic:"+ error);
    res.status(422).send({error: error.message});
  });
});

router.post("/notification/unsubscribe", function (req, res, next) {
    
  notificationService.unsubscribe(req.body.registrationToken, req.body.restaurantId)
  .then(function(response) {
    console.log("Successfully unsubscribed from topic");
    res.status(200).send();
  })
  .catch(function(error) {
    console.log("Error unsubscribing from topic:"+ error);
    res.status(422).send({error: error.message});
  });
});

module.exports = router;

  
