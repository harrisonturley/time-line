const User = require("../../repository/user");
const utils = require("../../util/collections");

function getUserFavorites(email) {
    return User.findOne({email}, {_id: 0, favorites: 1}).lean();
}

function addUserFavorite(email, favorite) {
    return getUserFavorites(email).then(
        function (favorites) {
            favorites.favorites.push(favorite);
            return updateUserFavorites(email, favorites);
        }
    );
}

function deleteUserFavorite(email, favorite) {
    return getUserFavorites(email).then(
        function (favorites) {
            utils.removeFromArray(favorites.favorites, favorite);
            return updateUserFavorites(email, favorites);
        }
    );
}

function updateUserFavorites(email, favorites) {
    const update = {$set: favorites};
    return User.findOneAndUpdate({email}, update, {
        projection: {_id: 0, favorites: 1}, new: true
    }).lean();
}

module.exports = {getUserFavorites, addUserFavorite, deleteUserFavorite};
