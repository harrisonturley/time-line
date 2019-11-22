//var firebaseAdmin = require("../controller/notificationController");
//var admin = firebaseAdmin.admin;
const API_KEY = "rw0fMRw0_c05_ankeAlpIBhpuejV80QfLKT8Ktx7Mywhj8gw1R8a8_sqmYYvt2HBvaXus2kB7xrwiWreoSXHtNqW0ASxeM4GVsWEfZKaYNI9JT7IrmGBa4owV8WoXXYx";
const request = require("request-promise");
var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

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
async function sendPushNotification(id) {
    const restaurantName = await getRestaurantsById(id);
    const message = {
        notification: {
            body: restaurantName + " has under a 5 minute wait time!",
            title: "Notification from Time Line"
        },
        //CHANGED
        topic: id
    };

    await admin.messaging().send(message);
}

function subscribe(token, restaurantId) {

    return new Promise(function (success, nosuccess) {
        admin.messaging().subscribeToTopic(token, restaurantId)
            .then(() => {
                success();
            })
            .catch(() => {
                nosuccess();
            });
    });
}

function unsubscribe(token, restaurantId) {

    return new Promise(function (success, nosuccess) {

        admin.messaging().unsubscribeFromTopic(token, restaurantId)
            .then(() => {
                success();
            })
            .catch(() => {
                nosuccess();
            });
    });
}

module.exports = {sendPushNotification, getRestaurantsById, subscribe, unsubscribe};
