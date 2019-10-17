const request = require('request-promise');
//const keyModule = require('../api_keys/yelpApiKey');
//const API_KEY = keyModule.API_KEY;
const API_KEY = '';
const lineupService = require('../service/lineupService');

function getRestaurantsByKeywordAndCoordinates(keyword, coordinates) {
    const options = {
        uri: 'https://api.yelp.com/v3/businesses/search',
        headers: {
            'Authorization': 'Bearer ' + API_KEY
        },
        qs: {
            term: keyword,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            limit: 20
        },
        json: true
    };

    return request(options).then(addLineupTimes);
}

function getRestaurantsById(id) {
    console.log("in here hello");
    const options = {
        uri: 'https://api.yelp.com/v3/businesses/' + id,
        headers: {
            'Authorization': 'Bearer ' + API_KEY
        },
        json: true
    };
    // find out how to extract name from here
    return request(options).then(function (searchResults) {
        console.log(searchResults.name);
        return searchResults.name;
    });
}

/**
 * @param searchResults {{businesses:{lineupTime:Number}}}
 **/
function addLineupTimes(searchResults) {
    let businessIds = [];
    let lineupTimes = [];

    let i = 0;
    searchResults.businesses.forEach(function (business) {
        businessIds.push(business.id);
        lineupTimes[i] = null;
        i++;
    });

    return lineupService.getLineupsByIds(businessIds).then(function (lineups) {
        i = 0;
        if (lineups != null) {
            lineups.forEach(function (lineup) {
                // will be null if there is no lineup time yet for the business
                if (lineup != null) {
                    lineupTimes[i] = lineup.lineupTime;
                }
                i++;
            });
        }

        i = 0;
        searchResults.businesses.forEach(function (business) {
            business.lineupTime = lineupTimes[i];
            i++;
        });

        console.log(searchResults);
        return searchResults;
    });
}

module.exports = {getRestaurantsByKeywordAndCoordinates, getRestaurantsById};
