const User = require('../repository/user');

function getUserByEmail(email) {
    return User.findOne({email: email});
}

function addUser(body) {
    return User.create(body);
}

function updateUser(email, body) {
    return User.findOneAndUpdate({email: email}, body);
}

function deleteUser(email) {
    return User.findOneAndRemove({email: email});
}

function verifyLoginUserExists(_id) {
    return User.exists({_id: _id});
}

module.exports = {getUserByEmail, addUser, updateUser, deleteUser, verifyLoginUserExists};
