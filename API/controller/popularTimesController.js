const express = require("express");
const router = express.Router();
const keyModule = require("../api_keys/apiKeys");
const placesKey = keyModule.PLACES_KEY;
const apiKey = keyModule.API_KEY;
const request = require("request-promise");

//todo: translate yelp id into google id
//todo: error handling for whole thing
router.get("/populartimes/:id", function (req, res, next) {

    const id = req.params.id;
    //gonna need to know how to translate yelp id 
    startPythonProcess(id).then(function(fromRunpy) {
        console.log(fromRunpy.toString());
        res.send(fromRunpy);
    }).catch(next);

});

//todo: translate yelp id into google id
router.get("/googleidfromyelpid/:id", function (req, res, next) {

    const id = req.params.id;
    getGoogleIdInfo(id).then(function(info) {
        getGoogleId(info.phone).then(function (id) {
        res.send(id);
    });
    }).catch(next);

});

function getGoogleIdInfo(yelpId) {
    const options = {
        uri: "https://api.yelp.com/v3/businesses/" + yelpId,
        headers: {
            "Authorization": "Bearer " + apiKey
        },
        json: true
    };
  
    return request(options).then(function (searchResults) {
        return {phone: searchResults.phone};
    });
  }

function getGoogleId(phone) {
    console.log("phone is :" + phone)

    var options = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%2B" + 
        phone + "&inputtype=phonenumber&fields=place_id&key=" + placesKey
  
    return request(options).then(function (searchResults) {
        //return {placeid: searchResults.candidates.place_id};
        return searchResults;
    }).catch(err => console.log ("error with places id: "+ err));
}

function startPythonProcess(id){

    return new Promise(function(success, nosuccess) {

        const spawn = require("child_process").spawn;
        //const pythonProcess = spawn('python',["./popularTimes.py", "ChIJSYuuSx9awokRyrrOFTGg0GY"]);
        //hmm seems to need full path
        const pythonProcess = spawn("python",
            ["C:/Users/victo/Documents/year3/CPEN321/time-line repo/time-line/API/popularTimes/popularTimes.py", placesKey, id]);
        pythonProcess.stdout.on("data", (data) => {
            console.log("")
            console.log("")
            console.log("")
            console.log("in node js function, data is: "+ data);
            success("success");
        });
        pythonProcess.stderr.on("data", (data) => {
            console.log("error: "+ data.toString());
            nosuccess("error");
        });
})};

module.exports = router;

//populartimes for each day is an array of length 24
//starting from hour 0 to 23 in minutes