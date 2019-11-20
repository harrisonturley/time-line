const express = require("express");
const router = express.Router();
// const keyModule = require("../api_keys/apiKeys");
// const placesKey = keyModule.PLACES_KEY;
// const apiKey = keyModule.API_KEY;
const apiKey = "rw0fMRw0_c05_ankeAlpIBhpuejV80QfLKT8Ktx7Mywhj8gw1R8a8_sqmYYvt2HBvaXus2kB7xrwiWreoSXHtNqW0ASxeM4GVsWEfZKaYNI9JT7IrmGBa4owV8WoXXYx"
const placesKey = "AIzaSyBVDI23V1oCRqdGAsxU7ARKuXplmWhTDRM"

const request = require("request-promise");

function getPopularTimes(id) {
    return new Promise(function(success, nosuccess){

        getGoogleIdInfo(id).then(function(info) {
            getGoogleId(info.phone).then(function (gid) {
                startPythonProcess(gid).then(function (fromRunpy) {
                    return success(fromRunpy);
                }).catch(err => {return nosuccess(err)});
        }).catch(err => {return nosuccess(err)});
        }).catch(err => {return nosuccess(err)});
    });
}

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
    //console.log(phone)
    var options = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%2B" + 
        phone + "&inputtype=phonenumber&fields=place_id&key=" + placesKey
  
    return request(options).then(function (searchResults) {
        var result = JSON.parse(searchResults)
        return result.candidates[0].place_id;
    }).catch(err => console.log ("error with places id: "+ err));
}

function startPythonProcess(id){

    return new Promise(function(success, nosuccess) {

        const spawn = require("child_process").spawn;

        //hmm seems to need full path..this will have to change on VM
        const pythonProcess = spawn("python",
            ["C:/Users/victo/Documents/year3/CPEN321/time-line repo/time-line/API/popularTimes/popularTimes.py", placesKey, id]);
        pythonProcess.stdout.on("data", (returnVal) => {
            //find date and extract stuff here
            //populartimes for each day is an array of length 24
            //starting from hour 0 to 23 in minutes
            //so this is already the populartimes

            // var result = JSON.parse(data)
            // console.log(data);
            // console.log(data.name.Monday)
            // console.log(result.name.Monday)
            success("wait time is: " + returnVal);
        });
        pythonProcess.stderr.on("data", (data) => {
            //no popular time exists for this location, just return 0
            success("no data exists");
        });
})};

module.exports = router;
module.exports = {getPopularTimes};