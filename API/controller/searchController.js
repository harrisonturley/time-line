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
