
const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
//var globalTopic = "globalTopic";
var userService = require("../service/userService")

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

module.admin = admin;

//subscribes users to a restaurant from restaurant id 
//need: restaurant id for topic, and, registrationToken
router.post("/notification/subscribe", function (req, res, next) {
    
  admin.messaging().subscribeToTopic(req.body.registrationToken, req.body.restaurantId)
  .then(function(response) {
    console.log(req.body.restaurantId)
    //userService.updateUser(req.body.email, { $push: { favoriteRestaurants: req.body.restaurantId} });
    //userService.updateUser(req.body.email, { name: "Bob" });
    console.log("Successfully subscribed to topic:");
    res.status(200).send();
  })
  .catch(function(error) {
    console.log("Error subscribing to topic:"+ error);
    res.status(422).send({error: error.message});
  });
});

router.post("/notification/unsubscribe", function (req, res, next) {
    
  admin.messaging().unsubscribeFromTopic(req.body.registrationToken, req.body.restaurantId)
  .then(function(response) {
    console.log("Successfully subscribed to topic:");
    //userService.updateUser(req.body.email, { $pull: { favoriteRestaurants: req.body.restaurantId} })
    res.status(200).send();
  })
  .catch(function(error) {
    console.log("Error subscribing to topic:");
    res.status(422).send({error: error.message});
  });
});


//get all favorited
//given user id, returns list

module.exports = router;
module.exports.admin = admin;

  
