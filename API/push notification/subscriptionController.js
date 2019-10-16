
const express = require('express');
const router = express.Router();
const searchService = require('../service/searchService');

router.get('/search/restaurants', function (req, res, next) {
    searchService.getRestaurantsByKeywordAndCoordinates(
        req.query.keyword, {latitude: req.query.latitude, longitude: req.query.longitude}
    ).then(function (searchResults) {
        res.send(searchResults);
    }).catch(next);
});

module.exports = router;



// ok so basically api endpoint can be hit by front end providing
// registration tokens to add to topic
// store this list in database?
// or dont even need to store list on db, just subscribe as soon as
// api is hit. then pushnotification doesnt need to obtain a list.
var registrationTokens = [
    'YOUR_REGISTRATION_TOKEN_1',
    // ...
    'YOUR_REGISTRATION_TOKEN_n'
  ];
  
// Subscribe the devices corresponding to the registration tokens to the
// topic.
admin.messaging().subscribeToTopic(registrationTokens, topic)
    .then(function(response) {
    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
      console.log('Successfully subscribed to topic:', response);
    })
    .catch(function(error) {
      console.log('Error subscribing to topic:', error);
    });