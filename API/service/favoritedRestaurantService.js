const FavoritedRestaurant = require("../repository/favoritedRestaurant");

async function getFavoritedRestaurants(restaurantIds){
    const favoritedRestaurants = await FavoritedRestaurant
        .find({id: {$in: restaurantIds}}, {_id: 0, __v: 0})
        .sort({timestamp: 'asc'});
    return {businesses: favoritedRestaurants, total: favoritedRestaurants.length};
}

function addFavoritedRestaurant(restaurant) {
    return FavoritedRestaurant.update(
        {id: restaurant.id},
        {$setOnInsert: restaurant},
        {upsert: true}
    );
}

function deleteFavoritedRestaurant(restaurantId) {
    return FavoritedRestaurant.findOneAndDelete(
        {id: restaurantId}
    );
}

module.exports = {getFavoritedRestaurants, addFavoritedRestaurant, deleteFavoritedRestaurant};
