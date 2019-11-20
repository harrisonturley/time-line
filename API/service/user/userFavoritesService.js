const User = require("../../repository/user");
const utils = require("../../util/collections");
const favoritedRestaurantService = require("../favoritedRestaurantService");
const notificationService = require("../../service/notificationService");

function getUserFavorites(email) {
    return User.findOne({email}, {_id: 0, favorites: 1}).lean();
}

async function addUserFavorite(email, restaurant, registrationToken) {
    notificationService.subscribe(registrationToken, restaurant.id);
    const favorites = await getUserFavorites(email);
    favorites.favorites.push(restaurant.id);
    await favoritedRestaurantService.addFavoritedRestaurant(restaurant);
    return updateUserFavorites(email, favorites);
}

async function deleteUserFavorite(email, restaurantId) {
    notificationService.unsubscribe(registrationToken, restaurantId);
    const favorites = await getUserFavorites(email);
    utils.removeFromArray(favorites.favorites, restaurantId);
    // await favoritedRestaurantService.deleteFavoritedRestaurant(restaurantId);
    return updateUserFavorites(email, favorites);
}

// private
function updateUserFavorites(email, favorites) {
    const update = {$set: favorites};
    return User.findOneAndUpdate({email}, update, {
        projection: {_id: 0, favorites: 1}, new: true
    }).lean();
}

module.exports = {getUserFavorites, addUserFavorite, deleteUserFavorite};
