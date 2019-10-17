const express = require('express');
const router = express.Router();
const userService = require('../service/userService');

router.get('/users/:email', function (req, res, next) {
    userService.getUserByEmail(req.params.email, res).then(function (user) {
        res.send(user);
    }).catch(next);
});

// is this the object id?
// do we need this if we have google auth?
// i dont think this needs to be a post?
router.get('/users/login/:_id', function (req, res, next) {
    userService.verifyLoginUserExists(req.params._id).then(function (user) {
        res.send(user);
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