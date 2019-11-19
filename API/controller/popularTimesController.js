const express = require("express");
const router = express.Router();
const keyModule = require("../api_keys/apiKeys");
const placesKey = keyModule.PLACES_KEY;


router.get("/populartimes/:id", function (req, res, next) {

    /*const id = req.params.id;
    console.log("the id is: " + id);
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn('python',["popularTimes.py", "ChIJSYuuSx9awokRyrrOFTGg0GY"]);
    pythonProcess.stdout.on('data', (data) => {
        console.log("in node js function, data is: "+ data.toString());
        res.send(data);
    }).catch(next);*/


    const id = req.params.id;

    startPythonProcess(id).then(function(fromRunpy) {
        console.log(fromRunpy.toString());
        res.send(fromRunpy);
    }).catch(next);

});

function startPythonProcess(id){

    return new Promise(function(success, nosuccess) {

        console.log("in runpy");
        const spawn = require("child_process").spawn;
        //const pythonProcess = spawn('python',["./popularTimes.py", "ChIJSYuuSx9awokRyrrOFTGg0GY"]);
        //hmm seems to need full path
        const pythonProcess = spawn("python",["C:/Users/victo/Documents/year3/CPEN321/time-line repo/time-line/API/popularTimes/popularTimes.py", placesKey, "ChIJSYuuSx9awokRyrrOFTGg0GY"]);
        pythonProcess.stdout.on("data", (data) => {
            console.log("in node js function, data is: "+ data.toString());
            success("success: " + data);
        });
        pythonProcess.stderr.on("data", (data) => {
            console.log("error: "+ data.toString());
            nosuccess(data);
        });
})};

module.exports = router;