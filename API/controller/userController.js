const express = require('express');
const router = express.Router();
const userService = require('../service/userService');

router.get('/users/:email', function (req, res, next) {
    userService.getUserByEmail(req, res).catch(next);
});

router.post('/users', function (req, res, next) {
    userService.addUser(req, res).catch(next);
});

router.put('/users/:email', function (req, res, next) {
    userService.updateUser(req, res).catch(next);
});

router.delete('/users/:email', function (req, res, next) {
    userService.deleteUser(req, res).catch(next);
});

module.exports = router;