const express = require('express');
const router = express.Router();
const userService = require('../service/userService');

router.get('/users/:email', function (req, res, next) {
    userService.getUserByEmail(req.params.email, res).then(function (user) {
        res.send(user);
    }).catch(next);
});

// still sketchy cuz not tested, need to test with front end
// how tf is this supposed to work... google docs r weird
// how do i get the token from the post request

//right now all this does is return yes or no based if the user exists
// so then front end can take that, and then call add new user if need be
router.post('/users/tokensignin', function (req, res, next) {
    // check how to parse body
    //what do we want to return
    authenticatorService.verifyId(req.body.idToken).then(function (userid) {
        userService.verifyLoginUserExists(userid).then(function (user){
            res.send(user);
        });
    }).catch(next);
});

router.post('/users', function (req, res, next) {
    userService.addUser(req.body).then(function (user) {
        res.send(user);
    }).catch(next);
});

router.put('/users/:email', function (req, res, next) {
    userService.updateUser(req.params.email, req.body).then(function () {
        //  need to return the UPDATED user, not the found one
        userService.getUserByEmail(req.params.email).then(function(updatedUser){
            res.send(updatedUser);
        });
    }).catch(next);
});

router.delete('/users/:email', function (req, res, next) {
    userService.deleteUser(req.params.email).then(function (user) {
        res.send(user);
    }).catch(next);
});

module.exports = router;