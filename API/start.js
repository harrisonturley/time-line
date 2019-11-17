const server = require('./server.js');
server.listen(process.env.PORT || 4000, function () {
    console.log("API is up");
});
