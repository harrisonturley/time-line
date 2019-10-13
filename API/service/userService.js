const User = require('../models/user');

function getUserByEmail(req, res) {
    return User.findOne({email: req.params.email}).then(function (user) {
        res.send(user);
    });
}

function addUser(req, res) {
    return User.create(req.body).then(function (user) {
        res.send(user);
    });
}

function updateUser(req, res) {
    return User.findOneAndUpdate({email: req.params.email}, req.body).then(function () {
        User.findOne({email: req.params.email}).then(function (user) {
            res.send(user);
        });
    });
}

function deleteUser(req, res) {
    return User.findOneAndRemove({email: req.params.email}).then(function (user) {
        res.send(user);
    });
}

module.exports = {getUserByEmail, addUser, updateUser, deleteUser};