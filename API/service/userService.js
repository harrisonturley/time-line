const User = require("../repository/user");

function getUserByEmail(email) {
    return User.findOne({email});
}

function addUser(body) {
    return User.create(body);
}

function updateUser(email, body) {
    return User.findOneAndUpdate({email}, body);
}

function deleteUser(email) {
    return User.findOneAndRemove({email});
}

module.exports = {getUserByEmail, addUser, updateUser, deleteUser};
