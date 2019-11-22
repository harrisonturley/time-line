const express = require("express");
const router = express.Router();
//const keyModule = require("../api_keys/apiKeys");
//const placesKey = keyModule.PLACES_KEY;
//const apiKey = keyModule.API_KEY;

//put these in here cuz want travis test to pass
const apiKey = "rw0fMRw0_c05_ankeAlpIBhpuejV80QfLKT8Ktx7Mywhj8gw1R8a8_sqmYYvt2HBvaXus2kB7xrwiWreoSXHtNqW0ASxeM4GVsWEfZKaYNI9JT7IrmGBa4owV8WoXXYx";
const placesKey = "AIzaSyBVDI23V1oCRqdGAsxU7ARKuXplmWhTDRM";

const request = require("request-promise");

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
    var options = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%2B" + 
        phone + "&inputtype=phonenumber&fields=place_id&key=" + placesKey;
  
    return request(options).then(function (searchResults) {
        var result = JSON.parse(searchResults);
        return result.candidates[0].place_id;
    }).catch((err) => {return "error with places id: "+ err;});
}

function startPythonProcess(id){

    return new Promise(function(success, nosuccess) {

        const spawn = require("child_process").spawn;

        const pythonProcess = spawn("python",
            //EDIT FULL PATH
            ["C:/Users/Mark/Desktop/time-line/API/popularTimes/popularTimes.py", placesKey, id]);
        pythonProcess.stdout.on("data", (returnVal) => {
            console.log("got here " + returnVal);
            success(returnVal);
        });
        pythonProcess.stderr.on("data", (data) => {
            //no popular time exists for this location
            success(null);
        });
});}

function getPopularTimes(id) {
    return new Promise(function(success, nosuccess){
        getGoogleIdInfo(id).then(function(info) {
            getGoogleId(info.phone).then(function (gid) {
                startPythonProcess(gid).then(function (fromRunpy) {
                    return success(fromRunpy);
                }).catch((err) => {return nosuccess(err);});
        }).catch((err) => {return nosuccess(err);});
        }).catch((err) => {return nosuccess(err);});
    });
}

module.exports = router;
module.exports = {getPopularTimes, getGoogleIdInfo, getGoogleId, startPythonProcess};